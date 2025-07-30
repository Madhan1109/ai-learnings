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
  DoughnutController,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  DoughnutController,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface CustomerData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    tension?: number;
  }[];
}

interface CustomerChartProps {
  data: CustomerData;
  type?: 'line' | 'doughnut';
  title?: string;
  period?: string;
  onPeriodChange?: (period: string) => void;
}

const CustomerChart: React.FC<CustomerChartProps> = ({
  data,
  type = 'line',
  title = 'Customer Analytics',
  period = '30d',
  onPeriodChange,
}) => {
  const lineOptions = {
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

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: false,
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
            <Line data={data} options={lineOptions} />
          ) : (
            <Doughnut data={data} options={doughnutOptions} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomerChart; 