// languageSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface LanguageState {
	currentLanguage: string;
}

// Load language from localStorage, fallback to 'en' if not found
const savedLanguage = localStorage.getItem('language') || 'en';

const initialState: LanguageState = {
	currentLanguage: savedLanguage,
};

const languageSlice = createSlice({
	name: 'language',
	initialState,
	reducers: {
		setLanguage: (state, action) => {
			state.currentLanguage = action.payload;
			localStorage.setItem('language', action.payload); // Persist on every change
		},
	},
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
export type { LanguageState };
