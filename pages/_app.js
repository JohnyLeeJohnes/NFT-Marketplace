import React from 'react';
import Link from 'next/link'
import '../styles/globals.css'
import 'antd/dist/antd.css';
import {Menu, Space, Typography} from 'antd';
import {WalletOutlined, HomeOutlined, DashboardOutlined, UnorderedListOutlined} from '@ant-design/icons';

const {Title} = Typography;

function App({Component, pageProps}) {
    return (
        <div>
            <Space direction="horizontal" style={{width: '100%', justifyContent: 'center'}}>
                <Typography>
                    <Title>Welcome to Johny NFT Marketplace</Title>
                </Typography>
            </Space>

            <Menu mode="horizontal" style={{justifyContent: 'center'}}>
                <Menu.Item key="home" icon={<HomeOutlined/>}>
                    <Link href="/home">
                        <a>Home</a>
                    </Link>
                </Menu.Item>
                <Menu.Item key="dashboard" icon={<DashboardOutlined/>}>
                    <Link href="/dashboard">
                        <a>NFT Dashboard</a>
                    </Link>
                </Menu.Item>
                <Menu.Item key="sell" icon={<WalletOutlined/>}>
                    <Link href="/sell">
                        <a>Sell NFT</a>
                    </Link>
                </Menu.Item>
                <Menu.Item key="collection" icon={<UnorderedListOutlined/>}>
                    <Link href="/collection">
                        <a>My NFTs</a>
                    </Link>
                </Menu.Item>
            </Menu>
            <Component {...pageProps} />

        </div>
    )
        ;
}

export default App
