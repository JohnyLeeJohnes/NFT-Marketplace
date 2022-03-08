const hre = require("hardhat");

async function main() {
    //Deploy Market-contract
    const JohnyMarket = await hre.ethers.getContractFactory("JohnyMarket");
    const JohnyMarketDeploy = await JohnyMarket.deploy();
    await JohnyMarketDeploy.deployed();
    console.log("JohnyMarket deployed to:", JohnyMarketDeploy.address)

    //Deploy Token-contract to Market address
    const Token = await hre.ethers.getContractFactory("Token")
    const TokenDeploy = await Token.deploy(JohnyMarketDeploy.address);
    await TokenDeploy.deployed();
    console.log("Token deployed to:", TokenDeploy.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
