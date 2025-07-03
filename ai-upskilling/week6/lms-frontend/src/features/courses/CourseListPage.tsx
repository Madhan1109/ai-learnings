import React, { useEffect, useState } from 'react';
import { getCourses, searchCourses, Course } from './courseApi';
import { Container, Typography, Box, TextField, Button, List, ListItem, ListItemText, Divider, CircularProgress, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export default function CourseListPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCourses();
      setCourses(res.data);
    } catch {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await searchCourses({ title: search, tag });
      setCourses(res.data);
    } catch {
      setError('Failed to search courses');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box mt={4} mb={2} display="flex" alignItems="center" gap={2}>
        <TextField label="Search by title" value={search} onChange={e => setSearch(e.target.value)} />
        <TextField label="Tag" value={tag} onChange={e => setTag(e.target.value)} />
        <Button variant="contained" onClick={handleSearch}>Search</Button>
        <Button variant="outlined" onClick={fetchCourses}>Reset</Button>
      </Box>
      <Typography variant="h5" gutterBottom>Courses</Typography>
      {loading && <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {!loading && !error && (
        <List>
          {courses.map(course => (
            <React.Fragment key={course.id}>
              <ListItem button component="a" href={`/courses/${course.id}`}>
                <ListItemText
                  primary={course.title}
                  secondary={`Version: ${course.version || 1} | Tags: ${course.tags || ''}`}
                />
                <Button
                  component={RouterLink}
                  to={`/courses/${course.id}/assessments`}
                  variant="outlined"
                  size="small"
                  sx={{ ml: 2 }}
                >
                  View Quizzes
                </Button>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Container>
  );
} 