require("@nomiclabs/hardhat-waffle");

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 1337
        },
        mumbai: {
            url: "https://rpc-mumbai.maticvigil.com",
            accounts: [process.env.METAMASK_KEY]
        },
        matic: {
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
