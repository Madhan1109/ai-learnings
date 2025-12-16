import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  CloudUpload as UploadIcon,
  Description as FileIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const DropZone = styled(Box)(({ theme, isDragOver }: { theme: any; isDragOver: boolean }) => ({
  border: `2px dashed ${isDragOver ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: isDragOver ? theme.palette.action.hover : theme.palette.background.paper,
  transition: 'all 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const FileCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

interface DocumentUploadProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onSuccess, onError }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [documentType, setDocumentType] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentTypes = [
    { value: 'PATIENT_RECORD', label: 'Patient Record', description: 'Medical history, test results, treatment plans' },
    { value: 'RESEARCH_PAPER', label: 'Research Paper', description: 'Clinical studies, medical research, case reports' },
    { value: 'COMPLIANCE_DOC', label: 'Compliance Document', description: 'Regulatory documents, audit reports' },
    { value: 'MEDICAL_REPORT', label: 'Medical Report', description: 'Lab reports, imaging results, consultation notes' },
    { value: 'CLINICAL_TRIAL', label: 'Clinical Trial', description: 'Trial protocols, results, safety reports' },
    { value: 'DRUG_APPROVAL', label: 'Drug Approval', description: 'FDA submissions, drug information, safety data' },
    { value: 'DEVICE_APPROVAL', label: 'Device Approval', description: 'Medical device documentation, safety reports' },
    { value: 'CASE_STUDY', label: 'Case Study', description: 'Clinical cases, patient outcomes, treatment analysis' }
  ];

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).filter(file => 
        file.type === 'application/pdf' || 
        file.type === 'image/jpeg' || 
        file.type === 'image/png' ||
        file.type === 'image/tiff' ||
        file.type === 'application/msword' ||
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      
      if (newFiles.length !== files.length) {
        onError('Some files were skipped. Only PDF, images, and Word documents are supported.');
      }
      
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      onError('Please select files to upload');
      return;
    }

    if (!documentType) {
      onError('Please select a document type');
      return;
    }

    setUploading(true);
    setUploadProgress({});

    try {
      const uploadPromises = selectedFiles.map(async (file, index) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', documentType);
        formData.append('uploadedBy', 'current-user'); // Replace with actual user ID

        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          setUploadProgress(prev => ({ ...prev, [file.name]: i }));
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // TODO: Replace with actual API call
        // const response = await fetch('/api/medical-ai/documents/upload', {
        //   method: 'POST',
        //   body: formData,
        // });

        // if (!response.ok) {
        //   throw new Error(`Upload failed for ${file.name}`);
        // }

        return { file, success: true };
      });

      await Promise.all(uploadPromises);
      
      onSuccess(`Successfully uploaded ${selectedFiles.length} document(s)`);
      setSelectedFiles([]);
      setDocumentType('');
      
    } catch (error) {
      onError(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') return '📄';
    if (file.type.startsWith('image/')) return '🖼️';
    if (file.type.includes('word')) return '📝';
    return '📄';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Upload Medical Documents
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Upload medical documents for AI-powered analysis, OCR processing, and compliance checking.
      </Typography>

      {/* Document Type Selection */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Document Type</InputLabel>
        <Select
          value={documentType}
          label="Document Type"
          onChange={(e) => setDocumentType(e.target.value)}
        >
          {documentTypes.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              <Box>
                <Typography variant="body1">{type.label}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {type.description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* File Upload Area */}
      <DropZone
        isDragOver={dragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png,.tiff,.doc,.docx"
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
        />
        
        <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Drop files here or click to browse
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Supports PDF, images (JPEG, PNG, TIFF), and Word documents
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Maximum file size: 50MB per file
        </Typography>
      </DropZone>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Selected Files ({selectedFiles.length})
          </Typography>
          
          {selectedFiles.map((file, index) => (
            <FileCard key={index}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Typography variant="h4">{getFileIcon(file)}</Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="subtitle1" noWrap>
                      {file.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatFileSize(file.size)} • {file.type}
                    </Typography>
                    {uploadProgress[file.name] !== undefined && (
                      <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress 
                            variant="determinate" 
                            value={uploadProgress[file.name]} 
                            size={20} 
                          />
                          <Typography variant="caption">
                            {uploadProgress[file.name]}%
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Grid>
                  <Grid item>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => removeFile(index)}
                      disabled={uploading}
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </FileCard>
          ))}
        </Box>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={uploadFiles}
            disabled={uploading || !documentType}
            startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
          >
            {uploading ? 'Uploading...' : `Upload ${selectedFiles.length} File(s)`}
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedFiles([]);
              setDocumentType('');
            }}
            disabled={uploading}
          >
            Clear All
          </Button>
        </Box>
      )}

      {/* Upload Guidelines */}
      <Paper sx={{ mt: 3, p: 2, backgroundColor: 'info.light' }}>
        <Typography variant="h6" gutterBottom>
          📋 Upload Guidelines
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" component="div">
              <strong>Supported Formats:</strong>
              <ul>
                <li>PDF documents</li>
                <li>Images (JPEG, PNG, TIFF)</li>
                <li>Word documents (DOC, DOCX)</li>
              </ul>
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" component="div">
              <strong>Processing Features:</strong>
              <ul>
                <li>OCR text extraction</li>
                <li>AI-powered summarization</li>
                <li>Compliance checking</li>
                <li>Medical insights extraction</li>
              </ul>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default DocumentUpload;
