type Result = {
	count: number;
	matches: Match[];
};

type Match = {
	vectorId: string;
	score: number;
	metadata: {
		sourceId: string;
		index: number;
		text: string;
	}
};