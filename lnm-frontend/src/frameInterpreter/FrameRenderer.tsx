// FrameRenderer.tsx
import React from 'react';
import {
	LnmFrame,
	LnmFrameCharacterData,
	LnmLocation,
	LnmPlot,
	LnmTask,
} from './types';
import DialogueBox from './DialogueBox';
import CharacterSprite from './CharacterSprite';
import LocationBackground from './LocationBackground';
import { useSelector } from 'react-redux';
import { RootState } from '../state/store';
import HealthBar from './HealthBar.tsx';
import TaskWindow from './TaskWindow';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

interface FrameRendererProps {
	isEnding: boolean;
	frame: LnmFrame;
	plot: LnmPlot;
	currentCharacters: LnmFrameCharacterData[] | null;
	currentSpeaker: string | null;
	currentLocation: LnmLocation | null;
	currentTask: LnmTask | null;
	onNextFrame: (nextFrameId: string) => void;
	onGiveUp: () => void;
	onTaskSubmit: (result: boolean) => void;
}

const FrameRenderer: React.FC<FrameRendererProps> = ({
	isEnding,
	frame,
	plot,
	currentCharacters,
	currentSpeaker,
	currentLocation,
	currentTask,
	onNextFrame,
	onGiveUp,
	onTaskSubmit,
}) => {
	const navigate = useNavigate();
	const handleChoiceSelect = (nextFrameId: string) => {
		onNextFrame(nextFrameId);
	};
	const health = useSelector((state: RootState) => state.gameState.health);

	return (
		<div>
			{currentLocation && (
				<LocationBackground location={currentLocation} />
			)}
			{!currentTask && (
				<>
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
									onClick={() =>
										handleChoiceSelect(choice.nextFrame)
									}
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
					<div className="top-button-bar">
						{!isEnding && (
							<button
								className="game-button give-up-button"
								onClick={onGiveUp}
							>
								{t('game.giveUpButton')}
							</button>
						)}
						<button
							className="game-button"
							onClick={() => navigate('/main')}
						>
							{t('game.homeButton')}
						</button>
					</div>
				</>
			)}
			{currentTask && (
				<TaskWindow task={currentTask} onSubmit={onTaskSubmit} />
			)}
			<HealthBar hidden={isEnding} currentHealth={health} maxHealth={100} />
		</div>
	);
};

export default FrameRenderer;
