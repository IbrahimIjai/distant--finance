import { keepPreviousData, useQuery } from "@tanstack/react-query";

import axios from "axios";
const RARIBLE_API_KEY_1 = "25761181-1207-4398-818a-7e3501ba38fd";
// const RARIBLE_API_KEY_2 = "d070fdfd-c3e4-4539-9a04-a293b2ff44c3";

export const fetchNFTsByOwner = async ({
	owner,
	continuation,
}: {
	owner: string;
	continuation?: string;
}) => {
	const url = `https://api.rarible.org/v0.1/items/byOwner`;

	const paramsWithContinuation = {
		owner: `ETHEREUM:${owner}`,
		blockchains: "BASE",
		continuation,
	};
	const response = await axios.get(url, {
		method: "GET",
		params: continuation
			? paramsWithContinuation
			: {
					owner: `ETHEREUM:${owner}`,
					blockchains: "BASE",
			  },
		headers: {
			accept: "application/json",
			"X-API-KEY": RARIBLE_API_KEY_1,
		},
	});

	// console.log({ response: response.data.items });
	const userNfts = response.data.items;
	return userNfts;
};



// https://docs.rarible.org/reference/getitemsbyowner
export const useERCZ21Balance = (address: string | undefined) => {
	return useQuery({
		queryKey: ["nfts"],
		queryFn: () =>
			fetchNFTsByOwner({ owner: address ? (address as string) : "" }),
		placeholderData: keepPreviousData,
		enabled: !!address,
	});
};
