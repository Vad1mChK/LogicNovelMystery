import { configureStore } from '@reduxjs/toolkit';
import gameStateReducer, { GameState } from './gameStateSlice.ts';
import languageReducer, { LanguageState } from './languageSlice.ts';

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
