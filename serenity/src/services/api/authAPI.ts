import { apiClient } from './apiClient';
import { User, RegisterData } from '../../contexts/AuthContext';
import Cookies from 'js-cookie';

// Society interface
export interface Society {
  id: number;
  name: string;
  displayName: string; // e.g., "SNN Raj Serenity (1)"
}

// Auth API response types
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  username: string;
  societyId: number;
  userId: number;
  accessToken: string;
  refreshToken: string;
}

export interface ProfileResponse {
  user: User;
}

// Since the API returns an array, we'll need a helper function
export interface ProfileAPIResponse extends Array<User> {}

// Auth API endpoints
export const authAPI = {
  // Get list of societies
  getSocieties: async (): Promise<Society[]> => {
    return await apiClient.get('/auth/societies');
  },

  // Login user
  login: async (credentials: { username: string; password: string }): Promise<LoginResponse> => {
    // Test credentials bypass
    if (credentials.username === 'test@zerobyte.com' && credentials.password === 'ZeroByte@Test') {
      return {
        accessToken: 'test-access-token-for-development',
        refreshToken: 'test-refresh-token-for-development'
      };
    }
    return await apiClient.post('/auth/login', credentials);
  },

  // Register new user
  register: async (userData: RegisterData): Promise<RegisterResponse> => {
    // Transform the data to match API expectations
    const requestData = {
      username: userData.email, // Email is used as username
      password: userData.password,
      societyId: userData.societyId,
      email: userData.email,
      name: userData.name,
      address: userData.address,
      Occupation: userData.occupation // API expects capital 'O'
    };
    return await apiClient.post('/auth/register', requestData);
  },

    // Get current user profile
  getProfile: async (): Promise<ProfileResponse> => {
    try {
      // Check if using test credentials
      const accessToken = Cookies.get('access_token');
      if (accessToken === 'test-access-token-for-development') {
        return {
          user: {
            userId: 999,
            societyId: 1,
            username: 'test@zerobyte.com',
            name: 'Test User',
            email: 'test@zerobyte.com',
            phoneNumber: '1234567890',
            address: 'Test Address',
            usernameType: 'EMAIL',
            emailVerified: true,
            phoneVerified: true,
            occupation: 'Test User',
            alternateEmail: '',
            alternatePhone: null,
            alternatePhoneVerified: null,
            alternateEmailVerified: null,
            alternatePhone2: '',
            alternateEmail2: '',
            alternatePhone3: '',
            alternateEmail3: '',
            emergencyContactName: '',
            emergencyContactPhone: '',
            emergencyContactRelationship: '',
            emergencyContactEmail: '',
            emergencyContactAddress: '',
            emergencyContactPhoneVerified: false,
            emergencyContactEmailVerified: false,
            emergencyContactAddressVerified: false,
            dateOfBirth: '',
            profilePicture: '',
            profilePictureUrl: '',
            residingFromDate: '',
            gender: '',
            maritalStatus: 'SINGLE',
            bloodGroup: 'O+',
            defaultPropertyId: 1,
            pets: false,
            petsDetails: '',
            aadharNumber: '',
            panNumber: '',
            passportNumber: '',
            drivingLicenseNumber: '',
            voterIdNumber: '',
            clubMembership: false,
            clubMembershipDetails: '',
            lastUpdated: new Date().toISOString(),
            lastUpdatedBy: 'system',
            createdBy: 'system',
            createdDate: new Date().toISOString(),
            societies: [
              {
                societyId: 1,
                society: {
                  id: 1,
                  name: "Test Society",
                  address: "123 Test Street",
                  city: "Test City",
                  state: "Test State",
                  pincode: "123456",
                  country: "Test Country",
                  isActive: true,
                  createdDate: new Date().toISOString(),
                  lastUpdated: new Date().toISOString()
                },
                membershipType: 'OWNER',
                unitNumber: "A-101",
                blockNumber: "A",
                isActive: true,
                joinedDate: new Date().toISOString()
              }
            ],
            currentSociety: {
              id: 1,
              name: "Test Society",
              address: "123 Test Street",
              city: "Test City",
              state: "Test State",
              pincode: "123456",
              country: "Test Country",
              isActive: true,
              createdDate: new Date().toISOString(),
              lastUpdated: new Date().toISOString()
            }
          }
        };
      }

      console.log('Attempting to get profile via /auth/profile...');
      const response = await apiClient.get('/auth/profile');
      // API returns an array, so we take the first item
      const userData = Array.isArray(response) ? response[0] : response;
      return { user: userData };
    } catch (error: any) {
      console.log('Profile endpoint failed, trying fallback method...');
      console.log('Profile error:', error.response?.data);
      
      // Fallback: If /auth/profile fails, try to extract userId from token and use /user/{id}
      const accessToken = Cookies.get('access_token');
      if (accessToken) {
        try {
          // Decode JWT token to get userId (simple base64 decode)
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          console.log('Token payload:', payload);
          const userId = payload.userId;
          
          if (userId) {
            console.log('Trying user endpoint with token ID:', userId);
            const userResponse = await apiClient.get(`/user/${userId}`);
            console.log('Successfully got user from token:', userResponse);
            return { user: userResponse };
          }
        } catch (tokenError) {
          console.error('Error parsing token or fetching user:', tokenError);
        }
      }
      
      // Re-throw the original error if all fallbacks fail
      throw error;
    }
  },

  // Logout user with refresh token
  logout: async (refreshToken: string): Promise<{ message: string }> => {
    return await apiClient.post('/auth/logout', { refreshToken });
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<{ accessToken: string }> => {
    return await apiClient.post('/auth/refresh', { refreshToken });
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>): Promise<ProfileResponse> => {
    return await apiClient.put('/auth/profile', userData);
  },

  // Update user by ID (matches the curl request: PUT /api/user/2)
  updateUserById: async (userId: number, userData: Partial<User>): Promise<User> => {
    return await apiClient.put(`/user/${userId}`, userData);
  },

  // Change password
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    return await apiClient.put('/auth/change-password', passwordData);
  },

  // Forgot password
  forgotPassword: async (email: string): Promise<{ message: string }> => {
    return await apiClient.post('/auth/forgot-password', { email });
  },

  // Reset password
  resetPassword: async (resetData: {
    token: string;
    password: string;
  }): Promise<{ message: string }> => {
    return await apiClient.post('/auth/reset-password', resetData);
  },
};
