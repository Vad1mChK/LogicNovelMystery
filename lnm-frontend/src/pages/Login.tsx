import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';


const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError(null); // Сброс ошибки перед попыткой входа

        try {
            const response = await axios.post(
                'http://localhost:8080/auth/login',
                { username, password },
                { headers: { 'Content-Type': 'application/json' } }
            );

            // Сохраняем токен в localStorage
            localStorage.setItem('AuthToken', response.data.token);

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
