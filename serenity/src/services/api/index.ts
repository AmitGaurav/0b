import axios from 'axios';
import MockService from '../mockService';
import { mockAuthData } from '../mockData/auth';
import { mockSocietyData } from '../mockData/society';

// Environment configuration
const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === 'true';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.example.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// API service with mock data support
export const apiService = {
  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    if (USE_MOCK_API) {
      return MockService.mockResponse(mockAuthData.login);
    }
    return api.post('/auth/login', credentials);
  },

  async getProfile() {
    if (USE_MOCK_API) {
      return MockService.mockResponse(mockAuthData.profile);
    }
    return api.get('/auth/profile');
  },

  // Society endpoints
  async getSocieties() {
    if (USE_MOCK_API) {
      return MockService.mockResponse(mockSocietyData.societies);
    }
    return api.get('/societies');
  },

  async getSocietyUnits(societyId: string) {
    if (USE_MOCK_API) {
      return MockService.mockResponse(mockSocietyData.units);
    }
    return api.get(`/societies/${societyId}/units`);
  }
};

export default apiService;