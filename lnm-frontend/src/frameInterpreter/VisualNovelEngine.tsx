import React, { useState, useEffect, useCallback } from 'react';
import {
	LnmPlot,
	LnmFrameEffect,
	LnmFrame,
	LnmLocation,
	LnmFrameCharacterData,
	LnmTask,
} from './types';
import FrameRenderer from './FrameRenderer';
import { createConditionEvaluator } from './conditionHandlers';
import { effectHandlers } from './effectHandlers';
import { RootState } from '../state/store';
import { useDispatch, useSelector } from 'react-redux';
import {
	clearKnowledge,
	setKnowledge,
	addKnowledge,
	decreaseHealth,
	increaseHealth,
	setCurrentFrame,
	setCurrentChapter,
} from '../state/gameStateSlice.ts';

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
	const [currentTask, setCurrentTask] = useState<LnmTask | null>(null);
	const [_, setTaskOpen] = useState(false);

	const dispatch = useDispatch();
	const knowledge = useSelector(
		(state: RootState) => state.gameState.knowledge
	);
	const health = useSelector((state: RootState) => state.gameState.health);
	const currentFrameId = useSelector(
		(state: RootState) => state.gameState.currentFrameId
	);
	const currentChapterId = useSelector(
		(state: RootState) => state.gameState.currentChapterId
	);

	const evaluateCondition = createConditionEvaluator(() => health);

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
		console.log(`Load from initial chapter: ${initialChapterId}`);
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
	const findSuitableEnding = () => {
		for (const [endingId, ending] of plot.frames.endings.entries()) {
			console.log(
				`Reviewing ending: ${ending.id} with condition ${ending.condition}`
			);
			if (ending.condition && evaluateCondition(ending.condition)) {
				console.log(
					`Condition for auto-triggered ending '${endingId}' is now satisfied: `,
					ending.condition
				);
				// setCurrentEndingId(endingId);
				// dispatch(setCurrentFrame(ending.startFrame));
				// setIsEnding(true);
				return endingId;
			}
		}
		return null;
	};

	// Handle frame effects
	const handleEffects = useCallback(
		(effects: LnmFrameEffect[] | undefined) => {
			if (!effects) return;

			const frameKey = `${currentChapterId}-${currentFrameId}`;
			console.log('Processing effects for frame:', frameKey);

			for (const effect of effects) {
				if (!effect.if || evaluateCondition(effect.if)) {
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
							openTaskWindow: (task: LnmTask) => {
								setCurrentTask(task); // Set the task
								setTaskOpen(true); // Open the task window
							},
						});
					} else {
						console.warn(`Unhandled effect type: ${effect.type}`);
					}
				}
			}
		},
		[currentChapterId, currentFrameId, plot, dispatch]
	);

	// Handle next frame transition
	const handleNextFrame = useCallback(
		(nextFrameId: string | null) => {
			// If we're not currently in an ending, try to auto-trigger one
			if (!isEnding) {
				const endingId = findSuitableEnding();
				if (endingId) {
					console.log(`Auto triggering ending: ${endingId}...`);
					const ending = plot.frames.endings.get(endingId);
					if (ending) {
						setCurrentEndingId(endingId);
						dispatch(setCurrentFrame(ending.startFrame));
						setIsEnding(true);
						return; // Immediately return to avoid executing normal flow
					} else {
						console.warn(
							`Ending data not found for ID: ${endingId}`
						);
					}
				}
			}

			// If no next frame is provided and no ending triggered, end the flow
			if (!nextFrameId) {
				console.log('No next frame.');
				return;
			}

			if (isEnding && currentEndingId) {
				// If we are in ending mode, just set the frame within the ending frames
				dispatch(setCurrentFrame(nextFrameId));
			} else {
				// Handle main plot frames as before
				const chapterFrames = plot.frames.main.get(currentChapterId);

				if (chapterFrames?.has(nextFrameId)) {
					dispatch(setCurrentFrame(nextFrameId));
				} else {
					// Possibly a chapter transition
					const nextChapter = plot.chapters.get(nextFrameId);
					if (nextChapter) {
						// If needed, clearKnowledge();
						dispatch(setCurrentChapter(nextFrameId));
						dispatch(setCurrentFrame(nextChapter.startFrame));
						// loadChapterKnowledge(nextChapter.knowledge) if required
					} else {
						console.warn(
							`Frame or chapter not found for ID: ${nextFrameId}`
						);
					}
				}
			}
		},
		[
			currentChapterId,
			currentEndingId,
			dispatch,
			findSuitableEnding,
			isEnding,
			plot.chapters,
			plot.frames.endings,
			plot.frames.main,
		]
	);

	const giveUp = () => {
		console.log('Giving up...');
		dispatch(decreaseHealth('kill'));
	};

	const handleTaskSubmit = (result: boolean) => {
		setTaskOpen(false);
		if (currentTask) {
			const nextFrameId = result
				? currentTask.nextFrameOnSuccess
				: currentTask.nextFrameOnFailure;

			console.log(`Setting new frame on task submit: ${nextFrameId}`);
			if (nextFrameId) {
				dispatch(setCurrentFrame(nextFrameId));
			}
		}

		if (!result) {
			dispatch(decreaseHealth(10));
		}
		setCurrentTask(null);
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

	useEffect(() => {
		if (health <= 0) {
			console.log('Health reached 0, checking for suitable ending...');
			handleNextFrame(currentFrameId ?? null);
		}
	}, [currentFrameId, handleNextFrame, health]);

	const currentFrame = getCurrentFrame();

	return currentFrame ? (
		<FrameRenderer
			isEnding={isEnding}
			frame={currentFrame}
			currentCharacters={currentCharacters}
			currentSpeaker={currentSpeaker}
			currentLocation={currentLocation}
			currentTask={currentTask}
			onNextFrame={handleNextFrame}
			onGiveUp={giveUp}
			onTaskSubmit={handleTaskSubmit}
			knowledge={knowledge}
			plot={plot}
		/>
	) : (
		<div>{`Frame not found: ${currentFrame}`}</div>
	);
};

export default VisualNovelEngine;
