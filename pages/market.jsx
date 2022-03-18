import axios from "axios";
import React, {useEffect, useState} from "react";
import Web3Modal from "web3modal";
import {ethers} from "ethers";
import Token from "../artifacts/contracts/Token.sol/Token.json"
import JohnyMarket from "../artifacts/contracts/JohnyMarket.sol/JohnyMarket.json"
import "antd/dist/antd.css";
import {Button, Card, Col, Divider, Image, message, Row, Space, Spin, Typography} from "antd";
import {BottomCardComponent, CenterWrapper, useContractAddressContext, useMenuSelectionContext} from "../components";
import {useTranslation} from "../utils/use-translations";

const {Text} = Typography;
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
            setNFTs(NFTs)
        } catch (e) {
            console.log(e.message)
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

            //Check, if signer owns token
            if (await signer.getAddress() === token.owner) {
                message.error("Cannot buy your own token")
                setLoadState(true)
                return
            }

            //Calculate final price
            const tokenPriceFee = ethers.utils.parseUnits(token.price.toString(), "ether")
            const finalPrice = await marketContract.getPrice(tokenPriceFee)

            //Create Sale -> after that reload NFT page
            const saleTransaction = await marketContract.createMarketNFTSale(token.tokenID, {value: finalPrice})
            await saleTransaction.wait();
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
                            <Text italic>{`(${NFT.fullPrice} including fee)`}</Text>
                            <Button type="primary" style={{width: "100%", marginTop: 5}} onClick={() => buyNFT(NFT)}>
                                {t("Buy!")}
                            </Button>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Spin>
    );

}
