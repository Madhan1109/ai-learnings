import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
  Avatar,
  Chip,
  IconButton,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Switch,
  Divider,
  Badge,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsActive,
  NotificationsOff,
  Email,
  Message,
  Warning,
  Info,
  CheckCircle,
  Delete,
  Settings,
  MarkEmailRead,
  MarkEmailUnread,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { fetchNotifications, markAsRead, deleteNotification, Notification } from '../../store/slices/notificationSlice';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const NotificationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { notifications, loading } = useSelector((state: RootState) => state.notifications);
  
  const [filter, setFilter] = useState('all');
  const [showRead, setShowRead] = useState(true);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsRead = (notificationId: number) => {
    dispatch(markAsRead(notificationId));
  };

  const handleDelete = (notificationId: number) => {
    dispatch(deleteNotification(notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle />;
      case 'warning': return <Warning />;
      case 'error': return <Warning />;
      default: return <Info />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'info';
    }
  };

  const filteredNotifications = notifications?.filter((notification: any) => {
    const matchesFilter = filter === 'all' || notification.type === filter;
    const matchesReadStatus = showRead || !notification.read;
    return matchesFilter && matchesReadStatus;
  }) || [];

  const unreadCount = notifications?.filter((n: Notification) => !n.read).length || 0;

  if (loading) return <LoadingSpinner />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Notifications
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<MarkEmailRead />}
          >
            Mark All as Read
          </Button>
          <Button
            variant="outlined"
            startIcon={<Settings />}
          >
            Notification Settings
          </Button>
        </Box>
      </Box>

      {/* Notification Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Badge badgeContent={unreadCount} color="error">
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <NotificationsIcon />
                  </Avatar>
                </Badge>
                <Box>
                  <Typography variant="h6">
                    {notifications?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Notifications
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
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <MarkEmailUnread />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {unreadCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unread
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
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {notifications?.filter((n: Notification) => n.read).length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Read
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
                  <Warning />
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {notifications.filter((n: Notification) => n.type === 'warning' || n.type === 'error').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Alerts
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="sales">Sales</MenuItem>
                <MenuItem value="customers">Customers</MenuItem>
                <MenuItem value="system">System</MenuItem>
                <MenuItem value="alerts">Alerts</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Switch
                checked={showRead}
                onChange={(e) => setShowRead(e.target.checked)}
              />
              <Typography variant="body2">
                Show read notifications
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              {filteredNotifications.length} notifications found
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Notifications List */}
      <Paper>
        <List>
          {filteredNotifications.map((notification: any, index: number) => (
            <React.Fragment key={notification.id}>
              <ListItem
                sx={{
                  bgcolor: notification.read ? 'transparent' : 'action.hover',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {!notification.read && (
                      <IconButton
                        size="small"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <MarkEmailRead />
                      </IconButton>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: `${getNotificationColor(notification.type)}.main` }}>
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: notification.read ? 'normal' : 'bold' }}
                      >
                        {notification.title}
                      </Typography>
                      <Chip
                        label={notification.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      {!notification.read && (
                        <Chip
                          label="New"
                          size="small"
                          color="error"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(notification.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < filteredNotifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
        {filteredNotifications.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No notifications found
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default NotificationsPage; 