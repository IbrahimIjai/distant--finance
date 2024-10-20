import React, { ReactNode, useEffect } from "react";
import { Address, erc20Abi } from "viem";
import { Button } from "@/components/ui/button";
import { P2PLENDING, WETH } from "@/config";
import { useDistantWriteContract } from "@/hooks/wagmi/useDistantWriteContract";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useReadContract } from "wagmi";

export interface ApprovalERC20Props {
	children: ReactNode;
	tokenAddress?: Address;
	spenderAddress?: Address;
	amount: bigint;
}

export function ApprovalERC20({
	children,
	tokenAddress = WETH,
	spenderAddress = P2PLENDING,
	amount,
}: ApprovalERC20Props) {
	const { toast } = useToast();
	const { address: ownerAddress } = useAccount();

	const { allowance, isLoading, isSuccess, isError, error, refetch } =
		useERC20Allowance(tokenAddress, ownerAddress, spenderAddress);

	const {
		write: approve,
		isPending,
		isConfirming,
		isConfirmed,
		isWriteContractError,
		WriteContractError,
		reset: resetApproval,
	} = useDistantWriteContract({
		fn: "approve",
		trxTitle: "Approving ERC20 Token",
		args: [spenderAddress, amount],
		abi: erc20Abi,
		contractAddress: tokenAddress,
	});

	useEffect(() => {
		if (isConfirmed) {
			refetch();
		}
	}, [isConfirmed, refetch]);

	useEffect(() => {
		if (isError || isWriteContractError) {
			toast({
				variant: "destructive",
				title: "Approval Error",
				description:
					error?.message ||
					WriteContractError?.message ||
					"An error occurred while checking or setting approval.",
			});
		}
	}, [isError, isWriteContractError, error, WriteContractError, toast]);

	const handleApprove = () => {
		approve();
	};

	const handleRetry = () => {
		resetApproval();
		refetch();
	};

	if (isLoading) {
		return (
			<Button variant="secondary" disabled className="w-full">
				<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				Fetching Allowance...
			</Button>
		);
	}

	if (isSuccess && allowance !== undefined && allowance >= amount) {
		return <>{children}</>;
	}

	return (
		<div className="w-full">
			<Button
				onClick={isError || isWriteContractError ? handleRetry : handleApprove}
				disabled={isPending || isConfirming}
				className="w-full">
				{isPending || isConfirming ? (
					<>
						<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						Approving...
					</>
				) : isError || isWriteContractError ? (
					"Retry Approval"
				) : (
					"Approve"
				)}
			</Button>
		</div>
	);
}
export const useERC20Allowance = (
	tokenAddress: Address,
	ownerAddress: Address | undefined,
	spenderAddress: Address,
) => {
	const { data, isLoading, isSuccess, isError, error, refetch } =
		useReadContract({
			address: tokenAddress,
			abi: erc20Abi,
			functionName: "allowance",
			args: [ownerAddress as Address, spenderAddress],
		});

	return {
		allowance: data as bigint | undefined,
		isLoading,
		isSuccess,
		isError,
		error,
		refetch,
	};
};
