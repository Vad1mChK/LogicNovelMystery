// FrameRenderer.tsx
import React from 'react';
import { LnmFrame, LnmPlot } from './types';
import DialogueBox from './DialogueBox';
import CharacterSprite from './CharacterSprite';
import LocationBackground from './LocationBackground';

interface FrameRendererProps {
	frame: LnmFrame;
	plot: LnmPlot;
	onNextFrame: (nextFrameId: string) => void;
}

const FrameRenderer: React.FC<FrameRendererProps> = ({
	frame,
	plot,
	onNextFrame,
}) => {
	const location = plot.locations.get(frame.location);

	const handleChoiceSelect = (nextFrameId: string) => {
		onNextFrame(nextFrameId);
	};

	return (
		<div>
			{location && <LocationBackground location={location} />}
			{frame.characters?.map((charData) => {
				const character = plot.characters.get(charData.id);
				return character ? (
					<CharacterSprite
						key={charData.id}
						character={character}
						characterData={charData}
					/>
				) : null;
			})}
			<DialogueBox speaker={frame.speaker} text={frame.dialogue} />
			{frame.choices && (
				<div className="choices">
					{frame.choices.map((choice, index) => (
						<button
							key={index}
							onClick={() => handleChoiceSelect(choice.nextFrame)}
						>
							{choice.text}
						</button>
					))}
				</div>
			)}
			{!frame.choices && frame.nextFrame && (
				<button
					onClick={() => {
						if (frame.nextFrame) onNextFrame(frame.nextFrame);
					}}
				>
					Next
				</button>
			)}
		</div>
	);
};

export default FrameRenderer;
