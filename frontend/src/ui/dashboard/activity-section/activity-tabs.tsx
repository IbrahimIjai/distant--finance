"use client";
import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccount } from "wagmi";
import { useQuery } from "@apollo/client";
import { GET_ACCOUNT_LOANS } from "@/lib/gql-queries";
import { useUserLoans } from "@/hooks/wagmi/temporary-hooks/useLoans";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LoanCard } from "./loan-card";

interface Loan {
	amount: bigint;
	borrower: string;
	expiry: bigint;
	id: string;
	interest: bigint;
	lender: string;
	lockId: string;
}
export function TabsContainer() {
	const { address } = useAccount();

	const {  error, loading } = useQuery(GET_ACCOUNT_LOANS, {
		variables: { account: address?.toLowerCase(), status: "ACTIVE" },
	});

	// console.log({ data, error, loading });
	const loans = useUserLoans(address);
	// console.log({ loans });

	const activeLoans =
		loans?.filter(
			(loan: Loan) =>
				loan.lender !== "0x0000000000000000000000000000000000000000",
		) ?? [];
	const pendingLoans =
		loans?.filter(
			(loan: Loan) =>
				loan.lender === "0x0000000000000000000000000000000000000000",
		) ?? [];

	const renderLoans = (loans: Loan[], type: "active" | "pending") => (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{loans.map((loan) => (
				<LoanCard key={loan.id} loan={loan} type={type} />
			))}
		</div>
	);
	const renderLoadingState = () => (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{[1, 2, 3].map((i) => (
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
				{/* {isUserLoanLoading ? (
					<div className="flex items-center flex-wrap justify-between">
						{[1, 2, 3, 4, 5, 6].map((arg) => (
							<Skeleton key={arg} className="w-52 h-12" />
						))}
					</div>
				) : userLoans.length ? (
					<div>
						{userLoans.map((item, i) => (
							<div key={i}>
								<LoanCard loan={item} />
							</div>
						))}
					</div>
				) : (
					<div>
						<p>No loan found.</p>
					</div>
				)} */}
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
				{/* <LoanBids /> */}
				<div>Hello Loan bids</div>
			</TabsContent>
		</Tabs>
	);
}
