"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { AccountCollection } from "@/utils/types";
// import { TokenSelector } from "./TokenSelector";
// import { CompleteSelection } from "./CompleteSelection";
// import { NFTCollection } from "@/hook/NftBalance/query";
import { CollectionSelector } from "./collection-selector";

//

export function LoanRequest() {
	const [state, setState] = useState(0);
	// const [tokens, setTokens] = useState<number[]>([]);
	// const [collection, setCollection] = useState<AccountCollection>();
	// const [collection, setCollection] = useState<NFTCollection>();

	// const [collectionImages, setCollectionImages] = useState<string[]>([]);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="w-fit">Request Loan</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md h-[90%] lg:h-[500px]">
				{state == 0 && (
					<CollectionSelector
					// setState={setState}
					// setCollection={setCollection}
					// collectionImages={collectionImages}
					// setCollectionImages={setCollectionImages}n
					/>
				)}
				<div className={`${state == 0 ? "inline-flex" : "hidden"}`}></div>
				{/* {state == 1 && (
					<TokenSelector
						setState={setState}
						// collection={collection as AccountCollection}
						collection={collection as NFTCollection}
						setTokens={setTokens}
						tokens={tokens}
					/>
				)} */}
				{/* {state == 2 && collection && (
          <CompleteSelection
            setState={setState}
            tokens={tokens}
            collection={collection as AccountCollection}
            setTokens={setTokens}
          />
        )} */}
				{/* <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
           
          </DialogClose>
        </DialogFooter> */}
			</DialogContent>
		</Dialog>
	);
}
