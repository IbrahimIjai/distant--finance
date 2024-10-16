import React, { useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { formatEther, Address } from "viem";
import { useTransactionStore, TransactionType } from "@/store/transactionStore";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { ToastAction } from "@/components/ui/toast";
import Link from "next/link";
import { P2PLENDING_ABI } from "@/config/abi";
import { useToast } from "@/hooks/use-toast";

interface BidComponentProps {
	loanId: string;
	loanAmount: bigint;
	contractAddress: Address;
}

const presetInterestRates = [
	{ value: "10500", label: "105%" },
	{ value: "11000", label: "110%" },
	{ value: "11500", label: "115%" },
	{ value: "12000", label: "120%" },
];

export function BidComponent({
	loanId,
	loanAmount,
	contractAddress,
}: BidComponentProps) {
	const [interestRate, setInterestRate] = useState("10500");
	const [customRate, setCustomRate] = useState("");
	const [useCustomRate, setUseCustomRate] = useState(false);
	const [useWETH, setUseWETH] = useState(false);
	const { address } = useAccount();
	const { data: ethBalance } = useBalance({ address });
	const { data: wethBalance } = useBalance({
		address,
		token: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
	}); // WETH address
	const setTransaction = useTransactionStore((state) => state.setTransaction);
	const { toast } = useToast();

	const effectiveRate =  interestRate;
	const isHighInterest = Number(effectiveRate) > 15000; // 150%

	const handleSubmit = () => {
		const balance = useWETH ? wethBalance?.value : ethBalance?.value;
		if (!balance || balance < loanAmount) {
			toast({
				title: "Insufficient balance",
				description: `You don't have enough ${
					useWETH ? "WETH" : "ETH"
				} to place this bid.`,
				action: (
					<ToastAction altText="Swap" asChild>
						<Link href="/swap">Swap tokens</Link>
					</ToastAction>
				),
			});
			return;
		}

		setTransaction({
			isOpen: true,
			type: TransactionType.BID,
			args: [effectiveRate, loanId],
			contractAddress,
			abi: P2PLENDING_ABI,
			functionName: useWETH ? "bidInWETH" : "bidInETH",
		});
	};

	return (
		<Card>
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<Label>Token</Label>
					<div className="flex items-center space-x-2">
						<Switch
							checked={useWETH}
							onCheckedChange={setUseWETH}
							id="weth-switch"
						/>
						<Label htmlFor="weth-switch">Use WETH</Label>
					</div>
					<p className="text-sm text-muted-foreground">
						Balance:{" "}
						{formatEther(
							useWETH ? wethBalance?.value || 0n : ethBalance?.value || 0n,
						)}{" "}
						{useWETH ? "WETH" : "ETH"}
					</p>
				</div>

				<div className="space-y-2">
					<Label>Interest Rate</Label>
					<RadioGroup
						value={interestRate}
						onValueChange={setInterestRate}
						className="grid grid-cols-2 gap-4">
						{presetInterestRates.map((rate) => (
							<div key={rate.value}>
								<RadioGroupItem
									value={rate.value}
									id={`rate-${rate.value}`}
									className="peer sr-only"
									disabled={useCustomRate}
								/>
								<Label
									htmlFor={`rate-${rate.value}`}
									className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
									{rate.label}
								</Label>
							</div>
						))}
					</RadioGroup>
				</div>

				<div className="space-y-2">
					<div className="flex items-center space-x-2 mb-6">
						<Switch
							checked={useCustomRate}
							onCheckedChange={setUseCustomRate}
							id="custom-rate-switch"
						/>
						<Label htmlFor="custom-rate-switch">Use custom rate</Label>
					</div>
					{useCustomRate && (
						<div className="space-y-2 my-3">
							<Slider
								min={10000}
								max={20000}
								step={100}
								value={[Number(customRate) || 10000]}
								onValueChange={(value) => setInterestRate(value[0].toString())}
							/>
							<div className="flex justify-between">
								<span>100%</span>
								<span>200%</span>
							</div>
						</div>
					)}
				</div>

				{isHighInterest && (
					<p className="text-yellow-500">
						Warning: High interest rates may be less likely to be accepted by
						borrowers.
					</p>
				)}
			</CardContent>
		</Card>
	);
}
