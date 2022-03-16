const hre = require("hardhat");
const fs = require('fs');
const envfile = require('envfile')
const sourcePath = '.env'

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

    //Write addresses to .env file
    let parsedFile = envfile.parse(fs.readFileSync(sourcePath));
    parsedFile.NEXT_PUBLIC_MARKET_ADDRESS = JohnyMarketDeploy.address
    parsedFile.NEXT_PUBLIC_TOKEN_ADDRESS = TokenDeploy.address
    await fs.writeFileSync('.env', envfile.stringify(parsedFile));
    console.log("Addresses written to .env")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
