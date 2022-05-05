import {ContractAddressContext} from "./ContractAddressContext";

export const ContractAddressProvider = ({...props}) => {
    return <ContractAddressContext.Provider
        value={ContractAddressesFunction()}
        {...props}
    />;
};

export const ContractAddressesFunction = () => ({
    marketAddress: process.env.NEXT_PUBLIC_MARKET_ADDRESS,
    tokenAddress: process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
    metaMask: process.env.NEXT_PUBLIC_METAMASK_KEY,
})