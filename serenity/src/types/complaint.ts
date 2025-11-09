// TypeScript types matching the Java Complaint entity

export enum ComplaintPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ComplaintStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  REOPENED = 'REOPENED',
  CLOSED = 'CLOSED'
}

export enum ComplaintType {
  MAINTENANCE = 'MAINTENANCE',
  SECURITY = 'SECURITY',
  CLEANLINESS = 'CLEANLINESS',
  WATER_SUPPLY = 'WATER_SUPPLY',
  ELECTRICITY = 'ELECTRICITY',
  PARKING = 'PARKING',
  NOISE = 'NOISE',
  GARBAGE = 'GARBAGE',
  LIFT = 'LIFT',
  PLUMBING = 'PLUMBING',
  COMMON_AREA = 'COMMON_AREA',
  OTHER = 'OTHER'
}

export interface Complaint {
  id?: number;
  societyId: number;
  blockId: number;
  unitId: number;
  appUserId: number;
  defaulter?: boolean;
  details: string;
  priority: ComplaintPriority;
  assignedToUserId?: number;
  assignedByUserId?: number;
  assignedDate?: string;
  attendedByUserId?: number;
  attendedDate?: string;
  resolutionDetails?: string;
  resolutionDate?: string;
  reopeningCount?: number;
  escalationLevel?: number;
  status: ComplaintStatus;
  type: ComplaintType;
  attachments?: string[];
  comments?: string[];
  lastUpdated?: string;
  lastUpdatedBy?: string;
  createdBy?: string;
  createdDate?: string;
}

export interface ComplaintFormData {
  details: string;
  priority: ComplaintPriority;
  type: ComplaintType;
  attachments?: File[];
  blockId: number;
  unitId: number;
  visibility: 'public' | 'private';
}

export interface Block {
  id: number;
  name: string;
  societyId: number;
}

export interface Unit {
  id: number;
  unitNumber: string;
  blockId: number;
  type: string;
}