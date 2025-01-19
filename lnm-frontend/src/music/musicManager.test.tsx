import { MusicManager } from './musicManager';

// Mock the AudioContext and other Web Audio API components
global.AudioContext = jest.fn(() => ({
	state: 'suspended',
	resume: jest.fn(),
	createMediaElementSource: jest.fn(() => ({
		connect: jest.fn(),
	})),
	createStereoPanner: jest.fn(() => ({
		connect: jest.fn(),
		pan: { value: 0 },
	})),
	close: jest.fn().mockResolvedValue(undefined), // Added mock for close
})) as unknown as typeof AudioContext;

describe('MusicManager', () => {
	let musicManager: MusicManager;
	let mockAudioElement: HTMLAudioElement;
	let mockAudioContext: AudioContext;
	let mockSourceNode: MediaElementAudioSourceNode;
	let mockPannerNode: StereoPannerNode;

	beforeEach(() => {
		// Mock HTMLAudioElement
		mockAudioElement = {
			play: jest.fn().mockResolvedValue(undefined),
			pause: jest.fn(),
			currentTime: 0,
			loop: false,
			volume: 1,
			src: '', // Mocking the src property for testing purposes
		} as unknown as HTMLAudioElement;

		// Mock AudioContext and related nodes
		mockAudioContext = new AudioContext();
		mockSourceNode =
			mockAudioContext.createMediaElementSource(mockAudioElement);
		mockPannerNode = mockAudioContext.createStereoPanner();

		// Mock the singleton instance for MusicManager
		musicManager = MusicManager.getInstance();
		musicManager['audioElement'] = mockAudioElement;
		musicManager['audioContext'] = mockAudioContext;
		musicManager['sourceNode'] = mockSourceNode;
		musicManager['pannerNode'] = mockPannerNode;
	});

	it('should create an instance of MusicManager', () => {
		expect(musicManager).toBeInstanceOf(MusicManager);
	});

	it('should stop the audio when stop is called', () => {
		musicManager.stop();

		expect(mockAudioElement.pause).toHaveBeenCalled();
		expect(mockAudioElement.currentTime).toBe(0);
		expect(mockAudioElement.loop).toBe(false);
	});

	it('should set the volume correctly', () => {
		const volumePercent = 80;
		musicManager.setVolume(volumePercent);

		expect(mockAudioElement.volume).toBe(volumePercent / 100);
	});

	it('should set the panning correctly', () => {
		const pan = 0.5;
		musicManager.setPanning(pan);

		expect(mockPannerNode.pan.value).toBe(pan);
	});
});
