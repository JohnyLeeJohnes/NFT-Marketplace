const {ethers} = require("hardhat");

describe("JohnyMarket", function () {
    it('Should create & deploy marketplace, create & deploy token, mint tokens, create market offer, sell one NFT, list rest of the NFTs', async function () {
        //Create marketplace contract -> deploy it and get address
        const market = await ethers.getContractFactory("JohnyMarket")
        const deployedMarket = await market.deploy()
        await deployedMarket.deployed()
        const deployedMarketAddress = deployedMarket.address

        //Create ERC721 token contract -> deploy it and get address
        const token = await ethers.getContractFactory("Token")
        const deployedToken = await token.deploy(deployedMarketAddress)
        await deployedToken.deployed()
        const deployedTokenAddress = deployedToken.address

        //Get token price & auction price
        let tokenPrice = await deployedMarket.getTokenPrice()
        tokenPrice = tokenPrice.toString()
        const auctionPrice = ethers.utils.parseUnits('1', 'ether')

        //Create testing tokens
        await deployedToken.mintToken("https://www.test-token-1.cz")
        await deployedToken.mintToken("https://www.test-token-2.cz")
        await deployedToken.mintToken("https://www.test-token-3.cz")

        //In the market contract - create market NFT
        await deployedMarket.createMarketNFT(deployedTokenAddress, 1, auctionPrice, {value: tokenPrice})
        await deployedMarket.createMarketNFT(deployedTokenAddress, 2, auctionPrice, {value: tokenPrice})
        await deployedMarket.createMarketNFT(deployedTokenAddress, 3, auctionPrice, {value: tokenPrice})

        //Connect to contract with buyer address -> sell him the NFT with ID 1
        const [, buyerAddress] = await ethers.getSigners()
        await deployedMarket.connect(buyerAddress).createMarketNFTSale(deployedTokenAddress, 1, {value: auctionPrice})

        //Get all NFTs on the market
        let nfts = await deployedMarket.getListedNFTs()


        nfts = await Promise.all(nfts.map(async item => {
            const tokenURI = await deployedToken.tokenURI(item.tokenID)
            return {
                tokenID: item.tokenID.toString(),
                price: item.price.toString(),
                seller: item.seller,
                owner: item.owner,
                tokenURI
            }
        }))
        console.log('NFTs: ', nfts)
    });
});
