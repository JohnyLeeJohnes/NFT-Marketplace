import React from 'react';
import Link from 'next/link';
import 'antd/dist/antd.css';
import {Divider, Image, Menu} from 'antd';
import {DashboardOutlined, HomeOutlined, UnorderedListOutlined, WalletOutlined} from '@ant-design/icons';
import {useTranslation} from "../utils/use-translations";
import logo from "../public/logo-black.svg";
import {CenterWrapper} from "../components";


function App({Component, pageProps}) {
    const {t} = useTranslation()

    return (
        <div>
            <CenterWrapper>
                <Image src={logo} width={500} preview={false} alt={"Logo"}/>
            </CenterWrapper>

            <Menu mode={"horizontal"} style={{justifyContent: 'center'}}>
                <Menu.Item key={"home"} icon={<HomeOutlined/>}>
                    <Link href={"/home"}>
                        <a>{t("My NFTs")}</a>
                    </Link>
                </Menu.Item>
                <Menu.Item key={"dashboard"} icon={<DashboardOutlined/>}>
                    <Link href={"/dashboard"}>
                        <a>{t("NFT Dashboard")}</a>
                    </Link>
                </Menu.Item>
                <Menu.Item key={"sell"} icon={<WalletOutlined/>}>
                    <Link href={"/sell"}>
                        <a>{t("Sell NFT")}</a>
                    </Link>
                </Menu.Item>
                <Menu.Item key={"collection"} icon={<UnorderedListOutlined/>}>
                    <Link href={"/collection"}>
                        <a>{t("My NFTs")}</a>
                    </Link>
                </Menu.Item>
            </Menu>
            <Component {...pageProps} />

        </div>
    )
}

export default App
