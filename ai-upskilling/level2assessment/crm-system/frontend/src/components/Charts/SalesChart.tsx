import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

interface SalesChartProps {
  data?: any;
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sales Chart
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Sales chart component placeholder
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SalesChart; 