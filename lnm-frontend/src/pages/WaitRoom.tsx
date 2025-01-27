import React, { useEffect, useState } from 'react';
import '../css/WaitRoom.scss'; // Connect styles
import axios from 'axios';
import { VITE_SERVER_URL } from '../metaEnv';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { generateSessionToken } from '../util/generateSessionToken';
import {
	resetState,
	setPlayerState,
	setProtagonist,
} from '../state/gameStateSlice';
import { LnmHero, LnmPlayerState } from '../frameInterpreter/types';
import { useTranslation } from 'react-i18next'; // Импортируем хук локализации

interface User {
	id: number;
	name: string;
	sessionToken: string;
}

const WaitRoom: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null); // State for selected user
	const [loading, setLoading] = useState<boolean>(true); // Loading state
	const { t } = useTranslation(); // Используем локализацию
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Fetch users from the server when the component mounts
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const authToken = localStorage.getItem('AuthToken') || '';
				const response = await axios.get(`${VITE_SERVER_URL}/session`, {
					headers: {
						Authorization: authToken,
						'Content-Type': 'application/json',
					},
				});

				if (!response.data || typeof response.data !== 'object') {
					throw new Error(
						'Invalid data format received from server.'
					);
				}

				const data: Record<string, string> = response.data.sessionList; // Assuming server returns a JSON object

				// Transform the Map into an array of User objects
				const fetchedUsers: User[] = Object.entries(data).map(
					([name, sessionToken], index) => ({
						id: index + 1, // Assign a unique ID
						name,
						sessionToken,
					})
				);

				setUsers(fetchedUsers);
				setLoading(false);
			} catch (err) {
				setErrorMessage(t('waitRoom.error'));
				setLoading(false);
			}
		};

		fetchUsers();
	}, [VITE_SERVER_URL]);

	const handleJoin = async () => {
		if (selectedUserId === null) {
			setErrorMessage(t('waitRoom.error'));
			return;
		}

		const user = users.find((u) => u.id === selectedUserId);
		if (!user) {
			setErrorMessage(t('waitRoom.error'));
			return;
		}

		axios
			.post(
				`${VITE_SERVER_URL}/session`,
				{
					sessionToken: user.sessionToken,
					isMultiplayer: true,
				},
				{
					headers: {
						'Content-Type': 'application/json',
						Authorization: localStorage.getItem('AuthToken') || '',
					},
				}
			)
			.then(() => {
				dispatch(resetState());
				localStorage.removeItem('currentFrameId');
				dispatch(setProtagonist(LnmHero.VICKY));
				dispatch(setPlayerState(LnmPlayerState.PLAYING));
				localStorage.setItem('sessionToken', user.sessionToken);
				navigate('/multi-player');
			})
			.catch((err) => {
				console.error('Error joining game:', err);
				localStorage.removeItem('sessionToken');
			});
	};

	const handleCreate = async () => {
		const sessionToken = generateSessionToken();
		localStorage.setItem('sessionToken', sessionToken);
		const response = await axios.post(
			`${VITE_SERVER_URL}/session`,
			{
				sessionToken: sessionToken,
				isMultiplayer: true,
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: localStorage.getItem('AuthToken') || '',
				},
			}
		);
		if (response.status == 200 || response.status == 201) {
			dispatch(resetState());
			localStorage.removeItem('currentFrameId');
			dispatch(setProtagonist(LnmHero.PROFESSOR));
			dispatch(setPlayerState(LnmPlayerState.CREATED));
			navigate('/multi-player');
		}
	};

	const handleUserClick = (id: number) => {
		setSelectedUserId(id === selectedUserId ? null : id); // Toggle selection
	};

	const goBack = () => {
		navigate('/select');
	};

	return (
		<div className="users-page-container">
			<div className="table-container">
				<button className="return-button" onClick={goBack}>
					{t('Back')}
				</button>
				<h2>{t('waitRoom.userList')}</h2>
				{loading ? (
					<p>{t('waitRoom.loading')}</p> // "Loading users..."
				) : errorMessage ? (
					<p className="error">{errorMessage}</p>
				) : (
					<div className="scrollable-table">
						<table>
							<thead>
								<tr>
									<th>{t('waitRoom.username')}</th>
								</tr>
							</thead>
							<tbody>
								{users.length === 0 ? (
									<tr>
										<td>{t('waitRoom.notFound')}</td>
									</tr>
								) : (
									users.map((user) => (
										<tr
											key={user.id}
											onClick={() =>
												handleUserClick(user.id)
											} // Click handler
											className={
												selectedUserId === user.id
													? 'selected'
													: ''
											} // Add class for selected row
											data-testid={`user-row-${user.id}`}
										>
											<td>{user.name}</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				)}
				<div className="button-container">
					<button
						onClick={handleJoin}
						disabled={selectedUserId === null}
					>
						{t('waitRoom.join')}
					</button>
					<button onClick={handleCreate}>
						{t('waitRoom.create')}
					</button>
				</div>
			</div>
		</div>
	);
};

export default WaitRoom;
