// Medical Report Analyzer - File Upload Component

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

interface FileUploadProps {
  onFileSelect: (file: File, injuryType?: string) => void;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string;
  success?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  isUploading = false,
  uploadProgress = 0,
  error,
  success,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [injuryType, setInjuryType] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB limit
  });

  const handleUpload = () => {
    if (selectedFile) {
      onFileSelect(selectedFile, injuryType || undefined);
    }
  };

  const handleInjuryTypeChange = (event: SelectChangeEvent) => {
    setInjuryType(event.target.value);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') {
      return <DescriptionIcon color="error" />;
    }
    return <DescriptionIcon color="primary" />;
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const resetSelection = () => {
    setSelectedFile(null);
    setInjuryType('');
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
        animation: 'slideInUp 0.6s ease-out',
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
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{
            color: 'text.primary',
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          Upload Medical Report
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto',
            lineHeight: 1.6,
          }}
        >
          Upload a medical report (PDF, JPG, JPEG, PNG) to analyze and get AI-powered recommendations.
          <br />
          <Typography component="span" variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
            Maximum file size: 10MB
          </Typography>
        </Typography>
      </Box>

      {/* Premium Injury Type Selection */}
      <FormControl 
        fullWidth 
        sx={{ 
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(37, 99, 235, 0.2)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              borderColor: 'rgba(37, 99, 235, 0.4)',
              boxShadow: '0 4px 20px 0 rgba(37, 99, 235, 0.1)',
            },
            '&.Mui-focused': {
              borderColor: 'primary.main',
              boxShadow: '0 8px 32px 0 rgba(37, 99, 235, 0.2)',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          },
          '& .MuiInputLabel-root': {
            left: 16,
            '&.Mui-focused': {
              color: 'primary.main',
              transform: 'translate(14px, -9px) scale(0.75)',
            },
            '&.MuiInputLabel-shrink': {
              transform: 'translate(14px, -9px) scale(0.75)',
            },
          },
        }}
      >
        <InputLabel 
          id="injury-type-label"
          shrink={injuryType !== ''}
          sx={{
            fontWeight: 600,
            color: 'text.primary',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            px: 1,
            '&.Mui-focused': {
              color: 'primary.main',
            },
            '&.MuiInputLabel-shrink': {
              color: 'primary.main',
            },
          }}
        >
          🏥 Injury Type (Optional)
        </InputLabel>
        <Select
          labelId="injury-type-label"
          value={injuryType}
          label="🏥 Injury Type (Optional)"
          onChange={handleInjuryTypeChange}
          displayEmpty
          renderValue={(selected) => {
            if (!selected) {
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                  <Typography>🔍</Typography>
                  <Typography>Select injury type (optional)</Typography>
                </Box>
              );
            }
            const injuryTypes = {
              knee: { emoji: '🦵', name: 'Knee Injury' },
              back: { emoji: '🫁', name: 'Back Injury' },
              shoulder: { emoji: '💪', name: 'Shoulder Injury' },
              ankle: { emoji: '🦶', name: 'Ankle Injury' },
              wrist: { emoji: '✋', name: 'Wrist Injury' },
              general: { emoji: '🏥', name: 'General Injury' },
            };
            const injury = injuryTypes[selected as keyof typeof injuryTypes];
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '1.1rem' }}>{injury?.emoji}</Typography>
                <Typography sx={{ fontWeight: 600 }}>{injury?.name}</Typography>
              </Box>
            );
          }}
          sx={{
            '& .MuiSelect-select': {
              py: 2,
              px: 2,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiSelect-icon': {
              color: 'primary.main',
            },
          }}
        >
          <MenuItem value="" disabled sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>🔍</Typography>
              <Typography>Select injury type (optional)</Typography>
            </Box>
          </MenuItem>
          <MenuItem value="knee">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 0.5 }}>
              <Typography sx={{ fontSize: '1.2rem' }}>🦵</Typography>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Knee Injury</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Patella, ACL, meniscus issues
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <MenuItem value="back">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 0.5 }}>
              <Typography sx={{ fontSize: '1.2rem' }}>🫁</Typography>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Back Injury</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Spine, lumbar, disc problems
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <MenuItem value="shoulder">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 0.5 }}>
              <Typography sx={{ fontSize: '1.2rem' }}>💪</Typography>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Shoulder Injury</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Rotator cuff, dislocation
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <MenuItem value="ankle">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 0.5 }}>
              <Typography sx={{ fontSize: '1.2rem' }}>🦶</Typography>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Ankle Injury</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Sprain, fracture, ligament
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <MenuItem value="wrist">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 0.5 }}>
              <Typography sx={{ fontSize: '1.2rem' }}>✋</Typography>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>Wrist Injury</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Carpal tunnel, sprain
                </Typography>
              </Box>
            </Box>
          </MenuItem>
          <MenuItem value="general">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 0.5 }}>
              <Typography sx={{ fontSize: '1.2rem' }}>🏥</Typography>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>General Injury</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Other medical conditions
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        </Select>
      </FormControl>

      {/* Premium File Upload Area */}
      <Box
        {...getRootProps()}
        sx={{
          border: '3px dashed',
          borderColor: isDragActive ? 'primary.main' : 'rgba(37, 99, 235, 0.3)',
          borderRadius: 4,
          p: 6,
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragActive 
            ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            borderColor: 'primary.main',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 20px 40px -12px rgba(37, 99, 235, 0.3)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            opacity: isDragActive ? 1 : 0,
            transition: 'opacity 0.3s ease',
          },
        }}
      >
        <input {...getInputProps()} />
        
        {!selectedFile ? (
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                mb: 3,
                boxShadow: '0 8px 32px 0 rgba(37, 99, 235, 0.3)',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                  '100%': { transform: 'scale(1)' },
                },
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 1,
              }}
            >
              {isDragActive ? 'Drop the file here' : 'Drag & drop a file here'}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                mb: 2,
                fontWeight: 500,
              }}
            >
              or click to browse files
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                flexWrap: 'wrap',
              }}
            >
              {['PDF', 'JPG', 'JPEG', 'PNG'].map((format) => (
                <Chip
                  key={format}
                  label={format}
                  size="small"
                  sx={{
                    background: 'rgba(37, 99, 235, 0.1)',
                    color: 'primary.main',
                    fontWeight: 600,
                    border: '1px solid rgba(37, 99, 235, 0.2)',
                  }}
                />
              ))}
            </Box>
          </Box>
        ) : (
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                p: 3,
                background: 'rgba(255, 255, 255, 0.8)',
                borderRadius: 3,
                border: '1px solid rgba(37, 99, 235, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  mr: 3,
                  boxShadow: '0 4px 20px 0 rgba(37, 99, 235, 0.3)',
                }}
              >
                {getFileIcon(selectedFile.name)}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 0.5,
                  }}
                >
                  {selectedFile.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 500,
                  }}
                >
                  {getFileSize(selectedFile.size)}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip 
                label={selectedFile.type || 'Unknown type'} 
                size="medium"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: 600,
                  px: 2,
                }}
              />
              <Chip 
                label={getFileSize(selectedFile.size)} 
                size="medium"
                sx={{
                  background: 'rgba(37, 99, 235, 0.1)',
                  color: 'primary.main',
                  fontWeight: 600,
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                  px: 2,
                }}
              />
            </Box>
          </Box>
        )}
      </Box>

      {/* Premium Upload Progress */}
      {isUploading && (
        <Box 
          sx={{ 
            mt: 4,
            p: 3,
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 3,
            border: '1px solid rgba(37, 99, 235, 0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            >
              <CloudUploadIcon sx={{ fontSize: 14, color: 'white' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
              Uploading and analyzing...
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={uploadProgress} 
            sx={{ 
              height: 12, 
              borderRadius: 6,
              mb: 2,
              '& .MuiLinearProgress-bar': {
                borderRadius: 6,
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              {uploadProgress}% complete
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
              Processing...
            </Typography>
          </Box>
        </Box>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Success Display */}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          File uploaded successfully! Analysis in progress...
        </Alert>
      )}

      {/* Premium Action Buttons */}
      <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
        {selectedFile && !isUploading && (
          <Button
            variant="contained"
            onClick={handleUpload}
            startIcon={<CloudUploadIcon />}
            disabled={isUploading}
            fullWidth
            sx={{
              py: 2,
              fontSize: '1.1rem',
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
            Upload & Analyze
          </Button>
        )}
        
        {selectedFile && !isUploading && (
          <Button
            variant="outlined"
            onClick={resetSelection}
            disabled={isUploading}
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
            Clear Selection
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default FileUpload;
