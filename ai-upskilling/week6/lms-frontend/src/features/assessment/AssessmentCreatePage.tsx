import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../auth/AuthContext';
import { createQuiz, Quiz, Question } from './assessmentApi';

export default function AssessmentCreatePage() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isInstructor = user?.roles?.includes('admin') || user?.roles?.includes('instructor');
  if (!isInstructor) {
    return <Alert severity="error" sx={{ mt: 4 }}>You are not authorized to create assessments.</Alert>;
  }

  const handleAddQuestion = () => {
    if (!questionText || options.some(opt => !opt) || !answer) return;
    setQuestions([...questions, { quizId: 0, text: questionText, options, answer }]);
    setQuestionText('');
    setOptions(['', '', '', '']);
    setAnswer('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      const quiz: Quiz = {
        courseId: Number(courseId),
        title,
        questions,
      };
      await createQuiz(quiz);
      setSuccess(true);
      setTitle('');
      setCourseId('');
      setQuestions([]);
    } catch {
      setError('Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Create New Quiz</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Course ID"
            value={courseId}
            onChange={e => setCourseId(e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled={loading}
          />
          <TextField
            label="Quiz Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
            disabled={loading}
          />
          <Box mt={2} mb={2}>
            <Typography variant="subtitle1">Add Question</Typography>
            <TextField
              label="Question Text"
              value={questionText}
              onChange={e => setQuestionText(e.target.value)}
              fullWidth
              margin="normal"
              disabled={loading}
            />
            {options.map((opt, idx) => (
              <TextField
                key={idx}
                label={`Option ${idx + 1}`}
                value={opt}
                onChange={e => {
                  const newOpts = [...options];
                  newOpts[idx] = e.target.value;
                  setOptions(newOpts);
                }}
                fullWidth
                margin="dense"
                disabled={loading}
              />
            ))}
            <TextField
              label="Correct Answer"
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              fullWidth
              margin="normal"
              disabled={loading}
            />
            <Button onClick={handleAddQuestion} variant="outlined" sx={{ mt: 1 }} disabled={loading}>
              Add Question
            </Button>
          </Box>
          <Box mb={2}>
            <Typography variant="subtitle2">Questions:</Typography>
            {questions.map((q, idx) => (
              <Box key={idx} mb={1}>
                <Typography>{idx + 1}. {q.text}</Typography>
              </Box>
            ))}
          </Box>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>Quiz created successfully!</Alert>}
          <Box mt={2} position="relative">
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              Create Quiz
            </Button>
            {loading && <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', left: '50%', mt: '-12px', ml: '-12px' }} />}
          </Box>
        </form>
      </Box>
    </Container>
  );
} 