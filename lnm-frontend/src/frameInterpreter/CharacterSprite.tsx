// CharacterSprite.tsx
import React from 'react';
import { LnmCharacter, LnmFrameCharacterData } from './types';

interface CharacterSpriteProps {
	character: LnmCharacter;
	isSpeaker: boolean;
	characterData: LnmFrameCharacterData;
}

const CharacterSprite: React.FC<CharacterSpriteProps> = ({
	character,
	isSpeaker,
	characterData,
}) => {
	const spriteUrl = character.sprites
		.get(characterData.pose || character.defaultPose || '')
		?.replace(/^\/src/, import.meta.env.MODE === 'development' ? '' : '.'); // TODO Temporary hack, do not rely on Vite vars later

	const positionStyles = {
		left: { left: '25%' },
		center: { left: '50%' },
		right: { left: '75%' },
	};

	return (
		<img
			className={
				'game-character' +
				(characterData.hidden ? ' hidden-character' : '') +
				(isSpeaker ? ' speaker' : '')
			}
			src={spriteUrl}
			alt={character.name}
			title={character.name}
			style={{
				...positionStyles[characterData.position || 'center'],
			}}
		/>
	);
};

export default CharacterSprite;
