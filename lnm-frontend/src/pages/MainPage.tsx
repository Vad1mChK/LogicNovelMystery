import React, { useContext, useEffect, useState } from 'react';
import '../css/MainPage.scss';
import { useNavigate } from 'react-router-dom';
import { AudioContext } from './AudioContext';
import { useTranslation } from 'react-i18next'; // Импортируем хук локализации
import defaultMusic from '../assets/music/fon.mp3';
import mainPageBackground from '../assets/img/locations/MansionEntrance.webp';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLanguage } from '../state/languageSlice';

interface LeaderboardEntry {
	score: number;
	name: string;
}

//todo del cause it's just a mock data
const fallbackLeaderboardData = [
	{ name: 'Иванов', score: 100 },
	// eslint-disable-next-line no-magic-numbers
	{ name: 'Петров', score: 90 },
	// eslint-disable-next-line no-magic-numbers
	{ name: 'Сидоров', score: 80 },
];

const MainMenu: React.FC = () => {
	const [isSettingsOpen, setSettingsOpen] = useState(false);
	const [isAboutOpen, setAboutOpen] = useState(false);
	const [isLeaderboardOpen, setLeaderboardOpen] = useState(false);
	const navigate = useNavigate();

	const dispatch = useDispatch();

	const { isMusicPlaying, toggleMusic, setMusicFile, volume, setVolume } =
		useContext(AudioContext)!;
	const { t, i18n } = useTranslation(); // Используем локализацию

	//todo replace without mock
	const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
		fallbackLeaderboardData
	);

	const [isMultiplayer, setIsMultiplayer] = useState(false);

	// Устанавливаем музыку при загрузке страницы
	useEffect(() => {
		setMusicFile(defaultMusic);
		if (!isMusicPlaying) {
			toggleMusic(); // Запускаем музыку, если она не играет
		}
	}, [isMusicPlaying, setMusicFile, toggleMusic]);

	useEffect(() => {
		console.log('Mounted: MainMenu');
		return () => console.log('Unmounted: MainMenu');
	}, []);
	// Запрос данных с сервера
	const fetchLeaderboardData = async (isMultiplayer: boolean) => {
		try {
			const response = await axios.post(
				'http://localhost:8080/api/leaderboard',
				{
					isMultiplayer,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: localStorage.getItem('AuthToken'),
					},
				}
			);
			if (Array.isArray(response.data)) {
				const sortedData = response.data
					.sort(
						(a: LeaderboardEntry, b: LeaderboardEntry) =>
							b.score - a.score
					)
					.slice(0, 10);
				setLeaderboardData(sortedData);
			} else {
				//todo replace mock and add locale
				console.warn(
					'Некорректный формат данных от сервера, используем заглушку.'
				);
				setLeaderboardData(fallbackLeaderboardData); // Используем заглушку
			}
		} catch (error) {
			//todo replace mock and add locale
			console.error('Ошибка при запросе данных:', error);
			setLeaderboardData(fallbackLeaderboardData); // Используем заглушку
		}
	};

	useEffect(() => {
		if (isLeaderboardOpen) fetchLeaderboardData(false);
	}, [isLeaderboardOpen]);

	const closeAllModals = () => {
		setSettingsOpen(false);
		setAboutOpen(false);
		setLeaderboardOpen(false);
	};

	const adjustVolume = (value: number) => {
		setVolume(value);
	};

	const changeLanguage = (selectedLanguage: string) => {
		i18n.changeLanguage(selectedLanguage); // Меняем язык
		dispatch(setLanguage(selectedLanguage));
	};

	// Воспроизведение музыки
	const playMusic = () => {
		const audio = new Audio(defaultMusic);
		audio.play().catch((err) => {
			console.error('Ошибка при попытке воспроизвести музыку:', err);
		});
	};

	// Обработчик нажатия на кнопку "Начать игру" с воспроизведением музыки
	const handleStartGame = () => {
		playMusic(); // Воспроизведение музыки
		navigate('/select'); // Переход на другую страницу
	};

	return (
		<div
			className="background"
			style={{
				backgroundImage: `url(${mainPageBackground})`,
			}}
		>
			<div className="main-container">
				{/* Кнопка "Начать игру" слева */}
				<button
					className="button left-button"
					onClick={handleStartGame}
					id="start-game-button"
				>
					{t('Start game')}
				</button>

				{/* Кнопка "Настройки" по центру сверху */}
				<button
					className="button top-button"
					onClick={() => setSettingsOpen(true)}
					id="settings-button"
				>
					{t('Settings')}
				</button>

				{/* Кнопка "Доска лидеров" справа */}
				<button
					className="button right-button"
					onClick={() => setLeaderboardOpen(true)}
					id="leaderboard-button"
				>
					{t('Leaderboard')}
				</button>

				{/* Кнопка "Об игре" справа */}
				<button
					className="button right-button"
					onClick={() => setAboutOpen(true)}
					id="about-button"
				>
					{t('About')}
				</button>
			</div>

			{/* Затенение фона для модальных окон */}
			{isSettingsOpen || isAboutOpen || isLeaderboardOpen ? (
				<div className="modal-overlay" onClick={closeAllModals}></div>
			) : null}

			{/* Модальное окно с настройками */}
			{isSettingsOpen && (
				<div id="settings-modal">
					<h2>{t('Settings')}</h2>
					<label htmlFor="volume-range">{t('Volume')}:</label>
					<input
						type="range"
						id="volume-range"
						className="volume-control"
						min="0"
						max="100"
						value={volume}
						onChange={(e) => adjustVolume(Number(e.target.value))}
					/>
					<span>{volume}%</span>
					<div style={{ marginTop: '10px' }}>
						<label htmlFor="language-select">
							{t('Language')}:
						</label>
						<select
							id="language-select"
							value={i18n.language} // Устанавливаем текущее значение языка
							onChange={(e) => changeLanguage(e.target.value)} // Слушаем изменения
						>
							<option value="ru">{t('Russian')}</option>
							<option value="en">{t('English')}</option>
						</select>
					</div>
					<button className="modal-button" onClick={closeAllModals}>
						{t('Close')}
					</button>
				</div>
			)}

			{/* Модальное окно с описанием игры */}
			{isAboutOpen && (
				<div id="about-modal">
					<h2>{t('About')}</h2>
					<p>{t('AboutText')}</p>
					<button className="modal-button" onClick={closeAllModals}>
						{t('Close')}
					</button>
				</div>
			)}

			{/* Модальное окно с таблицей лидеров */}
			{isLeaderboardOpen && (
				<div id="leaderboard-modal">
					<h2>{t('Leaderboard')}</h2>
					<div className="mode-selector">
						<div
							className={`mode-box ${!isMultiplayer ? 'active' : ''}`}
							onClick={() => {
								if (!isMultiplayer) return; // Если кнопка уже активна, ничего не делаем
								setIsMultiplayer(false);
								fetchLeaderboardData(false);
							}}
						>
							{t('Single')}
						</div>
						<div
							className={`mode-box ${isMultiplayer ? 'active' : ''}`}
							onClick={() => {
								if (isMultiplayer) return; // Если кнопка уже активна, ничего не делаем
								setIsMultiplayer(true);
								fetchLeaderboardData(true);
							}}
						>
							{t('Multi')}
						</div>
					</div>
					<table>
						<thead>
							<tr>
								<th>№</th>
								<th>{t('Name')}</th>
								<th>{t('Score')}</th>
							</tr>
						</thead>
						<tbody>
							{leaderboardData.map((leader, index) => (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{leader.name}</td>
									<td>{leader.score}</td>
								</tr>
							))}
						</tbody>
					</table>
					<button className="modal-button" onClick={closeAllModals}>
						{t('Close')}
					</button>
				</div>
			)}
		</div>
	);
};

export default MainMenu;
