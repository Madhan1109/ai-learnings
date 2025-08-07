import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { salesService } from '../../services/salesService';

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

export interface SalesState {
  opportunities: Opportunity[];
  tasks: Task[];
  selectedOpportunity: Opportunity | null;
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
  metrics: {
    totalRevenue: number;
    totalOpportunities: number;
    conversionRate: number;
    avgDealSize: number;
    pipelineValue: number;
    winRate: number;
  };
  filters: {
    stage: string;
    assignedTo: number | null;
    minAmount: number;
    minProbability: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  aiInsights: {
    highProbabilityOpportunities: Opportunity[];
    pipelineHealth: any;
    nextBestAction: string;
  };
}

const initialState: SalesState = {
  opportunities: [],
  tasks: [],
  selectedOpportunity: null,
  selectedTask: null,
  loading: false,
  error: null,
  metrics: {
    totalRevenue: 0,
    totalOpportunities: 0,
    conversionRate: 0,
    avgDealSize: 0,
    pipelineValue: 0,
    winRate: 0,
  },
  filters: {
    stage: '',
    assignedTo: null,
    minAmount: 0,
    minProbability: 0,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  aiInsights: {
    highProbabilityOpportunities: [],
    pipelineHealth: {},
    nextBestAction: '',
  },
};

export const fetchOpportunities = createAsyncThunk<{ data: Opportunity[]; total: number; page: number; limit: number; totalPages: number }, { page?: number; limit?: number; filters?: any }>(
  'sales/fetchOpportunities',
  async (params, { rejectWithValue }) => {
    try {
      const response = await salesService.getOpportunities(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch opportunities');
    }
  }
);

export const createOpportunity = createAsyncThunk<Opportunity, Partial<Opportunity>>(
  'sales/createOpportunity',
  async (opportunityData, { rejectWithValue }) => {
    try {
      const response = await salesService.createOpportunity(opportunityData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create opportunity');
    }
  }
);

export const updateOpportunity = createAsyncThunk<Opportunity, { id: number; data: Partial<Opportunity> }>(
  'sales/updateOpportunity',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await salesService.updateOpportunity(id.toString(), data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update opportunity');
    }
  }
);

export const deleteOpportunity = createAsyncThunk<number, number>(
  'sales/deleteOpportunity',
  async (id, { rejectWithValue }) => {
    try {
      await salesService.deleteOpportunity(id.toString());
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete opportunity');
    }
  }
);

export const fetchTasks = createAsyncThunk<Task[], void>(
  'sales/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await salesService.getTasks();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk<Task, Partial<Task>>(
  'sales/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await salesService.createTask(taskData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const updateTask = createAsyncThunk<Task, { id: number; data: Partial<Task> }>(
  'sales/updateTask',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await salesService.updateTask(id.toString(), data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update task');
    }
  }
);

export const deleteTask = createAsyncThunk<number, number>(
  'sales/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await salesService.deleteTask(id.toString());
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete task');
    }
  }
);

export const getPipelineHealth = createAsyncThunk<any, void>(
  'sales/getPipelineHealth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await salesService.getPipelineHealth();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get pipeline health');
    }
  }
);

export const fetchSalesMetrics = createAsyncThunk<any, void>(
  'sales/fetchSalesMetrics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await salesService.getSalesMetrics();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sales metrics');
    }
  }
);

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setSelectedOpportunity: (state, action: PayloadAction<Opportunity | null>) => {
      state.selectedOpportunity = action.payload;
    },
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<SalesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Opportunities
      .addCase(fetchOpportunities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOpportunities.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Sales slice received opportunities payload:', action.payload);
        // Handle both response formats: { data: [...] } and direct array
        const opportunities = Array.isArray(action.payload) ? action.payload : action.payload.data;
        console.log('Processed opportunities:', opportunities);
        state.opportunities = opportunities as Opportunity[];
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
          total: action.payload.total || opportunities.length
        };
      })
      .addCase(fetchOpportunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Opportunity
      .addCase(createOpportunity.fulfilled, (state, action) => {
        state.opportunities.unshift(action.payload as unknown as Opportunity);
      })
      // Update Opportunity
      .addCase(updateOpportunity.fulfilled, (state, action) => {
        const opportunity = action.payload as unknown as Opportunity;
        const index = state.opportunities.findIndex(o => o.id === opportunity.id);
        if (index !== -1) {
          state.opportunities[index] = opportunity;
        }
        if (state.selectedOpportunity?.id === opportunity.id) {
          state.selectedOpportunity = opportunity;
        }
      })
      // Delete Opportunity
      .addCase(deleteOpportunity.fulfilled, (state, action) => {
        state.opportunities = state.opportunities.filter(o => o.id !== action.payload);
        if (state.selectedOpportunity?.id === action.payload) {
          state.selectedOpportunity = null;
        }
      })
      // Fetch Tasks
      .addCase(fetchTasks.fulfilled, (state, action) => {
        console.log('Sales slice received tasks payload:', action.payload);
        // fetchTasks returns Task[] directly, not wrapped in data property
        const tasks = action.payload;
        console.log('Processed tasks:', tasks);
        state.tasks = tasks as Task[];
      })
      // Create Task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload as unknown as Task);
      })
      // Update Task
      .addCase(updateTask.fulfilled, (state, action) => {
        const task = action.payload as unknown as Task;
        const index = state.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          state.tasks[index] = task;
        }
        if (state.selectedTask?.id === task.id) {
          state.selectedTask = task;
        }
      })
      // Delete Task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
        if (state.selectedTask?.id === action.payload) {
          state.selectedTask = null;
        }
      })
      // Get Pipeline Health
      .addCase(getPipelineHealth.fulfilled, (state, action) => {
        state.aiInsights.pipelineHealth = action.payload;
      })
      // Fetch Sales Metrics
      .addCase(fetchSalesMetrics.fulfilled, (state, action) => {
        console.log('Sales slice received metrics payload:', action.payload);
        state.metrics = action.payload;
        console.log('Updated state metrics:', state.metrics);
      });
  },
});

export const {
  setSelectedOpportunity,
  setSelectedTask,
  setFilters,
  clearFilters,
  clearError,
} = salesSlice.actions;

export default salesSlice.reducer; 