// src/components/Analytics/Reports.jsx
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { Typography } from '@mui/material';

const Reports = () => {
  const data = [
    { month: 'Jan', communications: 65 },
    { month: 'Feb', communications: 59 },
    { month: 'Mar', communications: 80 },
    { month: 'Apr', communications: 81 },
    { month: 'May', communications: 56 },
    { month: 'Jun', communications: 55 }
  ];

  return (
    <div>
      <Typography variant="h6" className="mb-4">
        Communication Reports
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="communications" 
            stroke="#8884d8" 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Reports;