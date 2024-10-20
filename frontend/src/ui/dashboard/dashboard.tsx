"use client";

import CustomConnectButton from "@/components/wagmi/custom-connect-button";
import React from "react";
import { useAccount } from "wagmi";
import DashboardAction from "./dashboard-action";
import { LoanActivitiesTab } from "./activity-section/activity-tabs";
import NFTBalancePanel from "./nft-balance-panel";

export default function DashboardMain() {
	const { isConnected } = useAccount();
	return (
		<div className="w-full max-w-7xl mx-auto px-5 min-h-screen mt-32 flex flex-col items-center justify-center ">
			{isConnected ? (
				<div className="w-full flex flex-col gap-8">
					<DashboardAction />
					<NFTBalancePanel />
					<LoanActivitiesTab />
				</div>
			) : (
				<div className="flex flex-col w-full text-center border  border-primary/30 rounded-lg p-32 items-center gap-6 justify-center">
					<h1 className="text-lg lg:text-2xl font-semibold w-full">
						Please click below to connect your wallet and access your Dashboard
					</h1>
					<CustomConnectButton />
				</div>
			)}
		</div>
	);
}
