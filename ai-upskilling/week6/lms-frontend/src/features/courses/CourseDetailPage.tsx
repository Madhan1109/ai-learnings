import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCourse, Course } from './courseApi';
import { Container, Typography, Box, Chip, Link, CircularProgress, Alert } from '@mui/material';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      getCourse(Number(id))
        .then(res => setCourse(res.data))
        .catch(() => setError('Failed to load course'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!course) return null;

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>{course.title}</Typography>
        <Typography variant="subtitle1" gutterBottom>Version: {course.version || 1}</Typography>
        <Typography variant="body1" gutterBottom>{course.description}</Typography>
        {course.tags && course.tags.split(',').map(tag => (
          <Chip key={tag} label={tag.trim()} sx={{ mr: 1 }} />
        ))}
        {course.contentUrl && (
          <Box mt={2}>
            <Link href={course.contentUrl} target="_blank" rel="noopener">View Content</Link>
          </Box>
        )}
      </Box>
    </Container>
  );
} 