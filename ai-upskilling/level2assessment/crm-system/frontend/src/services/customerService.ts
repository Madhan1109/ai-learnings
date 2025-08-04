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
      const response = await api.get('/customers', { params });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch customers');
    }
  }

  async getCustomer(id: string): Promise<Customer> {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch customer');
    }
  }

  async createCustomer(customer: Partial<Customer>): Promise<Customer> {
    try {
      const response = await api.post('/customers', customer);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create customer');
    }
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    try {
      const response = await api.put(`/customers/${id}`, customer);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update customer');
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      await api.delete(`/customers/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete customer');
    }
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    try {
      const response = await api.get(`/customers/search?q=${query}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search customers');
    }
  }
}

export const customerService = new CustomerService(); 