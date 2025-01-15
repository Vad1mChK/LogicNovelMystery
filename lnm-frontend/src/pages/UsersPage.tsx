import React, { useState, useEffect } from 'react';
import '../css/UsersPage.scss'; // Подключите стили

interface User {
	id: number;
	name: string;
}

const UsersPage: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]); // Изначально пустой массив пользователей
	const [loading, setLoading] = useState<boolean>(true); // Состояние загрузки
	const [error, setError] = useState<string | null>(null); // Состояние ошибки
	const [selectedUser, setSelectedUser] = useState<number | null>(null); // Состояние для выбранного пользователя

	// useEffect(() => {
	// 	// Функция для загрузки данных с сервера
	// 	const fetchUsers = async () => {
	// 		try {
	// 			const response = await fetch('https://api.example.com/users'); // Замените URL на ваш
	// 			if (!response.ok) {
	// 				throw new Error(`Ошибка: ${response.status}`);
	// 			}
	// 			const data: User[] = await response.json(); // Предполагается, что сервер возвращает массив пользователей
	// 			setUsers(data);
	// 		} catch (err: any) {
	// 			setError(err.message || 'Произошла ошибка при загрузке данных');
	// 		} finally {
	// 			setLoading(false); // Останавливаем загрузку
	// 		}
	// 	};
	//
	// 	fetchUsers();
	// }, []); // Пустой массив зависимостей, чтобы выполнить запрос только один раз

	const handleJoin = () => {
		alert('Присоединиться');
	};

	const handleCreate = () => {
		alert('Создать');
	};

	const handleUserClick = (id: number) => {
		setSelectedUser(id === selectedUser ? null : id); // Если пользователь уже выбран, отменяем выбор
	};

	if (loading) return <div className="users-page-container">Загрузка...</div>;
	if (error)
		return <div className="users-page-container">Ошибка: {error}</div>;

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
									onClick={() => handleUserClick(user.id)}
									className={
										selectedUser === user.id
											? 'selected'
											: ''
									}
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
