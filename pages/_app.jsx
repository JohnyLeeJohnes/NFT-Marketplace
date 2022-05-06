import React from 'react';
import 'antd/dist/antd.css';
import '../styles/index.css';
import logo from "../public/logo-black.svg"
import Image from "next/image"
import Head from "next/head";
import {Button, Layout, Spin, Typography} from 'antd';
import {useTranslation} from "../utils/use-translations";
import {ContractAddressProvider, MenuComponent, MenuSelectionProvider, SpinnerContext, SpinnerProvider} from "../components";
import {WalletProvider} from "../components/context/WalletProvider";
import {useWalletContext} from "../components/context/WalletContext";

const {Header, Content, Footer} = Layout;

//Login to metamask component
const Wallet = () => {
    const walletContext = useWalletContext()
    const {t} = useTranslation()
    if (!walletContext.account) {
        return (
            <div className={"address"}>
                <Typography.Title level={5} style={{align: "right"}}>
                    <Button onClick={() => walletContext.callWalletModal()} shape="round" danger>
                        {t("Login to MetaMask")}
                    </Button>
                </Typography.Title>
            </div>
        )
    }
    return null
}

/*
const MenuSelector = () => {
    if (isMobile) {
        return (
            <MenuComponent style={{width: 100, justifyContent: "right", float: "right"}}
            />
        )
    }
    return (
        <MenuComponent style={{justifyContent: 'center'}}/>y
    )
}*/

function App({Component, pageProps}) {
    const {t} = useTranslation()

    return (
        <WalletProvider>
            <ContractAddressProvider>
                <SpinnerProvider>
                    <MenuSelectionProvider>
                        <Head>
                            <title>{t("Johny NFT Marketplace")}</title>
                        </Head>
                        <Layout style={{minHeight: '100vh'}}>
                            <Header style={{background: '#fff'}}>
                                <div className={"logo"}>
                                    <Image width={150} height={80} src={logo} alt={"logo"}/>
                                </div>
                                <MenuComponent/>
                                <Wallet/>
                            </Header>

                            <Content style={{padding: '0 50px', marginTop: 64}}>
                                <div style={{background: '#fff', padding: 24, minHeight: 380}}>
                                    <SpinnerContext.Consumer>
                                        {SpinnerContext => <Spin style={{height: "100vh"}} spinning={SpinnerContext.spinning}>
                                            <Component {...pageProps} />
                                        </Spin>}
                                    </SpinnerContext.Consumer>
                                </div>
                            </Content>

                            <Footer style={{textAlign: 'center'}}>
                                {t("Johny NFT Market ©2022 Created by Jan Pavlát")}
                            </Footer>
                        </Layout>
                    </MenuSelectionProvider>
                </SpinnerProvider>
            </ContractAddressProvider>
        </WalletProvider>
    );
}

export default App
