import React, { useEffect, useRef, useState } from 'react';
import { Container, Typography, Box, List, ListItem, ListItemText, TextField, Button, Paper, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../auth/AuthContext';
import SockJS from 'sockjs-client';
import { Client, IMessage } from '@stomp/stompjs';

const WS_URL = 'http://localhost:8080/ws/notifications'; // Use http for SockJS

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<{ user: string; message: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const stompClient = useRef<Client | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setError(null);
    const socket = new SockJS(WS_URL);
    const client = new Client({
      webSocketFactory: () => socket as any,
      reconnectDelay: 5000,
      onConnect: () => {
        setLoading(false);
        client.subscribe('/topic/chat', (msg: IMessage) => {
          const body = JSON.parse(msg.body);
          setMessages(prev => [...prev, body]);
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
  }, [user]);

  const handleSend = () => {
    if (!input.trim() || !user || !stompClient.current || !stompClient.current.connected) return;
    const msg = { user: user.username, message: input };
    stompClient.current.publish({ destination: '/app/chat', body: JSON.stringify(msg) });
    setInput('');
  };

  if (!user) return <div>Not authenticated</div>;
  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Real-time Chat / Announcements</Typography>
        <Paper sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
          <List>
            {messages.map((msg, idx) => (
              <ListItem key={idx}>
                <ListItemText primary={msg.message} secondary={msg.user} />
              </ListItem>
            ))}
          </List>
        </Paper>
        <Box display="flex" gap={2}>
          <TextField
            value={input}
            onChange={e => setInput(e.target.value)}
            fullWidth
            placeholder="Type a message..."
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
          />
          <Button variant="contained" onClick={handleSend} disabled={!stompClient.current || !stompClient.current.connected}>
            Send
          </Button>
        </Box>
      </Box>
    </Container>
  );
} 