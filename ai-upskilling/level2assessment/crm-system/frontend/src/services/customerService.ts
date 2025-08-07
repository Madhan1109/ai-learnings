import api from './api';

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

class CustomerService {
  async getCustomers(params?: any): Promise<{ data: Customer[]; total: number; page: number; limit: number; totalPages: number }> {
    try {
      console.log('Fetching customers with params:', params);
      console.log('API base URL:', api.defaults.baseURL);
      const response = await api.get('/customers', { params });
      console.log('Customers response:', response.data);
      console.log('Response structure:', {
        isArray: Array.isArray(response.data),
        hasData: response.data && typeof response.data === 'object' && 'data' in response.data,
        keys: response.data ? Object.keys(response.data) : 'no data'
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch customers:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw new Error(error.response?.data?.message || 'Failed to fetch customers');
    }
  }

  async getCustomer(id: string): Promise<Customer> {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch customer:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch customer');
    }
  }

  async createCustomer(customer: Partial<Customer>): Promise<Customer> {
    try {
      // Add null safety check
      if (!customer) {
        throw new Error('Customer data is required for creation');
      }
      
      // Transform data to match backend expectations
      const transformedCustomer = {
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        company: customer.company || '',
        status: customer.status || 'lead',
        leadScore: customer.leadScore || 0,
        source: customer.source || 'manual',
        assignedTo: customer.assignedTo || 1, // Default to user ID 1
      };
      
      console.log('Creating customer with data:', transformedCustomer);
      const response = await api.post('/customers', transformedCustomer);
      console.log('Customer created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to create customer:', error);
      throw new Error(error.response?.data?.message || 'Failed to create customer');
    }
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    try {
      // Add null safety check
      if (!customer) {
        throw new Error('Customer data is required for update');
      }
      
      // Transform data to match backend expectations
      const transformedCustomer = {
        name: customer.name || '',
        email: customer.email || '',
        phone: customer.phone || '',
        company: customer.company || '',
        status: customer.status || 'lead',
        leadScore: customer.leadScore || 0,
        source: customer.source || 'manual',
        assignedTo: customer.assignedTo || 1,
      };
      
      console.log('Updating customer with data:', transformedCustomer);
      const response = await api.put(`/customers/${id}`, transformedCustomer);
      console.log('Customer updated successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update customer:', error);
      throw new Error(error.response?.data?.message || 'Failed to update customer');
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      console.log('Deleting customer with ID:', id);
      await api.delete(`/customers/${id}`);
      console.log('Customer deleted successfully');
    } catch (error: any) {
      console.error('Failed to delete customer:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete customer');
    }
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    try {
      const response = await api.get(`/customers/search?q=${query}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to search customers:', error);
      throw new Error(error.response?.data?.message || 'Failed to search customers');
    }
  }
}

export const customerService = new CustomerService(); 