import React, { useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import { formatEther, Address } from "viem";
import { useTransactionStore, TransactionType } from "@/store/transactionStore";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { P2PLENDING_ABI } from "@/config/abi";
import { Coins, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useForm, Controller } from "react-hook-form";

interface BidComponentProps {
	loanId: string;
	loanAmount: string;
	contractAddress: Address;
}

const presetInterestRates = [
	{ value: "10500", label: "105%" },
	{ value: "11000", label: "110%" },
	{ value: "11500", label: "115%" },
	{ value: "12000", label: "120%" },
];

interface BidFormData {
	interestRate: string;
	selectedToken: "ETH" | "WETH";
}

export function BidComponent({
	loanId,
	loanAmount,
	contractAddress,
}: BidComponentProps) {
	const { address } = useAccount();
	const { data: ethBalance } = useBalance({ address });
	const { data: wethBalance } = useBalance({
		address,
		token: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
	});
	const setTransaction = useTransactionStore((state) => state.setTransaction);

	const { control, watch } = useForm<BidFormData>({
		defaultValues: {
			interestRate: "10500",
			selectedToken: "ETH",
		},
	});

	const interestRate = watch("interestRate");
	const selectedToken = watch("selectedToken");

	useEffect(() => {
		const isReady = interestRate !== "" && selectedToken !== undefined;
		setTransaction({
			isReady,
			type: TransactionType.BID,
			args: [Number(interestRate), loanId],
			contractAddress,
			abi: P2PLENDING_ABI,
			functionName: selectedToken === "WETH" ? "bidInWETH" : "bidInETH",
			value: selectedToken === "ETH" ? loanAmount : null,
		});
	}, [interestRate, selectedToken, loanId, contractAddress, setTransaction]);

	const formatInterestRate = (rate: string) => {
		return `${(Number(rate) / 100).toFixed(2)}%`;
	};

	const formatBalance = (balance: bigint | undefined) => {
		return balance ? Number(formatEther(balance)).toFixed(4) : "0.0000";
	};

	const canBidWithToken = (token: "ETH" | "WETH") => {
		const balance = token === "ETH" ? ethBalance?.value : wethBalance?.value;
		return balance !== undefined && balance >= BigInt(loanAmount);
	};

	return (
		<div className="w-full mx-auto">
			<div className="space-y-6">
				<div className="space-y-4">
					<Label className="text-base font-medium flex items-center justify-between">
						Proposed Interest Rate
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Info className="w-4 h-4 text-muted-foreground" />
								</TooltipTrigger>
								<TooltipContent>
									<p>Select your proposed interest rate for this loan</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</Label>
					<Controller
						name="interestRate"
						control={control}
						render={({ field }) => (
							<RadioGroup
								onValueChange={field.onChange}
								value={field.value}
								className="flex flex-row flex-wrap gap-4">
								{presetInterestRates.map((rate) => (
									<div key={rate.value}>
										<RadioGroupItem
											value={rate.value}
											id={`rate-${rate.value}`}
											className="peer sr-only"
										/>
										<Label
											htmlFor={`rate-${rate.value}`}
											className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
											{rate.label}
										</Label>
									</div>
								))}
								<div>
									<RadioGroupItem
										value="custom"
										id="rate-custom"
										className="peer sr-only"
									/>
									<Label
										htmlFor="rate-custom"
										className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
										Custom
									</Label>
								</div>
							</RadioGroup>
						)}
					/>
				</div>

				{interestRate === "custom" && (
					<div className="space-y-4">
						<Controller
							name="interestRate"
							control={control}
							render={({ field }) => (
								<Slider
									min={10000}
									max={20000}
									step={100}
									value={[Number(field.value)]}
									onValueChange={(value) => field.onChange(value[0].toString())}
									className="my-6"
								/>
							)}
						/>
						<div className="flex justify-between text-sm text-muted-foreground">
							<span>100%</span>
							<span>200%</span>
						</div>
					</div>
				)}

				<div className="bg-primary/10 p-4 rounded-lg text-center">
					<h3 className="text-sm mb-2">Selected Interest Rate</h3>
					<div className="text-2xl font-bold text-primary flex items-center justify-center">
						{formatInterestRate(interestRate)}
					</div>
				</div>

				<div className="space-y-2">
					<Label className="text-base font-medium flex items-center justify-between">
						Select Lending Currency
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Info className="w-4 h-4 text-muted-foreground" />
								</TooltipTrigger>
								<TooltipContent>
									<p>Choose the currency you want to lend with</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</Label>
					<Controller
						name="selectedToken"
						control={control}
						render={({ field }) => (
							<div className="grid grid-cols-2 gap-4">
								{["ETH", "WETH"].map((token) => (
									<Button
										key={token}
										variant={field.value === token ? "default" : "outline"}
										className="w-full h-auto py-2 px-4 flex flex-col items-center justify-center"
										onClick={() => field.onChange(token)}
										disabled={!canBidWithToken(token as "ETH" | "WETH")}>
										<Coins className="w-5 h-5 mb-1" />
										<span className="font-medium">{token}</span>
										<span className="text-sm text-muted-foreground">
											{formatBalance(
												token === "ETH"
													? ethBalance?.value
													: wethBalance?.value,
											)}{" "}
											{token}
										</span>
									</Button>
								))}
							</div>
						)}
					/>
				</div>
			</div>
		</div>
	);
}
