import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LnmResult } from '../frameInterpreter/types';

// Define the shape of the final result state
export interface GameFinalResultState {
	result: LnmResult | null;
	partnerName: string | null;
	score: number;
	highScore: number | null;
}

// Define the initial state
const initialState: GameFinalResultState = {
	result: null,
	partnerName: null,
	score: 0,
	highScore: null,
};

// Create the slice
const gameFinalResultSlice = createSlice({
	name: 'gameFinalResult',
	initialState,
	reducers: {
		setResult(state, action: PayloadAction<LnmResult>) {
			state.result = action.payload;
		},
		setPartnerName(state, action: PayloadAction<string | null>) {
			state.partnerName = action.payload;
		},
		setScore(state, action: PayloadAction<number>) {
			state.score = action.payload;
		},
		setHighScore(state, action: PayloadAction<number | null>) {
			state.highScore = action.payload;
		},
		resetFinalResultState(state) {
			Object.assign(state, initialState);
		},
	},
});

// Export actions and reducer
export const {
	setResult,
	setPartnerName,
	setScore,
	setHighScore,
	resetFinalResultState,
} = gameFinalResultSlice.actions;

export default gameFinalResultSlice.reducer;
