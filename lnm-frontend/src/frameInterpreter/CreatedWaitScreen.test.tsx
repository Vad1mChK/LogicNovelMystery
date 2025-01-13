import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreatedWaitScreen from './CreatedWaitScreen';

jest.mock('i18next', () => ({
	t: jest.fn((key) => key),
}));

jest.mock('../metaEnv', () => ({
	BASE_URL: '/',
}));

describe('CreatedWaitScreen', () => {
	it('should display the mansion entrance image when an unknown protagonist is provided', () => {
		render(<CreatedWaitScreen protagonist="unknown" />);

		const backgroundImage = screen.getByAltText(
			'game.createdWaitScreen.wait'
		);
		expect(backgroundImage).toHaveAttribute('src', 'test-file-stub');
	});
});
