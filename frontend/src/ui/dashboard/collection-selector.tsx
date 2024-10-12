"use client";

// import { MdKeyboardArrowRight } from "react-icons/md";
// import Img from "@/components/image";
// import { useState, useEffect, useCallback } from "react";
// import { useAccount } from "wagmi";
// import { useQuery } from "@apollo/client";
// import { GET_ACCOUNT_COLLECTION_TOKENS } from "@/utils/queries";
// import { fetchCollection, ipfsUri } sfrom "@/utils";
// import { Skeleton } from "@/components/ui/skeleton";
import ImageCarousel from "@/components/image-carosel";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ERC721, ProcessedNFTData } from "@/lib/types";
import { useNFTStore } from "@/store/selected-nft";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useState } from "react";
import CompletionComponent from "./collection-selector-loan-request";
import { Checker } from "../checkers";
import { Address } from "viem";
import { useAccount } from "wagmi";
import { extractAddress } from "@/lib/nft-helpers";
import { supportedCollections } from "@/config";

// import { useBalanceStore } from "@/store/NFTBalance";
// import {
// 	RaribleNftIdSpliter,
// 	filterSupportedNFTs,
// 	getCollectionBannerImage,
// } from "@/constants/supportedCollection";
// import { NFTCollection } from "@/hook/NftBalance/query";
// import { AccountCollection } from "@/lib/types";

interface CollectionState {
	collectionAddress: Address | null;
	collectionName: string | null;
}
export function CollectionSelector({
	processedNFTData,
}: {
	processedNFTData: ProcessedNFTData;
}) {
	const [selectedCollection, setSelectedCollection] = useState<CollectionState>(
		{
			collectionAddress: null,
			collectionName: null,
		},
	);
	const { selectedNFTs, selectNFT, clearSelectedNFTs, setSelectedNFTContract } =
		useNFTStore();

	const [showCompletion, setShowCompletion] = useState(false);

	const { address } = useAccount();

	const handleCollectionSelect = (
		collectionName: string,
		collectionAddress: Address,
	) => {
		const extractedCollectionAddress = extractAddress(collectionAddress);
		console.log({ extractedCollectionAddress });
		setSelectedCollection({
			collectionAddress: extractedCollectionAddress as Address,
			collectionName,
		});
		setSelectedNFTContract(extractedCollectionAddress as Address);
		clearSelectedNFTs();
	};

	const handleNFTSelect = (nft: ERC721) => {
		selectNFT(nft);
	};

	const handleBack = () => {
		setSelectedCollection({ collectionAddress: null, collectionName: null });
		setSelectedNFTContract(null);
		clearSelectedNFTs();
	};

	const handleProceed = () => {
		// selectNFTs(selectedNFTs);
		setShowCompletion(true);
	};

	if (showCompletion) {
		return <CompletionComponent onBack={() => setShowCompletion(false)} />;
	}

	return (
		<div className="flex flex-col gap-3 w-full">
			<aside>
				<h1 className="text-xl font-semibold">
					{selectedCollection.collectionName
						? `NFTs in ${selectedCollection.collectionName}`
						: "My NFT Collections"}
				</h1>
				<span className="text-muted-foreground text-xs">
					{selectedCollection.collectionName
						? "Select the NFTs you wish to collateralize"
						: "Select the collection you wish to collateralize"}
				</span>
				{!selectedCollection.collectionName && (
					<div className=" flex items-start text-primary gap-1">
						<Info className="w-4 h-4" />
						<span className="text-xs ">
							Note that the NFTs here are filtered and only the distant finance
							supported NFTs will be displayed
						</span>
					</div>
				)}
			</aside>
			<ScrollArea className="flex flex-col w-full h-[380px] ">
				{selectedCollection.collectionName ? (
					<>
						<Button
							variant="ghost"
							onClick={handleBack}
							className="flex items-center mb-4 text-primary text-xs font-medium">
							<ChevronLeft className="w-4 h-4 mr-1" />
							Back to Collections
						</Button>
						{processedNFTData[selectedCollection.collectionName].nfts.map(
							(nft) => (
								<div
									key={nft.tokenId}
									className={`flex justify-between gap-6 my-2 w-full items-center p-3 border rounded cursor-pointer ${
										selectedNFTs.some(
											(selectedNFT) => selectedNFT.tokenId === nft.tokenId,
										)
											? "border-primary"
											: "border-[#022a32]"
									}`}
									onClick={() => handleNFTSelect(nft)}>
									<div className="flex gap-4">
										<div className="w-[40px] h-[40px] relative overflow-hidden rounded">
											<ImageCarousel
												images={nft.imageUrl}
												width={40}
												height={40}
												className="rounded"
											/>
										</div>
										<div className="flex flex-col">
											<p className="text-sm">Token ID: {nft.tokenId}</p>
										</div>
									</div>
									{selectedNFTs.some(
										(selectedNFT) => selectedNFT.tokenId === nft.tokenId,
									) && (
										<span className="text-primary text-xs font-semibold border p-2 rounded-md">
											unSelected
										</span>
									)}
								</div>
							),
						)}
					</>
				) : (
					Object.entries(processedNFTData).map(
						([collectionName, collectionData]) => {
							console.log({
								address: extractAddress(collectionData.collectionAddress),
							});
							const addressToCheck = extractAddress(
								collectionData.collectionAddress,
							);

							if (
								supportedCollections
									.map((item) => item.toLocaleLowerCase())
									.includes(addressToCheck.toLocaleLowerCase())
							)
								return (
									<div
										key={collectionName}
										className="flex justify-between gap-6 my-2 w-full items-center p-3 border rounded border-[#022a32] cursor-pointer"
										onClick={() =>
											handleCollectionSelect(
												collectionName,
												collectionData.collectionAddress,
											)
										}>
										<div className="flex gap-4">
											<div className="w-[40px] h-[40px] relative overflow-hidden rounded">
												<ImageCarousel
													images={collectionData.nfts.map(
														(nft) => nft.imageUrl[0],
													)}
													width={40}
													height={40}
													className="rounded"
												/>
											</div>
											<div className="flex flex-col">
												<p className="text-sm">{collectionName}</p>
												<span className="text-xs text-primary">
													{collectionData.nftsCount}{" "}
													{collectionData.nftsCount > 1 ? "NFTs" : "NFT"}{" "}
													Available
												</span>
											</div>
										</div>
										<ChevronRight className="w-4 h-4" />
									</div>
								);
						},
					)
				)}
			</ScrollArea>

			{selectedCollection.collectionAddress && (
				<Checker.Connect>
					<Checker.ApprovalERC721
						collectionAddress={selectedCollection.collectionAddress}
						address={address!}>
						<Button onClick={handleProceed}>Proceed</Button>
					</Checker.ApprovalERC721>
				</Checker.Connect>
			)}
		</div>
	);
}
