import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { getCurrentUser, updateCurrentUser } from './authApi';

export default function UserProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load profile');
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await updateCurrentUser({ email: user.email, fullName: user.fullName });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch {
      setError('Failed to update profile');
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!user) return null;

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>User Profile</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            name="username"
            value={user.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            label="Email"
            name="email"
            value={user.email || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Full Name"
            name="fullName"
            value={user.fullName || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          {success && <Alert severity="success" sx={{ mt: 2 }}>Profile updated!</Alert>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
            Save Changes
          </Button>
        </form>
      </Box>
    </Container>
  );
} 