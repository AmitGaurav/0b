// Staff Types for Serenity UI
// Defines all the necessary types for the staff module

export enum StaffRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  RECEPTIONIST = 'RECEPTIONIST',
  SECURITY = 'SECURITY',
  MAINTENANCE = 'MAINTENANCE',
  HOUSEKEEPING = 'HOUSEKEEPING',
  GARDENER = 'GARDENER',
  DRIVER = 'DRIVER',
  OTHER = 'OTHER'
}

export enum Department {
  ADMINISTRATION = 'ADMINISTRATION',
  SECURITY = 'SECURITY',
  MAINTENANCE = 'MAINTENANCE',
  HOUSEKEEPING = 'HOUSEKEEPING',
  GARDENING = 'GARDENING',
  TRANSPORTATION = 'TRANSPORTATION',
  OTHER = 'OTHER'
}

export enum DocumentType {
  ID_PROOF = 'ID_PROOF',
  ADDRESS_PROOF = 'ADDRESS_PROOF',
  QUALIFICATION = 'QUALIFICATION',
  EXPERIENCE = 'EXPERIENCE',
  TRAINING = 'TRAINING',
  POLICE_VERIFICATION = 'POLICE_VERIFICATION',
  CONTRACT = 'CONTRACT',
  OTHER = 'OTHER'
}

export enum StaffStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  TERMINATED = 'TERMINATED',
  PROBATION = 'PROBATION',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION'
}

export interface StaffDocument {
  id: number;
  name: string;
  type: DocumentType;
  url: string;
  uploadDate: Date;
  expiryDate?: Date;
  verified: boolean;
  verifiedBy?: string;
  verifiedDate?: Date;
}

export interface Staff {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: StaffRole;
  department: Department;
  dateOfJoining: Date;
  profilePicture?: string;
  documents: StaffDocument[];
  status: StaffStatus;
  createdAt: Date;
  updatedAt: Date;
  emergencyContact?: string;
  bloodGroup?: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  salary?: number;
  workingHours?: string;
  supervisorId?: number;
  societyId: number;
  skills?: string[];
}

export interface StaffFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: StaffRole;
  department: Department;
  dateOfJoining: string;
  profilePicture?: File;
  documents: File[];
  documentTypes: DocumentType[];
  status: StaffStatus;
  emergencyContact?: string;
  bloodGroup?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  salary?: number;
  workingHours?: string;
  supervisorId?: number;
  societyId: number;
  skills?: string[];
}

export interface StaffSearchFilters {
  name?: string;
  role?: StaffRole;
  department?: Department;
  status?: StaffStatus;
  dateJoinedFrom?: Date;
  dateJoinedTo?: Date;
}

export interface StaffSortOptions {
  field: 'name' | 'role' | 'department' | 'dateOfJoining' | 'status';
  direction: 'asc' | 'desc';
}