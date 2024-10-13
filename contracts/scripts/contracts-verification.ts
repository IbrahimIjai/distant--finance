// import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers, getNamedAccounts } from "hardhat";

export const supportedCollections = [
  "0x7bc1c072742d8391817eb4eb2317f98dc72c61db", //base colors(COLORS),

  "0xb5f58fe2fdd79b279bf2b201f91ba784b79c8744", //Wearables (WEARABLE)

  "0x2A9c7559B075d9fFd7Aa70E6Dfa383AC6C2D8d1C", //Rising Tides Lift All Boats (RTLAB)

  "0x479ad14Bd2e2D84Da77276F6eaB89Ad8E078497d", //Base OnChain Punks (BOCP)
];

const royaltyFees = "2";

const func = async function () {
  const { deployer } = await getNamedAccounts();
  const distantFinance = await ethers.getContract("DistantFinance", deployer);
  const tokenLocker = await ethers.getContract("TokenLockerContract", deployer);
  const p2pLending = await ethers.getContract("P2PLending", deployer);
  console.log("this is contracts", { tokenLocker, p2pLending });
  //checks
  console.log("verify protocol contracts", distantFinance.address);

  await distantFinance.addProtocol(tokenLocker.address, "tokenLocker", royaltyFees, royaltyFees);
  await distantFinance.addProtocol(p2pLending.address, "p2plending", royaltyFees, royaltyFees);
  await distantFinance.addProtocol(deployer, "me", royaltyFees, royaltyFees);

  const protocol1 = await distantFinance.isSupportedProtocol(tokenLocker.address);
  const protocol2 = await distantFinance.isSupportedProtocol(p2pLending.address);
  const protocol3 = await distantFinance.isSupportedProtocol(deployer);
  console.log({ protocol1, protocol2, protocol3 });
};

func();
