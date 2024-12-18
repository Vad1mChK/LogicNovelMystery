import { configureStore } from '@reduxjs/toolkit';
import gameStateReducer, {
	GameState,
} from './frameInterpreter/gameStore/gameStateSlice';

const store = configureStore({
	reducer: {
		gameState: gameStateReducer,
	},
});

export type RootState = {
	gameState: GameState;
};
export type AppDispatch = typeof store.dispatch;

export default store;
