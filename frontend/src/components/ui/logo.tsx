import Image from "next/image";

export function Logo() {
	return (
		<div className="relative h-16 w-16">
			<Image src="/logo.png" alt="logo" style={{ objectFit: "contain" }} fill />
		</div>
	);
}
