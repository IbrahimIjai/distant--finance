import React, { ReactNode, useEffect } from "react";
import { Address, erc721Abi } from "viem";
import { Button } from "@/components/ui/button";
import { TOKENLOCKER } from "@/config";
import { useERC721Approval } from "@/hooks/wagmi/useAssetsAllowances";
import { useDistantWriteContract } from "@/hooks/wagmi/useDistantWriteContract";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface ApprovalERC721Props {
	children: ReactNode;
	collectionAddress: Address;
	address: Address;
}

export function ApprovalERC721({
	children,
	address,
	collectionAddress,
}: ApprovalERC721Props) {
	const { toast } = useToast();

	const {
		data: isApproved,
		isLoading,
		isSuccess,
		isError,
		error,
		refetch,
	} = useERC721Approval(collectionAddress, address);

	const {
		write: approveForAll,
		isPending,
		isConfirming,
		isConfirmed,
		isWriteContractError,
		WriteContractError,
		reset: resetApproval,
	} = useDistantWriteContract({
		fn: "setApprovalForAll",
		trxTitle: "Creating Approval for all Tokens in the selected collection",
		args: [TOKENLOCKER, true],
		abi: erc721Abi,
		contractAddress: collectionAddress,
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
		approveForAll();
	};

	const handleRetry = () => {
		resetApproval();
		refetch();
	};

	if (isLoading) {
		return (
			<Button variant="secondary" disabled className="w-full">
				<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				Fetching Approval Info...
			</Button>
		);
	}

	if (isSuccess && isApproved) {
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
					"Approve for all"
				)}
			</Button>
		</div>
	);
}
