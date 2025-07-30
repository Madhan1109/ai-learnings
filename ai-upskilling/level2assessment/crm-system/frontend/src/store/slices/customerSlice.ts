import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { customerService } from '../../services/customerService';

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  industry: string;
  status: string;
  leadScore: number;
  source: string;
  assignedTo: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
  filters: {
    status: string;
    industry: string;
    assignedTo: number | null;
    minLeadScore: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  aiInsights: {
    highValueLeads: Customer[];
    conversionProbability: number;
    nextBestAction: string;
  };
}

const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  loading: false,
  error: null,
  filters: {
    status: '',
    industry: '',
    assignedTo: null,
    minLeadScore: 0,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  aiInsights: {
    highValueLeads: [],
    conversionProbability: 0,
    nextBestAction: '',
  },
};

export const fetchCustomers = createAsyncThunk(
  'customers/fetchCustomers',
  async (params: { page?: number; limit?: number; filters?: any }, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomers(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers');
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customers/createCustomer',
  async (customerData: Partial<Customer>, { rejectWithValue }) => {
    try {
      const response = await customerService.createCustomer(customerData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create customer');
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/updateCustomer',
  async ({ id, data }: { id: number; data: Partial<Customer> }, { rejectWithValue }) => {
    try {
      const response = await customerService.updateCustomer(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update customer');
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/deleteCustomer',
  async (id: number, { rejectWithValue }) => {
    try {
      await customerService.deleteCustomer(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete customer');
    }
  }
);

export const getHighValueLeads = createAsyncThunk(
  'customers/getHighValueLeads',
  async (minScore: number, { rejectWithValue }) => {
    try {
      const response = await customerService.getHighValueLeads(minScore);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get high value leads');
    }
  }
);

export const getNextBestAction = createAsyncThunk(
  'customers/getNextBestAction',
  async (customerId: number, { rejectWithValue }) => {
    try {
      const response = await customerService.getNextBestAction(customerId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get next best action');
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setSelectedCustomer: (state, action: PayloadAction<Customer | null>) => {
      state.selectedCustomer = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<CustomerState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPagination: (state, action: PayloadAction<Partial<CustomerState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Customers
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Customer
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers.unshift(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Customer
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.customers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.selectedCustomer?.id === action.payload.id) {
          state.selectedCustomer = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete Customer
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter(c => c.id !== action.payload);
        if (state.selectedCustomer?.id === action.payload) {
          state.selectedCustomer = null;
        }
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get High Value Leads
      .addCase(getHighValueLeads.fulfilled, (state, action) => {
        state.aiInsights.highValueLeads = action.payload;
      })
      // Get Next Best Action
      .addCase(getNextBestAction.fulfilled, (state, action) => {
        state.aiInsights.nextBestAction = action.payload;
      });
  },
});

export const {
  setSelectedCustomer,
  setFilters,
  clearFilters,
  setPagination,
  clearError,
} = customerSlice.actions;

export default customerSlice.reducer; 