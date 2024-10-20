import Link from "next/link";
import React, { useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BalancePanel from "./balance-panel";
import { useERCZ21Balance } from "@/hooks/wagmi/useERC721Balance";
import { useAccount } from "wagmi";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { ERC721, RaribleNft } from "@/lib/types";
import { extractNFTData } from "@/lib/nft-helpers";
// import { Skeleton } from "@/components/ui/skeleton";
// const loading = false;
// const mockNFTCollections = [
// 	{ collectionName: "Cool Cats", userNFTs: { length: 3 } },
// 	{ collectionName: "Bored Apes", userNFTs: { length: 1 } },
// 	{ collectionName: "Doodles", userNFTs: { length: 2 } },
// 	{ collectionName: "Azuki", userNFTs: { length: 5 } },
// ];
const mockLoanInfo = {
	activeLoans: { length: 2 },
	activeLends: { length: 1 },
	pendingLoans: 3,
	pendingBids: { length: 4 },
};

interface NFTRowProps {
	nft: ERC721;
}
const NFTRow: React.FC<NFTRowProps> = ({ nft }) => {
	return (
		<div className="flex items-center justify-between p-3 border-b">
			<div className="flex items-center space-x-3">
				<Avatar className="h-10 w-10 border border-primary/20">
					{/* eslint-disable-next-line  @next/next/no-img-element */}
					<img
						src={nft.imageUrl[0] || "/placeholder-image.jpg"}
						alt={nft.collectionName}
						className="object-cover"
					/>
				</Avatar>
				<div>
					<p className="font-medium text-sm">{nft.collectionName}</p>
					<p className="text-[10px] text-muted-foreground">
						Token ID: {nft.tokenId}
					</p>
				</div>
			</div>
			<div></div>
		</div>
	);
};

interface NFTListProps {
	nfts: ERC721[] | undefined;
	isLoading: boolean;
	isError: boolean;
	error: Error | null;
}

const NFTList: React.FC<NFTListProps> = ({
	nfts,
	isLoading,
	isError,
	error,
}) => {
	if (isLoading) {
		return Array(3)
			.fill(0)
			.map((_, index) => (
				<div key={index} className="flex items-center space-x-4 p-3">
					<Skeleton className="h-12 w-12 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-4 w-[200px]" />
						<Skeleton className="h-4 w-[150px]" />
					</div>
				</div>
			));
	}

	if (isError) {
		return <div className="text-red-500">Error: {error?.message}</div>;
	}

	if (!nfts || nfts.length === 0) {
		return <div className="text-gray-500">No NFTs found</div>;
	}

	return (
		<ScrollArea className="h-[300px] w-full">
			{nfts.map((nft) => (
				<NFTRow key={nft.tokenId} nft={nft} />
			))}
		</ScrollArea>
	);
};
export default function Overview() {
	const { address } = useAccount();
	const { data, isLoading, isError, error } = useERCZ21Balance(address);
	// console.log({ address, data, isError, error, isLoading });

	// console.log({ grabbingNft: data[1].meta });

	const processedNFTs = useMemo(() => {
		if (!data) return [];
		return data.map((nft: RaribleNft) => extractNFTData(nft));
	}, [data]);

	return (
		<div className="border-[#2FC0DB] border lg:col-span-3 flex flex-col items-center p-4">
			<BalancePanel />
			<Tabs defaultValue="nfts" className="w-full ">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="nfts">
						Your NFTs{" "}
						{data && (
							<Badge className="rounded-full h-4 w-4 justify-center ml-2">
								<span className=" rounded-full  text-white p-1 text-xs">
									{data.length}
								</span>
							</Badge>
						)}
					</TabsTrigger>
					<TabsTrigger value="overview">Transaction Overview</TabsTrigger>
				</TabsList>
				<TabsContent value="nfts">
					<NFTList
						nfts={processedNFTs}
						isLoading={isLoading}
						isError={isError}
						error={error as Error}
					/>
				</TabsContent>
				<TabsContent value="overview">
					<div className="w-full">
						<p className="mb-3">Loan Info:</p>
						<div className="mx-2 flex flex-col w-full gap-2">
							<Values
								title="Active Loans"
								value={`${mockLoanInfo.activeLoans.length}`}
							/>
							<Values
								title="Active Lends"
								value={`${mockLoanInfo.activeLends.length}`}
							/>
							<Values
								title="Pending Loans"
								value={`${mockLoanInfo.pendingLoans}`}
							/>
							<Values
								title="Pending Bids"
								value={`${mockLoanInfo.pendingBids.length}`}
							/>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}

const Values = ({
	title,
	value,
	link,
}: {
	title: string;
	value: string;
	link?: string;
}) => {
	return (
		<div>
			<div className="flex justify-between w-full">
				<span>{title}</span>
				<Link href={link ?? ""}>{value}</Link>
			</div>
		</div>
	);
};
