// src/state/musicSlice.test.ts

import musicReducer, {
	MusicState,
	setCurrentTrack,
	setVolume,
	resetMusicState,
} from './musicSlice';

describe('musicSlice', () => {
	const initialState: MusicState = {
		currentTrack: null,
		volume: 100,
	};

	it('should handle initial state', () => {
		expect(musicReducer(undefined, { type: 'unknown' })).toEqual(
			initialState
		);
	});

	it('should handle setCurrentTrack', () => {
		const actual = musicReducer(
			initialState,
			setCurrentTrack('track1.mp3')
		);
		expect(actual.currentTrack).toEqual('track1.mp3');
	});

	it('should handle setCurrentTrack to null', () => {
		const stateWithTrack: MusicState = {
			currentTrack: 'track1.mp3',
			volume: 100,
		};
		const actual = musicReducer(stateWithTrack, setCurrentTrack(null));
		expect(actual.currentTrack).toEqual(null);
	});

	it('should handle setVolume', () => {
		const actual = musicReducer(initialState, setVolume(75));
		expect(actual.volume).toEqual(75);
	});

	it('should cap volume at 100', () => {
		const actual = musicReducer(initialState, setVolume(150));
		expect(actual.volume).toEqual(100);
	});

	it('should cap volume at 0', () => {
		const actual = musicReducer(initialState, setVolume(-20));
		expect(actual.volume).toEqual(0);
	});

	it('should handle resetMusicState', () => {
		const modifiedState: MusicState = {
			currentTrack: 'track2.mp3',
			volume: 50,
		};
		const actual = musicReducer(modifiedState, resetMusicState());
		expect(actual).toEqual(initialState);
	});
});
