import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip,
  Slider,
} from '@mui/material';
import { AttachMoney, Person, CalendarToday, TrendingUp } from '@mui/icons-material';

interface Opportunity {
  id?: string;
  title: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  probability: number;
  expectedCloseDate: string;
  customerId?: string;
  customerName?: string;
  description?: string;
  notes?: string;
}

interface OpportunityFormProps {
  open: boolean;
  opportunity?: Opportunity | null;
  customers?: Array<{ id: string; name: string; company: string }>;
  onClose: () => void;
  onSubmit: (opportunity: Opportunity) => void;
}

const OpportunityForm: React.FC<OpportunityFormProps> = ({
  open,
  opportunity,
  customers = [],
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Opportunity>({
    title: '',
    value: 0,
    stage: 'prospecting',
    probability: 25,
    expectedCloseDate: '',
    customerId: '',
    customerName: '',
    description: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Opportunity, string>>>({});

  useEffect(() => {
    if (opportunity) {
      setFormData(opportunity);
    } else {
      setFormData({
        title: '',
        value: 1000, // Set a default value greater than 0
        stage: 'prospecting',
        probability: 25,
        expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 30 days from now
        customerId: '',
        customerName: '',
        description: '',
        notes: '',
      });
    }
    setErrors({});
  }, [opportunity, open]);

  const handleChange = (field: keyof Opportunity) => (
    event: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setFormData(prev => ({
      ...prev,
      customerId,
      customerName: customer?.name || '',
    }));
  };

  const validateForm = () => {
    console.log('Validating form with data:', formData);
    console.log('Available customers:', customers);
    const newErrors: Partial<Record<keyof Opportunity, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Opportunity name is required';
      console.log('Title validation failed');
    }

    // Description is optional, so we don't validate it

    if (!formData.customerId) {
      if (customers.length === 0) {
        newErrors.customerId = 'No customers available. Please add customers first.';
      } else {
        newErrors.customerId = 'Customer is required';
      }
      console.log('Customer validation failed');
    }

    if (!formData.stage) {
      newErrors.stage = 'Stage is required';
      console.log('Stage validation failed');
    }

    if (formData.value <= 0) {
      newErrors.value = 'Value must be greater than 0';
      console.log('Value validation failed');
    }

    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = 'Expected close date is required';
      console.log('Expected close date validation failed');
    }

    if (formData.probability < 0 || formData.probability > 100) {
      newErrors.probability = 'Probability must be between 0 and 100';
      console.log('Probability validation failed');
    }

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Form is valid:', isValid);
    return isValid;
  };

  const handleSubmit = () => {
    console.log('OpportunityForm handleSubmit called');
    console.log('Form data:', formData);
    console.log('Validation result:', validateForm());
    
    if (validateForm()) {
      console.log('Form is valid, calling onSubmit');
      onSubmit(formData);
      onClose();
    } else {
      console.log('Form validation failed');
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospecting': return 'default';
      case 'qualification': return 'info';
      case 'proposal': return 'warning';
      case 'negotiation': return 'secondary';
      case 'closed-won': return 'success';
      case 'closed-lost': return 'error';
      default: return 'default';
    }
  };

  console.log('OpportunityForm render - open:', open, 'opportunity:', opportunity);
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AttachMoney />
          <Typography variant="h6">
            {opportunity ? 'Edit Opportunity' : 'Add New Opportunity'}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Opportunity Title"
              value={formData.title}
              onChange={handleChange('title')}
              error={!!errors.title}
              helperText={errors.title}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Value"
              type="number"
              value={formData.value}
              onChange={handleChange('value')}
              error={!!errors.value}
              helperText={errors.value}
              InputProps={{
                startAdornment: <AttachMoney color="action" />,
              }}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Customer</InputLabel>
              <Select
                value={formData.customerId}
                label="Customer"
                onChange={(e) => handleCustomerChange(e.target.value as string)}
                error={!!errors.customerId}
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name} - {customer.company}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Stage</InputLabel>
              <Select
                value={formData.stage}
                label="Stage"
                onChange={handleChange('stage')}
              >
                <MenuItem value="prospecting">
                  <Chip label="Prospecting" size="small" color="primary" />
                </MenuItem>
                <MenuItem value="qualification">
                  <Chip label="Qualification" size="small" color="info" />
                </MenuItem>
                <MenuItem value="proposal">
                  <Chip label="Proposal" size="small" color="warning" />
                </MenuItem>
                <MenuItem value="negotiation">
                  <Chip label="Negotiation" size="small" color="secondary" />
                </MenuItem>
                <MenuItem value="closed-won">
                  <Chip label="Closed Won" size="small" color="success" />
                </MenuItem>
                <MenuItem value="closed-lost">
                  <Chip label="Closed Lost" size="small" color="error" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Expected Close Date"
              type="date"
              value={formData.expectedCloseDate}
              onChange={handleChange('expectedCloseDate')}
              error={!!errors.expectedCloseDate}
              helperText={errors.expectedCloseDate}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Probability: {formData.probability}%
            </Typography>
            <Slider
              value={formData.probability}
              onChange={(_, value) => handleChange('probability')({ target: { value } } as any)}
              min={0}
              max={100}
              step={5}
              marks={[
                { value: 0, label: '0%' },
                { value: 25, label: '25%' },
                { value: 50, label: '50%' },
                { value: 75, label: '75%' },
                { value: 100, label: '100%' },
              ]}
              valueLabelDisplay="auto"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange('description')}
              placeholder="Describe the opportunity..."
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={handleChange('notes')}
              placeholder="Add any additional notes..."
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {opportunity ? 'Update' : 'Create'} Opportunity
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OpportunityForm; 