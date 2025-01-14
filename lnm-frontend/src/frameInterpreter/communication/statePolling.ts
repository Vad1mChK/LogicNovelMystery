// src/utils/statePolling.ts
import axios from 'axios';
import { Dispatch } from '@reduxjs/toolkit';
import { VITE_SERVER_URL } from '../../metaEnv';
import { setPlayerState } from '../../state/gameStateSlice';
import {
	setResult,
	setPartnerName,
	setScore,
	setHighScore,
} from '../../state/gameFinalResultSlice';
import { LnmPlayerState } from '../types';

const API_TIMEOUT = 5000;
const POLLING_INTERVAL = 3000;

let pollingInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Starts short polling for player state updates.
 * @param sessionToken The current session ID.
 * @param playerState The current player state.
 * @param dispatch Redux dispatch function.
 */
export const startShortPolling = (
	sessionToken: string,
	playerState: LnmPlayerState,
	dispatch: Dispatch
) => {
	// States for which polling is required
	const statesToPoll = [
		LnmPlayerState.CREATED,
		LnmPlayerState.WAITING_LOST,
		LnmPlayerState.WAITING_WON,
	];

	// If polling is needed, set up an interval
	if (statesToPoll.includes(playerState)) {
		if (!pollingInterval) {
			pollingInterval = setInterval(async () => {
				try {
					const response = await axios.post(
						`${VITE_SERVER_URL}/game/state`,
						{ sessionToken },
						{ timeout: API_TIMEOUT }
					);

					const {
						playerState: newState,
						result,
						score,
						highScore,
						partnerName,
					} = response.data;

					// Update Redux state
					if (newState) {
						console.info(
							`Short polling: received state update, new state: ${newState}`
						);
						dispatch(setPlayerState(newState));
					}

					if (result !== undefined) dispatch(setResult(result));
					if (score !== undefined) dispatch(setScore(score));
					if (highScore !== undefined)
						dispatch(setHighScore(highScore));
					if (partnerName !== undefined)
						dispatch(setPartnerName(partnerName));
				} catch (error) {
					console.error('Error polling player state:', error);
				}
			}, POLLING_INTERVAL);
		}
	} else {
		// Clear the polling interval if no longer needed
		stopShortPolling();
	}
};

/**
 * Stops the short polling interval.
 */
export const stopShortPolling = () => {
	if (pollingInterval) {
		clearInterval(pollingInterval);
		pollingInterval = null;
	}
};
