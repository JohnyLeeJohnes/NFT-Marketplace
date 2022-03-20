import React from "react";
import "antd/dist/antd.css";
import {Col, Divider, Row, Typography} from "antd";
import {useMenuSelectionContext} from "../components";
import {useTranslation} from "../utils/use-translations";

const {Title, Paragraph, Text, Link} = Typography;

export default function Home() {
    const {t} = useTranslation()
    useMenuSelectionContext().useSelection(["/"])

    return (
        <div>
            <Row>
                <Col span={11} style={{marginLeft: 20, marginRight: 20, marginTop: 20, marginBottom: 20}}>
                    <Typography>
                        <Title>Johny NFT Marketplace</Title>
                        <Paragraph>
                            Welcome to the<Text strong> Johny NFT Marketplace! </Text>This application is a student
                            project
                            focusing on creating Web Application that connects to your crypto wallet and lets you trade
                            with
                            your NFTs!
                        </Paragraph>
                        <Paragraph>
                            You can connect to this application with multiple Crypto Wallets but <Text
                            strong>MetaMask</Text> is prefered.
                            To create your first Wallet
                            <Link target={"new"}
                                  href={"https://metamask.zendesk.com/hc/en-us/articles/360015489531-Getting-started-with-MetaMask"}> follow
                                this link with exact steps!</Link>

                        </Paragraph>
                        <Title level={2}>How to use this application?</Title>
                        <Paragraph>
                            First of all, contracts this application uses, run on the Matic Test network so you need
                            to create a new network connection with your MetaMask wallet
                            <Link target={"new"}
                                  href={"https://metamask.zendesk.com/hc/en-us/articles/360015489531-Getting-started-with-MetaMask"}> follow
                                this link with exact steps! </Link>
                            Fill the information about the network with:
                        </Paragraph>
                        <Paragraph>
                            <ol>
                                <li>
                                    <Text strong>Network Name</Text> - up to you but <Text code>Mumbai Test
                                    Net</Text> is mostly used
                                </li>
                                <li>
                                    <Text strong>New RPC URL</Text> - fill with <Text
                                    code>https://rpc-mumbai.matic.today</Text>
                                </li>
                                <li>
                                    <Text strong>Chain ID</Text> - fill with <Text code>80001</Text>
                                </li>
                                <li>
                                    <Text strong>Currency symbol</Text> - fill with <Text code>MATIC</Text> as we use
                                    MATIC currency on this app
                                </li>
                            </ol>
                        </Paragraph>
                        After connecting to the Test Network, you need some first matic to start using this app! I
                        recomend to use
                        <Link target={"new"}
                              href={"https://faucet.matic.network/"}> https://faucet.matic.network/. </Link> You can
                        get <Text strong>0.5
                        MATIC</Text> every minute after you fill some Captcha.
                    </Typography>
                </Col>
                <Divider type="vertical" style={{height: 500}}/>
                <Col span={11} style={{marginLeft: 40, marginTop: 20, marginBottom: 20}}>
                    <Typography>
                        <Title level={3}><Link href={"/market"}>Buy NFTs!</Link></Title>
                        <Paragraph>
                            On this page you can buy NFTs! Just click that little buy button on the NFT and proceed with
                            the transaction!
                        </Paragraph>
                        <Title level={3}><Link href={"/create"}>Create NFTs!</Link></Title>
                        <Paragraph>
                            If you wanna create something memorable, create your NFT! Just fill the name, description,
                            price and of course the picuture, by clicking <Text strong>create NFT!</Text> and proceeding
                            with the transaction.
                            The final NFT will be listed on the market as well! Author of the NFT is optional but I
                            recomend to stamp it with your alter ego.
                        </Paragraph>
                        <Title level={3}><Link href={"/collection"}>See owned NFTs!</Link></Title>
                        <Paragraph>
                            If you buy some NFT, you can see them in this section! There is also preview option after
                            clicking on the image to see the full beaty of your bought NFT!
                        </Paragraph>

                        <Title level={3}><Link href={"/dashboard"}>See what you have created!</Link></Title>
                        <Paragraph>
                            Everything you have created will be listed here! One section is for listed NFTs and the
                            other one bought NFTs. Here you can see how much money did you make are what did you make.
                        </Paragraph>
                    </Typography>
                </Col>
            </Row>
        </div>
    );

}
