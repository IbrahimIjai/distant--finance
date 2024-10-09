import React from "react";
// import * as Tabs from "@radix-ui/react-tabs";
// import ActiveLoans from "./activeLoan";
// import PendingLoans from "./pendingLoan";
// import LoanBids from "./loanBid";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TabsContainer() {
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
