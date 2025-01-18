import React from 'react';
import { Slider, IconButton, Box, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Left pan icon
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // Right pan icon

interface PanningSliderProps {
	dark: boolean; // Boolean to control dark mode
	panning: number; // Current panning level (-100 to 100)
	onChange: (value: number) => void; // Callback when the slider value changes
}

const PanningSlider: React.FC<PanningSliderProps> = ({
	dark,
	panning,
	onChange,
}) => {
	const handleSliderChange = (_event: Event, newValue: number | number[]) => {
		onChange(newValue as number);
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
			<IconButton
				onClick={() => onChange(-100)}
				sx={{ color: dark ? '#ffffff' : '#000000' }}
			>
				<ArrowBackIcon data-testid="left-pan-icon" />
			</IconButton>
			<Tooltip title={`${panning}%`} arrow>
				<Slider
					value={panning}
					onChange={handleSliderChange}
					min={-100}
					max={100}
					step={10}
					sx={{
						color: dark ? '#90caf9' : '#1976d2',
					}}
					aria-labelledby="panning-slider"
					marks={[{ value: 0 }]}
					data-testid="panning-slider"
				/>
			</Tooltip>
			<IconButton
				onClick={() => onChange(100)}
				sx={{ color: dark ? '#ffffff' : '#000000' }}
			>
				<ArrowForwardIcon data-testid="right-pan-icon" />
			</IconButton>
		</Box>
	);
};

export default PanningSlider;
