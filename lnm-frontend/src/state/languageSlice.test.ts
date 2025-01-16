import { configureStore } from '@reduxjs/toolkit';
import languageReducer, { setLanguage, LanguageState } from './languageSlice';

describe('languageSlice', () => {
	let store: ReturnType<typeof configureStore>;

	beforeEach(() => {
		store = configureStore({
			reducer: {
				language: languageReducer,
			},
		});
	});

	it('should initialize with "en" as the default language if localStorage is empty', () => {
		// Mock localStorage.getItem to return null (simulating empty localStorage)
		jest.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

		// Create a new store instance
		const store = configureStore({
			reducer: {
				language: languageReducer,
			},
		});

		// Check if the initial state has 'en' as the current language
		expect(store.getState().language.currentLanguage).toBe('en');

		// Clean up the mock
		jest.restoreAllMocks();
	});

	it('should update the currentLanguage state when setLanguage action is dispatched', () => {
		// Mock localStorage.setItem
		jest.spyOn(Storage.prototype, 'setItem');

		// Dispatch the setLanguage action with a new language
		store.dispatch(setLanguage('fr'));

		// Check if the state has been updated
		const state = store.getState() as { language: LanguageState };
		expect(state.language.currentLanguage).toBe('fr');

		// Check if localStorage has been updated
		expect(localStorage.setItem).toHaveBeenCalledWith('language', 'fr');

		// Clean up the mock
		jest.restoreAllMocks();
	});
});
