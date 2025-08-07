import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Fab,
  Container,
  useTheme,
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  Visibility,
  FilterList,
  Person,
  Email,
  Phone,
  Business,
  People as PeopleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { fetchCustomers, deleteCustomer, createCustomer, updateCustomer } from '../../store/slices/customerSlice';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import CustomerForm from '../../components/Customers/CustomerForm';
import CustomerDetails from '../../components/Customers/CustomerDetails';

import { Customer } from '../../store/slices/customerSlice';

const Customers: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { customers, loading } = useSelector((state: RootState) => state.customers);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    dispatch(fetchCustomers({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const handleStatusFilter = (event: any) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const filteredCustomers = customers?.filter((customer: Customer) => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setOpenForm(true);
  };

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenDetails(true);
  };

  const handleDelete = (customerId: number) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      dispatch(deleteCustomer(customerId));
    }
  };

  const handleSubmitCustomer = (customer: any) => {
    if (editingCustomer) {
      dispatch(updateCustomer({ id: editingCustomer.id, data: customer }));
    } else {
      dispatch(createCustomer(customer));
    }
    setOpenForm(false);
    setEditingCustomer(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'lead': return 'warning';
      default: return 'default';
    }
  };

  if (loading) return <LoadingSpinner />;

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
          top: '10%',
          left: '5%',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: 'linear-gradient(45deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
        }}
        animate={{
          y: [0, -10, 0],
          rotate: [0, 180],
        }}
        transition={{
          duration: 8,
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <PeopleIcon 
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
                    Customers
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: '1.1rem',
                      fontWeight: 500,
                    }}
                  >
                    Manage your customer relationships
                  </Typography>
                </Box>
              </Box>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setOpenForm(true)}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: [
                      '0 4px 12px rgba(102, 126, 234, 0.3)',
                      '0 8px 24px rgba(102, 126, 234, 0.2)',
                    ].join(', '),
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                      boxShadow: [
                        '0 6px 16px rgba(102, 126, 234, 0.4)',
                        '0 12px 32px rgba(102, 126, 234, 0.3)',
                      ].join(', '),
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Add Customer
                </Button>
              </motion.div>
            </Box>
          </Paper>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
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
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={6}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <TextField
                    fullWidth
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={handleSearch}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.9)',
                          borderColor: 'primary.main',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                        },
                        '&.Mui-focused': {
                          background: 'rgba(255, 255, 255, 0.95)',
                          borderColor: 'primary.main',
                          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.25)',
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                </motion.div>
              </Grid>
              <Grid item xs={12} md={3}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={handleStatusFilter}
                      label="Status"
                      sx={{
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        '&:hover': {
                          background: 'rgba(255, 255, 255, 0.9)',
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                      <MenuItem value="lead">Lead</MenuItem>
                    </Select>
                  </FormControl>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ 
                    fontWeight: 500,
                    textAlign: 'center',
                  }}
                >
                  {filteredCustomers?.length || 0} customers found
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Customers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Paper
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
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: 'rgba(102, 126, 234, 0.05)' }}>
                    <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>Last Contact</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: 'primary.main' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCustomers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((customer: Customer, index: number) => (
                      <TableRow
                        key={customer.id}
                        sx={{
                          '&:hover': {
                            background: 'rgba(102, 126, 234, 0.05)',
                            transform: 'scale(1.01)',
                            transition: 'all 0.2s ease',
                          },
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar
                              sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                              }}
                            >
                              <Person />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {customer.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {customer.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {customer.company}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Email fontSize="small" color="primary" />
                              {customer.email}
                            </Typography>
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Phone fontSize="small" color="primary" />
                              {customer.phone}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={customer.status}
                            color={getStatusColor(customer.status) as any}
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
                            {new Date(customer.createdAt).toLocaleDateString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <IconButton 
                                size="small" 
                                onClick={() => handleView(customer)}
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
                                onClick={() => handleEdit(customer)}
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
                                onClick={() => handleDelete(customer.id)}
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
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredCustomers?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              sx={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
              }}
            />
          </Paper>
        </motion.div>

        {/* Customer Form Dialog */}
        <CustomerForm
          open={openForm}
          customer={editingCustomer}
          onClose={() => {
            setOpenForm(false);
            setEditingCustomer(null);
          }}
          onSubmit={handleSubmitCustomer}
        />

        {/* Customer Details Dialog */}
        <CustomerDetails
          open={openDetails}
          customer={selectedCustomer}
          onClose={() => {
            setOpenDetails(false);
            setSelectedCustomer(null);
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Container>
    </Box>
  );
};

export default Customers; 