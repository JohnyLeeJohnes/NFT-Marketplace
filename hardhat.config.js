require("@nomiclabs/hardhat-waffle");

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 1337
        },
        mumbai: {
            //url: `https://polygon-mumbai.infura.io/v3/44c7220a91f547cb81c8905063bccee1`,
            url: "https://rpc-mumbai.maticvigil.com",
            accounts: [process.env.METAMASK_KEY]
        },
        matic: {
            //url: `https://polygon-mainnet.infura.io/v3/44c7220a91f547cb81c8905063bccee1`,
            url: "https://rpc-mainnet.maticvigil.com",
            accounts: [process.env.METAMASK_KEY]
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
