import React from 'react';
import '../css/HealthBar.scss';
import { Tooltip } from '@mui/material'; // Styling

interface HealthBarProps {
	currentHealth: number;
	maxHealth: number;
}

const HealthBar: React.FC<HealthBarProps> = ({ currentHealth, maxHealth }) => {
	const healthPercentage = Math.max(
		0,
		Math.min(100, (currentHealth / maxHealth) * 100)
	); // Clamp percentage between 0 and 100
	const MEDIUM_THRESHOLD = 70;
	const LOW_THRESHOLD = 30;

	const healthLevelClass =
		healthPercentage >= MEDIUM_THRESHOLD
			? 'health-high'
			: healthPercentage >= LOW_THRESHOLD
				? 'health-medium'
				: 'health-low';

	return (
		<Tooltip title={`${healthPercentage}%`}>
			<div className="health-bar">
				<div
					className={`health-bar-fill ${healthLevelClass}`}
					style={{
						width: `${healthPercentage}%`,
					}}
				></div>
			</div>
		</Tooltip>
	);
};

export default HealthBar;
