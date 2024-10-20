import React, { useEffect } from "react";
import { formatEther } from "viem";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { TransactionType, useTransactionStore } from "@/store/transactionStore";
import { P2PLENDING } from "@/config";
import { P2PLENDING_ABI } from "@/config/abi";

interface CancelBidTransactionProps {
	loanId: string;
	amount: string;
}

export function CancelBidTransaction({
	loanId,
	amount,
}: CancelBidTransactionProps) {
	const setTransaction = useTransactionStore((state) => state.setTransaction);

	useEffect(() => {
		setTransaction({
			isOpen: true,
			isReady: true,
			type: TransactionType.CANCEL_BID,
			args: [loanId],
			contractAddress: P2PLENDING,
			abi: P2PLENDING_ABI,
			functionName: "cancelBid",
		});
	}, [setTransaction, loanId]);

	return (
		<Card>
			<CardContent className="pt-6">
				<Alert>
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Confirm Bid Cancellation</AlertTitle>
					<AlertDescription>
						You are about to cancel your bid for loan {loanId}.
						<br />
						You will receive back: {formatEther(BigInt(amount))} ETH
					</AlertDescription>
				</Alert>
			</CardContent>
		</Card>
	);
}
