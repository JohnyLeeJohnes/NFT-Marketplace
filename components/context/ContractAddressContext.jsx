import {createContext, useContext} from "react";

export const ContractAddressContext = createContext(null);

export const useContractAddressContext = () => useContext(ContractAddressContext);
