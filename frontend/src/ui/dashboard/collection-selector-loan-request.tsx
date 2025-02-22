"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle, Info, Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNFTStore } from "@/store/selected-nft";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
// import P2P_LENDING_ABI from "@/config/abi/p2p.json";
import { useDistantWriteContract } from "@/hooks/wagmi/useDistantWriteContract";
import { P2PLENDING } from "@/config";
import { Address, parseEther, parseUnits } from "viem";
import { P2PLENDING_ABI } from "@/config/abi";
import confetti from "canvas-confetti";
import { slice } from "@/lib/utils";
interface LoanData {
	amount: string;
	interest: string;
	duration: number;
}

export default function CompletionComponent({
	onBack,
}: {
	onBack: () => void;
}) {
	const { selectedNFTs, selectedNFTContract } = useNFTStore();
	const [loanData, setLoanData] = useState<LoanData>({
		amount: "",
		interest: "",
		duration: 7,
	});
	const {
		write,
		isPending,
		isConfirming,
		isTrxSubmitted,
		isConfirmed,
		WriteContractError,
		reset,
		hash,
		WaitForTransactionReceiptError,
	} = useDistantWriteContract({
		fn: "openContract",
		trxTitle: "Opening Loan Contract",
		args: [
			selectedNFTContract,
			selectedNFTs.map((nft) => BigInt(nft.tokenId)),
			parseEther(loanData.amount || "0"),
			BigInt(loanData.duration),
			parseUnits(loanData.interest || "0", 2),
		],
		abi: P2PLENDING_ABI,
		contractAddress: P2PLENDING,
	});

	console.log({
		WriteContractError,
		WaitForTransactionReceiptError,
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLoanData((prev) => ({ ...prev, [name]: value }));
	};

	const handleDurationChange = (duration: number) => {
		setLoanData((prev) => ({ ...prev, duration }));
	};

	const handleOpenLoan = () => {
		// // Implement loan opening logic here
		// console.log("Opening loan with data:", loanData);
		write();
	};

	const getButtonContent = () => {
		if (isPending || isConfirming) {
			return (
				<>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					Processing...
				</>
			);
		}
		if (isTrxSubmitted && !isConfirmed) {
			return (
				<>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					Confirming...
				</>
			);
		}
		if (isConfirmed) {
			return (
				<>
					<CheckCircle className="mr-2 h-4 w-4" />
					Loan Opened
				</>
			);
		}
		if (WriteContractError || WaitForTransactionReceiptError) {
			return (
				<>
					<XCircle className="mr-2 h-4 w-4" />
					Error, Retry!
				</>
			);
		}
		return "Open Loan";
	};
	const isButtonDisabled =
		!selectedNFTs.length ||
		!loanData.amount ||
		!loanData.interest ||
		isPending ||
		isConfirming;

	useEffect(() => {
		if (isConfirmed) {
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
			});
		}
	}, [isConfirmed]);

	if (isConfirmed) {
		return (
			<Card className="w-full max-w-2xl mx-auto border-none">
				<CardHeader>
					<CardTitle className="text-xl font-bold">
						Loan Request Successful
					</CardTitle>
					<CardDescription className="text-xs">
						Your NFT-backed loan has been successfully opened
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center space-y-4">
					<CheckCircle className="w-16 h-16 text-green-500" />
					<p className="text-center text-wrap">
						Your loan request for {loanData.amount} ETH has been processed
						successfully.
					</p>
					<p className="text-sm text-muted-foreground text-wrap">
						Transaction Hash: {slice(hash as Address)}
					</p>
				</CardContent>
				<CardFooter className="flex justify-center">
					<Button
						onClick={() => {
							onBack();
							reset();
						}}>
						Back to Dashboard
					</Button>
				</CardFooter>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-2xl mx-auto border-none">
			<CardHeader>
				<Button onClick={onBack} variant="ghost" className="mb-2 w-fit ">
					<ArrowLeft className="mr-2 h-4 w-4" /> Back
				</Button>
				<CardTitle className="text-xl font-bold">
					Complete Your Loan Request
				</CardTitle>
				<CardDescription className="text-xs">
					Fill in the details to finalize your NFT-backed loan
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="bg-muted p-4 rounded-md">
					<h3 className="font-semibold mb-2">
						Selected NFTs: {selectedNFTs.length}
					</h3>
					<p className="text-sm text-muted-foreground">
						Youve selected {selectedNFTs.length} NFT
						{selectedNFTs.length !== 1 ? "s" : ""} as collateral for this loan.
					</p>
				</div>

				<div className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="amount">Loan Amount (ETH)</Label>
						<Input
							id="amount"
							name="amount"
							placeholder="0.00"
							value={loanData.amount}
							onChange={handleInputChange}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="interest">Interest Rate (%)</Label>
						<Input
							id="interest"
							name="interest"
							placeholder="0.00"
							value={loanData.interest}
							onChange={handleInputChange}
						/>
					</div>

					<div className="space-y-2">
						<Label>Loan Duration (days)</Label>
						<div className="flex flex-wrap gap-2">
							{[7, 14, 30, 60, 90].map((day) => (
								<Button
									key={day}
									onClick={() => handleDurationChange(day)}
									variant={loanData.duration === day ? "default" : "outline"}>
									{day}
								</Button>
							))}
						</div>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex justify-between items-center">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="outline" size="icon">
								<Info className="h-4 w-4" />
								<span className="sr-only">Loan information</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Review your loan details carefully before proceeding.</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<Button
					onClick={handleOpenLoan}
					className="w-32"
					disabled={isButtonDisabled}>
					{/* {isPending || isConfirming
						? "Processing..."
						: isTrxSubmitted
						? "Confirming..."
						: "Open Loan"} */}
					{getButtonContent()}
				</Button>
			</CardFooter>
		</Card>
	);
}
