import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Alert,
  CircularProgress,
  Button,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Upload as UploadIcon,
  Search as SearchIcon,
  Analytics as AnalyticsIcon,
  Security as SecurityIcon,
  QuestionAnswer as QAIcon
} from '@mui/icons-material';

import DocumentUpload from '../../components/MedicalAI/DocumentUpload';
import DocumentSearch from '../../components/MedicalAI/DocumentSearch';
import AIInsights from '../../components/MedicalAI/AIInsights';
import ComplianceCheck from '../../components/MedicalAI/ComplianceCheck';
import MedicalQABot from '../../components/MedicalAI/MedicalQABot';
import DocumentStatus from '../../components/MedicalAI/DocumentStatus';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
}));

const StyledTab = styled(Tab)(({ theme }) => ({
  minHeight: 64,
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`medical-ai-tabpanel-${index}`}
      aria-labelledby={`medical-ai-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MedicalAI: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setError(null);
    // Refresh recent documents
    // fetchRecentDocuments();
  };

  const handleError = (message: string) => {
    setError(message);
    setSuccess(null);
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  useEffect(() => {
    // Clear messages after 5 seconds
    const timer = setTimeout(clearMessages, 5000);
    return () => clearTimeout(timer);
  }, [success, error]);

  const tabs = [
    {
      label: 'Document Upload',
      icon: <UploadIcon />,
      component: <DocumentUpload onSuccess={handleSuccess} onError={handleError} />
    },
    {
      label: 'Document Search',
      icon: <SearchIcon />,
      component: <DocumentSearch onSuccess={handleSuccess} onError={handleError} />
    },
    {
      label: 'AI Insights',
      icon: <AnalyticsIcon />,
      component: <AIInsights onSuccess={handleSuccess} onError={handleError} />
    },
    {
      label: 'Compliance Check',
      icon: <SecurityIcon />,
      component: <ComplianceCheck onSuccess={handleSuccess} onError={handleError} />
    },
    {
      label: 'Medical QA',
      icon: <QAIcon />,
      component: <MedicalQABot onSuccess={handleSuccess} onError={handleError} />
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Medical AI Assistant
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Leverage Azure AI to digitize, analyze, and gain insights from medical documents
        </Typography>
        
        {/* Success/Error Messages */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={clearMessages}>
            {success}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearMessages}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StyledPaper>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" gutterBottom>
                {recentDocuments.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Documents Processed
              </Typography>
            </Box>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledPaper>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" gutterBottom>
                95%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Compliance Rate
              </Typography>
            </Box>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledPaper>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" gutterBottom>
                <2s
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Search Response
              </Typography>
            </Box>
          </StyledPaper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StyledPaper>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" gutterBottom>
                90%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Time Saved
              </Typography>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Tabs */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="medical AI tabs"
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              {tabs.map((tab, index) => (
                <StyledTab
                  key={index}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {tab.icon}
                      {tab.label}
                    </Box>
                  }
                  id={`medical-ai-tab-${index}`}
                  aria-controls={`medical-ai-tabpanel-${index}`}
                />
              ))}
            </Tabs>

            {tabs.map((tab, index) => (
              <TabPanel key={index} value={tabValue} index={index}>
                {tab.component}
              </TabPanel>
            ))}
          </Paper>
        </Grid>

        {/* Recent Documents */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Recent Documents
            </Typography>
            {recentDocuments.length === 0 ? (
              <Typography color="text.secondary">
                No documents processed yet. Upload your first document to get started.
              </Typography>
            ) : (
              recentDocuments.map((doc, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {doc.documentName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    <Chip label={doc.documentType} size="small" color="primary" />
                    <Chip 
                      label={doc.processingStatus} 
                      size="small" 
                      color={doc.processingStatus === 'COMPLETED' ? 'success' : 'warning'} 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              ))
            )}
          </StyledPaper>
        </Grid>

        {/* Document Status */}
        <Grid item xs={12} md={6}>
          <DocumentStatus />
        </Grid>
      </Grid>

      {/* Loading Overlay */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <CircularProgress color="inherit" size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Processing...
            </Typography>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default MedicalAI;
