import {Menu} from "antd";
import {DashboardOutlined, HomeOutlined, UnorderedListOutlined, WalletOutlined} from "@ant-design/icons";
import Link from "next/link";
import {useTranslation} from "../utils/use-translations";
import {useMenuSelectionContext} from "./context";

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
                    <a>{t("Market")}</a>
                </Link>
            </Menu.Item>
            <Menu.Item
                key={"/create"}
                icon={<WalletOutlined/>}>
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
                    <a>{t("Created NFTs")}</a>
                </Link>
            </Menu.Item>
        </Menu>
    )
}