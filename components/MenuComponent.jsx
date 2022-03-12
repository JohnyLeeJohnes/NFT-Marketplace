import {Menu} from "antd";
import {DashboardOutlined, HomeOutlined, PlusOutlined, UnorderedListOutlined} from "@ant-design/icons";
import Link from "next/link";
import {useTranslation} from "../utils/use-translations";
import {useMenuSelectionContext} from "./context";
import {FaExchangeAlt} from 'react-icons/fa';


export function MenuComponent(props) {
    const {t} = useTranslation()
    const menuSelection = useMenuSelectionContext()

    return (
        <Menu theme="light"
              mode="horizontal"
              selectedKeys={menuSelection.selection}
              defaultSelectedKeys={["/"]}
              style={{justifyContent: 'center'}}
              {...props}
        >
            <Menu.Item
                key={"/"}
                icon={<HomeOutlined/>}>
                <Link href={"/"}>
                    <a>{t("Home")}</a>
                </Link>
            </Menu.Item>
            <Menu.Item
                key={"/market"}
                icon={<FaExchangeAlt/>}>
                <Link href={"/market"}>
                    <a>{t("NFT Market")}</a>
                </Link>
            </Menu.Item>
            <Menu.Item
                key={"/create"}
                icon={<PlusOutlined/>}>
                <Link href={"/create"}>
                    <a>{t("Create NFT")}</a>
                </Link>
            </Menu.Item>
            <Menu.Item
                key={"/collection"}
                icon={<UnorderedListOutlined/>}>
                <Link href={"/collection"}>
                    <a>{t("Owned NFTs")}</a>
                </Link>
            </Menu.Item>
            <Menu.Item
                key={"/dashboard"}
                icon={<DashboardOutlined/>}>
                <Link href={"/dashboard"}>
                    <a>{t("Creators Dashboard")}</a>
                </Link>
            </Menu.Item>
        </Menu>
    )
}