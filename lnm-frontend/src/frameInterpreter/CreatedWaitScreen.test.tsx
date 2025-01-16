import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreatedWaitScreen from './CreatedWaitScreen';
import { LnmHero } from './types';
import { BASE_URL } from '../metaEnv';

jest.mock('i18next', () => ({
	t: jest.fn((key) => key),
}));

jest.mock('../metaEnv', () => ({
	BASE_URL: '/',
}));

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
});
