import React, { useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import { useTransactionStore, TransactionType } from "@/store/transactionStore";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Coins, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { P2PLENDING_ABI } from "@/config/abi";
import { P2PLENDING } from "@/config";

interface LendComponentProps {
	loanId: string;
	loanAmount: string;
}

export function LendComponent({ loanId, loanAmount }: LendComponentProps) {
	const [selectedToken, setSelectedToken] = useState<"ETH" | "WETH">("ETH");
	const { address } = useAccount();
	const { data: ethBalance } = useBalance({ address });
	const { data: wethBalance } = useBalance({
		address,
		token: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH address
	});
	const setTransaction = useTransactionStore((state) => state.setTransaction);

	const formatBalance = (balance: bigint | undefined) => {
		return balance ? Number(formatEther(balance)).toFixed(4) : "0.0000";
	};

	const canLendWithToken = (token: "ETH" | "WETH") => {
		const balance = token === "ETH" ? ethBalance?.value : wethBalance?.value;
		return balance !== undefined && balance >= BigInt(loanAmount);
	};

	useEffect(() => {
		const isReady = canLendWithToken(selectedToken);
		setTransaction({
			isReady,
			type: TransactionType.LEND,
			args: [loanId],
			contractAddress: P2PLENDING,
			abi: P2PLENDING_ABI,
			functionName: selectedToken === "WETH" ? "lendInWETH" : "lendInETH",
			value: selectedToken === "ETH" ? loanAmount : undefined,
		});
	}, [selectedToken, loanId, loanAmount, setTransaction, canLendWithToken]);

	return (
		<div className="w-full max-w-md mx-auto space-y-6">
			<div>
				<Alert className="mb-4">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Lending Options</AlertTitle>
					<AlertDescription>
						You can lend using either ETH or WETH for this loan.
					</AlertDescription>
				</Alert>

				<div className="space-y-4">
					<Label className="text-base font-medium">
						Choose Lending Currency
					</Label>
					<RadioGroup
						value={selectedToken}
						onValueChange={(value: "ETH" | "WETH") => setSelectedToken(value)}
						className="grid grid-cols-2 gap-4">
						{["ETH", "WETH"].map((token) => (
							<div key={token}>
								<RadioGroupItem
									value={token}
									id={`token-${token}`}
									className="peer sr-only"
									disabled={!canLendWithToken(token as "ETH" | "WETH")}
								/>
								<Label
									htmlFor={`token-${token}`}
									className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
									<Coins className="mb-3 h-6 w-6" />
									<span className="font-medium">{token}</span>
									<span className="text-sm text-muted-foreground">
										Balance:{" "}
										{formatBalance(
											token === "ETH" ? ethBalance?.value : wethBalance?.value,
										)}
									</span>
								</Label>
							</div>
						))}
					</RadioGroup>
				</div>
			</div>

			{!canLendWithToken(selectedToken) && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Insufficient Balance</AlertTitle>
					<AlertDescription>
						You don&apos;t have enough {selectedToken} to lend for this loan.
					</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
