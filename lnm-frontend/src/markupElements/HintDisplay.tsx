import React, { useState } from 'react';
import '../css/HintDisplay.scss';
import { IconButton, Tooltip } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import TextSyntaxHighlighter from './TextSyntaxHighlighter.tsx';
import { t } from 'i18next';

interface HintDisplayProps {
	hintText: string;
}

const HintDisplay: React.FC<HintDisplayProps> = ({ hintText }) => {
	const [hintHidden, setHintHidden] = useState<boolean>(true);

	const toggleHintHidden = () => {
		setHintHidden(!hintHidden);
	};

	return (
		<p className="hint-display">
			<b>{t('game.taskWindow.hint.hintTitle')}</b>
			<span
				className={`hint-display-text ${hintHidden ? 'hint-display-text-hidden' : ''}`}
				onClick={toggleHintHidden}
			>
				<TextSyntaxHighlighter input={hintText} copyable={false} />
			</span>
			<Tooltip
				title={t('game.taskWindow.hint.toggle')}
				className="hint-display-toggle-button"
			>
				<IconButton onClick={toggleHintHidden}>
					{hintHidden ? <Visibility /> : <VisibilityOff />}
				</IconButton>
			</Tooltip>
		</p>
	);
};

export default HintDisplay;
