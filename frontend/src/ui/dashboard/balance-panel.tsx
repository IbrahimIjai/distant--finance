"use client";
import { useAccount, useBalance, useToken } from "wagmi";
import { formatUnits } from "viem";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { WETH } from "@/config";
import { useQuery } from "@tanstack/react-query";

const fetchEthPrice = async () => {
	const response = await fetch(
		"https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
	);
	const data = await response.json();
	return data.ethereum.usd;
};

interface BalanceDisplayProps {
	symbol: string;
	balance: string;
	price: number | undefined;
	avatarSrc: string;
}
const BalanceDisplay = ({
	symbol,
	balance,
	price,
	avatarSrc,
}: BalanceDisplayProps) => (
	<div className="flex gap-2 items-center">
		<Avatar className="w-4 h-4">
			<AvatarImage src={avatarSrc} alt={symbol} />
			<AvatarFallback>{symbol}</AvatarFallback>
		</Avatar>
		<div className="flex items-end flex-col">
			<span>{`${balance} ${symbol}`}</span>
			<span className="font-bold">
				~${price ? (parseFloat(balance) * price).toFixed(2) : "0.00"}
			</span>
		</div>
	</div>
);

export default function BalancePanel() {
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

	const { data: wethData } = useToken({ address: WETH });

	const { data: ethPrice, isLoading: priceLoading } = useQuery({
		queryKey: ["ethPrice"],
		queryFn: fetchEthPrice,
		refetchInterval: 60000,
	});

	const isLoading = ethLoading || wethLoading || priceLoading;
	const isError = ethError || wethError;

	if (isLoading) {
		return (
			<div className="my-6 ml-2">
				<Skeleton className="w-12 h-3" />
				<Skeleton className="w-12 h-3 mt-1" />
			</div>
		);
	}

	if (isError) {
		return (
			<div className="my-6 flex flex-col items-start">
				<span className="text-xs">Error fetching ETH balance</span>
				<span className="text-xs">Error fetching WETH balance</span>
			</div>
		);
	}

	const ethBalanceFormatted = ethBalance
		? parseFloat(formatUnits(ethBalance.value, ethBalance.decimals)).toFixed(7)
		: "0";
	const wethBalanceFormatted = wethBalance
		? parseFloat(formatUnits(wethBalance.value, wethBalance.decimals)).toFixed(
				7,
		  )
		: "0";

	return (
		<div className="my-6">
			<div className="text-xs flex gap-4 items-center">
				<BalanceDisplay
					symbol="ETH"
					balance={ethBalanceFormatted}
					price={ethPrice}
					avatarSrc="/images/overlappingImages/eth.jpg"
				/>
				<BalanceDisplay
					symbol={wethData?.symbol || "WETH"}
					balance={wethBalanceFormatted}
					price={ethPrice}
					avatarSrc="/images/overlappingImages/weth.jpg"
				/>
			</div>
		</div>
	);
}
