import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// Base API configuration
const BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: false,
    });
    
    console.log('ApiClient initialized with baseURL:', baseURL);

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        console.log('=== Making API Request ===');
        console.log('Full URL:', `${config.baseURL || ''}${config.url || ''}`);
        console.log('Method:', config.method?.toUpperCase());
        console.log('Headers:', config.headers);
        console.log('Data:', config.data);
        console.log('Base URL from config:', config.baseURL);
        console.log('Current BASE_URL constant:', BASE_URL);
        
        const token = Cookies.get('access_token');
        if (token) {
          console.log('Adding auth token:', token.substring(0, 50) + '...');
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.log('No auth token found');
        }
        return config;
      },
      (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('API response received:', response.status, response.data);
        return response;
      },
      (error) => {
        console.error('=== API Error Details ===');
        console.error('Error:', error);
        console.error('Error response status:', error.response?.status);
        console.error('Error response data:', error.response?.data);
        console.error('Error response headers:', error.response?.headers);
        console.error('Request URL:', error.config?.url);
        console.error('Request method:', error.config?.method);
        console.error('Request data:', error.config?.data);
        console.error('Request headers:', error.config?.headers);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);

        // Handle 401 unauthorized
        if (error.response?.status === 401) {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.href = '/auth/login';
        }

        // Handle network errors
        if (!error.response) {
          console.error('Network error detected:', error);
          error.message = 'Network error. Please check your connection.';
        }

        // Extract error message from response
        const message = error.response?.data?.message || error.message;
        error.message = message;

        return Promise.reject(error);
      }
    );
  }

  // HTTP methods
  async get<T = any>(url: string, config = {}): Promise<T> {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data = {}, config = {}): Promise<T> {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data = {}, config = {}): Promise<T> {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data = {}, config = {}): Promise<T> {
    const response = await this.client.patch(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config = {}): Promise<T> {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(BASE_URL);

// Export Axios for direct usage if needed
export { axios };
