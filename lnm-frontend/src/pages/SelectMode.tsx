import React, { useState, useEffect } from 'react';
import steveImage from '../assets/img/characters/steve/idle.webp';
import professorAndVicky from '../assets/img/professorAndVicky.png';
import '../css/SelectMode.scss';
import { useNavigate } from 'react-router-dom';

// Типизация для режима игры
type GameMode = 'Game for one' | 'Game for two';

const GameSelection: React.FC = () => {
	const [selectedCharacter, setSelectedCharacter] = useState<GameMode | null>(
		null
	);
	const navigate = useNavigate();

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
		// window.location.href = ''; // Replace with the actual URL or logic to start the game
		navigate('/single-player');
	};

	// Go back to the previous page or perform another action
	const goBack = () => {
		// This could be window.history.back(), or any other logic for going back
		window.history.back();
	};

	return (
		<div className="background">
			<div className="center-container">
				{/* Corrected onClick handler */}
				<button className="back-button" onClick={goBack}>
					Back
				</button>
				<h1>Select game mode</h1>
				<div className="hr"></div>
				<div className="character-selection">
					<div className="character-card-container">
						<div
							className={`character-card ${selectedCharacter === 'Game for one' ? 'selected' : ''}`}
							onClick={() => selectCharacter('Game for one')}
						>
							<img
								src={steveImage}
								alt="Персонаж 1"
								className="character-image"
							/>
						</div>
						<p className="character-name">Game for one</p>
					</div>

					<div className="character-card-container">
						<div
							className={`character-card ${selectedCharacter === 'Game for two' ? 'selected' : ''}`}
							onClick={() => selectCharacter('Game for two')}
						>
							<img
								src={professorAndVicky}
								alt="Персонаж 2"
								className="character-image"
							/>
						</div>
						<p className="character-name">Game for two</p>
					</div>
				</div>
				<button className="start-game-button" onClick={startGame}>
					Start Game
				</button>
			</div>
		</div>
	);
};

export default GameSelection;
