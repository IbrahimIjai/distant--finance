import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios, { AxiosInstance, AxiosError } from "axios";
import { Address } from "viem";
import { useMemo } from "react";

const RARIBLE_API_KEY_1 = "25761181-1207-4398-818a-7e3501ba38fd";

const BATCH_SIZE = 5;
const STALE_TIME = 5 * 60 * 1000;
const CACHE_TIME = 10 * 60 * 1000;

interface TokenDetails {
	collectionAddress: Address | undefined;
	nftIds: number[];
}

export interface RaribleTokenDetails {
	name: string;
	description: string;
	attributes: Array<{ key: string; value: string }>;
	imageUrl: string;
	tokenId: string;
}

interface FetchError {
	tokenId?: string;
	message: string;
	code?: string;
	status?: number;
}

let axiosInstance: AxiosInstance | null = null;

function getAxiosInstance(): AxiosInstance {
	if (!axiosInstance) {
		axiosInstance = axios.create({
			baseURL: "https://api.rarible.org/v0.1",
			timeout: 10000,
			headers: {
				accept: "application/json",
				"X-API-KEY": RARIBLE_API_KEY_1,
			},
		});

		axiosInstance.interceptors.response.use(
			(response) => response,
			(error: AxiosError) => {
				const errorDetails: FetchError = {
					message: error.message,
					code: error.code,
					status: error.response?.status,
				};

				if (error.response?.status === 429) {
					errorDetails.message = "Rate limit exceeded. Please try again later.";
				} else if (error.response?.status === 404) {
					errorDetails.message = "Token not found on Rarible.";
				} else if (!error.response) {
					errorDetails.message = "Network error. Please check your connection.";
				}

				return Promise.reject(errorDetails);
			},
		);
	}
	return axiosInstance;
}

async function fetchTokenDetails(
	collectionAddress: Address | undefined,
	tokenId: string,
): Promise<RaribleTokenDetails> {
	try {
		const instance = getAxiosInstance();
		const url = `/items/BASE:${collectionAddress}:${tokenId}`;

		const response = await instance.get(url);
		const { meta } = response.data;

		return {
			name: meta.name || `Token #${tokenId}`,
			description: meta.description || "",
			attributes: meta.attributes || [],
			imageUrl: meta.content?.[0]?.url || "",
			tokenId,
		};
	} catch (error) {
		const fetchError = error as FetchError;
		fetchError.tokenId = tokenId;

		if (process.env.NODE_ENV === "development") {
			console.error(`[Token ${tokenId}] ${fetchError.message}`, {
				status: fetchError.status,
				code: fetchError.code,
			});
		}

		throw fetchError;
	}
}

async function processBatch<T>(
	items: T[],
	batchSize: number,
	processor: (item: T) => Promise<any>,
): Promise<any[]> {
	const results: any[] = [];

	for (let i = 0; i < items.length; i += batchSize) {
		const batch = items.slice(i, i + batchSize);
		const batchResults = await Promise.allSettled(
			batch.map((item) => processor(item)),
		);

		results.push(
			...batchResults.map((result) => {
				if (result.status === "fulfilled") {
					return { raribleDetails: result.value, error: null };
				}

				const error = result.reason as FetchError;
				return {
					raribleDetails: null,
					error: {
						tokenId: error.tokenId,
						message: error.message || "Unknown error occurred",
						status: error.status,
					},
				};
			}),
		);
	}

	return results;
}

async function fetchAllTokenDetails(tokenDetail: TokenDetails) {
	const { collectionAddress, nftIds } = tokenDetail;

	if (!collectionAddress || nftIds.length === 0) {
		return [];
	}

	return processBatch(nftIds, BATCH_SIZE, (tokenId) =>
		fetchTokenDetails(collectionAddress, tokenId.toString()),
	);
}

export function useTokenDetails(tokenDetails: TokenDetails) {
	const queryKey = useMemo(() => {
		const sortedIds = [...tokenDetails.nftIds].sort((a, b) => a - b);
		return [
			"tokenDetails",
			tokenDetails.collectionAddress,
			sortedIds.join(","),
		] as const;
	}, [tokenDetails.collectionAddress, tokenDetails.nftIds]);

	const isEnabled = useMemo(
		() => !!tokenDetails.collectionAddress && tokenDetails.nftIds.length > 0,
		[tokenDetails.collectionAddress, tokenDetails.nftIds.length],
	);

	return useQuery({
		queryKey,
		queryFn: () => fetchAllTokenDetails(tokenDetails),
		enabled: isEnabled,
		placeholderData: keepPreviousData,
		staleTime: STALE_TIME,
		gcTime: CACHE_TIME,
		retry: 2,
		retryDelay: (attemptIndex: number) =>
			Math.min(1000 * 2 ** attemptIndex, 30000),
	});
}
