// VisualNovelEngine.tsx
import React, { useState } from 'react';
import { LnmPlot } from './types';
import FrameRenderer from './FrameRenderer';

interface VisualNovelEngineProps {
	plot: LnmPlot;
	startChapterId?: string;
}

const VisualNovelEngine: React.FC<VisualNovelEngineProps> = ({
	plot,
	startChapterId,
}) => {
	// Initialize currentChapterId with startChapterId or the plot’s default start chapter
	const initialChapterId = plot.chapters.has(startChapterId || '')
		? startChapterId!
		: plot.startChapter;

	// Set up state for current chapter and frame IDs
	const [currentChapterId, setCurrentChapterId] =
		useState<string>(initialChapterId);
	const initialFrameId =
		plot.chapters.get(currentChapterId)?.startFrame || '';
	const [currentFrameId, setCurrentFrameId] =
		useState<string>(initialFrameId);

	// Utility to get the current frame
	const getCurrentFrame = () => {
		const chapterFrames = plot.frames.main.get(currentChapterId);
		return chapterFrames?.get(currentFrameId);
	};

	const handleNextFrame = (nextFrameId: string) => {
		const chapterFrames = plot.frames.main.get(currentChapterId);

		if (chapterFrames?.has(nextFrameId)) {
			// If the next frame exists in the current chapter, update the frame only
			setCurrentFrameId(nextFrameId);
		} else {
			// Check if the next frame is the start of a new chapter
			const nextChapter = plot.chapters.get(nextFrameId);
			if (nextChapter) {
				setCurrentChapterId(nextFrameId); // Update chapter
				setCurrentFrameId(nextChapter.startFrame); // Set to the start frame of the new chapter
			} else {
				console.warn(
					`Frame or chapter not found for ID: ${nextFrameId}`
				);
			}
		}
	};

	const currentFrame = getCurrentFrame();

	if (!currentFrame) {
		return <div>Frame not found.</div>;
	}

	return (
		<FrameRenderer
			frame={currentFrame}
			onNextFrame={handleNextFrame}
			plot={plot}
		/>
	);
};

export default VisualNovelEngine;
