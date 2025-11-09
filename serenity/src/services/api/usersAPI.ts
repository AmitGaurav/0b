import { apiClient } from './apiClient';
import { User } from '../../contexts/AuthContext';

// User management API response types
export interface UsersListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface UserResponse {
  user: User;
}

// Query parameters for users list
export interface UsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// User creation data
export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  password: string;
}

// User update data
export interface UpdateUserData extends Partial<CreateUserData> {
  id: string;
}

// Users API endpoints
export const usersAPI = {
  // Get all users with pagination and filtering
  getUsers: async (params: UsersQueryParams = {}): Promise<UsersListResponse> => {
    const queryString = new URLSearchParams(params as any).toString();
    return await apiClient.get(`/users${queryString ? `?${queryString}` : ''}`);
  },

  // Get user by ID
  getUserById: async (id: string): Promise<UserResponse> => {
    return await apiClient.get(`/users/${id}`);
  },

  // Create new user
  createUser: async (userData: CreateUserData): Promise<UserResponse> => {
    return await apiClient.post('/users', userData);
  },

  // Update user
  updateUser: async (userData: UpdateUserData): Promise<UserResponse> => {
    const { id, ...updateData } = userData;
    return await apiClient.put(`/users/${id}`, updateData);
  },

  // Delete user
  deleteUser: async (id: string): Promise<{ message: string }> => {
    return await apiClient.delete(`/users/${id}`);
  },

  // Bulk delete users
  bulkDeleteUsers: async (ids: string[]): Promise<{ message: string; deletedCount: number }> => {
    return await apiClient.post('/users/bulk-delete', { ids });
  },

  // Export users to CSV
  exportUsers: async (params: UsersQueryParams = {}): Promise<Blob> => {
    const queryString = new URLSearchParams(params as any).toString();
    const response = await apiClient.get(`/users/export${queryString ? `?${queryString}` : ''}`, {
      responseType: 'blob',
    });
    return response;
  },

  // Import users from CSV
  importUsers: async (file: File): Promise<{ message: string; importedCount: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return await apiClient.post('/users/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
