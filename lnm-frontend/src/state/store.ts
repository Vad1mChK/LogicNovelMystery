import { configureStore } from '@reduxjs/toolkit';
import gameStateReducer, { GameState } from './gameStateSlice';
import languageReducer, { LanguageState } from './languageSlice';
import musicReducer, { MusicState } from './musicSlice';
import gameFinalResultReducer, {
	GameFinalResultState,
} from './gameFinalResultSlice';

// Middleware to persist state changes to localStorage
const saveGameStateToLocalStorage = (state: GameState) => {
	try {
		localStorage.setItem('gameState', JSON.stringify(state));
	} catch (error) {
		console.error('Failed to save game state to localStorage:', error);
	}
};

const saveMusicStateToLocalStorage = (state: MusicState) => {
	try {
		localStorage.setItem(
			'musicState',
			JSON.stringify({
				volume: state.volume,
				panning: state.panning,
			})
		);
	} catch (error) {
		console.error('Failed to save music state to localStorage:', error);
	}
};

const persistenceMiddleware =
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(storeAPI: any) => (next: any) => (action: any) => {
		const result = next(action); // Pass the action to the reducer
		const state = storeAPI.getState(); // Get the updated state
		saveGameStateToLocalStorage(state.gameState); // Persist the gameState to localStorage
		saveMusicStateToLocalStorage(state.musicState); // Persist the musicState to localStorage
		return result;
	};

const store = configureStore({
	reducer: {
		gameState: gameStateReducer,
		languageState: languageReducer,
		musicState: musicReducer,
		gameFinalResultState: gameFinalResultReducer, // Add the gameFinalResult slice to the store,
		// and include it in the middleware to persist changes to localStorage.
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(persistenceMiddleware),
});

export type RootState = {
	gameState: GameState;
	languageState: LanguageState;
	musicState: MusicState;
	gameFinalResultState: GameFinalResultState; // Add the gameFinalResult type to the RootState.
};
export type AppDispatch = typeof store.dispatch;

export default store;
