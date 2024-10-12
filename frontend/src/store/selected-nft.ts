import { ERC721 } from "@/lib/types";
import { Address } from "viem";
import { create } from "zustand";

interface NFTStore {
	selectedNFTs: ERC721[];
	selectedNFTContract: Address | null;
	selectNFT: (nft: ERC721) => void;
	clearSelectedNFTs: () => void;
	setSelectedNFTContract: (address: Address | null) => void;
}

export const useNFTStore = create<NFTStore>((set) => ({
	selectedNFTs: [],
	selectedNFTContract: null,
	selectNFT: (nft) =>
		set((state) => ({
			selectedNFTs: state.selectedNFTs.some(
				(selectedNFT) => selectedNFT.tokenId === nft.tokenId,
			)
				? state.selectedNFTs.filter(
						(selectedNFT) => selectedNFT.tokenId !== nft.tokenId,
				  )
				: [...state.selectedNFTs, nft],
		})),
	clearSelectedNFTs: () => set({ selectedNFTs: [] }),
	setSelectedNFTContract: (address) => set({ selectedNFTContract: address }),
}));
