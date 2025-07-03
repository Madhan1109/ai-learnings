import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box, List, ListItem, ListItemText } from '@mui/material';
import { useAuth } from './features/auth/AuthContext';
import { getEnrollments, Enrollment } from './features/enrollment/enrollmentApi';
import { getNotifications, Notification } from './features/notification/notificationApi';
import { Link as RouterLink } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (user?.id) {
      getEnrollments(user.id).then(res => setEnrollments(res.data));
      getNotifications(user.id).then(res => setNotifications(res.data));
    }
  }, [user]);

  const completedCount = enrollments.filter(e => (e.progress ?? 0) >= 100).length;

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>Welcome, {user?.username || 'User'}!</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Enrolled Courses</Typography>
                <Typography variant="h3">{enrollments.length}</Typography>
                <Button component={RouterLink} to="/enrollments" size="small">View Enrollments</Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Completed Courses</Typography>
                <Typography variant="h3">{completedCount}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Recent Notifications</Typography>
                <List dense>
                  {notifications.slice(0, 3).map(n => (
                    <ListItem key={n.id}>
                      <ListItemText primary={n.message} secondary={n.createdAt} />
                    </ListItem>
                  ))}
                </List>
                <Button component={RouterLink} to="/notifications" size="small">View All</Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box mt={4}>
          <Button component={RouterLink} to="/courses" variant="contained" sx={{ mr: 2 }}>Browse Courses</Button>
          <Button component={RouterLink} to="/assessments" variant="outlined" sx={{ mr: 2 }}>Take Assessments</Button>
          <Button component={RouterLink} to="/profile" variant="outlined">Profile</Button>
        </Box>
      </Box>
    </Container>
  );
} 