import api from './api';

export interface Opportunity {
  id: number;
  customerId: number;
  title?: string; // Optional for backward compatibility
  name?: string; // Optional for backward compatibility
  description: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate: string;
  assignedTo: number;
  aiScore: number;
  winProbability: number;
  dealVelocity: number;
  nextAction: string;
  notes?: string; // Add notes property
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  opportunityId: number;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  priority: string;
  assignedTo: number;
  createdAt: string;
  updatedAt: string;
}

class SalesService {
  async getOpportunities(params?: any): Promise<{ data: Opportunity[]; total: number; page: number; limit: number; totalPages: number }> {
    try {
      // For now, return mock data to ensure the UI shows realistic opportunities
      // In production, this would call the actual API endpoint
      const mockOpportunities: Opportunity[] = [
        {
          id: 1,
          customerId: 1,
          title: 'Enterprise Software License',
          description: 'Multi-year software license for enterprise client',
          value: 250000,
          stage: 'prospecting',
          probability: 25,
          expectedCloseDate: '2024-03-15',
          assignedTo: 1,
          aiScore: 85,
          winProbability: 75,
          dealVelocity: 8.5,
          nextAction: 'Schedule discovery call',
          notes: 'High-value enterprise opportunity',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          customerId: 2,
          title: 'Cloud Migration Project',
          description: 'Complete cloud infrastructure migration',
          value: 180000,
          stage: 'qualification',
          probability: 40,
          expectedCloseDate: '2024-02-28',
          assignedTo: 2,
          aiScore: 92,
          winProbability: 80,
          dealVelocity: 7.2,
          nextAction: 'Send proposal',
          notes: 'Technical evaluation in progress',
          createdAt: '2024-01-10T14:30:00Z',
          updatedAt: '2024-01-12T09:15:00Z'
        },
        {
          id: 3,
          customerId: 3,
          title: 'Data Analytics Platform',
          description: 'Custom analytics platform development',
          value: 320000,
          stage: 'proposal',
          probability: 60,
          expectedCloseDate: '2024-03-10',
          assignedTo: 1,
          aiScore: 88,
          winProbability: 85,
          dealVelocity: 6.8,
          nextAction: 'Follow up on proposal',
          notes: 'Stakeholder approval pending',
          createdAt: '2024-01-05T11:20:00Z',
          updatedAt: '2024-01-14T16:45:00Z'
        },
        {
          id: 4,
          customerId: 4,
          title: 'Security Audit Services',
          description: 'Comprehensive security assessment',
          value: 95000,
          stage: 'negotiation',
          probability: 80,
          expectedCloseDate: '2024-02-15',
          assignedTo: 3,
          aiScore: 95,
          winProbability: 90,
          dealVelocity: 9.1,
          nextAction: 'Finalize contract terms',
          notes: 'Legal review in progress',
          createdAt: '2024-01-08T13:45:00Z',
          updatedAt: '2024-01-13T10:30:00Z'
        },
        {
          id: 5,
          customerId: 5,
          title: 'Mobile App Development',
          description: 'Cross-platform mobile application',
          value: 150000,
          stage: 'closed-won',
          probability: 100,
          expectedCloseDate: '2024-01-30',
          assignedTo: 2,
          aiScore: 98,
          winProbability: 100,
          dealVelocity: 10.0,
          nextAction: 'Project kickoff',
          notes: 'Contract signed, project starting',
          createdAt: '2024-01-01T09:00:00Z',
          updatedAt: '2024-01-20T14:20:00Z'
        },
        {
          id: 6,
          customerId: 6,
          title: 'Legacy System Upgrade',
          description: 'Database and infrastructure upgrade',
          value: 210000,
          stage: 'closed-lost',
          probability: 0,
          expectedCloseDate: '2024-02-20',
          assignedTo: 1,
          aiScore: 45,
          winProbability: 0,
          dealVelocity: 2.1,
          nextAction: 'Post-mortem analysis',
          notes: 'Lost to competitor',
          createdAt: '2024-01-03T15:30:00Z',
          updatedAt: '2024-01-18T11:15:00Z'
        }
      ];
      
      console.log('Returning mock opportunities:', mockOpportunities);
      
      // Apply pagination if params are provided
      const page = params?.page || 1;
      const limit = params?.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedOpportunities = mockOpportunities.slice(startIndex, endIndex);
      
      return {
        data: paginatedOpportunities,
        total: mockOpportunities.length,
        page: page,
        limit: limit,
        totalPages: Math.ceil(mockOpportunities.length / limit)
      };
      
      // Uncomment below when backend is ready
      // console.log('Fetching opportunities with params:', params);
      // console.log('API base URL:', api.defaults.baseURL);
      // const response = await api.get('/sales/opportunities', { params });
      // console.log('Opportunities response:', response.data);
      // console.log('Response structure:', {
      //   isArray: Array.isArray(response.data),
      //   hasData: response.data && typeof response.data === 'object' && 'data' in response.data,
      //   keys: response.data ? Object.keys(response.data) : 'no data'
      // });
      // return response.data;
    } catch (error: any) {
      console.error('Failed to fetch opportunities:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(error.response?.data?.message || 'Failed to fetch opportunities');
    }
  }

  async getOpportunity(id: string): Promise<Opportunity> {
    try {
      const response = await api.get(`/sales/opportunities/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch opportunity:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch opportunity');
    }
  }

  async createOpportunity(opportunity: Partial<Opportunity>): Promise<Opportunity> {
    try {
      // Transform data to match backend expectations
      const transformedOpportunity = {
        title: opportunity.name || opportunity.title || '',
        description: opportunity.description || '',
        customerId: opportunity.customerId || 1, // Default customer ID
        value: opportunity.value || 0,
        stage: opportunity.stage || 'prospecting',
        probability: opportunity.probability || 25,
        expectedCloseDate: opportunity.expectedCloseDate || new Date().toISOString().split('T')[0],
        assignedTo: opportunity.assignedTo || 1, // Default to user ID 1
        notes: opportunity.notes || '',
      };
      
      console.log('Creating opportunity with data:', transformedOpportunity);
      const response = await api.post('/sales/opportunities', transformedOpportunity);
      console.log('Opportunity created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create opportunity:', error);
      throw new Error(error.response?.data?.message || 'Failed to create opportunity');
    }
  }

  async updateOpportunity(id: string, opportunity: Partial<Opportunity>): Promise<Opportunity> {
    try {
      // Transform data to match backend expectations
      const transformedOpportunity = {
        title: opportunity.name || opportunity.title || '',
        description: opportunity.description || '',
        customerId: opportunity.customerId || 1,
        value: opportunity.value || 0,
        stage: opportunity.stage || 'prospecting',
        probability: opportunity.probability || 25,
        expectedCloseDate: opportunity.expectedCloseDate || new Date().toISOString().split('T')[0],
        assignedTo: opportunity.assignedTo || 1,
        notes: opportunity.notes || '',
      };
      
      console.log('Updating opportunity with data:', transformedOpportunity);
      const response = await api.put(`/sales/opportunities/${id}`, transformedOpportunity);
      console.log('Opportunity updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update opportunity:', error);
      throw new Error(error.response?.data?.message || 'Failed to update opportunity');
    }
  }

  async deleteOpportunity(id: string): Promise<void> {
    try {
      console.log('Deleting opportunity with ID:', id);
      await api.delete(`/sales/opportunities/${id}`);
      console.log('Opportunity deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete opportunity:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete opportunity');
    }
  }

  async getSalesMetrics(): Promise<any> {
    try {
      // Calculate pipeline value from actual opportunities data
      const mockOpportunities = [
        { value: 250000, stage: 'prospecting', probability: 25 },
        { value: 180000, stage: 'qualification', probability: 40 },
        { value: 320000, stage: 'proposal', probability: 60 },
        { value: 95000, stage: 'negotiation', probability: 80 },
        { value: 150000, stage: 'closed-won', probability: 100 },
        { value: 210000, stage: 'closed-lost', probability: 0 }
      ];
      
      const totalPipelineValue = mockOpportunities.reduce((sum, opp) => sum + opp.value, 0);
      const activeOpportunities = mockOpportunities.filter(opp => opp.stage !== 'closed-won' && opp.stage !== 'closed-lost');
      const activePipelineValue = activeOpportunities.reduce((sum, opp) => sum + opp.value, 0);
      
      const mockMetrics = {
        totalRevenue: 1250000,
        totalOpportunities: mockOpportunities.length,
        conversionRate: 68.5,
        avgDealSize: Math.round(totalPipelineValue / mockOpportunities.length),
        pipelineValue: activePipelineValue, // Only active opportunities (excluding closed-won and closed-lost)
        winRate: 72.3
      };
      
      console.log('Returning mock sales metrics:', mockMetrics);
      return mockMetrics;
      
      // Uncomment below when backend is ready
      // const response = await api.get('/sales/analytics/pipeline');
      // return response.data;
    } catch (error: any) {
      console.error('Failed to fetch sales metrics:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch sales metrics');
    }
  }

  async getPipeline(): Promise<any> {
    try {
      const response = await api.get('/sales/analytics/pipeline-summary');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch pipeline:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch pipeline');
    }
  }

  async getTasks(): Promise<Task[]> {
    try {
      // For now, return mock data to ensure the UI shows realistic tasks
      // In production, this would call the actual API endpoint
      const mockTasks: Task[] = [
        {
          id: 1,
          opportunityId: 1,
          title: 'Schedule Discovery Call',
          description: 'Arrange initial meeting with enterprise client',
          dueDate: '2024-01-25',
          status: 'pending',
          priority: 'high',
          assignedTo: 1,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          opportunityId: 2,
          title: 'Prepare Technical Proposal',
          description: 'Create detailed technical proposal for cloud migration',
          dueDate: '2024-01-28',
          status: 'in-progress',
          priority: 'high',
          assignedTo: 2,
          createdAt: '2024-01-16T14:30:00Z',
          updatedAt: '2024-01-17T09:15:00Z'
        },
        {
          id: 3,
          opportunityId: 3,
          title: 'Follow up on Proposal',
          description: 'Contact stakeholders for proposal feedback',
          dueDate: '2024-01-22',
          status: 'completed',
          priority: 'medium',
          assignedTo: 1,
          createdAt: '2024-01-18T11:20:00Z',
          updatedAt: '2024-01-20T16:45:00Z'
        },
        {
          id: 4,
          opportunityId: 4,
          title: 'Review Contract Terms',
          description: 'Legal review of security audit contract',
          dueDate: '2024-01-30',
          status: 'pending',
          priority: 'medium',
          assignedTo: 3,
          createdAt: '2024-01-19T13:45:00Z',
          updatedAt: '2024-01-19T13:45:00Z'
        },
        {
          id: 5,
          opportunityId: 5,
          title: 'Project Kickoff Meeting',
          description: 'Initial project planning session',
          dueDate: '2024-02-01',
          status: 'pending',
          priority: 'high',
          assignedTo: 2,
          createdAt: '2024-01-20T09:00:00Z',
          updatedAt: '2024-01-20T09:00:00Z'
        },
        {
          id: 6,
          opportunityId: 6,
          title: 'Post-mortem Analysis',
          description: 'Analyze reasons for lost opportunity',
          dueDate: '2024-01-25',
          status: 'cancelled',
          priority: 'low',
          assignedTo: 1,
          createdAt: '2024-01-21T15:30:00Z',
          updatedAt: '2024-01-22T11:15:00Z'
        }
      ];
      
      console.log('Returning mock tasks:', mockTasks);
      return mockTasks;
      
      // Uncomment below when backend is ready
      // const response = await api.get('/sales/tasks');
      // console.log('Tasks response:', response.data);
      // console.log('Tasks response structure:', {
      //   isArray: Array.isArray(response.data),
      //   hasData: response.data && typeof response.data === 'object' && 'data' in response.data,
      //   keys: response.data ? Object.keys(response.data) : 'no data'
      // });
      // return response.data;
    } catch (error: any) {
      console.error('Failed to fetch tasks:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }

  async createTask(task: Partial<Task>): Promise<Task> {
    try {
      // Transform data to match backend expectations
      const transformedTask = {
        title: task.title,
        description: task.description || '',
        assignedTo: task.assignedTo || 1,
        dueDate: task.dueDate || new Date().toISOString().split('T')[0],
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        opportunityId: task.opportunityId || null,
      };
      
      console.log('Creating task with data:', transformedTask);
      const response = await api.post('/sales/tasks', transformedTask);
      console.log('Task created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create task:', error);
      throw new Error(error.response?.data?.message || 'Failed to create task');
    }
  }

  async updateTask(id: string, task: Partial<Task>): Promise<Task> {
    try {
      // Transform data to match backend expectations
      const transformedTask = {
        title: task.title,
        description: task.description || '',
        assignedTo: task.assignedTo || 1,
        dueDate: task.dueDate || new Date().toISOString().split('T')[0],
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        opportunityId: task.opportunityId || null,
      };
      
      console.log('Updating task with data:', transformedTask);
      const response = await api.put(`/sales/tasks/${id}`, transformedTask);
      console.log('Task updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update task:', error);
      throw new Error(error.response?.data?.message || 'Failed to update task');
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      console.log('Deleting task with ID:', id);
      await api.delete(`/sales/tasks/${id}`);
      console.log('Task deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete task:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete task');
    }
  }

  async getOverdueTasks(): Promise<Task[]> {
    try {
      const response = await api.get('/sales/tasks/overdue');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch overdue tasks:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch overdue tasks');
    }
  }

  async getTasksDueToday(): Promise<Task[]> {
    try {
      const response = await api.get('/sales/tasks/due-today');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch tasks due today:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch tasks due today');
    }
  }

  async getHighValueOpportunities(minScore?: number): Promise<Opportunity[]> {
    try {
      const response = await api.get(`/sales/opportunities/ai/high-value?minScore=${minScore || 70}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch high value opportunities:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch high value opportunities');
    }
  }

  async getHighWinProbabilityOpportunities(minProbability?: number): Promise<Opportunity[]> {
    try {
      const response = await api.get(`/sales/opportunities/ai/high-win-probability?minProbability=${minProbability || 0.6}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch high win probability opportunities:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch high win probability opportunities');
    }
  }

  async getNextBestAction(opportunityId: string): Promise<string> {
    try {
      const response = await api.get(`/sales/opportunities/ai/next-best-action/${opportunityId}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get next best action:', error);
      throw new Error(error.response?.data?.message || 'Failed to get next best action');
    }
  }

  async getPipelineHealth(): Promise<any> {
    try {
      const response = await api.get('/sales/analytics/pipeline');
      return response.data;
    } catch (error: any) {
      console.error('Failed to get pipeline health:', error);
      throw new Error(error.response?.data?.message || 'Failed to get pipeline health');
    }
  }
}

export const salesService = new SalesService(); 