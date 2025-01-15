import { render, screen } from '@testing-library/react';
import LocationBackground from './LocationBackground';
import { LnmLocation } from './types';

// Mock BASE_URL
jest.mock('../metaEnv', () => ({
	BASE_URL: 'http://example.com/',
}));

describe('LocationBackground Component', () => {
	const location: LnmLocation = {
		id: '1',
		name: 'Courtroom Lobby',
		background: 'assets/backgrounds/lobby.png',
	};

	it('renders the background image with the correct src and alt attributes', () => {
		render(<LocationBackground location={location} />);

		// Verify the image
		const image = screen.getByRole('img', { name: location.name });
		expect(image).toBeInTheDocument();
		expect(image).toHaveAttribute(
			'src',
			'http://example.com/assets/backgrounds/lobby.png'
		);
		expect(image).toHaveAttribute('alt', location.name);
		expect(image).toHaveAttribute('title', location.name);
	});

	it('handles missing background gracefully', () => {
		const locationWithoutBackground: LnmLocation = {
			id: '2',
			name: 'Courtroom Empty',
			background: '', // No background provided
		};

		render(<LocationBackground location={locationWithoutBackground} />);

		// Verify the image still renders, but with an empty src
		const image = screen.getByRole('img', {
			name: locationWithoutBackground.name,
		});
		expect(image).toBeInTheDocument();
		expect(image).toHaveAttribute('src', 'http://example.com/'); // BASE_URL only
		expect(image).toHaveAttribute('alt', locationWithoutBackground.name);
		expect(image).toHaveAttribute('title', locationWithoutBackground.name);
	});
});
