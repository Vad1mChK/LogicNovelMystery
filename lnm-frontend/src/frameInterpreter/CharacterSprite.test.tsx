import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CharacterSprite from './CharacterSprite';
import { LnmCharacter, LnmFrameCharacterData } from './types';

// Mock `BASE_URL`
jest.mock('../metaEnv', () => ({
	BASE_URL: 'http://example.com/',
}));

describe('CharacterSprite Component', () => {
	const mockCharacter: LnmCharacter = {
		id: 'char1',
		name: 'Phoenix Wright',
		defaultPose: 'neutral',
		sprites: new Map([
			['neutral', 'assets/phoenix-neutral.png'],
			['happy', 'assets/phoenix-happy.png'],
		]),
	};

	const mockCharacterData: LnmFrameCharacterData = {
		id: 'char1',
		position: 'left',
		pose: 'happy',
		hidden: false,
	};

	it('renders the character sprite with the correct URL and alt text', () => {
		render(
			<CharacterSprite
				character={mockCharacter}
				isSpeaker={false}
				characterData={mockCharacterData}
			/>
		);

		const sprite = screen.getByRole('img', { name: /phoenix wright/i });
		expect(sprite).toHaveAttribute(
			'src',
			'http://example.com/assets/phoenix-happy.png'
		);
		expect(sprite).toHaveAttribute('alt', 'Phoenix Wright');
	});

	it('applies the "speaker" class if the character is the speaker', () => {
		render(
			<CharacterSprite
				character={mockCharacter}
				isSpeaker={true}
				characterData={mockCharacterData}
			/>
		);

		const sprite = screen.getByRole('img', { name: /phoenix wright/i });
		expect(sprite).toHaveClass('speaker');
	});

	it('applies the "hidden-character" class if the character is hidden', () => {
		render(
			<CharacterSprite
				character={mockCharacter}
				isSpeaker={false}
				characterData={{ ...mockCharacterData, hidden: true }}
			/>
		);

		const sprite = screen.getByRole('img', { name: /phoenix wright/i });
		expect(sprite).toHaveClass('hidden-character');
	});

	it('renders the character with default pose if no pose is provided', () => {
		render(
			<CharacterSprite
				character={mockCharacter}
				isSpeaker={false}
				characterData={{ ...mockCharacterData, pose: null }}
			/>
		);

		const sprite = screen.getByRole('img', { name: /phoenix wright/i });
		expect(sprite).toHaveAttribute(
			'src',
			'http://example.com/assets/phoenix-neutral.png'
		);
	});

	it('positions the character correctly based on the position property', () => {
		const { rerender } = render(
			<CharacterSprite
				character={mockCharacter}
				isSpeaker={false}
				characterData={{ ...mockCharacterData, position: 'left' }}
			/>
		);

		let sprite = screen.getByRole('img', { name: /phoenix wright/i });
		expect(sprite).toHaveStyle({ left: '25%' });

		rerender(
			<CharacterSprite
				character={mockCharacter}
				isSpeaker={false}
				characterData={{ ...mockCharacterData, position: 'center' }}
			/>
		);
		sprite = screen.getByRole('img', { name: /phoenix wright/i });
		expect(sprite).toHaveStyle({ left: '50%' });

		rerender(
			<CharacterSprite
				character={mockCharacter}
				isSpeaker={false}
				characterData={{ ...mockCharacterData, position: 'right' }}
			/>
		);
		sprite = screen.getByRole('img', { name: /phoenix wright/i });
		expect(sprite).toHaveStyle({ left: '75%' });
	});

	it('falls back to "center" position if no position is provided', () => {
		render(
			<CharacterSprite
				character={mockCharacter}
				isSpeaker={false}
				characterData={{ ...mockCharacterData, position: undefined }}
			/>
		);

		const sprite = screen.getByRole('img', { name: /phoenix wright/i });
		expect(sprite).toHaveStyle({ left: '50%' });
	});

	it('falls back to empty string if both pose and defaultPose are undefined', () => {
		const characterWithoutPose: LnmCharacter = {
			...mockCharacter,
			defaultPose: null,
		};

		render(
			<CharacterSprite
				character={characterWithoutPose}
				isSpeaker={false}
				characterData={{ ...mockCharacterData, pose: undefined }}
			/>
		);

		const sprite = screen.getByRole('img', { name: /phoenix wright/i });
		expect(sprite).toHaveAttribute('src', 'http://example.com/');
	});

	it('falls back to empty string if sprites map does not contain the pose or defaultPose', () => {
		const characterWithMissingSprite: LnmCharacter = {
			...mockCharacter,
			sprites: new Map([['neutral', 'assets/phoenix-neutral.png']]), // No 'happy' sprite
		};

		render(
			<CharacterSprite
				character={characterWithMissingSprite}
				isSpeaker={false}
				characterData={{ ...mockCharacterData, pose: 'happy' }}
			/>
		);

		const sprite = screen.getByRole('img', { name: /phoenix wright/i });
		expect(sprite).toHaveAttribute('src', 'http://example.com/');
	});
});
