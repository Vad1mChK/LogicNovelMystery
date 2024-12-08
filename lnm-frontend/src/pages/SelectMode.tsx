import React, { useState, useEffect } from 'react';
import steveImage from '../assets/img/characters/steve/idle.webp';
import professorAndVicky from '../assets/img/professorAndVicky.png';
import '../css/SelectMode.scss';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Типизация для режима игры
type GameMode = 'Game for one' | 'Game for two';

const GameSelection: React.FC = () => {
	const [selectedCharacter, setSelectedCharacter] = useState<GameMode | null>(
		null
	);
	const navigate = useNavigate();
	const { t } = useTranslation(); // Подключаем локализацию

	// Load selected character from localStorage on component mount
	useEffect(() => {
		const savedCharacter = localStorage.getItem(
			'selectedCharacter'
		) as GameMode | null;
		setSelectedCharacter(savedCharacter);
	}, []);

	// Select a game mode and save it to localStorage
	const selectCharacter = (character: GameMode) => {
		setSelectedCharacter(character);
		localStorage.setItem('selectedCharacter', character);
	};

	// Start the game (add your game start logic here)
	const startGame = () => {
		// Redirect based on selected character
		if (selectedCharacter === 'Game for one') {
			navigate('/single-player');
		} else if (selectedCharacter === 'Game for two') {
			navigate('/multi-player');
		}
	};

	// Go back to the previous page or perform another action
	const goBack = () => {
		window.history.back();
	};

	return (
		<div className="background">
			<div className="center-container">
				{/* Corrected onClick handler */}
				<button className="back-button" onClick={goBack}>
					{t('Back')}
				</button>
				<h1>{t('Select game mode')}</h1>
				<div className="hr"></div>
				<div className="character-selection">
					<div className="character-card-container">
						<div
							className={`character-card ${selectedCharacter === 'Game for one' ? 'selected' : ''}`}
							onClick={() => selectCharacter('Game for one')}
						>
							<img
								src={steveImage}
								alt={t('Character1')}
								className="character-image"
							/>
						</div>
						<p className="character-name">{t('Game for one')}</p>
					</div>

					<div className="character-card-container">
						<div
							className={`character-card ${selectedCharacter === 'Game for two' ? 'selected' : ''}`}
							onClick={() => selectCharacter('Game for two')}
						>
							<img
								src={professorAndVicky}
								alt={t('Character2')}
								className="character-image"
							/>
						</div>
						<p className="character-name">{t('Game for two')}</p>
					</div>
				</div>
				<button
					className="start-game-button"
					onClick={startGame}
					disabled={!selectedCharacter} // Disable button if no character selected
				>
					{t('Start Game')}
				</button>
			</div>
		</div>
	);
};

export default GameSelection;
