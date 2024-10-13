"use client";

import { useMemo, useState } from "react";
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
	MultiSelector,
	MultiSelectorContent,
	MultiSelectorInput,
	MultiSelectorItem,
	MultiSelectorList,
	MultiSelectorTrigger,
} from "@/components/ui/multi-select";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_LOANS } from "@/lib/gql-queries";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatEther } from "viem";
import { Badge } from "@/components/ui/badge";
import { Clock, Lock, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileSearch, RefreshCw, PlusCircle } from "lucide-react";

interface Loan {
	id: number;
	amount: number;
	interest: number;
	duration: number;
	collection: string;
	tokens: number;
}

const filters = [
	{ value: "all", label: "All" },
	{ value: "principal_high_low", label: "Principal: High to Low" },
	{ value: "principal_low_high", label: "Principal: Low to High" },
	{ value: "apr_high_low", label: "APR: High to Low" },
	{ value: "apr_low_high", label: "APR: Low to High" },
	{ value: "duration_high_low", label: "Duration: High to Low" },
	{ value: "duration_low_high", label: "Duration: Low to High" },
	{ value: "locked_tokens_high_low", label: "Locked Tokens: High to Low" },
	{ value: "locked_tokens_low_high", label: "Locked Tokens: Low to High" },
];

interface Collection {
	label: string;
	value: string;
}

interface LoanCardProps {
	loan: Loan;
}

export default function Loans() {
	const [value, setValue] = useState<string[]>([]);
	const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
	const [filter, setFilter] = useState(filters[0].value);

	const { data, loading, error } = useQuery(GET_LOANS);
	console.log({ data, loading, error });

	//@ts-expect-error: types error
	const collections: Collection[] = useMemo(() => {
		if (!data) return [];
		const collectionSet = new Set(
			//@ts-expect-error: types error
			data.loanContracts.map((loan) => ({
				label: loan.lockId.collection.name,
				value: loan.lockId.collection.name,
			})),
		);
		console.log({ collectionSet });
		return Array.from(collectionSet);
	}, [data]);

	const resetFilters = () => {
		setSelectedCollections([]);
		setFilter(filters[0].value);
	};

	const filteredLoans = useMemo(() => {
		if (!data) {
			console.log("NOOOO DATA.......");
		}
		if (!data) return [];
		let result = [...data.loanContracts];

		// Filter by selected collections
		if (selectedCollections.length > 0) {
			result = result.filter((loan) =>
				selectedCollections.includes(loan.collection),
			);
		}

		// // Apply sorting based on filter
		switch (filter) {
			case "principal_high_low":
				result.sort((a, b) => b.amount - a.amount);
				break;
			case "principal_low_high":
				result.sort((a, b) => a.amount - b.amount);
				break;
			case "apr_high_low":
				result.sort((a, b) => b.interest - a.interest);
				break;
			case "apr_low_high":
				result.sort((a, b) => a.interest - b.interest);
				break;
			case "duration_high_low":
				result.sort((a, b) => b.duration - a.duration);
				break;
			case "duration_low_high":
				result.sort((a, b) => a.duration - b.duration);
				break;
			case "locked_tokens_high_low":
				result.sort((a, b) => b.tokens - a.tokens);
				break;
			case "locked_tokens_low_high":
				result.sort((a, b) => a.tokens - b.tokens);
				break;
			default:
				break;
		}

		return result;
	}, [selectedCollections, filter, data]);

	if (error) {
		return <div>Error loading loans. Please try again.</div>;
	}

	return (
		<div className="px-10 py-[5%]">
			<p className="px-4 text-2xl font-semibold">Open Loan Requests</p>
			<div className="mx-4 flex  lg:flex-row flex-col items-center gap-3 justify-between">
				<div className="w-full lg:w-[300px]">
					<MultiSelector values={value} onValuesChange={setValue} loop={false}>
						<MultiSelectorTrigger className="w-full lg:w-[300px]">
							<MultiSelectorInput placeholder="Search Loans by Collection" />
						</MultiSelectorTrigger>
						<MultiSelectorContent className="w-full lg:w-[300px]">
							<MultiSelectorList>
								{collections?.map((option) => (
									<MultiSelectorItem key={option.value} value={option.value}>
										{option.label}
									</MultiSelectorItem>
								))}
							</MultiSelectorList>
						</MultiSelectorContent>
					</MultiSelector>
				</div>
				<Select value={filter} onValueChange={setFilter}>
					<SelectTrigger className=" w-full lg:w-[300px]">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Filter</SelectLabel>
							{filters.map((filter) => (
								<SelectItem key={filter.value} value={filter.value}>
									{filter.label}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			{/* {getModal()} */}

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
				{loading ? (
					Array.from({ length: 6 }).map((_, index) => (
						<Card key={index} className="w-full max-w-md overflow-hidden">
							<CardHeader className="p-0">
								<Skeleton className="h-48 w-full" />
							</CardHeader>
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
					))
				) : filteredLoans.length === 0 ? (
					<NoLoansFound type="all" onReset={resetFilters} />
				) : (
					filteredLoans.map((loan) => (
						<LoanCard key={loan.id} loan={loan} isLoading={false} />
					))
				)}
			</div>
		</div>
	);
}

interface LoanCardProps {
	id: string;
	amount: string;
	interest: number;
	expiry: string;
	lockId: {
		collection: {
			name: string;
			symbol: string;
		};
		tokens: string[];
	};
}

export const LoanCard = ({
	loan,
	isLoading = false,
}: {
	loan: LoanCardProps;
	isLoading: boolean;
}) => {
	const { push } = useRouter();
	if (isLoading) {
		return (
			<Card className="w-full max-w-md overflow-hidden">
				<CardHeader className="p-0">
					<Skeleton className="h-48 w-full" />
				</CardHeader>
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
		);
	}

	const amount = parseFloat(formatEther(BigInt(loan.amount)));
	const apr = loan.interest / 100;
	const daysLeft = parseInt(loan.expiry);

	return (
		<Card className="w-full max-w-md overflow-hidden">
			<CardHeader className="p-0">
				<img
					src={`/images/loan.png`}
					alt={`${loan.lockId.collection.name} visualization`}
					className="w-full h-48 object-cover"
				/>
			</CardHeader>
			<CardContent className="pt-6">
				<div className="flex justify-between items-center mb-4">
					<span className="text-xl font-semibold">{amount.toFixed(6)} ETH</span>
					<Badge variant="secondary">{loan.lockId.collection.name}</Badge>
				</div>
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
							<Lock className="mr-2 h-4 w-4" /> Locked Tokens:
						</span>
						<span className="text-sm font-medium">
							{/* {loan.lockId.tokens.length} */}NaN
						</span>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button className="w-full" onClick={() => push(`/loans/${loan.id}`)}>
					View Loan Details
				</Button>
			</CardFooter>
		</Card>
	);
};

interface NoLoansFoundProps {
	type: "active" | "pending" | "all";
	onReset?: () => void;
}

export const NoLoansFound: React.FC<NoLoansFoundProps> = ({
	type,
	onReset,
}) => {
	const { push } = useRouter();
	const messages = {
		active: "No active loans found",
		pending: "No pending loan requests",
		all: "No loans available",
	};

	const descriptions = {
		active: "There are currently no active loans matching your criteria.",
		pending: "There are no pending loan requests at the moment.",
		all: "It looks like there are no loans in the system right now.",
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardContent className="flex flex-col items-center text-center p-6">
				<FileSearch className="h-16 w-16 text-muted-foreground mb-4" />
				<h3 className="text-lg font-semibold mb-2">{messages[type]}</h3>
				<p className="text-muted-foreground mb-6">{descriptions[type]}</p>
				<div className="flex flex-col sm:flex-row gap-3">
					{onReset && (
						<Button variant="outline" onClick={onReset}>
							<RefreshCw className="mr-2 h-4 w-4" /> Reset Filters
						</Button>
					)}
					<Button onClick={() => push("./dashboard")}>
						<PlusCircle className="mr-2 h-4 w-4" /> Create Loan Request
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
