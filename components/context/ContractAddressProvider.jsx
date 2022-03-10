import {ContractAddressContext} from "./ContractAddressContext";

export const ContractAddressProvider = ({...props}) => {
    return <ContractAddressContext.Provider
        value={{
            marketAddress: process.env.NEXT_PUBLIC_MARKET_ADDRESS,
            tokenAddress: process.env.NEXT_PUBLIC_TOKEN_ADDRESS,
        }}
        {...props}
    />;
};