import { P2PLENDING } from "@/config";
import P2PLendingAbi from "@/config/abi/p2p.json";
import { UserLoan } from "@/lib/types";
import { useMemo } from "react";
import { useReadContract, useReadContracts } from "wagmi";

export function useUserLoans(address: string | undefined) {

	const { data: loanIds } = useReadContract({
		address: P2PLENDING,
		abi: P2PLendingAbi,
		functionName: "getUserLoanIds",
		args: [address],
	});

	const loans = useReadContracts({
		contracts:
		//@ts-expect-error: unknown type
			loanIds?.map((id) => ({
				address: P2PLENDING,
				abi: P2PLendingAbi,
				functionName: "getLoanData",
				args: [id],
			})) ?? [],
	});

	return useMemo(() => {
		if (!loanIds || !loans.data) return null;
		//@ts-expect-error: unknown type
		return loanIds?.map((id, index) => {
			const [borrower, lender, interest, amount, expiry, lockId] = loans.data[
				index
			].result as [string, string, bigint, bigint, bigint, string];
			return {
				id,
				borrower,
				lender,
				interest,
				amount,
				expiry,
				lockId,
			} as UserLoan;
		});
	}, [loanIds, loans.data]);
}
