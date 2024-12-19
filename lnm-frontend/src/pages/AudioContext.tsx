import React, { createContext, useState, useRef, useEffect } from 'react';

interface AudioContextProps {
	isMusicPlaying: boolean;
	toggleMusic: () => void;
	setMusicFile: (file: string) => void;
	setVolume: (value: number) => void;
	volume: number;
}

export const AudioContext = createContext<AudioContextProps | undefined>(
	undefined
);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [isMusicPlaying, setMusicPlaying] = useState(false);
	const [currentMusicFile, setCurrentMusicFile] = useState<string | null>(
		null
	); // TODO Find where to use it
	const [volume, setVolumeState] = useState(50);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [userInteracted, setUserInteracted] = useState(false); // Новый флаг для отслеживания взаимодействия пользователя

	// Инициализация аудио-элемента
	useEffect(() => {
		if (!audioRef.current) {
			audioRef.current = new Audio();
			audioRef.current.loop = true;
		}
	}, []);

	useEffect(() => {
		console.log('Mounted: AudioProvider');
		return () => console.log('Unmounted: AudioProvider');
	}, []);

	// Обработчик для отслеживания взаимодействия пользователя
	const handleUserInteraction = () => {
		setUserInteracted(true);
		document.removeEventListener('click', handleUserInteraction);
	};

	useEffect(() => {
		if (!userInteracted) {
			document.addEventListener('click', handleUserInteraction);
		}
		return () => {
			document.removeEventListener('click', handleUserInteraction);
		};
	}, [userInteracted]);

	// Устанавливаем файл музыки
	const setMusicFile = (file: string) => {
		if (audioRef.current) {
			// Only set a new file if it's different from the current one
			if (currentMusicFile !== file) {
				audioRef.current.src = file;
				audioRef.current.load();
				setCurrentMusicFile(file); // Update the current music file state
			}
		}
	};

	// Управляем воспроизведением музыки
	const toggleMusic = () => {
		if (audioRef.current && userInteracted) {
			if (isMusicPlaying) {
				audioRef.current.pause();
				console.log('Pausing music');
			} else {
				audioRef.current
					.play()
					.then(() => console.log('Playing music'))
					.catch((error) => {
						console.error('Audio playback failed:', error);
					});
			}
			setMusicPlaying(!isMusicPlaying);
		} else if (!userInteracted) {
			console.warn('User has not interacted with the document yet.');
		}
	};

	// Устанавливаем громкость
	const setVolume = (value: number) => {
		setVolumeState(value);
		if (audioRef.current) {
			audioRef.current.volume = value / 100;
		}
	};

	// Устанавливаем текущую громкость при обновлении volume
	useEffect(() => {
		if (audioRef.current) {
			audioRef.current.volume = volume / 100;
		}
		console.log(`Volume is now ${volume}`);
	}, [volume]);

	return (
		<AudioContext.Provider
			value={{
				isMusicPlaying,
				toggleMusic,
				setMusicFile,
				setVolume,
				volume,
			}}
		>
			{children}
		</AudioContext.Provider>
	);
};
