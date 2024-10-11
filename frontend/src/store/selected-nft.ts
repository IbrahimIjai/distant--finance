import { ERC721 } from "@/lib/types";
import { create } from "zustand";

interface NFTStore {
	selectedNFTs: ERC721[];
	selectNFT: (nft: ERC721) => void;
	clearSelectedNFTs: () => void;
}

export const useNFTStore = create<NFTStore>((set) => ({
	selectedNFTs: [],
	selectNFT: (nft) =>
		set((state) => {
			const index = state.selectedNFTs.findIndex(
				(selectedNFT) => selectedNFT.tokenId === nft.tokenId,
			);
			if (index > -1) {
				return {
					selectedNFTs: state.selectedNFTs.filter((_, i) => i !== index),
				};
			} else {
				return { selectedNFTs: [...state.selectedNFTs, nft] };
			}
		}),
	clearSelectedNFTs: () => set({ selectedNFTs: [] }),
}));
