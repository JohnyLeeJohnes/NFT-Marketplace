import {createContext, useContext} from "react";

export const MenuSelectionContext = createContext(null);

export const useMenuSelectionContext = () => useContext(MenuSelectionContext);
