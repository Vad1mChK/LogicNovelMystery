import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError(null); // Сброс ошибки перед попыткой входа

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const data = await response.json();
            // Сохраняем токен в localStorage
            localStorage.setItem('AuthToken', data.token);

            // Перенаправляем пользователя на защищённую страницу (например, /dashboard)
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            setError('Login failed. Please check your username and password.');
        }

    };

    return (
        <div className="form-container">
            <h2>Login</h2>
            <input
                type="text"
                className="input-field" /* Добавляем класс */
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                className="input-field" /* Добавляем класс */
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <p>
                No account? <Link to="/auth/register">Register here</Link>
            </p>
        </div>
    );
};

export default Login;
