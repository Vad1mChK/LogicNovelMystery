import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the GameState interface
interface GameState {
	chapterId: string;
	frameId: string;
	health: number;
	knowledge: string[];
	errorSum: number;
	errorCount: number;

	setChapterId: (chapterId: string) => void;
	setFrameId: (frameId: string) => void;
	setHealth: (health: number) => void;
	addKnowledge: (knowledge: string) => void;
	clearKnowledge: () => void;
	incrementErrorSum: (error: number) => void;
	clearErrorSum: () => void;
	incrementErrorCount: (error: number) => void;
	clearErrorCount: () => void;
	loadChapterKnowledge: (initialKnowledge: string[]) => void;
}

// Create the Context
const GameStateContext = createContext<GameState | undefined>(undefined);

// Define the Provider
export const GameStateProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [chapterId, setChapterId] = useState<string>('start');
	const [frameId, setFrameId] = useState<string>('frame1');
	const [health, setHealth] = useState<number>(100);
	const [knowledge, setKnowledge] = useState<string[]>([]);
	const [errorSum, setErrorSum] = useState<number>(0);
	const [errorCount, setErrorCount] = useState<number>(0);

	// Define functions to modify the state
	const addKnowledge = (newKnowledge: string) => {
		setKnowledge((prev) => {
			if (prev.includes(newKnowledge)) return prev;
			return [...prev, newKnowledge];
		});
		console.log(`added knowledge id: ${newKnowledge}`);
		console.log(knowledge);
	};
	const clearKnowledge = () => {
		setKnowledge([]);
		console.log('cleared knowledge');
		console.log(knowledge);
	};

	const incrementErrorSum = (error: number) => {
		setErrorSum((prev) => prev + error);
	};

	const clearErrorSum = () => {
		setErrorSum(0);
	};

	const incrementErrorCount = (error: number) => {
		setErrorCount((prev) => prev + error);
	};

	const clearErrorCount = () => {
		setErrorCount(0);
	};

	const loadChapterKnowledge = (initialKnowledge: string[]) => {
		setKnowledge(initialKnowledge);
		console.log(`loaded initial knowledge: ${initialKnowledge}`);
		console.log(knowledge);
	};

	return (
		<GameStateContext.Provider
			value={{
				chapterId,
				frameId,
				health,
				knowledge,
				errorSum,
				errorCount,
				setChapterId,
				setFrameId,
				setHealth,
				addKnowledge,
				clearKnowledge,
				incrementErrorSum,
				clearErrorSum,
				incrementErrorCount,
				clearErrorCount,
				loadChapterKnowledge,
			}}
		>
			{children}
		</GameStateContext.Provider>
	);
};

// Custom hook for accessing the GameState context
export const useGameState = (): GameState => {
	const context = useContext(GameStateContext);
	if (!context) {
		throw new Error('useGameState must be used within a GameStateProvider');
	}
	return context;
};
