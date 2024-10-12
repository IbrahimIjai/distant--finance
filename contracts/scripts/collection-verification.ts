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
  console.log("this is deployer", deployer);
  //checks
  console.log("verify protocol contracts", distantFinance.address);

  await distantFinance.addCollection(supportedCollections[0], deployer, royaltyFees);

  await distantFinance.addCollection(supportedCollections[1], deployer, royaltyFees);

  await distantFinance.addCollection(supportedCollections[2], deployer, royaltyFees);

  await distantFinance.addCollection(supportedCollections[3], deployer, royaltyFees);

  await distantFinance.verifyCollectionStatus(supportedCollections[0], "https://distantfinancev0.vercel.app/");

  await distantFinance.verifyCollectionStatus(supportedCollections[1], "https://distantfinancev0.vercel.app/");

  await distantFinance.verifyCollectionStatus(supportedCollections[2], "https://distantfinancev0.vercel.app/");

  await distantFinance.verifyCollectionStatus(supportedCollections[3], "https://distantfinancev0.vercel.app/");

  const collectionDetails3 = await distantFinance.getCollectionData(supportedCollections[3]);
  const collectionDetails2 = await distantFinance.getCollectionData(supportedCollections[2]);
  const collectionDetails1 = await distantFinance.getCollectionData(supportedCollections[1]);
  const collectionDetails0 = await distantFinance.getCollectionData(supportedCollections[0]);
  console.log({ collectionDetails3, collectionDetails2, collectionDetails1, collectionDetails0 });
};

func();
