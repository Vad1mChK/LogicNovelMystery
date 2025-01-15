// src/components/SecretPage.musicManager.test.tsx

import { render, screen } from '@testing-library/react';
import SecretPage from './SecretPage';

describe('SecretPage Component', () => {
	it('should render without crashing', () => {
		render(<SecretPage />);

		// Просто проверяем, что компонент рендерится, т.к. он не рендерит никаких элементов
		const secretPageElement = screen.getByTestId('secret-page');
		expect(secretPageElement).toBeInTheDocument();
	});
});
