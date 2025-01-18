import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PanningSlider from './PanningSlider';

describe('PanningSlider', () => {
	const mockOnChange = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the slider with correct initial value', () => {
		render(
			<PanningSlider dark={false} panning={0} onChange={mockOnChange} />
		);
		const slider = screen.getByTestId('panning-slider');
		screen.debug(slider);

		const sliderInputElements = slider.getElementsByTagName('input');
		expect(sliderInputElements).toHaveLength(1);
		expect(sliderInputElements[0]).toHaveAttribute('aria-valuenow', '0');
	});

	it('renders the left and right pan icons', () => {
		render(
			<PanningSlider dark={false} panning={0} onChange={mockOnChange} />
		);
		const leftIcon = screen.getByTestId('left-pan-icon');
		const rightIcon = screen.getByTestId('right-pan-icon');

		expect(leftIcon).toBeInTheDocument();
		expect(rightIcon).toBeInTheDocument();
	});

	it('calls onChange with -100 when the left pan icon is clicked', () => {
		render(
			<PanningSlider dark={false} panning={0} onChange={mockOnChange} />
		);
		const leftIcon = screen.getByTestId('left-pan-icon');
		fireEvent.click(leftIcon);

		expect(mockOnChange).toHaveBeenCalledTimes(1);
		expect(mockOnChange).toHaveBeenCalledWith(-100);
	});

	it('calls onChange with 100 when the right pan icon is clicked', () => {
		render(
			<PanningSlider dark={false} panning={0} onChange={mockOnChange} />
		);
		const rightIcon = screen.getByTestId('right-pan-icon');
		fireEvent.click(rightIcon);

		expect(mockOnChange).toHaveBeenCalledTimes(1);
		expect(mockOnChange).toHaveBeenCalledWith(100);
	});

	it('calls onChange with the correct value when the slider value changes', () => {
		render(
			<PanningSlider dark={false} panning={0} onChange={mockOnChange} />
		);
		const slider = screen.getByTestId('panning-slider');
		expect(slider).toBeInTheDocument();

		const sliderInputElements = slider.getElementsByTagName('input');
		expect(sliderInputElements).toHaveLength(1);

		fireEvent.change(sliderInputElements[0], { target: { value: 50 } });

		expect(mockOnChange).toHaveBeenCalledTimes(1);
		expect(mockOnChange).toHaveBeenCalledWith(50);
	});

	it('applies dark mode styles when dark is true', () => {
		render(
			<PanningSlider dark={true} panning={0} onChange={mockOnChange} />
		);
		const slider = screen.getByTestId('panning-slider');

		expect(slider).toHaveStyle('color: #90caf9');
	});

	it('applies light mode styles when dark is false', () => {
		render(
			<PanningSlider dark={false} panning={0} onChange={mockOnChange} />
		);
		const slider = screen.getByTestId('panning-slider');

		expect(slider).toHaveStyle('color: #1976d2');
	});
});
