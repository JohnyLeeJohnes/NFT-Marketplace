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
import dynamic from 'next/dynamic'
import {MenuOutlined} from "@ant-design/icons";

const {Header, Content, Footer} = Layout;
const BrowserView = dynamic(() => import('react-device-detect').then(module => module.BrowserView), {ssr: false});
const MobileView = dynamic(() => import('react-device-detect').then(module => module.MobileView), {ssr: false});

//Login to metamask component
const Wallet = () => {
    const walletContext = useWalletContext()
    const {t} = useTranslation()
    if (!walletContext.account) {
        return (
            <BrowserView>
                <div className={"address"}>
                    <Typography.Title level={5} style={{align: "right"}}>
                        <Button onClick={() => walletContext.callWalletModal()} shape="round" danger>
                            {t("Login to MetaMask")}
                        </Button>
                    </Typography.Title>
                </div>
            </BrowserView>
        )
    }
    return null
}


const MenuSelector = () => {
    return (
        <>
            <MobileView>
                <MenuComponent
                    style={{
                        width: 100,
                        float: 'right',
                        justifyContent: 'right'
                    }}
                    overflowedIndicator={<MenuOutlined/>}/>
            </MobileView>
            <BrowserView>
                <MenuComponent style={{justifyContent: 'center'}}/>
            </BrowserView>
        </>
    )
}

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
                                <Wallet/>
                                <MenuSelector/>
                            </Header>

                            <BrowserView>
                                <Content style={{padding: '0 50px', marginTop: 50}}>
                                    <div style={{background: '#fff', padding: 24, minHeight: 380}}>
                                        <SpinnerContext.Consumer>
                                            {SpinnerContext => <Spin style={{height: "100vh"}} spinning={SpinnerContext.spinning}>
                                                <Component {...pageProps} />
                                            </Spin>}
                                        </SpinnerContext.Consumer>
                                    </div>
                                </Content>
                            </BrowserView>
                            <MobileView>
                                <Content style={{padding: '0 20px', marginTop: 20}}>
                                    <div style={{background: '#fff', padding: 24, minHeight: 380}}>
                                        <SpinnerContext.Consumer>
                                            {SpinnerContext => <Spin style={{height: "100vh"}} spinning={SpinnerContext.spinning}>
                                                <Component {...pageProps} />
                                            </Spin>}
                                        </SpinnerContext.Consumer>
                                    </div>
                                </Content>
                            </MobileView>

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
