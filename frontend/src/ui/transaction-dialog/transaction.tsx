import React, { ReactNode } from "react";
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
}

export function TransactionDialog({
	children,
	trigger,
	title,
	trxTitle,
	description,
}: TransactionDialogProps) {
	const {
		isOpen,
		args,
		contractAddress,
		abi,
		functionName,
		setTransaction,
		resetTransaction,
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
	});

	const handleConfirm = () => {
		write();
	};

	const handleClose = () => {
		resetTransaction();
		reset();
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
			open={isOpen}
			onOpenChange={(open) => setTransaction({ isOpen: open })}>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
				</DialogHeader>

				{children}

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
					) : (
						<Button onClick={handleConfirm} className="w-full">
							Confirm Transaction
						</Button>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
