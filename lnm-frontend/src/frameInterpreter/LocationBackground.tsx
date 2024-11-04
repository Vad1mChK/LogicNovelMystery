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
			width: '100%',
			height: '100%',
			backgroundSize: 'cover',
		}}
	/>
);

export default LocationBackground;
