"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNFTStore } from "@/store/selected-nft";
import React, { useState } from "react";

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
	const { selectedNFTs } = useNFTStore();
	const [loanData, setLoanData] = useState<LoanData>({
		amount: "",
		interest: "",
		duration: 7,
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setLoanData((prev) => ({ ...prev, [name]: value }));
	};

	const handleDurationChange = (duration: number) => {
		setLoanData((prev) => ({ ...prev, duration }));
	};

	return (
		<div>
			<Button onClick={onBack} variant="outline">
				Back
			</Button>
			<h2 className="text-xl font-bold">Complete Your Loan Request</h2>
			<div>
				<p>Selected NFTs: {selectedNFTs.length}</p>
				{/* You can add more details about selected NFTs here */}
			</div>
			<Input
				name="amount"
				placeholder="Loan Amount (ETH)"
				value={loanData.amount}
				onChange={handleInputChange}
			/>
			<Input
				name="interest"
				placeholder="Interest Rate (%)"
				value={loanData.interest}
				onChange={handleInputChange}
			/>
			<div>
				<p>Loan Duration (days):</p>
				{[7, 14, 30, 60, 90].map((day) => (
					<Button
						key={day}
						onClick={() => handleDurationChange(day)}
						variant={loanData.duration === day ? "default" : "outline"}
						className="mr-2 mb-2">
						{day}
					</Button>
				))}
			</div>
		</div>
	);
}
