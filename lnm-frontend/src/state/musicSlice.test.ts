// src/state/musicSlice.test.ts

import musicReducer, {
	MusicState,
	playMusic,
	pauseMusic,
	setCurrentTrack,
	setVolume,
	togglePlayMusic,
	setPanning,
} from './musicSlice';

describe('musicSlice', () => {
	test('should set the current track when setCurrentTrack is called', () => {
		const initialState: MusicState = {
			currentTrack: null,
			volume: 100,
			isPlaying: false,
			panning: 0,
		};
		const newTrack = 'https://example.com/music/track1.mp3';

		const nextState = musicReducer(initialState, setCurrentTrack(newTrack));

		expect(nextState.currentTrack).toBe(newTrack);
	});

	test('should set volume correctly and clamp volume to (0..100) range', () => {
		const initialState: MusicState = {
			currentTrack: null,
			volume: 50,
			isPlaying: false,
			panning: 0,
		};
		let newVolume = 70;
		let nextState = musicReducer(initialState, setVolume(newVolume));
		expect(nextState.volume).toBe(newVolume);

		newVolume = 110;
		nextState = musicReducer(initialState, setVolume(newVolume));
		expect(nextState.volume).toBe(100);

		newVolume = -5;
		nextState = musicReducer(initialState, setVolume(newVolume));
		expect(nextState.volume).toBe(0);
	});

	test('should set isPlaying to true when play action is dispatched', () => {
		const initialState: MusicState = {
			currentTrack: null,
			volume: 100,
			isPlaying: false,
			panning: 0,
		};

		const nextState = musicReducer(initialState, playMusic());

		expect(nextState.isPlaying).toBe(true);
	});

	test('should set isPlaying to false when pause action is dispatched', () => {
		const initialState: MusicState = {
			currentTrack: null,
			volume: 100,
			isPlaying: true,
			panning: 0,
		};

		const nextState = musicReducer(initialState, pauseMusic());

		expect(nextState.isPlaying).toBe(false);
	});

	test('should toggle isPlaying when togglePlayMusic is called', () => {
		const initialState: MusicState = {
			currentTrack: null,
			volume: 100,
			isPlaying: false,
			panning: 0,
		};

		let nextState = musicReducer(initialState, togglePlayMusic());
		expect(nextState.isPlaying).toBe(true);

		nextState = musicReducer(nextState, togglePlayMusic());
		expect(nextState.isPlaying).toBe(false);
	});

	test('should set panning correctly and clamp it to (-1..1) range', () => {
		const initialState: MusicState = {
			currentTrack: null,
			volume: 100,
			isPlaying: false,
			panning: 0,
		};
		let newPanning = 50;
		let nextState = musicReducer(initialState, setPanning(newPanning));
		expect(nextState.panning).toBe(newPanning);

		newPanning = 150;
		nextState = musicReducer(initialState, setPanning(newPanning));
		expect(nextState.panning).toBe(100);

		newPanning = -150;
		nextState = musicReducer(initialState, setPanning(newPanning));
		expect(nextState.panning).toBe(-100);

	});
});
