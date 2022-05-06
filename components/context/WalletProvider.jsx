import {useEffect, useState} from "react";
import {WalletContext} from "./WalletContext";
import Web3Modal from "web3modal";
import {ethers} from "ethers";
import {message} from "antd";

export const WalletProvider = ({children, ...props}) => {
    const [account, setAccount] = useState();

    useEffect(() => {
        callWalletModal().then().catch(async e => {
            console.error(e)
            await message.error({
                content: `There was `,
                duration: 3
            });
        })
    }, [])

    //Ping users wallet -> connect with webapp
    async function callWalletModal() {
        const web3Modal = new Web3Modal()
        const instance = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(instance)
        const signer = provider.getSigner()
        signer.getAddress().then(async r => {
            setAccount(r)
            await message.success({
                content: `You are logged in with: ${r}`,
                duration: 3
            });
        })
    }

    return <WalletContext.Provider
        value={{
            account,
            setAccount,
            callWalletModal
        }}
        {...props}
    >
        {children}
    </WalletContext.Provider>
};