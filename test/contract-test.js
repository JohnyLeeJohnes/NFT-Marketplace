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
    });

    it('should create market offer and sell one NFTs', async function () {
        //Both contracts should be deployed
        await marketContract.deployed()
        await tokenContract.deployed()

        //Get default token price & offer price
        let contractFee = (await marketContract.getContractFee()).toString()
        const offerPrice1 = ethers.utils.parseUnits('1', 'ether')
        const offerPrice2 = ethers.utils.parseUnits('1.2', 'ether')

        //In the market contract - create market NFT
        await marketContract.createMarketNFT(tokenContractAddress, 1, offerPrice1, {value: contractFee})
        await marketContract.createMarketNFT(tokenContractAddress, 2, offerPrice1, {value: contractFee})

        //Connect to contract with buyer address -> sell him the NFT with ID 1 and rebuy it again
        const [owner, buyer1, buyer2] = await ethers.getSigners()
        await marketContract.connect(buyer1).createMarketNFTSale(1, {value: marketContract.getPrice(offerPrice1)});
        await marketContract.connect(buyer2).createMarketNFTSale(1, {value: marketContract.getPrice(offerPrice2)});

        //Write balances
        console.log("Accounts", {
            balanceAfter: ethers.utils.formatUnits((await owner.getBalance()).toString(), "ether"),
            balanceAfter1: ethers.utils.formatUnits((await buyer1.getBalance()).toString(), "ether"),
            balanceAfter2: ethers.utils.formatUnits((await buyer2.getBalance()).toString(), "ether"),
        });
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
