// import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers, getNamedAccounts } from "hardhat";
const nftContractAddress = "0x479ad14Bd2e2D84Da77276F6eaB89Ad8E078497d";
const tokenId = 8641;
// const id = "0x22efa2dd3f4734e14541708e40bdefd32a0fde80d4297e2493649a629538d100";
const func = async function () {
  const { deployer } = await getNamedAccounts();
  const tokenLocker = await ethers.getContract("TokenLockerContract", deployer);

  await tokenLocker.recueWithdraw(tokenId, nftContractAddress);
};

func();
