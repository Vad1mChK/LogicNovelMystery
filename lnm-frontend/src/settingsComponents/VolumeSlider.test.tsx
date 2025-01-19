import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import VolumeSlider from './VolumeSlider';

describe('VolumeSlider', () => {
	const mockOnChange = jest.fn();

	beforeEach(() => {
		mockOnChange.mockClear();
	});

	it('renders the slider with correct initial value', () => {
		render(
			<VolumeSlider dark={false} volume={50} onChange={mockOnChange} />
		);

		const slider = screen.getByRole('slider');
		expect(slider).toBeInTheDocument();
		expect(slider).toHaveAttribute('aria-valuenow', '50');
	});

	it('renders the audio icons', () => {
		render(
			<VolumeSlider dark={false} volume={50} onChange={mockOnChange} />
		);

		const muteIcon = screen.getByTestId('mute-icon');
		const maxVolumeIcon = screen.getByTestId('max-volume-icon');

		expect(muteIcon).toBeInTheDocument();
		expect(maxVolumeIcon).toBeInTheDocument();
	});

	it('calls onChange when the slider value changes', () => {
		render(
			<VolumeSlider dark={false} volume={50} onChange={mockOnChange} />
		);

		const slider = screen.getByRole('slider');
		fireEvent.change(slider, { target: { value: 75 } });

		expect(mockOnChange).toHaveBeenCalledTimes(1);
		expect(mockOnChange).toHaveBeenCalledWith(75);
	});

	it('displays the tooltip with the correct volume value', async () => {
		render(
			<VolumeSlider dark={false} volume={50} onChange={mockOnChange} />
		);

		const slider = screen.getByRole('slider');
		fireEvent.mouseOver(slider);

		const tooltip = screen.getByLabelText('50%');
		expect(tooltip).toBeInTheDocument();
	});

	it('applies dark mode styles when dark prop is true', () => {
		render(<VolumeSlider dark={true} volume={50} onChange={() => {}} />);

		const box = screen.getByTestId('volume-slider-box');
		const muteIcon = screen.getByTestId('mute-icon');
		const maxVolumeIcon = screen.getByTestId('max-volume-icon');

		expect(box).toHaveStyle({
			backgroundColor: '#121212',
		});
		expect(muteIcon).toHaveStyle({ color: '#ffffff' });
		expect(maxVolumeIcon).toHaveStyle({ color: '#ffffff' });
	});

	it('applies light mode styles when dark is false', () => {
		render(
			<VolumeSlider dark={false} volume={50} onChange={mockOnChange} />
		);

		const box = screen.getByTestId('volume-slider-box');
		const muteIcon = screen.getByTestId('mute-icon');
		const maxVolumeIcon = screen.getByTestId('max-volume-icon');

		expect(box).toHaveStyle({
			backgroundColor: '#f5f5f5',
		});
		expect(muteIcon).toHaveStyle({ color: '#000000' });
		expect(maxVolumeIcon).toHaveStyle({ color: '#000000' });
	});
});
