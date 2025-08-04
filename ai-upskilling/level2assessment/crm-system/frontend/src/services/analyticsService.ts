import api from './api';

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
  revenueData: any[];
  customerData: any[];
  salesData: any[];
  insights: any[];
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

class AnalyticsService {
  async getAnalytics(timeRange: string): Promise<AnalyticsData> {
    try {
      const response = await api.get(`/analytics?timeRange=${timeRange}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }

  async getPredictions(): Promise<any> {
    try {
      const response = await api.get('/analytics/ai/summary');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch predictions');
    }
  }

  async getReports(): Promise<AnalyticsReport[]> {
    try {
      const response = await api.get('/analytics/reports');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reports');
    }
  }

  async createReport(report: Partial<AnalyticsReport>): Promise<AnalyticsReport> {
    try {
      const response = await api.post('/analytics/reports', report);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create report');
    }
  }

  async updateReport(id: string, report: Partial<AnalyticsReport>): Promise<AnalyticsReport> {
    try {
      const response = await api.put(`/analytics/reports/${id}`, report);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update report');
    }
  }

  async deleteReport(id: string): Promise<void> {
    try {
      await api.delete(`/analytics/reports/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete report');
    }
  }

  async getDashboardOverview(): Promise<any> {
    try {
      const response = await api.get('/analytics/dashboard/overview');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard overview');
    }
  }

  async getDashboardTrends(): Promise<any> {
    try {
      const response = await api.get('/analytics/dashboard/trends');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard trends');
    }
  }

  async getSalesInsights(): Promise<any> {
    try {
      const response = await api.get('/analytics/ai/insights/sales');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch sales insights');
    }
  }

  async getCustomerInsights(): Promise<any> {
    try {
      const response = await api.get('/analytics/ai/insights/customers');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch customer insights');
    }
  }

  async getMarketInsights(): Promise<any> {
    try {
      const response = await api.get('/analytics/ai/insights/market');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch market insights');
    }
  }
}

export const analyticsService = new AnalyticsService(); 