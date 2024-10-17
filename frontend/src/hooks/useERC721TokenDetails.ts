import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Address } from "viem";

const RARIBLE_API_KEY_1 = "25761181-1207-4398-818a-7e3501ba38fd";
// const RARIBLE_API_KEY_2 = "d070fdfd-c3e4-4539-9a04-a293b2ff44c3";

interface TokenDetails {
	collectionAddress: Address | undefined;
	nftIds: number[];
}

export interface RaribleTokenDetails {
	name: string;
	description: string;
	attributes: Array<{ key: string; value: string }>;
	imageUrl: string;
}

async function fetchTokenDetails(
	collectionAddress: Address | undefined,
	tokenId: string,
): Promise<RaribleTokenDetails> {
	const url = `https://api.rarible.org/v0.1/items/BASE:${collectionAddress}:${tokenId}`;
	const response = await axios.get(url, {
		headers: {
			accept: "application/json",
			"X-API-KEY": RARIBLE_API_KEY_1,
		},
	});

	const { meta } = response.data;
	// console.log({ meta });
	return {
		name: meta.name,
		description: meta.description,
		attributes: meta.attributes,
		imageUrl: meta.content[0].url,
	};
}

async function fetchAllTokenDetails(tokenDetail: TokenDetails) {
	const { collectionAddress, nftIds } = tokenDetail;
	const detailPromises = nftIds.map((tokenId) =>
		fetchTokenDetails(collectionAddress, tokenId.toString())
			.then((raribleDetails) => ({ raribleDetails }))
			.catch((error) => {
				console.error(`Error fetching details for token ${tokenId}:`, error);
			}),
	);

	// console.log({ detailPromises: await detailPromises });
	return Promise.all(detailPromises);
}

export function useTokenDetails(tokenDetails: TokenDetails) {
	return useQuery({
		queryKey: ["tokenDetails", tokenDetails],
		queryFn: () => fetchAllTokenDetails(tokenDetails),
		enabled: tokenDetails.nftIds.length > 0,
		placeholderData: keepPreviousData,
	});
}
