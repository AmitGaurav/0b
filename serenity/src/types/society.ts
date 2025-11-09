// Society types for multi-tenant support
export interface Society {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isActive: boolean;
  createdDate: string;
  lastUpdated: string;
}

export interface UserSocietyMembership {
  societyId: number;
  society: Society;
  membershipType: 'OWNER' | 'TENANT' | 'ADMIN' | 'MANAGER';
  unitNumber: string;
  blockNumber: string;
  isActive: boolean;
  joinedDate: string;
}

export interface SocietySelection {
  selectedSociety: Society;
  availableSocieties: Society[];
  membership: UserSocietyMembership;
}