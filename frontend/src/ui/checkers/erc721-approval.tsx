import { Button } from "@/components/ui/button";
import { useERC721Approval } from "@/hooks/wagmi/useAssetsAllowances";
import React, { ReactNode } from "react";
import { Address } from "viem";

export default function Approval({
	children,
	address,
	collectionAddress,
}: {
	children: ReactNode;
	collectionAddress: Address;
	address: Address;
}) {
	const { data, isLoading, isSuccess } = useERC721Approval(
		address,
		collectionAddress,
	);

	if (isLoading) {
		return (
			<Button variant="secondary" disabled>
				Loading...
			</Button>
		);
	}
	if (isSuccess && data) {
		return <>{children}</>;
	}
	return <div>{!data && isSuccess && <Button>Approve for all</Button>}</div>;
}
