import React, { useEffect, useState } from 'react';
import '../css/MainPage.scss';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Импортируем хук локализации
import defaultMusic from '../assets/music/fon.mp3';
import mainPageBackground from '../assets/img/locations/MansionEntrance.webp';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../state/languageSlice';
import { RootState } from '../state/store.ts';
import VolumeSlider from '../settingsComponents/VolumeSlider';
import PanningSlider from '../settingsComponents/PanningSlider';
import LanguageSelector from '../settingsComponents/LanguageSelector';
import {
	playMusic,
	setCurrentTrack,
	setPanning,
	setVolume,
	togglePlayMusic,
} from '../state/musicSlice.ts';
import { VITE_SERVER_URL } from '../metaEnv';
import leaderboardWorkerScript from '../workers/leaderboardWorker.tsx?worker';
import {
	resetState,
	setPlayerState,
	setProtagonist,
} from '../state/gameStateSlice';
import { LnmHero, LnmPlayerState } from '../frameInterpreter/types';
import { restoreState } from '../frameInterpreter/communication/restoreState';
type GameMode = 'Game for one' | 'Game for two';
interface LeaderboardEntry {
	username: string;
	score: number;
	sessionToken: string;
}

const MainMenu: React.FC = () => {
	const [isSettingsOpen, setSettingsOpen] = useState(false);
	const [isAboutOpen, setAboutOpen] = useState(false);
	const [isLeaderboardOpen, setLeaderboardOpen] = useState(false);
	const navigate = useNavigate();
	const [selectedCharacter, setSelectedCharacter] = useState<GameMode | null>(
		null
	);
	const [_error, setError] = useState<string | null>(null);
	const [darkMode, _setDarkMode] = useState(false); // Состояние для темной темы
	const [disable, setDisable] = useState(true);
	const dispatch = useDispatch();
	const {
		isPlaying: isMusicPlaying,
		volume,
		currentTrack,
		panning,
	} = useSelector((state: RootState) => state.musicState);
	const availableLanguages = [
		{ code: 'ru', label: 'Русский' },
		{ code: 'en', label: 'English' },
	];
	const { t, i18n } = useTranslation(); // Используем локализацию
	const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
		[]
	);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const [isMultiplayer, setIsMultiplayer] = useState(false);
	const [showQuestion, setShowQuestion] = useState(false); // Состояние для пасхалки

	// Устанавливаем музыку при загрузке страницы
	useEffect(() => {
		dispatch(setCurrentTrack(defaultMusic));
		if (!isMusicPlaying) {
			dispatch(playMusic()); // Запускаем музыку, если она не играет
		}
	}, [isMusicPlaying, currentTrack, dispatch]);

	useEffect(() => {
		console.log('Mounted: MainMenu');
		return () => console.log('Unmounted: MainMenu');
	}, []);

	useEffect(() => {
		// Выполняем запрос к серверу только при открытии leaderboard
		if (isLeaderboardOpen) {
			fetchLeaderboardData(isMultiplayer);
		}
	}, [isLeaderboardOpen]); // Добавляем зависимости
	useEffect(() => {
		const savedCharacter = localStorage.getItem(
			'selectedCharacter'
		) as GameMode | null;
		setSelectedCharacter(savedCharacter);
	}, []);
	useEffect(() => {
		const savedSessionToken = localStorage.getItem('sessionToken') as
			| string
			| null;
		setDisable(savedSessionToken === null);
	}, []);
	// Запрос данных с сервера
	const fetchLeaderboardData = async (isMultiplayer: boolean) => {
		try {
			setErrorMessage(null); // Сбрасываем сообщение об ошибке перед запросом
			const response = await axios.post<{
				leaderBoardList: LeaderboardEntry[];
			}>(
				`${VITE_SERVER_URL}/api/leaderboard`,
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
			const leaderBoardList = response.data?.leaderBoardList;
			if (Array.isArray(leaderBoardList)) {
				if (isMultiplayer) {
					// Группируем записи по sessionToken
					const groupedData = leaderBoardList.reduce(
						(
							acc: Record<string, LeaderboardEntry>,
							entry: LeaderboardEntry
						) => {
							if (acc[entry.sessionToken]) {
								acc[entry.sessionToken].username +=
									`, ${entry.username}`;
							} else {
								acc[entry.sessionToken] = { ...entry };
							}
							return acc;
						},
						{}
					);

					// Преобразуем обратно в массив, сортируем и берем топ-10
					const sortedData = Object.values(groupedData)
						.sort(
							(a: LeaderboardEntry, b: LeaderboardEntry) =>
								b.score - a.score
						)
						.slice(0, 10);

					setLeaderboardData(sortedData);
				} else {
					// Для одиночного режима просто сортируем и берем топ-10
					const sortedData = leaderBoardList
						.sort(
							(a: LeaderboardEntry, b: LeaderboardEntry) =>
								b.score - a.score
						)
						.slice(0, 10);

					setLeaderboardData(sortedData);
				}
			} else {
				setErrorMessage(t('Invalid data format from server.'));
			}
		} catch (error) {
			console.error('Error during getting data', error);
			setErrorMessage(
				t(
					'Failed to load leaderboard data. Please check your connection or try again later.'
				)
			);
		}
	};
	// Открытие leaderboard с использованием воркера
	const openLeaderboard = () => {
		const worker = new leaderboardWorkerScript();
		worker.postMessage(null);

		worker.onmessage = (e) => {
			const { type, message } = e.data;
			if (type === 'question') {
				// Пасхалка: показываем вопрос
				console.log(message);
				setShowQuestion(true);
			} else if (type === 'fetch') {
				// Выполняем запрос к серверу
				fetchLeaderboardData(isMultiplayer);
				setLeaderboardOpen(true);
			}
			worker.terminate();
		};
	};

	const handleQuestionResponse = (answer: boolean) => {
		if (answer) {
			// Если "Да", загружаем таблицу лидеров
			fetchLeaderboardData(isMultiplayer);
			setLeaderboardOpen(true);
		}
		setShowQuestion(false); // Закрываем вопрос
	};

	const closeAllModals = () => {
		setSettingsOpen(false);
		setAboutOpen(false);
		setLeaderboardOpen(false);
		setErrorMessage(null);
	};

	const adjustVolume = (value: number) => {
		dispatch(setVolume(value));
	};

	const adjustPanning = (value: number) => {
		dispatch(setPanning(value));
	};

	const changeLanguage = (selectedLanguage: string) => {
		i18n.changeLanguage(selectedLanguage); // Меняем язык
		dispatch(setLanguage(selectedLanguage));
	};

	const continueGame = async () => {
		setDisable(true);
		setError(null);

		try {
			if (await sendRequest()) {
				// Отправляем запрос на сервер
				if (selectedCharacter === 'Game for one') {
					dispatch(setProtagonist(LnmHero.STEVE));
					dispatch(setPlayerState(LnmPlayerState.PLAYING));
					navigate('/single-player');
				} else if (selectedCharacter === 'Game for two') {
					navigate('/waitRoom');
				}
				setDisable(false);
			} else {
				setErrorMessage(t('continue.error'));
			}
		} catch (err) {
			// Показываем сообщение об ошибке
			setErrorMessage(t('continue.error'));
		} finally {
		}
	};
	const sendRequest = async (): Promise<boolean> => {
		const token = localStorage.getItem('sessionToken');
		const isMultiplayer = selectedCharacter === 'Game for two';
		if (token) {
			if (await restoreState(token, isMultiplayer, dispatch)) {
				return true;
			}
			localStorage.removeItem('sessionToken');
			dispatch(resetState());
			localStorage.removeItem('currentFrameId');
			return false;
		}
		return false;
	};
	// Обработчик нажатия на кнопку "Начать игру" с воспроизведением музыки
	const handleStartGame = () => {
		dispatch(playMusic()); // Воспроизведение музыки
		navigate('/select'); // Переход на другую страницу
	};

	const handleExitGame = () => {
		if (isMusicPlaying) {
			dispatch(togglePlayMusic());
		}
		localStorage.removeItem('AuthToken');
		navigate('/'); // Переход на другую страницу
	};

	return (
		<div
			className="background"
			style={{
				backgroundImage: `url(${mainPageBackground})`,
			}}
		>
			<div className="main-container">
				{/* Кнопка "Продолжить" */}
				<button
					className="button"
					onClick={continueGame}
					disabled={disable}
					id="continue-game-button"
				>
					{t('continue.game')}
				</button>
				{errorMessage && (
					<p className="error-message">{errorMessage}</p>
				)}
				{/* Кнопка "Начать игру" */}
				<button
					className="button"
					onClick={handleStartGame}
					id="start-game-button"
				>
					{t('Start game')}
				</button>

				{/* Кнопка "Настройки" */}
				<button
					className="button"
					onClick={() => setSettingsOpen(true)}
					id="settings-button"
				>
					{t('Settings')}
				</button>

				{/* Кнопка "Доска лидеров" */}
				<button
					className="button"
					onClick={openLeaderboard}
					id="leaderboard-button"
				>
					{t('Leaderboard')}
				</button>

				{/* Кнопка "Об игре" */}
				<button
					className="button"
					onClick={() => setAboutOpen(true)}
					id="about-button"
				>
					{t('About')}
				</button>
				{/* Кнопка "Выйти" */}
				<button className="button" onClick={handleExitGame}>
					{t('Exit')}
				</button>
			</div>

			{/* Затенение фона для модальных окон */}
			{isSettingsOpen ||
			isAboutOpen ||
			isLeaderboardOpen ||
			showQuestion ? (
				<div className="modal-overlay" onClick={closeAllModals}></div>
			) : null}

			{/* Модальное окно с настройками */}
			{isSettingsOpen && (
				<div id="settings-modal">
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
					<LanguageSelector
						// id="language-select"
						dark={darkMode}
						currentLanguage={i18n.language}
						languages={availableLanguages}
						onChange={changeLanguage}
					/>
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

			{/* Модальное окно с вопросом (пассхалка) */}
			{showQuestion && (
				<div id="question-modal">
					<h2>{t('Question')}</h2>
					<div className="modal-actions">
						<button onClick={() => handleQuestionResponse(true)}>
							{t('Yes')}
						</button>
						<button onClick={() => handleQuestionResponse(false)}>
							{t('No')}
						</button>
					</div>
				</div>
			)}

			{/* Модальное окно с таблицей лидеров */}
			{isLeaderboardOpen && (
				<div id="leaderboard-modal">
					<h2>{t('Leaderboard')}</h2>
					{errorMessage ? (
						<div className="error-message">
							<p>{errorMessage}</p>
							<button
								className="modal-button"
								onClick={() => setErrorMessage(null)}
							>
								{t('Close')}
							</button>
						</div>
					) : (
						<>
							<div className="mode-selector">
								<div
									className={`mode-box ${
										!isMultiplayer ? 'active' : ''
									}`}
									onClick={() => {
										if (!isMultiplayer) return;
										setIsMultiplayer(false);
										fetchLeaderboardData(false);
									}}
								>
									{t('Single')}
								</div>
								<div
									className={`mode-box ${
										isMultiplayer ? 'active' : ''
									}`}
									onClick={() => {
										if (isMultiplayer) return;
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
											<td>{leader.username}</td>
											<td>{leader.score}</td>
										</tr>
									))}
								</tbody>
							</table>
							<button
								className="modal-button"
								onClick={closeAllModals}
							>
								{t('Close')}
							</button>
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default MainMenu;
