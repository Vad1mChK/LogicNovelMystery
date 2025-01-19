import React from 'react';
import { IconButton, IconContainerProps, Rating, styled } from '@mui/material';
import {
	ArrowBackIos,
	ArrowForwardIos,
	FirstPage,
	LastPage,
	Login,
	People,
	SportsEsports,
	Terminal,
	WavingHand,
} from '@mui/icons-material';

export const SLIDES_COUNT = 5;

const StyledRating = styled(Rating)(({ theme }) => ({
	'& .MuiRating-iconEmpty .MuiSvgIcon-root': {
		color: theme.palette.action.disabled,
	},
	'& .MuiRating-icon': {
		margin: '0 8px', // Add spacing between icons
	},
}));

const customIcons: {
	[index: string]: {
		icon: React.ReactElement<unknown>;
		label: string;
	};
} = {
	1: {
		icon: <WavingHand />,
		label: 'Welcome',
	},
	2: {
		icon: <Terminal />,
		label: 'Objectives',
	},
	3: {
		icon: <People />,
		label: 'Characters',
	},
	4: {
		icon: <SportsEsports />,
		label: 'Gamemodes',
	},
	5: {
		icon: <Login />,
		label: 'Login',
	},
};

function IconContainer(props: IconContainerProps) {
	const { value, ...other } = props;
	return (
		<span {...other} style={{ display: 'flex', justifyContent: 'center' }}>
			{customIcons[value].icon}
		</span>
	);
}

interface LandingControlsProps {
	dark: boolean; // Control dark mode
	value: number; // Current value of the rating
	onChange: (
		event: React.ChangeEvent<object>,
		newValue: number | null
	) => void; // Callback when value changes
}

const LandingControls: React.FC<LandingControlsProps> = ({
	dark,
	value,
	onChange,
}) => {
	const buttonColor = dark ? '#f4f4f4' : '#101010';

	return (
		<div className="landing-controls flex row">
			<div className="landing-buttons">
				<IconButton
					onClick={(ev) => onChange(ev, 1)}
					data-testid="first-slide"
				>
					<FirstPage
						sx={{
							color: buttonColor,
						}}
					/>
				</IconButton>
				<IconButton
					onClick={(ev) => onChange(ev, Math.max(1, value - 1))}
					data-testid="previous-slide"
				>
					<ArrowBackIos
						sx={{
							color: buttonColor,
						}}
					/>
				</IconButton>
			</div>
			<StyledRating
				className="landing-progress-bar"
				IconContainerComponent={IconContainer}
				getLabelText={(value: number) => customIcons[value].label}
				value={value}
				onChange={onChange}
				max={5} // Ensure the max rating matches the number of icons
				sx={{
					color: buttonColor,
					'& .MuiRating-iconFilled': {
						color: dark ? '#90caf9' : '#1976d2',
					},
				}}
			/>
			<div className="landing-buttons">
				<IconButton
					data-testid="next-slide"
					onClick={(ev) =>
						onChange(ev, Math.min(SLIDES_COUNT, value + 1))
					}
				>
					<ArrowForwardIos
						sx={{
							color: buttonColor,
						}}
					/>
				</IconButton>
				<IconButton
					onClick={(ev) => onChange(ev, SLIDES_COUNT)}
					data-testid="last-slide"
				>
					<LastPage
						sx={{
							color: buttonColor,
						}}
					/>
				</IconButton>
			</div>
		</div>
	);
};

export default LandingControls;
