import axios from 'axios';

const API_URL = 'http://localhost:5000/api/stock-movements'; // Update if necessary

export const getStockMovements = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createStockMovement = async (data) => {
    const response = await axios.post(API_URL, data);
    return response.data;
};
