import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WaitRoom from './WaitRoom';
import axios from 'axios';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import { RootState } from '../state/store';

jest.mock('i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key,
	}),
}));

jest.mock('../metaEnv', () => ({
	VITE_SERVER_URL: 'http://localhost:8081',
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockNavigate,
}));

const mockStore = configureStore<Partial<RootState>>([]); // Указываем Partial<RootState>

describe('WaitRoom Component', () => {
	let store: ReturnType<typeof mockStore>; // Правильная типизация для mockStore

	beforeEach(() => {
		store = mockStore({});
		jest.clearAllMocks();

		mockedAxios.get.mockResolvedValue({
			status: 200,
			data: {
				sessionList: {
					User1: 'token1',
					User2: 'token2',
				},
			},
		});

		mockedAxios.post.mockResolvedValue({
			status: 201,
		});
	});

	const renderWithProviders = (ui: JSX.Element) => {
		return render(
			<Provider store={store}>
				<BrowserRouter>{ui}</BrowserRouter>
			</Provider>
		);
	};

	it('renders loading state initially', () => {
		renderWithProviders(<WaitRoom />);
		expect(screen.getByText('waitRoom.loading')).toBeInTheDocument(); // Using key
	});

	it('renders users after successful API call', async () => {
		renderWithProviders(<WaitRoom />);

		await waitFor(() => {
			expect(screen.getByText('User1')).toBeInTheDocument();
			expect(screen.getByText('User2')).toBeInTheDocument();
		});
	});
});
