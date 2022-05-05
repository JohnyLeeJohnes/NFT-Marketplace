import {ethers} from "ethers";
import Token from "../../../../artifacts/contracts/Token.sol/Token.json";
import JohnyMarket from "../../../../artifacts/contracts/JohnyMarket.sol/JohnyMarket.json";
import axios from "axios";
import {ContractAddressesFunction} from "../../../../components";

export default async function handler(req, res) {
    try {
        res.status(200).send(await fetchMarketNFTs())
    } catch (e) {
        console.log(e)
        res.status(500).end(JSON.stringify("server fetch error"))
    }
}

async function fetchMarketNFTs() {
    //Load contracts
    const contractAddress = ContractAddressesFunction()
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.matic.today")
    const tokenContract = new ethers.Contract(contractAddress.tokenAddress, Token.abi, provider)
    const marketContract = new ethers.Contract(contractAddress.marketAddress, JohnyMarket.abi, provider)

    //Get NFTs from Market contract
    const NFTListData = await marketContract.getListedNFTs()

    //Map items
    return await Promise.all(
        NFTListData.map(async item => {
            const tokenURI = await tokenContract.tokenURI(item.tokenID)
            const tokenMetaData = await axios.get(tokenURI)
            return {
                tokenID: item.tokenID.toNumber(),
                creator: item.creator,
                owner: item.owner,
                image: tokenMetaData.data.image,
                name: tokenMetaData.data.name,
                author: tokenMetaData.data.author ? tokenMetaData.data.author : "Anonym",
                description: tokenMetaData.data.description,
                price: ethers.utils.formatUnits(item.price.toString(), "ether"),
                fullPrice: ethers.utils.formatUnits(await marketContract.getPrice(item.price.toString()), "ether")
            }
        })
    )
}