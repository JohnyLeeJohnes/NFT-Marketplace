//Wallet connector + Contract connector + Axios lib + React states
import axios from "axios";
import React, {useEffect, useState} from "react";
import {tokenAddress, marketAddress} from "../config";
import Web3Modal from "web3modal";
import {ethers} from "ethers";

//Contracts
import Token from "../artifacts/contracts/Token.sol/Token.json"
import JohnyMarket from "../artifacts/contracts/JohnyMarket.sol/JohnyMarket.json"

//Design
import "antd/dist/antd.css";
import {Space, Typography} from "antd";
import Head from "next/head"

const {Title} = Typography;

export default function Home() {
    const [NFTs, setNFTs] = useState([])
    const [loadState, setLoadState] = useState("not-loaded")

    useEffect(() => {
        (async () => await fetchNFTs())();
    }, [])

    async function fetchNFTs() {
        //Get RPC provider and contracts
        const provider = new ethers.providers.JsonRpcProvider()
        const tokenContract = new ethers.Contract(tokenAddress, Token.abi, provider)
        const marketContract = new ethers.Contract(marketAddress, JohnyMarket.abi, provider)

        //Get NFTs from Market contract
        const NFTListData = await marketContract.getListedNFTs()

        //Map items
        const NFTs = await Promise.all(
            NFTListData.map(async item => {
                const tokenURI = await tokenContract.tokenURI(item.tokenID)
                const tokenMetaData = await axios.get(tokenURI)
                let tokenPrice = ethers.utils.formatUnits(item.price.toString(), "ether")
                return {
                    tokenID: item.tokenID.toNumber(),
                    seller: item.seller,
                    owner: item.owner,
                    image: tokenMetaData.data.image,
                    name: tokenMetaData.data.image,
                    tags: tokenMetaData.data.tags,
                    description: tokenMetaData.data.description,
                    price: tokenPrice
                }
            })
        )
        setNFTs(NFTs)
        setLoadState("loaded")
    }

    /* Unfinished
    async function buyNFT(token) {
        //Create Web3Modal connection
        const web3Modal = new Web3Modal()
        const web3connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(web3connection)

        //Fetch contract
        const signer = provider.getSigner()
        const contract = new ethers.Contract(marketAddress, JohnyMarket.abi, signer)

        const tokenPrice = ethers.utils.parseUnits(token.price.toString(), "ether")
    }
    */

    //If no NFTs exists
    if (loadState === "loaded" && NFTs.length <= 0) {
        return (
            <Space direction="horizontal" style={{width: "100%", justifyContent: "center"}}>
                <Typography>
                    <Title>Welcome to Johny NFT Marketplace</Title>
                </Typography>
            </Space>
        )
    }

    return (
        <div>
            <Head>
                <title>Johny Marketplace</title>
                <link rel="shortcut icon" href="favicon.ico"/>
            </Head>
        </div>
    )
}
