import { render, screen } from '@testing-library/react';
import LandingSlide from './LandingSlide';

describe('LandingSlide', () => {
	it('should render the LandingSlide component without children', () => {
		render(<LandingSlide />);
		const slideElement = screen.getByTestId('landing-slide');
		expect(slideElement).toBeInTheDocument();
		expect(slideElement).toHaveStyle('transform: translateY(0%)');
		expect(slideElement).toBeEmptyDOMElement();
	});

	it('should apply correct transform style when slideNumber and currentSlide are provided', () => {
		const slideNumber = 2;
		const currentSlide = 1;
		render(
			<LandingSlide
				slideNumber={slideNumber}
				currentSlide={currentSlide}
			/>
		);
		const slideElement = screen.getByTestId('landing-slide');
		expect(slideElement).toHaveStyle(
			`transform: translateY(${(slideNumber - currentSlide) * 100}%)`
		);
	});
});
