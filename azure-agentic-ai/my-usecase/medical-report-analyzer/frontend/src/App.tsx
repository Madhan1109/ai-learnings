// Medical Report Analyzer - Main App Component

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Alert,
  Snackbar,
  Button,
} from '@mui/material';
import {
  LocalHospital as LocalHospitalIcon,
  Psychology as PsychologyIcon,
} from '@mui/icons-material';

import FileUpload from './components/FileUpload';
import ProcessingStatus from './components/ProcessingStatus';
import AnalysisResults from './components/AnalysisResults';
import MedicalReportAPI from './services/api';
import {
  ProcessingStatus as ProcessingStatusEnum,
  ReportAnalysisResponse,
  FileUploadState,
  AnalysisState,
} from './types';

// Create premium medical-themed Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Modern blue
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#059669', // Modern emerald
      light: '#10b981',
      dark: '#047857',
      contrastText: '#ffffff',
    },
    background: {
      default: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      paper: 'rgba(255, 255, 255, 0.95)',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.875rem',
      lineHeight: 1.3,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        elevation1: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
        elevation3: {
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.95rem',
          padding: '12px 24px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px 0 rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            background: 'rgba(37, 99, 235, 0.04)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 500,
          fontSize: '0.8rem',
        },
        filled: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          height: 8,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
        bar: {
          borderRadius: 10,
          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          '&:focus': {
            backgroundColor: 'transparent',
          },
          '&.MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: 'primary.main',
          },
          '&.MuiInputLabel-shrink': {
            color: 'primary.main',
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            transform: 'translateX(4px)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(37, 99, 235, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(37, 99, 235, 0.16)',
            },
          },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          marginTop: 8,
          boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
          background: 'rgba(255, 255, 255, 0.95)',
        },
      },
    },
  },
});

function App() {
  // State management
  const [fileUploadState, setFileUploadState] = useState<FileUploadState>({
    isUploading: false,
    progress: 0,
  });

  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    isAnalyzing: false,
    currentStep: '',
    progress: 0,
  });

  const [currentStatus, setCurrentStatus] = useState<ProcessingStatusEnum>(
    ProcessingStatusEnum.PENDING
  );

  const [currentReportId, setCurrentReportId] = useState<number | undefined>();
  const [analysisResult, setAnalysisResult] = useState<ReportAnalysisResponse | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');

  // Show snackbar notification
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Handle file upload and analysis
  const handleFileUpload = async (file: File, injuryType?: string) => {
    try {
      setError(undefined);
      setFileUploadState({ isUploading: true, progress: 0 });
      setAnalysisState({ isAnalyzing: true, currentStep: 'Starting analysis...', progress: 0 });
      setCurrentStatus(ProcessingStatusEnum.PROCESSING);

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setFileUploadState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 100)
        }));
      }, 200);

      // Start analysis
      const result = await MedicalReportAPI.analyzeMedicalReport(file, injuryType);
      
      clearInterval(uploadInterval);
      setFileUploadState({ isUploading: false, progress: 100, success: true });
      
      setCurrentReportId(result.reportId);
      setAnalysisResult(result);
      setCurrentStatus(ProcessingStatusEnum.COMPLETED);
      setAnalysisState({ isAnalyzing: false, currentStep: '', progress: 100, result });

      showSnackbar('Analysis completed successfully!', 'success');

      // Start polling for status updates
      MedicalReportAPI.pollStatus(result.reportId, (status) => {
        setCurrentStatus(status);
        
        if (status === ProcessingStatusEnum.COMPLETED) {
          // Fetch final results
          MedicalReportAPI.getAnalysisResults(result.reportId)
            .then(finalResult => {
              setAnalysisResult(finalResult);
              setAnalysisState(prev => ({ ...prev, result: finalResult }));
            })
            .catch(err => {
              console.error('Error fetching final results:', err);
              setError('Failed to fetch final analysis results');
            });
        } else if (status === ProcessingStatusEnum.FAILED) {
          setError('Analysis failed during processing');
          showSnackbar('Analysis failed', 'error');
        }
      });

    } catch (err: any) {
      console.error('Error during file upload/analysis:', err);
      
      const errorMessage = err.response?.data?.message || err.message || 'Analysis failed';
      setError(errorMessage);
      setCurrentStatus(ProcessingStatusEnum.FAILED);
      setFileUploadState({ isUploading: false, progress: 0, error: errorMessage });
      setAnalysisState({ isAnalyzing: false, currentStep: '', progress: 0, error: errorMessage });
      
      showSnackbar(errorMessage, 'error');
    }
  };

  // Reset state for new analysis
  const handleReset = () => {
    setFileUploadState({ isUploading: false, progress: 0 });
    setAnalysisState({ isAnalyzing: false, currentStep: '', progress: 0 });
    setCurrentStatus(ProcessingStatusEnum.PENDING);
    setCurrentReportId(undefined);
    setAnalysisResult(undefined);
    setError(undefined);
  };

  // Calculate overall progress
  const overallProgress = Math.round(
    (fileUploadState.progress + analysisState.progress) / 2
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Premium App Bar */}
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 3,
                p: 1.5,
                mr: 2,
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
              }}
            >
              <LocalHospitalIcon sx={{ fontSize: 28, color: 'white' }} />
            </Box>
            <Box>
              <Typography 
                variant="h5" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  letterSpacing: '-0.025em',
                }}
              >
                Medical Report Analyzer
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                AI-Powered Medical Analysis
              </Typography>
            </Box>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              px: 2,
              py: 1,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <PsychologyIcon sx={{ mr: 1, fontSize: 20, color: '#10b981' }} />
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'white' }}>
              Powered by Azure AI
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Premium Header */}
        <Box 
          sx={{ 
            textAlign: 'center', 
            mb: 6,
            animation: 'fadeInUp 0.8s ease-out',
            '@keyframes fadeInUp': {
              '0%': {
                opacity: 0,
                transform: 'translateY(30px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              color: 'white',
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
              fontWeight: 800,
              mb: 2,
              letterSpacing: '-0.025em',
            }}
          >
            AI-Powered Medical Report Analysis
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: 700, 
              mx: 'auto',
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            Upload patient medical reports and receive comprehensive AI-powered analysis with 
            treatment recommendations, recovery techniques, and medical knowledge integration.
          </Typography>
          
          {/* Feature Highlights */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 4, 
              mt: 4,
              flexWrap: 'wrap',
            }}
          >
            {[
              { icon: '🔍', text: 'Advanced OCR' },
              { icon: '🤖', text: 'AI Analysis' },
              { icon: '📚', text: 'Medical Knowledge' },
              { icon: '⚡', text: 'Real-time Processing' },
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 3,
                  px: 3,
                  py: 1.5,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    background: 'rgba(255, 255, 255, 0.15)',
                  },
                }}
              >
                <Typography sx={{ fontSize: '1.2rem', mr: 1 }}>{feature.icon}</Typography>
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  {feature.text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* File Upload Component */}
        <FileUpload
          onFileSelect={handleFileUpload}
          isUploading={fileUploadState.isUploading}
          uploadProgress={fileUploadState.progress}
          error={fileUploadState.error}
          success={fileUploadState.success}
        />

        {/* Processing Status */}
        {(currentStatus === ProcessingStatusEnum.PROCESSING || 
          currentStatus === ProcessingStatusEnum.COMPLETED || 
          currentStatus === ProcessingStatusEnum.FAILED) && (
          <ProcessingStatus
            status={currentStatus}
            currentStep={analysisState.currentStep}
            progress={overallProgress}
            reportId={currentReportId}
            error={error}
          />
        )}

        {/* Analysis Results */}
        {analysisResult && currentStatus === ProcessingStatusEnum.COMPLETED && (
          <AnalysisResults
            result={analysisResult}
            onDownload={() => {
              // Implement download functionality
              showSnackbar('Download feature coming soon!', 'info');
            }}
          />
        )}

        {/* Premium Reset Button */}
        {currentStatus === ProcessingStatusEnum.COMPLETED && (
          <Box 
            sx={{ 
              textAlign: 'center', 
              mt: 4,
              p: 4,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white',
                mb: 3,
                fontWeight: 600,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              Ready to analyze another report?
            </Typography>
            <Button
              variant="contained"
              onClick={handleReset}
              sx={{
                py: 2,
                px: 4,
                fontSize: '1.1rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 32px 0 rgba(37, 99, 235, 0.4)',
                borderRadius: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                  boxShadow: '0 12px 40px 0 rgba(37, 99, 235, 0.5)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Start New Analysis
            </Button>
          </Box>
        )}
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
