// Types for Profile page enhancements
export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  contactNumber?: string;
  email?: string;
  profilePictureUrl?: string;
  dateOfBirth?: string;
  occupation?: string;
  emergencyContact?: boolean;
}

export interface Vehicle {
  id: string;
  vehicleType: string;
  vehicleNumber: string;
  vehicleModel: string;
  vehicleColor: string;
  vehicleBrand?: string;
  registrationDate?: string;
  insuranceExpiry?: string;
  pucExpiry?: string;
  isActive?: boolean;
}

export interface ProfileData {
  familyMembers?: FamilyMember[];
  vehicles?: Vehicle[];
}