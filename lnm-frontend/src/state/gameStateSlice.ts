import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of your game state
export interface GameState {
	health: number;
	currentChapterId: string;
	currentFrameId: string;
	errorSum: number;
	errorCount: number;
}

// Define the initial state
const initialState: GameState = {
	health: 100,
	currentChapterId: 'start',
	currentFrameId: 'frame1',
	errorSum: 0,
	errorCount: 0,
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
		// Error management reducers
		incrementErrorSum(state, action: PayloadAction<number>) {
			state.errorSum += action.payload;
		},
		clearErrorSum(state) {
			state.errorSum = 0;
		},
		incrementErrorCount(state, action: PayloadAction<number>) {
			state.errorCount += action.payload;
		},
		clearErrorCount(state) {
			state.errorCount = 0;
		},
	},
});

// Export actions and reducer
export const {
	increaseHealth,
	decreaseHealth,
	setCurrentChapter,
	setCurrentFrame,
	incrementErrorSum,
	clearErrorSum,
	incrementErrorCount,
	clearErrorCount,
} = gameStateSlice.actions;

export default gameStateSlice.reducer;
