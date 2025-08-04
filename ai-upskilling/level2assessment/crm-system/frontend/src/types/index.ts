// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isActive: boolean;
  isLocked: boolean;
  roles: string[];
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Customer Types
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry?: string;
  status: string;
  leadScore: number;
  source: string;
  assignedTo?: number;
  createdAt: string;
  updatedAt: string;
}

// Sales Types
export interface Opportunity {
  id: number;
  name: string;
  description: string;
  customerId: number;
  customerName: string;
  stage: string;
  value: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: number;
  dueDate: string;
  priority: string;
  status: string;
  opportunityId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SalesMetrics {
  totalRevenue: number;
  activeOpportunities: number;
  conversionRate: number;
  avgDealSize: number;
  monthlyGrowth: number;
  quarterlyGrowth: number;
}

// Analytics Types
export interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    growth: number;
  };
  customers: {
    current: number;
    previous: number;
    growth: number;
  };
  conversionRate: {
    current: number;
    previous: number;
    growth: number;
  };
  avgDealSize: {
    current: number;
    previous: number;
    growth: number;
  };
  revenueData: ChartData[];
  customerData: ChartData[];
  salesData: ChartData[];
  insights: AIInsight[];
}

export interface ChartData {
  date: string;
  value: number;
  label: string;
}

export interface AIInsight {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  confidence: number;
  action?: string;
  createdAt: string;
}

export interface Prediction {
  id: string;
  type: 'revenue' | 'customer' | 'conversion';
  value: number;
  confidence: number;
  timeframe: string;
  factors: string[];
  createdAt: string;
}

export interface AnalyticsReport {
  id: number;
  reportType: string;
  title: string;
  content: string;
  confidence: number;
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}

// Notification Types
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  priority: string;
  recipientId: number;
  read: boolean;
  sent: boolean;
  actionUrl?: string;
  actionText?: string;
  metadata?: string;
  createdAt: string;
  updatedAt: string;
}

// UI Types
export interface UIState {
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };
  loading: boolean;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
}

// API Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface LoginForm {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  company: string;
  phone?: string;
}

// Filter Types
export interface CustomerFilter {
  search: string;
  status: string;
  source: string;
  assignedTo: string;
  dateRange: {
    start: string;
    end: string;
  };
}

export interface SalesFilter {
  stage: string;
  assignedTo: string;
  dateRange: {
    start: string;
    end: string;
  };
  minValue: number;
  maxValue: number;
}

// Settings Types
export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    sales: boolean;
    customers: boolean;
    system: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    dateFormat: string;
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
    marketing: boolean;
  };
}

// Component Props Types
export interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  fullScreen?: boolean;
}

export interface SnackbarProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
  autoHideDuration?: number;
}

// Chart Types
export interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  data: any;
  options: any;
  height?: number;
  width?: number;
}

// Socket Types
export interface SocketEvent {
  type: string;
  data: any;
  timestamp: string;
  userId?: string;
}

// AI Types
export interface AIRecommendation {
  id: string;
  type: 'lead' | 'opportunity' | 'customer' | 'sales';
  title: string;
  description: string;
  confidence: number;
  action: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface SentimentAnalysis {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  keywords: string[];
  score: number;
} 