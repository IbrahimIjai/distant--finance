import { Abi, Address } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { useToast } from "../use-toast";
import { useEffect } from "react";

export type TrxTitle =
	| "Creating Approval for all Tokens in the selected collection" | "...";

export const useDistantWriteContract = <TArgs extends readonly unknown[]>({
	fn,
	trxTitle,
	args,
	abi,
	contractAddress,
}: {
	fn: string;
	trxTitle: TrxTitle;
	args: TArgs;
	abi: Abi;
	contractAddress: Address;
}) => {
	const { toast } = useToast();

	const {
		data: hash,
		isPending,
		isSuccess: isTrxSubmitted,
		isError: isWriteContractError,
		writeContractAsync,
		error: WriteContractError,
		reset,
	} = useWriteContract();
	console.log(
		"isWriteContractError isWriteContractError",
		isWriteContractError,
	);
	const {
		isLoading: isConfirming,
		isSuccess: isConfirmed,
		isError: isWaitTrxError,
		error: WaitForTransactionReceiptError,
	} = useWaitForTransactionReceipt({
		hash,
		confirmations: 2,
	});

	const write = () =>
		writeContractAsync({
			address: contractAddress,
			abi,
			functionName: fn,
			args,
		});

	useEffect(() => {
		if (isPending) {
			toast({
				title: `${trxTitle}...`,
				description: `Transaction Pending, Please confirm in wallet`,
				variant: "default",
				duration: 3000,
			});
		}
		if (isTrxSubmitted) {
			toast({
				title: `${trxTitle}...`,
				description: "Transaction has been submitted to the network",
				variant: "default",
				duration: 2000,
			});
		}
	}, [
		isPending,
		isTrxSubmitted,
		isConfirmed,
		isWriteContractError,
		isWaitTrxError,
	]);

	return {
		write,
		isPending,
		isConfirming,
		isTrxSubmitted,
		isConfirmed,
		isWriteContractError,
		isWaitTrxError,
		reset,
		hash,
		WriteContractError,
		WaitForTransactionReceiptError,
	};
};
