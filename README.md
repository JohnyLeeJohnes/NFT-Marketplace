# Johny NFT Marketplace
This is a project, which is trying to develop decentralized marketplace for **NFT** using ERC721 **standard**.
To interact with the marketplace there is a WebApplication using **Next.js** and **React**. Contracts are
written using **Solidity** programming language using **Hardhat** framework.

## Getting started
If you want to run this application localy, you need to clone this application to your disk with ```command```:
```bash
git clone https://github.com/JohnyLeeJohnes/nft-vsfs-market.git
```

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

After building the project, you need to create testing network and deploy smart contracts to it `using these commands:`
```bash
# This will start the testing network
npx hardhat node
# Deploy the contracts to the testing network
npx hardhat run scripts/deploy.js --network localhost
```

## Connecting wallet
To properly test out this application, you need to create **MetaMask** crypto wallet and import some Account from
the test network. All tutorials are written on the Home Page of the WebApp including tutorials on how to set up
a crypto Wallet.

---

# Johny NFT Marketplace
Toto je projekt, který se zaměřuje na tvorbu decentralizovaného tržiště **NFT** standardu **ERC721**, 
na které lze přistupovat pomocíwebové aplikace využívající **Next.js** a **React**. Na tvorbu kontraktů je 
využit programovací jazyk **Solidity** za pomoci frameworku **Hardhat**.

## Začínáme
Pokud chcete rozběhnout aplikaci lokálně, je třeba nejdříve naklonovat projekt ```příkazem```:
```bash
git clone https://github.com/JohnyLeeJohnes/nft-vsfs-market.git
```

Po naklonování projektu, je třeba udělat build, který vytvoří všechny potřebné soubory. ```Použijte tyto příkazy```:
```bash
# Instalace knihoven v composer.json
npm install
# Kompilace kontraktů v /contracts
npx hardhat compile
# Vytvoří všechny zbylé potřebné soubory
npm run build
# Zapne aplikaci lokálně
npm run dev
```
Otevřete [http://localhost:3000](http://localhost:3000) s vaším prohlížečem, kde se nachází aplikace

Po vytvoření buildu, je potřeba vytvořit testovací síť a nasadit zde chytré kontrakty ```pomocí příkazů```:
```bash
# Zapne lokální testovací síť
npx hardhat node
# Nasadí chytré kontrakty na testovací síť
npx hardhat run scripts/deploy.js --network localhost
```

## Připojení peněženky
Aby šlo vyzkoušet aplikace, je potřeba si vytvořit **MetaMask** peněženku a importovat si nějaký účet s testovací sítě. 
Všechny návody jsou na úvodní obrazovce aplikace včetně tvorby peněženky a nasazení na testovací síť.