import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of your game state
interface GameState {
	health: number;
	knowledge: string[]; // Example: List of known facts
	currentChapterId: string;
	currentFrameId: string;
}

// Define the initial state
const initialState: GameState = {
	health: 100,
	knowledge: [],
	currentChapterId: 'start',
	currentFrameId: 'frame1',
};

// Create the slice
const gameStateSlice = createSlice({
	name: 'gameState',
	initialState,
	reducers: {
		setHealth(
			state,
			action: PayloadAction<number | ((current: number) => number)>
		) {
			if (typeof action.payload === 'function') {
				state.health = action.payload(state.health);
			} else {
				state.health = Math.max(0, Math.min(action.payload, 100)); // Clamp health between 0 and 100
			}
		},
		addKnowledge(state, action: PayloadAction<string>) {
			state.knowledge.push(action.payload);
		},
		clearKnowledge(state) {
			state.knowledge = [];
		},
		setKnowledge(state, action: PayloadAction<string[]>) {
			state.knowledge = [...action.payload];
		},
		setCurrentChapter(state, action: PayloadAction<string>) {
			state.currentChapterId = action.payload;
		},
		setCurrentFrame(state, action: PayloadAction<string>) {
			state.currentFrameId = action.payload;
		},
	},
});

// Export actions and reducer
export const {
	setHealth,
	addKnowledge,
	clearKnowledge,
	setKnowledge,
	setCurrentChapter,
	setCurrentFrame,
} = gameStateSlice.actions;

export default gameStateSlice.reducer;
