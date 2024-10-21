import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { slice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAccount } from "wagmi";

enum TransactionType {
	TRANSFER = "TRANSFER",
	LOAN_REQUEST_OPEN = "LOAN_REQUEST_OPEN",
	LOAN_REQUEST_CANCELLED = "LOAN_REQUEST_CANCELLED",
	LOAN_REQUEST_ACTIVE = "LOAN_REQUEST_ACTIVE",
	LOAN_REQUEST_BID_OPEN = "LOAN_REQUEST_BID_OPEN",
	LOAN_REQUEST_BID_CANCELLED = "LOAN_REQUEST_BID_CANCELLED",
	LOAN_REQUEST_BID_LOST = "LOAN_REQUEST_BID_LOST",
	LOAN_LIQUIDATED = "LOAN_LIQUIDATED",
	LOAN_REPAID = "LOAN_REPAID",
	TOKENS_LOCKED = "TOKENS_LOCKED",
}

type Transaction = {
	id: string;
	transactionFrom: string;
	timestamp: string;
	txType: TransactionType;
};

const getBadgeStyles = (type: TransactionType) => {
	switch (type) {
		case TransactionType.TRANSFER:
			return "bg-blue-100 text-blue-800";
		case TransactionType.LOAN_REQUEST_OPEN:
		case TransactionType.LOAN_REQUEST_BID_OPEN:
			return "bg-green-100 text-green-800";
		case TransactionType.LOAN_REQUEST_CANCELLED:
		case TransactionType.LOAN_REQUEST_BID_CANCELLED:
		case TransactionType.LOAN_REQUEST_BID_LOST:
			return "bg-yellow-100 text-yellow-800";
		case TransactionType.LOAN_REQUEST_ACTIVE:
			return "bg-purple-100 text-purple-800";
		case TransactionType.LOAN_LIQUIDATED:
			return "bg-red-100 text-red-800";
		case TransactionType.LOAN_REPAID:
			return "bg-teal-100 text-teal-800";
		case TransactionType.TOKENS_LOCKED:
			return "bg-indigo-100 text-indigo-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};
const formatTransactionType = (type: TransactionType) => {
	return type
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
};

const TableLoader = () => (
	<>
		{[...Array(5)].map((_, index) => (
			<TableRow key={index}>
				<TableCell>
					<Skeleton className="h-6 w-24" />
				</TableCell>
				<TableCell>
					<Skeleton className="h-6 w-32" />
				</TableCell>
				<TableCell>
					<Skeleton className="h-6 w-24" />
				</TableCell>
			</TableRow>
		))}
	</>
);
export default function TransactionTable({
	transactions,
	isLoading,
}: {
	transactions: Transaction[];
	isLoading: boolean;
}) {
	const { chain } = useAccount();
	// console.log({ chainExplorer: chain?.blockExplorers?.default.url });
	const [filter, setFilter] = useState<TransactionType | "all">("all");

	const filteredTransactions = transactions?.filter((tx) =>
		filter === "all" ? true : tx.txType === filter,
	);

	const handleRowClick = (transactionId: string) => {
		if (chain?.blockExplorers?.default?.url) {
			window.open(
				`${chain.blockExplorers.default.url}/tx/${transactionId}`,
				"_blank",
			);
		} else {
			console.warn("Block explorer URL not available for the current network");
		}
	};

	return (
		<div className="p-4 space-y-4 border bg-card rounded-lg">
			<div className="flex justify-between flex-col lg:flex-row items-center">
				<h2 className="text-2xl font-bold">Transactions</h2>
				<div className="flex space-x-2">
					<Select
						onValueChange={(value) =>
							setFilter(value as TransactionType | "all")
						}>
						<SelectTrigger className="w-[220px]">
							<SelectValue placeholder="Filter by transaction type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Types</SelectItem>
							{Object.values(TransactionType).map((type) => (
								<SelectItem key={type} value={type}>
									{formatTransactionType(type)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="text-muted-foreground">Type</TableHead>
						<TableHead className="text-muted-foreground">From</TableHead>
						<TableHead className="text-muted-foreground">Time</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading ? (
						<TableLoader />
					) : (
						filteredTransactions.map((tx) => (
							<TableRow
								key={tx.id}
								className="hover:bg-muted/50 transition-colors cursor-pointer"
								onClick={() => handleRowClick(tx.id)}>
								<TableCell className="font-medium">
									<Badge className={`${getBadgeStyles(tx.txType)} capitalize`}>
										{formatTransactionType(tx.txType)}
									</Badge>
								</TableCell>
								<TableCell className="font-medium">
									{slice(tx.transactionFrom)}
								</TableCell>
								<TableCell>
									{new Date(parseInt(tx.timestamp) * 1000).toLocaleString()}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
