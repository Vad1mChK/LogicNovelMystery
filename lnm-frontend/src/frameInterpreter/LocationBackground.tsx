// LocationBackground.tsx
import React from 'react';
import { LnmLocation } from './types';

interface LocationBackgroundProps {
	location: LnmLocation;
}

const LocationBackground: React.FC<LocationBackgroundProps> = ({
	location,
}) => (
	<div
		style={{
			backgroundImage: `url(${location.background})`,
			position: 'absolute',
			height: '100%',
			top: '0',
			left: '50%',
			zIndex: '-100',
			backgroundSize: 'cover',
			overflow: 'hidden',
		}}
	/>
);

export default LocationBackground;
