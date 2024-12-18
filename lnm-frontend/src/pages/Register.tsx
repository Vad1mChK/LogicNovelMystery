import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import * as Sentry from '@sentry/react';
import { useTranslation } from 'react-i18next';

const Register: React.FC = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const navigate = useNavigate();
	const { t } = useTranslation();

	const isValidEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleRegister = async () => {
		setError(null); // Сброс ошибки перед попыткой регистрации
		setSuccess(null);

		// Проверяем формат email перед отправкой
		if (!isValidEmail(email)) {
			setError(t('register.invalidEmail')); // Используем перевод для ошибки email
			return;
		}

		try {
			await axios.post(
				'http://localhost:8080/auth/register',
				{ name: username, email, password },
				{ headers: { 'Content-Type': 'application/json' } }
			);

			setSuccess(t('register.successMessage')); // Локализованное сообщение об успехе

			// Перенаправление на страницу входа после успешной регистрации
			navigate('/auth/login');
		} catch (error) {
			console.error('Registration error:', error);

			// Отправка ошибки в Sentry
			Sentry.captureException(error);

			setError(t('register.genericError')); // Локализованное сообщение об ошибке

			// Проверка, если пользователь уже зарегистрирован
			if (
				(error as AxiosError).response &&
				(error as AxiosError).response?.data ===
					'Registration failed: Username already exists'
			) {
				setError(t('register.usernameExists')); // Локализованное сообщение о существующем пользователе
			} else {
				setError(t('register.genericError')); // Локализованное сообщение о серверной ошибке
			}
		}
	};

	return (
		<div className="form-container">
			<h2>{t('register.title1')}</h2> {/* Локализованное название */}
			{error && <p className="error-message">{error}</p>}
			<input
				type="text"
				className="input-field"
				placeholder={t('register.usernamePlaceholder')} // Локализация плейсхолдера
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<input
				type="text"
				className="input-field"
				placeholder={t('register.emailPlaceholder')} // Локализация плейсхолдера
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				type="password"
				className="input-field"
				placeholder={t('register.passwordPlaceholder')} // Локализация плейсхолдера
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button onClick={handleRegister}>
				{t('register.registerButton')}
			</button>{' '}
			{/* Локализованная кнопка */}
			{success && <p className="success-message">{success}</p>}
			<p>
				{t('register.alreadyHaveAccount')}{' '}
				<Link to="/auth/login">{t('register.loginLink')}</Link>
			</p>
		</div>
	);
};

export default Register;
