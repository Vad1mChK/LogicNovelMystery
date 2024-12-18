import React from 'react';
import SyntaxHighlightDisplay from './SyntaxHighlightDisplay'; // Assuming these components exist
import SyntaxHighlightDisplayInline from './SyntaxHighlightDisplayInline';

interface ParsedSegment {
	type: 'text' | 'inlineCode' | 'blockCode';
	content: string;
}

// Helper function to process code blocks
function parseCodeBlocks(input: string): ParsedSegment[] {
	// Handle triple backticks for block code
	const blockParts = input.split(/```/);
	const segments: ParsedSegment[] = [];

	blockParts.forEach((part, index) => {
		if (index % 2 === 1) {
			// It's a code block
			segments.push({ type: 'blockCode', content: part });
		} else {
			// Regular text (may contain inline code)
			segments.push({ type: 'text', content: part });
		}
	});

	return segments;
}

function parseInlineCode(segments: ParsedSegment[]): ParsedSegment[] {
	const result: ParsedSegment[] = [];
	segments.forEach((seg) => {
		if (seg.type !== 'text') {
			result.push(seg);
			return;
		}

		// Handle inline code with single backticks
		const inlineParts = seg.content.split(/`/);
		inlineParts.forEach((p, i) => {
			if (i % 2 === 1) {
				// inline code segment
				result.push({ type: 'inlineCode', content: p });
			} else {
				// text segment
				if (p) {
					result.push({ type: 'text', content: p });
				}
			}
		});
	});

	return result;
}

function replaceNewlinesWithBreaks(content: string): React.ReactNode[] {
	// If input contains literal "\n", use '\\n'.
	// If actual line breaks, use '\n'.
	return content
		.split('\n')
		.flatMap((line, idx) =>
			idx === 0 ? [line] : [<br key={`br-${idx}`} />, line]
		);
}

interface TextSyntaxHighlighterProps {
	input: string;
	copyable?: boolean;
}

/**
 * Transforms input text:
 * 1. Splits and identifies triple-backtick code blocks.
 * 2. Splits and identifies inline code.
 * 3. Replaces \n with <br/> in text segments.
 * 4. Builds final JSX structure.
 */
const TextSyntaxHighlighter: React.FC<TextSyntaxHighlighterProps> = ({
	input,
	copyable = true,
}) => {
	let segments = parseCodeBlocks(input);
	segments = parseInlineCode(segments);

	const jsxContent = segments.map((seg, i) => {
		if (seg.type === 'blockCode') {
			return <SyntaxHighlightDisplay key={i} value={seg.content} />;
		} else if (seg.type === 'inlineCode') {
			return (
				<SyntaxHighlightDisplayInline
					key={i}
					value={seg.content}
					copyable={copyable}
				/>
			);
		} else {
			// text segment
			return (
				<React.Fragment key={i}>
					{replaceNewlinesWithBreaks(seg.content)}
				</React.Fragment>
			);
		}
	});

	return <>{jsxContent}</>;
};

export default TextSyntaxHighlighter;
