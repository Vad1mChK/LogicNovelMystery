import { copyTextToClipboard } from './markupUtils';

describe('copyTextToClipboard', () => {
	// Backup for restoring the original clipboard object
	const originalClipboard = navigator.clipboard;

	beforeEach(() => {
		// Mock clipboard API with a functional writeText method
		Object.defineProperty(navigator, 'clipboard', {
			value: {
				writeText: jest.fn(() => Promise.resolve()), // Mock Promise behavior
			},
			writable: true,
		});
	});

	afterEach(() => {
		// Restore the original clipboard API after each test
		Object.defineProperty(navigator, 'clipboard', {
			value: originalClipboard,
			writable: true,
		});
	});

	it('should copy text to clipboard if clipboard API is available', () => {
		const textToCopy = 'Hello, World!';
		const mockWriteText = jest.spyOn(navigator.clipboard, 'writeText');

		copyTextToClipboard(textToCopy);

		expect(mockWriteText).toHaveBeenCalledWith(textToCopy);
		expect(mockWriteText).toHaveBeenCalledTimes(1);
	});

	it('should skip copying if clipboard API is unavailable', () => {
		// Simulate clipboard API being unavailable
		Object.defineProperty(navigator, 'clipboard', {
			value: undefined,
			writable: true,
		});

		expect(() => copyTextToClipboard('Test text')).toThrow(
			TypeError // Expect a TypeError when accessing undefined properties
		);
	});

	it('should handle clipboard API errors gracefully', () => {
		const textToCopy = 'Error Test';
		const mockWriteText = jest
			.spyOn(navigator.clipboard, 'writeText')
			.mockImplementationOnce(() =>
				Promise.reject(new Error('Clipboard error'))
			);

		copyTextToClipboard(textToCopy);

		expect(mockWriteText).toHaveBeenCalledWith(textToCopy);
		expect(mockWriteText).toHaveBeenCalledTimes(1);
	});
});
