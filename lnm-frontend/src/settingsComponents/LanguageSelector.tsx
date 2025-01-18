import React, { ReactNode } from 'react';
import {
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Box,
	SelectChangeEvent,
} from '@mui/material';
import { Translate } from '@mui/icons-material';
import { t } from 'i18next';

interface LanguageSelectorProps {
	dark: boolean; // Boolean to control dark mode
	currentLanguage: string; // Currently selected language code (e.g., 'en', 'fr')
	languages: { code: string; label: string }[]; // Available languages
	onChange: (languageCode: string) => void; // Callback when the language is changed
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
	dark,
	currentLanguage,
	languages,
	onChange,
}) => {
	const handleChange = (
		event: SelectChangeEvent<string>,
		_child: ReactNode
	) => {
		onChange(event.target.value);
	};

	return (
		<Box
			display="flex"
			alignItems="center"
			gap={2}
			sx={{
				backgroundColor: dark ? '#121212' : '#f5f5f5',
				color: dark ? '#ffffff' : '#000000',
				padding: 2,
				borderRadius: 2,
			}}
		>
			<Translate sx={{ color: dark ? '#90caf9' : '#1976d2' }} />
			<FormControl variant="outlined" sx={{ minWidth: 150 }}>
				<InputLabel
					sx={{
						color: dark ? '#ffffff' : '#000000',
					}}
				>
					{t('Language')}
				</InputLabel>
				<Select
					value={currentLanguage}
					onChange={handleChange}
					label="Language"
					sx={{
						color: dark ? '#ffffff' : '#000000',
						backgroundColor: dark ? '#1e1e1e' : '#ffffff',
						'& .MuiOutlinedInput-notchedOutline': {
							borderColor: dark ? '#90caf9' : '#1976d2',
						},
						'&:hover .MuiOutlinedInput-notchedOutline': {
							borderColor: dark ? '#64b5f6' : '#1565c0',
						},
					}}
				>
					{languages.map((lang) => (
						<MenuItem key={lang.code} value={lang.code}>
							{lang.label}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
};

export default LanguageSelector;
