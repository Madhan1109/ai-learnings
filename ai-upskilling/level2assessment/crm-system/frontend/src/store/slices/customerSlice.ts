import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { customerService } from '../../services/customerService';

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

export const fetchCustomers = createAsyncThunk<{ data: Customer[]; total: number; page: number; limit: number; totalPages: number }, { page?: number; limit?: number; filters?: any }>(
  'customers/fetchCustomers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomers(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customers');
    }
  }
);

export const createCustomer = createAsyncThunk<Customer, Partial<Customer>>(
  'customers/createCustomer',
  async (customerData, { rejectWithValue }) => {
    try {
      // Add null safety check
      if (!customerData) {
        return rejectWithValue('Customer data is required for creation');
      }
      const response = await customerService.createCustomer(customerData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create customer');
    }
  }
);

export const updateCustomer = createAsyncThunk<Customer, { id: number; data: Partial<Customer> }>(
  'customers/updateCustomer',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Add null safety check
      if (!data) {
        return rejectWithValue('Customer data is required for update');
      }
      const response = await customerService.updateCustomer(id.toString(), data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update customer');
    }
  }
);

export const deleteCustomer = createAsyncThunk<number, number>(
  'customers/deleteCustomer',
  async (id, { rejectWithValue }) => {
    try {
      await customerService.deleteCustomer(id.toString());
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete customer');
    }
  }
);

// These methods are not available in customerService, so we'll use available methods instead
export const getHighValueLeads = createAsyncThunk<Customer[], number>(
  'customers/getHighValueLeads',
  async (minScore, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomers({ minLeadScore: minScore });
      return response.data.filter((customer: any) => customer.leadScore >= minScore);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get high value leads');
    }
  }
);

export const getNextBestAction = createAsyncThunk<{ customer: Customer; nextAction: string }, number>(
  'customers/getNextBestAction',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await customerService.getCustomer(customerId.toString());
      return { customer: response, nextAction: 'Follow up call' };
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
        console.log('Customer slice received payload:', action.payload);
        // Handle both response formats: { data: [...] } and direct array
        const customers = Array.isArray(action.payload) ? action.payload : action.payload.data;
        console.log('Processed customers:', customers);
        state.customers = customers as Customer[];
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 10,
          total: action.payload.total || customers.length
        };
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
        state.customers.unshift(action.payload as Customer);
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
        const customer = action.payload as Customer;
        const index = state.customers.findIndex(c => c.id === customer.id);
        if (index !== -1) {
          state.customers[index] = customer;
        }
        if (state.selectedCustomer?.id === customer.id) {
          state.selectedCustomer = customer;
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
        state.aiInsights.highValueLeads = action.payload as unknown as Customer[];
      })
      // Get Next Best Action
      .addCase(getNextBestAction.fulfilled, (state, action) => {
        state.aiInsights.nextBestAction = (action.payload as any).nextAction;
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