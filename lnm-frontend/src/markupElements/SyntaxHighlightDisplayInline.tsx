import React, { useEffect, useState } from 'react';
import 'prismjs/themes/prism-twilight.css'; // Import a Prism theme
import 'prismjs/components/prism-prolog';
import Prism from 'prismjs';
import { copyTextToClipboard } from './markupUtils';
import copyCodeIcon from '../assets/img/svg/copyCodeIcon.svg';

interface SyntaxHighlightDisplayInlineProps {
	value: string;
}

const SyntaxHighlightDisplayInline: React.FC<
	SyntaxHighlightDisplayInlineProps
> = ({ value = '' }) => {
	const [highlightedContent, setHighlightedContent] = useState<string>(''); // Highlighted version

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
			<img
				src={copyCodeIcon}
				onClick={copyCode}
				className="syntax-highlight-top-row-button"
				alt="Copy code"
				title="Copy code"
			/>
		</span>
	);
};

export default SyntaxHighlightDisplayInline;
