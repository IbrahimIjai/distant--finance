import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEther } from "viem";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccount } from "wagmi";

interface Transaction {
	id: string;
	amount: string;
	interest: string;
	txType: string;
}

interface TransactionTableProps {
	transactions: Transaction[];
	isLoading: boolean;
}

export function TransactionTable({
	transactions,
	isLoading,
}: TransactionTableProps) {
	const { chain } = useAccount();
	return (
		<Card className="mt-6">
			<CardHeader>
				<CardTitle>Loan Transactions</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>LOAN ID</TableHead>
							<TableHead>AMOUNT (ETH)</TableHead>
							<TableHead>APR</TableHead>
							<TableHead>TYPE</TableHead>
							<TableHead>TX</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							Array(5)
								.fill(null)
								.map((_, index) => (
									<TableRow key={index}>
										<TableCell>
											<Skeleton className="h-4 w-[100px]" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-[80px]" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-[60px]" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-[80px]" />
										</TableCell>
										<TableCell>
											<Skeleton className="h-4 w-[120px]" />
										</TableCell>
									</TableRow>
								))
						) : transactions.length > 0 ? (
							transactions.map((transaction) => (
								<TableRow key={transaction.id}>
									<TableCell className="font-medium">
										{transaction.id.slice(0, 8)}...
									</TableCell>
									<TableCell>
										{formatEther(BigInt(transaction.amount))} ETH
									</TableCell>
									<TableCell>
										{(Number(transaction.interest) / 100).toFixed(2)}%
									</TableCell>
									<TableCell>{transaction.txType}</TableCell>
									<TableCell>
										<a
											href={`${chain?.blockExplorers?.default.url}/${transaction.id}`}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-500 hover:underline">
											View
										</a>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={5} className="text-center">
									No transactions found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
