import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Container,
  useTheme,
} from '@mui/material';
import {
  Add,
  TrendingUp,
  AttachMoney,
  People,
  Timeline,
  FilterList,
  Search,
  Edit,
  Delete,
  Visibility,
  Assignment,
  AttachMoney as SalesIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { 
  fetchOpportunities, 
  fetchSalesMetrics, 
  createOpportunity, 
  updateOpportunity,
  deleteOpportunity,
  fetchTasks,
  createTask,
  updateTask,
  deleteTask
} from '../../store/slices/salesSlice';
import { fetchCustomers } from '../../store/slices/customerSlice';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import OpportunityForm from '../../components/Sales/OpportunityForm';
import TaskForm from '../../components/Sales/TaskForm';
import SalesPipeline from '../../components/Sales/SalesPipeline';
import SalesMetrics from '../../components/Sales/SalesMetrics';

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
      id={`sales-tabpanel-${index}`}
      aria-labelledby={`sales-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Sales: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { opportunities, tasks, metrics, loading } = useSelector((state: RootState) => state.sales);
  
  // Debug metrics
  console.log('Sales component metrics:', metrics);
  const { customers } = useSelector((state: RootState) => state.customers);
  
  const [tabValue, setTabValue] = useState(0);
  const [openOpportunityForm, setOpenOpportunityForm] = useState(false);
  const [openTaskForm, setOpenTaskForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchOpportunities({ page: 1, limit: 10 }));
    dispatch(fetchSalesMetrics());
    dispatch(fetchTasks());
    dispatch(fetchCustomers({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEditOpportunity = (opportunity: any) => {
    setSelectedOpportunity(opportunity);
    setOpenOpportunityForm(true);
  };

  const handleSubmitOpportunity = (opportunity: any) => {
    console.log('handleSubmitOpportunity called with:', opportunity);
    console.log('selectedOpportunity:', selectedOpportunity);
    
    if (selectedOpportunity) {
      console.log('Updating opportunity:', selectedOpportunity.id);
      dispatch(updateOpportunity({ id: selectedOpportunity.id, data: opportunity }));
    } else {
      console.log('Creating new opportunity');
      dispatch(createOpportunity(opportunity));
    }
    setOpenOpportunityForm(false);
    setSelectedOpportunity(null);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setOpenTaskForm(true);
  };

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setOpenTaskForm(true);
  };

  const handleSubmitTask = (task: any) => {
    if (selectedTask) {
      dispatch(updateTask({ id: selectedTask.id, data: task }));
    } else {
      dispatch(createTask(task));
    }
    setOpenTaskForm(false);
    setSelectedTask(null);
  };

  const handleDeleteOpportunity = (opportunityId: number) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
    dispatch(deleteOpportunity(opportunityId));
    }
  };

  const handleDeleteTask = (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
    dispatch(deleteTask(taskId));
    }
  };

  const handleViewOpportunity = (opportunity: any) => {
    setSelectedOpportunity(opportunity);
    // Handle view logic
  };

  const handleMoveStage = (opportunityId: string, newStage: string) => {
    // Handle stage movement logic
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'lead': return 'default';
      case 'proposal': return 'info';
      case 'negotiation': return 'warning';
      case 'closed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'success';
    if (probability >= 50) return 'warning';
    return 'error';
  };

  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': return 'info';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated Background Elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          filter: 'blur(30px)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper
            elevation={0}
            sx={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 4,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Box
                sx={{
                  p: 3,
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <SalesIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                  </motion.div>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Sales Management
        </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              console.log('Add Opportunity button clicked');
              setOpenOpportunityForm(true);
            }}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        fontWeight: 600,
                        '&:hover': {
                          boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                          transform: 'translateY(-2px)',
                        },
                      }}
          >
            Add Opportunity
          </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="outlined"
            startIcon={<Assignment />}
            onClick={handleCreateTask}
                      sx={{
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        borderRadius: 2,
                        px: 3,
                        py: 1.5,
                        fontWeight: 600,
                        '&:hover': {
                          background: 'rgba(102, 126, 234, 0.1)',
                          borderColor: 'primary.dark',
                        },
                      }}
          >
            Create Task
          </Button>
                  </motion.div>
        </Box>
      </Box>
            </motion.div>

      {/* Sales Metrics Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {(() => {
                    const metricsData = [
                      { label: 'Total Revenue', value: `$${metrics.totalRevenue?.toLocaleString() || '0'}`, icon: <AttachMoney />, color: 'success.main' },
                      { label: 'Total Opportunities', value: metrics.totalOpportunities?.toString() || '0', icon: <TrendingUp />, color: 'primary.main' },
                      { label: 'Conversion Rate', value: `${metrics.conversionRate?.toFixed(1) || '0'}%`, icon: <People />, color: 'warning.main' },
                      { label: 'Avg Deal Size', value: `$${metrics.avgDealSize?.toLocaleString() || '0'}`, icon: <Timeline />, color: 'info.main' },
                    ];
                    console.log('Rendering metrics data:', metricsData);
                    return metricsData;
                  })().map((metric, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                      >
                        <Card
                          sx={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            borderRadius: 3,
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              height: '4px',
                              background: `linear-gradient(90deg, ${metric.color} 0%, ${metric.color}88 100%)`,
                            },
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Avatar
                                sx={{
                                  background: `linear-gradient(135deg, ${metric.color} 0%, ${metric.color}88 100%)`,
                                  boxShadow: `0 4px 12px ${metric.color}40`,
                                }}
                              >
                                {metric.icon}
                </Avatar>
                <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: metric.color }}>
                                  {metric.value}
                  </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                  {metric.label}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
                      </motion.div>
                    </Grid>
                  ))}
        </Grid>

                {/* Charts and AI Insights */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} md={8}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card
                        sx={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: 3,
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Chip
                              label="AI-Powered"
                              color="primary"
                              size="small"
                              sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              Sales Pipeline Overview
                  </Typography>
                </Box>
                          <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body1" color="text.secondary">
                              Chart visualization would go here
                            </Typography>
              </Box>
            </CardContent>
          </Card>
                    </motion.div>
        </Grid>
                  <Grid item xs={12} md={4}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card
                        sx={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          borderRadius: 3,
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '4px',
                            background: 'linear-gradient(90deg, #4caf50 0%, #66bb6a 100%)',
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            AI Insights
                  </Typography>
                          <Box sx={{ space: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              • High probability opportunities detected
                  </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              • Pipeline health: Excellent
                  </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              • Next best action: Follow up on leads
                  </Typography>
              </Box>
            </CardContent>
          </Card>
                    </motion.div>
        </Grid>
      </Grid>

                {/* Tabbed Interface */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      sx={{
                        '& .MuiTab-root': {
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '1rem',
                        },
                      }}
                    >
                      <Tab label="Pipeline" />
          <Tab label="Opportunities" />
          <Tab label="Tasks" />
          <Tab label="Analytics" />
        </Tabs>
                  </Box>
                </motion.div>

                {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
                  <SalesPipeline
                    opportunities={opportunities}
                    onMoveStage={handleMoveStage}
                    onEdit={handleEditOpportunity}
                    onDelete={handleDeleteOpportunity}
                    onView={handleViewOpportunity}
                  />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      All Opportunities
                    </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                          <TableRow sx={{ background: 'rgba(102, 126, 234, 0.05)' }}>
                            <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Opportunity</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Customer</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Value</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Stage</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Probability</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.main' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                          {opportunities?.map((opportunity: any, index: number) => (
                            <TableRow
                              key={opportunity.id}
                              sx={{
                                '&:hover': {
                                  background: 'rgba(102, 126, 234, 0.05)',
                                  transform: 'scale(1.01)',
                                  transition: 'all 0.2s ease',
                                },
                              }}
                            >
                              <TableCell>
                                <Box>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {opportunity.title || opportunity.name || 'Untitled'}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {opportunity.description}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {opportunity.customerName}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                                  ${opportunity.value?.toLocaleString() || '0'}
                                </Typography>
                              </TableCell>
                    <TableCell>
                      <Chip
                        label={opportunity.stage}
                        color={getStageColor(opportunity.stage) as any}
                        size="small"
                                  sx={{
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                  }}
                      />
                    </TableCell>
                    <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LinearProgress
                                    variant="determinate"
                                    value={opportunity.probability || 0}
                                    sx={{
                                      width: 60,
                                      height: 8,
                                      borderRadius: 4,
                                      backgroundColor: 'rgba(0,0,0,0.1)',
                                      '& .MuiLinearProgress-bar': {
                                        borderRadius: 4,
                                        background: `linear-gradient(90deg, ${
                                          getProbabilityColor(opportunity.probability || 0) === 'success' 
                                            ? '#4caf50' 
                                            : getProbabilityColor(opportunity.probability || 0) === 'warning'
                                            ? '#ff9800'
                                            : '#f44336'
                                        } 0%, ${
                                          getProbabilityColor(opportunity.probability || 0) === 'success'
                                            ? '#66bb6a'
                                            : getProbabilityColor(opportunity.probability || 0) === 'warning'
                                            ? '#ffb74d'
                                            : '#ef5350'
                                        } 100%)`,
                                      },
                                    }}
                                  />
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {opportunity.probability || 0}%
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell align="right">
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleViewOpportunity(opportunity)}
                                      sx={{
                                        color: 'primary.main',
                                        '&:hover': {
                                          background: 'rgba(102, 126, 234, 0.1)',
                                        },
                                      }}
                                    >
                                      <Visibility />
                                    </IconButton>
                                  </motion.div>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleEditOpportunity(opportunity)}
                                      sx={{
                                        color: 'success.main',
                                        '&:hover': {
                                          background: 'rgba(76, 175, 80, 0.1)',
                                        },
                                      }}
                                    >
                        <Edit />
                      </IconButton>
                                  </motion.div>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleDeleteOpportunity(opportunity.id)}
                                      sx={{
                                        color: 'error.main',
                                        '&:hover': {
                                          background: 'rgba(244, 67, 54, 0.1)',
                                        },
                                      }}
                                    >
                        <Delete />
                      </IconButton>
                                  </motion.div>
                                </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
                  </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      All Tasks
            </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                          <TableRow sx={{ background: 'rgba(102, 126, 234, 0.05)' }}>
                            <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Task</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Priority</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Due Date</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.main' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                          {tasks?.map((task: any, index: number) => (
                            <TableRow
                              key={task.id}
                              sx={{
                                '&:hover': {
                                  background: 'rgba(102, 126, 234, 0.05)',
                                  transform: 'scale(1.01)',
                                  transition: 'all 0.2s ease',
                                },
                              }}
                            >
                              <TableCell>
                                <Box>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                    {task.title}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {task.description}
                                  </Typography>
                                </Box>
                              </TableCell>
                    <TableCell>
                      <Chip
                        label={task.priority}
                        color={getTaskPriorityColor(task.priority) as any}
                        size="small"
                                  sx={{
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                  }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={task.status}
                        color={getTaskStatusColor(task.status) as any}
                        size="small"
                                  sx={{
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                  }}
                      />
                    </TableCell>
                    <TableCell>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleEditTask(task)}
                                      sx={{
                                        color: 'success.main',
                                        '&:hover': {
                                          background: 'rgba(76, 175, 80, 0.1)',
                                        },
                                      }}
                                    >
                        <Edit />
                      </IconButton>
                                  </motion.div>
                                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <IconButton 
                                      size="small" 
                                      onClick={() => handleDeleteTask(task.id)}
                                      sx={{
                                        color: 'error.main',
                                        '&:hover': {
                                          background: 'rgba(244, 67, 54, 0.1)',
                                        },
                                      }}
                                    >
                        <Delete />
                      </IconButton>
                                  </motion.div>
                                </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
                  </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <SalesMetrics metrics={metrics} />
        </TabPanel>
              </Box>
            </motion.div>
      </Paper>
        </motion.div>
      </Container>

      {/* Forms */}
      <OpportunityForm
        open={openOpportunityForm}
        opportunity={selectedOpportunity}
        customers={customers?.map(customer => ({
          id: customer.id.toString(),
          name: customer.name,
          company: customer.company
        })) || []}
        onClose={() => {
          setOpenOpportunityForm(false);
          setSelectedOpportunity(null);
        }}
        onSubmit={handleSubmitOpportunity}
      />

      <TaskForm
        open={openTaskForm}
        task={selectedTask}
        opportunities={opportunities?.map(opportunity => ({
          id: opportunity.id,
          title: opportunity.title || opportunity.name || 'Untitled'
        })) || []}
        onClose={() => {
          setOpenTaskForm(false);
          setSelectedTask(null);
        }}
        onSubmit={handleSubmitTask}
      />
    </Box>
  );
};

export default Sales; 