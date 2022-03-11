require("@nomiclabs/hardhat-waffle");

//const infuraID = "44c7220a91f547cb81c8905063bccee1"

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 1337
        },
        mumbai: {
            //url: `https://polygon-mumbai.infura.io/v3/${infuraID}`,
            url: "https://rpc-mumbai.matic.today",
            accounts: [process.env.METAMASK_KEY]
        },
        matic: {
            //url: `https://polygon-mainnet.infura.io/v3/${infuraID}`,
            url: "https://rpc-mainnet.matic.network",
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
