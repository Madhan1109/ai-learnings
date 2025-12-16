// Medical Report Analyzer - Type Definitions

export interface MedicalReport {
  id: number;
  fileName: string;
  injuryType: string;
  status: ProcessingStatus;
  fileSize: number;
  fileType: string;
  extractedText?: string;
  aiAnalysis?: string;
  finalAnalysis?: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export enum ProcessingStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface ReportAnalysisRequest {
  file: File;
  fileName: string;
  fileSize: number;
  fileType: string;
  injuryType?: string;
}

export interface ReportAnalysisResponse {
  reportId: number;
  status: string;
  analysis: string;
  injuryType: string;
  processingTime: string;
  message: string;
}

export interface HealthStatus {
  timestamp: string;
  service: string;
  overallStatus: string;
  services: {
    azureDocumentIntelligence: ServiceStatus;
    azureOpenAI: ServiceStatus;
    azureCognitiveSearch: ServiceStatus;
  };
  azureFreeTierInfo: {
    documentIntelligence: FreeTierInfo;
    openAI: FreeTierInfo;
    cognitiveSearch: FreeTierInfo;
  };
  ragPipelineStatus: {
    overallStatus: string;
    details: string;
    components: {
      documentProcessing: boolean;
      aiAnalysis: boolean;
      knowledgeRetrieval: boolean;
    };
  };
}

export interface ServiceStatus {
  status: string;
  usageInfo: string;
  indexInfo?: string;
}

export interface FreeTierInfo {
  limit: string;
  description: string;
}

export interface SystemReadiness {
  ready: boolean;
  timestamp: string;
  message: string;
}

export interface FileUploadState {
  isUploading: boolean;
  progress: number;
  error?: string;
  success?: boolean;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  currentStep: string;
  progress: number;
  error?: string;
  result?: ReportAnalysisResponse;
}
