module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: ['**/?(*.)+(test).(js|ts)'],

    // Собираем покрытие тестами
    collectCoverage: false,

    // Отчеты о покрытии кода
    coverageDirectory: 'coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover'],

    // Указываем, какие файлы учитывать при сборе покрытия
    collectCoverageFrom: ['src/**/*.{ts,tsx,js,jsx}', '!src/**/*.d.ts'],

    // Минимальные значения покрытия
    coverageThreshold: {
        global: {
            branches: 20, // Set back to 80% later
            functions: 20, // Set back to 80% later
            lines: 0,
            statements: 0,
        },
    },
};

