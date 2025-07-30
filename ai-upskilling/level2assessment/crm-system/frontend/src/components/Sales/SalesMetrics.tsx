import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  People,
  Timeline,
  CheckCircle,
  Warning,
  Cancel,
} from '@mui/icons-material';

interface SalesMetricsProps {
  metrics: {
    totalRevenue: number;
    totalOpportunities: number;
    winRate: number;
    averageDealSize: number;
    pipelineValue: number;
    conversionRate: number;
    salesVelocity: number;
    quotaAttainment: number;
  };
}

const SalesMetrics: React.FC<SalesMetricsProps> = ({ metrics }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getGrowthColor = (value: number) => {
    return value >= 0 ? 'success' : 'error';
  };

  const getGrowthIcon = (value: number) => {
    return value >= 0 ? <TrendingUp /> : <TrendingDown />;
  };

  const metricCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      icon: <AttachMoney />,
      color: 'success',
      trend: '+12.5%',
      trendUp: true,
    },
    {
      title: 'Pipeline Value',
      value: formatCurrency(metrics.pipelineValue),
      icon: <Timeline />,
      color: 'primary',
      trend: '+8.3%',
      trendUp: true,
    },
    {
      title: 'Win Rate',
      value: formatPercentage(metrics.winRate),
      icon: <CheckCircle />,
      color: 'success',
      trend: '+2.1%',
      trendUp: true,
    },
    {
      title: 'Average Deal Size',
      value: formatCurrency(metrics.averageDealSize),
      icon: <AttachMoney />,
      color: 'info',
      trend: '+5.7%',
      trendUp: true,
    },
    {
      title: 'Conversion Rate',
      value: formatPercentage(metrics.conversionRate),
      icon: <People />,
      color: 'warning',
      trend: '+1.8%',
      trendUp: true,
    },
    {
      title: 'Sales Velocity',
      value: `${metrics.salesVelocity} days`,
      icon: <Timeline />,
      color: 'secondary',
      trend: '-2.3%',
      trendUp: false,
    },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Sales Performance Metrics
      </Typography>
      
      <Grid container spacing={3}>
        {metricCards.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${metric.color}.light`, color: `${metric.color}.main` }}>
                    {metric.icon}
                  </Avatar>
                  <Chip
                    label={metric.trend}
                    size="small"
                    icon={getGrowthIcon(metric.trendUp ? 1 : -1)}
                    color={getGrowthColor(metric.trendUp ? 1 : -1)}
                    variant="outlined"
                  />
                </Box>
                
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {metric.value}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  {metric.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Quota Attainment */}
      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quota Attainment
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                  {formatPercentage(metrics.quotaAttainment)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  of annual quota achieved
                </Typography>
              </Box>
              
              <Avatar sx={{ bgcolor: metrics.quotaAttainment >= 100 ? 'success.main' : 'warning.main' }}>
                {metrics.quotaAttainment >= 100 ? <CheckCircle /> : <Warning />}
              </Avatar>
            </Box>
            
            <LinearProgress
              variant="determinate"
              value={Math.min(metrics.quotaAttainment, 100)}
              color={metrics.quotaAttainment >= 100 ? 'success' : 'primary'}
              sx={{ height: 8, borderRadius: 4 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                0%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                100%
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
      
      {/* Performance Summary */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Performance Summary
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Total Opportunities</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {metrics.totalOpportunities}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Won Deals</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {Math.round((metrics.winRate / 100) * metrics.totalOpportunities)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Lost Deals</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                    {Math.round(((100 - metrics.winRate) / 100) * metrics.totalOpportunities)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Active Pipeline</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {Math.round((metrics.conversionRate / 100) * metrics.totalOpportunities)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Key Insights
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <CheckCircle color="success" fontSize="small" />
                  <Typography variant="body2">
                    Win rate is above industry average
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TrendingUp color="success" fontSize="small" />
                  <Typography variant="body2">
                    Pipeline value growing steadily
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Warning color="warning" fontSize="small" />
                  <Typography variant="body2">
                    Sales velocity needs improvement
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney color="info" fontSize="small" />
                  <Typography variant="body2">
                    Average deal size increasing
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default SalesMetrics; 