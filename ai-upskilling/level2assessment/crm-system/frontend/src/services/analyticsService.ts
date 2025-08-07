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

// Mock data generation for analytics
const generateMockAnalyticsData = (timeRange: string): AnalyticsData => {
  const now = new Date();
  const labels = [];
  const revenueData = [];
  const customerData = [];
  const salesData = [];

  // Generate data points based on time range
  let days = 30;
  if (timeRange === '7d') days = 7;
  else if (timeRange === '90d') days = 90;
  else if (timeRange === '1y') days = 365;

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    labels.push(label);
    revenueData.push({
      date: label,
      revenue: Math.floor(Math.random() * 50000) + 10000,
      target: 40000
    });
    customerData.push({
      date: label,
      customers: Math.floor(Math.random() * 20) + 5,
      leads: Math.floor(Math.random() * 30) + 10
    });
    salesData.push({
      date: label,
      opportunities: Math.floor(Math.random() * 15) + 5,
      closed: Math.floor(Math.random() * 8) + 2
    });
  }

  return {
    revenue: {
      current: 125000,
      previous: 98000,
      growth: 27.6
    },
    customers: {
      current: 245,
      previous: 198,
      growth: 23.7
    },
    conversionRate: {
      current: 68.5,
      previous: 62.3,
      growth: 9.9
    },
    avgDealSize: {
      current: 45000,
      previous: 38000,
      growth: 18.4
    },
    revenueData: revenueData,
    customerData: customerData,
    salesData: salesData,
    insights: [
      {
        id: 1,
        type: 'success',
        title: 'Revenue Growth',
        message: 'Revenue increased by 27.6% compared to last month',
        value: '+27.6%',
        icon: 'trending_up'
      },
      {
        id: 2,
        type: 'info',
        title: 'Customer Acquisition',
        message: 'New customer acquisition rate is above target',
        value: '+23.7%',
        icon: 'people'
      },
      {
        id: 3,
        type: 'warning',
        title: 'Conversion Rate',
        message: 'Lead conversion rate needs improvement',
        value: '+9.9%',
        icon: 'analytics'
      }
    ]
  };
};

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
      // For now, return mock data to ensure charts work
      return generateMockAnalyticsData(timeRange);
    } catch (error: any) {
      // Fallback to mock data if API fails
      return generateMockAnalyticsData(timeRange);
    }
  }

  async getPredictions(): Promise<any> {
    try {
      // Mock predictions data
      return [
        {
          id: '1',
          metric: 'Revenue',
          currentValue: 125000,
          predictedValue: 145000,
          confidence: 85,
          timeframe: 'Next Month',
          trend: 'up',
          factors: ['Seasonal growth', 'New product launch', 'Market expansion']
        },
        {
          id: '2',
          metric: 'Customer Acquisition',
          currentValue: 245,
          predictedValue: 280,
          confidence: 78,
          timeframe: 'Next Quarter',
          trend: 'up',
          factors: ['Improved marketing', 'Referral program', 'Better onboarding']
        },
        {
          id: '3',
          metric: 'Conversion Rate',
          currentValue: 68.5,
          predictedValue: 72.0,
          confidence: 82,
          timeframe: 'Next Month',
          trend: 'up',
          factors: ['Sales training', 'Lead quality improvement', 'Process optimization']
        }
      ];
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch predictions');
    }
  }

  async getReports(): Promise<any[]> {
    try {
      return [
        {
          id: 1,
          title: 'Monthly Sales Report',
          type: 'sales',
          createdAt: new Date().toISOString(),
          status: 'completed'
        },
        {
          id: 2,
          title: 'Customer Analysis',
          type: 'customers',
          createdAt: new Date().toISOString(),
          status: 'completed'
        }
      ];
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

export default new AnalyticsService(); 