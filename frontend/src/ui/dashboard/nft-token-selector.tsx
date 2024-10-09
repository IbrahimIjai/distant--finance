import styles from "../../../styles/styles.module.css";
import Paragraphs from "@/components/Components/Paragraphs";
import Headers from "@/components/Components/Headers";
import Span from "@/components/Components/Span";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { CheckboxIcon } from "@radix-ui/react-icons";
import { RiCheckboxBlankLine } from "react-icons/ri";
import Img from "@/components/Components/Image";
// import { AccountCollection } from "@/utils/types";
// import { LockedToken } from "@/utils/classes";
// import {
// 	decimalToBigInt,
// 	fetchCollection,
// 	imageWrap,
// 	ipfsUri,
// 	stripHexPrefix,
// } from "@/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { NFTCollection } from "@/hook/NftBalance/query";

interface stateSetter {
	setState: (state: number) => void;
}

interface TokenSelectorProps extends stateSetter {
	setTokens: Function;
	tokens: number[];
	// collection: AccountCollection;
	collection: NFTCollection;
}

export function TokenSelector({
	setState,
	setTokens,
	tokens,
	collection,
}: TokenSelectorProps) {
	// let {
	//   collection: { tokens: collectionTokens, image, name },
	// } = collection;

	// const { tokenId, imageUrl, collectionName, collectionAddress } =
	//   collection.userNFTs;

	// collectionTokens = collectionTokens.map((token) => new LockedToken(token));

	// let selectAll = () => {
	//   if (tokens.length === collectionTokens.length) return setTokens([]);
	//   setTokens(collectionTokens.map((token) => token.tokenId));
	// };

	const selectAll = () => {};
	return (
		<div className="mt-3">
			<aside className="mb-1">
				<Headers content="My NFT Collections" classes="!text-[1.2rem]" />
				<Span content="Select the NFTs for your loan collateral" />
			</aside>
			<aside className={styles.collectionTokensCard}>
				<div
					className="flex justify-between p-3 border border-[#022a32] rounded"
					onClick={() => setState(0)}
					style={{
						cursor: "pointer",
						border: "none",
						borderBottom: "1px solid #022A32",
						borderRadius: "0",
						paddingTop: "0",
					}}>
					<div className="flex gap-2 items-center">
						<div className="w-[40px] h-[40px] relative overflow-hidden rounded">
							<Img src={""} fit="cover" />
						</div>
						<Paragraphs
							content={collection.collectionName}
							classes="!leading-none"
						/>
					</div>
					<MdKeyboardArrowLeft size={30} color="white" />
				</div>
				<div
					className="w-full text-[#2fc0db] text-right py-2 cursor-pointer"
					onClick={selectAll}>
					Select all
				</div>
				<ScrollArea className="flex flex-col mb-3 gap-2 h-[75%] lg:h-[200px] overflow-y-hidden">
					{collection.userNFTs.map(
						({
							tokenId,
							imageUrl,
							collectionName,
							collectionAddress,
							metaData,
						}) => (
							<div className={styles.tokenCard} key={tokenId}>
								<div className="flex gap-2 items-center">
									<div className="w-[40px] h-[40px] relative overflow-hidden rounded">
										<Img src={imageUrl[0]} fit="cover" />
									</div>
									<Paragraphs content={collectionName} classes="!text-[1rem]" />
									{collectionName} -- #{tokenId}
								</div>
								<span>
									{tokens.includes(Number(tokenId)) ? (
										<CheckboxIcon
											style={{ cursor: "pointer" }}
											width="1.25rem"
											height="1.25rem"
											color="white"
											onClick={() => {
												console.log(tokenId);
												let _tokens = tokens.filter(
													(token) => token !== Number(tokenId),
												);
												setTokens(_tokens);
											}}
										/>
									) : (
										<RiCheckboxBlankLine
											style={{
												cursor: "pointer",
												width: "1.25rem",
												height: "1.25rem",
											}}
											color="white"
											onClick={() =>
												setTokens((tokensArr: number[]) => [
													...tokensArr,
													Number(tokenId),
												])
											}
										/>
									)}
								</span>
							</div>
						),
					)}
				</ScrollArea>
			</aside>
			{tokens.length > 0 && (
				<Button className="w-full mt-2" onClick={() => setState(2)}>
					Proceed
				</Button>
			)}
		</div>
	);
}
