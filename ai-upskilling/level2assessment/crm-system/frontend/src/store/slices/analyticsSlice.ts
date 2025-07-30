import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { analyticsService } from '../../services/analyticsService';

export interface AnalyticsReport {
  id: number;
  reportType: string;
  title: string;
  description: string;
  insights: string;
  recommendations: string;
  aiGenerated: boolean;
  confidenceScore: number;
  dataPointsAnalyzed: number;
  timePeriodStart: string;
  timePeriodEnd: string;
  createdAt: string;
}

export interface AnalyticsState {
  reports: AnalyticsReport[];
  selectedReport: AnalyticsReport | null;
  loading: boolean;
  error: string | null;
  insights: {
    salesTrends: any;
    customerSegments: any;
    churnPrediction: any;
    revenueForecast: any;
    performanceMetrics: any;
    marketAnalysis: any;
  };
}

const initialState: AnalyticsState = {
  reports: [],
  selectedReport: null,
  loading: false,
  error: null,
  insights: {
    salesTrends: {},
    customerSegments: {},
    churnPrediction: {},
    revenueForecast: {},
    performanceMetrics: {},
    marketAnalysis: {},
  },
};

export const fetchReports = createAsyncThunk(
  'analytics/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsService.getReports();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports');
    }
  }
);

export const analyzeSalesTrends = createAsyncThunk(
  'analytics/analyzeSalesTrends',
  async (salesData: any[], { rejectWithValue }) => {
    try {
      const response = await analyticsService.analyzeSalesTrends(salesData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to analyze sales trends');
    }
  }
);

export const segmentCustomers = createAsyncThunk(
  'analytics/segmentCustomers',
  async (customerData: any[], { rejectWithValue }) => {
    try {
      const response = await analyticsService.segmentCustomers(customerData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to segment customers');
    }
  }
);

export const predictChurn = createAsyncThunk(
  'analytics/predictChurn',
  async (customerData: any, { rejectWithValue }) => {
    try {
      const response = await analyticsService.predictChurn(customerData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to predict churn');
    }
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setSelectedReport: (state, action: PayloadAction<AnalyticsReport | null>) => {
      state.selectedReport = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(analyzeSalesTrends.fulfilled, (state, action) => {
        state.insights.salesTrends = action.payload;
      })
      .addCase(segmentCustomers.fulfilled, (state, action) => {
        state.insights.customerSegments = action.payload;
      })
      .addCase(predictChurn.fulfilled, (state, action) => {
        state.insights.churnPrediction = action.payload;
      });
  },
});

export const { setSelectedReport, clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer; 