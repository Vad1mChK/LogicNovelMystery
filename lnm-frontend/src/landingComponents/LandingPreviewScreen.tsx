import React from 'react';
import { BASE_URL } from '../metaEnv.ts';
import { simpleHash } from '../util/hash.ts';

interface LandingLocationProps {
	characters: string[];
	location: string;
	onClick?: () => void;
}

const LandingPreviewScreen: React.FC<LandingLocationProps> = ({
	characters,
	location,
	onClick = () => {},
}) => {
	return (
		<div className="landing-preview" onClick={onClick}>
			<img
				className="landing-preview-location"
				src={`${BASE_URL}assets/img/locations/${location}_small.webp`}
				alt="Location"
			/>
			{characters.map((character, index) => (
				<img
					className="landing-preview-character"
					key={simpleHash(character)}
					src={`${BASE_URL}assets/img/characters/${character.toLowerCase()}/idle.webp`}
					style={{
						left: `${((index + 0.5) / (characters?.length || 1)) * 100}%`,
					}}
					alt={character}
				/>
			))}
		</div>
	);
};

export default LandingPreviewScreen;
