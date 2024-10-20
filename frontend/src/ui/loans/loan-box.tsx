import React, { useMemo } from "react";
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
import { TransactionDialog } from "../transaction-dialog/transaction";
import { LendComponent } from "../transaction-dialog/lend-content";
import { RepayLoanTransaction } from "../transaction-dialog/loan/repay-loan-transaction";
import { ApprovalERC20 } from "../checkers/erc20-approval";
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
	const formattedInterest = interest / 100;
	const expiryDate = new Date(parseInt(expiry) * 1000);
	const now = new Date();
	const isExpired = expiryDate < now;
	const duration = Math.ceil(
		(expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
	);

	const totalRepaymentAmount = useMemo(() => {
		const principal = BigInt(amount ?? "0");
		const interestAmount =
			(principal * BigInt(interest ?? "0")) / BigInt(10000);
		return principal + interestAmount;
	}, [amount, interest]);

	const isOwner =
		borrower && address?.toLowerCase() === borrower.id.toLowerCase();
	const isLender = lender && address?.toLowerCase() === lender.id.toLowerCase();

	const getActionButton = () => {
		if (status === LoanStatus.PENDING && isOwner) {
			return (
				<TransactionDialog
					trigger={<Button className="w-full"> Cancel Loan Request</Button>}
					title="Cancel Loan Request"
					trxTitle="Cancelling Loan ...."
					description="You are about to cancel a loan you just open which has not been funded yet">
					<RepayLoanTransaction
						lender={loan.lender?.id}
						loanId={loan.id}
						amount={loan.amount}
						proposedInterest={loan.interest.toString()}
						expiry={loan.expiry}
					/>
				</TransactionDialog>
			);
		} else if (status === LoanStatus.ACTIVE) {
			if (isOwner) {
				return (
					<ApprovalERC20 amount={totalRepaymentAmount}>
						<TransactionDialog
							trigger={<Button className="w-full"> Repay Loan</Button>}
							title="Accept Bid"
							trxTitle="Accepting bid..."
							description="Accept the proposed bid for your loan">
							<RepayLoanTransaction
								lender={loan.lender?.id}
								loanId={loan.id}
								amount={loan.amount}
								proposedInterest={loan.interest.toString()}
								expiry={loan.expiry}
							/>
						</TransactionDialog>
					</ApprovalERC20>
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
				<TransactionDialog
					title="Loan Request"
					description={`The borrower is requesting a loan of ${formatEther(
						BigInt(amount),
					)} ETH`}
					trxTitle="Lending..."
					trigger={<Button className="w-full">Lend</Button>}>
					<LendComponent loanId={loan.id} loanAmount={amount} />
				</TransactionDialog>
			);
		}
		return null;
	};

	return (
		<Card className="w-full lg:max-w-md">
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
