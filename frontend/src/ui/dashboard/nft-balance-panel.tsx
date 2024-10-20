import React, { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useERCZ21Balance } from "@/hooks/wagmi/useERC721Balance";
import { extractNFTData } from "@/lib/nft-helpers";
import { RaribleNft, ERC721 } from "@/lib/types";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function NFTBalancePanel() {
	const { address } = useAccount();
	const { data, isLoading, isError, error } = useERCZ21Balance(address);
	const [searchTerm, setSearchTerm] = useState("");

	const processedNFTs = useMemo(() => {
		if (!data) return [];
		return data.map((nft: RaribleNft) => extractNFTData(nft));
	}, [data]);

	const filteredNFTs = useMemo(() => {
		return processedNFTs.filter(
			(nft: ERC721) =>
				nft.collectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				nft.tokenId.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [processedNFTs, searchTerm]);

	const formatTokenId = (tokenId: string): string => {
		return tokenId.length > 4 ? `${tokenId.slice(0, 4)}...` : tokenId;
	};

	if (isError) {
		return (
			<Card className="h-[400px] flex items-center justify-center">
				<CardContent>
					<p className="text-center text-red-500">
						Error loading NFTs: {error?.message}
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center gap-5 justify-between">
				<CardTitle className="whitespace-nowrap text-base">
					Your NFTs {!isLoading && `(${filteredNFTs.length})`}
				</CardTitle>
				<div className="relative w-64">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search NFTs"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-8"
					/>
				</div>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{isLoading
						? Array(6)
								.fill(0)
								.map((_, index) => (
									<div
										key={index}
										className="flex items-center space-x-4 p-2 border rounded-lg">
										<Skeleton className="h-16 w-16 rounded-full" />
										<div className="space-y-2">
											<Skeleton className="h-4 w-[150px]" />
											<Skeleton className="h-4 w-[100px]" />
										</div>
									</div>
								))
						: filteredNFTs.map((nft: ERC721) => (
								<div
									key={nft.tokenId}
									className="flex items-center space-x-4 p-2 border rounded-lg">
									<Avatar className="h-16 w-16">
										<AvatarImage
											src={nft.imageUrl[0]}
											alt={nft.collectionName}
										/>
										<AvatarFallback>
											{nft.collectionName.slice(0, 2)}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="font-semibold text-sm ">
											{nft.collectionName}
										</p>
										<p className="text-sm text-muted-foreground">
											Token ID: {formatTokenId(nft.tokenId)}
										</p>
									</div>
								</div>
						  ))}
				</div>
			</CardContent>
		</Card>
	);
}
