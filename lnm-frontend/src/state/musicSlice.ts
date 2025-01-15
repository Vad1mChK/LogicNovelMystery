// src/store/musicSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MusicState {
	currentTrack: string | null; // URL or identifier for the track
	volume: number; // 0 to 100
	isPlaying: boolean;
	panning?: number; // -1 to 1 (optional)
}

const initialState: MusicState = {
	currentTrack: null,
	volume: 100,
	isPlaying: false,
	panning: 0, // Center
};

const musicSlice = createSlice({
	name: 'music',
	initialState,
	reducers: {
		setCurrentTrack(state, action: PayloadAction<string | null>) {
			state.currentTrack = action.payload;
		},
		setVolume(state, action: PayloadAction<number>) {
			state.volume = Math.min(100, Math.max(0, action.payload));
		},
		playMusic(state) {
			state.isPlaying = true;
		},
		pauseMusic(state) {
			state.isPlaying = false;
		},
		togglePlayMusic(state) {
			state.isPlaying = !state.isPlaying;
		},
		setPanning(state, action: PayloadAction<number>) {
			state.panning = Math.min(1, Math.max(-1, action.payload));
		},
	},
});

export const {
	setCurrentTrack,
	setVolume,
	playMusic,
	pauseMusic,
	togglePlayMusic,
	setPanning,
} = musicSlice.actions;

export default musicSlice.reducer;