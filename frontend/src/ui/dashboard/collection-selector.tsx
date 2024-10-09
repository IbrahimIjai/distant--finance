// import { MdKeyboardArrowRight } from "react-icons/md";
// import Img from "@/components/image";
// import { useState, useEffect, useCallback } from "react";
// import { useAccount } from "wagmi";
// import { useQuery } from "@apollo/client";
// import { GET_ACCOUNT_COLLECTION_TOKENS } from "@/utils/queries";
// import { fetchCollection, ipfsUri } from "@/utils";
// import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
// import { useBalanceStore } from "@/store/NFTBalance";
// import {
// 	RaribleNftIdSpliter,
// 	filterSupportedNFTs,
// 	getCollectionBannerImage,
// } from "@/constants/supportedCollection";
// import { NFTCollection } from "@/hook/NftBalance/query";
// import { AccountCollection } from "@/lib/types";

const mockCollections = [
	{
		id: "1",
		name: "Cool Cats",
		tokenCount: 3,
		image: "/api/placeholder/40/40",
	},
	{
		id: "2",
		name: "Bored Apes",
		tokenCount: 1,
		image: "/api/placeholder/40/40",
	},
	{ id: "3", name: "Doodles", tokenCount: 2, image: "/api/placeholder/40/40" },
	{ id: "4", name: "Azuki", tokenCount: 5, image: "/api/placeholder/40/40" },
];
// interface stateSetter {
// 	setState: (state: number) => void;
// }

// interface CollectionSelectorProps extends stateSetter {
// 	setCollection: () => void;
// 	setCollectionImages: () => void;
// 	collectionImages: string[];
// }

// export function CollectionSelector({
// 	setState,
// 	setCollection,
// 	setCollectionImages,
// 	collectionImages,
// }: CollectionSelectorProps) {
export function CollectionSelector() {
	const [selectedCollection, setSelectedCollection] = useState(null);

	const handleCollectionSelect = (collection) => {
		setSelectedCollection(collection);
		// setCollection(collection);
		// setState(1);
	};
	console.log(selectedCollection);
	// const [_accountCollection, setAccountCollection] = useState<
	// 	AccountCollection[]
	// >([]);
	// const { address } = useAccount();
	// const { data, error, loading } = useQuery(GET_ACCOUNT_COLLECTION_TOKENS, {
	// 	variables: { account: address?.toLowerCase() },
	// });

	// useEffect(() => {
	// 	// data && data.account == null && setAccountCollection([]);
	// 	data &&
	// 		data.account &&
	// 		setAccountCollection(data.account.accountCollection);
	// 	if (data && _accountCollection?.length > 0) {
	// 		fetchCollectionData();
	// 	}
	// }, [data, loading]);

	// console.log("checking for missing metadata", data);

	// function selectedCollection(collection: AccountCollection, i: number) {
	//   const updatedCollection = {
	//     ...collection,
	//     collection: {
	//       ...collection.collection,
	//       image: collectionImages[i],
	//     },
	//   };
	//   setCollection(updatedCollection);
	//   setState(1);
	// }
	// function selectedCollectionNew(collection: NFTCollection, i: number) {
	// 	// const updatedCollection = {
	// 	//   ...collection,
	// 	//   collection: {
	// 	//     ...collection.collection,
	// 	//     image: collectionImages[i],
	// 	//   },
	// 	// };
	// 	setCollection(collection);
	// 	setState(1);
	// }

	// accountCollection = data && data.account && data.account.accountCollection;

	// let collections: string[] =
	// 	data && data.account !== null
	// 		? _accountCollection.map((collection) => collection.collection.id)
	// 		: [];

	// const fetchCollectionData = useCallback(async () => {
	// 	if (_accountCollection.length === collectionImages.length) return;
	// 	const fetchPromises = collections.map(async (collection) => {
	// 		const collData = await fetchCollection(collection);
	// 		let image = ipfsUri(collData.placeholder);
	// 		setCollectionImages((images: string[]) => [...images, image]);
	// 	});
	// 	await Promise.all(fetchPromises);
	// }, [_accountCollection]);

	// const userNftList = useBalanceStore((state) => state.user_nft_balance);

	// console.log("this zustand collection with no filter", userNftList);
	// console.log(
	// 	"this is nfts from zustand store filtered collections",
	// 	filterSupportedNFTs(userNftList),
	// );
	return (
		<div className="flex flex-col gap-3 w-full">
			<aside>
				<h1 className="text-2xl">My NFT Collections</h1>
				<span className="text-muted-foreground">
					Select the collection you wish to collateralize
				</span>
			</aside>
			<ScrollArea className="flex flex-col w-full h-[380px]">
				{mockCollections.map((collection) => (
					<div
						key={collection.id}
						className="flex justify-between my-2 w-full items-center p-3 border rounded border-[#022a32] cursor-pointer"
						onClick={() => handleCollectionSelect(collection)}>
						<div className="flex gap-4">
							<div className="w-[40px] h-[40px] relative overflow-hidden rounded">
								<img
									src={collection.image}
									alt={collection.name}
									className="object-cover w-full h-full"
								/>
							</div>
							<div className="flex flex-col">
								<p>{collection.name}</p>
								<span className="text-[12px] text-[#2FC0DB]">
									{collection.tokenCount}{" "}
									{collection.tokenCount > 1 ? "NFTs" : "NFT"} Available
								</span>
							</div>
						</div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round">
							<polyline points="9 18 15 12 9 6"></polyline>
						</svg>
					</div>
				))}
			</ScrollArea>
		</div>
		// <div className="flex flex-col gap-3 w-full ">
		// 	<aside>
		// 		<h1 className="text-2xl">My NFT Collections</h1>
		// 		<span className="text-muted-foreground">
		// 			Select the collection you wish to collateralize
		// 		</span>
		// 	</aside>
		// 	<ScrollArea className="flex flex-col placeholder:w-full h-[75%] lg:h-[380px]">
		// 		{data && !data?.account && (
		// 			<div className="h-full w-full flex items-center flex-col p-4 gap justify-center">
		// 				<p>No NFT Found</p>
		// 				<p>Buy Here</p>
		// 			</div>
		// 		)}
		// 		{loading && (
		// 			<div className="">
		// 				{Array.from({ length: 6 }, (_, i) => i + 1).map((i, key) => {
		// 					return (
		// 						<div key={key} className="flex items-start my-2 gap-2">
		// 							<Skeleton className="h-12 w-12" />
		// 							<div className="flex pt-3 flex-col items-start justify-between gap-2 w-full">
		// 								{" "}
		// 								<Skeleton className="h-3 w-full" />
		// 								<Skeleton className="h-3 w-[60%]" />
		// 							</div>
		// 						</div>
		// 					);
		// 				})}
		// 			</div>
		// 		)}
		// 		{error && (
		// 			<div className="h-full w-full flex items-center justify-center">
		// 				<p>Sorry, An error occured while fetching your NFTs.</p>
		// 			</div>
		// 		)}
		// 		{
		// 			data && data?.account && data?.account == null ? (
		// 				<>
		// 					<div>No NFT Found in this account</div>
		// 				</>
		// 			) : (
		// 				filterSupportedNFTs(userNftList).length > 0 &&
		// 				filterSupportedNFTs(userNftList).map((collection, i) => {
		// 					const contractAddress = RaribleNftIdSpliter(
		// 						collection.collectionAddress,
		// 					);
		// 					return (
		// 						<div
		// 							className="flex justify-between my-2 w-full items-center p-3 border rounded border-[#022a32]"
		// 							key={i}
		// 							onClick={() => selectedCollectionNew(collection, i)}
		// 							style={{ cursor: "pointer" }}>
		// 							<div className="flex gap-4">
		// 								<div className="w-[40px] relative overflow-hidden rounded">
		// 									<Img
		// 										src={getCollectionBannerImage(
		// 											contractAddress.contractAddress,
		// 										)}
		// 										fit="cover"
		// 									/>
		// 								</div>
		// 								<div className="flex flex-col">
		// 									<p>{collection.collectionName}</p>
		// 									<span
		// 										className="text-[12px]"
		// 										style={{ color: "#2FC0DB" }}>
		// 										{collection.userNFTs.length}{" "}
		// 										{collection.userNFTs.length > 1 ? "NFTs" : "NFT"}{" "}
		// 										Available
		// 									</span>
		// 								</div>
		// 							</div>
		// 							<MdKeyboardArrowRight color="white" />
		// 						</div>
		// 					);
		// 				})
		// 			)
		// 			// (
		// 			//   _accountCollection.length > 0 &&
		// 			//   _accountCollection.map(({ collection, tokenCount }, i) => (
		// 			//     <div
		// 			//       className="flex justify-between my-2 w-full items-center p-3 border rounded border-[#022a32]"
		// 			//       key={i}
		// 			//       onClick={() => selectedCollection(_accountCollection[i], i)}
		// 			//       style={{ cursor: "pointer" }}
		// 			//     >
		// 			//       <div className="flex gap-2">
		// 			//         <div className="w-[40px] relative overflow-hidden rounded">
		// 			//           <Img src={imageWrap(collectionImages[i])} fit="cover" />
		// 			//         </div>
		// 			//         <div className="flex flex-col">
		// 			//           <Paragraphs
		// 			//             content={collection.name}
		// 			//             classes="!leading-none"
		// 			//           />
		// 			//           <span className="text-[12px]" style={{ color: "#2FC0DB" }}>
		// 			//             {tokenCount} {tokenCount > 1 ? "NFTs" : "NFT"} Available
		// 			//           </span>
		// 			//         </div>
		// 			//       </div>
		// 			//       <MdKeyboardArrowRight color="white" />
		// 			//     </div>
		// 			//   ))
		// 			// )
		// 		}

		// 		{data && data?.account && _accountCollection.length === 0 && (
		// 			<div className="h-full w-full flex items-center justify-center">
		// 				<p>No NFTs found</p>
		// 			</div>
		// 		)}
		// 	</ScrollArea>
		// </div>
	);
}
