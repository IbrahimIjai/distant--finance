import { ERC721, RaribleNft } from "./types";

export const extractNFTData = (nft: RaribleNft): ERC721 => ({
	tokenId: nft.tokenId,
	imageUrl: nft.meta?.content
		.filter((content) => content["@type"] === "IMAGE")
		.map((content) => content.url),
	collectionName: nft.itemCollection.name,
	collectionAddress: nft.contract, // Assuming contract is the collection address
	metaData: {
		imageUrl: nft.meta?.content.length > 0 ? nft.meta?.content[0].url : "",
		tokenUri: nft.meta?.originalMetaUri,
		mimeType: "UNKNOWN",
		// nft.meta.content.length > 0 ? nft.meta.content[0].mimeType :
	},
});
// Object keys, values, and entries methods
// const obj = { a: 1, b: 2, c: 3 };
// console.log(Object.keys(obj)); // Output: ['a', 'b', 'c']

// const obj = { a: 1, b: 2, c: 3 };
// console.log(Object.values(obj)); // Output: [1, 2, 3]

// const obj = { a: 1, b: 2, c: 3 };
// console.log(Object.entries(obj)); // Output: [['a', 1], ['b', 2], ['c', 3]]
