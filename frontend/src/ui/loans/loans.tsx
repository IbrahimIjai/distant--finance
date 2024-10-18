"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { formatEther } from "viem";
import { GET_LOANS } from "@/lib/gql-queries";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Clock,
	Lock,
	Percent,
	FileSearch,
	RefreshCw,
	PlusCircle,
} from "lucide-react";
import {
	MultiSelector,
	MultiSelectorContent,
	MultiSelectorInput,
	MultiSelectorItem,
	MultiSelectorList,
	MultiSelectorTrigger,
} from "@/components/ui/multi-select";

interface Loan {
	id: string;
	amount: string;
	interest: number;
	expiry: string;
	lockId: {
		collection: {
			name: string;
		};
	};
	status: LoanStatus;
}

enum LoanStatus {
	PENDING = "PENDING",
	ACTIVE = "ACTIVE",
	CLOSED = "CLOSED",
	LIQUIDATED = "LIQUIDATED",
	LOAN_REPAID = "LOAN_REPAID",
}

const filters = [
	{ value: "all", label: "All" },
	{ value: "principal_high_low", label: "Principal: High to Low" },
	{ value: "principal_low_high", label: "Principal: Low to High" },
	{ value: "apr_high_low", label: "APR: High to Low" },
	{ value: "apr_low_high", label: "APR: Low to High" },
	{ value: "duration_high_low", label: "Duration: High to Low" },
	{ value: "duration_low_high", label: "Duration: Low to High" },
];

export default function LoansPage() {
	const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
	const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
	const [filter, setFilter] = useState(filters[0].value);
	const { data, loading, error } = useQuery(GET_LOANS);

	const collections = useMemo(() => {
		if (!data?.loanContracts) return [];
		const collectionSet = new Set(
			data.loanContracts.map((loan: Loan) => loan.lockId.collection.name),
		);
		return Array.from(collectionSet).map((collection) => ({
			label: collection,
			value: collection,
		}));
	}, [data]);

	const filteredLoans = useMemo(() => {
		if (!data?.loanContracts) return [];
		let result = [...data.loanContracts];

		// Filter by selected collections
		if (selectedCollections.length > 0) {
			result = result.filter((loan) =>
				selectedCollections.includes(loan.lockId.collection.name),
			);
		}

		// Filter by selected statuses
		if (selectedStatuses.length > 0) {
			result = result.filter((loan) => selectedStatuses.includes(loan.status));
		}

		// Apply sorting based on filter
		switch (filter) {
			case "principal_high_low":
				result.sort((a, b) => Number(b.amount) - Number(a.amount));
				break;
			case "principal_low_high":
				result.sort((a, b) => Number(a.amount) - Number(b.amount));
				break;
			case "apr_high_low":
				result.sort((a, b) => b.interest - a.interest);
				break;
			case "apr_low_high":
				result.sort((a, b) => a.interest - b.interest);
				break;
			case "duration_high_low":
				result.sort((a, b) => Number(b.expiry) - Number(a.expiry));
				break;
			case "duration_low_high":
				result.sort((a, b) => Number(a.expiry) - Number(b.expiry));
				break;
			default:
				break;
		}

		return result;
	}, [data, selectedCollections, selectedStatuses, filter]);

	const resetFilters = () => {
		setSelectedCollections([]);
		setSelectedStatuses([]);
		setFilter(filters[0].value);
	};

	if (error) {
		return (
			<div className="text-center p-8">
				Error loading loans. Please try again.
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Open Loan Requests</h1>
			<div className="flex flex-col items-center md:flex-row gap-4 mb-6">
				<MultiSelector
					values={selectedCollections}
					onValuesChange={(newValues: string[]) =>
						setSelectedCollections(newValues)
					}
					className="md:w-64">
					<MultiSelectorTrigger>
						<MultiSelectorInput placeholder="Filter by Collection" />
					</MultiSelectorTrigger>
					<MultiSelectorContent>
						<MultiSelectorList>
							{collections.map((collection, i) => (
								<MultiSelectorItem key={i} value={collection.value as string}>
									{collection.label as string}
								</MultiSelectorItem>
							))}
						</MultiSelectorList>
					</MultiSelectorContent>
				</MultiSelector>
				<MultiSelector
					values={selectedStatuses}
					onValuesChange={(newValues: string[]) =>
						setSelectedStatuses(newValues)
					}
					className="md:w-64">
					<MultiSelectorTrigger>
						<MultiSelectorInput placeholder="Filter by Status" />
					</MultiSelectorTrigger>
					<MultiSelectorContent>
						<MultiSelectorList>
							{Object.values(LoanStatus).map((status) => (
								<MultiSelectorItem key={status} value={status}>
									{status}
								</MultiSelectorItem>
							))}
						</MultiSelectorList>
					</MultiSelectorContent>
				</MultiSelector>
				<Select value={filter} onValueChange={setFilter}>
					<SelectTrigger className="md:w-64">
						<SelectValue placeholder="Sort loans" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Sort</SelectLabel>
							{filters.map((filter) => (
								<SelectItem key={filter.value} value={filter.value}>
									{filter.label}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
				<Button variant="outline" onClick={resetFilters}>
					Reset Filters
				</Button>
			</div>

			{loading ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{Array.from({ length: 6 }).map((_, index) => (
						<LoanCardSkeleton key={index} />
					))}
				</div>
			) : filteredLoans.length === 0 ? (
				<NoLoansFound onReset={resetFilters} />
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredLoans.map((loan) => (
						<LoanCard key={loan.id} loan={loan} />
					))}
				</div>
			)}
		</div>
	);
}

const LoanCard: React.FC<{ loan: Loan }> = ({ loan }) => {
	const router = useRouter();
	const amount = parseFloat(formatEther(BigInt(loan.amount)));
	const apr = loan.interest / 100;
	const daysLeft = parseInt(loan.expiry);

	return (
		<Card className="flex flex-col h-full">
			<CardHeader>
				<CardTitle className="flex justify-between items-center">
					<span>{amount.toFixed(4)} ETH</span>
					<Badge variant="secondary">{loan.lockId.collection.name}</Badge>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex-grow">
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground flex items-center">
							<Percent className="mr-2 h-4 w-4" /> APR:
						</span>
						<span className="text-sm font-medium">{apr.toFixed(2)}%</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground flex items-center">
							<Clock className="mr-2 h-4 w-4" /> Duration:
						</span>
						<span className="text-sm font-medium">{daysLeft} days left</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground flex items-center">
							<Lock className="mr-2 h-4 w-4" /> Status:
						</span>
						<span className="text-sm font-medium">{loan.status}</span>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button
					className="w-full"
					onClick={() => router.push(`/loans/${loan.id}`)}>
					View Loan Details
				</Button>
			</CardFooter>
		</Card>
	);
};

const LoanCardSkeleton: React.FC = () => (
	<Card className="flex flex-col h-full">
		<CardHeader>
			<Skeleton className="h-6 w-3/4" />
		</CardHeader>
		<CardContent className="flex-grow">
			<div className="space-y-2">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-full" />
			</div>
		</CardContent>
		<CardFooter>
			<Skeleton className="h-10 w-full" />
		</CardFooter>
	</Card>
);

const NoLoansFound: React.FC<{ onReset: () => void }> = ({ onReset }) => {
	const { push } = useRouter();
	return (
		<Card className="w-full max-w-md mx-auto">
			<CardContent className="flex flex-col items-center text-center p-6">
				<FileSearch className="h-16 w-16 text-muted-foreground mb-4" />
				<h3 className="text-lg font-semibold mb-2">No loans available</h3>
				<p className="text-muted-foreground mb-6">
					It looks like there are no loans matching your criteria right now.
				</p>
				<div className="flex flex-col sm:flex-row gap-3">
					<Button variant="outline" onClick={onReset}>
						<RefreshCw className="mr-2 h-4 w-4" /> Reset Filters
					</Button>
					<Button onClick={() => push("/dashboard")}>
						<PlusCircle className="mr-2 h-4 w-4" /> Create Loan Request
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
