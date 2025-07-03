import React, { useEffect, useState } from 'react';
import { getQuizzes, Quiz } from './assessmentApi';
import { Container, Typography, List, ListItem, ListItemText, Divider, Box, Button, CircularProgress, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface AssessmentListPageProps {
  courseId?: number;
}

export default function AssessmentListPage({ courseId }: AssessmentListPageProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      setLoading(true);
      setError(null);
      getQuizzes(courseId)
        .then(res => setQuizzes(res.data))
        .catch(() => setError('Failed to load quizzes'))
        .finally(() => setLoading(false));
    }
  }, [courseId]);

  if (!courseId) return <div>Please select a course to view quizzes.</div>;
  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Quizzes</Typography>
        <List>
          {quizzes.map(quiz => (
            <React.Fragment key={quiz.id}>
              <ListItem component={RouterLink} to={`/assessments/${quiz.id}`}>
                <ListItemText primary={quiz.title} />
                <Button
                  component={RouterLink}
                  to={`/assessments/${quiz.id}`}
                  variant="outlined"
                  size="small"
                  sx={{ ml: 2 }}
                >
                  Take Quiz
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Container>
  );
} 