import api from './api';

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

class SalesService {
  async getOpportunities(params?: any): Promise<{ data: Opportunity[]; total: number; page: number; limit: number; totalPages: number }> {
    try {
      const response = await api.get('/sales/opportunities', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch opportunities');
    }
  }

  async getOpportunity(id: string): Promise<Opportunity> {
    try {
      const response = await api.get(`/sales/opportunities/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch opportunity');
    }
  }

  async createOpportunity(opportunity: Partial<Opportunity>): Promise<Opportunity> {
    try {
      const response = await api.post('/sales/opportunities', opportunity);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create opportunity');
    }
  }

  async updateOpportunity(id: string, opportunity: Partial<Opportunity>): Promise<Opportunity> {
    try {
      const response = await api.put(`/sales/opportunities/${id}`, opportunity);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update opportunity');
    }
  }

  async deleteOpportunity(id: string): Promise<void> {
    try {
      await api.delete(`/sales/opportunities/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete opportunity');
    }
  }

  async getSalesMetrics(): Promise<any> {
    try {
      const response = await api.get('/sales/analytics/pipeline');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch sales metrics');
    }
  }

  async getPipeline(): Promise<any> {
    try {
      const response = await api.get('/sales/analytics/pipeline-summary');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch pipeline');
    }
  }

  async getTasks(): Promise<Task[]> {
    try {
      const response = await api.get('/sales/tasks');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }

  async createTask(task: Partial<Task>): Promise<Task> {
    try {
      const response = await api.post('/sales/tasks', task);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create task');
    }
  }

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    try {
      const response = await api.put(`/sales/tasks/${id}`, task);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update task');
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await api.delete(`/sales/tasks/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
  }

  async getOverdueTasks(): Promise<Task[]> {
    try {
      const response = await api.get('/sales/tasks/overdue');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch overdue tasks');
    }
  }

  async getTasksDueToday(): Promise<Task[]> {
    try {
      const response = await api.get('/sales/tasks/due-today');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks due today');
    }
  }

  async getHighValueOpportunities(minScore?: number): Promise<Opportunity[]> {
    try {
      const response = await api.get(`/sales/opportunities/ai/high-value?minScore=${minScore || 70}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch high value opportunities');
    }
  }

  async getHighWinProbabilityOpportunities(minProbability?: number): Promise<Opportunity[]> {
    try {
      const response = await api.get(`/sales/opportunities/ai/high-win-probability?minProbability=${minProbability || 0.6}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch high win probability opportunities');
    }
  }

  async getNextBestAction(opportunityId: string): Promise<string> {
    try {
      const response = await api.get(`/sales/opportunities/ai/next-best-action/${opportunityId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get next best action');
    }
  }

  async getPipelineHealth(): Promise<any> {
    try {
      const response = await api.get('/sales/analytics/pipeline');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get pipeline health');
    }
  }
}

export const salesService = new SalesService(); 