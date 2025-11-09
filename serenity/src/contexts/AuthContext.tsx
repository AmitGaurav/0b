import React, { createContext, useContext, useReducer, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '../services/api/authAPI';
import { Society, UserSocietyMembership } from '../types/society';

// Types
export interface User {
  userId: number | null;
  societyId: number | null;
  username: string | null;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  usernameType: string;
  emailVerified: boolean | null;
  phoneVerified: boolean | null;
  occupation: string;
  alternateEmail: string;
  alternatePhone: string | null;
  alternatePhoneVerified: boolean | null;
  alternateEmailVerified: boolean | null;
  alternatePhone2: string;
  alternateEmail2: string;
  alternatePhone3: string;
  alternateEmail3: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  emergencyContactEmail: string;
  emergencyContactAddress: string;
  emergencyContactPhoneVerified: boolean;
  emergencyContactEmailVerified: boolean;
  emergencyContactAddressVerified: boolean;
  dateOfBirth: string;
  profilePicture: string;
  profilePictureUrl: string;
  residingFromDate: string;
  gender: string;
  maritalStatus: string;
  bloodGroup: string;
  defaultPropertyId: number;
  pets: boolean;
  petsDetails: string;
  aadharNumber: string;
  panNumber: string;
  passportNumber: string;
  drivingLicenseNumber: string;
  voterIdNumber: string;
  clubMembership: boolean;
  clubMembershipDetails: string;
  // Multi-tenant properties
  societies: UserSocietyMembership[];
  currentSociety: Society | null;
  lastUpdated: string | null;
  lastUpdatedBy: string | null;
  createdBy: string | null;
  createdDate: string | null;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  error: string | null;
  needsSocietySelection: boolean;
  selectedSocietyId: number | null;
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  clearError: () => void;
  selectSociety: (societyId: number) => Promise<void>;
  switchSociety: (societyId: number) => Promise<void>;
  getCurrentSociety: () => Society | null;
  getUserSocieties: () => UserSocietyMembership[];
}

export interface RegisterData {
  username: string; // Same as email
  password: string;
  societyId: number;
  email: string;
  name: string;
  address: string;
  occupation: string; // Note: API expects "Occupation" with capital O
}

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  accessToken: null,
  refreshToken: null,
  error: null,
  needsSocietySelection: false,
  selectedSocietyId: null,
};

// Action types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user?: User; accessToken: string; refreshToken: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: { user?: User; accessToken: string; refreshToken: string } }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'LOAD_USER_START' }
  | { type: 'LOAD_USER_SUCCESS'; payload: User }
  | { type: 'LOAD_USER_FAILURE'; payload: string }
  | { type: 'UPDATE_USER_SUCCESS'; payload: User }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SOCIETY_SELECTION_NEEDED'; payload: boolean }
  | { type: 'SELECT_SOCIETY_SUCCESS'; payload: { societyId: number; user: User } }
  | { type: 'SWITCH_SOCIETY_SUCCESS'; payload: { societyId: number; user: User } };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, isLoading: true, error: null };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user || null,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        error: null,
      };
    
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user || null,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        error: null,
      };
    
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        error: action.payload,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        accessToken: null,
        refreshToken: null,
        error: null,
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    
    case 'UPDATE_USER_SUCCESS':
      return {
        ...state,
        user: action.payload,
      };
    
    case 'SET_SOCIETY_SELECTION_NEEDED':
      return {
        ...state,
        needsSocietySelection: action.payload,
      };
    
    case 'SELECT_SOCIETY_SUCCESS':
    case 'SWITCH_SOCIETY_SUCCESS':
      return {
        ...state,
        selectedSocietyId: action.payload.societyId,
        user: action.payload.user,
        needsSocietySelection: false,
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    default:
      return state;
  }
};

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = Cookies.get('access_token');
      const refreshToken = Cookies.get('refresh_token');
      
      if (accessToken) {
        try {
          const response = await authAPI.getProfile();
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { 
              user: response.user, 
              accessToken,
              refreshToken: refreshToken || '' 
            },
          });
        } catch (error) {
          // Invalid token, remove it
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      console.log('=== Login Attempt ===');
      console.log('Username:', username);
      console.log('Password length:', password.length);
      console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL);
      
      dispatch({ type: 'LOGIN_START' });
      
      console.log('Calling authAPI.login...');
      const response = await authAPI.login({ username, password });
      console.log('Login response received:', response);
      
      // Store tokens in cookies
      Cookies.set('access_token', response.accessToken, { expires: 1 }); // 1 day
      Cookies.set('refresh_token', response.refreshToken, { expires: 7 }); // 7 days
      console.log('Tokens stored in cookies');
      
      // Try to get user profile after successful login
      try {
        console.log('Getting user profile...');
        const profileResponse = await authAPI.getProfile();
        console.log('Profile response:', profileResponse);
        
        // Mock multiple societies for testing (in real app, this would come from API)
        const mockSocieties: UserSocietyMembership[] = [
          {
            societyId: 1,
            society: {
              id: 1,
              name: "Green Valley Apartments",
              address: "123 Green Valley Road",
              city: "Mumbai",
              state: "Maharashtra",
              pincode: "400001",
              country: "India",
              isActive: true,
              createdDate: "2024-01-01T00:00:00Z",
              lastUpdated: "2024-01-01T00:00:00Z"
            },
            membershipType: 'OWNER',
            unitNumber: "A-201",
            blockNumber: "A",
            isActive: true,
            joinedDate: "2024-01-01T00:00:00Z"
          },
          {
            societyId: 2,
            society: {
              id: 2,
              name: "Sunrise Gardens",
              address: "456 Sunrise Avenue",
              city: "Mumbai",
              state: "Maharashtra",
              pincode: "400002",
              country: "India",
              isActive: true,
              createdDate: "2024-01-01T00:00:00Z",
              lastUpdated: "2024-01-01T00:00:00Z"
            },
            membershipType: 'TENANT',
            unitNumber: "B-101",
            blockNumber: "B",
            isActive: true,
            joinedDate: "2024-01-15T00:00:00Z"
          }
        ];

        // Enhanced user data with societies
        const enhancedUser: User = {
          ...profileResponse.user,
          societies: mockSocieties,
          currentSociety: null
        };

        // Check if user has multiple societies
        const needsSelection = mockSocieties.length > 1;
        
        // Check for stored society selection
        const storedSocietyId = localStorage.getItem('selectedSocietyId');
        let selectedSociety: Society | null = null;
        
        if (storedSocietyId && mockSocieties.length > 0) {
          const foundMembership = mockSocieties.find(
            membership => membership.societyId === parseInt(storedSocietyId)
          );
          if (foundMembership) {
            selectedSociety = foundMembership.society;
            enhancedUser.currentSociety = selectedSociety;
            enhancedUser.societyId = foundMembership.societyId;
          }
        } else if (mockSocieties.length === 1) {
          // Auto-select if only one society
          selectedSociety = mockSocieties[0].society;
          enhancedUser.currentSociety = selectedSociety;
          enhancedUser.societyId = mockSocieties[0].societyId;
          localStorage.setItem('selectedSocietyId', mockSocieties[0].societyId.toString());
        }
        
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { 
            user: enhancedUser, 
            accessToken: response.accessToken,
            refreshToken: response.refreshToken 
          },
        });

        // Set society selection needed flag
        if (needsSelection && !selectedSociety) {
          dispatch({ type: 'SET_SOCIETY_SELECTION_NEEDED', payload: true });
        }

        console.log('Login completed successfully with user data');
      } catch (profileError) {
        console.log('Profile fetch failed:', profileError);
        // If profile fetch fails, still consider login successful but without user data
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { 
            accessToken: response.accessToken,
            refreshToken: response.refreshToken 
          },
        });
        console.log('Login completed successfully without user data');
      }
    } catch (error: any) {
      console.error('=== Login Failed ===');
      console.error('Error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error message:', error.message);
      
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.response?.data?.message || error.message || 'Login failed',
      });
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      dispatch({ type: 'REGISTER_START' });
      
      const response = await authAPI.register(userData);
      
      // Store tokens in cookies
      Cookies.set('access_token', response.accessToken, { expires: 1 }); // 1 day
      Cookies.set('refresh_token', response.refreshToken, { expires: 7 }); // 7 days
      
      // Try to get user profile after successful registration
      try {
        const profileResponse = await authAPI.getProfile();
        dispatch({
          type: 'REGISTER_SUCCESS',
          payload: { 
            user: profileResponse.user, 
            accessToken: response.accessToken,
            refreshToken: response.refreshToken 
          },
        });
      } catch (profileError) {
        // If profile fetch fails, still consider registration successful but without user data
        dispatch({
          type: 'REGISTER_SUCCESS',
          payload: { 
            accessToken: response.accessToken,
            refreshToken: response.refreshToken 
          },
        });
      }
    } catch (error: any) {
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: error.message || 'Registration failed',
      });
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Get refresh token from cookies
      const refreshToken = Cookies.get('refresh_token');
      
      // Call logout API if refresh token exists
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
      
      // Remove tokens from cookies
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      // Even if API call fails, still logout locally
      console.error('Logout API call failed:', error);
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      dispatch({ type: 'LOGOUT' });
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    if (!state.user?.userId) {
      throw new Error('No user ID available for update');
    }

    try {
      console.log('AuthContext updateUser called with:', userData);
      console.log('Current user ID:', state.user.userId);
      
      // Call API to update user profile
      const updatedUser = await authAPI.updateUserById(state.user.userId, userData);
      
      console.log('API response - updated user:', updatedUser);
      
      // Update local state with the response from server
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      
      console.log('User profile updated successfully in AuthContext');
    } catch (error) {
      console.error('Error updating user profile in AuthContext:', error);
      throw error; // Re-throw so ProfilePage can handle it
    }
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Society-related functions
  const selectSociety = async (societyId: number): Promise<void> => {
    if (!state.user) {
      throw new Error('No user available for society selection');
    }

    try {
      // Find the society in user's societies list
      const selectedMembership = state.user.societies.find(
        membership => membership.societyId === societyId
      );

      if (!selectedMembership) {
        throw new Error('Society not found in user memberships');
      }

      // Update user with selected society
      const updatedUser: User = {
        ...state.user,
        currentSociety: selectedMembership.society,
        societyId: societyId
      };

      // Store selection in localStorage
      localStorage.setItem('selectedSocietyId', societyId.toString());

      dispatch({ 
        type: 'SELECT_SOCIETY_SUCCESS', 
        payload: { societyId, user: updatedUser } 
      });
    } catch (error) {
      console.error('Error selecting society:', error);
      throw error;
    }
  };

  const switchSociety = async (societyId: number): Promise<void> => {
    if (!state.user) {
      throw new Error('No user available for society switching');
    }

    try {
      // Find the society in user's societies list
      const selectedMembership = state.user.societies.find(
        membership => membership.societyId === societyId
      );

      if (!selectedMembership) {
        throw new Error('Society not found in user memberships');
      }

      // Update user with selected society
      const updatedUser: User = {
        ...state.user,
        currentSociety: selectedMembership.society,
        societyId: societyId
      };

      // Store selection in localStorage
      localStorage.setItem('selectedSocietyId', societyId.toString());

      dispatch({ 
        type: 'SWITCH_SOCIETY_SUCCESS', 
        payload: { societyId, user: updatedUser } 
      });
    } catch (error) {
      console.error('Error switching society:', error);
      throw error;
    }
  };

  const getCurrentSociety = (): Society | null => {
    return state.user?.currentSociety || null;
  };

  const getUserSocieties = (): UserSocietyMembership[] => {
    return state.user?.societies || [];
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    clearError,
    selectSociety,
    switchSociety,
    getCurrentSociety,
    getUserSocieties,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
