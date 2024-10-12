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

  const distantFinance = await ethers.getContract("DistantFinance", deployer);

  //checks
  console.log("verify protocol contracts", distantFinance.address);

  await deploy("TokenLockerContract", {
    from: deployer,
    args: [distantFinance.address],
    log: true,
    // deterministicDeployment: false,
    autoMine: true,
  });
};

func.tags = ["TokenLockerContract", "TLC"];
export default func;
