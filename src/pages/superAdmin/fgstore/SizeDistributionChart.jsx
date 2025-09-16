'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const SIZES = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl'];
const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff8042',
  '#0088fe',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#AF19FF',
];

const SizeDistributionChart = ({ data }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setChartData([]);
      return;
    }

    // Aggregate size data across all records
    const aggregatedSizes = SIZES.map((size, index) => ({
      name: size.toUpperCase(),
      quantity: data.reduce((sum, item) => sum + (item[size] || 0), 0),
      color: COLORS[index % COLORS.length],
    }));

    setChartData(aggregatedSizes.filter((item) => item.quantity > 0));
  }, [data]);

  if (!chartData.length) {
    return null;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Size Distribution
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default SizeDistributionChart;
