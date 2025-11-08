import { Abi, Address } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { ToasterToast, useToast } from "../use-toast";
import { useRef } from "react";

export type TrxTitle =
	| "Creating Approval for all Tokens in the selected collection"
	| "Opening Loan Contract"
	| "Placing a bid..."
	| "Lending..."
	| "Claiming all lost bids..."
	| "Cancelling bid..."
	| "Accepting bid..."
	| "Approving ERC20 Token"
	| "Cancelling Loan ....";

export const useDistantWriteContract = <TArgs extends readonly unknown[]>({
	fn,
	trxTitle,
	args,
	abi,
	contractAddress,
	value,
}: {
	fn: string;
	trxTitle: TrxTitle;
	args: TArgs;
	abi: Abi;
	contractAddress: Address;
	value?: bigint;
}) => {
	const { toast } = useToast();

	const toastRef = useRef<{
		id: string;
		dismiss: () => void;
		update: (props: ToasterToast) => void;
	} | null>(null);

	// Local toast helper available for callbacks below
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

	const {
		data: hash,
		isPending,
		isSuccess: isTrxSubmitted,
		isError: isWriteContractError,
		writeContract,
		error: WriteContractError,
		reset,
	} = useWriteContract({
		onMutate: () => {
			showToast(
				`${trxTitle}...`,
				"Transaction pending, please confirm in wallet",
			);
		},
		onSuccess: () => {
			showToast(`${trxTitle}...`, "Transaction submitted to the network");
		},
		onError: (error: Error) => {
			showToast(
				"Transaction Failed",
				error?.message || "An error occurred while submitting",
				"destructive",
			);
		},
	});
	// console.log(
	// 	"isWriteContractError isWriteContractError",
	// 	isWriteContractError,
	// );
	const {
		isLoading: isConfirming,
		isSuccess: isConfirmed,
		isError: isWaitTrxError,
		error: WaitForTransactionReceiptError,
	} = useWaitForTransactionReceipt({
		hash,
		confirmations: 2,
		onSuccess: () => {
			showToast(`${trxTitle}`, "Transaction confirmed successfully");
		},
		onError: (error: Error) => {
			showToast(
				"Transaction Failed",
				error?.message || "An error occurred during confirmation",
				"destructive",
			);
		},
	});

	const write = () =>
		writeContract({
			address: contractAddress,
			abi,
			functionName: fn,
			args,
			value,
		});

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
