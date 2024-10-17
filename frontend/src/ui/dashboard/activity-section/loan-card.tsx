"use client";

import { Badge } from "@/components/ui/badge";
import { slice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Clock, Percent } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { formatEther } from "viem";
import { Loan } from "./activity-tabs";

export function LoanCard({
	loan,
	type,
}: {
	loan: Loan;
	type: "active" | "pending";
}) {
	const { address } = useAccount();
	const { push } = useRouter();
	const isLender = loan.lender.toLowerCase() === address?.toLowerCase();

	return (
		<Card
			className="w-full cursor-pointer hover:shadow-md transition-shadow"
			onClick={() => push(`/loans/${loan.id}`)}>
			<CardHeader>
				<img
					src="/images/loan.png"
					alt="Loan visualization"
					className="w-full h-48 object-cover"
				/>
			</CardHeader>

			<CardContent className="pt-6">
				<div className="flex justify-between items-center mb-4">
					<span className="text-2xl font-bold">
						{formatEther(loan.amount)} ETH
					</span>
					<Badge variant={type === "active" ? "default" : "secondary"}>
						{type === "active" ? "Active" : "Pending"}
					</Badge>
				</div>
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground">
							{isLender ? "Borrower" : "Lender"}:
						</span>
						<span className="text-sm font-medium">
							{slice(isLender ? loan.borrower : loan.lender)}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground flex items-center">
							<Percent className="mr-2 h-4 w-4" /> APR:
						</span>
						<span className="text-sm font-medium">
							{(Number(loan.interest) / 100).toFixed(2)}%
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground flex items-center">
							<Clock className="mr-2 h-4 w-4" /> Expiry:
						</span>
						<span className="text-sm font-medium">
							{Number(loan.expiry)} days
						</span>
					</div>
				</div>
			</CardContent>

			<CardFooter>
				<Button
					className="w-full"
					variant={type === "active" ? "default" : "outline"}>
					{type === "active"
						? isLender
							? "Manage Loan"
							: "Repay Loan"
						: "View Details"}
				</Button>
			</CardFooter>
		</Card>
	);
}
