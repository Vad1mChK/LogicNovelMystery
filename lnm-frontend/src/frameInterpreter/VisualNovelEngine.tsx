import React, { useState, useEffect, useCallback } from 'react';
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
import { RootState } from '../store.ts';
import { useDispatch, useSelector } from 'react-redux';
import {
	clearKnowledge,
	setKnowledge,
	addKnowledge,
	decreaseHealth,
	increaseHealth,
	setCurrentFrame,
	setCurrentChapter,
} from './gameStore/gameStateSlice.ts';

interface VisualNovelEngineProps {
	plot: LnmPlot;
	startChapterId?: string;
}

const VisualNovelEngine: React.FC<VisualNovelEngineProps> = ({
	plot,
	startChapterId,
}) => {
	console.log('Rerender');
	const initialChapterId = plot.chapters.has(startChapterId || '')
		? startChapterId!
		: plot.startChapter;

	// const [currentChapterId, setCurrentChapterId] =
	// 	useState<string>(initialChapterId);
	// const [currentFrameId, setCurrentFrameId] = useState<string>(
	// 	plot.chapters.get(initialChapterId)?.startFrame || ''
	// );
	const [isEnding, setIsEnding] = useState<boolean>(false);
	const [currentEndingId, setCurrentEndingId] = useState<string | null>(null);
	const [currentCharacters, setCurrentCharacters] = useState<
		LnmFrameCharacterData[] | null
	>(null);
	const [currentLocation, setCurrentLocation] = useState<LnmLocation | null>(
		null
	);
	const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);

	const dispatch = useDispatch();
	const knowledge = useSelector(
		(state: RootState) => state.gameState.knowledge
	);
	const currentFrameId = useSelector(
		(state: RootState) => state.gameState.currentFrameId
	);
	const currentChapterId = useSelector(
		(state: RootState) => state.gameState.currentChapterId
	);

	// Initialize the chapter and frame once on mount
	useEffect(() => {
		dispatch(setCurrentChapter(initialChapterId));
		const initialFrameId =
			plot.chapters.get(initialChapterId)?.startFrame || '';
		dispatch(setCurrentFrame(initialFrameId));
	}, [initialChapterId, plot, dispatch]);

	// Utility to get the current frame
	const getCurrentFrame = useCallback((): LnmFrame | undefined => {
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
	}, [
		currentChapterId,
		currentEndingId,
		currentFrameId,
		isEnding,
		plot.frames.endings,
		plot.frames.main,
	]);

	useEffect(() => {
		console.log('useEffect hook: load from initial chapter');
		// Load knowledge for the initial chapter
		const initialChapter = plot.chapters.get(initialChapterId);
		if (initialChapter) {
			dispatch(clearKnowledge());
			dispatch(setKnowledge(initialChapter.knowledge));
		}
	}, [initialChapterId, plot, dispatch]);

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
				console.log(
					`Condition for auto-triggered ending '${ending.id}' is now satisfied: `,
					ending.condition
				);
				setCurrentEndingId(endingId);
				dispatch(setCurrentFrame(ending.startFrame));
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
			console.log('Processing effects for frame:', frameKey);

			for (const effect of effects) {
				const handler = effectHandlers[effect.type];
				if (handler) {
					handler(effect, {
						setCurrentFrameId: (frameId: string) =>
							dispatch(setCurrentFrame(frameId)),
						setCurrentChapterId: (chapterId: string) =>
							dispatch(setCurrentChapter(chapterId)),
						setCurrentEndingId,
						setIsEnding,
						setCurrentCharacters,
						addKnowledge: (knowledgeId: string) =>
							dispatch(addKnowledge(knowledgeId)),
						plot,
						decreaseHealth: (amount: number | 'kill') =>
							dispatch(decreaseHealth(amount)),
						increaseHealth: (amount: number | 'full') =>
							dispatch(increaseHealth(amount)),
					});
				} else {
					console.warn(`Unhandled effect type: ${effect.type}`);
				}
			}
		},
		[currentChapterId, currentFrameId, plot, dispatch]
	);

	// Handle next frame transition
	const handleNextFrame = (nextFrameId: string | null) => {
		if (!nextFrameId) {
			if (!isEnding && autoTriggerEnding()) {
				console.log('Auto triggering ending...');
				// TODO Automatically trigger ending if applicable
				return;
			}

			console.log('No next frame.');
			return; // End of current flow
		}

		if (isEnding && currentEndingId) {
			// Stay within the ending frames
			dispatch(setCurrentFrame(nextFrameId));
		} else {
			// Handle main plot frames
			const chapterFrames = plot.frames.main.get(currentChapterId);

			if (chapterFrames?.has(nextFrameId)) {
				dispatch(setCurrentFrame(nextFrameId));
			} else {
				const nextChapter = plot.chapters.get(nextFrameId);
				if (nextChapter) {
					// clearKnowledge();
					dispatch(setCurrentChapter(nextFrameId));
					dispatch(setCurrentFrame(nextChapter.startFrame));
					// loadChapterKnowledge(nextChapter.knowledge);
				} else {
					console.warn(
						`Frame or chapter not found for ID: ${nextFrameId}`
					);
				}
			}
		}
	};

	const giveUp = () => {
		console.log('Giving up...');
		dispatch(decreaseHealth('kill'));
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
			onGiveUp={giveUp}
			knowledge={knowledge}
			plot={plot}
		/>
	);
};

export default VisualNovelEngine;
