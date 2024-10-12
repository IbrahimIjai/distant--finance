import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccount, useReadContract } from "wagmi";
import { P2PLENDING } from "@/config";
import P2PLendingAbi from "@/config/abi/p2p.json";
import { Skeleton } from "@/components/ui/skeleton";
import { LoanCard } from "./loan-card";
export function TabsContainer() {
	const { address } = useAccount();

	const {
		data: userLoans,
		isLoading: isUserLoanLoading,
		isError,
		error,
	} = useReadContract({
		address: P2PLENDING,
		args: [address],
		functionName: "getUserLoanIds",
		abi: P2PLendingAbi,
	});
	const { data: bidValueWithdrawable, isLoading: isBidValieLoading } =
		useReadContract({
			address: P2PLENDING,
			args: [address],
			functionName: "getLostBidsValue",
			abi: P2PLendingAbi,
		});

	console.log({
		userLoans,
		bidValueWithdrawable,
		isBidValieLoading,
		isUserLoanLoading,
		isError,
		error,
	});

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
				{isUserLoanLoading ? (
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
				)}
				<div>Hello active loans</div>
			</TabsContent>
			<TabsContent className="tabContent" value="tab2">
				{/* <PendingLoans /> */}
				<div>Hello pending loans</div> <div>Hello active loans</div>
			</TabsContent>
			<TabsContent className="tabContent" value="tab3">
				{/* <LoanBids /> */}
				<div>Hello Loan bids</div>
			</TabsContent>
		</Tabs>
	);
}
