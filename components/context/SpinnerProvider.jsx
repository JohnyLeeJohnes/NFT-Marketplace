import {useEffect, useState} from "react";
import {SpinnerContext} from "./SpinnerContext";

export const SpinnerProvider = ({defaultSpinning = false, ...props}) => {
    const [spinning, setSpinning] = useState(defaultSpinning);
    return <SpinnerContext.Provider
        value={{
            spinning,
            setSpinning,
            useSpinning: spinning => {
                useEffect(() => {
                    const id = setTimeout(() => setSpinning(spinning), 0);
                    return () => clearTimeout(id);
                }, [spinning]);
            }
        }}
        {...props}
    />;
};