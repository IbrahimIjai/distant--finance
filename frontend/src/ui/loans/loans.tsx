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
import Img from "@/components/image";

// import Paragraphs from "../Components/Paragraphs";
// import { MultiSelectInput } from "../Components/Mantine/Multiselect";
// import Modal4 from "../Modals/Modals4";
// import LoansComponent from "./Loans";
// import { LoansPageLoan } from "@/utils/classes";
// import { ModalType } from "@/utils/enums";
// import ShowTokens from "../Modals/ShowTokens";
const Data = [
	{
		label: "EYES NFT Collection",
		value: "EYES NFT Collection",
	},
	{
		label: "Crazy Arts",
		value: "Crazy Arts",
	},
	{
		label: "Crazy Arts vV",
		value: "Crazy Arts vV",
	},
	{
		label: "EyeBalls Collection",
		value: "EyeBalls Collection",
	},
];

interface Loan {
	id: number;
	amount: number;
	interest: number;
	duration: number;
	collection: string;
	tokens: number;
}

const mockLoans: Loan[] = [
	{
		id: 1,
		amount: 1000,
		interest: 5,
		duration: 30,
		collection: "EYES NFT Collection",
		tokens: 3,
	},
	{
		id: 2,
		amount: 2000,
		interest: 7,
		duration: 60,
		collection: "Crazy Arts",
		tokens: 5,
	},
	{
		id: 3,
		amount: 1500,
		interest: 6,
		duration: 45,
		collection: "Crazy Arts vV",
		tokens: 4,
	},
	{
		id: 4,
		amount: 3000,
		interest: 8,
		duration: 90,
		collection: "EyeBalls Collection",
		tokens: 7,
	},
	{
		id: 5,
		amount: 500,
		interest: 4,
		duration: 15,
		collection: "EYES NFT Collection",
		tokens: 2,
	},
];

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

interface LoanCardProps {
	loan: Loan;
}

const LoanCard: React.FC<LoanCardProps> = ({ loan }) => {
	const { push } = useRouter();
	return (
		<div
			onClick={() => push(`/loans/${loan.id}`)}
			className="border shadow-md rounded-lg p-4 m-2 cursor-pointer">
			<h3 className="font-bold">Loan #{loan.id}</h3>
			{/* <Img}/> */}
			<p>Amount: ${loan.amount}</p>
			<p>Interest: {loan.interest}%</p>
			<p>Duration: {loan.duration} days</p>
			<p>Collection: {loan.collection}</p>
			<p>Tokens: {loan.tokens}</p>
		</div>
	);
};

export default function Loans() {
	// const [filter, setFilter] = useState(filters[0]);
	const [value, setValue] = useState<string[]>([]);
	const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
	const [filter, setFilter] = useState(filters[0].value);

	const filteredLoans = useMemo(() => {
		let result = [...mockLoans];

		// Filter by selected collections
		if (selectedCollections.length > 0) {
			result = result.filter((loan) =>
				selectedCollections.includes(loan.collection),
			);
		}

		// Apply sorting based on filter
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
	}, [selectedCollections, filter]);

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
								{Data.map((option, i) => (
									<MultiSelectorItem key={i} value={option.value}>
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

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{filteredLoans.length === 0 ? (
					<div className="col-span-full text-center py-10">
						No Pending Loans found
					</div>
				) : (
					filteredLoans.map((loan) => <LoanCard key={loan.id} loan={loan} />)
				)}
			</div>
			{/* <LoansComponent {...{ setModal, filter, search, setLoan }} /> */}
		</div>
	);
}
