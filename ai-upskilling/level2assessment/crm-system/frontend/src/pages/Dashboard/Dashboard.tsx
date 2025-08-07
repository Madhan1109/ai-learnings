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
  Container,
  Paper,
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
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { fetchCustomers } from '../../store/slices/customerSlice';
import { fetchOpportunities } from '../../store/slices/salesSlice';
import { fetchNotifications } from '../../store/slices/notificationSlice';
import { fetchAnalytics } from '../../store/slices/analyticsSlice';
import MetricCard from '../../components/Dashboard/MetricCard';
import AIInsightsCard from '../../components/Dashboard/AIInsightsCard';
import RecentActivityCard from '../../components/Dashboard/RecentActivityCard';
import SalesChart from '../../components/Charts/SalesChart';
import CustomerChart from '../../components/Charts/CustomerChart';

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  
  const { customers } = useSelector((state: RootState) => state.customers);
  const { opportunities } = useSelector((state: RootState) => state.sales);
  const { notifications } = useSelector((state: RootState) => state.notifications);
  const { analytics } = useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    dispatch(fetchCustomers({ page: 1, limit: 5 }));
    dispatch(fetchOpportunities({ page: 1, limit: 10 })); // Fetch more opportunities to get accurate count
    dispatch(fetchNotifications());
    dispatch(fetchAnalytics('30d'));
  }, [dispatch]);

  // Calculate total opportunities count and value from the sales state
  const totalOpportunities = useSelector((state: RootState) => state.sales.pagination.total) || 6; // Fallback to mock data count
  
  // Calculate total value of active opportunities (excluding closed-won and closed-lost)
  const activeOpportunitiesValue = opportunities
    ?.filter(opp => opp.stage !== 'closed-won' && opp.stage !== 'closed-lost')
    ?.reduce((sum, opp) => sum + opp.value, 0) || 845000; // Fallback to calculated value from mock data

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const metrics = [
    {
      title: 'Total Customers',
      value: customers?.length || 0,
      icon: <People />,
      color: 'primary' as const,
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Active Opportunities',
      value: formatCurrency(activeOpportunitiesValue),
      icon: <AttachMoney />,
      color: 'success' as const,
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'AI Insights',
      value: '24/7',
      icon: <AutoAwesome />,
      color: 'secondary' as const,
      trend: 'Real-time',
      trendUp: true,
    },
    {
      title: 'Notifications',
      value: notifications?.length || 0,
      icon: <Notifications />,
      color: 'warning' as const,
      trend: '+5',
      trendUp: false,
    },
  ];

  // Use analytics data or fallback to mock data
  const salesData = analytics?.salesData || [
    { date: 'Jan', opportunities: 12, closed: 8 },
    { date: 'Feb', opportunities: 15, closed: 10 },
    { date: 'Mar', opportunities: 18, closed: 12 },
    { date: 'Apr', opportunities: 22, closed: 15 },
    { date: 'May', opportunities: 25, closed: 18 },
    { date: 'Jun', opportunities: 28, closed: 20 },
  ];

  const customerData = analytics?.customerData || [
    { date: 'Jan', customers: 45, leads: 23 },
    { date: 'Feb', customers: 52, leads: 28 },
    { date: 'Mar', customers: 58, leads: 32 },
    { date: 'Apr', customers: 65, leads: 35 },
    { date: 'May', customers: 72, leads: 38 },
    { date: 'Jun', customers: 78, leads: 42 },
  ];

  const aiInsights = [
    {
      title: 'Lead Scoring',
      description: 'AI-powered lead scoring identifies high-value prospects',
      confidence: 95,
      status: 'Active' as const,
      type: 'success' as const,
    },
    {
      title: 'Sales Predictions',
      description: 'Machine learning predicts deal closure probability',
      confidence: 87,
      status: 'Active' as const,
      type: 'success' as const,
    },
    {
      title: 'Customer Segmentation',
      description: 'AI segments customers for targeted marketing',
      confidence: 92,
      status: 'Active' as const,
      type: 'info' as const,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          opacity: 0.3,
        },
      }}
    >
      {/* Animated background elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '5%',
          right: '5%',
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
        }}
        animate={{
          y: [0, -15, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 4,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: [
                '0 8px 32px rgba(0, 0, 0, 0.1)',
                '0 16px 64px rgba(0, 0, 0, 0.05)',
              ].join(', '),
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <DashboardIcon 
                  sx={{ 
                    fontSize: 40, 
                    color: 'primary.main',
                    mr: 2,
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))',
                  }} 
                />
              </motion.div>
              <Box>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
          Dashboard
        </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ 
                    fontSize: '1.1rem',
                    fontWeight: 500,
                  }}
                >
          AI-Powered CRM System Overview
        </Typography>
      </Box>
            </Box>
          </Paper>
        </motion.div>

      {/* Metrics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
            <MetricCard {...metric} />
                </motion.div>
          </Grid>
        ))}
      </Grid>
        </motion.div>

      {/* Charts and AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: [
                      '0 8px 32px rgba(0, 0, 0, 0.1)',
                      '0 16px 64px rgba(0, 0, 0, 0.05)',
                    ].join(', '),
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <TrendingUp sx={{ mr: 2, color: theme.palette.primary.main, fontSize: 28 }} />
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Sales Analytics
                      </Typography>
                <Chip
                  label="AI-Powered"
                  size="small"
                  color="secondary"
                  icon={<AutoAwesome />}
                        sx={{ 
                          ml: 'auto',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          fontWeight: 600,
                        }}
                />
              </Box>
              <SalesChart data={salesData} />
            </CardContent>
          </Card>
              </motion.div>
        </Grid>
        
        <Grid item xs={12} lg={4}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: [
                      '0 8px 32px rgba(0, 0, 0, 0.1)',
                      '0 16px 64px rgba(0, 0, 0, 0.05)',
                    ].join(', '),
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #4caf50 0%, #66bb6a 50%, #4caf50 100%)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <People sx={{ mr: 2, color: theme.palette.success.main, fontSize: 28 }} />
                      <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Customer Growth
                      </Typography>
              </Box>
              <CustomerChart data={customerData} />
            </CardContent>
          </Card>
              </motion.div>
        </Grid>
      </Grid>
        </motion.div>

      {/* AI Insights and Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={6}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
          <AIInsightsCard insights={aiInsights} />
              </motion.div>
        </Grid>
        
        <Grid item xs={12} lg={6}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.3 }}
              >
          <RecentActivityCard />
              </motion.div>
        </Grid>
      </Grid>
        </motion.div>

      {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: [
                '0 8px 32px rgba(0, 0, 0, 0.1)',
                '0 16px 64px rgba(0, 0, 0, 0.05)',
              ].join(', '),
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 3,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
          Quick Actions
        </Typography>
            <Grid container spacing={3}>
              {[
                { icon: <People />, title: 'Add Customer', color: 'primary.main' },
                { icon: <AttachMoney />, title: 'Create Opportunity', color: 'success.main' },
                { icon: <Analytics />, title: 'View Analytics', color: 'secondary.main' },
                { icon: <Assignment />, title: 'Create Task', color: 'warning.main' },
              ].map((action, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.95)',
                          boxShadow: [
                            '0 8px 32px rgba(0, 0, 0, 0.15)',
                            '0 16px 64px rgba(0, 0, 0, 0.1)',
                          ].join(', '),
                        },
                      }}
                    >
                      <CardContent sx={{ textAlign: 'center', p: 3 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: action.color, 
                            mx: 'auto', 
                            mb: 2,
                            width: 56,
                            height: 56,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          }}
                        >
                          {action.icon}
                </Avatar>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: 600,
                            color: 'text.primary',
                          }}
                        >
                          {action.title}
                        </Typography>
              </CardContent>
            </Card>
                  </motion.div>
          </Grid>
              ))}
          </Grid>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Dashboard; 