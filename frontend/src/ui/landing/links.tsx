"use client";

import { images } from "./ads";
import OverlappingImage from "@/components/overlapping-image";

import usdt from "../../../public/images/overlappingImages/usdt.png";
// import areth from "../../../public/images/overlappingImages/areth.png";
import weth from "../../../public/images/overlappingImages/weth.jpg";
import eth from "../../../public/images/overlappingImages/eth.jpg";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const coin_imageArr = [eth, usdt, weth];
const arr = [
	{
		cardTtitle: "Lock your NFTs as collateral ",
		btnText: "Request a Loan",
		imageArr: images,
		link: "/dashboard",
	},
	{
		cardTtitle: "Create Bids or Fund Loan Requests",
		btnText: "Fund Loan Requests",
		imageArr: coin_imageArr,
		link: "/loans",
	},
];

export default function ClickLinks() {
	const { push } = useRouter();
	return (
		<div className="w-full text-white px-[5%] flex flex-col md:flex-row gap-6 lg:flex-row justify-center lg:justify-between my-8">
			{arr.map((card, i) => {
				return (
					<div
						key={i}
						className="bg-[#030D0F] lg:w-[45%] rounded-[1rem] p-4 flex flex-col items-center justify-center gap-4 flex-1">
						<p className="text-[1.2rem]">{card.cardTtitle}</p>
						<div className="flex gap-2 items-center justify-center w-full">
							<Button
								variant={i === 0 ? "outline" : "default"}
								onClick={() => push(card.link)}>
								{card.btnText}
							</Button>
							<OverlappingImage imageArray={card.imageArr} size={40} />
						</div>
					</div>
				);
			})}
		</div>
	);
}
