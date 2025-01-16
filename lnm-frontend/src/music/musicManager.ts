// src/services/musicManager.ts

export class MusicManager {
	private static instance: MusicManager;
	private audioElement: HTMLAudioElement | null = null;
	private audioContext: AudioContext | null = null;
	private sourceNode: MediaElementAudioSourceNode | null = null;
	private pannerNode: StereoPannerNode | null = null;

	private constructor() {
		// Private constructor to enforce singleton pattern.
	}

	public static getInstance(): MusicManager {
		if (!MusicManager.instance) {
			MusicManager.instance = new MusicManager();
		}
		return MusicManager.instance;
	}

	/**
	 * Loads or updates the current track.
	 */
	public setTrack(trackUrl: string | null): void {
		if (!trackUrl) {
			// If null, just stop and reset
			this.stop();
			this.audioElement = null;
			return;
		}

		// Create or recreate the audio element
		this.stop();
		this.audioElement = new Audio(trackUrl);
		this.audioElement.loop = true; // Enable looping

		// Initialize Web Audio context for advanced features like panning
		this.setupAudioContext();
	}

	/**
	 * Initializes or re-initializes the AudioContext and panner node.
	 */
	private setupAudioContext() {
		if (!this.audioElement) return;

		// For advanced features like panning
		this.audioContext = new AudioContext();
		this.sourceNode = this.audioContext.createMediaElementSource(
			this.audioElement
		);
		this.pannerNode = this.audioContext.createStereoPanner();
		// Connect source -> panner -> destination
		this.sourceNode.connect(this.pannerNode);
		this.pannerNode.connect(this.audioContext.destination);
	}

	public play(): void {
		if (!this.audioElement) return;

		// Resume the AudioContext if it's suspended (required in some browsers)
		if (this.audioContext && this.audioContext.state === 'suspended') {
			this.audioContext.resume();
		}

		this.audioElement.play().catch((err) => {
			console.error('Error playing audio:', err);
		});
	}

	public pause(): void {
		if (this.audioElement) {
			this.audioElement.pause();
		}
	}

	public stop(): void {
		if (this.audioElement) {
			this.audioElement.pause();
			this.audioElement.currentTime = 0;
			this.audioElement.loop = false; // Optional: disable loop when stopping
		}
	}

	public setVolume(volumePercent: number): void {
		if (this.audioElement) {
			this.audioElement.volume = volumePercent / 100; // HTMLAudioElement volume is [0..1]
		}
	}

	/**
	 * Panning in Web Audio API is typically -1 (left) to +1 (right).
	 * If you skip the AudioContext route, you won't have this method.
	 */
	public setPanning(pan: number): void {
		if (this.pannerNode) {
			this.pannerNode.pan.value = pan; // Ensure pan is clamped between -1 and 1
		}
	}
}
