import React, { ReactElement } from 'react';
import { LnmPlayerState, LnmResult } from '../frameInterpreter/types';
import '../css/FrameInterpreter.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store.ts';
import VisualNovelScreen from '../frameInterpreter/VisualNovelScreen.tsx';
import CreatedWaitScreen from '../frameInterpreter/CreatedWaitScreen.tsx';
import ResultsWaitScreen from '../frameInterpreter/ResultsWaitScreen.tsx';
import ResultsScreen from '../frameInterpreter/ResultsScreen.tsx';
import { useNavigate } from 'react-router-dom';
import { resetState } from '../state/gameStateSlice.ts';

const GamePage: React.FC = () => {
	const { playerState, protagonist } = useSelector(
		(state: RootState) => state.gameState
	);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// TODO: Listen to server state updates only in certain states
	// const canListenToStateUpdate = (state: LnmPlayerState) => {
	// 	return [
	// 		LnmPlayerState.CREATED,
	// 		LnmPlayerState.WAITING_LOST,
	// 		LnmPlayerState.WAITING_WON,
	// 	].includes(state);
	// };

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
				result={LnmResult.SINGLE_BAD}
				score={12300}
				highScore={12345}
				onQuitToMain={quitToMain}
			/>,
			// In reality, the server will return all this. Should I add these things to Redux instead?
		],
		[
			LnmPlayerState.COMPLETED_WON,
			<ResultsScreen
				result={LnmResult.SINGLE_GOOD}
				score={12300}
				onQuitToMain={quitToMain}
			/>,
			// In reality, the server will return all this. Should I add these things to Redux?
		],
		[
			LnmPlayerState.SEEN_RESULTS,
			<ResultsScreen
				result={LnmResult.SINGLE_GOOD}
				score={1234}
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
