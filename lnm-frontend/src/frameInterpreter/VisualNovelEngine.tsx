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
	decreaseHealth,
	increaseHealth,
	setCurrentFrame,
	setCurrentChapter,
} from '../state/gameStateSlice.ts';
import { reportCampaign } from './communication/reportCampaign.ts';

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
		const chapterFrames = plot.frames.main.get(currentChapterId);
		return chapterFrames?.get(currentFrameId);
	}, [
		currentChapterId,
		currentEndingId,
		currentFrameId,
		isEnding,
		plot.frames.main,
	]);

	useEffect(() => {
		console.log(`Load from initial chapter: ${initialChapterId}`);
		// Load knowledge for the initial chapter
		// const initialChapter = plot.chapters.get(initialChapterId);
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

	// Handle frame effects
	const handleEffects = useCallback(
		(effects: LnmFrameEffect[] | undefined) => {
			if (!effects) return;

			const frameKey = `${currentChapterId}-${currentFrameId}`;
			console.log('Processing effects for frame:', frameKey);

			console.log(effects);

			for (const effect of effects) {
				if (!effect.if || evaluateCondition(effect.if)) {
					const handler = effectHandlers[effect.type];
					if (handler) {
						handler(effect, {
							reportCampaign: (eEEi) => eEEi,
							setCurrentFrameId: (frameId: string) =>
								dispatch(setCurrentFrame(frameId)),
							setCurrentChapterId: (chapterId: string) =>
								dispatch(setCurrentChapter(chapterId)),
							setCurrentEndingId,
							setIsEnding,
							setCurrentCharacters,
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
			// If no next frame is provided and no ending triggered, end the flow
			if (!nextFrameId) {
				console.log('No next frame.');
				return;
			}

			if (currentEndingId && !isEnding) {
				dispatch(setCurrentChapter(currentEndingId));
				dispatch(
					setCurrentFrame(
						plot.chapters.get(currentEndingId)?.startFrame ?? ''
					)
				);
				setIsEnding(true);
				return;
			}

			// Handle main plot frames as before
			const chapterFrames = plot.frames.main.get(currentChapterId);

			if (chapterFrames?.has(nextFrameId)) {
				dispatch(setCurrentFrame(nextFrameId));
			} else {
				// Possibly a chapter transition
				const nextChapter = plot.chapters.get(nextFrameId);
				if (nextChapter) {
					dispatch(setCurrentChapter(nextFrameId));
					dispatch(setCurrentFrame(nextChapter.startFrame));
				} else {
					console.warn(
						`Frame or chapter not found for ID: ${nextFrameId}`
					);
				}
			}
		},
		[
			currentChapterId,
			currentEndingId,
			dispatch,
			isEnding,
			plot.chapters,
			plot.frames.main,
		]
	);

	const giveUp = () => {
		console.log('Giving up...');
		dispatch(decreaseHealth('kill'));
		// No auto-trigger
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
		if (health <= 0 && !isEnding) {
			console.log('Health reached 0, giving up');
			reportCampaign(false)
				.then((response) => {
					setCurrentEndingId(response.endingId);
					handleNextFrame(currentFrameId ?? null);
				})
				.catch((e) => {
					console.error('Error reporting campaign:', e);
				});
		}
	}, [currentFrameId, handleNextFrame, health, isEnding]);

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
			plot={plot}
		/>
	) : (
		<div>{`Frame not found: ${currentFrame}`}</div>
	);
};

export default VisualNovelEngine;
