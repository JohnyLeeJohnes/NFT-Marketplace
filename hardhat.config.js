require("@nomiclabs/hardhat-waffle");

const privateKey = "6489e7c9bf31d82075033e6d95da07a16fef0eea4dbf89f3285dda78453bf1f7"
//const infuraId = "44c7220a91f547cb81c8905063bccee1"

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 1337
        },
        mumbai: {
            //url: `https://polygon-mumbai.infura.io/v3/${infuraId}`,
            url: "https://rpc-mumbai.matic.today",
            accounts: [privateKey]
        },
        matic: {
            //url: `https://polygon-mainnet.infura.io/v3/${infuraId}`,
            url: "https://rpc-mainnet.maticvigil.com",
            accounts: [privateKey]
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
