import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResultsWaitScreen from './ResultsWaitScreen';

jest.mock('../css/CreateOrResultsScreen.scss', () => ({}));

// Mocking i18next translation function
jest.mock('i18next', () => ({
	t: jest.fn((key: string) => key),
}));

jest.mock('../metaEnv', () => ({
	BASE_URL: '/',
}));

jest.mock('../css/CreateOrResultsScreen.scss', () => ({}));

describe('ResultsWaitScreen', () => {
	it('should display "You Win!" when winner prop is true', () => {
		render(<ResultsWaitScreen winner={true} />);
		expect(
			screen.getByText('game.resultWaitScreen.win')
		).toBeInTheDocument();
	});

	it('should display "You Lose!" when winner prop is false', () => {
		render(<ResultsWaitScreen winner={false} />);
		expect(
			screen.getByText('game.resultWaitScreen.lose')
		).toBeInTheDocument();
	});

	it('should show multiplayer wait message when multiplayer prop is true', () => {
		render(<ResultsWaitScreen winner={true} multiplayer={true} />);
		expect(
			screen.getByText('game.resultWaitScreen.wait.multiplayer')
		).toBeInTheDocument();
		expect(
			screen.getByText('game.resultWaitScreen.pageWillUpdate.multiplayer')
		).toBeInTheDocument();
		expect(
			screen.getAllByAltText('game.resultWaitScreen.wait.multiplayer')
		).toHaveLength(2);
	});

	it('should show single player wait message when multiplayer prop is false', () => {
		render(<ResultsWaitScreen winner={true} multiplayer={false} />);
		expect(
			screen.getByText('game.resultWaitScreen.wait.single')
		).toBeInTheDocument();
		expect(
			screen.getByText('game.resultWaitScreen.pageWillUpdate.single')
		).toBeInTheDocument();
		expect(
			screen.getAllByAltText('game.resultWaitScreen.wait.single')
		).toHaveLength(2);
	});
});
