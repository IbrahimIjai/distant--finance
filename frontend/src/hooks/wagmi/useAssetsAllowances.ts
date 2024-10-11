import { TOKENLOCKER, WETH } from "@/config";
import { useReadContract } from "wagmi";
import { useEffect, useState } from "react";
import { Address, erc20Abi, erc721Abi } from "viem";
import { utils } from "ethers";

export function bigIntToDecimal(weiValue: bigint) {
	const etherValue = utils.formatEther(weiValue.toString());
	return Number(etherValue);
}
export default function GetBalanceAllowance(
	account: Address,
	contract: Address,
) {
	const [balance, setBalance] = useState(0);
	const [allowance, setAllowance] = useState(0);

	const { data: readBalance } = useReadContract({
		address: WETH,
		abi: erc20Abi,
		functionName: "balanceOf",
		args: [account],
	});
	const { data: readAllowance } = useReadContract({
		address: WETH,
		abi: erc20Abi,
		functionName: "allowance",
		args: [account, contract],
	});
	useEffect(() => {
		if (readBalance) {
			setBalance(bigIntToDecimal(readBalance));
		}
		if (readAllowance) {
			setAllowance(bigIntToDecimal(readAllowance));
		}
	}, [readAllowance, readBalance]);
	return { balance, allowance };
}

export function useERC721Approval(collection: Address, account: Address) {
	console.log({ accccoint: account });
	return useReadContract({
		address: collection,
		abi: erc721Abi,
		functionName: "isApprovedForAll",
		args: [account, TOKENLOCKER],
	});
}
