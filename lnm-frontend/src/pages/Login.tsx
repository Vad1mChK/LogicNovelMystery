import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Логика для обработки входа
        console.log('Login attempt:', { username, password });
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
                No account? <Link to="/register">Register here</Link>
            </p>
        </div>
    );
};

export default Login;
