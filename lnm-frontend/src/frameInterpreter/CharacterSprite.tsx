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
	const spriteUrl = `${import.meta.env.BASE_URL}${
		character.sprites.get(
			characterData.pose || character.defaultPose || ''
		) || ''
	}`; // Url in JSON is expected to begin with 'assets' and not with '/assets'
	// console.log(spriteUrl);

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
