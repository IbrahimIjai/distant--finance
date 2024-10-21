"use client";

import React from "react";
import { useAccount } from "wagmi";
import { Address, formatEther } from "viem";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { InboxIcon, HelpCircle } from "lucide-react";
import { TransactionDialog } from "../transaction-dialog/transaction";
import { BidComponent } from "../transaction-dialog/bids/bid-content";
import { P2PLENDING } from "@/config";
import { slice } from "@/lib/utils";
import { LoanStatus } from "@/lib/types";
import { CancelBidTransaction } from "../transaction-dialog/bids/cancel-bid-transaction";
import { AcceptBidTransaction } from "../transaction-dialog/bids/accept-bid-transaction";

enum BidStatus {
	PENDING = "PENDING",
	ACCEPTED = "ACCEPTED",
	REJECTED = "REJECTED",
	CANCELLED = "CANCELLED",
}
export interface Bid {
	proposedInterest: bigint;
	status: string;
	bidder: {
		id: string;
	};
}

interface BidsTableProps {
	bids: Bid[];
	loading: boolean;
	borrower: Address;
	amount: string;
	loanId: string;
	loanStatus: LoanStatus;
}

export function BidsTable({
	bids,
	loading,
	borrower,
	amount,
	loanId,
	loanStatus,
}: BidsTableProps) {
	const { address } = useAccount();

	console.log({ bids });

	if (loading) {
		return <BidsTableSkeleton />;
	}
	const isBorrower =
		borrower.toString().toLowerCase() === address?.toString().toLowerCase();

	const hasPlacedBid = bids.some(
		(bid) => bid.bidder.id.toLowerCase() === address?.toLowerCase(),
	);
	const renderActionButton = (bid: Bid) => {
		if (isBorrower && loanStatus === "PENDING") {
			return (
				<TransactionDialog
					trigger={<Button>Accept Bid</Button>}
					title="Accept Bid"
					trxTitle="Accepting bid..."
					description="Accept the proposed bid for your loan">
					<AcceptBidTransaction
						bidder={bid.bidder.id}
						loanId={loanId}
						amount={amount}
						proposedInterest={bid.proposedInterest}
					/>
				</TransactionDialog>
			);
		}

		if (bid.bidder.id.toLowerCase() === address?.toLowerCase()) {
			switch (bid.status) {
				case BidStatus.PENDING:
					if (loanStatus === "PENDING") {
						return (
							<TransactionDialog
								trigger={<Button>Cancel Bid</Button>}
								title="Cancel Bid"
								trxTitle="Cancelling bid..."
								description="Cancel your bid and retrieve your funds">
								<CancelBidTransaction loanId={loanId} amount={amount} />
							</TransactionDialog>
						);
					}
					break;
				case BidStatus.REJECTED:
					return (
						<TransactionDialog
							trigger={<Button variant="outline">Rejected, Try Again</Button>}
							title="Place a Bid"
							trxTitle="Placing a bid..."
							confirmButtonText="Place Bid"
							description={`Deposit ${formatEther(
								BigInt(amount),
							)} WETH/ETH with your proposed interest rate`}>
							<BidComponent
								loanId={loanId}
								loanAmount={amount}
								contractAddress={P2PLENDING}
							/>
						</TransactionDialog>
					);
				case BidStatus.CANCELLED:
					return (
						<TransactionDialog
							trigger={<Button variant="outline">Cancelled, Try Again</Button>}
							title="Place a Bid"
							trxTitle="Placing a bid..."
							confirmButtonText="Place Bid"
							description={`Deposit ${formatEther(
								BigInt(amount),
							)} WETH/ETH with your proposed interest rate`}>
							<BidComponent
								loanId={loanId}
								loanAmount={amount}
								contractAddress={P2PLENDING}
							/>
						</TransactionDialog>
					);
				case BidStatus.ACCEPTED:
					return <Button variant="outline">Accepted</Button>;
			}
		}

		return <Button variant="outline">{bid.status}</Button>;
	};

	// const renderActionButton = (bid: Bid) => {
	// 	if (isBorrower && loanStatus === "PENDING") {
	// 		return (
	// 			<TransactionDialog
	// 				trigger={<Button>Accept Bid</Button>}
	// 				title="Accept Bid"
	// 				trxTitle="Accepting bid..."
	// 				description="Accept the proposed bid for your loan">
	// 				<AcceptBidTransaction
	// 					bidder={bid.bidder.id}
	// 					loanId={loanId}
	// 					amount={amount}
	// 					proposedInterest={bid.proposedInterest}
	// 				/>
	// 			</TransactionDialog>
	// 		);
	// 	}

	// 	if (bid.bidder.id.toLowerCase() === address?.toLowerCase()) {
	// 		if (loanStatus === "PENDING" && bid.status !=="CANCELLED") {
	// 			return (
	// 				<TransactionDialog
	// 					trigger={<Button>Cancel Bid</Button>}
	// 					title="Cancel Bid"
	// 					trxTitle="Cancelling bid..."
	// 					description="Cancel your bid and retrieve your funds">
	// 					<CancelBidTransaction loanId={loanId} amount={amount} />
	// 				</TransactionDialog>
	// 			);
	// 		} else if (loanStatus === "ACTIVE" && bid.status !== "ACCEPTED") {
	// 			return <Button variant="outline">Claim Lost Bid</Button>;
	// 		}
	// 	}
	// 	return <Button variant="outline">{bid.status}</Button>;
	// };

	return (
		<div className="p-4 space-y-4 border bg-card rounded-lg  w-full">
			<div className="flex justify-between items-center">
				<h2 className="text-xl font-bold">Interest Rate Bids</h2>
			</div>
			<Table className="w-full">
				<TableHeader>
					<TableRow>
						<TableHead>Bidder</TableHead>
						<TableHead>Proposed Interest</TableHead>
						<TableHead>Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{bids.length === 0 || (!hasPlacedBid && !isBorrower) ? (
						<TableRow>
							<TableCell colSpan={3}>
								<div className="flex flex-col items-center justify-center p-8 text-center">
									<InboxIcon className="w-16 h-16 text-gray-400 mb-4" />
									<p className="text-lg font-semibold text-gray-700 mb-2">
										{bids.length === 0
											? "Bids are not yet placed"
											: "You haven't placed a bid yet"}
									</p>
									{!isBorrower && (
										<TransactionDialog
											trigger={<Button>Place Bid</Button>}
											title="Place a Bid"
											trxTitle="Placing a bid..."
											confirmButtonText="Place Bid"
											description={`Deposit ${formatEther(
												BigInt(amount),
											)} WETH/ETH with your proposed interest rate`}>
											<BidComponent
												loanId={loanId}
												loanAmount={amount}
												contractAddress={P2PLENDING}
											/>
										</TransactionDialog>
									)}
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<Button
													variant="ghost"
													size="sm"
													className="text-sm text-gray-500 flex items-center">
													Learn more about bids{" "}
													<HelpCircle className="w-4 h-4 ml-1" />
												</Button>
											</TooltipTrigger>
											<TooltipContent>
												<p>
													Bids are proposed interest rates that interested
													lenders offer to borrowers.
												</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
							</TableCell>
						</TableRow>
					) : (
						bids.map((bid, index) => (
							<TableRow key={index}>
								<TableCell>{slice(bid.bidder.id)}</TableCell>
								<TableCell>{Number(bid.proposedInterest) / 100}%</TableCell>
								<TableCell>{renderActionButton(bid)}</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

function BidsTableSkeleton() {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Bidder</TableHead>
					<TableHead>Proposed Interest</TableHead>
					<TableHead>Action</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{[...Array(3)].map((_, index) => (
					<TableRow key={index}>
						<TableCell>
							<Skeleton className="h-4 w-[200px]" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-4 w-[100px]" />
						</TableCell>
						<TableCell>
							<Skeleton className="h-8 w-[100px]" />
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
