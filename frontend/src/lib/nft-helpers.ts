import { Address } from "viem";
import { ERC721, RaribleNft, ProcessedNFTData } from "./types";

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

// Function to process raw NFT data
export const processNFTData = (rawData: RaribleNft[]): ProcessedNFTData => {
  return rawData.reduce((acc: ProcessedNFTData, nft: RaribleNft) => {
    const processedNFT = extractNFTData(nft);
    const { collectionName, collectionAddress } = processedNFT;

    if (!acc[collectionName]) {
      acc[collectionName] = {
        nftsCount: 0,
        collectionAddress: collectionAddress as Address,
        nfts: [],
      };
    }

    acc[collectionName].nftsCount += 1;
    acc[collectionName].nfts.push(processedNFT);

    return acc;
  }, {});
};

// Function to get list of collections a user owns, with the number of tokens
export const getUserCollections = (
  processedData: ProcessedNFTData
): Array<{ collectionName: string; nftsCount: number }> => {
  return Object.entries(processedData).map(
    ([collectionName, { nftsCount }]) => ({
      collectionName,
      nftsCount,
    })
  );
};

// Function to get list of NFTs a user owns in a specific collection
export const getNFTsInCollection = (
  processedData: ProcessedNFTData,
  collectionName: string
): ERC721[] => {
  return processedData[collectionName]?.nfts || [];
};
// Object keys, values, and entries methods
// const obj = { a: 1, b: 2, c: 3 };
// console.log(Object.keys(obj)); // Output: ['a', 'b', 'c']

// const obj = { a: 1, b: 2, c: 3 };
// console.log(Object.values(obj)); // Output: [1, 2, 3]

// const obj = { a: 1, b: 2, c: 3 };
// console.log(Object.entries(obj)); // Output: [['a', 1], ['b', 2], ['c', 3]]

export function extractAddress(fullAddress: string): string {
  const parts = fullAddress.split(":");
  return parts[parts.length - 1];
}
