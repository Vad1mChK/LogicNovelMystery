import React, { useState } from 'react';
import '../css/MainPage.scss';
import { useNavigate } from 'react-router-dom';

const MainMenu: React.FC = () => {
	const [language, setLanguage] = useState('ru');
	const [isSettingsOpen, setSettingsOpen] = useState(false);
	const [isAboutOpen, setAboutOpen] = useState(false);
	const [isLeaderboardOpen, setLeaderboardOpen] = useState(false);
	const [volume, setVolume] = useState(50);
	const navigate = useNavigate();

	const closeAllModals = () => {
		setSettingsOpen(false);
		setAboutOpen(false);
		setLeaderboardOpen(false);
	};

	const adjustVolume = (value: number) => {
		setVolume(value);
	};

	const changeLanguage = (selectedLanguage: string) => {
		setLanguage(selectedLanguage);
	};

	return (
		<div className="background">
			<div className="main-container">
				{/* Кнопка "Начать игру" */}
				<button className="button" onClick={() => navigate('/select')}>
					{language === 'ru' ? 'Начать игру' : 'Start game'}
				</button>

				{/* Блок с дополнительными кнопками */}
				<div className="side-buttons">
					<button
						className="button"
						onClick={() => setLeaderboardOpen(true)}
					>
						{language === 'ru' ? 'Доска лидеров' : 'Leaderboard'}
					</button>
					<button
						className="button"
						onClick={() => setSettingsOpen(true)}
					>
						{language === 'ru' ? 'Настройки' : 'Settings'}
					</button>
					<button
						className="button"
						onClick={() => setAboutOpen(true)}
					>
						{language === 'ru' ? 'Об игре' : 'About'}
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
					<h2>{language === 'ru' ? 'Настройки' : 'Settings'}</h2>
					<label htmlFor="volume-range">
						{language === 'ru' ? 'Звук:' : 'Volume:'}
					</label>
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
							{language === 'ru' ? 'Язык:' : 'Language:'}
						</label>
						<select
							id="language-select"
							onChange={(e) => changeLanguage(e.target.value)}
						>
							<option value="ru">Русский</option>
							<option value="en">English</option>
						</select>
					</div>
					<button className="modal-button" onClick={closeAllModals}>
						{language === 'ru' ? 'Закрыть' : 'Close'}
					</button>
				</div>
			)}

			{/* Модальное окно с описанием игры */}
			{isAboutOpen && (
				<div id="about-modal">
					<h2>{language === 'ru' ? 'Об игре' : 'About the Game'}</h2>
					<p>
						{language === 'ru'
							? 'Это захватывающая игра, в которой вы сможете изучить основы языка Prolog в игровой форме, проходя увлекательные задания, чтобы спасти мир от злодея!'
							: 'This is an exciting game where you can learn Prolog basics while completing thrilling tasks to save the world!'}
					</p>
					<button className="modal-button" onClick={closeAllModals}>
						{language === 'ru' ? 'Закрыть' : 'Close'}
					</button>
				</div>
			)}

			{/* Модальное окно с таблицей лидеров */}
			{isLeaderboardOpen && (
				<div id="leaderboard-modal">
					<h2>
						{language === 'ru' ? 'Доска лидеров' : 'Leaderboard'}
					</h2>
					<table>
						<thead>
							<tr>
								<th>№</th>
								<th>{language === 'ru' ? 'Имя' : 'Name'}</th>
								<th>
									{language === 'ru'
										? 'Итоговый счёт'
										: 'Score'}
								</th>
								<th>
									{language === 'ru'
										? 'Режим игры'
										: 'Game Mode'}
								</th>
							</tr>
						</thead>
						<tbody>
							{/* Динамически добавленные строки таблицы будут здесь */}
						</tbody>
					</table>
					<button className="modal-button" onClick={closeAllModals}>
						{language === 'ru' ? 'Закрыть' : 'Close'}
					</button>
				</div>
			)}
		</div>
	);
};

export default MainMenu;
