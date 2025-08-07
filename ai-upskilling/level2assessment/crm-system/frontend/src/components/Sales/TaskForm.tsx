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
} from '@mui/material';
import { Assignment, CalendarToday, PriorityHigh } from '@mui/icons-material';

interface Task {
  id?: string;
  title: string;
  description: string;
  assignedTo: number;
  dueDate: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  opportunityId?: number;
}

interface TaskFormProps {
  open: boolean;
  task?: Task | null;
  opportunities?: Array<{ id: number; title: string }>;
  onClose: () => void;
  onSubmit: (task: Task) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  open,
  task,
  opportunities = [],
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Task>({
    title: '',
    description: '',
    assignedTo: 1, // Default to user ID 1
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium',
    status: 'pending',
    opportunityId: undefined,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof Task, string>>>({});

  useEffect(() => {
    if (task) {
      setFormData(task);
    } else {
      setFormData({
        title: '',
        description: '',
        assignedTo: 1,
        dueDate: new Date().toISOString().split('T')[0],
        priority: 'medium',
        status: 'pending',
        opportunityId: undefined,
      });
    }
    setErrors({});
  }, [task, open]);

  const handleChange = (field: keyof Task) => (
    event: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Task, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assignment />
          <Typography variant="h6">
            {task ? 'Edit Task' : 'Create New Task'}
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Task Title"
              value={formData.title}
              onChange={handleChange('title')}
              error={!!errors.title}
              helperText={errors.title}
              required
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
              error={!!errors.description}
              helperText={errors.description}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={handleChange('dueDate')}
              error={!!errors.dueDate}
              helperText={errors.dueDate}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                label="Priority"
                onChange={handleChange('priority')}
              >
                <MenuItem value="low">
                  <Chip label="Low" size="small" color="success" />
                </MenuItem>
                <MenuItem value="medium">
                  <Chip label="Medium" size="small" color="info" />
                </MenuItem>
                <MenuItem value="high">
                  <Chip label="High" size="small" color="warning" />
                </MenuItem>
                <MenuItem value="urgent">
                  <Chip label="Urgent" size="small" color="error" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={handleChange('status')}
              >
                <MenuItem value="pending">
                  <Chip label="Pending" size="small" color="warning" />
                </MenuItem>
                <MenuItem value="in-progress">
                  <Chip label="In Progress" size="small" color="info" />
                </MenuItem>
                <MenuItem value="completed">
                  <Chip label="Completed" size="small" color="success" />
                </MenuItem>
                <MenuItem value="cancelled">
                  <Chip label="Cancelled" size="small" color="error" />
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Related Opportunity</InputLabel>
              <Select
                value={formData.opportunityId || ''}
                label="Related Opportunity"
                onChange={handleChange('opportunityId')}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {opportunities.map((opportunity) => (
                  <MenuItem key={opportunity.id} value={opportunity.id}>
                    {opportunity.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Assigned To (User ID)"
              type="number"
              value={formData.assignedTo}
              onChange={handleChange('assignedTo')}
              helperText="Enter the user ID of the person assigned to this task"
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleCancel} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {task ? 'Update' : 'Create'} Task
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm; 