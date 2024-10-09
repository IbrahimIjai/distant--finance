"use client";

import React, { createContext, useRef, useState } from "react";
import Link from "next/link";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { MoveLeft } from "lucide-react";

// Mock data and types
interface LoanType {
	id: string;
	status: LoanStatus;
	lender: AccountType;
	borrower: AccountType;
	lockId: {
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
	const [modal, setModal] = useState<ModalType>(ModalType.INACTIVE);
	const [refresh, setRefresh] = useState<boolean>(false);

	// Mock data instead of fetching
	const loan = new Loan(mockLoanData);
	const { lender, borrower } = loan;

	const analyticsHeight = AnalyticsHeightRef.current?.clientHeight || 0;

	function getModal() {
		// Mock modal logic
		return null;
	}

	return (
		<div className="main">
			<div className="container">
				<div className="flex justify-between">
					<Link href="/loans" className="flex gap-2 items-center w-fit">
						<MoveLeft color="white" />
						<span>Back to Loans</span>
					</Link>
					<span className="flex gap-1 items-center">
						status
						<TooltipWrapper status={loan.status} />
					</span>
				</div>
				<LoanContext.Provider value={loan}>
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
				</LoanContext.Provider>
			</div>
			{getModal()}
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
