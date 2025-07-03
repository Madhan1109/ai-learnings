import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Button, RadioGroup, FormControlLabel, Radio, Paper, CircularProgress, Alert, List, ListItem, ListItemText } from '@mui/material';
import { useAuth } from '../auth/AuthContext';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

const WS_URL = 'http://localhost:8080/ws/notifications'; // Use http for SockJS

interface LiveQuizQuestion {
  id: number;
  text: string;
  options: string[];
}

interface LeaderboardEntry {
  user: string;
  score: number;
}

export default function LiveQuizPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [question, setQuestion] = useState<LiveQuizQuestion | null>(null);
  const [selected, setSelected] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    if (!user || !id) return;
    setLoading(true);
    setError(null);
    const socket = new SockJS(WS_URL);
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      onConnect: () => {
        setLoading(false);
        client.subscribe(`/topic/quiz/${id}`, (msg: IMessage) => {
          const body = JSON.parse(msg.body);
          if (body.type === 'question') setQuestion(body.data);
          if (body.type === 'leaderboard') setLeaderboard(body.data);
        });
      },
      onStompError: () => setError('WebSocket error'),
      onWebSocketError: () => setError('WebSocket connection failed'),
      onDisconnect: () => setError('WebSocket disconnected'),
    });
    stompClient.current = client;
    client.activate();
    return () => {
      client.deactivate();
    };
  }, [user, id]);

  const handleSubmit = () => {
    if (!selected || !user || !stompClient.current || !stompClient.current.connected) return;
    setSubmitting(true);
    stompClient.current.publish({
      destination: `/app/quiz/${id}/answer`,
      body: JSON.stringify({ user: user.username, answer: selected }),
    });
    setSelected('');
    setSubmitting(false);
  };

  if (!user) return <div>Not authenticated</div>;
  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Live Quiz</Typography>
        {question && (
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1">{question.text}</Typography>
            <RadioGroup
              value={selected}
              onChange={e => setSelected(e.target.value)}
            >
              {question.options.map(opt => (
                <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
              ))}
            </RadioGroup>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!selected || submitting || !stompClient.current || !stompClient.current.connected}
              sx={{ mt: 2 }}
            >
              Submit Answer
            </Button>
          </Paper>
        )}
        <Typography variant="h6" gutterBottom>Leaderboard</Typography>
        <List>
          {leaderboard.map((entry, idx) => (
            <ListItem key={idx}>
              <ListItemText primary={`${entry.user}: ${entry.score}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
} 