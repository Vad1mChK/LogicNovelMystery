import React, { useState } from 'react';
import '../css/MainPage.scss';

const MainMenu: React.FC = () => {
	const [language, setLanguage] = useState('ru');
	const [isSettingsOpen, setSettingsOpen] = useState(false);
	const [isAboutOpen, setAboutOpen] = useState(false);
	const [isLeaderboardOpen, setLeaderboardOpen] = useState(false);
	const [volume, setVolume] = useState(50);

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
				<button className="button start-game-button">
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
						{language === 'ru' ? 'О игре' : 'About'}
					</button>
				</div>
			</div>

			{/* Затенение фона для модальных окон */}
			{isSettingsOpen || isAboutOpen || isLeaderboardOpen ? (
				<div className="modalOverlay" onClick={closeAllModals}></div>
			) : null}

			{/* Модальное окно с настройками */}
			{isSettingsOpen && (
				<div className="settingsModal">
					<h2>{language === 'ru' ? 'Настройки' : 'Settings'}</h2>
					<label htmlFor="volumeRange">
						{language === 'ru' ? 'Звук:' : 'Volume:'}
					</label>
					<input
						type="range"
						id="volumeRange"
						className="volume-control"
						min="0"
						max="100"
						value={volume}
						onChange={(e) => adjustVolume(Number(e.target.value))}
					/>
					<span>{volume}%</span>
					<div style={{ marginTop: '10px' }}>
						<label htmlFor="languageSelect">
							{language === 'ru' ? 'Язык:' : 'Language:'}
						</label>
						<select
							id="languageSelect"
							onChange={(e) => changeLanguage(e.target.value)}
						>
							<option value="ru">Русский</option>
							<option value="en">English</option>
						</select>
					</div>
					<button className="modalButton" onClick={closeAllModals}>
						{language === 'ru' ? 'Закрыть' : 'Close'}
					</button>
				</div>
			)}

			{/* Модальное окно с описанием игры */}
			{isAboutOpen && (
				<div className="aboutModal">
					<h2>{language === 'ru' ? 'О игре' : 'About the Game'}</h2>
					<p>
						{language === 'ru'
							? 'Это захватывающая игра, в которой вы сможете изучить основы языка Prolog в игровой форме, проходя увлекательные задания, чтобы спасти мир от злодея!'
							: 'This is an exciting game where you can learn Prolog basics while completing thrilling tasks to save the world!'}
					</p>
					<button className="modalButton" onClick={closeAllModals}>
						{language === 'ru' ? 'Закрыть' : 'Close'}
					</button>
				</div>
			)}

			{/* Модальное окно с таблицей лидеров */}
			{isLeaderboardOpen && (
				<div className="leaderboardModal">
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
					<button className="modalButton" onClick={closeAllModals}>
						{language === 'ru' ? 'Закрыть' : 'Close'}
					</button>
				</div>
			)}
		</div>
	);
};

export default MainMenu;
