require("@nomiclabs/hardhat-waffle");

/*task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});*/

module.exports = {
    network: {
        hardhat: {
            chainId: 1337
        },
        mumbai: {
            url: "https://polygon-mumbai.infura.io/v3/44c7220a91f547cb81c8905063bccee1",
            accounts: []
        },
        mainnet: {
            url: "https://polygon-mainnet.infura.io/v3/44c7220a91f547cb81c8905063bccee1",
            accounts: []
        }
    },
    solidity: {
        version: "0.8.4",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    }
};
