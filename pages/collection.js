import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import Web3Modal from "web3modal";
import Token from "../artifacts/contracts/Token.sol/Token.json"
import JohnyMarket from "../artifacts/contracts/JohnyMarket.sol/JohnyMarket.json"
import {Card, Col, Divider, Image, Row, Space, Spin, Typography} from 'antd';
import 'antd/dist/antd.css';
import {CenterWrapper, useContractAddressContext, useMenuSelectionContext} from "../components";
import axios from "axios";
import {useTranslation} from "../utils/use-translations";
import matic from "../public/matic.svg";

const {Meta} = Card;
const {Text} = Typography;

export default function CreateCollection() {
    const [NFTs, setNFTs] = useState([])
    const [loadState, setLoadState] = useState(false)
    const contractAddress = useContractAddressContext()
    const {t} = useTranslation()
    useMenuSelectionContext().useSelection(["/collection"])
    useEffect(() => {
        (async () => await fetchMyNFTs())();
    }, [])

    //Get Owned NFTs by current user
    async function fetchMyNFTs() {
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
            const myNFTs = await marketContract.getUserNFTs()

            //Map created items
            const NFTs = await Promise.all(
                myNFTs.map(async item => {
                    const tokenURI = await tokenContract.tokenURI(item.tokenID)
                    const tokenMetaData = await axios.get(tokenURI)
                    let tokenPrice = ethers.utils.formatUnits(item.price.toString(), "ether")
                    return {
                        tokenID: item.tokenID.toNumber(),
                        seller: item.seller,
                        owner: item.owner,
                        image: tokenMetaData.data.image,
                        name: tokenMetaData.data.name,
                        author: tokenMetaData.data.author,
                        description: tokenMetaData.data.description,
                        price: tokenPrice
                    }
                })
            )
            setNFTs(NFTs)
            setLoadState(true)
        } catch (e) {
            console.log(e)
            setLoadState(true)
        }
    }

    //If no NFTs exists
    if (loadState && NFTs.length <= 0) {
        return (
            <CenterWrapper>
                <Space direction={"vertical"} size={100}>
                    <Typography.Title level={3} style={{margin: 0}}>
                        No NFTs owned
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
                                        resizeMode: 'stretch'
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
                            <Typography.Title level={4} style={{margin: 0}}>
                                <Text type={"success"}>
                                    {`Bought for: ${NFT.price} MATIC`}
                                </Text>
                                <img width={25} src={matic} alt={"MATIC"} style={{float: "right"}}/>
                            </Typography.Title>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Spin>
    )
}