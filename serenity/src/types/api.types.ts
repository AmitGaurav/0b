// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  societyId?: string;
  createdAt?: string;
}

// Society types
export interface Society {
  id: string;
  name: string;
  address: string;
  totalUnits: number;
  occupiedUnits: number;
  amenities: string[];
}

export interface Unit {
  id: string;
  number: string;
  type: string;
  floor: number;
  block: string;
  status: 'occupied' | 'vacant';
}