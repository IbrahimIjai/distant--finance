"use client";

import { Badge } from "@/components/ui/badge";
import { slice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Clock, Percent, User, Coins } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
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

	const getStatusColor = () => {
		if (type === "active") return "bg-green-500";
		return "bg-yellow-500";
	};

	return (
		<Card
			className="w-full cursor-pointer hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1"
			onClick={() => push(`/loans/${loan.id}`)}>
			<CardHeader className="pb-2">
				<div className="flex justify-between items-center">
					<CardTitle className="text-xl font-semibold flex items-center">
						<Coins className="mr-2 h-6 w-6 text-primary" />
						{formatEther(loan.amount)} ETH
					</CardTitle>
					<Badge
						variant={type === "active" ? "default" : "secondary"}
						className={`${getStatusColor()} text-white`}>
						{type === "active" ? "Active" : "Pending"}
					</Badge>
				</div>
			</CardHeader>

			<CardContent className="pt-4">
				<div className="space-y-3">
					<div className="flex items-center justify-between bg-secondary/50 p-2 rounded-md">
						<span className="text-sm flex items-center">
							<User className="mr-2 h-4 w-4" />
							{isLender ? "Borrower" : "Lender"}:
						</span>
						<span className="text-sm font-medium">
							{slice(isLender ? loan.borrower : loan.lender)}
						</span>
					</div>
					<div className="flex items-center justify-between bg-secondary/50 p-2 rounded-md">
						<span className="text-sm flex items-center">
							<Percent className="mr-2 h-4 w-4" /> APR:
						</span>
						<span className="text-sm font-medium">
							{(Number(loan.interest) / 100).toFixed(2)}%
						</span>
					</div>
					<div className="flex items-center justify-between bg-secondary/50 p-2 rounded-md">
						<span className="text-sm flex items-center">
							<Clock className="mr-2 h-4 w-4" /> Expiry:
						</span>
						<span className="text-sm font-medium">
							{Number(loan.expiry)} days
						</span>
					</div>
				</div>
			</CardContent>

			<CardFooter className="pt-4">
				<Button
					className="w-full font-semibold"
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
