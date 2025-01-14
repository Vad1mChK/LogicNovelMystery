import React from 'react';
import { LnmResult } from './types';
import { t } from 'i18next';
import '../css/CreateOrResultsScreen.scss';
import { BASE_URL } from '../metaEnv';

interface ResultsScreenProps {
	result: LnmResult;
	partnerName?: string;
	score: number;
	highScore?: number;
	onQuitToMain?: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
	result,
	partnerName,
	score,
	highScore,
	onQuitToMain,
}) => {
	const resultImages: Record<LnmResult, string> = {
		SINGLE_BAD: 'assets/img/endings/BadEndingScreens.webp',
		SINGLE_GOOD: 'assets/img/endings/GoodEndingScreens.webp',
		DOUBLE_BAD: 'assets/img/endings/BadEndingSpaceExplosions.webp',
		DOUBLE_AVERAGE: 'assets/img/endings/BadEndingFinal.webp',
		DOUBLE_GOOD: 'assets/img/endings/GoodEndingFinal.webp',
	};

	return (
		<div className="results-screen">
			<div className="results-background">
				<img
					src={`${BASE_URL}${resultImages[result]}`}
					alt={t(`game.resultScreen.result.${result}`)}
				/>
			</div>
			<div className="results-bar">
				<h1>{t(`game.resultScreen.result.${result}`)}</h1>
				{partnerName && (
					<p>
						<b>{t('game.resultScreen.yourPartner')} </b>
						{partnerName}
					</p>
				)}
				<p>
					<b>{t('game.resultScreen.yourScore')} </b>
					{score}
				</p>
				<p>
					{highScore &&
						(score > highScore ? (
							<b>{t('game.resultScreen.newHighScore')}</b>
						) : (
							<>
								<b>{t('game.resultScreen.yourHighScore')} </b>
								{highScore}
							</>
						))}
				</p>
				<button className="results-to-main" onClick={onQuitToMain}>
					{t('game.resultScreen.toMain')}
				</button>
			</div>
		</div>
	);
};

export default ResultsScreen;
