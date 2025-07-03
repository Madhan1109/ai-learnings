import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getQuiz, submitQuiz, Quiz, Question } from './assessmentApi';
import { Container, Typography, Box, RadioGroup, FormControlLabel, Radio, Button, Alert, CircularProgress } from '@mui/material';

export default function AssessmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      setError(null);
      getQuiz(Number(id))
        .then(res => setQuiz(res.data))
        .catch(() => setError('Failed to load quiz'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (questionId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await submitQuiz(Number(id), answers);
      setResult(res.data);
      setSubmitted(true);
    } catch (err: any) {
      setError('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!quiz) return null;

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>{quiz.title}</Typography>
        <form onSubmit={handleSubmit}>
          {quiz.questions?.map((q: Question) => (
            <Box key={q.id} mb={3}>
              <Typography variant="subtitle1">{q.text}</Typography>
              <RadioGroup
                value={answers[q.id!] || ''}
                onChange={e => handleChange(q.id!, e.target.value)}
              >
                {q.options.map(opt => (
                  <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
                ))}
              </RadioGroup>
            </Box>
          ))}
          {error && <Alert severity="error">{error}</Alert>}
          {submitted && result && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {result.score !== undefined ? `Your score: ${result.score}` : 'Quiz submitted!'}
            </Alert>
          )}
          {!submitted && (
            <Box mt={2} position="relative">
              <Button type="submit" variant="contained" color="primary" disabled={submitting}>
                Submit Quiz
              </Button>
              {submitting && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }} />}
            </Box>
          )}
        </form>
      </Box>
    </Container>
  );
} 