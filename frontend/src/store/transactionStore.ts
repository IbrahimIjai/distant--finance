import { create } from "zustand";
import { Abi, Address } from "viem";
export enum TransactionType {
	CANCEL_LOAN = "CLOSE_CONTRACT",
	LEND = "LEND",
	BID = "BID",
	ACCEPT_BID = "ACCEPT_BID",
	CANCEL_BID = "CANCEL_BID",
}

type TransactionArgs =
	| [string] // for CANCEL_LOAN, ACCEPT_BID, CANCEL_BID (loanId)
	| [string, bigint] // for LEND (loanId, amount)
	| [number, string]; // for BID (loanId, proposedInterest)

interface TransactionState {
	isOpen: boolean;
	isReady: boolean;
	type: TransactionType | null;
	args: TransactionArgs;
	contractAddress: Address | null;
	abi: Abi | null;
	functionName: string | null;
	value: string | null;
	setTransaction: (
		params: Partial<
			Omit<TransactionState, "setTransaction" | "resetTransaction">
		>,
	) => void;
	resetTransaction: () => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
	isOpen: false,
	isReady: false,
	type: null,
	args: [""], // Default to an empty string array
	contractAddress: null,
	abi: null,
	value: null,
	functionName: null,
	setTransaction: (params) => set((state) => ({ ...state, ...params })),
	resetTransaction: () =>
		set({
			isOpen: false,
			isReady: false,
			type: null,
			args: [""],
			contractAddress: null,
			abi: null,
			functionName: null,
		}),
}));
