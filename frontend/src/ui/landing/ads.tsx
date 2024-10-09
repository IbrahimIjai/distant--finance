"use client";

import { Button } from "@/components/ui/button";
import ads from "../../../public/images/ads.png";
import ads1 from "../../../public/images/ads1.png";
import ads2 from "../../../public/images/ads2.webp";
import ads3 from "../../../public/images/ads3.avif";
import ads4 from "../../../public/images/ads4.png";
import ads5 from "../../../public/images/ads5.png";
import OverlappingImage, { ImageProp } from "@/components/overlapping-image";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Ads() {
	const { push } = useRouter();
	return (
		<div className="text-[#D5F2F8] mt-[10vh] flex flex-col gap-6 px-[5%]">
			<div className="bg-[#030D0F] rounded-xl flex flex-col lg:flex-row items-center justify-between lg:justify-between lg:px-6 py-4 px-2">
				<div className="flex flex-col lg:flex-row items-center gap-4 justify-center">
					<div className="relative w-[140px] h-[140px]">
						<Image
							src={ads}
							fill
							style={{ objectFit: "contain" }}
							alt="image"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<h1 className="text-[1.3rem]">Short on Liquidity?</h1>
							<OverlappingImage imageArray={images} size={40} />
						</div>
						<p className="text-[#68787B]">
							Lock and Collateralize your NFTs for Liquidity
						</p>
					</div>
				</div>
				<div className="mt-4 lg:mt-0">
					<Button
						onClick={() =>
							push("https://docs.distant.finance/our-products/lending")
						}>
						Get started
					</Button>
				</div>
			</div>
		</div>
	);
}

export const images: ImageProp[] = [
	{ src: ads1 },
	{ src: ads2 },
	{ src: ads3 },
	{ src: ads4 },
	{ src: ads5 },
];
