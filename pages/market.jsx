import axios from "axios";
import React, {useEffect, useState} from "react";
import Web3Modal from "web3modal";
import {ethers} from "ethers";
import Token from "../artifacts/contracts/Token.sol/Token.json"
import JohnyMarket from "../artifacts/contracts/JohnyMarket.sol/JohnyMarket.json"
import "antd/dist/antd.css";
import {Button, Card, Col, Divider, Image, Row, Space, Spin, Typography} from "antd";
import {BottomCardComponent, CenterWrapper, useContractAddressContext, useMenuSelectionContext} from "../components";
import {useTranslation} from "../utils/use-translations";

const {Meta} = Card;

export default function Home() {
    const [NFTs, setNFTs] = useState([])
    const [loadState, setLoadState] = useState(false)
    const contractAddress = useContractAddressContext()
    const {t} = useTranslation()
    useMenuSelectionContext().useSelection(["/market"])
    useEffect(() => {
        (async () => await fetchNFTs())();
    }, [])

    //Get all available NFTs on the blockchain
    async function fetchNFTs() {
        try {
            //Load contracts
            const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.matic.today")
            const tokenContract = new ethers.Contract(contractAddress.tokenAddress, Token.abi, provider)
            const marketContract = new ethers.Contract(contractAddress.marketAddress, JohnyMarket.abi, provider)

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
                        author: tokenMetaData.data.author ? tokenMetaData.data.author : "Anonym",
                        description: tokenMetaData.data.description,
                        price: tokenPrice
                    }
                })
            )
            setNFTs(NFTs)
        } catch (e) {
            console.log(e)
        } finally {
            setLoadState(true)
        }
    }

    //On click Event -> buy clicked NFT
    async function buyNFT(token) {
        //Create Web3Modal connection
        try {
            setLoadState(false)
            const web3Modal = new Web3Modal()
            const web3connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(web3connection)

            //Fetch contract and price
            const signer = provider.getSigner()
            const marketContract = new ethers.Contract(contractAddress.marketAddress, JohnyMarket.abi, signer)
            const tokenPrice = ethers.utils.parseUnits(token.price.toString(), "ether")

            //Create Sale -> after that reload NFT page
            const saleTransaction = await marketContract.createMarketNFTSale(contractAddress.tokenAddress, token.tokenID, {value: tokenPrice})
            await saleTransaction.wait()
            await fetchNFTs()
        } catch (e) {
            setLoadState(true)
            console.log(e)
        }
    }

    //If no NFTs loaded
    if (loadState && NFTs.length <= 0) {
        return (
            <CenterWrapper>
                <Space direction={"vertical"} size={100}>
                    <Typography.Title level={3} style={{margin: 0}}>
                        {t("No NFTs on the market!")}
                    </Typography.Title>
                </Space>
            </CenterWrapper>
        )
    }

    return (
        <Spin style={{height: "100vh"}} spinning={!loadState}>
            <Row gutter={[16, 16]}>
                {NFTs.map((NFT, index) => (
                    <Col
                        className="gutter-row"
                        span={6}
                        key={index}>
                        <Card
                            key={index}
                            hoverable
                            cover={
                                <Image
                                    style={{
                                        width: "100%",
                                        height: "30vh",
                                        objectFit: "contain",
                                    }}
                                    src={NFT.image}
                                    alt={"nft-image"}
                                />
                            }
                        >
                            <Meta
                                title={`${NFT.name} [ by ${NFT.author} ]`}
                                description={NFT.description}
                            />
                            <Divider/>
                            <BottomCardComponent bottomText={`${NFT.price} MATIC`}/>
                            <Button type="primary" style={{width: "100%"}} onClick={() => buyNFT(NFT)}>
                                {t("Buy!")}
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Spin>
    );

}
