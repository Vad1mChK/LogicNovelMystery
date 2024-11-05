// CharacterSprite.tsx
import React from 'react';
import { LnmCharacter, LnmFrameCharacterData } from './types';

interface CharacterSpriteProps {
	character: LnmCharacter;
	characterData: LnmFrameCharacterData;
}

const CharacterSprite: React.FC<CharacterSpriteProps> = ({
	character,
	characterData,
}) => {
	const spriteUrl = character.sprites.get(
		characterData.pose || character.defaultPose || ''
	);

	const positionStyles = {
		left: { left: '10%' },
		center: { left: '50%' },
		right: { left: '80%' },
	};

	return (
		<img
			src={spriteUrl}
			alt={character.name}
			style={{
				position: 'absolute',
				bottom: '0',
				height: '100vh',
				zIndex: '-1',
				transform: 'translateX(-50%)',
				opacity: characterData.hidden ? 0 : 1,
				...positionStyles[characterData.position || 'center'],
			}}
		/>
	);
};

export default CharacterSprite;
