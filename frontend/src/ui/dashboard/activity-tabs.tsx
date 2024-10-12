import React from "react";
// import * as Tabs from "@radix-ui/react-tabs";
// import ActiveLoans from "./activeLoan";
// import PendingLoans from "./pendingLoan";
// import LoanBids from "./loanBid";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccount, useReadContract } from "wagmi";
import { P2PLENDING } from "@/config";
import P2PLendingAbi from "@/config/abi/p2p.json";
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
				{/* <ActiveLoans /> */}
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
