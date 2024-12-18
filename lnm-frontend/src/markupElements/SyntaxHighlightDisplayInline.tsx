import React, { useEffect, useState } from 'react';
import 'prismjs/themes/prism-twilight.css'; // Import a Prism theme
// import 'prismjs/components/prism-prolog';
import Prism from 'prismjs';
import { copyTextToClipboard } from './markupUtils';
import { IconButton, Tooltip } from '@mui/material';
import CopyIcon from '@mui/icons-material/ContentCopy';
import { t } from 'i18next';

interface SyntaxHighlightDisplayInlineProps {
	value: string;
	copyable?: boolean;
}

const SyntaxHighlightDisplayInline: React.FC<
	SyntaxHighlightDisplayInlineProps
> = ({ value = '', copyable = true }) => {
	const [highlightedContent, setHighlightedContent] = useState<string>(''); // Highlighted version

	useEffect(() => {
		// Dynamically load Prolog syntax highlighting if not already loaded
		if (!Prism.languages.prolog) {
			// @ts-expect-error prism-prolog has an any type
			import('prismjs/components/prism-prolog').catch((err) =>
				console.error('Failed to load Prolog language syntax:', err)
			);
		}
	}, []);

	useEffect(() => {
		if (Prism.languages['prolog']) {
			const highlighted = Prism.highlight(
				value,
				Prism.languages['prolog'],
				'prolog'
			);
			setHighlightedContent(highlighted);
		} else {
			console.error(
				'Prolog syntax highlighting data could not be loaded'
			);
			setHighlightedContent(value);
		}
	}, []);

	const copyCode = (ev: React.MouseEvent) => {
		ev.preventDefault();
		copyTextToClipboard(value);
	};

	return (
		<span className="syntax-highlight display-inline">
			<code
				className="syntax-highlight-display-inline-code"
				dangerouslySetInnerHTML={{ __html: highlightedContent }}
			/>
			{copyable && (
				<Tooltip title={t('game.taskWindow.syntaxHighlight.copy')}>
					<IconButton onClick={copyCode}>
						<CopyIcon className="syntax-highlight-icon-button" />
					</IconButton>
				</Tooltip>
			)}
		</span>
	);
};

export default SyntaxHighlightDisplayInline;
