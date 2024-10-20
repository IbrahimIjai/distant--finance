import React, { useEffect } from "react";
import { Address, formatEther } from "viem";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { TransactionType, useTransactionStore } from "@/store/transactionStore";
import { P2PLENDING } from "@/config";
import { P2PLENDING_ABI } from "@/config/abi";
import { slice } from "@/lib/utils";

interface RepayLoanTransactionProps {
	lender: string;
	loanId: string;
	amount: string;
	proposedInterest: string;
	expiry: string;
}

export function RepayLoanTransaction({
	lender,
	loanId,
	amount,
	proposedInterest,
}: RepayLoanTransactionProps) {
	const setTransaction = useTransactionStore((state) => state.setTransaction);

	useEffect(() => {
		setTransaction({
			isOpen: true,
			isReady: true,
			type: TransactionType.ACCEPT_BID,
			args: [loanId as Address],
			contractAddress: P2PLENDING,
			abi: P2PLENDING_ABI,
			functionName: "repayLoan",
		});
	}, [setTransaction, lender, loanId]);

	return (
		<div>
			<div className="pt-6">
				<Alert>
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Confirm Repay Loan</AlertTitle>
					<AlertDescription className="w-fit">
						You are about to REPAY a loan which has been funded recently by{" "}
						{slice(lender)}
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
