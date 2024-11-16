import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Sentry from '@sentry/react';

const Register: React.FC = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const navigate = useNavigate();

	const isValidEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleRegister = async () => {
		setError(null); // Сброс ошибки перед попыткой регистрации
		setSuccess(null);

		// Проверяем формат email перед отправкой
		if (!isValidEmail(email)) {
			setError('Please enter a valid email address.');
			return;
		}

		/* eslint-disable @typescript-eslint/no-explicit-any */
		try {
			/* const _response = */ await axios.post(
				'http://localhost:8080/auth/register',
				{ name: username, email, password },
				{ headers: { 'Content-Type': 'application/json' } }
			);

			setSuccess('Registration successful! You can now log in.');

			// Перенаправление на страницу входа после успешной регистрации
			navigate('/auth/login');
		} catch (error) {
			console.error('Registration error:', error);

			// Отправка ошибки в Sentry
			Sentry.captureException(error);

			setError(
				'Registration failed. Please check your details and try again.'
			);
			// Проверяем, существует ли уже такой пользователь или возникла ошибка сервера
			if (
				(error as any).response &&
				(error as any).response.data ===
					'Registration failed: Username already exists'
			) {
				setError('This user is already registered.');
			} else {
				setError('Registration failed. Please try again later.');
			}
		}
		/* eslint-enable @typescript-eslint/no-explicit-any */
	};

	return (
		<div className="form-container">
			<h2>Register</h2>
			{error && <p className="error-message">{error}</p>}
			<input
				type="text"
				className="input-field" /* Добавляем класс */
				placeholder="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<input
				type="text"
				className="input-field" /* Добавляем класс */
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
			/>
			<input
				type="password"
				className="input-field" /* Добавляем класс */
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
			<button onClick={handleRegister}>Register</button>

			{error && <p className="error-message">{error}</p>}
			{success && <p className="success-message">{success}</p>}

			<p>
				Already have account? <Link to="/auth/login">Login here</Link>
			</p>
		</div>
	);
};

export default Register;
