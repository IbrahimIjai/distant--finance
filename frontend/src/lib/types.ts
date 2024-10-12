import { Address } from "viem";

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

export type nftMeta = {
	imageUrl: string;
	tokenUri: string;
	mimeType: string;
};

export interface ERC721 {
	tokenId: string;
	imageUrl: string[];
	collectionName: string;
	collectionAddress: string;
	metaData: nftMeta;
}

export interface ProcessedNFTData {
	[collectionName: string]: {
		collectionAddress: Address;
		nftsCount: number;
		nfts: ERC721[];
	};
}

export interface RaribleNft {
	id: string;
	blockchain: string;
	collection: string;
	contract: string;
	tokenId: string;
	creators: { account: string; value: number }[];
	lazySupply: string;
	pending: boolean[] | string[]; // Could be an array of different types, keep it as any for now
	mintedAt: string;
	lastUpdatedAt: string;
	supply: string;
	meta: {
		name: string;
		description: string;
		tags: string[];
		genres: string[];
		externalUri: string;
		originalMetaUri: string;
		attributes: string[]; // Could be an array of different types, keep it as any for now
		content: {
			"@type": string;
			url: string;
			representation?: string; // Optional property
			mimeType?: string;
			size?: number; // Optional property
			available?: boolean; // Optional property
			width?: number; // Optional property
			height?: number; // Optional property
		}[];
		extraContent: string[]; // Could be an array of different types, keep it as any for now
	};
	deleted: boolean;
	originOrders: string[]; // Could be an array of different types, keep it as any for now
	ammOrders: { ids: string[] };
	auctions: string[]; // Could be an array of different types, keep it as any for now
	totalStock: string;
	sellers: number;
	lastSale: {
		date: string;
		seller: string;
		buyer: string;
		value: string;
		currency: { "@type": string; blockchain: string };
		price: string;
	};
	suspicious: boolean;
	itemCollection: {
		id: string;
		name: string;
	};
}

//LOAN

export interface ActiveLoan {
	amount: number;
	duration: number;
	id: string;
	interest: number;
	lender: string | null;
	borrower?: string | null;
	checkPointBlock: number;
	lockId: string;
}

export interface UserLoan {
	id: string; // This will be the bytes32 id
	borrower: string;
	lender: string;
	interest: bigint;
	amount: bigint;
	expiry: bigint;
	lockId: string; // This is the bytes32 lockId
}
