"use client";

import { Badge } from "@/components/ui/badge";
import useTimeStamp from "@/hooks/useTimeStamp";

import { ActiveLoan } from "@/lib/types";
import { isExpired, slice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { Clock, CreditCard, Percent } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function LoanCard({ loan }: { loan: ActiveLoan }) {
	const { address } = useAccount();
	const { push } = useRouter();
	const { amount, interest, duration, id } = loan;
	const isLender = loan.lender === address;
	return (
		<Card
			className="w-full cursor-pointer hover:shadow-md transition-shadow"
			onClick={() => push(`/loan/${id}`)}>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<Avatar>
							<AvatarImage src="/images/loan.png" alt="Loan" />
							<AvatarFallback>LN</AvatarFallback>
						</Avatar>
						<div>
							<p className="text-sm font-medium">{slice(address ?? "")}</p>
							<Badge
								variant={isLender ? "secondary" : "default"}
								className="mt-1">
								{isLender ? "Borrower" : "Lender"}
							</Badge>
						</div>
					</div>
					<CardTitle className="text-2xl font-bold">{amount} ETH</CardTitle>
				</div>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex justify-between items-center">
						<span className="text-sm text-muted-foreground">
							Interest Generated:
						</span>
						<span className="font-medium">
							ETH
							{/* {useGetInterest(id).toFixed(3)} */}
						</span>
					</div>
					<Separator />
					<div className="grid grid-cols-2 gap-4">
						<div className="flex items-center space-x-2">
							<CreditCard className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">Principal:</span>
						</div>
						<span className="text-sm font-medium text-right">{amount} ETH</span>
						<div className="flex items-center space-x-2">
							<Clock className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">Due Date:</span>
						</div>
						<span className="text-sm font-medium text-right">
							{useTimeStamp(duration)}
						</span>
						<div className="flex items-center space-x-2">
							<Percent className="w-4 h-4 text-muted-foreground" />
							<span className="text-sm text-muted-foreground">APR:</span>
						</div>
						<span className="text-sm font-medium text-right">{interest}%</span>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				{isLender ? (
					isExpired(duration) ? (
						<Button variant="destructive" className="w-full">
							Liquidate Loan
						</Button>
					) : (
						<Button variant="outline" className="w-full">
							Loan Active
						</Button>
					)
				) : (
					<Button variant="default" className="w-full">
						Repay Loan
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
