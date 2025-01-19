import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { RootState } from '../state/store';
import MusicController from './MusicController';
import { MusicManager } from './musicManager';

// Mock the MusicManager class
jest.mock('./musicManager', () => ({
	MusicManager: {
		getInstance: jest.fn().mockReturnValue({
			setTrack: jest.fn(),
			play: jest.fn(),
			pause: jest.fn(),
			stop: jest.fn(),
			setVolume: jest.fn(),
			setPanning: jest.fn(),
		}),
	},
}));

// Mock Redux store
const mockStore = (state: Partial<RootState>) => {
	return createStore((state) => state, {
		musicState: {
			currentTrack: 'track1.mp3',
			isPlaying: true,
			volume: 50,
			panning: 0,
			...state?.musicState, // Merge the state with the provided partial state
		},
	});
};

describe('MusicController Component', () => {
	it('should call setTrack and play when currentTrack and isPlaying are set', () => {
		const store = mockStore({
			musicState: {
				currentTrack: 'track1.mp3',
				isPlaying: true,
				volume: 50,
				panning: 0,
			},
		});

		render(
			<Provider store={store}>
				<MusicController />
			</Provider>
		);

		const musicManagerInstance = MusicManager.getInstance();
		expect(musicManagerInstance.setTrack).toHaveBeenCalledWith(
			'track1.mp3'
		);
		expect(musicManagerInstance.play).toHaveBeenCalled();
	});

	it('should call pause when isPlaying is false', () => {
		const store = mockStore({
			musicState: {
				currentTrack: 'track1.mp3',
				isPlaying: false,
				volume: 50,
				panning: 0,
			},
		});

		render(
			<Provider store={store}>
				<MusicController />
			</Provider>
		);

		const musicManagerInstance = MusicManager.getInstance();
		expect(musicManagerInstance.pause).toHaveBeenCalled();
	});

	it('should call setVolume with correct value', () => {
		const store = mockStore({
			musicState: {
				currentTrack: 'track1.mp3',
				volume: 80,
				isPlaying: true,
				panning: 0,
			},
		});

		render(
			<Provider store={store}>
				<MusicController />
			</Provider>
		);

		const musicManagerInstance = MusicManager.getInstance();
		expect(musicManagerInstance.setVolume).toHaveBeenCalledWith(80);
	});

	it('should call setPanning with correct value', () => {
		const store = mockStore({
			musicState: {
				currentTrack: 'track1.mp3',
				panning: -1,
				isPlaying: true,
				volume: 50,
			},
		});

		render(
			<Provider store={store}>
				<MusicController />
			</Provider>
		);

		const musicManagerInstance = MusicManager.getInstance();
		expect(musicManagerInstance.setPanning).toHaveBeenCalledWith(-1);
	});

	it('should call stop when currentTrack is null', () => {
		const store = mockStore({
			musicState: {
				currentTrack: null,
				isPlaying: false,
				volume: 50,
				panning: 0,
			},
		});

		render(
			<Provider store={store}>
				<MusicController />
			</Provider>
		);

		const musicManagerInstance = MusicManager.getInstance();
		expect(musicManagerInstance.stop).toHaveBeenCalled();
	});
});
