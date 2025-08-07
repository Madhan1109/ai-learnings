import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Psychology,
  Timeline,
  AttachMoney,
  People,
  CalendarToday,
  CheckCircle,
  Warning,
} from '@mui/icons-material';

interface Prediction {
  id: string;
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  timeframe: string;
  trend: 'up' | 'down' | 'stable';
  factors: string[];
}

interface PredictiveAnalyticsProps {
  predictions?: Prediction[] | any;
}

const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ predictions }) => {
  // Ensure predictions is an array
  const predictionsArray = Array.isArray(predictions) ? predictions : [];
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number | undefined) => {
    if (value === undefined || value === null) {
      return '0.0%';
    }
    return `${value.toFixed(1)}%`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp color="success" />;
      case 'down': return <TrendingDown color="error" />;
      case 'stable': return <Timeline color="info" />;
      default: return <Timeline />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'success';
      case 'down': return 'error';
      case 'stable': return 'info';
      default: return 'default';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'success';
    if (confidence >= 60) return 'warning';
    return 'error';
  };

  const getMetricIcon = (metric: string) => {
    switch (metric.toLowerCase()) {
      case 'revenue': return <AttachMoney />;
      case 'customers': return <People />;
      case 'conversion': return <Psychology />;
      case 'velocity': return <Timeline />;
      default: return <Timeline />;
    }
  };

  const calculateGrowth = (current: number | undefined, predicted: number | undefined) => {
    if (current === undefined || current === null || predicted === undefined || predicted === null) {
      return 0;
    }
    if (current === 0) {
      return predicted > 0 ? 100 : 0;
    }
    return ((predicted - current) / current) * 100;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Psychology color="secondary" />
        <Typography variant="h6">Predictive Analytics</Typography>
      </Box>

      <Grid container spacing={3}>
        {predictionsArray.map((prediction) => {
          const growth = calculateGrowth(prediction?.currentValue, prediction?.predictedValue);
          
          return (
            <Grid item xs={12} md={6} key={prediction?.id || Math.random()}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                      {getMetricIcon(prediction?.metric || '')}
                    </Avatar>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={prediction?.timeframe || 'N/A'}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Chip
                        label={prediction?.trend || 'stable'}
                        size="small"
                        color={getTrendColor(prediction?.trend || 'stable') as any}
                        icon={getTrendIcon(prediction?.trend || 'stable')}
                      />
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {prediction?.metric || 'Unknown Metric'}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Current
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {prediction?.metric?.toLowerCase().includes('revenue') 
                          ? formatCurrency(prediction?.currentValue)
                          : prediction?.metric?.toLowerCase().includes('conversion')
                          ? formatPercentage(prediction?.currentValue)
                          : (prediction?.currentValue || 0).toLocaleString()}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" color="text.secondary">
                        Predicted
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                        {prediction?.metric?.toLowerCase().includes('revenue') 
                          ? formatCurrency(prediction?.predictedValue)
                          : prediction?.metric?.toLowerCase().includes('conversion')
                          ? formatPercentage(prediction?.predictedValue)
                          : (prediction?.predictedValue || 0).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Growth
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color={growth >= 0 ? 'success.main' : 'error.main'}
                        sx={{ fontWeight: 'bold' }}
                      >
                        {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.abs(growth)}
                      color={growth >= 0 ? 'success' : 'error'}
                      sx={{ height: 4, borderRadius: 2 }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        AI Confidence
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {prediction?.confidence || 0}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={prediction?.confidence || 0}
                      color={getConfidenceColor(prediction?.confidence || 0)}
                      sx={{ height: 4, borderRadius: 2 }}
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Key Factors
                  </Typography>
                  <List dense sx={{ p: 0 }}>
                    {(prediction?.factors || []).map((factor: string, index: number) => (
                      <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <CheckCircle fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={factor}
                          primaryTypographyProps={{ variant: 'caption' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {predictionsArray.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Psychology sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              No Predictions Available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI is analyzing patterns. Predictions will appear here.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default PredictiveAnalytics; 