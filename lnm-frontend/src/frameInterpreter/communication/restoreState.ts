// restoreState.ts
import axios from 'axios';
import { VITE_SERVER_URL } from '../../metaEnv';
import {
	increaseHealth,
	setCurrentChapter,
	setHealth,
} from '../../state/gameStateSlice';
import { AppDispatch } from '../../state/store'; // or wherever your store types live

export const restoreState = async (
	sessionToken: string,
	isMultiplayer: boolean,
	dispatch: AppDispatch
): Promise<boolean> => {
	try {
		const response = await axios.post(
			`${VITE_SERVER_URL}/game/restore-state`,
			{ sessionToken, isMultiplayer },
			{ headers: { Authorization: localStorage.getItem('AuthToken') } }
		);
		if (!response.data) {
			console.warn('No state data received from server');
			return true;
		}
		const health = response.data?.userHp;
		if (health !== null && health !== undefined) {
			console.log('Restoring health to:', health);
			dispatch(setHealth(health));
		} else {
			console.warn('No health data received from server');
			dispatch(increaseHealth('full'));
		}

		const chapter = response.data?.chapter;
		if (chapter !== null && chapter !== undefined) {
			console.log('Restoring chapter to:', chapter);
			dispatch(setCurrentChapter(chapter));
		} else {
			console.warn('No chapter data received from server');
			dispatch(setCurrentChapter('inception1'));
		}
		return true;
	} catch (error) {
		console.error('Error restoring the game state from server:', error);
		return false;
	}
};
