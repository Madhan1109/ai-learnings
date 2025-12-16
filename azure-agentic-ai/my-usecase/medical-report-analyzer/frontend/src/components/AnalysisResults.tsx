// Medical Report Analyzer - Analysis Results Component

import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Description as DescriptionIcon,
  Psychology as PsychologyIcon,
  Science as ScienceIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import { ReportAnalysisResponse, ProcessingStatus } from '../types';

interface AnalysisResultsProps {
  result: ReportAnalysisResponse;
  onDownload?: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onDownload }) => {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PROCESSING':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getInjuryTypeColor = (injuryType: string) => {
    if (!injuryType) return '#616161'; // Handle undefined/null injuryType
    
    const colors: { [key: string]: string } = {
      knee: '#1976d2',
      back: '#388e3c',
      shoulder: '#f57c00',
      ankle: '#7b1fa2',
      wrist: '#d32f2f',
      general: '#616161',
    };
    return colors[injuryType.toLowerCase()] || '#616161';
  };

  const parseAnalysisContent = (analysis: string) => {
    // Enhanced parsing for better structure with intelligent content splitting
    const sections = analysis.split(/\n\n+/);
    const parsedSections = [];
    
    for (const section of sections) {
      const trimmed = section.trim();
      if (trimmed.length === 0) continue;
      
      // Check for different section types
      if (trimmed.match(/^#{1,3}\s+/)) {
        // Markdown-style headers
        const level = trimmed.match(/^#{1,3}/)?.[0].length || 1;
        const title = trimmed.replace(/^#{1,3}\s+/, '').trim();
        parsedSections.push({ type: 'header', level, content: title });
      } else if (trimmed.match(/^[A-Z][^:]*:/)) {
        // Title: content format
        const [title, ...contentParts] = trimmed.split(':');
        const content = contentParts.join(':').trim();
        parsedSections.push({ type: 'title', content: title.trim(), description: content });
      } else if (trimmed.includes('•') || trimmed.includes('-') || trimmed.includes('*')) {
        // Bullet points
        const points = trimmed.split(/\n/).filter(line => line.trim().length > 0);
        const cleanPoints = points.map(point => 
          point.replace(/^[•\-\*]\s*/, '').trim()
        ).filter(point => point.length > 0);
        parsedSections.push({ type: 'bullets', content: cleanPoints });
      } else if (trimmed.match(/^\d+\./)) {
        // Numbered list
        const points = trimmed.split(/\n/).filter(line => line.trim().length > 0);
        const cleanPoints = points.map(point => 
          point.replace(/^\d+\.\s*/, '').trim()
        ).filter(point => point.length > 0);
        parsedSections.push({ type: 'numbered', content: cleanPoints });
      } else {
        // Check if it's a long paragraph that should be split
        const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 15);
        
        if (sentences.length > 3 && trimmed.length > 200) {
          // Only convert very long paragraphs into bullet points
          const points = sentences.map(s => s.trim()).filter(s => s.length > 0);
          parsedSections.push({ type: 'bullets', content: points });
        } else {
          // Keep as paragraph for most content
          parsedSections.push({ type: 'paragraph', content: trimmed });
        }
      }
    }
    
    return parsedSections;
  };

  const renderAnalysisSection = (section: any, index: number) => {
    switch (section.type) {
      case 'header':
        const HeaderComponent = section.level === 1 ? 'h3' : section.level === 2 ? 'h4' : 'h5';
        return (
          <Box key={index} sx={{ mb: 4, mt: index > 0 ? 5 : 0 }}>
            <Typography 
              component={HeaderComponent}
              sx={{ 
                color: 'primary.main',
                fontWeight: 800,
                mb: 3,
                pb: 2,
                fontSize: section.level === 1 ? '2rem' : section.level === 2 ? '1.6rem' : '1.4rem',
                borderBottom: '3px solid',
                borderColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                textShadow: '0 2px 4px rgba(37, 99, 235, 0.3)',
                letterSpacing: '0.5px',
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 28,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 3,
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.4)',
                }}
              />
              {section.content}
            </Typography>
          </Box>
        );

      case 'title':
        return (
          <Box key={index} sx={{ mb: 4 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: 'text.primary',
                fontWeight: 700,
                mb: 2,
                fontSize: '1.3rem',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                textShadow: '0 1px 3px rgba(0,0,0,0.2)',
                letterSpacing: '0.3px',
              }}
            >
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
                }}
              />
              {section.content}
            </Typography>
            {section.description && (
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.secondary',
                  lineHeight: 1.7,
                  pl: 4,
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                {section.description}
              </Typography>
            )}
          </Box>
        );

      case 'bullets':
        return (
          <Box key={index} sx={{ mb: 4 }}>
            <Box
              sx={{
                background: 'rgba(37, 99, 235, 0.02)',
                borderRadius: 3,
                p: 4,
                border: '1px solid rgba(37, 99, 235, 0.08)',
                boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)',
              }}
            >
              {section.content.map((point: string, pointIndex: number) => (
                <Box
                  key={pointIndex}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    mb: pointIndex < section.content.length - 1 ? 2.5 : 0,
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.primary',
                      lineHeight: 1.7,
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    }}
                  >
                    {point}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        );

      case 'numbered':
        return (
          <Box key={index} sx={{ mb: 4 }}>
            <Box
              sx={{
                background: 'rgba(37, 99, 235, 0.02)',
                borderRadius: 3,
                p: 4,
                border: '1px solid rgba(37, 99, 235, 0.08)',
                boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)',
              }}
            >
              {section.content.map((point: string, pointIndex: number) => (
                <Box
                  key={pointIndex}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    mb: pointIndex < section.content.length - 1 ? 2.5 : 0,
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.primary',
                      lineHeight: 1.7,
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                    }}
                  >
                    {point}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        );

      case 'paragraph':
      default:
        return (
          <Box key={index} sx={{ mb: 4 }}>
            <Box
              sx={{
                background: 'rgba(37, 99, 235, 0.02)',
                borderRadius: 3,
                p: 4,
                border: '1px solid rgba(37, 99, 235, 0.08)',
                boxShadow: '0 4px 20px rgba(37, 99, 235, 0.1)',
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'text.primary',
                  lineHeight: 1.7,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textAlign: 'justify',
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              >
                {section.content}
              </Typography>
            </Box>
          </Box>
        );
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        mb: 4,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        animation: 'slideInUp 0.8s ease-out',
        '@keyframes slideInUp': {
          '0%': {
            opacity: 0,
            transform: 'translateY(40px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      {/* Premium Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              color: 'text.primary',
              fontWeight: 800,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            Analysis Results
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Report ID: {result.reportId} • Processed: {formatTimestamp(result.processingTime)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip
            label={result.status}
            color={getStatusColor(result.status) as any}
            sx={{
              fontWeight: 600,
              fontSize: '0.9rem',
              px: 2,
              py: 1,
              height: 'auto',
            }}
          />
          <Chip
            label={result.injuryType || 'Unknown'}
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.9rem',
              px: 2,
              py: 1,
              height: 'auto',
            }}
          />
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Success Message */}
      {result.message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {result.message}
        </Alert>
      )}

      {/* Premium Analysis Content */}
      <Box sx={{ mb: 4 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 3,
            p: 2,
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            borderRadius: 3,
            border: '1px solid rgba(37, 99, 235, 0.2)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              mr: 2,
              boxShadow: '0 4px 20px 0 rgba(37, 99, 235, 0.3)',
            }}
          >
            <PsychologyIcon sx={{ fontSize: 24, color: 'white' }} />
          </Box>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            AI Analysis & Recommendations
          </Typography>
        </Box>
        
        <Card 
          variant="outlined" 
          sx={{ 
            mb: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(37, 99, 235, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(37, 99, 235, 0.1)',
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box
              sx={{
                '& > *:first-of-type': {
                  mt: 0,
                },
                '& > *:last-of-type': {
                  mb: 0,
                },
              }}
            >
              {(() => {
                const parsedContent = parseAnalysisContent(result.analysis);
                if (parsedContent.length === 0) {
                  // Fallback for unformatted content
                  return (
                    <Box sx={{ mb: 3 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          color: 'text.primary',
                          lineHeight: 1.7,
                          textAlign: 'justify',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {result.analysis}
                      </Typography>
                    </Box>
                  );
                }
                return parsedContent.map((section, index) => 
                  renderAnalysisSection(section, index)
                );
              })()}
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Detailed Information */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 1, color: 'info.main' }} />
            Detailed Information
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Report ID</Typography>
              <Typography variant="body2">{result.reportId}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Injury Type</Typography>
              <Typography variant="body2">{result.injuryType || 'Unknown'}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Status</Typography>
              <Typography variant="body2">{result.status}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Processing Time</Typography>
              <Typography variant="body2">{formatTimestamp(result.processingTime)}</Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>

      {/* Premium Action Buttons */}
      <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
        {onDownload && (
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onDownload}
            sx={{
              py: 2,
              px: 4,
              fontSize: '1rem',
              fontWeight: 600,
              borderWidth: '2px',
              borderColor: 'rgba(37, 99, 235, 0.3)',
              color: 'primary.main',
              '&:hover': {
                borderWidth: '2px',
                borderColor: 'primary.main',
                background: 'rgba(37, 99, 235, 0.04)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            Download Report
          </Button>
        )}
        
        <Button
          variant="contained"
          onClick={() => window.print()}
          sx={{
            py: 2,
            px: 4,
            fontSize: '1rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 8px 32px 0 rgba(37, 99, 235, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              boxShadow: '0 12px 40px 0 rgba(37, 99, 235, 0.5)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Print Results
        </Button>
      </Box>

      {/* Medical Disclaimer */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Medical Disclaimer:</strong> This analysis is provided by AI technology and should not replace 
          professional medical advice. Always consult with qualified healthcare professionals for medical decisions.
        </Typography>
      </Alert>
    </Paper>
  );
};

export default AnalysisResults;
