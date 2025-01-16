// src/services/musicManager.ts

export class MusicManager {
	private static instance: MusicManager;
	private audioElement: HTMLAudioElement | null = null;
	private audioContext: AudioContext | null = null;
	private sourceNode: MediaElementAudioSourceNode | null = null;
	private pannerNode: StereoPannerNode | null = null;
	private currentVolume: number = 100; // Default volume
	private currentPanning: number = 0; // Default panning

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

		// Prevent reloading the same track
		if (this.audioElement && this.audioElement.src === trackUrl) {
			return;
		}

		// Create or recreate the audio element
		this.stop();
		this.audioElement = new Audio(trackUrl);
		this.audioElement.loop = true; // Enable looping
		this.audioElement.volume = this.currentVolume / 100; // Apply saved volume

		// Initialize Web Audio context for advanced features like panning
		this.setupAudioContext();

		// Handle errors
		this.audioElement.onerror = (e) => {
			console.error('Error loading audio track:', e);
		};
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

		// Apply saved panning
		this.pannerNode.pan.value = this.currentPanning;
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
			this.audioElement.src = ''; // Clear the source
		}
		if (this.audioContext) {
			this.audioContext.close().catch((err) => {
				console.error('Error closing AudioContext:', err);
			});
			this.audioContext = null;
			this.sourceNode = null;
			this.pannerNode = null;
		}
	}

	public setVolume(volumePercent: number): void {
		this.currentVolume = Math.min(100, Math.max(0, volumePercent)); // Clamp and save the volume
		if (this.audioElement) {
			this.audioElement.volume = this.currentVolume / 100;
		}
	}

	public setPanning(pan: number): void {
		this.currentPanning = Math.min(1, Math.max(-1, pan)); // Clamp and save the panning
		if (this.pannerNode) {
			this.pannerNode.pan.value = this.currentPanning;
		}
	}
}
