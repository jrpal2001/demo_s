import { createContext, useState } from "react";

export const TabConfigContext = createContext({
    selectedTab: 0,
    setSelectedTab: () => {}
});

export const TabConfigProvider = ({ children }) => {
    const [ selectedTab, setSelectedTab ] = useState(0);
    const tabConfigContextValue = { selectedTab, setSelectedTab};

    return (
        <TabConfigContext.Provider value={ tabConfigContextValue }>
            { children }
        </TabConfigContext.Provider>
    )
}