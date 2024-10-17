"use client";

import CustomConnectButton from "@/components/wagmi/custom-connect-button";
import React from "react";
import { useAccount } from "wagmi";
import DashboardAction from "./dashboard-action";
import Overview from "./overview-root";
import { TabsContainer } from "./activity-section/activity-tabs";
import { useQuery } from "@apollo/client";
import { GET_ACCOUNT } from "@/lib/gql-queries";
import { RecentTransactions } from "./user-transactions-history";

export default function DashboardMain() {
	const { isConnected, address } = useAccount();
	return (
		<div className="w-full max-w-7xl mx-auto px-5 min-h-screen pt-24 flex flex-col items-center justify-center ">
			{isConnected ? (
				<div className="w-full flex flex-col gap-4">
					<div className=" gap-8 w-full  grid lg:grid-cols-8">
						<DashboardAction />
						<Overview />
					</div>

					<TabsContainer />
					<RecentTransactions />
				</div>
			) : (
				<div className="flex flex-col text-center border  border-primary/30 rounded-lg p-32 items-center gap-6 justify-center">
					<h1 className="text-2xl font-semibold">
						Please click below to connect your wallet and access your Dashboard
					</h1>
					<CustomConnectButton />
				</div>
			)}
		</div>
	);
}
