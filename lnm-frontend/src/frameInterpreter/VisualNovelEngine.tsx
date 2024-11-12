import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
	LnmPlot,
	LnmFrameEffect,
	LnmFrame,
	LnmLocation,
	LnmFrameCharacterData,
} from './types';
import FrameRenderer from './FrameRenderer';
import evaluateCondition from './conditionHandlers.ts';
import { effectHandlers } from './effectHandlers.ts';
import { useGameState } from './GameStateContext.tsx'; // Import your condition evaluation logic

interface VisualNovelEngineProps {
	plot: LnmPlot;
	startChapterId?: string;
}

const VisualNovelEngine: React.FC<VisualNovelEngineProps> = ({
	plot,
	startChapterId,
}) => {
	const initialChapterId = plot.chapters.has(startChapterId || '')
		? startChapterId!
		: plot.startChapter;

	const [currentChapterId, setCurrentChapterId] =
		useState<string>(initialChapterId);
	const [currentFrameId, setCurrentFrameId] = useState<string>(
		plot.chapters.get(initialChapterId)?.startFrame || ''
	);
	const [isEnding, setIsEnding] = useState<boolean>(false);
	const [currentEndingId, setCurrentEndingId] = useState<string | null>(null);
	const [currentCharacters, setCurrentCharacters] = useState<
		LnmFrameCharacterData[] | null
	>(null);
	const [currentLocation, setCurrentLocation] = useState<LnmLocation | null>(
		null
	);
	const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);
	const { loadChapterKnowledge, addKnowledge, clearKnowledge, knowledge } =
		useGameState();
	const processedEffects = useRef<Map<string, boolean>>(new Map());

	// Utility to get the current frame
	const getCurrentFrame = (): LnmFrame | undefined => {
		if (isEnding && currentEndingId) {
			// Get frame from the ending
			const ending = plot.frames.endings.get(currentEndingId);
			console.log(
				`Ending [${currentEndingId}] loaded: startFrame ${ending?.id}`
			);
			return ending?.frames?.get(currentFrameId);
		} else {
			// Get frame from the current chapter
			const chapterFrames = plot.frames.main.get(currentChapterId);
			return chapterFrames?.get(currentFrameId);
		}
	};

	useEffect(() => {
		console.log('useEffect hook: load from initial chapter');
		// Load knowledge for the initial chapter
		const initialChapter = plot.chapters.get(initialChapterId);
		if (initialChapter) {
			clearKnowledge();
			loadChapterKnowledge(initialChapter.knowledge);
		}
	}, [initialChapterId, plot]);

	useEffect(() => {
		const currentFrame = getCurrentFrame();
		if (!currentFrame) return;

		// Update characters
		if (currentFrame.characters && currentFrame.characters.length > 0) {
			setCurrentCharacters(currentFrame.characters);
		}

		// Update location
		if (currentFrame.location) {
			const newLocation = plot.locations.get(currentFrame.location);
			if (newLocation) setCurrentLocation(newLocation);
		}

		if (currentFrame.speaker) {
			setCurrentSpeaker(currentFrame.speaker);
		}
	}, [
		currentFrameId,
		currentChapterId,
		currentEndingId,
		getCurrentFrame,
		plot.locations,
	]);

	// Automatically trigger the first matching ending if applicable
	const autoTriggerEnding = () => {
		for (const [endingId, ending] of plot.frames.endings.entries()) {
			if (ending.condition && evaluateCondition(ending.condition)) {
				setCurrentEndingId(endingId);
				setCurrentFrameId(ending.startFrame);
				setIsEnding(true);
				return true;
			}
		}
		return false;
	};

	// Handle frame effects
	const handleEffects = useCallback(
		(effects: LnmFrameEffect[] | undefined) => {
			if (!effects) return;

			const frameKey = `${currentChapterId}-${currentFrameId}`;
			if (processedEffects.current.has(frameKey)) {
				console.log(
					'Skipping effects for already processed frame:',
					frameKey
				);
				return;
			}

			console.log('Processing effects for frame:', frameKey);

			for (const effect of effects) {
				const handler = effectHandlers[effect.type];
				if (handler) {
					handler(effect, {
						setCurrentFrameId,
						setCurrentChapterId,
						setCurrentEndingId,
						setIsEnding,
						setCurrentCharacters,
						addKnowledge,
						plot,
					});
				} else {
					console.warn(`Unhandled effect type: ${effect.type}`);
				}
			}

			processedEffects.current.set(frameKey, true);
		},
		[
			currentChapterId,
			currentFrameId,
			addKnowledge,
			setCurrentFrameId,
			setCurrentChapterId,
			setCurrentEndingId,
			setIsEnding,
			setCurrentCharacters,
			plot,
		]
	);

	// Handle next frame transition
	const handleNextFrame = (nextFrameId: string | null) => {
		if (!nextFrameId) {
			if (!isEnding && autoTriggerEnding()) {
				// TODO Automatically trigger ending if applicable
				return;
			}

			console.log('No next frame.');
			return; // End of current flow
		}

		if (isEnding && currentEndingId) {
			// Stay within the ending frames
			setCurrentFrameId(nextFrameId);
		} else {
			// Handle main plot frames
			const chapterFrames = plot.frames.main.get(currentChapterId);

			if (chapterFrames?.has(nextFrameId)) {
				setCurrentFrameId(nextFrameId);
			} else {
				const nextChapter = plot.chapters.get(nextFrameId);
				if (nextChapter) {
					// clearKnowledge();
					setCurrentChapterId(nextFrameId);
					setCurrentFrameId(nextChapter.startFrame);
					// loadChapterKnowledge(nextChapter.knowledge);
				} else {
					console.warn(
						`Frame or chapter not found for ID: ${nextFrameId}`
					);
				}
			}
		}
	};

	// Process frame effects after frame updates
	useEffect(() => {
		const currentFrame = getCurrentFrame();
		if (currentFrame) {
			handleEffects(currentFrame.effects);
		}
	}, [
		currentFrameId,
		currentChapterId,
		currentEndingId,
		getCurrentFrame,
		handleEffects,
	]);

	const currentFrame = getCurrentFrame();

	if (!currentFrame) {
		return <div>Frame not found.</div>;
	}

	return (
		<FrameRenderer
			frame={currentFrame}
			currentCharacters={currentCharacters}
			currentSpeaker={currentSpeaker}
			currentLocation={currentLocation}
			onNextFrame={handleNextFrame}
			knowledge={knowledge}
			plot={plot}
		/>
	);
};

export default VisualNovelEngine;
