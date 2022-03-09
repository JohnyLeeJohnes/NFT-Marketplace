import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Layout} from 'antd';
import {useTranslation} from "../utils/use-translations";
import '../styles/index.css';
import logo from "../public/logo-black.svg"
import {MenuSelectionProvider} from "../components";
import {MenuComponent} from "../components/MenuComponent";
import Image from "next/image"

const {Header, Content, Footer} = Layout;


function App({Component, pageProps}) {
    const {t} = useTranslation()

    return (
        <MenuSelectionProvider>
            <Layout style={{minHeight: '100vh'}}>
                <Header style={{background: '#fff'}}>
                    <div className={"logo"}>
                        <Image width={150} height={80} src={logo} alt={"logo"}/>
                    </div>
                    <MenuComponent/>
                </Header>

                <Content style={{padding: '0 50px', marginTop: 64}}>
                    <div style={{background: '#fff', padding: 24, minHeight: 380}}><Component {...pageProps} /></div>
                </Content>

                <Footer style={{textAlign: 'center'}}>
                    {t("Johny NFT Market ©2022 Created by Jan Pavlát")}
                </Footer>
            </Layout>
        </MenuSelectionProvider>
    );
}

export default App
