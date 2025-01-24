import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
	fallbackLng: 'en',
	lng: 'en',
	resources: {
		en: {
			translation: {
				landing: {
					welcome: {
						tooltip: 'Welcome',
						title: 'Welcome to',
						about: 'LogicNovelMystery is a browser visual novel where you can learn Prolog basics.',
						controls:
							'To proceed, use control buttons below or directly click the progress bar.',
					},
					objective: {
						tooltip: 'Objective',
						whatIsProlog: {
							title: 'What is Prolog?',
							description:
								'Prolog is a logic declarative programming language.\nIt is often used in AI, linguistics, and knowledge bases.\nHere is an example of Prolog code:',
						},
						yourObjective: {
							title: 'Your Objective',
							description:
								'The world is in danger.\nIn 20 hours, a dangerous virus that can disrupt the global network will be launched.\nBut you have the power to not let this happen.\nLearn Prolog, solve riddles, and stop the virus before it is deployed!',
						},
					},
					playableCharacters: {
						title: 'Playable Characters',
						poses: 'Click on them to see different poses!',
						steve: {
							name: 'Steve',
							description: ', an expertised FBI agent.',
						},
						professor: {
							name: 'Professor',
							description:
								' Langdon, information security expert.',
						},
						vicky: {
							name: 'Vicky',
							description:
								", the Professor's daughter and a promising hacker.",
						},
					},
					gamemode: {
						locations:
							'Click on mini screens to see different locations!',
						single: {
							title: 'Single Player',
							description:
								'Walk through a single campaign and solve easy tasks.\nThe fate of the world rests in your hands alone!',
						},
						multiplayer: {
							title: 'Multiplayer',
							description:
								'Play two different campaigns with a friend.\nThe fate of humanity depends on both of you!',
						},
					},
					ready: {
						title: 'Ready?',
						description:
							"This button will redirect you to the login/register page.\nIf you're already logged in, you'll go straight to the main page.",
						playButton: 'Play ->',
					},
				},
				'Start game': 'Start game',
				Settings: 'Settings',
				Leaderboard: 'Leaderboard',
				About: 'About',
				Close: 'Close',
				Volume: 'Volume',
				waitRoom: {
					userList: 'User List',
					username: 'Username',
					notFound: 'Users not found',
					loading: 'loading users...',
					join: 'Join',
					create: 'Create',
					error: 'Error',
				},
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
				'Invalid data format from server.':
					'Invalid data format from server',
				'Failed to load leaderboard data. Please check your connection or try again later.':
					'Failed to load leaderboard data. Please check your connection or try again later.',
				Question: 'Are you really interested?',
				Yes: 'Yes',
				No: 'No',
				continue: {
					game: 'Continue',
					error: 'Game has not found. You can start a new game.',
				},
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
						wait: {
							single: 'Waiting for the server to let you in...',
							multiplayer: 'Waiting for the partner to join...',
						},
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
					'You have unclosed tabs with our website!':
						'You have unclosed tabs with our website!',
					'Please return to the tab that is already open or close it.':
						'Please return to the tab that is already open or close it.',
				},
			},
		},
		ru: {
			translation: {
				landing: {
					welcome: {
						tooltip: 'Добро пожаловать',
						title: 'Добро пожаловать в',
						about: 'LogicNovelMystery — браузерная визуальная новелла, которая призвана научить вас основам Prolog.',
						controls:
							'Чтобы продолжить, нажимай на кнопки или шкалу прогресса внизу.',
					},
					objective: {
						tooltip: 'Цель игры',
						whatIsProlog: {
							title: 'Что такое Prolog?',
							description:
								'Prolog — декларативный язык логического программирования.\nЕго часто используют в ИИ, лингвистике, базах знаний.\nВот пример кода на Prolog:',
						},
						yourObjective: {
							title: 'Твоя цель',
							description:
								'Мир в опасности!\nЧерез 20 часов будет выпущен вирус, способный внести сбои во всемирную сеть.\nНо ты можешь не допустить этого!\nИзучай Prolog, решай задачи и останови вирус, пока он не запущен!',
						},
					},
					playableCharacters: {
						tooltip: 'Персонажи',
						title: 'Играбельные персонажи',
						poses: 'Нажмите на них, чтобы увидеть разные позы!',
						steve: {
							name: 'Стив',
							description: ', опытный агент ФБР.',
						},
						professor: {
							name: 'Профессор',
							description:
								' Лэнгдон, специалист по защите информации.',
						},
						vicky: {
							name: 'Викки',
							description:
								', дочь Профессора, многообещающий хакер.',
						},
					},
					gamemode: {
						tooltip: 'Gamemodes',
						locations:
							'Нажми на мини-экраны, чтобы увидеть разные локации!',
						single: {
							title: '1 игрок',
							description:
								'Пройди одну кампанию, решая простые задачи.\nВся судьба мира — в твоих руках!',
						},
						multiplayer: {
							title: 'Мультиплеер',
							description:
								'Пройди две кампании вместе с другом.\nСудьба мира зависит от обоих из вас!',
						},
					},
					ready: {
						tooltip: 'Готов?',
						title: 'Готов?',
						description:
							'Эта кнопка перенаправит тебя на страницу логина/регистрации.\nЕсли ты уже вошёл, ты сразу окажешься на главной странице.',
						playButton: 'Играть ->',
					},
				},
				'Start game': 'Начать игру',
				Settings: 'Настройки',
				Leaderboard: 'Доска лидеров',
				About: 'Об игре',
				Close: 'Закрыть',
				Volume: 'Громкость звука',
				waitRoom: {
					userList: 'Список пользователей',
					username: 'Имя пользователя',
					notFound: 'Пользователи не найдены',
					loading: 'Загрузка пользователей...',
					join: 'Присоединиться',
					create: 'Создать',
					error: 'Ошибка',
				},
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
				'Invalid data format from server':
					'Ошибка получения данных с сервера.',
				'Failed to load leaderboard data. Please check your connection or try again later.':
					'Не удалось загрузить данные с сервера. Проверьте соединение или попробуйте позже.',
				Question: 'Тебе действительно интересно?',
				Yes: 'Да',
				No: 'Нет',
				continue: {
					game: 'Продолжить',
					error: 'Игра не найдена. Начните новую игру',
				},
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
						wait: {
							single: 'Ждём, пока сервер вас впустит...',
							multiplayer: 'Ждём, пока присоединится партнёр...',
						},
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
					'You have unclosed tabs with our website!':
						'У Вас есть незакрытые вкладки с нашим сайтом!',
					'Please return to the tab that is already open or close it.':
						'Пожалуйста, вернитесь на уже открытую вкладку или закройте ее.',
				},
			},
		},
	},
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
