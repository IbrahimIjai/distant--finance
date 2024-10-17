import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

interface Transaction {
	id: string;
	amount: string;
	interest: number;
	txId: string;
	txType: string;
}

const staticTransactions: Transaction[] = [
	{
		id: "0x1234...5678",
		amount: "1.5",
		interest: 5,
		txId: "0xabcd...ef01",
		txType: "Borrow",
	},
	{
		id: "0x2345...6789",
		amount: "2.0",
		interest: 6,
		txId: "0xbcde...f012",
		txType: "Lend",
	},
	{
		id: "0x3456...7890",
		amount: "3.5",
		interest: 4,
		txId: "0xcdef...0123",
		txType: "Repay",
	},
	{
		id: "0x4567...8901",
		amount: "1.0",
		interest: 7,
		txId: "0xdefg...1234",
		txType: "Liquidate",
	},
	{
		id: "0x5678...9012",
		amount: "2.5",
		interest: 5,
		txId: "0xefgh...2345",
		txType: "Borrow",
	},
];

interface RecentTransactionsProps {
	height?: number;
}

export function RecentTransactions({ height = 400 }: RecentTransactionsProps) {
	return (
		<div className="w-full max-w-4xl mx-auto bg-black border border-cyan-600 rounded-lg overflow-hidden">
			<div className="border-b border-cyan-900 sticky top-0 left-0 bg-black z-10">
				<h2 className="text-xl font-semibold p-4 text-white">
					Loan Transactions
				</h2>
			</div>
			<div className="overflow-x-auto" style={{ maxHeight: `${height}px` }}>
				<table className="w-full text-sm text-left text-gray-300">
					<thead className="text-xs uppercase bg-gray-900 text-gray-400 sticky top-0">
						<tr>
							<th scope="col" className="px-6 py-3">
								Loan ID
							</th>
							<th scope="col" className="px-6 py-3">
								Amount (ETH)
							</th>
							<th scope="col" className="px-6 py-3">
								APR
							</th>
							<th scope="col" className="px-6 py-3">
								Type
							</th>
							<th scope="col" className="px-6 py-3">
								Tx
							</th>
						</tr>
					</thead>
					<tbody>
						{staticTransactions.map((tx) => (
							<tr
								key={tx.id}
								className="border-b border-gray-800 hover:bg-gray-900">
								<td className="px-6 py-4 font-medium text-cyan-500">
									<Link href={`/loans/${tx.id}`} className="hover:underline">
										{tx.id}
									</Link>
								</td>
								<td className="px-6 py-4">{tx.amount}</td>
								<td className="px-6 py-4">{tx.interest}%</td>
								<td className="px-6 py-4">{tx.txType}</td>
								<td className="px-6 py-4">
									<Link
										href={`https://etherscan.io/tx/${tx.txId}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-cyan-500 hover:text-cyan-400">
										<ExternalLink className="h-4 w-4" />
										<span className="sr-only">
											View transaction on Etherscan
										</span>
									</Link>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
