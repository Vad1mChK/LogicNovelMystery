import { render, screen, fireEvent } from '@testing-library/react';
import LandingControls, { SLIDES_COUNT } from './LandingControls';

describe('LandingControls', () => {
	it('should render all custom icons correctly in the rating component', () => {
		const mockOnChange = jest.fn();
		render(
			<LandingControls dark={false} value={1} onChange={mockOnChange} />
		);

		const icons = screen.getAllByRole('radio');
		expect(icons.length).toBeGreaterThanOrEqual(5);

		const labels = [
			'Welcome',
			'Objectives',
			'Characters',
			'Gamemodes',
			'Login',
		];
		labels.forEach((label) => {
			const elem = screen.getByLabelText(new RegExp(label));
			expect(elem).toBeInTheDocument();
			expect(elem).toHaveAttribute('value');
		});
	});

	it('should navigate to the first slide when clicking the FirstPage icon', () => {
		const mockOnChange = jest.fn();
		const initialValue = 3;
		render(
			<LandingControls
				dark={false}
				value={initialValue}
				onChange={mockOnChange}
			/>
		);

		const firstPageButton = screen.getByTestId('first-slide');
		fireEvent.click(firstPageButton);

		expect(mockOnChange).toHaveBeenCalledWith(expect.anything(), 1);
	});

	it('should navigate to the last slide when clicking the LastPage icon', () => {
		const mockOnChange = jest.fn();
		const initialValue = 3;
		render(
			<LandingControls
				dark={false}
				value={initialValue}
				onChange={mockOnChange}
			/>
		);

		const lastPageButton = screen.getByTestId('last-slide');
		fireEvent.click(lastPageButton);

		expect(mockOnChange).toHaveBeenCalledWith(
			expect.anything(),
			SLIDES_COUNT
		);
	});

	it('should move to the previous slide when clicking the ArrowBackIos icon', () => {
		const mockOnChange = jest.fn();
		const initialValue = 3;
		render(
			<LandingControls
				dark={false}
				value={initialValue}
				onChange={mockOnChange}
			/>
		);

		const previousButton = screen.getByTestId('previous-slide');
		fireEvent.click(previousButton);

		expect(mockOnChange).toHaveBeenCalledWith(
			expect.anything(),
			initialValue - 1
		);
	});

	it('should move to the next slide when clicking the ArrowForwardIos icon', () => {
		const mockOnChange = jest.fn();
		const initialValue = 3;
		render(
			<LandingControls
				dark={false}
				value={initialValue}
				onChange={mockOnChange}
			/>
		);

		const nextButton = screen.getByTestId('next-slide');
		fireEvent.click(nextButton);

		expect(mockOnChange).toHaveBeenCalledWith(
			expect.anything(),
			initialValue + 1
		);
	});

	it('should not navigate to the previous slide when on the first slide', () => {
		const mockOnChange = jest.fn();
		const initialValue = 1;
		render(
			<LandingControls
				dark={false}
				value={initialValue}
				onChange={mockOnChange}
			/>
		);

		const previousButton = screen.getByTestId('previous-slide');
		fireEvent.click(previousButton);

		expect(mockOnChange).toHaveBeenCalledWith(expect.anything(), 1);
	});

	it('should not navigate to the next slide when on the last slide', () => {
		const mockOnChange = jest.fn();
		const initialValue = SLIDES_COUNT;
		render(
			<LandingControls
				dark={false}
				value={initialValue}
				onChange={mockOnChange}
			/>
		);

		const nextButton = screen.getByTestId('next-slide');
		fireEvent.click(nextButton);

		expect(mockOnChange).toHaveBeenCalledWith(
			expect.anything(),
			SLIDES_COUNT
		);
	});
});
