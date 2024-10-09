import Img from "@/components/image";
// import { useQuery } from "@apollo/client";
// import { GET_TOP_COLLECTIONS } from "@/utils/queries";
// import { capKey } from "@/utils";
// import NFTCardSkeleton from "@/components/Skeletons/NFTCardSkeleton";
// import { ProtocolStatistics, TopCollectionClass } from "@/utils/classes";
// import { TopCollectionType } from "@/utils/types";
import { top_collection } from "@/lib/tempdata";
import Marquee from "react-fast-marquee";

export default function TopCollections() {
	// if (loading)
	// 	return (
	// 		<div className="flex gap-4 w-full overflow-x-auto noScrollbar px-[5%]">
	// 			{[1, 2, 3, 4].map((num) => (
	// 				<NFTCardSkeleton key={num} />
	// 			))}
	// 		</div>
	// 	);
	// if (error)
	// 	return <p className="w-full text-center">Error: {error.message} :(</p>;

	return (
		<div className="w-full mb-4 px-[5%] gap-4 flex flex-col text-[#D5F2F8] items-center">
			<h1 className="font-bold text-2xl">Top Collections</h1>
			<div className="text-white w-full">
				<Marquee className="">
					{top_collection.map((data) => (
						<CollectionCard data={data} key={data.id} />
					))}
				</Marquee>
			</div>
		</div>
	);
}

//@ts-expect-error:temp ignoring types
function CollectionCard({ data }) {
	const { image, loanStatistic, name } = data;

	return (
		<div className="flex items-center bg-[#00090B] rounded-2xl border border-[#022A32] p-4 mx-2">
			<div className="w-full relative flex flex-col gap-5">
				<div className="relative w-[280px] h-[250px] rounded-lg overflow-hidden">
					<Img src={image} fit="cover" />
				</div>
				<div
					className="absolute top-[220px] left-1/2 w-[90%] rounded-lg"
					style={{
						translate: "-50%",
						background:
							"linear-gradient(92.82deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 98.56%)",
						backdropFilter: "blur(6px)",
					}}>
					<p className="w-full py-3 text-center bg-gray-500/10 text-xl font-[500] rounded-md backdrop-blur-sm">
						{name}
					</p>
				</div>
				<div className="w-full flex flex-col">
					{Object.entries(loanStatistic).map(([key, value], i) => (
						<div key={i}>
							<div className="flex items-center justify-between" key={i}>
								<p>{`${key}:`}</p>
								<p>{value as string}</p>
							</div>
							{i !== 4 && <Line />}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export function Line() {
	return (
		<span className="w-full block h-[1px] bg-[#022A32] my-[6px] border"></span>
	);
}
