import React, { useState, useRef, useEffect } from 'react';
import Prism from 'prismjs'; // Ensure Prism is installed
import 'prismjs/themes/prism-twilight.css'; // Import a Prism theme
import 'prismjs/components/prism-prolog';
import '../css/SyntaxHighlightComponents.scss';
import { copyTextToClipboard } from './markupUtils';
import { IconButton, Tooltip } from '@mui/material';
import {
	Restore as RestoreIcon,
	ContentCopy as CopyIcon,
	Clear as ClearIcon,
} from '@mui/icons-material';
import { t } from 'i18next';

interface SyntaxHighlightBoxProps {
	placeholder?: string;
	value?: string;
	onUpdate?: (value: string) => void;
	width?: number | string;
	height?: number | string;
}

const SyntaxHighlightInput: React.FC<SyntaxHighlightBoxProps> = ({
	placeholder = '',
	value = '',
	onUpdate = () => {},
	width = '100%',
	height = '10rem',
}) => {
	const [content, setContent] = useState(value); // Internal state for content
	const [displayTabWarning, setDisplayTabWarning] = useState(false);
	const [highlightedContent, setHighlightedContent] = useState<string>(''); // Highlighted version
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const preRef = useRef<HTMLPreElement>(null);
	const initialValue = useRef(value);
	const displayTabWarningTimeoutId = useRef<number | undefined>(undefined);

	// Update syntax highlighting whenever content or language changes
	useEffect(() => {
		if (Prism.languages['prolog']) {
			const highlighted = Prism.highlight(
				content,
				Prism.languages['prolog'],
				'prolog'
			);
			setHighlightedContent(highlighted);
		} else {
			console.error(
				'Prolog syntax highlighting data could not be loaded'
			);
			setHighlightedContent(content);
		}
	}, [content]);

	// Synchronize external `value` prop changes
	useEffect(() => {
		setContent(value ?? '');
	}, [value]);

	// Update internal state and notify parent on textarea changes
	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value;
		setContent(newValue);
		onUpdate(newValue);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Tab') {
			e.preventDefault(); // Prevent default tab behavior
			setDisplayTabWarning(true);

			const textarea = textareaRef.current;
			if (!textarea) return;

			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;

			// Insert tab character
			const updatedContent =
				content.slice(0, start) + '\t' + content.slice(end);

			setContent(updatedContent);
			onUpdate(updatedContent);

			// Move cursor after the tab character
			requestAnimationFrame(() => {
				textarea.selectionStart = textarea.selectionEnd = start + 1;
			});

			console.log(displayTabWarningTimeoutId);
			clearTimeout(displayTabWarningTimeoutId.current);
			displayTabWarningTimeoutId.current = setTimeout(
				() => setDisplayTabWarning(false),
				5000
			);
			console.log(displayTabWarningTimeoutId);
		}
	};

	// Sync scrolling between textarea and pre
	const syncScroll = () => {
		if (textareaRef.current && preRef.current) {
			preRef.current.scrollTop = textareaRef.current.scrollTop;
			preRef.current.scrollLeft = textareaRef.current.scrollLeft;
		}
	};

	const copyCode = (ev: React.MouseEvent) => {
		ev.preventDefault();
		copyTextToClipboard(content);
	};

	const clearCode = (ev: React.MouseEvent) => {
		ev.preventDefault();
		setContent(''); // Clear content
		onUpdate(''); // Notify parent
	};

	const restoreCode = (ev: React.MouseEvent) => {
		ev.preventDefault();
		setContent(initialValue.current ?? ''); // Reset to initial value
		onUpdate(initialValue.current ?? ''); // Notify parent
	};

	return (
		<div
			className="syntax-highlight input"
			style={{
				width: width,
				height: height,
			}}
		>
			<div className="syntax-highlight-top-row">
				<Tooltip title={t('game.taskWindow.syntaxHighlight.copy')}>
					<IconButton onClick={copyCode}>
						<CopyIcon className="syntax-highlight-icon-button" />
					</IconButton>
				</Tooltip>
				<Tooltip title={t('game.taskWindow.syntaxHighlight.restore')}>
					<IconButton onClick={restoreCode}>
						<RestoreIcon className="syntax-highlight-icon-button" />
					</IconButton>
				</Tooltip>
				<Tooltip title={t('game.taskWindow.syntaxHighlight.clear')}>
					<IconButton onClick={clearCode}>
						<ClearIcon className="syntax-highlight-icon-button" />
					</IconButton>
				</Tooltip>
			</div>
			<div className="syntax-highlight-code-area">
				<pre
					className="syntax-highlight-code-area-display"
					ref={preRef}
					aria-hidden="true" // Hidden for screen readers
					dangerouslySetInnerHTML={{ __html: highlightedContent }}
				/>
				<textarea
					className="syntax-highlight-code-area-editable"
					ref={textareaRef}
					placeholder={placeholder}
					value={content}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					onScroll={syncScroll} // Sync scrolling
				/>
				{displayTabWarning && (
					<div className="syntax-highlight-code-area-tab-warning">
						{t('game.taskWindow.textInput.tabWarning')}
					</div>
				)}
			</div>
		</div>
	);
};

export default SyntaxHighlightInput;
