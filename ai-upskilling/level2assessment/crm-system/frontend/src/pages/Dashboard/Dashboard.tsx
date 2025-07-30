import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  TrendingUp,
  People,
  AttachMoney,
  Analytics,
  AutoAwesome,
  Notifications,
  Assignment,
  Schedule,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchCustomers } from '../../store/slices/customerSlice';
import { fetchOpportunities } from '../../store/slices/salesSlice';
import { fetchNotifications } from '../../store/slices/notificationSlice';
import MetricCard from '../../components/Dashboard/MetricCard';
import AIInsightsCard from '../../components/Dashboard/AIInsightsCard';
import RecentActivityCard from '../../components/Dashboard/RecentActivityCard';
import SalesChart from '../../components/Charts/SalesChart';
import CustomerChart from '../../components/Charts/CustomerChart';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  
  const { customers } = useSelector((state: RootState) => state.customers);
  const { opportunities } = useSelector((state: RootState) => state.sales);
  const { notifications } = useSelector((state: RootState) => state.notifications);

  useEffect(() => {
    dispatch(fetchCustomers({ page: 1, limit: 5 }));
    dispatch(fetchOpportunities({ page: 1, limit: 5 }));
    dispatch(fetchNotifications());
  }, [dispatch]);

  const metrics = [
    {
      title: 'Total Customers',
      value: customers.length,
      icon: <People />,
      color: 'primary',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Active Opportunities',
      value: opportunities.length,
      icon: <AttachMoney />,
      color: 'success',
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'AI Insights',
      value: '24/7',
      icon: <AutoAwesome />,
      color: 'secondary',
      trend: 'Real-time',
      trendUp: true,
    },
    {
      title: 'Notifications',
      value: notifications.length,
      icon: <Notifications />,
      color: 'warning',
      trend: '+5',
      trendUp: false,
    },
  ];

  const aiInsights = [
    {
      title: 'Lead Scoring',
      description: 'AI-powered lead scoring identifies high-value prospects',
      confidence: 95,
      status: 'Active',
    },
    {
      title: 'Sales Predictions',
      description: 'Machine learning predicts deal closure probability',
      confidence: 87,
      status: 'Active',
    },
    {
      title: 'Customer Segmentation',
      description: 'AI segments customers for targeted marketing',
      confidence: 92,
      status: 'Active',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-Powered CRM System Overview
        </Typography>
      </Box>

      {/* Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard {...metric} />
          </Grid>
        ))}
      </Grid>

      {/* Charts and AI Insights */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6">Sales Analytics</Typography>
                <Chip
                  label="AI-Powered"
                  size="small"
                  color="secondary"
                  icon={<AutoAwesome />}
                  sx={{ ml: 'auto' }}
                />
              </Box>
              <SalesChart />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ mr: 1, color: theme.palette.success.main }} />
                <Typography variant="h6">Customer Growth</Typography>
              </Box>
              <CustomerChart />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI Insights and Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <AIInsightsCard insights={aiInsights} />
        </Grid>
        
        <Grid item xs={12} lg={6}>
          <RecentActivityCard />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, mx: 'auto', mb: 1 }}>
                  <People />
                </Avatar>
                <Typography variant="body2">Add Customer</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: theme.palette.success.main, mx: 'auto', mb: 1 }}>
                  <AttachMoney />
                </Avatar>
                <Typography variant="body2">Create Opportunity</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: theme.palette.secondary.main, mx: 'auto', mb: 1 }}>
                  <Analytics />
                </Avatar>
                <Typography variant="body2">View Analytics</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ cursor: 'pointer', '&:hover': { elevation: 4 } }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: theme.palette.warning.main, mx: 'auto', mb: 1 }}>
                  <Assignment />
                </Avatar>
                <Typography variant="body2">Create Task</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard; 