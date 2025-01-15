import React, { useState } from 'react';
import '../css/UsersPage.scss'; // Подключите стили

interface User {
    id: number;
    name: string;
}

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([
        { id: 1, name: 'Иванов' },
        { id: 2, name: 'Петров' },
        { id: 3, name: 'Сидоров' },
        { id: 4, name: 'Иванов' },
        { id: 5, name: 'Петров' },
        { id: 6, name: 'Сидоров' },
    ]);

    const [selectedUser, setSelectedUser] = useState<number | null>(null); // Состояние для выбранного пользователя

    const handleJoin = () => {
        alert('Присоединиться');
    };

    const handleCreate = () => {
        alert('Создать');
    };

    const handleUserClick = (id: number) => {
        setSelectedUser(id === selectedUser ? null : id); // Если пользователь уже выбран, отменяем выбор
    };

    return (
        <div className="users-page-container">
            <div className="table-container">
                <h2>Список пользователей</h2>
                <div className="scrollable-table">
                    <table>
                        <thead>
                        <tr>
                            <th>Имя пользователя</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                onClick={() => handleUserClick(user.id)} // Обработчик клика
                                className={selectedUser === user.id ? 'selected' : ''} // Добавляем класс для выделенной строки
                            >
                                <td>{user.name}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="button-container">
                    <button onClick={handleJoin}>Присоединиться</button>
                    <button onClick={handleCreate}>Создать</button>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;
