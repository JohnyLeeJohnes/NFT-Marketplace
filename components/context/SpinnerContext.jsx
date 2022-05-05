import {createContext, useContext} from "react";

export const SpinnerContext = createContext(null);

export const useSpinnerContext = () => useContext(SpinnerContext);
