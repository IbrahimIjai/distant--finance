import { useReadContract } from "wagmi";
import { P2PLENDING_ABI, TOKENLOCKER_ABI } from "@/config/abi";
import { Address, } from "viem";
import { P2PLENDING, TOKENLOCKER } from "@/config";

export function useLoanTokens(loanId: Address) {
	const { data: loanData, isLoading: isLoanDataLoading } = useReadContract({
		address: P2PLENDING,
		abi: P2PLENDING_ABI,
		functionName: "getLoanData",
		args: [loanId],
	});

	const lockerAddress = loanData ? loanData[5] : undefined;

	const { data: lockedTokensData, isLoading: isLockedTokensLoading } =
		useReadContract({
			address: TOKENLOCKER,
			abi: TOKENLOCKER_ABI,
			functionName: "getLockedTokensData",
			args: lockerAddress ? [lockerAddress] : undefined,
		});

	// Process the lockedTokensData to extract token details
	console.log({ lockedTokensData });
	// const tokenDetails: TokenDetails[] = lockedTokensData
	// 	? lockedTokensData.map((token: any) => ({
	// 			tokenId: token.tokenId,
	// 			collectionName: token.collectionName,
	// 			// Map other relevant fields here
	// 	  }))
	// 	: [];

	const isLoading = isLoanDataLoading || isLockedTokensLoading;

	return {
		lockedTokensData,
		isLoading,
		loanData,
	};
}
