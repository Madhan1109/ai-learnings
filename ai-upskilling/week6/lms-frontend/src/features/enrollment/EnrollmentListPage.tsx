import React, { useEffect, useState } from 'react';
import { getEnrollments, Enrollment } from './enrollmentApi';
import { Container, Typography, Box, LinearProgress, Link, List, ListItem, ListItemText, Divider, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../auth/AuthContext';

export default function EnrollmentListPage() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      setError(null);
      getEnrollments(user.id)
        .then(res => setEnrollments(res.data))
        .catch(() => setError('Failed to load enrollments'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) return <div>Not authenticated</div>;
  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>My Enrollments</Typography>
        <List>
          {enrollments.map(enrollment => (
            <React.Fragment key={enrollment.id}>
              <ListItem>
                <ListItemText
                  primary={`Course ID: ${enrollment.courseId}`}
                  secondary={
                    <>
                      Progress: <LinearProgress variant="determinate" value={enrollment.progress || 0} sx={{ width: 200, display: 'inline-block', mr: 2 }} />
                      {enrollment.certificateUrl && (
                        <Link href={enrollment.certificateUrl} target="_blank" rel="noopener" sx={{ ml: 2 }}>
                          View Certificate
                        </Link>
                      )}
                    </>
                  }
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Container>
  );
} 