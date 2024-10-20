"use client";

import React, { useMemo } from "react";
import { useAccount } from "wagmi";
import { useQuery } from "@apollo/client";
import { formatEther, zeroAddress } from "viem";
import { GET_ACCOUNT } from "@/lib/gql-queries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TransactionDialog } from "@/ui/transaction-dialog/transaction";
import { TransactionType, useTransactionStore } from "@/store/transactionStore";
import { P2PLENDING } from "@/config";
import {
	AlertCircle,
	ExternalLink,
	FileQuestion,
	PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LoanCard } from "./loan-card";
import { P2PLENDING_ABI } from "@/config/abi";
import { Badge } from "@/components/ui/badge";
import { TransactionTable } from "./transaction-table";

export interface Transaction {
	txType: string;
	id: string;
	timestamp: string;
}

export interface Loan {
	id: string;
	amount: bigint;
	expiry: bigint;
	interest: bigint;
	checkPointBlock: string;
	collection: string;
	lender: string;
	borrower: string;
	status: "ACTIVE" | "PENDING";
	transactions: Transaction[];
}
interface LoanBid {
	id: string;
	status: string;
	proposedInterest: string;
	contract: {
		id: string;
		amount: string;
		collection: string;
		status: string;
		expiry: string;
	};
}

function NoLoansFound({ type }: { type: "active" | "pending" | "bids" }) {
	return (
		<div className="flex flex-col items-center justify-center h-64 text-center">
			<FileQuestion className="w-16 h-16 text-muted-foreground mb-4" />
			<h3 className="text-lg font-semibold mb-2">No {type} loans found</h3>
			<p className="text-muted-foreground mb-4">
				{type === "bids"
					? "You haven't placed any bids yet."
					: `You don't have any ${type} loans at the moment.`}
			</p>
			<Link href="/loans">
				<Button>
					<PlusCircle className="mr-2 h-4 w-4" />
					{type === "bids" ? "Place a Bid" : "Create a Loan"}
				</Button>
			</Link>
		</div>
	);
}

export function LoanActivitiesTab() {
	const { address } = useAccount();
	const { data, error, loading } = useQuery(GET_ACCOUNT, {
		variables: { account: address?.toLowerCase() },
	});
	const setTransaction = useTransactionStore((state) => state.setTransaction);

	const allLoans: Loan[] = useMemo(() => {
		if (!data?.account) return [];
		return [...(data.account.borrows || []), ...(data.account.lends || [])].map(
			(loan) => ({
				...loan,
				amount: BigInt(loan.amount),
				expiry: BigInt(loan.expiry),
				interest: BigInt(loan.interest),
				lender: loan.lender ? loan.lender?.id : zeroAddress,
				borrower: loan?.borrower.id,

				transactions: loan.transactions,
			}),
		);
	}, [data]);

	const activeLoans = useMemo(
		() => allLoans.filter((loan) => loan.status === "ACTIVE"),
		[allLoans],
	);

	const pendingLoans = useMemo(
		() => allLoans.filter((loan) => loan.status === "PENDING"),
		[allLoans],
	);

	const loanBids = data?.account?.loanBids || [];
	console.log({ allLoans });

	const transactions = useMemo(() => {
		return allLoans
			.map((loan) =>
				loan.transactions.map((tx) => ({
					...tx,
					amount: loan.amount.toString(),
					interest: loan.interest.toString(),
				})),
			)
			.flat();
	}, [allLoans]);

	const handleClaim = () => {
		setTransaction({
			isOpen: true,
			isReady: true,
			type: TransactionType.CLAIM_LOST_BID,
			args: undefined,
			contractAddress: P2PLENDING,
			abi: P2PLENDING_ABI,
			functionName: "withdrawLostBids",
		});
	};

	const renderLoanBids = (bids: LoanBid[]) => (
		<div className="space-y-4">
			<TransactionDialog
				trxTitle="Claiming all lost bids..."
				trigger={
					<Button onClick={handleClaim} className="w-full mb-4">
						Claim Lost Bids
					</Button>
				}
				title="Claim Lost Bids"
				description="Withdraw your WETH from unsuccessful bids">
				<Card className="w-full">
					<CardContent>
						<Alert>
							<AlertCircle className="h-4 w-4" />
							<AlertTitle>Note</AlertTitle>
							<AlertDescription>
								This action will withdraw all your lost bids. Make sure you want
								to claim them all at once.
							</AlertDescription>
						</Alert>
					</CardContent>
				</Card>
			</TransactionDialog>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{bids.map((bid) => (
					<Card key={bid.id} className={cn("w-full")}>
						<CardContent className="p-4">
							<div className="flex justify-between items-center">
								<span className="font-bold">
									{formatEther(BigInt(bid.contract.amount))} ETH
								</span>
								<Badge
									variant={bid.status.toLowerCase() as "default" | "secondary"}>
									{bid.status}
								</Badge>
							</div>
							<div className="mt-2 flex justify-between items-center text-sm text-muted-foreground">
								<span>Interest: {bid.proposedInterest}%</span>
								<Link href={`/loans/${bid.contract.id}`}>
									<Button variant="ghost" size="sm">
										<ExternalLink className="h-4 w-4 mr-1" />
										View
									</Button>
								</Link>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);

	const renderLoans = (loans: Loan[], type: "active" | "pending") => (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{loans.map((loan) => (
				<LoanCard key={loan.id} loan={loan} type={type} />
			))}
		</div>
	);

	const renderLoadingState = () => (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
			{[1, 2, 3, 4].map((i) => (
				<Card key={i} className="w-full">
					<CardContent className="p-6">
						<Skeleton className="h-8 w-3/4 mb-4" />
						<Skeleton className="h-4 w-full mb-2" />
						<Skeleton className="h-4 w-full mb-2" />
						<Skeleton className="h-4 w-full" />
					</CardContent>
				</Card>
			))}
		</div>
	);

	return (
		<>
			<Card className="w-full mb-6">
				<CardHeader>
					<CardTitle>Loan Activity</CardTitle>
				</CardHeader>
				<CardContent>
					<Tabs defaultValue="active" className="w-full">
						<TabsList className="grid w-full grid-cols-3 mb-6">
							<TabsTrigger value="active">Active Loans</TabsTrigger>
							<TabsTrigger value="pending">Pending Loans</TabsTrigger>
							<TabsTrigger value="bids">Loan Bids</TabsTrigger>
						</TabsList>
						<TabsContent value="active">
							{loading ? (
								renderLoadingState()
							) : error ? (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>Error</AlertTitle>
									<AlertDescription>
										Failed to load active loans. Please try again.
									</AlertDescription>
								</Alert>
							) : activeLoans.length > 0 ? (
								renderLoans(activeLoans, "active")
							) : (
								<NoLoansFound type="active" />
							)}
						</TabsContent>
						<TabsContent value="pending">
							{loading ? (
								renderLoadingState()
							) : error ? (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>Error</AlertTitle>
									<AlertDescription>
										Failed to load pending loans. Please try again.
									</AlertDescription>
								</Alert>
							) : pendingLoans.length > 0 ? (
								renderLoans(pendingLoans, "pending")
							) : (
								<NoLoansFound type="pending" />
							)}
						</TabsContent>
						<TabsContent value="bids">
							{loading ? (
								renderLoadingState()
							) : error ? (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>Error</AlertTitle>
									<AlertDescription>
										Failed to load loan bids. Please try again.
									</AlertDescription>
								</Alert>
							) : loanBids.length > 0 ? (
								renderLoanBids(loanBids)
							) : (
								<NoLoansFound type="bids" />
							)}
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
			<TransactionTable transactions={transactions} isLoading={loading} />
		</>
	);
}
