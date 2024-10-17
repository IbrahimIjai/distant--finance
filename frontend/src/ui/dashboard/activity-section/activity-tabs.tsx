"use client";
import React, { useMemo } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccount } from "wagmi";
import { useQuery } from "@apollo/client";
import { GET_ACCOUNT } from "@/lib/gql-queries";
import { Skeleton } from "@/components/ui/skeleton";
import { LoanCard } from "./loan-card";
import { formatEther, zeroAddress } from "viem";
import { TransactionDialog } from "@/ui/transaction-dialog/transaction";
import { Button } from "@/components/ui/button";
import { TransactionType, useTransactionStore } from "@/store/transactionStore";
import { P2PLENDING } from "@/config";
import { P2PLENDING_ABI } from "@/config/abi";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ExternalLink } from "lucide-react";
import { slice } from "@/lib/utils";
import Link from "next/link";

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
export function TabsContainer() {
	const { address } = useAccount();
	const { data, error, loading } = useQuery(GET_ACCOUNT, {
		variables: { account: address?.toLocaleLowerCase() },
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
				lender: loan.lends ? loan.lends.id : zeroAddress,
				borrower: loan?.borrower.id,
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
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
			<TransactionDialog
				trxTitle="Claiming all lost bids..."
				trigger={
					<Button onClick={handleClaim} className="mb-4">
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
			{bids.map((bid) => (
				<div
					key={bid.id}
					className="w-full flex flex-col bg-card border rounded-md p-2">
					<div className="flex text-sm justify-between items-center">
						<span className="font-bold">
							{formatEther(BigInt(bid.contract.amount))} ETH
						</span>
						<Link href={`/loans/${bid.contract.id}`}>
							<ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" />
						</Link>
					</div>
					{/* <div className="text-xs">
							collection:{slice(bid.contract.collection)}
						</div> */}
				</div>
			))}
		</div>
	);

	const renderLoans = (loans: Loan[], type: "active" | "pending") => (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{loans.map((loan) => (
				<LoanCard key={loan.id} loan={loan} type={type} />
			))}
		</div>
	);

	const renderLoadingState = () => (
		<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
			{[1, 2, 3, 4, 5, 6].map((i) => (
				<Card key={i} className="w-full max-w-md overflow-hidden">
					<Skeleton className="h-48 w-full" />
					<CardContent className="pt-6">
						<Skeleton className="h-8 w-3/4 mb-4" />
						<Skeleton className="h-4 w-full mb-2" />
						<Skeleton className="h-4 w-full mb-2" />
						<Skeleton className="h-4 w-full" />
					</CardContent>
					<CardFooter>
						<Skeleton className="h-10 w-full" />
					</CardFooter>
				</Card>
			))}
		</div>
	);

	return (
		<Tabs defaultValue="tab1" className="w-full">
			<TabsList className="grid w-full grid-cols-3">
				<TabsTrigger className="tabTrigger" value="tab1">
					Active Loans
				</TabsTrigger>
				<TabsTrigger className="tabTrigger" value="tab2">
					Pending Loans
				</TabsTrigger>
				<TabsTrigger className="tabTrigger" value="tab3">
					Loan Bids
				</TabsTrigger>
			</TabsList>

			<TabsContent className="tabContent" value="tab1">
				{loading ? (
					renderLoadingState()
				) : error ? (
					<p>Error loading loans. Please try again.</p>
				) : activeLoans.length > 0 ? (
					renderLoans(activeLoans, "active")
				) : (
					<p>No active loans found.</p>
				)}
			</TabsContent>
			<TabsContent className="tabContent" value="tab2">
				{loading ? (
					renderLoadingState()
				) : error ? (
					<p>Error loading loans. Please try again.</p>
				) : pendingLoans.length > 0 ? (
					renderLoans(pendingLoans, "pending")
				) : (
					<p>No pending loans found.</p>
				)}
			</TabsContent>
			<TabsContent className="tabContent" value="tab3">
				{loading ? (
					renderLoadingState()
				) : error ? (
					<p>Error loading loan bids. Please try again.</p>
				) : loanBids.length > 0 ? (
					renderLoanBids(loanBids)
				) : (
					<p>No loan bids found.</p>
				)}
			</TabsContent>
		</Tabs>
	);
}
