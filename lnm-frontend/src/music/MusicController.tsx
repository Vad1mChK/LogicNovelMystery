// src/components/MusicController.tsx

import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { MusicManager } from './musicManager';

const MusicController: React.FC = () => {
	const { currentTrack, isPlaying, volume, panning } = useSelector(
		(state: RootState) => state.musicState
	);
	const musicManagerRef = useRef<MusicManager | null>(null);

	useEffect(() => {
		musicManagerRef.current = MusicManager.getInstance();
	}, []);

	useEffect(() => {
		if (currentTrack) {
			musicManagerRef.current?.setTrack(currentTrack);
			if (isPlaying) {
				musicManagerRef.current?.play();
			}
		} else {
			musicManagerRef.current?.stop();
		}
	}, [currentTrack]);

	useEffect(() => {
		if (isPlaying && currentTrack) {
			musicManagerRef.current?.play();
		} else {
			musicManagerRef.current?.pause();
		}
	}, [isPlaying, currentTrack]);

	useEffect(() => {
		musicManagerRef.current?.setVolume(volume);
	}, [volume]);

	useEffect(() => {
		musicManagerRef.current?.setPanning(panning ?? 0);
	}, [panning]);

	return null; // This component doesn't render anything
};

export default MusicController;
