import { Button } from "@/components/ui/button";
import { useERC721Approval } from "@/hooks/wagmi/useAssetsAllowances";
import { useDistantWriteContract } from "@/hooks/wagmi/useDistantWriteContract";
import React, { ReactNode } from "react";
import { Address, erc721Abi } from "viem";

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
	const {
		data: isApproved,
		isLoading,
		isSuccess,
		isError,
		error,
	} = useERC721Approval(collectionAddress, address);

	console.log({ approvalerror: error, isError });

	const {
		write: approveForAll,
		isPending,
		isConfirming,
		// isWriteContractError,
		// WriteContractError,
	} = useDistantWriteContract({
		fn: "setApprovalForAll",
		trxTitle: "Creating Approval for all Tokens in the selected collection",
		args: [address, true], // The arguments for setApprovalForAll
		abi: erc721Abi,
		contractAddress: collectionAddress,
	});

	const handleApprove = () => {
		approveForAll();
	};

	if (isLoading) {
		return (
			<Button variant="secondary" disabled className="w-full">
				Loading...
			</Button>
		);
	}

	if (isSuccess && isApproved) {
		return <>{children}</>;
	}

	return (
		<div className="w-full">
			{!isApproved && isSuccess && (
				<Button
					onClick={handleApprove}
					disabled={isPending || isConfirming}
					className="w-full">
					{isPending || isConfirming ? "Approving..." : "Approve for all"}
				</Button>
			)}
			{/* {isWriteContractError && (
				<p>Error: {WriteContractError?.message || "Failed to approve"}</p>
			)} */}
		</div>
	);
}
