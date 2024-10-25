import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { useTheme } from '@mui/material/styles'; // Import useTheme from MUI

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);

const RackSlotChart = () => {
  const [rackData, setRackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error handling
  const theme = useTheme(); // Access the theme

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token'); // Get token from local storage
      try {
        const response = await fetch('http://localhost:5000/api/rack-slots', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setRackData(data);
      } catch (error) {
        setError(error.message); // Set error message if fetch fails
      } finally {
        setLoading(false); // Set loading to false regardless of success or failure
      }
    };

    fetchData();
  }, []);

  // Group slots by rack
  const groupedData = rackData.reduce((acc, slot) => {
    const rackCode = slot.Rack.rackCode;
    if (!acc[rackCode]) {
      acc[rackCode] = [];
    }
    acc[rackCode].push({
      slotLabel: slot.slotLabel,
      slotCapacity: slot.slotCapacity,
      currentCapacity: slot.currentCapacity,
    });
    return acc;
  }, {});

  // Prepare data for the chart
  const labels = [];
  const slotCapacities = [];
  const currentCapacities = [];

  for (const [rackCode, slots] of Object.entries(groupedData)) {
    slots.forEach((slot) => {
      labels.push(`${rackCode} - ${slot.slotLabel}`);
      slotCapacities.push(slot.slotCapacity);
      currentCapacities.push(slot.currentCapacity);
    });
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Slot Capacity',
        data: slotCapacities,
        backgroundColor: theme.palette.primary.light, // Use theme color
        borderColor: theme.palette.primary.dark, // Use theme color
        borderWidth: 1,
        tension: 0.1,
        fill: true, // Enable filling under the line
      },
      {
        label: 'Available Capacity',
        data: currentCapacities,
        backgroundColor: theme.palette.secondary.main, // Use theme color
        borderColor: theme.palette.secondary.light, // Use theme color
        borderWidth: 1,
        tension: 0.1,
        fill: true, // Enable filling under the line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000, // Animation duration
      easing: 'easeOutBounce', // Animation easing
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Racks and Slots',
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 20, // Limit the number of ticks on the X-axis
        },
      },
      y: {
        title: {
          display: true,
          text: 'Capacity',
        },
        beginAtZero: true,
        ticks: {
          stepSize: Math.ceil(Math.max(...slotCapacities, ...currentCapacities) / 5), // Dynamic step size
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw;
            return `${label}: ${value}`; // Show label and value in tooltip
          },
        },
      },
      title: {
        display: true,
        text: 'Rack Slot Capacity Visualization',
      },
    },
  };

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error}</div>; // Display error message
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: theme.palette.background.alt }}>
      {labels.length === 0 ? (
        <div>No data available for the chart.</div> // Handle empty data case
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
};

export default RackSlotChart;
