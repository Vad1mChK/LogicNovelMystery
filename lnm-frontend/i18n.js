import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
	fallbackLng: 'en',
	lng: 'en',
	resources: {
		en: {
			translation: {
				'Start game': 'Start game',
				Settings: 'Settings',
				Leaderboard: 'Leaderboard',
				About: 'About',
				Close: 'Close',
				Volume: 'Volume',
				panning: {
					panning: 'Panning',
					format: '{{panningValue}} ({{panningConstant}})',
					left: 'Left',
					middle: 'Middle',
					right: 'Right',
				},
				Language: 'Language',
				Russian: 'Russian',
				English: 'English',
				AboutText:
					'This is an exciting game where you can learn Prolog basics.',
				Name: 'Name',
				Score: 'Score',
				Single: 'Single',
				Multi: 'Multiplayer',
				Back: 'Back',
				'Select game mode': 'Select game mode',
				'Game for one': 'Game for one',
				'Game for two': 'Game for two',
				'Start Game': 'Start Game',
				'Loading...': 'Loading...',
				Error: 'Error',
				Exit: 'Exit',
				Character1: 'Character 1',
				Character2: 'Character 2',
				'Invalid data format from server.': 'Invalid data format from server',
				'Failed to load leaderboard data. Please check your connection or try again later.': 'Failed to load leaderboard data. Please check your connection or try again later.',
				Question: 'Are you really interested?',
				Yes: 'Yes',
				No: 'No',
				login: {
					title: 'Login',
					usernamePlaceholder: 'Enter your username',
					passwordPlaceholder: 'Enter your password',
					loginButton: 'Log in',
					noAccount: "Don't have an account?",
					registerLink: 'Register here',
					error: 'Invalid username or password. Please try again.',
				},
				register: {
					title1: 'Register',
					usernamePlaceholder: 'Enter your username',
					passwordPlaceholder: 'Enter your password',
					emailPlaceholder: 'Enter your email',
					registerButton: 'Register',
					successMessage:
						'Registration successful! You can now log in.',
					invalidEmail: 'Please enter a valid email address.',
					genericError:
						'Registration failed. Please check your details and try again.',
					usernameExists: 'This username is already taken.',
					alreadyHaveAccount: 'Already have an account?',
					loginLink: 'Login here',
				},
				game: {
					protagonist: {
						steve: 'Steve',
						vicky: 'Vicky',
						professor: 'Professor',
					},
					knowledgeButton: 'Knowledge',
					giveUpButton: 'Give up',
					homeButton: 'Home',
					knowledgeWindow: {
						facts: 'Facts',
						rules: 'Rules',
					},
					taskWindow: {
						submitButton: 'Submit',
						testButton: 'Test',
						textInput: {
							placeholder: 'Enter your solution here...',
							tabWarning:
								'If you use a Tab, you will be unable to undo the changes before the last tab insertion.',
						},
						syntaxHighlight: {
							copy: 'Copy code',
							clear: 'Clear code',
							restore: 'Restore code',
						},
						hint: {
							hintTitle: 'Hint: ',
							toggle: 'Toggle hint',
						},
					},
					createdWaitScreen: {
						created: 'Game created',
						wait: 'Waiting for the partner to join...',
						willPlayAs: 'You will play as: {{protagonist}}',
					},
					resultWaitScreen: {
						win: 'You won!',
						lose: 'You lost...',
						wait: {
							single: 'Waiting for the response from the server...',
							multiplayer: 'Waiting for partner...',
						},
						pageWillUpdate: {
							single: 'The page will update once the server responds.',
							multiplayer:
								'The page will update once your partner finishes the game.',
						},
					},
					resultScreen: {
						result: {
							SINGLE_BAD: 'You lost...',
							SINGLE_GOOD: 'You won!',
							DOUBLE_BAD: 'You both lost...',
							DOUBLE_AVERAGE: 'You did part of the mission.',
							DOUBLE_GOOD: 'You both won!',
						},
						yourPartner: 'Your partner:',
						yourScore: 'Your score:',
						yourHighScore: 'Your high score:',
						newHighScore: 'New high score!',
						toMain: 'Quit to Main',
					},
				},
				TabErrorPage: {
					'You have unclosed tabs with our website!': 'You have unclosed tabs with our website!',
					'Please return to the tab that is already open or close it.': 'Please return to the tab that is already open or close it.',
				},
			},
		},
		ru: {
			translation: {
				'Start game': 'Начать игру',
				Settings: 'Настройки',
				Leaderboard: 'Доска лидеров',
				About: 'Об игре',
				Close: 'Закрыть',
				Volume: 'Громкость звука',
				panning: {
					panning: 'Панорамирование',
					format: '{{panningValue}} ({{panningConstant}})',
					left: 'Слева',
					middle: 'Посередине',
					right: 'Справа',
				},
				Language: 'Язык',
				Russian: 'Русский',
				English: 'Английский',
				AboutText:
					'Это захватывающая игра, в которой вы сможете изучить основы языка Prolog.',
				Name: 'Имя',
				Score: 'Итоговый счёт',
				Single: 'Одиночный режим',
				Multi: 'Мультиплеер',
				Back: 'Назад',
				'Select game mode': 'Выберите режим игры',
				'Game for one': 'Игра для одного',
				'Game for two': 'Игра для двоих',
				'Start Game': 'Начать игру',
				'Loading...': 'Загрузка...',
				Error: 'Ошибка',
				Character1: 'Персонаж 1',
				Character2: 'Персонаж 2',
				Exit: 'Выйти',
				'Invalid data format from server': 'Ошибка получения данных с сервера.',
				'Failed to load leaderboard data. Please check your connection or try again later.': 'Не удалось загрузить данные с сервера. Проверьте соединение или попробуйте позже.',
				Question: 'Тебе действительно интересно?',
				Yes: 'Да',
				No: 'Нет',
				login: {
					title: 'Вход',
					usernamePlaceholder: 'Введите имя пользователя',
					passwordPlaceholder: 'Введите пароль',
					loginButton: 'Войти',
					noAccount: 'Нет аккаунта?',
					registerLink: 'Зарегистрируйтесь здесь',
					error: 'Неверное имя пользователя или пароль. Попробуйте снова.',
				},
				register: {
					title1: 'Регистрация',
					usernamePlaceholder: 'Введите имя пользователя',
					passwordPlaceholder: 'Введите пароль',
					emailPlaceholder: 'Введите ваш email',
					registerButton: 'Зарегистрироваться',
					successMessage:
						'Регистрация прошла успешно! Теперь вы можете войти.',
					invalidEmail:
						'Пожалуйста, введите корректный адрес электронной почты.',
					genericError:
						'Ошибка регистрации. Пожалуйста, проверьте введённые данные и попробуйте снова.',
					usernameExists: 'Этот пользователь уже зарегистрирован.',
					alreadyHaveAccount: 'Уже есть аккаунт?',
					loginLink: 'Войдите здесь',
				},
				game: {
					protagonist: {
						steve: 'Стив',
						vicky: 'Викки',
						professor: 'Профессор',
					},
					knowledgeButton: 'Знания',
					giveUpButton: 'Сдаться',
					homeButton: 'Домой',
					knowledgeWindow: {
						facts: 'Факты',
						rules: 'Правила',
					},
					taskWindow: {
						submitButton: 'Отправить',
						testButton: 'Протестировать',
						textInput: {
							placeholder: 'Введите своё решение здесь...',
							tabWarning:
								'Если вы используете Tab, вы не сможете отменить изменения до ввода Tab.',
						},
						syntaxHighlight: {
							copy: 'Копировать код',
							clear: 'Очистить поле',
							restore: 'Восстановить код',
						},
						hint: {
							hintTitle: 'Подсказка: ',
							toggle: 'Показать/скрыть',
						},
					},
					createdWaitScreen: {
						created: 'Игра создана',
						wait: 'Ждём, пока присоединится партнёр...',
						willPlayAs: 'Ваш персонаж: {{protagonist}}',
					},
					resultWaitScreen: {
						win: 'Ты выиграл!',
						lose: 'Ты проиграл...',
						wait: {
							single: 'Ожидание ответа от сервера...',
							multiplayer: 'Ожидание партнёра...',
						},
						pageWillUpdate: {
							single: 'Страница обновится, когда сервер ответит.',
							multiplayer:
								'Страница обновится, когда партнёр завершит игру.',
						},
					},
					resultScreen: {
						result: {
							SINGLE_BAD: 'Ты проиграл.',
							SINGLE_GOOD: 'Ты выиграл!',
							DOUBLE_BAD: 'Вы оба проиграли...',
							DOUBLE_AVERAGE: 'Вы выполнили часть миссии.',
							DOUBLE_GOOD: 'Вы оба победили!',
						},
						yourPartner: 'Твой партнёр:',
						yourScore: 'Твой счёт:',
						yourHighScore: 'Твой рекорд:',
						newHighScore: 'Новый рекорд!',
						toMain: 'На главную',
					},
				},
				TabErrorPage: {
					'You have unclosed tabs with our website!': 'У Вас есть незакрытые вкладки с нашим сайтом!',
					'Please return to the tab that is already open or close it.': 'Пожалуйста, вернитесь на уже открытую вкладку или закройте ее.',
				},
			},
		},
	},
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
