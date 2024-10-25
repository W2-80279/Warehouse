import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import FlexBetween from './FlexBetween';

// Dummy data representing racks and their slots
const data = [
  { rack: 'Rack 1', SlotA: 70, SlotB: 90, SlotC: 50 },
  { rack: 'Rack 2', SlotA: 30, SlotB: 80 },
  { rack: 'Rack 3', SlotA: 60, SlotB: 20, SlotC: 40 },
  { rack: 'Rack 4', SlotA: 40, SlotB: 50, SlotC: 80 }
];

const RackUtilizationChart = () => {
  return (
    <div style={{ width: '100%', height: 250 ,FlexBetween}}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20}} sx={{FlexBetween}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rack" />
          <YAxis />
          <Tooltip />
          <Legend />
          {/* Bars for each slot, stacked on top of each other */}
          <Bar dataKey="SlotA" stackId="a" fill="#8884d8" name="Slot A" />
          <Bar dataKey="SlotB" stackId="a" fill="#82ca9d" name="Slot B" />
          <Bar dataKey="SlotC" stackId="a" fill="#ffc658" name="Slot C" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RackUtilizationChart;
