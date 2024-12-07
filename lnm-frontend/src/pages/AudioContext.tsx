import React, { createContext, useState, useRef, useEffect } from 'react';

interface AudioContextProps {
    isMusicPlaying: boolean;
    toggleMusic: () => void;
    setMusicFile: (file: string) => void;
    setVolume: (value: number) => void;
    volume: number;
}

export const AudioContext = createContext<AudioContextProps | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMusicPlaying, setMusicPlaying] = useState(false);
    const [currentMusicFile, setCurrentMusicFile] = useState<string | null>(null);
    const [volume, setVolumeState] = useState(50);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Инициализация аудио-элемента
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.loop = true;
        }
    }, []);

    // Устанавливаем файл музыки
    const setMusicFile = (file: string) => {
        if (audioRef.current) {
            audioRef.current.src = file;
            audioRef.current.load();
        }
    };

    // Управляем воспроизведением музыки
    const toggleMusic = () => {
        if (audioRef.current) {
            if (isMusicPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setMusicPlaying(!isMusicPlaying);
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
    }, [volume]);

    return (
        <AudioContext.Provider
            value={{ isMusicPlaying, toggleMusic, setMusicFile, setVolume, volume }}
        >
            {children}
        </AudioContext.Provider>
    );
};
