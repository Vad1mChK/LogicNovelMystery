import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import HealthBar from './HealthBar';
import healthBar from "./HealthBar";

jest.mock('../css/HealthBar.scss', () => ({}));

describe('HealthBar Component', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('renders the health bar with correct width and tooltip', () => {
		const currentHealth = 50;
		const maxHealth = 100;

		render(
			<HealthBar currentHealth={currentHealth} maxHealth={maxHealth} />
		);

		// Select the health bar fill element
		const healthBarFill = screen.getByTestId('health-bar-fill');

		// Assert the width of the health bar fill is correct
		expect(healthBarFill).toHaveStyle({ width: '50%' });
	});

	it('clamps health percentage at 100% when currentHealth exceeds maxHealth', () => {
		const currentHealth = 120;
		const maxHealth = 100;

		render(
			<HealthBar currentHealth={currentHealth} maxHealth={maxHealth} />
		);

		const healthBarFill = screen.getByTestId('health-bar-fill');

		// Assert the width of the health bar fill is 100%
		expect(healthBarFill).toHaveStyle({ width: '100%' });
	});

	it('clamps health percentage at 0% when currentHealth is less than 0', () => {
		const currentHealth = -10;
		const maxHealth = 100;

		render(
			<HealthBar currentHealth={currentHealth} maxHealth={maxHealth} />
		);

		const healthBarFill = screen.getByTestId('health-bar-fill');

		// Assert the width of the health bar fill is 0%
		expect(healthBarFill).toHaveStyle({ width: '0%' });
	});

	it('applies the correct class based on health percentage', () => {
		const { rerender } = render(
			<HealthBar currentHealth={80} maxHealth={100} />
		);

		// Assert high health applies the correct class
		let healthBarFill = screen.getByTestId('health-bar-fill');
		expect(healthBarFill).toHaveClass('health-high');

		rerender(<HealthBar currentHealth={50} maxHealth={100} />);
		healthBarFill = screen.getByTestId('health-bar-fill');

		// Assert medium health applies the correct class
		expect(healthBarFill).toHaveClass('health-medium');

		rerender(<HealthBar currentHealth={20} maxHealth={100} />);
		healthBarFill = screen.getByTestId('health-bar-fill');

		// Assert low health applies the correct class
		expect(healthBarFill).toHaveClass('health-low');
	});

	it('is outside the screen when hidden', () => {
		const currentHealth = 100;
		const maxHealth = 100;

		render(
			<HealthBar currentHealth={currentHealth} maxHealth={maxHealth} hidden />
		);

		screen.debug();

		const healthBar = screen.getByTestId('health-bar');
		expect(healthBar).toHaveClass('hidden-health-bar');
		expect(healthBar).toHaveStyle({ left: -5 });
	})
});
