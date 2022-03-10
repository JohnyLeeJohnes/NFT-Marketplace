# Johny NFT Marketplace

## Introduction
This is the project, to make decentralized WebApp using **Next.js** and **React**. 
Contracts are written using **Solidity** with **HardHat framework**

##Getting started
After cloning the project, to build the project on the local server `run these commands:`

```bash
# Libraries installation
npm install
# Compile contracts using hardhat 
npx hardhat compile
# Build the whole project
npm run build
# Start the local server 
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

After building the project, you need to create testing network `using these commands:`
```bash
# This will start the testing network
npx hardhat node
# Deploy the contracts to the testing network
npx hardhat run scripts/deploy.js --network localhost
```


##Connecting wallet
To properly test the network, you need to create **MetaMask** wallet and import some testing account from 
```npm hardhat node``` command. Select your desirable ***Private key*** address and import it in your wallet.
