import React, { useContext, useEffect, useState } from 'react';
import '../css/MainPage.scss';
import { useNavigate } from 'react-router-dom';
import { AudioContext } from '../pages/AudioContext';
import { useTranslation } from 'react-i18next'; // Импортируем хук локализации
import defaultMusic from '../assets/music/fon.mp3';
import mainPageBackground from '../assets/img/locations/MansionEntrance.webp';

const MainMenu: React.FC = () => {
	const [isSettingsOpen, setSettingsOpen] = useState(false);
	const [isAboutOpen, setAboutOpen] = useState(false);
	const [isLeaderboardOpen, setLeaderboardOpen] = useState(false);
	const [volume, setVolume] = useState(50);
	const navigate = useNavigate();

	const { isMusicPlaying, toggleMusic, setMusicFile } =
		useContext(AudioContext)!;
	const { t, i18n } = useTranslation(); // Используем локализацию

	// Устанавливаем музыку при загрузке страницы
	useEffect(() => {
		setMusicFile(defaultMusic);
		if (!isMusicPlaying) {
			toggleMusic(); // Запускаем музыку, если она не играет
		}
	}, []);

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
						className="button"
						onClick={() => setLeaderboardOpen(true)}
					>
						{t('Leaderboard')}
					</button>
					<button
						className="button"
						onClick={() => setSettingsOpen(true)}
					>
						{t('Settings')}
					</button>
					<button
						className="button"
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
							{/* Динамически добавленные строки таблицы будут здесь */}
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
