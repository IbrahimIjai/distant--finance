import Image from "next/image";
export interface ImageProp {
	src: string;
	fit?: "cover";
}
export default function Img({ src, fit }: ImageProp) {
	// console.log("this is nft banner image url", src);
	return (
		<Image
			src={src}
			fill
			style={{ objectFit: fit ? fit : "contain" }}
			alt="image"
		/>
	);
}
