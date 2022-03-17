import React, {Component, useState} from 'react';
import {ethers} from "ethers";
import 'antd/dist/antd.css';
import {Button, Layout, message, Typography} from 'antd';
import {useTranslation} from "../utils/use-translations";
import '../styles/index.css';
import logo from "../public/logo-black.svg"
import Image from "next/image"
import {ContractAddressProvider, MenuComponent, MenuSelectionProvider} from "../components";
import Head from "next/head";
import Web3Modal from "web3modal";

const {Header, Content, Footer} = Layout;

function App({Component, pageProps}) {
    const [account, setAccount] = useState([])
    const {t} = useTranslation()

    //Ping users wallet -> connect with webapp
    async function getWalletAddress() {
        try {
            const web3Modal = new Web3Modal()
            const instance = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(instance);
            const signer = provider.getSigner();
            const address = await signer.getAddress()
            setAccount(address)
            message.success({
                content: `You are logged in with: ${address}`,
                duration: 3
            });
        } catch (e) {
            console.log(e)
        }
    }

    //Hook to show "Login to MetaMask" button
    const Wallet = () => {
        if (!account.length) {
            return (
                <div className={"address"}>
                    <Typography.Title level={5} style={{align: "right"}}>
                        <Button onClick={getWalletAddress} shape="round" danger>
                            {t("Login to MetaMask")}
                        </Button>
                    </Typography.Title>
                </div>
            )
        } else {
            return (<div/>)
        }
    }

    return (
        <ContractAddressProvider>
            <MenuSelectionProvider>
                <Head>
                    <title>{t("Johny NFT Marketplace")}</title>
                </Head>
                <Layout style={{minHeight: '100vh'}}>
                    <Header style={{background: '#fff'}}>
                        <div className={"logo"}>
                            <Image width={150} height={80} src={logo} alt={"logo"}/>
                        </div>
                        <Wallet/>
                        <MenuComponent/>
                    </Header>

                    <Content style={{padding: '0 50px', marginTop: 64}}>
                        <div style={{background: '#fff', padding: 24, minHeight: 380}}><Component {...pageProps} />
                        </div>
                    </Content>

                    <Footer style={{textAlign: 'center'}}>
                        {t("Johny NFT Market ©2022 Created by Jan Pavlát")}
                    </Footer>
                </Layout>
            </MenuSelectionProvider>
        </ContractAddressProvider>
    );
}

export default App
