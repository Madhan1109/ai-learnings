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
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { fetchOpportunities, fetchSalesMetrics, createOpportunity, updateOpportunity } from '../../store/slices/salesSlice';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import OpportunityForm from '../../components/Sales/OpportunityForm';
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
  const dispatch = useAppDispatch();
  const { opportunities, metrics, loading } = useSelector((state: RootState) => state.sales);
  
  const [tabValue, setTabValue] = useState(0);
  const [openForm, setOpenForm] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchOpportunities({ page: 1, limit: 10 }));
    dispatch(fetchSalesMetrics());
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = (opportunity: any) => {
    setSelectedOpportunity(opportunity);
    setOpenForm(true);
  };

  const handleSubmitOpportunity = (opportunity: any) => {
    if (opportunity.id) {
      dispatch(updateOpportunity(opportunity));
    } else {
      dispatch(createOpportunity(opportunity));
    }
    setOpenForm(false);
    setSelectedOpportunity(null);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospecting': return 'primary';
      case 'qualification': return 'info';
      case 'proposal': return 'warning';
      case 'negotiation': return 'primary';
      case 'closed_won': return 'success';
      case 'closed_lost': return 'error';
      default: return 'primary';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'success';
    if (probability >= 50) return 'warning';
    return 'error';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Sales
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenForm(true)}
        >
          Add Opportunity
        </Button>
      </Box>

      {/* Sales Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    ${metrics?.totalRevenue?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
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
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {metrics?.totalOpportunities || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Opportunities
                  </Typography>
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
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {metrics?.conversionRate || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conversion Rate
                  </Typography>
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
                <Box>
                  <Typography variant="h6">
                    {metrics?.avgDealSize?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Deal Size
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="sales tabs">
          <Tab label="Pipeline" />
          <Tab label="Opportunities" />
          <Tab label="Analytics" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <SalesPipeline 
            opportunities={opportunities} 
            onEdit={handleEdit}
            onDelete={(id) => console.log('Delete opportunity:', id)}
            onView={(opportunity) => console.log('View opportunity:', opportunity)}
            onMoveStage={(id, newStage) => console.log('Move stage:', id, newStage)}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">All Opportunities</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Search opportunities..."
                  InputProps={{
                    startAdornment: <Search />,
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Stage</InputLabel>
                  <Select label="Stage" defaultValue="all">
                    <MenuItem value="all">All Stages</MenuItem>
                    <MenuItem value="prospecting">Prospecting</MenuItem>
                    <MenuItem value="qualification">Qualification</MenuItem>
                    <MenuItem value="proposal">Proposal</MenuItem>
                    <MenuItem value="negotiation">Negotiation</MenuItem>
                    <MenuItem value="closed_won">Closed Won</MenuItem>
                    <MenuItem value="closed_lost">Closed Lost</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Opportunity</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Stage</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Probability</TableCell>
                    <TableCell>Expected Close</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {opportunities.map((opportunity: any) => (
                    <TableRow key={opportunity.id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{opportunity.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {opportunity.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{opportunity.customerName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={opportunity.stage}
                          color={getStageColor(opportunity.stage) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          ${opportunity.value?.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={opportunity.probability}
                            sx={{ flexGrow: 1 }}
                            color={getProbabilityColor(opportunity.probability) as any}
                          />
                          <Typography variant="body2" sx={{ minWidth: 35 }}>
                            {opportunity.probability}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {new Date(opportunity.expectedCloseDate).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleEdit(opportunity)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small">
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <SalesMetrics metrics={metrics} />
        </TabPanel>
      </Paper>

      {/* Opportunity Form Dialog */}
      <OpportunityForm
        open={openForm}
        opportunity={selectedOpportunity}
        onClose={() => {
          setOpenForm(false);
          setSelectedOpportunity(null);
        }}
        onSubmit={handleSubmitOpportunity}
      />
    </Box>
  );
};

export default Sales; 