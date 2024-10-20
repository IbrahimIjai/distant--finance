"use client";

import React from "react";

import { useAccount, useBalance } from "wagmi";
import { LoanRequest } from "./loan-request-dialog";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { WETH } from "@/config";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatUnits } from "viem";

const fetchEthPrice = async () => {
	const response = await fetch(
		"https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
	);
	const data = await response.json();
	return data.ethereum.usd;
};

export default function DashboardAction() {
	const { address } = useAccount();
	const {
		data: ethBalance,
		isLoading: ethLoading,
		isError: ethError,
	} = useBalance({
		address,
		// watch: true,
	});

	const {
		data: wethBalance,
		isLoading: wethLoading,
		isError: wethError,
	} = useBalance({
		address,
		token: WETH,
		// watch: true,
	});

	const { data: ethPrice, isLoading: priceLoading } = useQuery({
		queryKey: ["ethPrice"],
		queryFn: fetchEthPrice,
		refetchInterval: 60000,
	});

	const isLoading = ethLoading || wethLoading || priceLoading;
	const isError = ethError || wethError;
	console.log({ isError });

	const ethBalanceFormatted = ethBalance
		? parseFloat(formatUnits(ethBalance.value, ethBalance.decimals)).toFixed(7)
		: "0";
	const wethBalanceFormatted = wethBalance
		? parseFloat(formatUnits(wethBalance.value, wethBalance.decimals)).toFixed(
				7,
		  )
		: "0";
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			<Card className="lg:col-span-2">
				<CardHeader>
					<CardTitle>Peer to Peer Lending</CardTitle>
					<CardDescription>
						Lock and collateralize your NFT from a collection to request loans
					</CardDescription>
				</CardHeader>
				<CardContent>
					<LoanRequest />
				</CardContent>
			</Card>
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="text-semibold">Wallet Balance</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-3">
							<Avatar className="w-4 h-4">
								<AvatarImage
									src="/images/overlappingImages/eth.jpg"
									alt="ETH"
								/>
								<AvatarFallback>ETH</AvatarFallback>
							</Avatar>
							<span>ETH</span>
						</div>
						<div className="text-sm">
							{isLoading ? (
								<Skeleton className="w-24 h-5" />
							) : (
								<span>
									{ethBalanceFormatted} ~ $
									{ethPrice
										? (parseFloat(ethBalanceFormatted) * ethPrice).toFixed(2)
										: "0.00"}
								</span>
							)}
						</div>
					</div>
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-3">
							<Avatar className="w-4 h-4">
								<AvatarImage
									src="/images/overlappingImages/weth.jpg"
									alt="WETH"
								/>
								<AvatarFallback>WETH</AvatarFallback>
							</Avatar>
							<span>WETH</span>
						</div>
						<div className="text-sm">
							{isLoading ? (
								<Skeleton className="w-24 h-5" />
							) : (
								<span>
									{wethBalanceFormatted} ~ $
									{ethPrice
										? (parseFloat(wethBalanceFormatted) * ethPrice).toFixed(2)
										: "0.00"}
								</span>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
