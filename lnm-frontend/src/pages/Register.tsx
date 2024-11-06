import React, { useState } from 'react';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = () => {

        // Логика для обработки регистрации
        console.log('Registration attempt:', { username, password });
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

