import { Abi, Address } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ToasterToast, useToast } from "../use-toast";
import { useEffect, useRef } from "react";

export type TrxTitle =
	| "Creating Approval for all Tokens in the selected collection"
	| "Opening Loan Contract";

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

	const toastRef = useRef<{
		id: string;
		dismiss: () => void;
		update: (props: ToasterToast) => void;
	} | null>(null);

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

	const showToast = (
		title: string,
		description: string,
		variant: "default" | "destructive" = "default",
	) => {
		if (toastRef.current) {
			toastRef.current.dismiss();
		}
		toastRef.current = toast({
			title,
			description,
			variant,
			duration: 3000,
		});
	};

	useEffect(() => {
		if (isPending) {
			showToast(
				`${trxTitle}...`,
				"Transaction Pending, Please confirm in wallet",
			);
		} else if (isTrxSubmitted) {
			showToast(
				`${trxTitle}...`,
				"Transaction has been submitted to the network",
			);
		} else if (isConfirming) {
			showToast(`${trxTitle}...`, "Waiting for transaction confirmation");
		} else if (isConfirmed) {
			showToast(`${trxTitle}`, "Transaction confirmed successfully", "default");
		} else if (isWriteContractError || isWaitTrxError) {
			showToast(
				"Transaction Failed",
				WriteContractError?.message ||
					WaitForTransactionReceiptError?.message ||
					"An error occurred",
				"destructive",
			);
		}

		// Clean up function to dismiss the toast after 3 seconds if no state change
		const timer = setTimeout(() => {
			if (toastRef.current) {
				toastRef.current.dismiss();
				toastRef.current = null;
			}
		}, 3000);

		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
