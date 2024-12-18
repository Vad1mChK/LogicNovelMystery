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
	gameMode: string;
}

//todo del cause it's just a mock data
const fallbackLeaderboardData = [
	{ name: 'Иванов', score: 100, gameMode: 'Single' },
	{ name: 'Петров', score: 90, gameMode: 'Single' },
	{ name: 'Сидоров', score: 80, gameMode: 'Single' },
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

	const [isRefreshDisabled, setRefreshDisabled] = useState(false);
	const [timer, setTimer] = useState(0);

	// Устанавливаем музыку при загрузке страницы
	useEffect(() => {
		setMusicFile(defaultMusic);
		if (!isMusicPlaying) {
			toggleMusic(); // Запускаем музыку, если она не играет
		}
	}, []);

	useEffect(() => {
		console.log('Mounted: MainMenu');
		return () => console.log('Unmounted: MainMenu');
	}, []);

	// Запрос данных с сервера
	const fetchLeaderboardData = async () => {
		try {
			const response = await axios.get('/api/leaderboard'); // Замените на ваш URL
			if (Array.isArray(response.data)) {
				setLeaderboardData(response.data);
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
	// Деактивация кнопки Refresh с таймером
	const handleRefresh = () => {
		setRefreshDisabled(true);
		setTimer(90); // 1:30 = 90 секунд
		fetchLeaderboardData();

		const countdown = setInterval(() => {
			setTimer((prev) => {
				if (prev <= 1) {
					clearInterval(countdown);
					setRefreshDisabled(false);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	useEffect(() => {
		if (isLeaderboardOpen) fetchLeaderboardData();
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

	return (
		<div
			className="background"
			style={{
				backgroundImage: `url(${mainPageBackground})`,
			}}
		>
			<div className="main-container">
				{/* Кнопка "Начать игру" */}
				<button className="button" onClick={() => navigate('/select')}>
					{t('Start game')}
				</button>

				{/* Блок с дополнительными кнопками */}
				<div className="side-buttons">
					<button
						className="button leaderboard-button"
						onClick={() => setLeaderboardOpen(true)}
					>
						{t('Leaderboard')}
					</button>
					<button
						className="button settings-button"
						onClick={() => setSettingsOpen(true)}
					>
						{t('Settings')}
					</button>
					<button
						className="button about-button"
						onClick={() => setAboutOpen(true)}
					>
						{t('About')}
					</button>
				</div>
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
					<table>
						<thead>
							<tr>
								<th>№</th>
								<th>{t('Name')}</th>
								<th>{t('Score')}</th>
								<th>{t('GameMode')}</th>
							</tr>
						</thead>
						<tbody>
							{leaderboardData.map((leader, index) => (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>{leader.name}</td>
									<td>{leader.gameMode}</td>
									<td>{leader.score}</td>
								</tr>
							))}
						</tbody>
					</table>
					<button
						className="modal-button"
						onClick={handleRefresh}
						disabled={isRefreshDisabled}
					>
						{isRefreshDisabled
							? `${t('Refresh in')} ${timer} ${t('sec.')}`
							: t('Refresh')}
					</button>
					<button className="modal-button" onClick={closeAllModals}>
						{t('Close')}
					</button>
				</div>
			)}
		</div>
	);
};

export default MainMenu;
