import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import Web3Modal from "web3modal";
import axios from "axios";
import 'antd/dist/antd.css';
import {Card, Col, Divider, Image, List, Row, Typography} from 'antd';
import {BottomCardComponent, useContractAddressContext, useMenuSelectionContext, useSpinnerContext} from "../components";
import {useTranslation} from "../utils/use-translations";
import Token from "../artifacts/contracts/Token.sol/Token.json"
import JohnyMarket from "../artifacts/contracts/JohnyMarket.sol/JohnyMarket.json"
import dynamic from "next/dynamic";

const {Meta} = Card;
const BrowserView = dynamic(() => import('react-device-detect').then(module => module.BrowserView), {ssr: false});
const MobileView = dynamic(() => import('react-device-detect').then(module => module.MobileView), {ssr: false});

export default function CreateDashboard() {
    const [activeNFTs, setActiveNFTs] = useState([])
    const [soldNFTs, setSoldNFTs] = useState([])
    const contractAddress = useContractAddressContext()
    const globalSpinner = useSpinnerContext()
    const {t} = useTranslation()
    useMenuSelectionContext().useSelection(["/dashboard"])
    useEffect(() => {
        (async () => await fetchCreatedNFTs())();
    }, [])

    //Get all NFTs that user -> created or sold
    async function fetchCreatedNFTs() {
        globalSpinner.setSpinning(true)
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
                        creator: item.creator,
                        owner: item.owner,
                        sold: item.sold,
                        image: tokenMetaData.data.image,
                        name: tokenMetaData.data.name,
                        author: tokenMetaData.data.author ? tokenMetaData.data.author : "Anonym",
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
        } catch (e) {
            console.log(e)
        } finally {
            globalSpinner.setSpinning(false)
        }
    }

    return (
        <>
            <BrowserView>
                <Row>
                    <Col span={12} style={{paddingRight: 10}}>
                        <Typography.Title level={3} style={{marginBottom: 20}}>Listed NFTs</Typography.Title>
                        <List
                            size={"large"}
                            grid={{
                                gutter: 8,
                                xs: 1,
                                sm: 1,
                                md: 1,
                                lg: 2,
                                xl: 2,
                                xxl: 2,
                            }}
                            pagination={{
                                pageSize: 2,
                            }}
                            dataSource={activeNFTs}
                            renderItem={NFT => (
                                <List.Item>
                                    <Card
                                        key={NFT.tokenID}
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
                                        <BottomCardComponent type={"warning"}
                                                             bottomText={`Listed for: ${NFT.price} MATIC`}/>
                                    </Card>
                                </List.Item>
                            )}>
                        </List>
                    </Col>
                    <Col span={12} style={{paddingLeft: 10}}>
                        <Typography.Title level={3} style={{marginBottom: 20}}>{t("Sold NFTs")}</Typography.Title>
                        <List
                            size={"large"}
                            grid={{
                                gutter: 8,
                                xs: 1,
                                sm: 1,
                                md: 1,
                                lg: 2,
                                xl: 2,
                                xxl: 2,
                            }}
                            pagination={{
                                pageSize: 2,
                            }}
                            dataSource={soldNFTs}
                            renderItem={NFT => (
                                <List.Item>
                                    <Card
                                        key={NFT.tokenID}
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
                                        <BottomCardComponent type={"warning"}
                                                             bottomText={`Listed for: ${NFT.price} MATIC`}/>
                                    </Card>
                                </List.Item>
                            )}>
                        </List>
                    </Col>
                </Row>
            </BrowserView>
            <MobileView>
                <Typography.Title level={3} style={{marginBottom: 20}}>{t("Listed NFTs")}</Typography.Title>
                <List
                    size={"large"}
                    grid={{
                        gutter: 8,
                        xs: 1,
                        sm: 1,
                        md: 1,
                        lg: 2,
                        xl: 2,
                        xxl: 2,
                    }}
                    pagination={{
                        pageSize: 1,
                    }}
                    dataSource={activeNFTs}
                    renderItem={NFT => (
                        <List.Item>
                            <Card
                                key={NFT.tokenID}
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
                                <BottomCardComponent type={"warning"}
                                                     bottomText={`Listed for: ${NFT.price} MATIC`}/>
                            </Card>
                        </List.Item>
                    )}>
                </List>
                <Divider/>
                <Typography.Title level={3} style={{marginBottom: 20}}>Sold NFTs</Typography.Title>
                <List
                    size={"large"}
                    grid={{
                        gutter: 8,
                        xs: 1,
                        sm: 1,
                        md: 1,
                        lg: 2,
                        xl: 2,
                        xxl: 2,
                    }}
                    pagination={{
                        pageSize: 1,
                    }}
                    dataSource={soldNFTs}
                    renderItem={NFT => (
                        <List.Item>
                            <Card
                                key={NFT.tokenID}
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
                                <BottomCardComponent type={"warning"}
                                                     bottomText={`Listed for: ${NFT.price} MATIC`}/>
                            </Card>
                        </List.Item>
                    )}>
                </List>
            </MobileView>
        </>
    );
}
