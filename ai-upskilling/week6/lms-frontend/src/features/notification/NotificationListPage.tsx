import React, { useEffect, useState } from 'react';
import { getNotifications, markNotificationRead, Notification } from './notificationApi';
import { Container, Typography, List, ListItem, ListItemText, Divider, Button, Alert, Box, CircularProgress } from '@mui/material';
import { useAuth } from '../auth/AuthContext';

export default function NotificationListPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!user?.id) return;
      const res = await getNotifications(user.id);
      setNotifications(res.data);
    } catch (err) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const handleMarkRead = async (id: number) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      setError('Failed to mark as read');
    }
  };

  if (!user) return <div>Not authenticated</div>;
  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Notifications</Typography>
        <List>
          {notifications.map(n => (
            <React.Fragment key={n.id}>
              <ListItem>
                <ListItemText
                  primary={n.message}
                  secondary={n.createdAt}
                />
                {!n.read && (
                  <Button variant="outlined" size="small" onClick={() => handleMarkRead(n.id!)}>
                    Mark as read
                  </Button>
                )}
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Container>
  );
} 