import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const RackItemContext = createContext();

export const useRackItemContext = () => {
  return useContext(RackItemContext);
};

export const RackItemProvider = ({ children }) => {
  const [rackItems, setRackItems] = useState([]);
  const token = localStorage.getItem('token'); // Ensure token is fetched here

  const fetchRackItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/rack-items', { headers: { Authorization: `Bearer ${token}` } });
      setRackItems(response.data);
    } catch (error) {
      console.error('Error fetching rack items:', error);
    }
  };

  useEffect(() => {
    fetchRackItems();
  }, [token]); // Fetch items when token changes

  return (
    <RackItemContext.Provider value={{ rackItems, setRackItems }}>
      {children}
    </RackItemContext.Provider>
  );
};
