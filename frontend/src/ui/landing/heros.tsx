"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

export default function Heros() {
	const { push } = useRouter();
	return (
		<div className="flex bg-background -mt-20 flex-col justify-center lg:justify-start lg:flex-row lg:items-center px-6  py-[5%] dark:bg-[url('/images/gridbackground.png')] will-change-contents w-full min-h-screen bg-cover bg-no-repeat">
			<div className="flex items-center lg:items-start flex-col gap-4 text-center">
				<h2 className="text-3xl fonts-bold lg:text-start">
					Recharge Your NFT Portfolio with Liquidity{" "}
				</h2>
				<p className="font-thin text-muted-foreground lg:text-start ">
					Lock and Collateralize your NFTs to borrow, <br />
					Put your idle assets to work while earning yields in the process
				</p>
				<div className="flex gap-4">
					<Button onClick={() => push("/dashboard")}>Borrow</Button>
					<Button onClick={() => push("/loans")} variant="outline">
						Lend
					</Button>
				</div>
			</div>
		</div>
	);
}
