import axios from "axios";
import React, {useEffect, useState} from "react";
import Web3Modal from "web3modal";
import {ethers} from "ethers";
import JohnyMarket from "../artifacts/contracts/JohnyMarket.sol/JohnyMarket.json"
import "antd/dist/antd.css";
import {Button, Card, Col, Divider, Image, message, Row, Space, Typography} from "antd";
import {
    BottomCardComponent,
    CenterWrapper,
    useContractAddressContext,
    useMenuSelectionContext,
    useSpinnerContext
} from "../components";
import {useTranslation} from "../utils/use-translations";

const {Text} = Typography;
const {Meta} = Card;

export default function Home() {
    const [NFTs, setNFTs] = useState([])
    const [loadError, setLoadError] = useState(false)
    const contractAddress = useContractAddressContext()
    const globalSpinner = useSpinnerContext()
    const {t} = useTranslation()
    useMenuSelectionContext().useSelection(["/market"])
    useEffect(() => {
        (async () => await loadNFTs())();
    }, [])


    //Get all available NFTs on the blockchain
    async function loadNFTs() {
        globalSpinner.setSpinning(true)
        try {
            const nfts = (await axios.get('/api/nft/fetch/market')).data
            setNFTs(nfts)
            setLoadError(false)
        } catch (e) {
            console.error(e)
            setLoadError(true)
        } finally {
            globalSpinner.setSpinning(false)
        }
    }

    //On click Event -> buy clicked NFT
    async function buyNFT(token) {
        //Create Web3Modal connection
        try {
            globalSpinner.setSpinning(true)
            const web3Modal = new Web3Modal()
            const web3connection = await web3Modal.connect()
            const provider = new ethers.providers.Web3Provider(web3connection)

            //Fetch contract and price
            const signer = provider.getSigner()
            const marketContract = new ethers.Contract(contractAddress.marketAddress, JohnyMarket.abi, signer)

            //Check, if signer owns token
            if (await signer.getAddress() === token.owner) {
                message.error("Cannot buy your own token")
                globalSpinner.setSpinning(true)
                return
            }

            //Calculate final price
            const tokenPriceFee = ethers.utils.parseUnits(token.price.toString(), "ether")
            const finalPrice = await marketContract.getPrice(tokenPriceFee)

            //Create Sale -> after that reload NFT page
            const saleTransaction = await marketContract.createMarketNFTSale(token.tokenID, {value: finalPrice})
            await saleTransaction.wait();
            await loadNFTs()
        } catch (e) {
            globalSpinner.setSpinning(false)
            console.log(e)
        }
    }

    //If error while fetching data
    if (loadError) {
        return (
            <CenterWrapper>
                <Typography.Title level={3} style={{marginBottom: 20}}>
                    {t("RPC is currently busy! Try again later!")}
                </Typography.Title>
                <Button onClick={() => loadNFTs()} shape={"round"} size={"large"} danger>
                    {t("Refresh")}
                </Button>
            </CenterWrapper>
        )
    }

    //If no NFTs loaded
    if (!globalSpinner.spinning && NFTs.length <= 0) {
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
    );

}
