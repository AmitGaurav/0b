import { LoginResponse, UserProfile } from '../../types/api.types';

export const mockAuthData = {
  login: {
    token: 'mock-jwt-token',
    user: {
      id: '1',
      name: 'Demo User',
      email: 'demo@example.com',
      role: 'admin'
    }
  } as LoginResponse,
  profile: {
    id: '1',
    name: 'Demo User',
    email: 'demo@example.com',
    phone: '+1234567890',
    role: 'admin',
    societyId: '1',
    createdAt: '2025-01-01'
  }
};