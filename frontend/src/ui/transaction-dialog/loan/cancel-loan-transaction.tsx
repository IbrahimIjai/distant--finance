import React, { useEffect } from "react";
import { Address, formatEther } from "viem";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { TransactionType, useTransactionStore } from "@/store/transactionStore";
import { P2PLENDING } from "@/config";
import { P2PLENDING_ABI } from "@/config/abi";
import { slice } from "@/lib/utils";

interface CancelLoanTransactionProps {
	loanId: string;
	amount: string;
	proposedInterest: bigint;
}

export function CancelLoanRequest({
	loanId,
	amount,
	proposedInterest,
}: CancelLoanTransactionProps) {
	const setTransaction = useTransactionStore((state) => state.setTransaction);

	useEffect(() => {
		setTransaction({
			isOpen: true,
			isReady: true,
			type: TransactionType.ACCEPT_BID,
			args: [loanId as Address],
			contractAddress: P2PLENDING,
			abi: P2PLENDING_ABI,
			functionName: "closeContract",
		});
	}, [setTransaction, loanId]);

	return (
		<div>
			<div className="pt-6">
				<Alert>
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Confirm Close Loan contract</AlertTitle>
					<AlertDescription className="w-fit">
						You are about to close a loan which has not been funded
						<br />
						loanId: {slice(loanId)}
						<br />
						Amount: {formatEther(BigInt(amount))} ETH
						<br />
						Proposed Interest: {Number(proposedInterest) / 100}%
					</AlertDescription>
				</Alert>
			</div>
		</div>
	);
}
