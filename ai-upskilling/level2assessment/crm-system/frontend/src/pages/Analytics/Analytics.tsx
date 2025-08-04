import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  LinearProgress,
  Tabs,
  Tab,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Analytics as AnalyticsIcon,
  Psychology,
  Timeline,
  FilterList,
  Download,
  Refresh,
  Lightbulb,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { fetchAnalytics, fetchPredictions } from '../../store/slices/analyticsSlice';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import RevenueChart from '../../components/Analytics/RevenueChart';
import CustomerChart from '../../components/Charts/CustomerChart';
import SalesChart from '../../components/Charts/SalesChart';
import AIInsights from '../../components/Analytics/AIInsights';
import PredictiveAnalytics from '../../components/Analytics/PredictiveAnalytics';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analytics-tabpanel-${index}`}
      aria-labelledby={`analytics-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AnalyticsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { analytics, predictions, loading } = useSelector((state: RootState) => state.analytics);
  
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    dispatch(fetchAnalytics(timeRange));
    dispatch(fetchPredictions());
  }, [dispatch, timeRange]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'success' : 'error';
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp /> : <TrendingDown />;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small">
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
              <MenuItem value="90d">Last 90 Days</MenuItem>
              <MenuItem value="1y">Last Year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<Download />}
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <TrendingUp />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">
                    ${analytics?.revenue?.current?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    {getGrowthIcon(analytics?.revenue?.growth || 0)}
                    <Typography
                      variant="body2"
                      color={getGrowthColor(analytics?.revenue?.growth || 0)}
                    >
                      {Math.abs(analytics?.revenue?.growth || 0)}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <AnalyticsIcon />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">
                    {analytics?.customers?.current || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Customers
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    {getGrowthIcon(analytics?.customers?.growth || 0)}
                    <Typography
                      variant="body2"
                      color={getGrowthColor(analytics?.customers?.growth || 0)}
                    >
                      {Math.abs(analytics?.customers?.growth || 0)}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Psychology />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">
                    {analytics?.conversionRate?.current || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conversion Rate
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    {getGrowthIcon(analytics?.conversionRate?.growth || 0)}
                    <Typography
                      variant="body2"
                      color={getGrowthColor(analytics?.conversionRate?.growth || 0)}
                    >
                      {Math.abs(analytics?.conversionRate?.growth || 0)}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <Timeline />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">
                    ${analytics?.avgDealSize?.current?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Deal Size
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    {getGrowthIcon(analytics?.avgDealSize?.growth || 0)}
                    <Typography
                      variant="body2"
                      color={getGrowthColor(analytics?.avgDealSize?.growth || 0)}
                    >
                      {Math.abs(analytics?.avgDealSize?.growth || 0)}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI Insights */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="AI-Powered Insights"
              avatar={
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Lightbulb />
                </Avatar>
              }
              action={
                <IconButton>
                  <Refresh />
                </IconButton>
              }
            />
            <CardContent>
              <AIInsights insights={analytics?.insights} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Analytics */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="analytics tabs">
          <Tab label="Revenue Analytics" />
          <Tab label="Customer Analytics" />
          <Tab label="Sales Analytics" />
          <Tab label="Predictive Analytics" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <RevenueChart data={analytics?.revenueData} />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <CustomerChart data={analytics?.customerData} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <SalesChart data={analytics?.salesData} />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <PredictiveAnalytics predictions={predictions} />
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default AnalyticsPage; 