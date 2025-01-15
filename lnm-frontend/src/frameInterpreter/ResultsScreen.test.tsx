import { render, screen, fireEvent } from '@testing-library/react';
// import React from 'react';
import ResultsScreen from './ResultsScreen';
import { LnmResult } from './types';
// import { t } from 'i18next';

// Mocking i18next translation function
jest.mock('i18next', () => ({
	t: jest.fn((key: string) => key),
}));

jest.mock('../metaEnv', () => ({
	BASE_URL: '/',
}));

jest.mock('../css/CreateOrResultsScreen.scss', () => ({}));

describe('ResultsScreen', () => {
	const mockQuitToMain = jest.fn();

	const defaultProps = {
		result: LnmResult.SINGLE_GOOD,
		score: 100,
		highScore: 200,
		onQuitToMain: mockQuitToMain,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should render result screen with correct image and text', () => {
		render(<ResultsScreen {...defaultProps} />);

		const image = screen.getByAltText(
			'game.resultScreen.result.SINGLE_GOOD'
		);
		expect(image).toHaveAttribute(
			'src',
			expect.stringContaining('assets/img/endings/GoodEndingScreens.webp')
		);

		expect(
			screen.getByText('game.resultScreen.result.SINGLE_GOOD')
		).toBeInTheDocument();
		expect(
			screen.getByText('game.resultScreen.yourScore').parentElement
		).toHaveTextContent('game.resultScreen.yourScore 100');
	});

	test('should render partner name if provided', () => {
		const props = {
			...defaultProps,
			partnerName: 'John Doe',
		};

		render(<ResultsScreen {...props} />);

		expect(
			screen.getByText('game.resultScreen.yourPartner').parentElement
		).toBeInTheDocument();
		expect(screen.getByText('John Doe')).toBeInTheDocument();
	});

	test('should render new high score message if score is higher than high score', () => {
		const props = {
			...defaultProps,
			score: 250,
		};

		render(<ResultsScreen {...props} />);

		expect(
			screen.getByText('game.resultScreen.newHighScore')
		).toBeInTheDocument();
	});

	test('should render your high score message if score is not higher than high score', () => {
		const props = {
			...defaultProps,
			score: 100,
		};

		render(<ResultsScreen {...props} />);

		expect(
			screen.getByText('game.resultScreen.yourHighScore').parentElement
		).toHaveTextContent('game.resultScreen.yourHighScore 200');
	});

	test('should call onQuitToMain when button is clicked', () => {
		render(<ResultsScreen {...defaultProps} />);

		const button = screen.getByText('game.resultScreen.toMain');
		fireEvent.click(button);

		expect(mockQuitToMain).toHaveBeenCalledTimes(1);
	});

	test('should not render high score text if highScore is undefined', () => {
		const props = {
			...defaultProps,
			highScore: undefined,
		};

		render(<ResultsScreen {...props} />);

		expect(
			screen.queryByText('game.resultScreen.yourHighScore')
		).toBeNull();
	});
});
