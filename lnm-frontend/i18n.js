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
				Language: 'Language',
				Russian: 'Russian',
				English: 'English',
				AboutText:
					'This is an exciting game where you can learn Prolog basics.',
				Name: 'Name',
				Score: 'Score',
				GameMode: 'Game Mode',
				'Refresh in': 'Refresh in',
				Refresh: 'Refresh',
				'sec.': 'sec.',
				Back: 'Back',
				'Select game mode': 'Select game mode',
				'Game for one': 'Game for one',
				'Game for two': 'Game for two',
				'Start Game': 'Start Game',
				'Loading...': 'Loading...',
				Error: 'Error',
				Character1: 'Character 1',
				Character2: 'Character 2',
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
				Volume: 'Звук',
				Language: 'Язык',
				Russian: 'Русский',
				English: 'Английский',
				AboutText:
					'Это захватывающая игра, в которой вы сможете изучить основы языка Prolog.',
				Name: 'Имя',
				Score: 'Итоговый счёт',
				GameMode: 'Режим игры',
				'Refresh in': 'Обновление через',
				Refresh: 'Обновить',
				'sec.': 'сек.',
				Back: 'Назад',
				'Select game mode': 'Выберите режим игры',
				'Game for one': 'Игра для одного',
				'Game for two': 'Игра для двоих',
				'Start Game': 'Начать игру',
				'Loading...': 'Загрузка...',
				Error: 'Ошибка',
				Character1: 'Персонаж 1',
				Character2: 'Персонаж 2',
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
				},
			},
		},
	},
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
