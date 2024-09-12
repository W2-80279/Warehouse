// src/pages/management/RackItemContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the context
const RackItemContext = createContext();

// Provide the context to children components
export const RackItemProvider = ({ children }) => {
  const [rackItems, setRackItems] = useState([]);

  return (
    <RackItemContext.Provider value={{ rackItems, setRackItems }}>
      {children}
    </RackItemContext.Provider>
  );
};

// Custom hook to use the context
export const useRackItemContext = () => useContext(RackItemContext);

// Export the context itself for use in components
export { RackItemContext };
