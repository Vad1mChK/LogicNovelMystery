// src/components/__tests__/MusicController.test.tsx

import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore, { MockStoreEnhanced } from 'redux-mock-store';
import MusicController from './MusicController';
import { MusicManager } from './musicManager';
import { RootState } from '../state/store';

// Extend Jest's expect with jest-dom
import '@testing-library/jest-dom';

// Create mock functions for MusicManager methods
const mockSetTrack = jest.fn();
const mockPlay = jest.fn();
const mockPause = jest.fn();
const mockStop = jest.fn();
const mockSetVolume = jest.fn();
const mockSetPanning = jest.fn();

// Create a single mock instance of MusicManager
const mockMusicManagerInstance = {
	setTrack: mockSetTrack,
	play: mockPlay,
	pause: mockPause,
	stop: mockStop,
	setVolume: mockSetVolume,
	setPanning: mockSetPanning,
} as unknown as MusicManager;

// Mock the MusicManager singleton to always return the same instance
jest.mock('./musicManager', () => ({
	MusicManager: {
		getInstance: jest.fn(() => mockMusicManagerInstance),
	},
}));

// Create a mock store with Partial<RootState>
const mockStore = configureMockStore<Partial<RootState>>();

// Helper function to render component with Redux provider
const renderWithProvider = (
	ui: React.ReactElement,
	store: MockStoreEnhanced<Partial<RootState>, object>
) => {
	return render(<Provider store={store}>{ui}</Provider>);
};

// Optional: Suppress console.error during tests to keep output clean
beforeAll(() => {
	jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
	jest.restoreAllMocks();
});

describe('MusicController', () => {
	let store: MockStoreEnhanced<Partial<RootState>, object>;

	beforeEach(() => {
		// Reset all mocks before each test
		jest.clearAllMocks();

		// Initialize mock store with default state
		store = mockStore({
			musicState: {
				currentTrack: null,
				isPlaying: false,
				volume: 100,
				panning: 0,
			},
		});
	});

	it('should initialize MusicManager on mount', () => {
		renderWithProvider(<MusicController />, store);

		expect(MusicManager.getInstance).toHaveBeenCalledTimes(1);
		expect(mockMusicManagerInstance).toBeDefined();
	});

	it('should set track and play if isPlaying is true', () => {
		// Update store state
		store = mockStore({
			musicState: {
				currentTrack: 'http://example.com/song.mp3',
				isPlaying: true,
				volume: 80,
				panning: 0.5,
			},
		});

		renderWithProvider(<MusicController />, store);

		expect(mockMusicManagerInstance.setTrack).toHaveBeenCalledWith(
			'http://example.com/song.mp3'
		);
		expect(mockMusicManagerInstance.play).toHaveBeenCalled();
	});

	it('should stop MusicManager if currentTrack is null', () => {
		// Update store state
		store = mockStore({
			musicState: {
				currentTrack: null,
				isPlaying: false,
				volume: 50,
				panning: -0.3,
			},
		});

		renderWithProvider(<MusicController />, store);

		expect(mockMusicManagerInstance.stop).toHaveBeenCalledTimes(1);
		expect(mockMusicManagerInstance.setTrack).not.toHaveBeenCalled();
		expect(mockMusicManagerInstance.play).not.toHaveBeenCalled();
	});

	it('should pause MusicManager if isPlaying is false', () => {
		// First, set a track and play it
		store = mockStore({
			musicState: {
				currentTrack: 'http://example.com/song.mp3',
				isPlaying: true,
				volume: 70,
				panning: 0,
			},
		});

		const { rerender } = renderWithProvider(<MusicController />, store);

		expect(mockMusicManagerInstance.setTrack).toHaveBeenCalledWith(
			'http://example.com/song.mp3'
		);

		// Update store to pause
		store = mockStore({
			musicState: {
				currentTrack: 'http://example.com/song.mp3',
				isPlaying: false,
				volume: 70,
				panning: 0,
			},
		});

		rerender(
			<Provider store={store}>
				<MusicController />
			</Provider>
		);

		expect(mockMusicManagerInstance.pause).toHaveBeenCalledTimes(1);
	});

	it('should set volume when volume changes', () => {
		// Set initial state with volume 50
		store = mockStore({
			musicState: {
				currentTrack: 'http://example.com/song.mp3',
				isPlaying: true,
				volume: 50,
				panning: 0,
			},
		});

		renderWithProvider(<MusicController />, store);

		expect(mockMusicManagerInstance.setVolume).toHaveBeenCalledWith(50);
	});

	it('should set panning when panning changes', () => {
		// Set initial state with panning 0
		store = mockStore({
			musicState: {
				currentTrack: 'http://example.com/song.mp3',
				isPlaying: true,
				volume: 100,
				panning: 0,
			},
		});

		renderWithProvider(<MusicController />, store);

		expect(mockMusicManagerInstance.setPanning).toHaveBeenCalledWith(0);

		// Update panning to 0.7
		store = mockStore({
			musicState: {
				currentTrack: 'http://example.com/song.mp3',
				isPlaying: true,
				volume: 100,
				panning: 0.7,
			},
		});

		renderWithProvider(<MusicController />, store);

		expect(mockMusicManagerInstance.setPanning).toHaveBeenCalledWith(0.7);
	});

	it('should not set track again if the same track is set', () => {
		// Set initial state with a track
		store = mockStore({
			musicState: {
				currentTrack: 'http://example.com/song.mp3',
				isPlaying: true,
				volume: 100,
				panning: 0,
			},
		});

		renderWithProvider(<MusicController />, store);

		expect(mockMusicManagerInstance.setTrack).toHaveBeenCalledWith(
			'http://example.com/song.mp3'
		);
		expect(mockMusicManagerInstance.play).toHaveBeenCalled();

		// Rerender with the same track
		renderWithProvider(<MusicController />, store);
	});

	it('should set panning to 0 if panning is undefined', () => {
		// Set initial state with panning undefined
		store = mockStore({
			musicState: {
				currentTrack: 'http://example.com/song.mp3',
				isPlaying: true,
				volume: 100,
				panning: undefined,
			},
		});

		renderWithProvider(<MusicController />, store);

		expect(mockMusicManagerInstance.setPanning).toHaveBeenCalledWith(0);
	});
});
