import React from 'react';
import Link from 'next/link'
import 'antd/dist/antd.css';
import {Menu, Image, Space, Typography} from 'antd';
import {WalletOutlined, HomeOutlined, DashboardOutlined, UnorderedListOutlined} from '@ant-design/icons';
import {useTranslation} from "../utils/use-translations";
import logo from "../public/logo.PNG"

const {Title} = Typography;

function App({Component, pageProps}) {
    const {t} = useTranslation()

    return (
        <div>
            <Space direction="horizontal" style={{width: '100%', justifyContent: 'center'}}>
                <Typography>
                    <Title>Welcome to Johny NFT Marketplace</Title>
                </Typography>
            </Space>
            <Image width={100} src={logo}/>

            <Menu mode="horizontal" style={{justifyContent: 'center'}}>
                <Menu.Item key="home" icon={<HomeOutlined/>}>
                    <Link href="/home">
                        <a>{t("My NFTs")}</a>
                    </Link>
                </Menu.Item>
                <Menu.Item key="dashboard" icon={<DashboardOutlined/>}>
                    <Link href="/dashboard">
                        <a>{t("NFT Dashboard")}</a>
                    </Link>
                </Menu.Item>
                <Menu.Item key="sell" icon={<WalletOutlined/>}>
                    <Link href="/sell">
                        <a>{t("Sell NFT")}</a>
                    </Link>
                </Menu.Item>
                <Menu.Item key="collection" icon={<UnorderedListOutlined/>}>
                    <Link href="/collection">
                        <a>{t("My NFTs")}</a>
                    </Link>
                </Menu.Item>
            </Menu>
            <Component {...pageProps} />

        </div>
    )
        ;
}

export default App
