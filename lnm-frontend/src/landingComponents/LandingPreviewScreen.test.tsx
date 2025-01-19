import { render, screen, fireEvent } from '@testing-library/react';
import LandingPreviewScreen from './LandingPreviewScreen';

jest.mock('../metaEnv', () => ({
	BASE_URL: 'http://test.com/',
}));

describe('LandingPreviewScreen', () => {
	it('should position character images evenly across the container width', () => {
		const characters = ['Character1', 'Character2', 'Character3'];
		const location = 'TestLocation';

		render(
			<LandingPreviewScreen characters={characters} location={location} />
		);

		const characterImages = screen.getAllByAltText(/Character\d/);

		expect(characterImages).toHaveLength(3);

		characterImages.forEach((img, index) => {
			const expectedLeft = `${((index + 0.5) / characters.length) * 100}%`;
			expect(img).toHaveStyle(`left: ${expectedLeft}`);
		});
	});

	it('should apply the "landing-preview" class to the main container', () => {
		const characters = ['Character1', 'Character2'];
		const location = 'TestLocation';

		render(
			<LandingPreviewScreen characters={characters} location={location} />
		);

		const container = screen.getByTestId(
			'landing-preview-location'
		).parentElement;
		expect(container).toHaveClass('landing-preview');
	});

	it('should call the onClick function when the container is clicked', () => {
		const characters = ['Character1', 'Character2'];
		const location = 'TestLocation';
		const onClickMock = jest.fn();

		render(
			<LandingPreviewScreen
				characters={characters}
				location={location}
				onClick={onClickMock}
			/>
		);

		const container = screen.getByTestId(
			'landing-preview-location'
		).parentElement;
		expect(container).toBeInTheDocument();
		fireEvent.click(container!);

		expect(onClickMock).toHaveBeenCalledTimes(1);
	});

	it('should use the correct BASE_URL for asset paths', () => {
		const characters = ['Character1', 'Character2'];
		const location = 'TestLocation';
		const mockBaseUrl = 'http://test.com/';

		render(
			<LandingPreviewScreen characters={characters} location={location} />
		);

		const locationImage = screen.getByAltText('Location');
		expect(locationImage).toHaveAttribute(
			'src',
			`${mockBaseUrl}assets/img/locations/${location}_small.webp`
		);

		const characterImages = screen.getAllByAltText(/Character\d/);
		characterImages.forEach((img, index) => {
			expect(img).toHaveAttribute(
				'src',
				`${mockBaseUrl}assets/img/characters/${characters[index].toLowerCase()}/idle.webp`
			);
		});
	});
});
