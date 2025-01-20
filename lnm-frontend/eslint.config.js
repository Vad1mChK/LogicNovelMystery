import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import noOnlyTests from '@funboxteam/eslint-plugin-no-only-tests';
import jest from 'eslint-plugin-jest';
import playwright from 'eslint-plugin-playwright';

export default [
	{
		ignores: ['dist', 'node_modules'],
	},
	{
		// General JavaScript rules to be applied to both JS and TS files
		files: ['src/**/*.{js,jsx,ts,tsx}', 'e2e/**/*.{js,jsx,ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
			prettier,
			'@funboxteam/no-only-tests': noOnlyTests,
			jest,
			playwright,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			'react-refresh/only-export-components': [
				'warn',
				{
					allowConstantExport: true,
				},
			],
			'consistent-return': [
				'error',
				{
					treatUndefinedAsUnspecified: true,
				},
			],
			'no-eval': ['error'],
			'no-magic-numbers': [
				'warn',
				{
					detectObjects: true,
					enforceConst: true,
					ignore: [-1, 0, 1, 10, 100],
					ignoreDefaultValues: true,
				},
			],
			'no-unused-vars': ['warn'],
			'no-var': ['error'],
			'prefer-const': [
				'warn',
				{
					destructuring: 'any',
					ignoreReadBeforeAssign: true,
				},
			],
			'prettier/prettier': [
				'error',
				{
					endOfLine: 'auto',
				},
			], // Prettier rule as an error
			'jest/no-focused-tests': 'error',
			'playwright/no-focused-test': 'error',
		},
	},
	{
		// TypeScript-specific rules, only applied to TS/TSX files
		files: ['src/**/*.{ts,tsx}', 'e2e/**/*.{ts,tsx}'],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parser: tsParser, // Use the TypeScript parser for .ts and .tsx files
		},
		plugins: {
			'@typescript-eslint': tseslint,
			prettier,
		},
		rules: {
			...tseslint.configs.recommended.rules, // TypeScript-specific rules
			'@typescript-eslint/no-unused-vars': 'warn', // TS-specific rule
			'prettier/prettier': 'error', // Prettier rule as an error
			'jest/no-focused-tests': 'error',
			'playwright/no-focused-test': 'error',
		},
	},
	{
		// Disable ESLint formatting rules that Prettier handles
		files: ['**/*.{js,jsx,ts,tsx}'],
		plugins: {
			prettier,
		},
		rules: {
			'prettier/prettier': 'error',
			...prettierConfig.rules, // Apply Prettier config
		},
	},
];
