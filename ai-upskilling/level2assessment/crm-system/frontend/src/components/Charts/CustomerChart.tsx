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

interface CustomerDataPoint {
  date: string;
  customers: number;
  leads: number;
}

interface CustomerChartProps {
  data?: CustomerDataPoint[];
}

const CustomerChart: React.FC<CustomerChartProps> = ({ data = [] }) => {
  // Transform data to Chart.js format
  const chartData = {
    labels: (data || []).map(item => item.date) || [],
    datasets: [
      {
        label: 'Customers',
        data: (data || []).map(item => item.customers) || [],
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Leads',
        data: (data || []).map(item => item.leads) || [],
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
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
      <CardHeader title="Customer Analytics" />
      <CardContent>
        <Box sx={{ height: 300 }}>
          <Line data={chartData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomerChart; 