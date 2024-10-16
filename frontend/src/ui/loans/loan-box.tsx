import React from "react";
import { formatEther } from "viem";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAccount } from "wagmi";
import { LoanStatus } from "@/lib/types";
import { slice } from "@/lib/utils";
interface LoanData {
	id: string;
	amount: string;
	interest: number;
	expiry: string;
	borrower: {
		id: string;
	};
	lender: {
		id: string;
	};
	status: LoanStatus;
}

interface LoanBoxProps {
	loan: LoanData;
	onAction: (action: string) => void;
}

export function LoanBox({ loan, onAction }: LoanBoxProps) {
	const { address } = useAccount();
	const { amount, interest, expiry, borrower, lender, status } = loan;

	const formattedAmount = amount && formatEther(BigInt(amount));
	const formattedInterest = interest / 100; // Assuming interest is in basis points
	const expiryDate = new Date(parseInt(expiry) * 1000);
	const now = new Date();
	const isExpired = expiryDate < now;
	const duration = Math.ceil(
		(expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
	);

	const isOwner =
		borrower && address?.toLowerCase() === borrower.id.toLowerCase();
	const isLender = lender && address?.toLowerCase() === lender.id.toLowerCase();

	const getActionButton = () => {
		if (status === LoanStatus.PENDING && isOwner) {
			return (
				<Button
					variant="destructive"
					onClick={() => onAction("cancel")}
					className="w-full">
					Cancel Loan Request
				</Button>
			);
		} else if (status === LoanStatus.ACTIVE) {
			if (isOwner) {
				return (
					<Button
						variant="default"
						onClick={() => onAction("repay")}
						className="w-full">
						Repay Loan
					</Button>
				);
			} else if (isLender && isExpired) {
				return (
					<Button
						variant="destructive"
						onClick={() => onAction("liquidate")}
						className="w-full">
						Liquidate Loan
					</Button>
				);
			}
		} else if (status === LoanStatus.PENDING && !isOwner) {
			return (
				<Button
					variant="default"
					onClick={() => onAction("lend")}
					className="w-full">
					Lend
				</Button>
			);
		}
		return null;
	};

	return (
		<Card className="w-full lg:w-2/5">
			<CardHeader>
				<CardTitle className="flex justify-between items-center">
					<span>Loan Details</span>
					<Badge
						variant={status === LoanStatus.ACTIVE ? "default" : "secondary"}>
						{status}
					</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex justify-between">
					<span className="text-muted-foreground">Principal</span>
					<span className="font-medium">{formattedAmount} ETH</span>
				</div>
				<Separator />
				<div className="flex justify-between">
					<span className="text-muted-foreground">Interest</span>
					<span className="font-medium">{formattedInterest}%</span>
				</div>
				<Separator />
				<div className="flex justify-between">
					<span className="text-muted-foreground">
						{status === LoanStatus.PENDING ? "Duration" : "Expires"}
					</span>
					<span className="font-medium">
						{status === LoanStatus.PENDING
							? `${duration} Days`
							: expiryDate.toLocaleDateString()}
					</span>
				</div>
				<Separator />
				<div className="flex justify-between">
					<span className="text-muted-foreground">Borrower</span>
					<span className="font-medium">{borrower && slice(borrower.id)}</span>
				</div>
				{lender &&
					lender.id !== "0x0000000000000000000000000000000000000000" && (
						<>
							<Separator />
							<div className="flex justify-between">
								<span className="text-muted-foreground">Lender</span>
								<span className="font-medium">
									{lender.id.slice(0, 6)}...{lender.id.slice(-4)}
								</span>
							</div>
						</>
					)}
			</CardContent>
			<CardFooter>{getActionButton()}</CardFooter>
		</Card>
	);
}
