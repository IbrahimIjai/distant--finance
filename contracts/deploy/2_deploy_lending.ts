import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";

const func: DeployFunction = async function ({
  ethers,
  getNamedAccounts,
  deployments,
}: // getChainId,
HardhatRuntimeEnvironment) {
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  // TODO
  // 1. edit tokenlocker and marketplace address
  //2. admin address should not be deployer

  //Base WETH  address is the same address for both mainnet and testnet
  // https://docs.base.org/docs/base-contracts/#base-mainnet
  const base_weth = "0x4200000000000000000000000000000000000006";

  const tokenLocker = await ethers.getContract("TokenLockerContract", deployer);

  console.log("verify tokenLocker contracts", tokenLocker.address);

  const distantFinance = await ethers.getContract("DistantFinance", deployer);

  console.log("verify distantFinance contracts", distantFinance.address);

  await deploy("P2PLending", {
    from: deployer,
    args: [tokenLocker.address, base_weth, distantFinance.address],
    log: true,
    // deterministicDeployment: false,
    autoMine: true,
  });
};

func.tags = ["P2PLending", "P2P"];
export default func;
