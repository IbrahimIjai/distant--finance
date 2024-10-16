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
import { BidComponent } from "../transaction-dialog/bid-content";
import { P2PLENDING } from "@/config";

export interface Bid {
	proposedInterest: bigint;
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
}

export function BidsTable({
	bids,
	loading,
	borrower,
	amount,
	loanId,
}: BidsTableProps) {
	const { address } = useAccount();

	if (loading) {
		return <BidsTableSkeleton />;
	}
	const isBorrower =
		borrower.toString().toLowerCase() === address?.toString().toLowerCase();

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
					{bids.length === 0 ? (
						<TableRow>
							<TableCell colSpan={3}>
								<div className="flex flex-col items-center justify-center p-8 text-center">
									<InboxIcon className="w-16 h-16 text-gray-400 mb-4" />
									<p className="text-lg font-semibold text-gray-700 mb-2">
										Bids are not yet placed
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
								<TableCell>{bid.bidder.id}</TableCell>
								<TableCell>{formatEther(bid.proposedInterest)}%</TableCell>
								<TableCell>
									{address?.toLowerCase() === borrower.toLowerCase() ? (
										<Button onClick={() => {}}>Accept Bid</Button>
									) : address?.toLowerCase() === bid.bidder.id.toLowerCase() ? (
										<Button onClick={() => {}}>Claim Bid</Button>
									) : null}
								</TableCell>
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
