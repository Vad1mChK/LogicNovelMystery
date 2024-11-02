export interface LnmPlot {
	metadata: LnmMetadata;
	characters: Map<string, LnmCharacter>;
	locations: Map<string, LnmLocation>;
	music: Map<string, LnmMusic>;
	startChapter: string;
	frames: {
		main: Map<string, Map<string, LnmFrame>>;
		endings: Map<string, LnmEnding>;
	};
	tasks: Map<string, LnmTask>;
	knowledge: Map<string, LnmKnowledge>;
}

export interface LnmMetadata {
	name: string;
	gamemode: 'single' | 'pair';
	protagonist: string;
	author: string;
	version: string;
	locale: string;
}

export interface LnmCharacter {
	id: string;
	name: string;
	defaultPose: string | null;
	sprites: Map<string, string>;
}

export interface 