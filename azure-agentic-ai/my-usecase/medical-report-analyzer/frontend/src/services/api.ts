// Medical Report Analyzer - API Service

import axios from 'axios';
import { 
  ReportAnalysisRequest, 
  ReportAnalysisResponse, 
  HealthStatus, 
  SystemReadiness,
  ProcessingStatus 
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    if (error.response?.status === 500) {
      console.error('Server Error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

export class MedicalReportAPI {
  /**
   * Upload and analyze medical report
   */
  static async analyzeMedicalReport(
    file: File, 
    injuryType?: string
  ): Promise<ReportAnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (injuryType) {
      formData.append('injuryType', injuryType);
    }

    const response = await apiClient.post<ReportAnalysisResponse>(
      '/api/medical-reports/analyze',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  /**
   * Get analysis status for a report
   */
  static async getAnalysisStatus(reportId: number): Promise<ProcessingStatus> {
    const response = await apiClient.get(`/api/medical-reports/${reportId}/status`);
    return response.data.status;
  }

  /**
   * Get completed analysis results
   */
  static async getAnalysisResults(reportId: number): Promise<ReportAnalysisResponse> {
    const response = await apiClient.get<ReportAnalysisResponse>(
      `/api/medical-reports/${reportId}/results`
    );
    return response.data;
  }

  /**
   * Get comprehensive health status
   */
  static async getHealthStatus(): Promise<HealthStatus> {
    const response = await apiClient.get<HealthStatus>('/api/medical-reports/health');
    return response.data;
  }

  /**
   * Check system readiness
   */
  static async checkSystemReadiness(): Promise<SystemReadiness> {
    const response = await apiClient.get<SystemReadiness>('/api/medical-reports/ready');
    return response.data;
  }

  /**
   * Poll for status updates
   */
  static async pollStatus(
    reportId: number, 
    onStatusChange: (status: ProcessingStatus) => void,
    interval: number = 2000
  ): Promise<void> {
    const poll = async () => {
      try {
        const status = await this.getAnalysisStatus(reportId);
        onStatusChange(status);
        
        if (status === ProcessingStatus.COMPLETED || status === ProcessingStatus.FAILED) {
          return; // Stop polling
        }
        
        // Continue polling
        setTimeout(poll, interval);
      } catch (error) {
        console.error('Error polling status:', error);
        // Continue polling even on error
        setTimeout(poll, interval);
      }
    };

    poll();
  }
}

export default MedicalReportAPI;
