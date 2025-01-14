import React, { ReactElement, useEffect } from 'react';
import { LnmPlayerState, LnmResult } from '../frameInterpreter/types';
import '../css/FrameInterpreter.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import VisualNovelScreen from '../frameInterpreter/VisualNovelScreen';
import CreatedWaitScreen from '../frameInterpreter/CreatedWaitScreen';
import ResultsWaitScreen from '../frameInterpreter/ResultsWaitScreen';
import ResultsScreen from '../frameInterpreter/ResultsScreen';
import { useNavigate } from 'react-router-dom';
import { resetState } from '../state/gameStateSlice';
import {
	startShortPolling,
	stopShortPolling,
} from '../frameInterpreter/communication/statePolling';

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
		if (!sessionToken) {
			console.error('No sessionToken found in localStorage');
			return; // Exit the effect early if no sessionToken
		}

		console.log('Starting short polling...');
		startShortPolling(sessionToken, playerState, dispatch);

		// Return the cleanup function
		return () => {
			console.log('Stopping short polling...');
			stopShortPolling();
		};
	}, [sessionToken, playerState, dispatch]);

	const quitToMain = (clearState: boolean = false) => {
		if (clearState) {
			dispatch(resetState());
			// TODO Maybe some more complex logic to remove the state?
		}
		navigate('/main');
	};

	const stateToComponent: Map<LnmPlayerState, ReactElement> = new Map([
		[
			LnmPlayerState.CREATED,
			<CreatedWaitScreen protagonist={protagonist} />,
		],
		[
			LnmPlayerState.PLAYING,
			<VisualNovelScreen protagonist={protagonist} />,
			// Formerly, GamePage contained just what VisualNovelScreen now contains
		],
		[LnmPlayerState.WAITING_LOST, <ResultsWaitScreen winner={false} />],
		[LnmPlayerState.WAITING_WON, <ResultsWaitScreen winner={true} />],
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
