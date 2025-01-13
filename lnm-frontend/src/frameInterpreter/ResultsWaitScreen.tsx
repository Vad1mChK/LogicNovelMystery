import React from 'react';
import { BASE_URL } from '../metaEnv';
import { t } from 'i18next';
import '../css/CreateOrResultsScreen.scss';

interface ResultsWaitScreenProps {
	winner: boolean;
	multiplayer?: boolean;
}

const ResultsWaitScreen: React.FC<ResultsWaitScreenProps> = ({
	winner,
	multiplayer = false,
}) => {
	return (
		<div className="results-screen">
			<div className="results-background">
				<img
					src={`${BASE_URL}assets/img/locations/ComputerRoom.webp`}
					alt={
						multiplayer
							? t('game.resultWaitScreen.wait.multiplayer')
							: t('game.resultWaitScreen.wait.single')
					}
				/>
			</div>
			<div className="results-bar">
				<h1>
					{winner
						? t('game.resultWaitScreen.win')
						: t('game.resultWaitScreen.lose')}
				</h1>
				<p>
					{multiplayer
						? t('game.resultWaitScreen.wait.multiplayer')
						: t('game.resultWaitScreen.wait.single')}
				</p>
				<p>
					{multiplayer
						? t('game.resultWaitScreen.pageWillUpdate.multiplayer')
						: t('game.resultWaitScreen.pageWillUpdate.single')}
				</p>
			</div>
		</div>
	);
};

export default ResultsWaitScreen;