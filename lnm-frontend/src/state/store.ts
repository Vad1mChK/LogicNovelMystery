import { configureStore } from '@reduxjs/toolkit';
import gameStateReducer, { GameState } from './gameStateSlice';
import languageReducer, { LanguageState } from './languageSlice';

const store = configureStore({
	reducer: {
		gameState: gameStateReducer,
		languageState: languageReducer,
	},
});

export type RootState = {
	gameState: GameState;
	languageState: LanguageState;
};
export type AppDispatch = typeof store.dispatch;

export default store;
