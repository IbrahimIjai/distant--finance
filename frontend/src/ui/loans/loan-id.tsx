"use client";

import React, { createContext, useRef, useState } from "react";
import Link from "next/link";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle, MoveLeft } from "lucide-react";
import { useQuery } from "@apollo/client";
import { GET_LOAN } from "@/lib/gql-queries";
import { Skeleton } from "@/components/ui/skeleton";
import { useReadContract } from "wagmi";
import { P2PLENDING, TOKENLOCKER } from "@/config";
import tokenLockerAbi from "@/config/abi/tokenlocker.json";
import p2pLendingAbi from "@/config/abi/p2p.json";
import { Address, zeroAddress } from "viem";
import { P2PLENDING_ABI, TOKENLOCKER_ABI } from "@/config/abi";
import { useLoanTokens } from "@/hooks/wagmi/temporary-hooks/useLoanTokens";
// Mock data and types
interface LoanType {
	id: string;
	status: LoanStatus;
	lender: AccountType;
	borrower: AccountType;
	lockId: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		tokens: any[]; // Replace with actual token type if available
	};
	// Add other necessary loan properties
}

interface AccountType {
	accountStatistic: boolean;
	// Add other necessary account properties
}

enum LoanStatus {
	ACTIVE = "ACTIVE",
	CLOSED = "CLOSED",
	LIQUIDATED = "LIQUIDATED",
	LOAN_REPAID = "LOAN_REPAID",
	PENDING = "PENDING",
}

enum ModalType {
	INACTIVE = "INACTIVE",
	SHOW_TOKENS = "SHOW_TOKENS",
	// Add other modal types as needed
}

class Loan {
	id: string;
	status: LoanStatus;
	lender: AccountType;
	borrower: AccountType;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	lockId: { tokens: any[] };

	constructor(data: LoanType) {
		this.id = data.id;
		this.status = data.status;
		this.lender = data.lender;
		this.borrower = data.borrower;
		this.lockId = data.lockId;
	}
}

// Mock data
const mockLoanData: LoanType = {
	id: "123",
	status: LoanStatus.ACTIVE,
	lender: { accountStatistic: true },
	borrower: { accountStatistic: false },
	lockId: { tokens: [] },
};

export const LoanContext = createContext<Loan | undefined>(undefined);

const ImageComponent: React.FC<{
	setModal: (modal: ModalType) => void;
}> = () => (
	<div className="bg-gray-200 w-64 h-64 flex items-center justify-center">
		Mock Image Component
	</div>
);

const LoanBox: React.FC<{ setModal: (modal: ModalType) => void }> = () => (
	<div className="bg-gray-100 p-4 rounded">Mock Loan Box Component</div>
);

const Analytics: React.FC<{
	reference: React.RefObject<HTMLDivElement>;
	account: AccountType;
}> = () => (
	<div className="bg-gray-100 p-4 rounded">Mock Analytics Component</div>
);

const TransactionsTable: React.FC<{ height: number }> = () => (
	<div className="bg-gray-100 p-4 rounded">
		Mock Transactions Table Component
	</div>
);

const LoanIdComponent: React.FC<{ id: string }> = ({ id }) => {
	const AnalyticsHeightRef = useRef<HTMLDivElement>(null);
	console.log({ id });
	const { data, error, loading, refetch } = useQuery(GET_LOAN, {
		variables: { ID: id.toLowerCase() },
	});

	console.log({ data, error, loading, refetch });

	const { lockedTokensData } = useLoanTokens(id as Address);
	console.log({ lockedTokensDataOnFrontend: lockedTokensData });

	// console.log({ nftData: data?.loanContract.lockId.collection.id });
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [modal, setModal] = useState<ModalType>(ModalType.INACTIVE);
	const [refresh, setRefresh] = useState<boolean>(false);

	// Mock data instead of fetching
	const loan = new Loan(mockLoanData);
	const { lender, borrower } = loan;

	const analyticsHeight = AnalyticsHeightRef.current?.clientHeight || 0;

	return (
		<div className="container mx-auto p-4">
			<div className="container">
				<div className="flex justify-between items-center mb-6">
					<Link
						href="/loans"
						className="flex items-center text-primary/60 hover:text-primary">
						<MoveLeft className="mr-2" />
						Back to Loans
					</Link>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex items-center">
									{loading ? (
										<Skeleton className="w-16 h-6" />
									) : (
										<span
											className={`${getColor(
												data?.loanContract.status,
											)} mr-2 text-sm font-semibold`}>
											Status: {data?.loanContract.status}
										</span>
									)}
									<AlertCircle size={16} />
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>Current status of the loan</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
				{/* <LoanContext.Provider value={loan}> */}
				<div className="header-container">
					<ImageComponent setModal={setModal} />
					<aside className="flex flex-col gap-2 items-end w-full">
						<LoanBox setModal={setModal} />
						<button
							onClick={() => setRefresh(true)}
							className={refresh ? "refresh" : ""}>
							Refresh
						</button>
					</aside>
				</div>
				<div className="flex flex-col md:flex-row gap-4 w-full items-start mt-4">
					{lender.accountStatistic ? (
						<Analytics reference={AnalyticsHeightRef} account={lender} />
					) : (
						<TransactionsTable height={analyticsHeight} />
					)}
					<Analytics reference={AnalyticsHeightRef} account={borrower} />
				</div>
				{lender.accountStatistic && (
					<div className="mt-4">
						<TransactionsTable height={analyticsHeight} />
					</div>
				)}
			</div>
		</div>
	);
};

function getColor(status: LoanStatus) {
	let color = "";
	switch (status) {
		case LoanStatus.ACTIVE:
			color = "#00cc66";
			break;
		case LoanStatus.CLOSED:
			color = "#808080";
			break;
		case LoanStatus.LIQUIDATED:
			color = "#ff0000";
			break;
		case LoanStatus.PENDING:
			color = "#ffff00";
			break;
		case LoanStatus.LOAN_REPAID:
			color = "#2fc0db";
			break;
		default:
			color = "#000000";
			break;
	}
	return (
		<span
			className="w-[10px] h-[10px] rounded-full inline-block"
			style={{ background: color }}></span>
	);
}

const TooltipWrapper: React.FC<{ status: LoanStatus }> = ({ status }) => {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger>Status</TooltipTrigger>
				<TooltipContent className={`${getColor(status)}`}>
					<p>{status}s</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
};

export default LoanIdComponent;
