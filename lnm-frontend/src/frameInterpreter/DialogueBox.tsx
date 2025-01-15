// DialogueBox.tsx
import React from 'react';
import TextSyntaxHighlighter from '../markupElements/TextSyntaxHighlighter';

interface DialogueBoxProps {
	speakerName?: string;
	text: string;
}

const DialogueBox: React.FC<DialogueBoxProps> = ({ speakerName, text }) => (
	<div className="game-dialogue-box">
		{speakerName && (
			<div className="speaker-name" data-testid="dialogue-speaker">
				{speakerName}
			</div>
		)}
		<div className="dialogue-text" data-testid="dialogue-text">
			<TextSyntaxHighlighter input={text} copyable={false} />
		</div>
	</div>
);

export default DialogueBox;
