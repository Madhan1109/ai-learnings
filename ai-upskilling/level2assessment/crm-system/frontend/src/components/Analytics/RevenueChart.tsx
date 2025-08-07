import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

interface RevenueDataPoint {
  date: string;
  revenue: number;
  target: number;
}

interface RevenueChartProps {
  data?: RevenueDataPoint[];
  type?: 'line' | 'bar';
  title?: string;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

const RevenueChart: React.FC<RevenueChartProps> = ({
  data = [],
  type = 'line',
  title = 'Revenue Analytics',
  period = '30d',
  onPeriodChange,
}) => {
  // Transform data to Chart.js format
  const chartData = {
    labels: (data || []).map(item => item.date) || [],
    datasets: [
      {
        label: 'Revenue',
        data: (data || []).map(item => item.revenue) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
      {
        label: 'Target',
        data: (data || []).map(item => item.target) || [],
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
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={title}
        action={
          onPeriodChange && (
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Period</InputLabel>
              <Select
                value={period}
                label="Period"
                onChange={(e) => onPeriodChange(e.target.value)}
              >
                <MenuItem value="7d">Last 7 days</MenuItem>
                <MenuItem value="30d">Last 30 days</MenuItem>
                <MenuItem value="90d">Last 90 days</MenuItem>
                <MenuItem value="1y">Last year</MenuItem>
              </Select>
            </FormControl>
          )
        }
      />
      <CardContent>
        <Box sx={{ height: 300 }}>
          {type === 'line' ? (
            <Line data={chartData} options={options} />
          ) : (
            <Bar data={chartData} options={options} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RevenueChart; 