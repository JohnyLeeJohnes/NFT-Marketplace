import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import Web3Modal from "web3modal";
import {Card, Col, Divider, Image, Row, Spin, Typography} from 'antd';
import 'antd/dist/antd.css';
import {BottomCardComponent, useContractAddressContext, useMenuSelectionContext} from "../components";
import Token from "../artifacts/contracts/Token.sol/Token.json"
import JohnyMarket from "../artifacts/contracts/JohnyMarket.sol/JohnyMarket.json"
import axios from "axios";
import {useTranslation} from "../utils/use-translations";
import matic from "../public/matic.svg";
import Picture from "next/image"

const {Meta} = Card;
const {Text} = Typography;

export default function CreateDashboard() {
    const [activeNFTs, setActiveNFTs] = useState([])
    const [soldNFTs, setSoldNFTs] = useState([])
    const [loadState, setLoadState] = useState(false)
    const contractAddress = useContractAddressContext()
    const {t} = useTranslation()
    useMenuSelectionContext().useSelection(["/dashboard"])
    useEffect(() => {
        (async () => await fetchCreatedNFTs())();
    }, [])

    //Get all NFTs that user -> created or sold
    async function fetchCreatedNFTs() {
        try {
            //Get signer and provider from Web3Modal -> because we need to know from who to display NFTs
            const w3Modal = new Web3Modal()
            const w3ModalConnection = await w3Modal.connect()
            const provider = new ethers.providers.Web3Provider(w3ModalConnection)
            const signer = provider.getSigner()

            //Load contracts
            const tokenContract = new ethers.Contract(contractAddress.tokenAddress, Token.abi, signer)
            const marketContract = new ethers.Contract(contractAddress.marketAddress, JohnyMarket.abi, signer)

            //Get NFTs from Market contract
            const createdNFTs = await marketContract.getCreatedNFTs()

            //Map items
            const mappedCreatedNFTs = await Promise.all(
                createdNFTs.map(async item => {
                    const tokenURI = await tokenContract.tokenURI(item.tokenID)
                    const tokenMetaData = await axios.get(tokenURI)
                    let tokenPrice = ethers.utils.formatUnits(item.price.toString(), "ether")
                    return {
                        tokenID: item.tokenID.toNumber(),
                        seller: item.seller,
                        owner: item.owner,
                        sold: item.sold,
                        image: tokenMetaData.data.image,
                        name: tokenMetaData.data.name,
                        description: tokenMetaData.data.description,
                        price: tokenPrice
                    }
                })
            )

            //Filter only sold ones
            const activeCreatedNFTs = mappedCreatedNFTs.filter(i => !i.sold)
            const soldCreatedNFTs = mappedCreatedNFTs.filter(i => i.sold)

            //Set to global variable
            setActiveNFTs(activeCreatedNFTs)
            setSoldNFTs(soldCreatedNFTs)
            setLoadState(true)
        } catch (e) {
            console.log(e)
            setLoadState(true)
        }
    }

    return (
        <Spin style={{height: "100vh"}} spinning={!loadState}>
            <Row>
                <Col span={12}>
                    <Typography.Title level={3} style={{marginBottom: 20}}>Listed NFTs</Typography.Title>
                    <Row gutter={[16, 16]}>
                        {activeNFTs.map((NFT, index) => (
                            <Col
                                className="gutter-row"
                                span={10}
                                key={index}>
                                <Card
                                    key={index}
                                    hoverable
                                    cover={
                                        <Image
                                            style={{
                                                width: "100%",
                                                height: "25vh",
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
                                    <BottomCardComponent type={"warning"} bottomText={`Listed for: ${NFT.price} MATIC`}/>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
                <Col span={12}>
                    <Typography.Title level={3} style={{marginBottom: 20}}>Sold NFTs</Typography.Title>
                    <Row gutter={[16, 16]}>
                        {soldNFTs.map((NFT, index) => (
                            <Col
                                className="gutter-row"
                                span={10}
                                key={index}>
                                <Card
                                    key={index}
                                    hoverable
                                    cover={
                                        <Image
                                            style={{
                                                width: "100%",
                                                height: "25vh",
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
                                    <BottomCardComponent type={"danger"} bottomText={`Sold for: ${NFT.price} MATIC`}/>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
                <Divider type="vertical"/>
            </Row>
        </Spin>
    );
}
