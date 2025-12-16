// Medical Report Analyzer - Processing Status Component

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  PlayArrow as PlayArrowIcon,
  Error as ErrorIcon,
  Description as DescriptionIcon,
  Psychology as PsychologyIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';
import { ProcessingStatus as ProcessingStatusEnum } from '../types';

interface ProcessingStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  icon: React.ReactNode;
}

interface ProcessingStatusProps {
  status: ProcessingStatusEnum;
  currentStep?: string;
  progress: number;
  reportId?: number;
  error?: string;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  status,
  currentStep,
  progress,
  reportId,
  error,
}) => {
  const getStatusColor = (status: ProcessingStatusEnum) => {
    switch (status) {
      case ProcessingStatusEnum.COMPLETED:
        return 'success';
      case ProcessingStatusEnum.PROCESSING:
        return 'warning';
      case ProcessingStatusEnum.FAILED:
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: ProcessingStatusEnum) => {
    switch (status) {
      case ProcessingStatusEnum.COMPLETED:
        return <CheckCircleIcon color="success" />;
      case ProcessingStatusEnum.PROCESSING:
        return <PlayArrowIcon color="warning" />;
      case ProcessingStatusEnum.FAILED:
        return <ErrorIcon color="error" />;
      default:
        return <PendingIcon color="disabled" />;
    }
  };

  const getStatusText = (status: ProcessingStatusEnum) => {
    switch (status) {
      case ProcessingStatusEnum.PENDING:
        return 'Waiting to start';
      case ProcessingStatusEnum.PROCESSING:
        return 'Processing in progress';
      case ProcessingStatusEnum.COMPLETED:
        return 'Analysis completed';
      case ProcessingStatusEnum.FAILED:
        return 'Analysis failed';
      default:
        return 'Unknown status';
    }
  };

  const processingSteps: ProcessingStep[] = [
    {
      id: 'upload',
      name: 'File Upload',
      description: 'Uploading and validating medical report',
      status: status === ProcessingStatusEnum.PENDING ? 'pending' : 'completed',
      icon: <DescriptionIcon />,
    },
    {
      id: 'ocr',
      name: 'Text Extraction',
      description: 'Extracting text using Azure Document Intelligence',
      status: 
        status === ProcessingStatusEnum.PENDING ? 'pending' :
        status === ProcessingStatusEnum.PROCESSING && currentStep === 'ocr' ? 'processing' :
        status === ProcessingStatusEnum.COMPLETED || status === ProcessingStatusEnum.FAILED ? 'completed' : 'pending',
      icon: <DescriptionIcon />,
    },
    {
      id: 'ai',
      name: 'AI Analysis',
      description: 'Analyzing content using Azure OpenAI',
      status: 
        status === ProcessingStatusEnum.PENDING ? 'pending' :
        status === ProcessingStatusEnum.PROCESSING && currentStep === 'ai' ? 'processing' :
        status === ProcessingStatusEnum.COMPLETED || status === ProcessingStatusEnum.FAILED ? 'completed' : 'pending',
      icon: <PsychologyIcon />,
    },
    {
      id: 'knowledge',
      name: 'Knowledge Integration',
      description: 'Enhancing with medical knowledge base',
      status: 
        status === ProcessingStatusEnum.PENDING ? 'pending' :
        status === ProcessingStatusEnum.PROCESSING && currentStep === 'knowledge' ? 'processing' :
        status === ProcessingStatusEnum.COMPLETED || status === ProcessingStatusEnum.FAILED ? 'completed' : 'pending',
      icon: <ScienceIcon />,
    },
  ];

  const getStepIcon = (step: ProcessingStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircleIcon color="success" />;
      case 'processing':
        return <CircularProgress size={20} color="warning" />;
      case 'failed':
        return <ErrorIcon color="error" />;
      default:
        return <PendingIcon color="disabled" />;
    }
  };

  const getStepColor = (step: ProcessingStep) => {
    switch (step.status) {
      case 'completed':
        return 'success.main';
      case 'processing':
        return 'warning.main';
      case 'failed':
        return 'error.main';
      default:
        return 'text.disabled';
    }
  };

  if (status === ProcessingStatusEnum.COMPLETED) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CheckCircleIcon color="success" sx={{ mr: 2, fontSize: 32 }} />
          <Box>
            <Typography variant="h6" color="success.main">
              Analysis Completed Successfully!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Report ID: {reportId} • All processing steps completed
            </Typography>
          </Box>
        </Box>
      </Paper>
    );
  }

  if (status === ProcessingStatusEnum.FAILED) {
    return (
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ErrorIcon color="error" sx={{ mr: 2, fontSize: 32 }} />
          <Box>
            <Typography variant="h6" color="error.main">
              Analysis Failed
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Report ID: {reportId} • An error occurred during processing
            </Typography>
          </Box>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Error Details:</strong> {error}
            </Typography>
          </Alert>
        )}
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        {getStatusIcon(status)}
        <Box sx={{ ml: 2 }}>
          <Typography variant="h6">
            {getStatusText(status)}
          </Typography>
          {reportId && (
            <Typography variant="body2" color="text.secondary">
              Report ID: {reportId}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ ml: 'auto' }}>
          <Chip
            label={status}
            color={getStatusColor(status) as any}
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Overall Progress</Typography>
          <Typography variant="body2" color="primary">
            {Math.round(progress)}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {/* Processing Steps */}
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Processing Steps
        </Typography>
        
        <List>
          {processingSteps.map((step) => (
            <ListItem key={step.id} sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {getStepIcon(step)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: getStepColor(step),
                      fontWeight: step.status === 'processing' ? 'bold' : 'normal'
                    }}
                  >
                    {step.name}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    {step.description}
                  </Typography>
                }
              />
              
              {step.status === 'processing' && (
                <CircularProgress size={16} color="warning" />
              )}
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Current Step Info */}
      {currentStep && status === ProcessingStatusEnum.PROCESSING && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Current Step:</strong> {currentStep}
          </Typography>
        </Alert>
      )}

      {/* Processing Note */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Medical report analysis typically takes 15-30 seconds. 
          Please wait while our AI processes your document.
        </Typography>
      </Alert>
    </Paper>
  );
};

export default ProcessingStatus;
