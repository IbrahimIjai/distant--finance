import React from "react";
import { LoanRequest } from "./loan-request-dialog";

export default function DashboardAction() {
	return (
		<div
			className={`bg-[url('/images/backgroundImage.png')] lg:col-span-5 h-[300px] text-sm py-[40px] px-[25px] flex flex-col lg:px-8 gap-8 justify-center border-2 border-[#2FC0DB]`}
			// ref={dashRef}
		>
			<div className="flex flex-col">
				<h1 className="text-2xl">Peer to Peer Lending</h1>
				<p className="text-muted-foreground">
					Lock and collateralize your NFT from a collection to request loans
				</p>
			</div>
			<LoanRequest />
		</div>
	);
}
