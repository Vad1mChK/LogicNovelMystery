import axios from 'axios';
import { Dispatch } from '@reduxjs/toolkit';
import { startShortPolling, stopShortPolling } from './statePolling';
import { LnmPlayerState, LnmResult } from '../types';
import { setPlayerState } from '../../state/gameStateSlice';
import {
	setHighScore,
	setPartnerName,
	setResult,
	setScore,
} from '../../state/gameFinalResultSlice';

jest.mock('axios');

jest.mock('../../metaEnv', () => ({
	VITE_SERVER_URL: 'http://localhost:8081',
}));

jest.useFakeTimers(); // Use Jest's fake timers

describe('statePolling', () => {
	let mockDispatch: jest.MockedFunction<Dispatch>;
	let mockAxiosPost: jest.MockedFunction<typeof axios.post>;

	beforeEach(() => {
		mockDispatch = jest.fn(); // Cast to any to satisfy Dispatch
		mockAxiosPost = axios.post as jest.MockedFunction<typeof axios.post>;
		jest.clearAllTimers();
		jest.clearAllMocks();
	});

	afterEach(() => {
		// Ensure we stop polling after each test
		stopShortPolling();
	});

	it('should start polling when playerState is in statesToPoll (e.g. CREATED) and no interval exists', () => {
		startShortPolling(
			'session-token',
			LnmPlayerState.CREATED,
			mockDispatch
		);

		// No axios call should happen until timers advance
		expect(mockAxiosPost).not.toHaveBeenCalled();

		// Fast-forward time to trigger the interval
		jest.advanceTimersByTime(3000); // The POLLING_INTERVAL

		expect(mockAxiosPost).toHaveBeenCalledTimes(1);
		expect(mockAxiosPost).toHaveBeenCalledWith(
			expect.stringContaining('/game/state'),
			{ sessionToken: 'session-token' },
			expect.objectContaining({ timeout: 5000 })
		);
	});

	it('should NOT start polling if playerState is not in statesToPoll (e.g. PLAYING)', () => {
		startShortPolling(
			'session-token',
			LnmPlayerState.PLAYING,
			mockDispatch
		);

		// Attempting to poll in a non-supported state -> stopShortPolling called
		// No intervals should be running
		jest.advanceTimersByTime(3000);
		expect(mockAxiosPost).not.toHaveBeenCalled();
	});

	it('should not start a new interval if one is already running', () => {
		startShortPolling(
			'session-token',
			LnmPlayerState.CREATED,
			mockDispatch
		);

		// Attempt to start polling again while it is already running
		startShortPolling(
			'session-token',
			LnmPlayerState.CREATED,
			mockDispatch
		);

		jest.advanceTimersByTime(3000);

		// The second call should NOT create a new interval
		expect(mockAxiosPost).toHaveBeenCalledTimes(1);
	});

	it('should dispatch setPlayerState if newState is returned', async () => {
		mockAxiosPost.mockResolvedValue({
			data: {
				playerState: LnmPlayerState.WAITING_WON,
			},
		});

		startShortPolling(
			'session-token',
			LnmPlayerState.CREATED,
			mockDispatch
		);

		jest.advanceTimersByTime(3000);

		// Wait for the promise queue to flush
		await Promise.resolve();

		expect(mockDispatch).toHaveBeenCalledWith(
			setPlayerState(LnmPlayerState.WAITING_WON)
		);
	});

	it('should dispatch setResult, setScore, setHighScore, setPartnerName if returned in response', async () => {
		mockAxiosPost.mockResolvedValue({
			data: {
				playerState: LnmPlayerState.WAITING_WON,
				result: 'SINGLE_GOOD',
				score: 12000,
				highScore: 15000,
				partnerName: 'PlayerB',
			},
		});

		startShortPolling(
			'session-token',
			LnmPlayerState.CREATED,
			mockDispatch
		);

		jest.advanceTimersByTime(3000);

		// Wait for the promise queue to flush
		await Promise.resolve();

		expect(mockDispatch).toHaveBeenCalledWith(
			setResult(LnmResult.SINGLE_GOOD)
		);
		expect(mockDispatch).toHaveBeenCalledWith(setScore(12000));
		expect(mockDispatch).toHaveBeenCalledWith(setHighScore(15000));
		expect(mockDispatch).toHaveBeenCalledWith(setPartnerName('PlayerB'));
	});

	it('should handle polling errors without throwing', async () => {
		mockAxiosPost.mockRejectedValue(new Error('Network Error'));

		startShortPolling(
			'session-token',
			LnmPlayerState.CREATED,
			mockDispatch
		);

		jest.advanceTimersByTime(3000);

		// Wait for the promise queue to flush
		await Promise.resolve();

		// We expect an error log, but no thrown error
		expect(mockAxiosPost).toHaveBeenCalledTimes(1);
	});

	it('should stop polling when stopShortPolling is called', () => {
		startShortPolling(
			'session-token',
			LnmPlayerState.CREATED,
			mockDispatch
		);

		// Confirm interval is active
		jest.advanceTimersByTime(3000);
		expect(mockAxiosPost).toHaveBeenCalledTimes(1);

		stopShortPolling();

		// Interval is cleared, further calls won't happen
		jest.advanceTimersByTime(3000);
		expect(mockAxiosPost).toHaveBeenCalledTimes(1); // No increase
	});
});
