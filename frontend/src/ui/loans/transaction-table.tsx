import React, { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { slice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type Transaction = {
	id: string;
	maker: string;
	time: string;
	type: "lend" | "bid" | "repay" | "default";
};

const transactions: Transaction[] = [
	{
		id: "1",
		maker: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
		time: "2024-03-15 10:30",
		type: "lend",
	},
	{
		id: "2",
		maker: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
		time: "2024-03-15 11:45",
		type: "bid",
	},
	{
		id: "3",
		maker: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
		time: "2024-03-15 13:20",
		type: "repay",
	},
	{
		id: "4",
		maker: "0x2546BcD3c84621e976D8185a91A922aE77ECEc30",
		time: "2024-03-15 14:55",
		type: "default",
	},
	{
		id: "5",
		maker: "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E",
		time: "2024-03-15 16:10",
		type: "lend",
	},
];

const getBadgeStyles = (type: Transaction["type"]) => {
	switch (type) {
		case "lend":
			return "bg-blue-100 text-blue-800";
		case "bid":
			return "bg-green-100 text-green-800";
		case "repay":
			return "bg-purple-100 text-purple-800";
		case "default":
			return "bg-red-100 text-red-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

export default function TransactionTable() {
	const [filter, setFilter] = useState<string>("all");

	const filteredTransactions = transactions.filter((tx) =>
		filter === "all" ? true : tx.type === filter,
	);

	return (
		<div className="p-4 space-y-4 border bg-card rounded-lg">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold">Transactions</h2>
				<div className="flex space-x-2">
					<Select onValueChange={(value) => setFilter(value)}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Filter by type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Types</SelectItem>
							<SelectItem value="lend">Lend</SelectItem>
							<SelectItem value="bid">Bid</SelectItem>
							<SelectItem value="repay">Repay</SelectItem>
							<SelectItem value="default">Default</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="text-muted-foreground">
							Transaction Type
						</TableHead>
						<TableHead className="text-muted-foreground">Maker</TableHead>

						<TableHead className="text-muted-foreground">Time</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{filteredTransactions.map((tx) => (
						<TableRow key={tx.id} className="cursor-pointer">
							<TableCell className="font-medium">
								<Badge className={`${getBadgeStyles(tx.type)} capitalize`}>
									{tx.type}
								</Badge>
							</TableCell>
							<TableCell className="font-medium">{slice(tx.maker)}</TableCell>
							<TableCell>{tx.time}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
