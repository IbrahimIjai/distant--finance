import Link from "next/link";
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BalancePanel from "./balance-panel";
// import { Skeleton } from "@/components/ui/skeleton";
// const loading = false;
const mockNFTCollections = [
	{ collectionName: "Cool Cats", userNFTs: { length: 3 } },
	{ collectionName: "Bored Apes", userNFTs: { length: 1 } },
	{ collectionName: "Doodles", userNFTs: { length: 2 } },
	{ collectionName: "Azuki", userNFTs: { length: 5 } },
];
const mockLoanInfo = {
	activeLoans: { length: 2 },
	activeLends: { length: 1 },
	pendingLoans: 3,
	pendingBids: { length: 4 },
};

export default function Overview() {
	return (
		<div className="border-[#2FC0DB] border lg:col-span-3 flex flex-col items-center p-4">
			<BalancePanel />
			<Tabs defaultValue="nfts" className="w-full ">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="nfts">Your NFTs</TabsTrigger>
					<TabsTrigger value="overview">Transaction Overview</TabsTrigger>
				</TabsList>
				<TabsContent value="nfts">
					<ScrollArea className="flex flex-col relative items-center justify-center gap-3 px-4 h-[150px]">
						{mockNFTCollections.map((collection) => (
							<div
								key={collection.collectionName}
								className="text-sm m-2 border-b flex items-center justify-between p-3">
								<div className="flex items-start gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round">
										<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
										<polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
										<line x1="12" y1="22.08" x2="12" y2="12"></line>
									</svg>
									<p className="font-bold">{collection.collectionName}</p>
								</div>
								<p>{collection.userNFTs.length}</p>
							</div>
						))}
					</ScrollArea>
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
