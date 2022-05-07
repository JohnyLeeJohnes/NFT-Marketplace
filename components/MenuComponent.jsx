import {Menu} from "antd";
import {DashboardOutlined, HomeOutlined, PlusOutlined, UnorderedListOutlined} from "@ant-design/icons";
import Link from "next/link";
import {useTranslation} from "../utils/use-translations";
import {useMenuSelectionContext} from "./context";
import {FaExchangeAlt} from 'react-icons/fa';

export function MenuComponent(props) {
    const {t} = useTranslation()
    const menuSelection = useMenuSelectionContext()

    const menuItems = [
        {
            key: "/",
            icon: <HomeOutlined/>,
            label: (
                <Link href={"/"}>
                    <a>{t("Home")}</a>
                </Link>
            )
        },
        {
            key: "/market",
            icon: <FaExchangeAlt/>,
            label: (
                <Link href={"/market"}>
                    <a>{t("NFT Market")}</a>
                </Link>
            )
        },
        {
            key: "/create",
            icon: <PlusOutlined/>,
            label: (
                <Link href={"/create"}>
                    <a>{t("Create NFT")}</a>
                </Link>
            )
        },
        {
            key: "/collection",
            icon: <UnorderedListOutlined/>,
            label: (
                <Link href={"/collection"}>
                    <a>{t("Owned NFTs")}</a>
                </Link>
            )
        },
        {
            key: "/dashboard",
            icon: <DashboardOutlined/>,
            label: (
                <Link href={"/dashboard"}>
                    <a>{t("Creators Dashboard")}</a>
                </Link>
            )
        },
    ]


    return (
        <Menu theme="light"
              mode="horizontal"
              selectedKeys={menuSelection.selection}
              defaultSelectedKeys={["/"]}
              items={menuItems}
              {...props}
        />
    )
}