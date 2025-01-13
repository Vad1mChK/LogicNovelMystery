import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LnmPlayerState } from '../frameInterpreter/types';

// Define the shape of your game state
export interface GameState {
	health: number;
	currentChapterId: string;
	currentFrameId: string;
	protagonist: string;
	playerState: LnmPlayerState;
}

// Define the initial state
const initialState: GameState = {
	health: 100,
	currentChapterId: 'start',
	currentFrameId: 'frame1',
	protagonist: 'steve',
	playerState: LnmPlayerState.CREATED,
};

const loadGameState = (): GameState => {
	try {
		const storedState = localStorage.getItem('gameState');
		if (storedState) {
			return JSON.parse(storedState);
		}
		return initialState; // No state found in localStorage
	} catch (error) {
		console.error('Failed to load game state from localStorage:', error);
		return initialState;
	}
};

// Create the slice
const gameStateSlice = createSlice({
	name: 'gameState',
	initialState: loadGameState() as GameState,
	reducers: {
		increaseHealth(state, action: PayloadAction<number | 'full'>) {
			if (action.payload === 'full') {
				state.health = 100;
			} else {
				state.health = Math.min(100, state.health + action.payload);
			}
		},
		decreaseHealth(state, action: PayloadAction<number | 'kill'>) {
			if (action.payload === 'kill') {
				state.health = 0;
			} else {
				state.health = Math.max(0, state.health - action.payload);
			}
		},
		setCurrentChapter(state, action: PayloadAction<string>) {
			state.currentChapterId = action.payload;
		},
		setCurrentFrame(state, action: PayloadAction<string>) {
			state.currentFrameId = action.payload;
		},
		setProtagonist(state, action: PayloadAction<string>) {
			state.protagonist = action.payload;
		},
		setPlayerState(state, action: PayloadAction<LnmPlayerState>) {
			state.playerState = action.payload;
		},
	},
});

// Export actions and reducer
export const {
	increaseHealth,
	decreaseHealth,
	setCurrentChapter,
	setCurrentFrame,
	setProtagonist,
	setPlayerState,
} = gameStateSlice.actions;

export default gameStateSlice.reducer;
