// FrameRenderer.tsx
import React, { useState } from 'react';
import { LnmFrame, LnmFrameCharacterData, LnmLocation, LnmPlot } from './types';
import DialogueBox from './DialogueBox';
import CharacterSprite from './CharacterSprite';
import LocationBackground from './LocationBackground';
// import '../css/FrameInterpreter.scss';
import KnowledgeWindow from './KnowledgeWindow.tsx';

interface FrameRendererProps {
	frame: LnmFrame;
	plot: LnmPlot;
	currentCharacters: LnmFrameCharacterData[] | null;
	currentSpeaker: string | null;
	currentLocation: LnmLocation | null;
	knowledge: string[];
	onNextFrame: (nextFrameId: string) => void;
}

const FrameRenderer: React.FC<FrameRendererProps> = ({
	frame,
	plot,
	currentCharacters,
	currentSpeaker,
	currentLocation,
	knowledge,
	onNextFrame,
}) => {
	const handleChoiceSelect = (nextFrameId: string) => {
		onNextFrame(nextFrameId);
	};
	const [isKnowledgeOpen, setKnowledgeOpen] = useState(false);

	const knowledgeDetails = knowledge
		.map((id) => plot.knowledge.get(id))
		.filter((knw) => !!knw);

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
						isSpeaker={character.id == currentSpeaker}
						characterData={charData}
					/>
				) : null;
			})}
			<DialogueBox
				speakerName={
					plot.characters.get(currentSpeaker ?? '')?.name ??
					currentSpeaker ??
					undefined
				}
				text={frame.dialogue}
			/>
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
					className="next-frame-button game-button"
					onClick={() => onNextFrame(frame.nextFrame!)}
				>
					-&gt;
				</button>
			)}
			<button
				className="view-knowledge-button game-button"
				onClick={() => setKnowledgeOpen(true)}
			>
				Знания
			</button>
			{isKnowledgeOpen && (
				<KnowledgeWindow
					knowledge={knowledgeDetails}
					onClose={() => setKnowledgeOpen(false)}
				/>
			)}
		</div>
	);
};

export default FrameRenderer;
