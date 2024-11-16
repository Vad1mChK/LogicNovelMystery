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
			src={`${location.background?.replace(/^\/src/, import.meta.env.MODE === 'development' ? '' : '.')}`} // TODO Temporary hack, do not rely on Vite vars later
			alt={location.name}
			title={location.name}
		/>
	</div>
);

export default LocationBackground;
