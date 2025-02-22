import React, { ReactNode, useState } from "react";
import { useTransactionStore } from "@/store/transactionStore";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import confetti from "canvas-confetti";
import {
	TrxTitle,
	useDistantWriteContract,
} from "@/hooks/wagmi/useDistantWriteContract";

interface TransactionDialogProps {
	children: ReactNode;
	trigger: ReactNode;
	title: string;
	description: string;
	trxTitle: TrxTitle;
	confirmButtonText?: string;
}

export function TransactionDialog({
	children,
	trigger,
	title,
	trxTitle,
	description,
	confirmButtonText,
}: TransactionDialogProps) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const {
		isReady,
		args,
		contractAddress,
		abi,
		functionName,
		value,
		resetTransaction,
		setTransaction,
	} = useTransactionStore();

	const {
		write,
		isPending,
		isConfirming,
		isConfirmed,
		isWriteContractError,
		isWaitTrxError,
		reset,
		WriteContractError,
		WaitForTransactionReceiptError,
	} = useDistantWriteContract({
		fn: functionName!,
		trxTitle: trxTitle,
		args,
		abi: abi!,
		contractAddress: contractAddress!,
		value: BigInt(value ?? "0"),
	});

	const handleConfirm = () => {
		write();
	};

	const handleClose = () => {
		resetTransaction();
		reset();
		setIsDialogOpen(false);
	};

	const handleRetry = () => {
		reset();
		write();
	};

	React.useEffect(() => {
		if (isConfirmed) {
			confetti({
				particleCount: 100,
				spread: 70,
				origin: { y: 0.6 },
			});
		}
	}, [isConfirmed]);

	return (
		<Dialog
			open={isDialogOpen}
			onOpenChange={(open) => {
				setIsDialogOpen(open);
				if (open) {
					setTransaction({ isOpen: true });
				} else {
					resetTransaction();
					reset();
				}
			}}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				{isDialogOpen && children}

				<div className="mt-6">
					{isPending || isConfirming ? (
						<Button disabled className="w-full">
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Processing
						</Button>
					) : isConfirmed ? (
						<Button
							onClick={handleClose}
							className="w-full bg-green-500 hover:bg-green-600">
							<CheckCircle2 className="mr-2 h-4 w-4" />
							Done
						</Button>
					) : isWriteContractError || isWaitTrxError ? (
						<>
							<p className="text-red-500 text-sm mb-2">
								{WriteContractError?.message ||
									WaitForTransactionReceiptError?.message ||
									"An error occurred"}
							</p>
							<Button
								onClick={handleRetry}
								variant="destructive"
								className="w-full">
								<XCircle className="mr-2 h-4 w-4" />
								Retry
							</Button>
						</>
					) : isReady ? (
						<Button onClick={handleConfirm} className="w-full">
							{confirmButtonText ?? "Confirm Transaction"}
						</Button>
					) : null}
				</div>
			</DialogContent>
		</Dialog>
	);
}
