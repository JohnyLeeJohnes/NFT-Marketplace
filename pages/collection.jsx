import React, {useEffect, useState} from "react";
import {ethers} from "ethers";
import Web3Modal from "web3modal";
import Token from "../artifacts/contracts/Token.sol/Token.json"
import JohnyMarket from "../artifacts/contracts/JohnyMarket.sol/JohnyMarket.json"
import {Card, Divider, Image, List, Space, Typography} from 'antd';
import 'antd/dist/antd.css';
import {BottomCardComponent, CenterWrapper, useContractAddressContext, useMenuSelectionContext, useSpinnerContext} from "../components";
import axios from "axios";
import {useTranslation} from "../utils/use-translations";

const {Meta} = Card;

export default function CreateCollection() {
    const [NFTs, setNFTs] = useState([])
    const contractAddress = useContractAddressContext()
    const globalSpinner = useSpinnerContext()
    const {t} = useTranslation()
    useMenuSelectionContext().useSelection(["/collection"])
    useEffect(() => {
        (async () => await fetchMyNFTs())();
    }, [])

    //Get Owned NFTs by current user
    async function fetchMyNFTs() {
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
            const myNFTs = await marketContract.getUserNFTs()

            //Map created items
            const NFTs = await Promise.all(
                myNFTs.map(async item => {
                    const tokenURI = await tokenContract.tokenURI(item.tokenID)
                    const tokenMetaData = await axios.get(tokenURI)
                    let tokenPrice = ethers.utils.formatUnits(item.price.toString(), "ether")
                    return {
                        tokenID: item.tokenID.toNumber(),
                        creator: item.creator,
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
            globalSpinner.setSpinning(false)
        }
    }

    //If no NFTs exists
    if (!globalSpinner.spinning && NFTs.length <= 0) {
        return (
            <CenterWrapper>
                <Space direction={"vertical"} size={100}>
                    <Typography.Title level={3} style={{margin: 0}}>
                        {t("No NFTs owned")}
                    </Typography.Title>
                </Space>
            </CenterWrapper>
        )
    }

    return (
        <List
            size={"large"}
            grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 4,
                xxl: 4,
            }}
            pagination={{
                pageSize: 8,
            }}
            dataSource={NFTs}
            renderItem={NFT => (
                <List.Item>
                    <Card
                        key={NFT.tokenID}
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
                        <BottomCardComponent type={"success"} bottomText={`Market price: ${NFT.price} MATIC`}/>
                    </Card>
                </List.Item>
            )}>
        </List>
    )
}