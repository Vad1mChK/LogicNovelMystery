import React, { useEffect, useState } from 'react';
import steveImage from '../assets/img/steve.webp';
import professorAndVicky from '../assets/img/prof_and_vicky.webp';
import '../css/SelectMode.scss';
import mainPageBackground from '../assets/img/locations/MansionEntrance.webp';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { VITE_SERVER_URL } from '../metaEnv.ts';
import { restoreState } from '../frameInterpreter/communication/restoreState.ts';
import { generateSessionToken } from '../util/generateSessionToken.ts';
import { useDispatch } from 'react-redux';
import { setPlayerState, setProtagonist } from '../state/gameStateSlice.ts';
import { LnmHero, LnmPlayerState } from '../frameInterpreter/types.ts';

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
	const dispatch = useDispatch(); // Используем хук диспатча

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

	// Send session token request to the server
	const sendRequest = async () => {
		const token = localStorage.getItem('sessionToken');
		const isMultiplayer = selectedCharacter === 'Game for two';
		if (token) {
			if (await restoreState(token, isMultiplayer, dispatch)) {
				return true;
			}
			localStorage.removeItem('sessionToken');
			return false;
		}
		return false;
	};

	const createSinglePlayerSession = async () => {
		try {
			const token = generateSessionToken();
			localStorage.setItem('sessionToken', token);
			await axios.post(
				`${VITE_SERVER_URL}/session`,
				{
					token,
					isMultiplayer: false,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: localStorage.getItem('AuthToken'),
					},
				}
			);
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: 'Error occurred during "createSinglePlayerSession"'
			);
		} finally {
			setLoading(false);
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
				await createSinglePlayerSession();
				dispatch(setProtagonist(LnmHero.STEVE));
				dispatch(setPlayerState(LnmPlayerState.PLAYING));
				navigate('/single-player');
			} else if (selectedCharacter === 'Game for two') {
				navigate('/waitRoom');
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
