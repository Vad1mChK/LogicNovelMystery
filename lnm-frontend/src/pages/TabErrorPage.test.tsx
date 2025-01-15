import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Для использования matchers like 'toBeInTheDocument'
import TabErrorPage from './TabErrorPage';
import { useTranslation } from 'react-i18next';

// Мокаем useTranslation, чтобы не зависеть от реальных переводов
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key, // Возвращаем ключ как текст
    }),
}));

describe('TabErrorPage', () => {
    it('должен отобразить текст ошибки с правильными ключами локализации', () => {
        render(<TabErrorPage />);

        // Проверяем, что тексты из локализации отображаются
        expect(screen.getByText('TabErrorPage.You have unclosed tabs with our website!')).toBeInTheDocument();
        expect(screen.getByText('TabErrorPage.Please return to the tab that is already open or close it.')).toBeInTheDocument();
    });
});
