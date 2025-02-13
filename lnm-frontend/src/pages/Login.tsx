import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Sentry from '@sentry/react';
import { useTranslation } from 'react-i18next'; // Импортируем хук локализации
import { VITE_SERVER_URL } from '../metaEnv';
import { useDispatch } from 'react-redux';
import { resetState } from '../state/gameStateSlice';

const Login: React.FC = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const navigate = useNavigate();
	const { t } = useTranslation(); // Используем хук локализации
	const dispatch = useDispatch(); // Используем хук диспатча

	const handleLogin = async () => {
		setError(null); // Сброс ошибки перед попыткой входа

		try {
			const response = await axios.post(
				`${VITE_SERVER_URL}/auth/login`,
				{ username, password },
				{ headers: { 'Content-Type': 'application/json' } }
			);

			// Сохраняем токен в localStorage
			localStorage.setItem('AuthToken', `Bearer ${response.data.token}`);

			if (username !== localStorage.getItem('username')) {
				localStorage.removeItem('sessionToken');
				localStorage.removeItem('currentFrameId');
				dispatch(resetState());
			}

			// Сохраняем username в localStorage
			localStorage.setItem('username', username);

			// Перенаправляем пользователя на защищённую страницу (например, /dashboard)
			navigate('/main');
		} catch (error) {
			console.error('Login error:', error);

			// Фиксация ошибки в Sentry
			Sentry.captureException(error);

			setError(t('login.error')); // Используем перевод для ошибки
		}
	};

	return (
		<Sentry.ErrorBoundary
			fallback={<p>{t('common.errorBoundary')}</p>} // Локализация текста ошибки
		>
			<div className="form-container">
				<h2>{t('login.title')}</h2> {/* Локализованное название */}
				<input
					type="text"
					className="input-field"
					placeholder={t('login.usernamePlaceholder')} // Локализация плейсхолдера
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					type="password"
					className="input-field"
					placeholder={t('login.passwordPlaceholder')} // Локализация плейсхолдера
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button onClick={handleLogin}>{t('login.loginButton')}</button>{' '}
				{/* Локализация кнопки */}
				<p>
					{t('login.noAccount')}{' '}
					<Link to="/auth/register">{t('login.registerLink')}</Link>
				</p>
				{error && <p className="error-message">{error}</p>}
			</div>
		</Sentry.ErrorBoundary>
	);
};

export default Sentry.withProfiler(Login);
