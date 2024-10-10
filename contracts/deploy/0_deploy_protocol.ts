import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/dist/types";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
}: // getChainId,
HardhatRuntimeEnvironment) {
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const protocolFees = 300; // 3%

  // https://docs.base.org/docs/base-contracts/#base-mainnet
  const base_weth = "0x4200000000000000000000000000000000000006";

  await deploy("DistantFinance", {
    from: deployer,
    args: [protocolFees, deployer, base_weth, deployer],
    log: true,
    // deterministicDeployment: false,
    autoMine: true,
  });
};

func.tags = ["DistantFinance", "DF"];

export default func;
