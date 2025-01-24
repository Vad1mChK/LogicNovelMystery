import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WaitRoom from './WaitRoom';
import axios from 'axios';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';

// Mock i18next for localization
jest.mock('i18next', () => ({
	useTranslation: () => ({
		t: (key: string) => key, // Return key as text
	}),
}));

jest.mock('../metaEnv', () => ({
	VITE_SERVER_URL: 'http://localhost:8081',
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockNavigate,
}));

const mockStore = configureStore([]);

describe('WaitRoom Component', () => {
	let store: any;

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

	it('displays error message if API call fails', async () => {
		mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

		renderWithProviders(<WaitRoom />);

		await waitFor(() => {
			expect(screen.getByText('waitRoom.error')).toBeInTheDocument(); // Using key
		});
	});

	it('allows selecting only one user at a time', async () => {
		renderWithProviders(<WaitRoom />);

		await waitFor(() => {
			expect(screen.getByText('User1')).toBeInTheDocument();
		});

		const userRows = screen.getAllByRole('row').slice(1); // Skip the header row

		// Select the first user
		fireEvent.click(userRows[0]);
		expect(userRows[0]).toHaveClass('selected');

		// Select the second user
		fireEvent.click(userRows[1]);
		expect(userRows[1]).toHaveClass('selected');
		expect(userRows[0]).not.toHaveClass('selected');
	});

	it('disables "join" button if no user is selected', async () => {
		renderWithProviders(<WaitRoom />);

		await waitFor(() => {
			expect(screen.getByText('User1')).toBeInTheDocument();
		});

		const joinButton = screen.getByText('waitRoom.join');
		expect(joinButton).toBeDisabled();
	});

	it('calls handleJoin when "join" button is clicked with a selected user', async () => {
		renderWithProviders(<WaitRoom />);

		await waitFor(() => {
			expect(screen.getByText('User1')).toBeInTheDocument();
		});

		const userRows = screen.getAllByRole('row').slice(1); // Skip the header row
		fireEvent.click(userRows[0]); // Select the first user

		const joinButton = screen.getByText('waitRoom.join');
		expect(joinButton).toBeEnabled();

		fireEvent.click(joinButton);

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/multi-player');
		});
	});

	it('calls handleCreate when "create" button is clicked', async () => {
		renderWithProviders(<WaitRoom />);

		const createButton = screen.getByText('waitRoom.create');
		fireEvent.click(createButton);

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/multi-player');
		});
	});

	it('navigates back when "Back" button is clicked', () => {
		renderWithProviders(<WaitRoom />);

		const backButton = screen.getByText('Back');
		fireEvent.click(backButton);

		expect(mockNavigate).toHaveBeenCalledWith('/select');
	});
});
