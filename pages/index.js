import axios from "axios";
import React, {useEffect, useState} from "react";
import Web3Modal from "web3modal";
import {ethers} from "ethers";
import {marketAddress, tokenAddress} from "../config";
import Token from "../artifacts/contracts/Token.sol/Token.json"
import JohnyMarket from "../artifacts/contracts/JohnyMarket.sol/JohnyMarket.json"
import "antd/dist/antd.css";
import {Button, Card, Divider, Image, Space, Spin, Typography} from "antd";
import {CenterWrapper, useMenuSelectionContext} from "../components";
import {useTranslation} from "../utils/use-translations";

const {Meta} = Card;


export default function Home() {
    const [NFTs, setNFTs] = useState([])
    const [loadState, setLoadState] = useState(false)
    const {t} = useTranslation()
    useMenuSelectionContext().useSelection(["/"])

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
                    name: tokenMetaData.data.name,
                    tags: tokenMetaData.data.tags,
                    description: tokenMetaData.data.description,
                    price: tokenPrice
                }
            })
        )
        setNFTs(NFTs)
        setLoadState(true)
    }

    async function buyNFT(token) {
        //Create Web3Modal connection
        const web3Modal = new Web3Modal()
        const web3connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(web3connection)

        //Fetch contract and price
        const signer = provider.getSigner()
        const marketContract = new ethers.Contract(marketAddress, JohnyMarket.abi, signer)
        const tokenPrice = ethers.utils.parseUnits(token.price.toString(), "ether")

        //Create Sale -> after that reload NFT page
        const saleTransaction = await marketContract.createMarketNFTSale(tokenAddress, token.tokenID, {value: tokenPrice})
        await saleTransaction.wait()
        await fetchNFTs()
    }


    //If no NFTs exists
    if (loadState && NFTs.length <= 0) {
        return (
            <CenterWrapper>
                <Space direction={"vertical"} size={100}>
                    <Typography.Title level={3} style={{margin: 0}}>
                        No NFTs to display...
                    </Typography.Title>
                </Space>
            </CenterWrapper>
        )
    }

    return (
        <Spin style={{height: "100vh"}} spinning={!loadState}>
            {
                NFTs.map((NFT, index) => (
                    <Card
                        key={index}
                        hoverable
                        style={{width: 300}}
                        cover={<Image src={NFT.image} alt={"NFT Image"}/>}
                    >
                        <Meta title={NFT.name} description={NFT.description} tags={NFT.tags}/>
                        <Divider/>
                        <h2 style={{marginRight: 'auto'}}>{NFT.price} {t("Matic")}</h2>
                        <Button type="primary" style={{width: "100%"}} onClick={() => buyNFT(NFT)}>
                            {t("Buy!")}
                        </Button>
                    </Card>
                ))
            }
        </Spin>
    )
}
