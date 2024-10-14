"use client"

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import {
	RaribleTokenDetails,
	useTokenDetails,
} from "@/hooks/useERC721TokenDetails";
import { Address } from "viem";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

interface NFTCardProps {
	children: React.ReactNode;
	onSendToBack: () => void;
}

function NFTCard({ children, onSendToBack }: NFTCardProps) {
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const rotateX = useTransform(y, [-100, 100], [60, -60]);
	const rotateY = useTransform(x, [-100, 100], [-60, 60]);

	function handleDragEnd(
		_: MouseEvent | TouchEvent | PointerEvent,
		info: PanInfo,
	) {
		const threshold = 180;
		if (
			Math.abs(info.offset.x) > threshold ||
			Math.abs(info.offset.y) > threshold
		) {
			onSendToBack();
		} else {
			x.set(0);
			y.set(0);
		}
	}

	return (
		<motion.div
			className="absolute h-64 w-64 cursor-grab"
			style={{ x, y, rotateX, rotateY }}
			drag
			dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
			dragElastic={0.6}
			whileTap={{ cursor: "grabbing" }}
			onDragEnd={handleDragEnd}>
			{children}
		</motion.div>
	);
}

interface NFTSwipeableCardsProps {
	collectionAddress: Address;
	nftIds: number[];
}

type TokenDetailType = { raribleDetails: RaribleTokenDetails } | undefined;

export default function NFTSwipeableCards({
	collectionAddress,
	nftIds,
}: NFTSwipeableCardsProps) {
	const {
		data: tokenDetails,
		isLoading,
		isError,
	} = useTokenDetails({ collectionAddress, nftIds });
	const [cards, setCards] = useState<
		Array<{ id: number; imageUrl: string; name: string }>
	>([]);

	useEffect(() => {
		if (tokenDetails) {
			const newCards = tokenDetails
				.filter(
					(detail): detail is NonNullable<TokenDetailType> =>
						detail !== undefined && detail.raribleDetails !== undefined,
				)
				.map((detail, index) => ({
					id: nftIds[index],
					imageUrl: detail.raribleDetails.imageUrl,
					name: detail.raribleDetails.name,
				}));
			setCards(newCards);
		}
	}, [tokenDetails, nftIds]);

	const sendToBack = (id: number) => {
		setCards((prev) => {
			const newCards = [...prev];
			const index = newCards.findIndex((card) => card.id === id);
			const [card] = newCards.splice(index, 1);
			newCards.unshift(card);
			return newCards;
		});
	};

	if (isLoading) {
		return <Skeleton className="h-72 w-60 rounded-lg" />;
	}

	if (isError) {
		return <div>Error loading NFT details</div>;
	}

	return (
		<div className="relative h-64 w-64" style={{ perspective: 600 }}>
			{cards.map((card, index) => (
				<NFTCard key={card.id} onSendToBack={() => sendToBack(card.id)}>
					<motion.div
						className="h-full w-full rounded-lg shadow-lg"
						animate={{
							rotateZ: (cards.length - index - 1) * 2,
							scale: 1 - index * 0.05,
							zIndex: cards.length - index,
						}}
						initial={false}
						transition={{ type: "spring", stiffness: 300, damping: 20 }}>
						<Card className="h-full w-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-gray-700">
							<CardContent className="p-0 h-full relative">
								<div className="absolute inset-0 bg-black bg-opacity-40 z-10"></div>
								<img
									src={card.imageUrl}
									alt={card.name}
									className="h-full w-full object-cover"
								/>
								<div className="absolute top-0 left-0 right-0 p-3 z-20">
									<Badge
										variant="secondary"
										className="text-xs font-semibold mb-1">
										{/* {card.collectionName} */}
										{card.name}
									</Badge>
								</div>
								<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 z-20">
									<p className="text-white text-2xl font-bold">#{card.id}</p>
								</div>
								
							</CardContent>
						</Card>
					</motion.div>
				</NFTCard>
			))}
		</div>
	);
}
