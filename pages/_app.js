import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Layout, Menu} from 'antd';
import {useTranslation} from "../utils/use-translations";
import '../styles/index.css';
import Link from 'next/link';
import {DashboardOutlined, HomeOutlined, UnorderedListOutlined, WalletOutlined} from "@ant-design/icons";
import logo from "../public/logo-black.svg"

const {Header, Content, Footer, Sider} = Layout;

let state = "home"
const changeState = (e) => {
    state = e.key;
};


function App({Component, pageProps}) {
    const {t} = useTranslation()

    return (
        <Layout style={{minHeight: '100vh'}}>

            <Header style={{background: '#fff'}}>
                <div className={"logo"}>
                    <img className={"img"} src={logo} alt={"logo"}/>
                </div>

                <Menu onClick={changeState} theme="light" mode="horizontal" selectedKeys={[state]}
                      defaultSelectedKeys={['2']} style={{justifyContent: 'center'}}>
                    <Menu.Item key={"home"} icon={<HomeOutlined/>}>
                        <Link href={"/"}>
                            <a>{t("My NFTs")}</a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key={"/dashboard"} icon={<DashboardOutlined/>}>
                        <Link href={"/dashboard"}>
                            <a>{t("NFT Dashboard")}</a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key={"/create"} icon={<WalletOutlined/>}>
                        <Link href={"/create"}>
                            <a>{t("Create NFT")}</a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key={"/collection"} icon={<UnorderedListOutlined/>}>
                        <Link href={"/collection"}>
                            <a>{t("My NFTs")}</a>
                        </Link>
                    </Menu.Item>
                </Menu>

            </Header>

            <Content style={{padding: '0 50px', marginTop: 64}}>
                <div style={{background: '#fff', padding: 24, minHeight: 380}}><Component {...pageProps} /></div>
            </Content>

            <Footer style={{textAlign: 'center'}}>
                Johny NFT Market ©2022 Created by Jan Pavlát
            </Footer>
        </Layout>

    );
}

export default App
