// DialogueBox.tsx
import React from 'react';

interface DialogueBoxProps {
	speaker?: string;
	text: string;
}

const DialogueBox: React.FC<DialogueBoxProps> = ({ speaker, text }) => (
	<div className="dialogue-box">
		{speaker && <div className="speaker-name">{speaker}</div>}
		<div className="dialogue-text">{text}</div>
	</div>
);

export default DialogueBox;
