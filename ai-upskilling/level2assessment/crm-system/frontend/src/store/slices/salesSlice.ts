import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { salesService } from '../../services/salesService';

export interface Opportunity {
  id: number;
  customerId: number;
  title: string;
  description: string;
  amount: number;
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

export const fetchOpportunities = createAsyncThunk(
  'sales/fetchOpportunities',
  async (params: { page?: number; limit?: number; filters?: any }, { rejectWithValue }) => {
    try {
      const response = await salesService.getOpportunities(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch opportunities');
    }
  }
);

export const createOpportunity = createAsyncThunk(
  'sales/createOpportunity',
  async (opportunityData: Partial<Opportunity>, { rejectWithValue }) => {
    try {
      const response = await salesService.createOpportunity(opportunityData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create opportunity');
    }
  }
);

export const updateOpportunity = createAsyncThunk(
  'sales/updateOpportunity',
  async ({ id, data }: { id: number; data: Partial<Opportunity> }, { rejectWithValue }) => {
    try {
      const response = await salesService.updateOpportunity(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update opportunity');
    }
  }
);

export const fetchTasks = createAsyncThunk(
  'sales/fetchTasks',
  async (params: { page?: number; limit?: number; filters?: any }, { rejectWithValue }) => {
    try {
      const response = await salesService.getTasks(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch tasks');
    }
  }
);

export const createTask = createAsyncThunk(
  'sales/createTask',
  async (taskData: Partial<Task>, { rejectWithValue }) => {
    try {
      const response = await salesService.createTask(taskData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create task');
    }
  }
);

export const getPipelineHealth = createAsyncThunk(
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
        state.opportunities = action.payload.opportunities;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOpportunities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Opportunity
      .addCase(createOpportunity.fulfilled, (state, action) => {
        state.opportunities.unshift(action.payload);
      })
      // Update Opportunity
      .addCase(updateOpportunity.fulfilled, (state, action) => {
        const index = state.opportunities.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.opportunities[index] = action.payload;
        }
        if (state.selectedOpportunity?.id === action.payload.id) {
          state.selectedOpportunity = action.payload;
        }
      })
      // Fetch Tasks
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload.tasks;
      })
      // Create Task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.unshift(action.payload);
      })
      // Get Pipeline Health
      .addCase(getPipelineHealth.fulfilled, (state, action) => {
        state.aiInsights.pipelineHealth = action.payload;
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