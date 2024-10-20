import React, { useEffect } from "react";
import { Address, formatEther } from "viem";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { TransactionType, useTransactionStore } from "@/store/transactionStore";
import { P2PLENDING } from "@/config";
import { P2PLENDING_ABI } from "@/config/abi";
import { slice } from "@/lib/utils";

interface AcceptBidTransactionProps {
	bidder: string;
	loanId: string;
	amount: string;
	proposedInterest: bigint;
}

export function AcceptBidTransaction({
	bidder,
	loanId,
	amount,
	proposedInterest,
}: AcceptBidTransactionProps) {
	const setTransaction = useTransactionStore((state) => state.setTransaction);

	useEffect(() => {
		setTransaction({
			isOpen: true,
			isReady: true,
			type: TransactionType.ACCEPT_BID,
			args: [bidder as Address, loanId as Address],
			contractAddress: P2PLENDING,
			abi: P2PLENDING_ABI,
			functionName: "acceptBid",
		});
	}, [setTransaction, bidder, loanId]);

	return (
		<div>
			<div className="pt-6">
				<Alert>
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Confirm Bid Acceptance</AlertTitle>
					<AlertDescription className="w-fit">
						You are about to accept a bid from {slice(bidder)} for loan{" "}
						{slice(loanId)}
						.
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