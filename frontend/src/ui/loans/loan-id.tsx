"use client";

import React from "react";
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
import { Address } from "viem";
import { useLoanTokens } from "@/hooks/wagmi/temporary-hooks/useLoanTokens";
import { LoanStatus } from "@/lib/types";
import NFTSwipeableCards from "./swipable-nft-cards";
import { LoanBox } from "./loan-box";
import TransactionTable from "./transaction-table";
import { Bid, BidsTable } from "./bids";

const LoanIdComponent: React.FC<{ id: string }> = ({ id }) => {
  const { data, loading } = useQuery(GET_LOAN, {
    variables: { ID: id.toLowerCase() },
  });

	const bids: Bid[] = data?.loanContract.bids ?? [];

	console.log({ data, bids });

	const { tokenDetails } = useLoanTokens(id as Address);

	console.log(
		{ id: data?.loanContract.id },
		typeof data?.loanContract.id,
	);
	const handleLoanAction = (action: string) => {
		console.log(`Action: ${action}`);
	};
	const isLoading = loading;
	// const isError = error;

	return (
		<div className="container mx-auto p-4">
			<div className="flex flex-col gap-8">
				<div className="flex justify-between items-center mb-6">
					<Link
						href="/loans"
						className="flex items-center text-primary/60 hover:text-primary">
						<MoveLeft className="mr-2" />
						Back to Loans
					</Link>
					<LoanStatusComponent
						status={data?.loanContract.status}
						loading={isLoading}
					/>
				</div>

				<NFTSwipeableCards
					collectionAddress={data?.loanContract.lockId.collection.id}
					isSubgraphdataLoading={loading}
					nftIds={tokenDetails}
				/>
				<div className="flex flex-col-reverse items-start lg:flex-row  w-full gap-6">
					<BidsTable
						bids={bids}
						loanId={data?.loanContract.id}
						amount={data?.loanContract.amount ??"0"}
						loading={isLoading}
						borrower={data?.loanContract.borrower.id as Address}
					/>
					<LoanBox
						loan={{
							id: data?.loanContract.id as string,
							amount: data?.loanContract.amount as string,
							interest: data?.loanContract.interest as number,
							expiry: data?.loanContract.expiry,
							borrower: data?.loanContract.borrower,
							lender: data?.loanContract.lender,
							status: data?.loanContract.status as LoanStatus,
						}}
						onAction={handleLoanAction}
					/>
				</div>

				<TransactionTable />
			</div>
		</div>
	);
};

interface StatusInfo {
  color: string;
  tooltipContent: string;
}

function getStatusInfo(status: LoanStatus): StatusInfo {
  switch (status) {
    case LoanStatus.ACTIVE:
      return {
        color: "#00cc66",
        tooltipContent:
          "Loan is active. A lender has been found and the loan is ongoing.",
      };
    case LoanStatus.CLOSED:
      return {
        color: "#808080",
        tooltipContent: "Loan is closed. It has been completed or terminated.",
      };
    case LoanStatus.LIQUIDATED:
      return {
        color: "#ff0000",
        tooltipContent:
          "Loan has been liquidated. The borrower failed to repay within the specified time.",
      };
    case LoanStatus.PENDING:
      return {
        color: "#ffff00",
        tooltipContent:
          "Loan is pending. Waiting for a lender to fund the loan.",
      };
    case LoanStatus.LOAN_REPAID:
      return {
        color: "#2fc0db",
        tooltipContent:
          "Loan has been repaid. The borrower has successfully repaid the loan.",
      };
    default:
      return {
        color: "#000000",
        tooltipContent: "Unknown loan status.",
      };
  }
}

interface LoanStatusProps {
  status: LoanStatus;
  loading: boolean;
}

const LoanStatusComponent: React.FC<LoanStatusProps> = ({
  status,
  loading,
}) => {
  const { color, tooltipContent } = getStatusInfo(status);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center">
            {loading ? (
              <Skeleton className="w-16 h-6" />
            ) : (
              <span
                className="mr-2 text-sm font-semibold flex items-center"
                style={{ color: color }}
              >
                <span
                  className="w-[10px] h-[10px] rounded-full inline-block mr-2"
                  style={{ background: color }}
                ></span>
                Status: {status}
              </span>
            )}
            <AlertCircle size={16} />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LoanIdComponent;

// const { data: loandataFromWagmi } = useReadContract({
// 	address: P2PLENDING,
// 	abi: P2PLENDING_ABI,
// 	functionName: "getLoanData",
// 	args: [id as Address],
// });

// console.log({ loandataFromWagmi });

// const lender = loandataFromWagmi && loandataFromWagmi[1];
// const isLender = address && lender && address === lender;
