import { render, screen } from '@testing-library/react';
import DialogueBox from './DialogueBox';

describe('DialogueBox Component', () => {
	it('renders the dialogue text correctly', () => {
		render(<DialogueBox text="This is a dialogue." />);
		const textElement = screen.getByTestId('dialogue-text');
		expect(textElement).toBeInTheDocument();
		expect(textElement).toHaveClass('dialogue-text');
	});

	it('renders the speaker name when provided', () => {
		render(<DialogueBox speakerName="Phoenix Wright" text="Objection!" />);
		const speakerElement = screen.getByTestId('dialogue-speaker');
		expect(speakerElement).toBeInTheDocument();
		expect(speakerElement).toHaveClass('speaker-name');
	});

	it('does not render the speaker name when not provided', () => {
		render(<DialogueBox text="Hold it!" />);
		const speakerElement = screen.queryByTestId('dialogue-speaker');
		expect(speakerElement).not.toBeInTheDocument();
	});
});
