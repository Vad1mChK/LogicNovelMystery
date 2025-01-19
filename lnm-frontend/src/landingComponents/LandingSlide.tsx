import React from 'react';
import { Box } from '@mui/material';

interface LandingSlideProps {
	children?: React.ReactNode; // Optional children elements between tags
	slideNumber?: number;
	currentSlide?: number;
}

const LandingSlide: React.FC<LandingSlideProps> = ({
	children,
	slideNumber = 0,
	currentSlide = 0,
}) => {
	return (
		<Box
			className="landing-slide"
			sx={{
				position: 'relative',
				width: '100vw',
				height: '100vh',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				flexDirection: 'column',
				overflow: 'hidden',
				padding: 2, // Add padding for children
			}}
			style={{
				transform: `translateY(${
					slideNumber !== null && currentSlide !== undefined
						? (slideNumber - currentSlide) * 100
						: 0
				}%)`,
			}}
		>
			{children}
		</Box>
	);
};

export default LandingSlide;
