import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Business,
  LocationOn,
  Edit,
  Delete,
  Timeline,
  AttachMoney,
  Assignment,
} from '@mui/icons-material';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'lead';
  source: string;
  address?: string;
  notes?: string;
  createdAt: string;
  lastContact?: string;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user: string;
}

interface Opportunity {
  id: string;
  title: string;
  amount: number;
  stage: string;
  probability: number;
  expectedCloseDate: string;
}

interface CustomerDetailsProps {
  open: boolean;
  customer: Customer | null;
  activities?: Activity[];
  opportunities?: Opportunity[];
  onClose: () => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
}

const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  open,
  customer,
  activities = [],
  opportunities = [],
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!customer) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'lead': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Person color="success" />;
      case 'inactive': return <Person color="error" />;
      case 'lead': return <Person color="warning" />;
      default: return <Person />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {getStatusIcon(customer.status)}
            </Avatar>
            <Box>
              <Typography variant="h6">{customer.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {customer.company}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={() => onEdit(customer)} color="primary">
              <Edit />
            </IconButton>
            <IconButton onClick={() => onDelete(customer.id)} color="error">
              <Delete />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={3}>
          {/* Customer Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Customer Information
                </Typography>
                
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Email color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={customer.email}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Phone color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Phone"
                      secondary={customer.phone || 'Not provided'}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Business color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Company"
                      secondary={customer.company}
                    />
                  </ListItem>
                  
                  {customer.address && (
                    <ListItem>
                      <ListItemIcon>
                        <LocationOn color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Address"
                        secondary={customer.address}
                      />
                    </ListItem>
                  )}
                  
                  <ListItem>
                    <ListItemIcon>
                      <Timeline color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Status"
                      secondary={
                        <Chip
                          label={customer.status}
                          color={getStatusColor(customer.status) as any}
                          size="small"
                        />
                      }
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Assignment color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Source"
                      secondary={customer.source}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      <Timeline color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Created"
                      secondary={formatDate(customer.createdAt)}
                    />
                  </ListItem>
                  
                  {customer.lastContact && (
                    <ListItem>
                      <ListItemIcon>
                        <Timeline color="action" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Last Contact"
                        secondary={formatDate(customer.lastContact)}
                      />
                    </ListItem>
                  )}
                </List>
                
                {customer.notes && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Notes
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {customer.notes}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Opportunities */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Opportunities ({opportunities.length})
                </Typography>
                
                {opportunities.length > 0 ? (
                  <List dense>
                    {opportunities.map((opportunity) => (
                      <ListItem key={opportunity.id}>
                        <ListItemIcon>
                          <AttachMoney color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={opportunity.title}
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                {formatCurrency(opportunity.amount)} • {opportunity.stage}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {opportunity.probability}% probability • Close by {formatDate(opportunity.expectedCloseDate)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No opportunities found for this customer.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Recent Activities ({activities.length})
                </Typography>
                
                {activities.length > 0 ? (
                  <List dense>
                    {activities.map((activity) => (
                      <ListItem key={activity.id}>
                        <ListItemIcon>
                          <Assignment color="action" />
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.description}
                          secondary={
                            <Box>
                              <Typography variant="body2">
                                {activity.type} • {activity.user}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(activity.timestamp)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No recent activities found for this customer.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerDetails; 