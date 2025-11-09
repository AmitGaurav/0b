// Types for Maintenance Requests module

export enum MaintenanceRequestType {
  PLUMBING = 'plumbing',
  ELECTRICAL = 'electrical',
  HVAC = 'hvac',
  CARPENTRY = 'carpentry',
  PAINTING = 'painting',
  APPLIANCE = 'appliance',
  ELEVATOR = 'elevator',
  CLEANING = 'cleaning',
  PEST_CONTROL = 'pest-control',
  SECURITY = 'security',
  LANDSCAPING = 'landscaping',
  GENERAL = 'general',
  EMERGENCY = 'emergency'
}

export enum MaintenanceRequestStatus {
  SUBMITTED = 'submitted',
  ACKNOWLEDGED = 'acknowledged',
  ASSIGNED = 'assigned',
  IN_PROGRESS = 'in-progress',
  ON_HOLD = 'on-hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected'
}

export enum MaintenanceRequestPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  EMERGENCY = 'emergency'
}

export enum MaintenanceRequestLocation {
  APARTMENT = 'apartment',
  COMMON_AREA = 'common-area',
  PARKING = 'parking',
  ELEVATOR = 'elevator',
  STAIRCASE = 'staircase',
  GARDEN = 'garden',
  ROOFTOP = 'rooftop',
  BASEMENT = 'basement',
  ENTRANCE = 'entrance',
  OFFICE = 'office'
}

export interface MaintenanceRequestAttachment {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface CreateMaintenanceRequestData {
  title: string;
  description: string;
  type: MaintenanceRequestType;
  priority: MaintenanceRequestPriority;
  location: MaintenanceRequestLocation;
  unitNumber?: string;
  attachments?: File[];
  tags?: string[];
  recurring?: {
    isRecurring: boolean;
    frequency?: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  };
}

export interface MaintenanceRequestTechnician {
  id: string;
  name: string;
  specialization: MaintenanceRequestType[];
  phone: string;
  email: string;
  avatar?: string;
  rating: number;
  totalJobs: number;
  isAvailable: boolean;
}

export interface MaintenanceRequestComment {
  id: string;
  author: {
    id: string;
    name: string;
    role: 'resident' | 'admin' | 'technician';
    avatar?: string;
  };
  message: string;
  createdAt: Date;
  attachments?: MaintenanceRequestAttachment[];
}

export interface MaintenanceRequestHistory {
  id: string;
  action: string;
  performedBy: {
    id: string;
    name: string;
    role: 'resident' | 'admin' | 'technician';
  };
  timestamp: Date;
  details?: string;
}

export interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  type: MaintenanceRequestType;
  priority: MaintenanceRequestPriority;
  status: MaintenanceRequestStatus;
  location: MaintenanceRequestLocation;
  unitNumber?: string;
  requestedBy: {
    id: string;
    name: string;
    phone: string;
    email: string;
    unitNumber: string;
    avatar?: string;
  };
  assignedTechnician?: MaintenanceRequestTechnician;
  attachments: MaintenanceRequestAttachment[];
  comments: MaintenanceRequestComment[];
  history: MaintenanceRequestHistory[];
  createdAt: Date;
  updatedAt: Date;
  acknowledgedAt?: Date;
  assignedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  estimatedCost?: number;
  actualCost?: number;
  estimatedDuration?: number; // in hours
  actualDuration?: number; // in hours
  recurring?: {
    isRecurring: boolean;
    frequency?: 'weekly' | 'monthly' | 'quarterly' | 'annually';
    nextDueDate?: Date;
  };
  tags: string[];
}

export interface MaintenanceRequestStats {
  total: number;
  submitted: number;
  inProgress: number;
  completed: number;
  overdue: number;
  avgResolutionTime: number; // in hours
  avgRating: number;
  totalCost: number;
  emergencyCount: number;
}

export interface CreateMaintenanceRequestData {
  title: string;
  description: string;
  type: MaintenanceRequestType;
  priority: MaintenanceRequestPriority;
  location: MaintenanceRequestLocation;
  unitNumber?: string;
  attachments?: File[];
  tags?: string[];
  recurring?: {
    isRecurring: boolean;
    frequency?: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  };
}

export interface UpdateMaintenanceRequestData {
  id: string;
  status?: MaintenanceRequestStatus;
  assignedTechnician?: string;
  priority?: MaintenanceRequestPriority;
  estimatedCost?: number;
  estimatedDuration?: number;
  comment?: string;
  attachments?: File[];
}

export interface MaintenanceRequestFilters {
  status?: MaintenanceRequestStatus[];
  type?: MaintenanceRequestType[];
  priority?: MaintenanceRequestPriority[];
  location?: MaintenanceRequestLocation[];
  assignedTechnician?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
}

export interface MaintenanceRequestSortOptions {
  field: 'createdAt' | 'updatedAt' | 'priority' | 'status' | 'type';
  direction: 'asc' | 'desc';
}

export const MAINTENANCE_REQUEST_TYPE_LABELS: Record<MaintenanceRequestType, string> = {
  [MaintenanceRequestType.PLUMBING]: 'Plumbing',
  [MaintenanceRequestType.ELECTRICAL]: 'Electrical',
  [MaintenanceRequestType.HVAC]: 'HVAC',
  [MaintenanceRequestType.CARPENTRY]: 'Carpentry',
  [MaintenanceRequestType.PAINTING]: 'Painting',
  [MaintenanceRequestType.APPLIANCE]: 'Appliance',
  [MaintenanceRequestType.ELEVATOR]: 'Elevator',
  [MaintenanceRequestType.CLEANING]: 'Cleaning',
  [MaintenanceRequestType.PEST_CONTROL]: 'Pest Control',
  [MaintenanceRequestType.SECURITY]: 'Security',
  [MaintenanceRequestType.LANDSCAPING]: 'Landscaping',
  [MaintenanceRequestType.GENERAL]: 'General',
  [MaintenanceRequestType.EMERGENCY]: 'Emergency'
};

export const MAINTENANCE_REQUEST_STATUS_LABELS: Record<MaintenanceRequestStatus, string> = {
  [MaintenanceRequestStatus.SUBMITTED]: 'Submitted',
  [MaintenanceRequestStatus.ACKNOWLEDGED]: 'Acknowledged',
  [MaintenanceRequestStatus.ASSIGNED]: 'Assigned',
  [MaintenanceRequestStatus.IN_PROGRESS]: 'In Progress',
  [MaintenanceRequestStatus.ON_HOLD]: 'On Hold',
  [MaintenanceRequestStatus.COMPLETED]: 'Completed',
  [MaintenanceRequestStatus.CANCELLED]: 'Cancelled',
  [MaintenanceRequestStatus.REJECTED]: 'Rejected'
};

export const MAINTENANCE_REQUEST_PRIORITY_LABELS: Record<MaintenanceRequestPriority, string> = {
  [MaintenanceRequestPriority.LOW]: 'Low',
  [MaintenanceRequestPriority.MEDIUM]: 'Medium',
  [MaintenanceRequestPriority.HIGH]: 'High',
  [MaintenanceRequestPriority.URGENT]: 'Urgent',
  [MaintenanceRequestPriority.EMERGENCY]: 'Emergency'
};

export const MAINTENANCE_REQUEST_LOCATION_LABELS: Record<MaintenanceRequestLocation, string> = {
  [MaintenanceRequestLocation.APARTMENT]: 'Apartment',
  [MaintenanceRequestLocation.COMMON_AREA]: 'Common Area',
  [MaintenanceRequestLocation.PARKING]: 'Parking',
  [MaintenanceRequestLocation.ELEVATOR]: 'Elevator',
  [MaintenanceRequestLocation.STAIRCASE]: 'Staircase',
  [MaintenanceRequestLocation.GARDEN]: 'Garden',
  [MaintenanceRequestLocation.ROOFTOP]: 'Rooftop',
  [MaintenanceRequestLocation.BASEMENT]: 'Basement',
  [MaintenanceRequestLocation.ENTRANCE]: 'Entrance',
  [MaintenanceRequestLocation.OFFICE]: 'Office'
};