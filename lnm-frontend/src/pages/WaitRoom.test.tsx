import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WaitRoom from './WaitRoom';

describe('WaitRoom Component', () => {
	it('displays alert when "Присоединиться" button is clicked', () => {
		window.alert = jest.fn();
		render(<WaitRoom />);

		fireEvent.click(screen.getByText('Присоединиться'));
		expect(window.alert).toHaveBeenCalledWith('Присоединиться');
	});

	it('displays alert when "Создать" button is clicked', () => {
		window.alert = jest.fn(); // Мокаем alert
		render(<WaitRoom />);

		// Нажимаем на кнопку "Создать"
		fireEvent.click(screen.getByText('Создать'));
		expect(window.alert).toHaveBeenCalledWith('Создать');
	});

	it('selects only one user at a time', () => {
		render(<WaitRoom />);
		const rows = screen.getAllByRole('row').slice(1);

		// Кликаем на первого пользователя
		fireEvent.click(rows[0]);
		expect(rows[0]).toHaveClass('selected');

		// Кликаем на второго пользователя
		fireEvent.click(rows[1]);
		expect(rows[1]).toHaveClass('selected');
		expect(rows[0]).not.toHaveClass('selected');
	});
});
