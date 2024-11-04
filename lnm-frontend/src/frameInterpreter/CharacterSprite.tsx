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
	if (characterData.hidden) return null;

	const spriteUrl = character.sprites.get(
		characterData.pose || character.defaultPose || ''
	);

	const positionStyles = {
		left: { left: '10%' },
		center: { left: '45%' },
		right: { left: '80%' },
	};

	return (
		<img
			src={spriteUrl}
			alt={character.name}
			style={{
				position: 'absolute',
				bottom: '0',
				...positionStyles[characterData.position || 'center'],
			}}
		/>
	);
};

export default CharacterSprite;
