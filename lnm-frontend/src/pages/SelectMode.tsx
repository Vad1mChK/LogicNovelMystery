import React, { useState, useEffect } from 'react';
import steveImage from '../assets/img/steve.webp';
import professorAndVicky from '../assets/img/prof_and_vicky.webp';
import '../css/SelectMode.scss';
import mainPageBackground from '../assets/img/locations/MansionEntrance.webp';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// Типизация для режима игры
type GameMode = 'Game for one' | 'Game for two';

const GameSelection: React.FC = () => {
	const [selectedCharacter, setSelectedCharacter] = useState<GameMode | null>(
		null
	);
	const navigate = useNavigate();
	const { t } = useTranslation(); // Подключаем локализацию
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

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

	// Generate a random session token
	const generateToken = () => {
		const array = new Uint8Array(24); // 24 байта -> ~32 символа в Base64
		window.crypto.getRandomValues(array);
		return btoa(String.fromCharCode(...array))
			.replace(/\+/g, '-')
			.replace(/\//g, '_')
			.replace(/=+$/, ''); // Убираем '=' в конце
	};

	// Send session token request to the server
	const sendRequest = async () => {
		const sessionToken = generateToken();
		try {
			/*const result = */ await axios.post(
				'http://localhost:8080/session', // Замените на ваш API-эндпоинт
				{ sessionToken }, // Токен передается в теле запроса
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: localStorage.getItem('AuthToken'),
					},
				}
			);
			// Сохраняем токен JWT в localStorage
			localStorage.setItem('sessionToken', sessionToken);
		} catch (err) {
			// Устанавливаем сообщение об ошибке
			throw new Error(
				err instanceof Error ? err.message : 'An unknown error occurred'
			);
		}
	};

	// Start the game (add your game start logic here)
	const startGame = async () => {
		setLoading(true);
		setError(null);

		try {
			await sendRequest(); // Отправляем запрос на сервер
			// Redirect based on selected character
			if (selectedCharacter === 'Game for one') {
				navigate('/single-player');
			} else if (selectedCharacter === 'Game for two') {
				navigate('/multi-player');
			}
		} catch (err) {
			// Показываем сообщение об ошибке
			setError(
				err instanceof Error
					? err.message
					: 'Error occurred during "sendRequest"'
			);
		} finally {
			setLoading(false);
		}
	};

	// Go back to the previous page or perform another action
	const goBack = () => {
		window.history.back();
	};

	return (
		<div
			className="background"
			style={{
				backgroundImage: `url(${mainPageBackground})`,
			}}
		>
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
					disabled={!selectedCharacter || loading} // Disable button if no character selected or loading
				>
					{loading ? t('Loading...') : t('Start Game')}
				</button>
				{error && (
					<p className="error-message">
						{t('Error')}: {error}
					</p>
				)}
			</div>
		</div>
	);
};

export default GameSelection;
