import React, { createContext, useContext, useState } from 'react';

const RackItemContext = createContext();

export const RackItemProvider = ({ children }) => {
    const [rackItems, setRackItems] = useState([]);

    return (
        <RackItemContext.Provider value={{ rackItems, setRackItems }}>
            {children}
        </RackItemContext.Provider>
    );
};

export const useRackItemContext = () => {
    return useContext(RackItemContext);
};
