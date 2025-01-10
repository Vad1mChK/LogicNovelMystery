import React from 'react';
import { LnmResult } from './types.ts';

interface ResultsScreenProps {
	result: LnmResult;
	partnerName?: string;
	score: number;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
	result,
	partnerName,
	score,
}) => {
	return (
		<div className="results-screen">
			<div className="results-background"></div>
			<div className="results-bar">
				<h1>{result}</h1>
				{[
					LnmResult.DOUBLE_BAD,
					LnmResult.DOUBLE_AVERAGE,
					LnmResult.DOUBLE_GOOD,
				].includes(result) &&
					partnerName && (
						<p>
							<b>Your partner: </b>
							{partnerName}
						</p>
					)}
				<p>
					<b>Your score: </b>
					{score}
				</p>
			</div>
		</div>
	);
};

export default ResultsScreen;
