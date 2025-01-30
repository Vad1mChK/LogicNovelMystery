// FrameRenderer.tsx
import React, { useState } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import HealthBar from './HealthBar';
import TaskWindow from './TaskWindow';
import VolumeSlider from '../settingsComponents/VolumeSlider';
import PanningSlider from '../settingsComponents/PanningSlider';
import '../css/Settings.scss';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { setPanning, setVolume } from '../state/musicSlice';

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
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const handleChoiceSelect = (nextFrameId: string) => {
		onNextFrame(nextFrameId);
	};
	const [isSettingsOpen, setSettingsOpen] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [darkMode, _setDarkMode] = useState(true); // Состояние для темной темы
	const health = useSelector((state: RootState) => state.gameState.health);
	const { volume, panning } = useSelector(
		(state: RootState) => state.musicState
	);
	const adjustVolume = (value: number) => {
		dispatch(setVolume(value));
	};

	const adjustPanning = (value: number) => {
		dispatch(setPanning(value));
	};

	const closeAllModals = () => {
		setSettingsOpen(false);
	};

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
						<button
							className="game-button"
							onClick={() => setSettingsOpen(true)}
							id="settings-button"
						>
							{t('Settings')}
						</button>
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
					{isSettingsOpen && (
						<div id="settings-game">
							<h2>{t('Settings')}</h2>
							<VolumeSlider
								dark={darkMode}
								volume={volume}
								onChange={adjustVolume}
							/>
							<PanningSlider
								dark={darkMode}
								panning={panning || 0}
								onChange={adjustPanning}
							/>
							<button
								className="close-button"
								onClick={closeAllModals}
							>
								{t('Close')}
							</button>
						</div>
					)}
				</>
			)}
			{currentTask && (
				<TaskWindow task={currentTask} onSubmit={onTaskSubmit} />
			)}
			<HealthBar
				hidden={isEnding}
				currentHealth={health}
				maxHealth={100}
			/>
		</div>
	);
};

export default FrameRenderer;
