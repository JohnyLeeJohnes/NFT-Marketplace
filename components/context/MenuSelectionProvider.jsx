import {useEffect, useState} from "react";
import {MenuSelectionContext} from "./MenuSelectionContext";

export const MenuSelectionProvider = ({defaultSelection = [], ...props}) => {
    const [selection, setSelection] = useState(defaultSelection);
    return <MenuSelectionContext.Provider
        value={{
            selection,
            useSelection: selection => {
                useEffect(() => {
                    const id = setTimeout(() => setSelection(selection), 0);
                    return () => clearTimeout(id);
                }, selection);
            }
        }}
        {...props}
    />;
};