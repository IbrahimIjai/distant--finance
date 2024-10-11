"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { AccountCollection } from "@/utils/types";
// import { TokenSelector } from "./TokenSelector";
// import { CompleteSelection } from "./CompleteSelection";
// import { NFTCollection } from "@/hook/NftBalance/query";
import { CollectionSelector } from "./collection-selector";
import { useAccount } from "wagmi";
import { useERCZ21Balance } from "@/hooks/wagmi/useERC721Balance";
import { processNFTData } from "@/lib/nft-helpers";
import { RaribleNft } from "@/lib/types";

//

export function LoanRequest() {
	const { address } = useAccount();
	const { data } = useERCZ21Balance(address);
	const processedData = useMemo(() => {
		if (!data) return {};
		return processNFTData(data as RaribleNft[]);
	}, [data]);
	// console.log({ processedData, isLoading, isError, error });
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="w-fit">Request Loan</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<CollectionSelector processedNFTData={processedData} />
			</DialogContent>
		</Dialog>
	);
}
