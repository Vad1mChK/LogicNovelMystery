// FrameRenderer.tsx
import React, { useState } from 'react';
import { LnmFrame, LnmFrameCharacterData, LnmLocation, LnmPlot } from './types';
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
	const [currentCharacters, setCurrentCharacters] = useState<
		LnmFrameCharacterData[] | null
	>(null);
	const [currentLocation, setCurrentLocation] = useState<LnmLocation | null>(
		null
	);

	if (!currentCharacters && frame.characters) {
		setCurrentCharacters(frame.characters);
	}

	if (!currentLocation && frame.location) {
		const newLocation = plot.locations.get(frame.location);
		if (newLocation) setCurrentLocation(newLocation);
	}

	console.log(currentLocation);

	const handleChoiceSelect = (nextFrameId: string) => {
		onNextFrame(nextFrameId);
	};

	return (
		<div>
			{currentLocation && (
				<LocationBackground location={currentLocation} />
			)}
			{currentCharacters?.map((charData) => {
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
						console.log(frame.nextFrame);
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
