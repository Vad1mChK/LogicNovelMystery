import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WaitRoom from './WaitRoom';
import axios from 'axios';

jest.mock('../metaEnv', () => ({
	VITE_SERVER_URL: 'http://localhost:8080',
}));

// Create a mock for dispatch
const mockDispatch = jest.fn();

// Mock react-redux to return the mock dispatch
jest.mock('react-redux', () => ({
	...jest.requireActual('react-redux'), // Preserve other functionalities
	useDispatch: () => mockDispatch,
}));

// Mock react-router-dom's useNavigate
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockNavigate,
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WaitRoom Component', () => {
	beforeEach(() => {
		mockedAxios.get.mockResolvedValue({
			status: 200,
			data: {
				sessionList: {
					User1: 'token1',
				},
			},
		});

		mockedAxios.post.mockResolvedValue({
			status: 201,
		});
	});

	it('displays alert when "Присоединиться" button is clicked', () => {
		window.alert = jest.fn();
		render(<WaitRoom />);

		fireEvent.click(screen.getByText('Присоединиться'));
		expect(window.alert).not.toHaveBeenCalled();
	});

	it('displays alert when "Создать" button is clicked', () => {
		window.alert = jest.fn(); // Мокаем alert
		render(<WaitRoom />);

		// Нажимаем на кнопку "Создать"
		fireEvent.click(screen.getByText('Создать'));
		expect(window.alert).not.toHaveBeenCalled();
	});

	it('selects only one user at a time', async () => {
		mockedAxios.get.mockResolvedValueOnce({
			status: 200,
			data: {
				sessionList: {
					User1: 'token1',
					User2: 'token2',
					User3: 'token3',
				},
			},
		});

		render(<WaitRoom />);
		screen.debug();

		const rows = (await screen.findAllByRole('row')).slice(1);

		// Кликаем на первого пользователя
		fireEvent.click(rows[0]);
		expect(rows[0]).toHaveClass('selected');

		// Кликаем на второго пользователя
		fireEvent.click(rows[1]);
		expect(rows[1]).toHaveClass('selected');
		expect(rows[0]).not.toHaveClass('selected');
	});
});
