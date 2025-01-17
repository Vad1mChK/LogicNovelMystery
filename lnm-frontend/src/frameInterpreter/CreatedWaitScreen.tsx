import React from 'react';
import { t } from 'i18next';
import mansionEntrance from '../assets/img/locations/MansionEntrance.webp';
import '../css/CreateOrResultsScreen.scss';
import { BASE_URL } from '../metaEnv';
import CharacterSprite from './CharacterSprite';
import { LnmCharacter, LnmFrameCharacterData, LnmHero } from './types';

interface CreatedWaitScreenProps {
	protagonist: LnmHero;
	onQuitToMain?: () => void;
}

const CreatedWaitScreen: React.FC<CreatedWaitScreenProps> = ({
	protagonist,
	onQuitToMain = () => {},
}) => {
	const protagonistToLocationImage: Map<LnmHero, string> = new Map([
		[LnmHero.STEVE, `${BASE_URL}assets/img/locations/AgentOffice.webp`],
		[
			LnmHero.PROFESSOR,
			`${BASE_URL}assets/img/locations/ProfessorBedroom.webp`,
		],
		[LnmHero.VICKY, `${BASE_URL}assets/img/locations/VickyRoom.webp`],
	]);
	const protagonistCharacter: LnmCharacter = {
		id: protagonist,
		name: t(`game.protagonist.${protagonist.toLowerCase()}`),
		defaultPose: 'idle',
		sprites: new Map([
			[
				'idle',
				`assets/img/characters/${protagonist.toLowerCase()}/idle.webp`,
			],
		]),
	};
	const protagonistCharacterData: LnmFrameCharacterData = {
		id: protagonist,
	};

	return (
		<div className="results-screen">
			<div className="results-background">
				<img
					src={
						protagonistToLocationImage.get(protagonist) ||
						mansionEntrance
					}
					alt={t('game.createdWaitScreen.wait')}
				/>
			</div>
			<div className="results-bar">
				<h1>{t('game.createdWaitScreen.created')}</h1>
				<p>
					{protagonist === LnmHero.STEVE
						? t('game.createdWaitScreen.wait.single')
						: t('game.createdWaitScreen.wait.multiplayer')}
				</p>
				<p>
					{t('game.createdWaitScreen.willPlayAs', {
						protagonist: t(
							`game.protagonist.${protagonist.toLowerCase()}`
						),
					})}
				</p>
			</div>
			<div className="game-character">
				<CharacterSprite
					character={protagonistCharacter}
					isSpeaker={false}
					characterData={protagonistCharacterData}
				/>
			</div>
			<button className="game-button home-button" onClick={onQuitToMain}>
				{t('game.homeButton')}
			</button>
		</div>
	);
};

export default CreatedWaitScreen;
