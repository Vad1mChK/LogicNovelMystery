import React, { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs'; // Ensure Prism is installed
import 'prismjs/themes/prism-twilight.css'; // Import a Prism theme
import 'prismjs/components/prism-prolog';
import '../css/SyntaxHighlightComponents.scss';
import copyCodeIcon from '../assets/img/svg/copyCodeIcon.svg';
import { copyTextToClipboard } from './markupUtils';

interface SyntaxHighlightDisplayProps {
	value: string; // Code to display
	width?: number | string;
	height?: number | string;
}

const SyntaxHighlightDisplay: React.FC<SyntaxHighlightDisplayProps> = ({
	value,
	width = '100%',
	height = '100%',
}) => {
	const [highlightedContent, setHighlightedContent] = useState<string>(''); // Highlighted version
	const preRef = useRef<HTMLPreElement>(null);

	// Update syntax highlighting whenever `value` changes
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
	}, [value]);

	// Copy code to clipboard
	const copyCode = (ev: React.MouseEvent) => {
		ev.preventDefault();
		copyTextToClipboard(value);
	};

	return (
		<div
			className="syntax-highlight display"
			style={{
				width: width,
				height: height,
			}}
		>
			<div className="syntax-highlight-top-row">
				<img
					src={copyCodeIcon}
					onClick={copyCode}
					className="syntax-highlight-top-row-button"
					alt="Copy code"
					title="Copy code"
				/>
			</div>
			<div className="syntax-highlight-code-area">
				<pre
					className="syntax-highlight-display-content"
					ref={preRef}
					aria-hidden="true"
					dangerouslySetInnerHTML={{ __html: highlightedContent }}
				/>
			</div>
		</div>
	);
};

export default SyntaxHighlightDisplay;
