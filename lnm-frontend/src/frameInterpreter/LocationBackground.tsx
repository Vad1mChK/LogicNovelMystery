// LocationBackground.tsx
import React from 'react';
import { LnmLocation } from './types';

interface LocationBackgroundProps {
	location: LnmLocation;
}

const LocationBackground: React.FC<LocationBackgroundProps> = ({
	location,
}) => (
	<div className="game-background">
		<img
			src={`${import.meta.env.BASE_URL}${location.background || ''}`}
			alt={location.name}
			title={location.name}
		/>
	</div>
);
// Url in JSON is expected to begin with 'assets' and not with '/assets'

export default LocationBackground;
