import React from 'react';
import { Slider, IconButton, Box, Tooltip } from '@mui/material';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

interface VolumeSliderProps {
	dark: boolean; // Boolean to control dark mode
	volume: number; // Current volume level (0-100)
	onChange: (value: number) => void; // Callback when the slider value changes
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({
	dark,
	volume,
	onChange,
}) => {
	const handleSliderChange = (_event: Event, newValue: number | number[]) => {
		onChange(newValue as number);
	};

	const PADDING = 2;
	const BORDER_RADIUS = 2;

	return (
		<Box
			data-testid="volume-slider-box"
			display="flex"
			alignItems="center"
			gap={2}
			sx={{
				backgroundColor: dark ? '#121212' : '#f5f5f5',
				color: dark ? '#ffffff' : '#000000',
				padding: PADDING,
				borderRadius: BORDER_RADIUS,
			}}
		>
			<IconButton
				onClick={() => onChange(0)}
				sx={{ color: dark ? '#ffffff' : '#000000' }}
				data-testid="mute-icon"
			>
				<VolumeOffIcon />
			</IconButton>
			<Tooltip
				title={`${volume}%`}
				data-testid="volume-slider-tooltip"
				arrow
			>
				<Slider
					value={volume}
					data-testid="volume-slider-slider"
					onChange={handleSliderChange}
					min={0}
					max={100}
					sx={{
						color: dark ? '#90caf9' : '#1976d2',
						minWidth: `${10}em`,
					}}
					aria-labelledby="volume-slider"
				/>
			</Tooltip>
			<IconButton
				onClick={() => onChange(100)}
				sx={{ color: dark ? '#ffffff' : '#000000' }}
				data-testid="max-volume-icon"
			>
				<VolumeUpIcon />
			</IconButton>
		</Box>
	);
};

export default VolumeSlider;
