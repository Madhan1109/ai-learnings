import React, { useState } from 'react';
import { createCourse, uploadCourseContent, Course } from './courseApi';
import { Container, Typography, Box, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../auth/AuthContext';

export default function CourseCreatePage() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isInstructor = user?.roles?.includes('admin') || user?.roles?.includes('instructor');
  if (!isInstructor) {
    return <Alert severity="error" sx={{ mt: 4 }}>You are not authorized to create courses.</Alert>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    let contentUrl = '';
    try {
      if (file) {
        const res = await uploadCourseContent(file);
        contentUrl = res.data;
      }
      const course: Course = { title, description, tags, contentUrl };
      await createCourse(course);
      setSuccess(true);
      setTitle('');
      setDescription('');
      setTags('');
      setFile(null);
    } catch (err: any) {
      setError('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Create New Course</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled={loading}
          />
          <TextField
            label="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled={loading}
          />
          <TextField
            label="Tags (comma separated)"
            value={tags}
            onChange={e => setTags(e.target.value)}
            fullWidth
            margin="normal"
            disabled={loading}
          />
          <Button variant="contained" component="label" sx={{ mt: 2 }} disabled={loading}>
            Upload Content
            <input type="file" hidden onChange={e => setFile(e.target.files?.[0] || null)} />
          </Button>
          {file && <span style={{ marginLeft: 8 }}>{file.name}</span>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>Course created successfully!</Alert>}
          <Box mt={2} position="relative">
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              Create Course
            </Button>
            {loading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }} />}
          </Box>
        </form>
      </Box>
    </Container>
  );
} 