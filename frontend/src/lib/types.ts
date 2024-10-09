export type Metadata = {
	name: string;
	image: string;
};

export type Token = {
	tokenId: number;
	metadata: Metadata | null;
	tokenURI: string;
};

export type AccountCollection = {
	collection: {
		id: string;
		name: string;
		image: string | null;
		tokens: Token[];
	};
	tokenCount: number;
};
