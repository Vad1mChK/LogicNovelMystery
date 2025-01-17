import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreatedWaitScreen from './CreatedWaitScreen';
import { LnmHero } from './types';
import { BASE_URL } from '../metaEnv';
import userEvent from '@testing-library/user-event';

jest.mock('i18next', () => ({
	t: jest.fn((key) => key),
}));

jest.mock('../metaEnv', () => ({
	BASE_URL: '/',
}));

jest.mock(
	'../assets/img/locations/MansionEntrance.webp',
	() => '../assets/img/locations/MansionEntrance.webp'
);

describe('CreatedWaitScreen', () => {
	it('should display the correct protagonist character sprite', () => {
		const protagonist = LnmHero.STEVE;
		render(<CreatedWaitScreen protagonist={protagonist} />);

		const characterSprite = screen.getByRole('img', { name: /steve/i });
		expect(characterSprite).toBeInTheDocument();
		expect(characterSprite).toHaveAttribute(
			'src',
			`${BASE_URL}assets/img/characters/steve/idle.webp`
		);
	});

	it('should call the onQuitToMain function when the home button is clicked', () => {
		const onQuitToMain = jest.fn();
		render(
			<CreatedWaitScreen
				protagonist={LnmHero.STEVE}
				onQuitToMain={onQuitToMain}
			/>
		);

		const homeButton = screen.getByRole('button', {
			name: /game.homeButton/i,
		});
		fireEvent.click(homeButton);

		expect(onQuitToMain).toHaveBeenCalledTimes(1);
	});

	it('should use the mansion entrance image as a fallback when an unknown protagonist is provided', () => {
		const unknownProtagonist = 'UNKNOWN' as LnmHero;
		render(<CreatedWaitScreen protagonist={unknownProtagonist} />);

		const backgroundImage = screen.getByRole('img', {
			name: /game.createdWaitScreen.wait/i,
		});
		expect(backgroundImage).toBeInTheDocument();
		expect(backgroundImage).toHaveAttribute(
			'src',
			'../assets/img/locations/MansionEntrance.webp'
		);
	});

	it('should use the correct wait message based on the gamemode, inferred from the protagonist', () => {
		render(<CreatedWaitScreen protagonist={LnmHero.STEVE} />);

		let waitMessage = screen.getByText(
			/game.createdWaitScreen.wait.single/i
		);
		expect(waitMessage).toBeInTheDocument();

		render(<CreatedWaitScreen protagonist={LnmHero.VICKY} />);

		waitMessage = screen.getByText(
			/game.createdWaitScreen.wait.multiplayer/i
		);
		expect(waitMessage).toBeInTheDocument();
	});

	it('should have the button to quit to main', async () => {
		const mockQuitToMain = jest.fn();

		render(
			<CreatedWaitScreen
				protagonist={LnmHero.STEVE}
				onQuitToMain={mockQuitToMain}
			/>
		);

		const homeButton = screen.getByRole('button', {
			name: /game.homeButton/i,
		});
		expect(homeButton).toBeInTheDocument();

		await userEvent.click(homeButton);
		await waitFor(() => {
			expect(mockQuitToMain).toHaveBeenCalledTimes(1);
		});
	});
});
