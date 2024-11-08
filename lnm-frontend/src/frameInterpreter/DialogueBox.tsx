// DialogueBox.tsx
import React from 'react';

interface DialogueBoxProps {
	speakerName?: string;
	text: string;
}

const DialogueBox: React.FC<DialogueBoxProps> = ({ speakerName, text }) => (
	<div className="game-dialogue-box">
		{speakerName && <div className="speaker-name">{speakerName}</div>}
		<div className="dialogue-text">{text}</div>
	</div>
);

export default DialogueBox;
