const {ethers} = require("hardhat");

describe("Contract tests", function () {
    let marketContract;
    let marketContractAddress;
    let tokenContract;
    let tokenContractAddress;

    it('should create and deploy marketplace contract', async function () {
        //Create marketplace contract -> deploy it and get address
        const market = await ethers.getContractFactory("JohnyMarket")
        marketContract = await market.deploy()
        await marketContract.deployed()
        marketContractAddress = marketContract.address
    });

    it('should create and deploy token contract', async function () {
        //Create ERC721 token contract -> deploy it and get address
        const token = await ethers.getContractFactory("Token")
        tokenContract = await token.deploy(marketContractAddress)
        await tokenContract.deployed()
        tokenContractAddress = tokenContract.address
    });

    it('should mint new nfts ', async function () {
        //Both contracts should be deployed
        await marketContract.deployed()
        await tokenContract.deployed()

        //Create testing tokens
        await tokenContract.mintToken("https://www.test-token-1.cz")
        await tokenContract.mintToken("https://www.test-token-2.cz")
        await tokenContract.mintToken("https://www.test-token-3.cz")
    });

    it('should create market offer and sell one NFTs', async function () {
        //Both contracts should be deployed
        await marketContract.deployed()
        await tokenContract.deployed()

        //Get default token price & offer price
        let tokenPrice = await marketContract.getTokenPrice()
        tokenPrice = tokenPrice.toString()
        const offerPrice = ethers.utils.parseUnits('0.1', 'ether')

        //In the market contract - create market NFT
        await marketContract.createMarketNFT(tokenContractAddress, 1, offerPrice, {value: tokenPrice})
        await marketContract.createMarketNFT(tokenContractAddress, 2, offerPrice, {value: tokenPrice})
        await marketContract.createMarketNFT(tokenContractAddress, 3, offerPrice, {value: tokenPrice})

        //Connect to contract with buyer address -> sell him the NFT with ID 1
        const [, buyerAddress] = await ethers.getSigners()
        await marketContract.connect(buyerAddress).createMarketNFTSale(tokenContractAddress, 1, {value: offerPrice})
    });

    it('should list all offered NFTs on the market', async function () {
        //Get all NFTs on the market
        let nfts = await marketContract.getListedNFTs()
        nfts = await Promise.all(nfts.map(async item => {
            const tokenURI = await tokenContract.tokenURI(item.tokenID)
            return {
                tokenID: item.tokenID.toString(),
                price: item.price.toString(),
                owner: item.owner,
                creator: item.creator,
                tokenURI
            }
        }))
        console.log('NFTs: ', nfts)
    });
});
