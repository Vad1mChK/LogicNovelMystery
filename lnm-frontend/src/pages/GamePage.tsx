import React, { ReactElement, useEffect } from 'react';
import { LnmHero, LnmPlayerState, LnmResult } from '../frameInterpreter/types';
import '../css/FrameInterpreter.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import VisualNovelScreen from '../frameInterpreter/VisualNovelScreen';
import CreatedWaitScreen from '../frameInterpreter/CreatedWaitScreen';
import ResultsWaitScreen from '../frameInterpreter/ResultsWaitScreen';
import ResultsScreen from '../frameInterpreter/ResultsScreen';
import { useNavigate } from 'react-router-dom';
import { resetState, setPlayerState } from '../state/gameStateSlice';
import {
	startShortPolling,
	stopShortPolling,
} from '../frameInterpreter/communication/statePolling';
import axios from 'axios';
import { VITE_SERVER_URL } from '../metaEnv.ts';

const GamePage: React.FC = () => {
	const { playerState, protagonist } = useSelector(
		(state: RootState) => state.gameState
	);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Retrieve sessionId (could be stored in localStorage or Redux)
	const sessionToken = localStorage.getItem('sessionToken');

	const {
		result: finalResult,
		score,
		highScore,
		partnerName,
	} = useSelector((state: RootState) => state.gameFinalResultState);

	// Handle short polling lifecycle
	useEffect(() => {
		let cleanup: (() => void) | undefined;

		if (sessionToken) {
			console.log('Starting short polling...');
			startShortPolling(
				sessionToken,
				/* isMultiplayer: */ protagonist !== LnmHero.STEVE,
				playerState,
				dispatch
			);

			// Define the cleanup function
			cleanup = () => {
				console.log('Stopping short polling...');
				stopShortPolling();
			};
		} else {
			console.error('No sessionId found in localStorage');
			// No cleanup needed if polling wasn't started
		}

		// Always return the cleanup function or undefined
		return cleanup;
	}, [sessionToken, playerState, dispatch]);

	useEffect(() => {
		if (
			[
				LnmPlayerState.COMPLETED_WON,
				LnmPlayerState.COMPLETED_LOST,
			].includes(playerState)
		) {
			axios
				.post(
					`${VITE_SERVER_URL}/game/seen-results`,
					{
						sessionToken: localStorage.getItem('sessionToken'),
						isMultiplayer: protagonist != LnmHero.STEVE,
					},
					{
						headers: {
							Authorization: localStorage.getItem('AuthToken'),
						},
					}
				)
				.then(() => {
					dispatch(setPlayerState(LnmPlayerState.SEEN_RESULTS));
				})
				.catch((err) => {
					console.error(
						'Error reporting that the player has seen results:',
						err
					);
				});
		}
	}, [playerState]);

	const quitToMain = (clearState: boolean = false) => {
		if (clearState) {
			dispatch(resetState());
			localStorage.removeItem('SessionToken');
		}
		navigate('/main');
	};

	const stateToComponent: Map<LnmPlayerState, ReactElement> = new Map([
		[
			LnmPlayerState.CREATED,
			<CreatedWaitScreen
				protagonist={protagonist}
				onQuitToMain={quitToMain}
			/>,
		],
		[
			LnmPlayerState.PLAYING,
			<VisualNovelScreen protagonist={protagonist} />,
			// Formerly, GamePage contained just what VisualNovelScreen now contains
		],
		[
			LnmPlayerState.WAITING_LOST,
			<ResultsWaitScreen winner={false} onQuitToMain={quitToMain} />,
		],
		[
			LnmPlayerState.WAITING_WON,
			<ResultsWaitScreen winner={true} onQuitToMain={quitToMain} />,
		],
		[
			LnmPlayerState.COMPLETED_LOST,
			<ResultsScreen
				result={finalResult || LnmResult.SINGLE_BAD}
				score={score || 0}
				highScore={highScore ?? undefined}
				partnerName={partnerName ?? undefined}
				onQuitToMain={quitToMain}
			/>,
			// In reality, the server will return all this. Should I add these things to Redux instead?
		],
		[
			LnmPlayerState.COMPLETED_WON,
			<ResultsScreen
				result={finalResult || LnmResult.SINGLE_BAD}
				score={score || 0}
				highScore={highScore ?? undefined}
				partnerName={partnerName ?? undefined}
				onQuitToMain={quitToMain}
			/>,
			// In reality, the server will return all this. Should I add these things to Redux?
		],
		[
			LnmPlayerState.SEEN_RESULTS,
			<ResultsScreen
				result={finalResult || LnmResult.SINGLE_BAD}
				score={score || 0}
				highScore={highScore ?? undefined}
				partnerName={partnerName ?? undefined}
				onQuitToMain={() => quitToMain(true)}
			/>,
		],
	]);

	return (
		stateToComponent.get(playerState) || (
			<div>Illegal state: {playerState}</div>
		)
	);
};

export default GamePage;
