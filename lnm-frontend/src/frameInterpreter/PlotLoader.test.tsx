import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PlotLoader from './PlotLoader';
import axios from 'axios';
import { LnmPlot } from './types';
import { convertAndCreatePlot } from './plotLoaderUtils';

jest.mock('axios'); // Mock Axios
jest.mock('./plotLoaderUtils'); // Mock utility for converting the plot
jest.mock('react-router-dom', () => ({
	...jest.requireActual('react-router-dom'), // Preserve other exports from react-router-dom
	useNavigate: jest.fn(),
}));

const mockAxios = axios as jest.Mocked<typeof axios>;
const mockConvertAndCreatePlot = convertAndCreatePlot as jest.Mock;

describe('PlotLoader', () => {
	const mockOnLoad = jest.fn();
	const mockNavigate = jest.fn();
	const mockPlotUrl = 'http://example.com/plot.json';
	const mockPlot: LnmPlot = {
		metadata: {
			name: 'Example Plot',
			gamemode: 'single',
			version: '1.0',
			protagonist: 'edgeworth',
			author: 'Shu Takumi',
			locale: 'en',
		},
		characters: new Map(),
		locations: new Map(),
		music: new Map(),
		chapters: new Map(),
		startChapter: 'intro',
		defaultEnding: 'failure',
		frames: { main: new Map() },
		tasks: new Map(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		const useNavigate = require('react-router-dom').useNavigate;
		mockAxios.get.mockResolvedValue({ data: { some: 'data' } });
		useNavigate.mockReturnValue(mockNavigate);
	});

	it('should render the loading message and cancel button', () => {
		render(
			<BrowserRouter>
				<PlotLoader plotUrl={mockPlotUrl} onLoad={mockOnLoad} />
			</BrowserRouter>
		);

		expect(screen.getByText('Loading plot...')).toBeInTheDocument();
		expect(screen.getByText('Cancel')).toBeInTheDocument();
	});

	it('should fetch and load the plot successfully', async () => {
		// Mock Axios response and conversion function
		mockAxios.get.mockResolvedValueOnce({ data: { some: 'data' } });
		mockConvertAndCreatePlot.mockReturnValueOnce(mockPlot);

		render(
			<BrowserRouter>
				<PlotLoader plotUrl={mockPlotUrl} onLoad={mockOnLoad} />
			</BrowserRouter>
		);

		// Ensure the request is made
		expect(mockAxios.get).toHaveBeenCalledWith(
			mockPlotUrl,
			expect.objectContaining({ signal: expect.any(AbortSignal) })
		);

		// Wait for the plot to be loaded
		await waitFor(() => {
			expect(mockConvertAndCreatePlot).toHaveBeenCalledWith(
				{ some: 'data' },
				expect.any(AbortSignal)
			);
			expect(mockOnLoad).toHaveBeenCalledWith(mockPlot);
		});
	});

	it('should handle request cancellation', async () => {
		const abortError = new axios.Cancel('Request aborted');
		mockAxios.get.mockRejectedValueOnce(abortError);

		render(
			<BrowserRouter>
				<PlotLoader plotUrl={mockPlotUrl} onLoad={mockOnLoad} />
			</BrowserRouter>
		);

		expect(mockAxios.get).toHaveBeenCalledWith(
			mockPlotUrl,
			expect.objectContaining({ signal: expect.any(AbortSignal) })
		);

		// Wait for the request to fail
		await waitFor(() => {
			expect(screen.getByText('Loading plot...')).toBeInTheDocument();
		});

		expect(mockOnLoad).not.toHaveBeenCalled();
	});

	it('should handle fetch errors gracefully', async () => {
		const error = new Error('Network Error');
		mockAxios.get.mockRejectedValueOnce(error);

		// Mock console.error
		const consoleErrorSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		render(
			<BrowserRouter>
				<PlotLoader plotUrl={mockPlotUrl} onLoad={mockOnLoad} />
			</BrowserRouter>
		);

		expect(mockAxios.get).toHaveBeenCalledWith(
			mockPlotUrl,
			expect.objectContaining({ signal: expect.any(AbortSignal) })
		);

		// Wait for the error to be logged
		await waitFor(() => {
			expect(console.error).toHaveBeenCalledWith(
				'Failed to load plot:',
				error
			);
		});

		expect(mockOnLoad).not.toHaveBeenCalled();

		// Restore the original console.error implementation
		consoleErrorSpy.mockRestore();
	});

	it('should abort the request when unmounting', async () => {
		const abortSpy = jest.spyOn(AbortController.prototype, 'abort');

		const { unmount } = render(
			<BrowserRouter>
				<PlotLoader plotUrl={mockPlotUrl} onLoad={mockOnLoad} />
			</BrowserRouter>
		);

		// Ensure the abort is called during cleanup
		unmount();
		expect(abortSpy).toHaveBeenCalled();
	});

	it('should navigate to /main when cancel is clicked', () => {
		render(
			<BrowserRouter>
				<PlotLoader plotUrl={mockPlotUrl} onLoad={mockOnLoad} />
			</BrowserRouter>
		);

		// Click the cancel button
		fireEvent.click(screen.getByText('Cancel'));

		expect(mockNavigate).toHaveBeenCalledWith('/main');
	});
});
