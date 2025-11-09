// Society Units Management Types
export type UnitType = 'apartment' | 'studio' | 'commercial' | 'penthouse' | 'duplex' | 'other';
export type UnitStatus = 'occupied' | 'vacant' | 'under_maintenance' | 'reserved' | 'blocked' | 'available';

export interface ContactPerson {
  id: string;
  name: string;
  designation: string;
  phoneNumber: string;
  email: string;
  emergencyContact?: string;
}

export interface AssignedMember {
  id: string;
  name: string;
  apartmentNumber?: string;
  phoneNumber: string;
  email: string;
  moveInDate?: string;
  leaseEndDate?: string;
}

export interface MaintenanceSchedule {
  id: string;
  type: 'routine' | 'repair' | 'deep_cleaning' | 'renovation' | 'inspection';
  description: string;
  scheduledDate: string;
  completedDate?: string;
  cost?: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: string;
}

export interface BookingHistory {
  id: string;
  memberName: string;
  bookingDate: string;
  moveInDate: string;
  moveOutDate?: string;
  duration: number; // in months
  rentAmount: number;
  securityDeposit: number;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
}

export interface UnitFeedback {
  id: string;
  memberName: string;
  rating: number; // 1-5 stars
  comment: string;
  submittedDate: string;
  category: 'amenities' | 'maintenance' | 'location' | 'overall' | 'facilities';
}

export interface UnitImage {
  id: string;
  url: string;
  alt: string;
  type: 'interior' | 'exterior' | 'floor_plan' | 'amenity' | 'other';
  uploadedDate: string;
  uploadedBy: string;
}

export interface SocietyUnit {
  id: string;
  unitNumber: string;
  type: UnitType;
  size: number; // in sq. ft.
  floorNumber: number;
  assignedTo?: AssignedMember;
  status: UnitStatus;
  amenities: string[]; // List of available amenities
  maintenanceSchedule: MaintenanceSchedule[];
  contactPerson: ContactPerson;
  location: {
    building: string;
    wing: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  bookingHistory: BookingHistory[];
  feedback: UnitFeedback[];
  images: UnitImage[];
  rentAmount?: number;
  securityDeposit?: number;
  availableFrom?: string;
  description?: string;
  features: string[]; // Special features like balcony, parking, etc.
  createdDate: string;
  updatedDate: string;
  createdBy: string;
  updatedBy: string;
}

// Search and Filter Types
export interface UnitSearchFilters {
  search: string;
  type: UnitType | 'all';
  status: UnitStatus | 'all';
  location: string | 'all';
  assignedMember: string | 'all';
  floorNumber: number | 'all';
  sizeRange: {
    min: number;
    max: number;
  };
  rentRange: {
    min: number;
    max: number;
  };
}

// Table Configuration
export interface UnitTableConfig {
  sortBy: keyof SocietyUnit | 'assignedMember.name' | 'location.building';
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
  selectedItems: string[];
}

// Bulk Actions
export interface UnitBulkAction {
  type: 'activate' | 'deactivate' | 'delete' | 'assign' | 'maintenance' | 'export';
  unitIds: string[];
  payload?: {
    status?: UnitStatus;
    assignedTo?: AssignedMember;
    maintenanceType?: MaintenanceSchedule['type'];
    scheduledDate?: string;
  };
}

// Form Data Types
export interface UnitFormData {
  unitNumber: string;
  type: UnitType;
  size: number;
  floorNumber: number;
  location: {
    building: string;
    wing: string;
    address: string;
  };
  amenities: string[];
  features: string[];
  rentAmount?: number;
  securityDeposit?: number;
  description?: string;
  contactPerson: ContactPerson;
  images?: File[];
}

export interface UnitAssignmentFormData {
  unitId: string;
  member: AssignedMember;
  moveInDate: string;
  leaseEndDate?: string;
  rentAmount: number;
  securityDeposit: number;
  notes?: string;
}

// Statistics Types
export interface UnitStatistics {
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  underMaintenanceUnits: number;
  averageSize: number;
  averageRent: number;
  occupancyRate: number;
  revenueGenerated: number;
  upcomingMaintenances: number;
  pendingAssignments: number;
}

// Export Types
export interface UnitExportData {
  unitNumber: string;
  type: string;
  size: string;
  floorNumber: string;
  assignedTo: string;
  status: string;
  location: string;
  rentAmount: string;
  contactPerson: string;
  amenities: string;
  lastMaintenance: string;
  occupancyDate: string;
}

// Modal Types
export type UnitModalType = 'add' | 'edit' | 'view' | 'assign' | 'maintenance' | 'history' | null;

export interface UnitModalState {
  type: UnitModalType;
  unit?: SocietyUnit;
  isOpen: boolean;
}

// Notification Types
export interface UnitNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  unitId?: string;
  actionType?: 'create' | 'update' | 'delete' | 'assign' | 'maintenance';
}