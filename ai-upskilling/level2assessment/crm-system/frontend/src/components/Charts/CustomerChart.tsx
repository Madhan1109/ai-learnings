import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface CustomerChartProps {
  data?: any;
}

const CustomerChart: React.FC<CustomerChartProps> = ({ data }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Customer Chart
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Customer chart component placeholder
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CustomerChart; 