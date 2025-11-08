import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios, { AxiosInstance, AxiosError } from "axios";
import { useMemo } from "react";

const RARIBLE_API_KEY_1 = "25761181-1207-4398-818a-7e3501ba38fd";
const BASE_URL = "https://api.rarible.org/v0.1";
const STALE_TIME = 3 * 60 * 1000;
const CACHE_TIME = 10 * 60 * 1000;

interface FetchNFTsParams {
	owner: string;
	continuation?: string;
}

interface NFTItem {
	id: string;
	blockchain: string;
	contract: string;
	tokenId: string;
	creators: any[];
	owners: any[];
	meta?: {
		name?: string;
		description?: string;
		content?: Array<{ url: string }>;
	};
}

interface NFTResponse {
	items: NFTItem[];
	continuation?: string;
	total?: number;
}

interface FetchError {
	message: string;
	code?: string;
	status?: number;
	owner?: string;
}

let axiosInstance: AxiosInstance | null = null;

function getAxiosInstance(): AxiosInstance {
	if (!axiosInstance) {
		axiosInstance = axios.create({
			baseURL: BASE_URL,
			timeout: 15000,
			headers: {
				accept: "application/json",
				"X-API-KEY": RARIBLE_API_KEY_1,
			},
		});

		axiosInstance.interceptors.request.use(
			(config) => {
				if (process.env.NODE_ENV === "development") {
					console.log(`[NFT Fetch] Requesting: ${config.url}`);
				}
				return config;
			},
			(error) => Promise.reject(error),
		);

		axiosInstance.interceptors.response.use(
			(response) => response,
			(error: AxiosError) => {
				const fetchError: FetchError = {
					message: error.message,
					code: error.code,
					status: error.response?.status,
				};

				if (error.response?.status === 429) {
					fetchError.message =
						"Rate limit exceeded. Please wait before fetching more NFTs.";
				} else if (error.response?.status === 400) {
					fetchError.message = "Invalid wallet address or request parameters.";
				} else if (error.response?.status === 404) {
					fetchError.message = "NFT data not found for this address.";
				} else if (
					error.response?.status === 401 ||
					error.response?.status === 403
				) {
					fetchError.message =
						"API authentication failed. Please check configuration.";
				} else if (error.code === "ECONNABORTED") {
					fetchError.message = "Request timeout. Please try again.";
				} else if (error.code === "ERR_NETWORK") {
					fetchError.message = "Network error. Please check your connection.";
				} else if (!error.response) {
					fetchError.message =
						"Unable to reach Rarible API. Please try again later.";
				}

				if (process.env.NODE_ENV === "development") {
					console.error("[NFT Fetch Error]", {
						message: fetchError.message,
						status: fetchError.status,
						code: fetchError.code,
					});
				}

				return Promise.reject(fetchError);
			},
		);
	}
	return axiosInstance;
}

export const fetchNFTsByOwner = async ({
	owner,
	continuation,
}: FetchNFTsParams): Promise<NFTResponse> => {
	if (!owner || owner.trim() === "") {
		throw {
			message: "Owner address is required",
			code: "INVALID_OWNER",
		} as FetchError;
	}

	if (!/^0x[a-fA-F0-9]{40}$/.test(owner)) {
		throw {
			message: "Invalid Ethereum address format",
			code: "INVALID_ADDRESS_FORMAT",
			owner,
		} as FetchError;
	}

	try {
		const instance = getAxiosInstance();

		const params: Record<string, string> = {
			owner: `ETHEREUM:${owner}`,
			blockchains: "BASE",
		};

		if (continuation) {
			params.continuation = continuation;
		}

		const response = await instance.get<NFTResponse>("/items/byOwner", {
			params,
		});

		if (!response.data || !Array.isArray(response.data.items)) {
			throw {
				message: "Invalid response format from Rarible API",
				code: "INVALID_RESPONSE",
			} as FetchError;
		}

		return {
			items: response.data.items || [],
			continuation: response.data.continuation,
			total: response.data.total,
		};
	} catch (error) {
		if (
			(error as FetchError).code === "INVALID_OWNER" ||
			(error as FetchError).code === "INVALID_ADDRESS_FORMAT" ||
			(error as FetchError).code === "INVALID_RESPONSE"
		) {
			throw error;
		}

		const fetchError = error as FetchError;
		fetchError.owner = owner;
		throw fetchError;
	}
};

export const useERC721Balance = (address: string | undefined) => {
	const queryKey = useMemo(() => {
		if (!address) return ["nfts", "empty"];
		return ["nfts", address.toLowerCase()];
	}, [address]);

	const isEnabled = useMemo(() => {
		if (!address) return false;
		return /^0x[a-fA-F0-9]{40}$/.test(address);
	}, [address]);

	return useQuery({
		queryKey,
		queryFn: async () => {
			if (!address) {
				return { items: [], continuation: undefined, total: 0 };
			}
			return fetchNFTsByOwner({ owner: address });
		},
		enabled: isEnabled,
		placeholderData: keepPreviousData,
		staleTime: STALE_TIME,
		gcTime: CACHE_TIME,
		retry: (failureCount: number, error: Error) => {
			const fetchError = error as FetchError;

			if (
				fetchError.code === "INVALID_OWNER" ||
				fetchError.code === "INVALID_ADDRESS_FORMAT" ||
				fetchError.status === 400 ||
				fetchError.status === 401 ||
				fetchError.status === 403
			) {
				return false;
			}

			return failureCount < 2;
		},
		retryDelay: (attemptIndex: number) =>
			Math.min(1000 * 2 ** attemptIndex, 10000),
	});
};

export const useERCZ21Balance = useERC721Balance;
