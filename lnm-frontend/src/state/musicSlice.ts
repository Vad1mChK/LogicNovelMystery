// src/state/musicSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of your music state
export interface MusicState {
	currentTrack: string | null; // URL or identifier of the current track
	volume: number; // Volume level from 0 to 100
}

// Define the initial state
const initialState: MusicState = {
	currentTrack: null, // No track selected initially
	volume: 100, // Default volume set to 100%
};

// Function to load music state from localStorage
const loadMusicState = (): MusicState => {
	try {
		const storedState = localStorage.getItem('musicState');
		if (storedState) {
			return JSON.parse(storedState) as MusicState;
		}
		return initialState; // Return initial state if nothing is stored
	} catch (error) {
		console.error('Failed to load music state from localStorage:', error);
		return initialState;
	}
};

// src/state/musicSlice.ts (continued)

// Create the slice
const musicSlice = createSlice({
	name: 'music',
	initialState: loadMusicState(),
	reducers: {
		// Action to set the current music track
		setCurrentTrack(state, action: PayloadAction<string | null>) {
			state.currentTrack = action.payload;
		},
		// Action to set the volume level
		setVolume(state, action: PayloadAction<number>) {
			// Ensure volume stays within 0-100
			state.volume = Math.min(100, Math.max(0, action.payload));
		},
		// Action to reset the music state to initial values
		resetMusicState(state) {
			Object.assign(state, initialState);
		},
	},
});

// Export actions and reducer
export const { setCurrentTrack, setVolume, resetMusicState } =
	musicSlice.actions;

export default musicSlice.reducer;
