import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';


const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();


    const handleRegister = async () => {
        setError(null); // Сброс ошибки перед попыткой регистрации
        setSuccess(null);

        try {
            const response = await axios.post(
                'http://localhost:8080/auth/register',
                { name: username, email, password },
                { headers: { 'Content-Type': 'application/json' } }
            );

            setSuccess('Registration successful! You can now log in.');

            // Перенаправление на страницу входа после успешной регистрации
            setTimeout(() => navigate('auth/login'), 1000);
        } catch (error) {
            console.error('Registration error:', error);
            setError('Registration failed. Please check your details and try again.');
        }
    };


    return (
        <div className="form-container">
            <h2>Register</h2>
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
        </div>
    );
};

export default Register;

