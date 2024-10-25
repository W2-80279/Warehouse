import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Tooltip, Cell } from 'recharts';

const BreakdownChart = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('token'); // Get token from localStorage
      try {
        const response = await axios.get('http://localhost:5000/api/categories', {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token in headers
          },
        });
        setCategories(response.data); // Set the data to state
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  // Function to generate a set of unique gradient colors
  const generateGradients = (num) => {
    const gradients = [];
    for (let i = 0; i < num; i++) {
      const hueStart = (i * 360) / num; // Start hue for gradient
      const hueEnd = ((i + 1) * 360) / num; // End hue for gradient
      gradients.push(
        `url(#gradient-${i})` // Generate URL for gradient reference
      );
    }
    return gradients;
  };

  // Prepare data for the chart
  const chartData = categories.map((category) => ({
    name: category.categoryName,
    value: category.count || 1, // Replace this with actual category count if available
  }));

  // Generate gradients based on the number of categories
  const gradients = generateGradients(chartData.length);

  return (
    <PieChart height={300} width={300}>
      <defs>
        {chartData.map((entry, index) => (
          <linearGradient id={`gradient-${index}`} key={index} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={`hsl(${(index * 360) / chartData.length}, 70%, 50%)`} />
            <stop offset="100%" stopColor={`hsl(${((index + 1) * 360) / chartData.length}, 70%, 50%)`} />
          </linearGradient>
        ))}
      </defs>
      <Pie
        data={chartData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={120}
        fill="#8884d8"
        animationDuration={800} // Animation time in milliseconds
      >
        {chartData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
        ))}
      </Pie>
      <Tooltip 
        content={({ active, payload }) => {
          if (active && payload && payload.length) {
            return <div className="custom-tooltip">{payload[0].name}</div>; // Show only the category name
          }
          return null;
        }} 
      />
    </PieChart>
  );
};

export default BreakdownChart;
