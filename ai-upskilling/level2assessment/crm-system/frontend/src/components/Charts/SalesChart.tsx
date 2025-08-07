import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalesDataPoint {
  date: string;
  opportunities: number;
  closed: number;
}

interface SalesChartProps {
  data?: SalesDataPoint[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data = [] }) => {
  // Transform data to Chart.js format
  const chartData = {
    labels: (data || []).map(item => item.date) || [],
    datasets: [
      {
        label: 'Opportunities',
        data: (data || []).map(item => item.opportunities) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Closed Deals',
        data: (data || []).map(item => item.closed) || [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Sales Analytics" />
      <CardContent>
        <Box sx={{ height: 300 }}>
          <Line data={chartData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesChart; 