// Society Parking Management Types
export type SlotType = 'covered' | 'uncovered' | 'visitor' | 'reserved' | 'disabled' | 'electric';
export type SlotStatus = 'occupied' | 'vacant' | 'under_maintenance' | 'blocked' | 'reserved' | 'available';
export type VehicleType = 'car' | 'bike' | 'scooter' | 'suv' | 'truck' | 'bicycle' | 'other';

export interface VehicleDetails {
  id: string;
  make: string;
  model: string;
  licensePlate: string;
  type: VehicleType;
  color: string;
  year?: number;
  registrationDate?: string;
  insuranceExpiry?: string;
  pollutionCertificate?: {
    number: string;
    expiryDate: string;
  };
}

export interface AssignedMember {
  id: string;
  name: string;
  apartmentNumber: string;
  phoneNumber: string;
  email: string;
  membershipType: 'owner' | 'tenant' | 'visitor';
  assignedDate: string;
  expiryDate?: string;
}

export interface BookingHistory {
  id: string;
  memberName: string;
  apartmentNumber: string;
  vehicleDetails: VehicleDetails;
  startDate: string;
  endDate?: string;
  duration: number; // in hours for visitors, months for residents
  amount?: number;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
  bookingType: 'permanent' | 'temporary' | 'visitor';
  notes?: string;
}

export interface ParkingImage {
  id: string;
  url: string;
  alt: string;
  type: 'slot_view' | 'vehicle' | 'damage' | 'maintenance' | 'general';
  uploadedDate: string;
  uploadedBy: string;
}

export interface MaintenanceRecord {
  id: string;
  type: 'cleaning' | 'repair' | 'painting' | 'marking' | 'lighting' | 'security';
  description: string;
  scheduledDate: string;
  completedDate?: string;
  cost?: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  notes?: string;
}

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  type: SlotType;
  assignedTo?: AssignedMember;
  status: SlotStatus;
  vehicleDetails?: VehicleDetails;
  parkingDuration?: {
    startTime: string;
    endTime?: string;
    totalHours?: number;
  };
  location: {
    floor: string;
    section: string;
    block: string;
    coordinates?: {
      x: number;
      y: number;
    };
  };
  bookingHistory: BookingHistory[];
  images: ParkingImage[];
  maintenanceRecords: MaintenanceRecord[];
  monthlyRate?: number;
  hourlyRate?: number;
  features: string[]; // CCTV, Electric Charging, Security, etc.
  dimensions: {
    length: number;
    width: number;
    height?: number;
  };
  accessibility: {
    disabled: boolean;
    wheelchairAccess: boolean;
    proximityToElevator: boolean;
  };
  lastUpdated: string;
  createdDate: string;
  createdBy: string;
  updatedBy: string;
}

// Search and Filter Types
export interface ParkingSearchFilters {
  search: string;
  type: SlotType | 'all';
  status: SlotStatus | 'all';
  location: string | 'all';
  assignedMember: string | 'all';
  floor: string | 'all';
  vehicleType: VehicleType | 'all';
  membershipType: 'owner' | 'tenant' | 'visitor' | 'all';
}

// Table Configuration
export interface ParkingTableConfig {
  sortBy: keyof ParkingSlot | 'assignedTo.name' | 'location.floor' | 'vehicleDetails.licensePlate';
  sortDirection: 'asc' | 'desc';
  currentPage: number;
  itemsPerPage: number;
  selectedItems: string[];
}

// Bulk Actions
export interface ParkingBulkAction {
  type: 'activate' | 'deactivate' | 'delete' | 'assign' | 'maintenance' | 'export';
  slotIds: string[];
  payload?: {
    status?: SlotStatus;
    assignedTo?: AssignedMember;
    maintenanceType?: MaintenanceRecord['type'];
    scheduledDate?: string;
  };
}

// Form Data Types
export interface ParkingSlotFormData {
  slotNumber: string;
  type: SlotType;
  location: {
    floor: string;
    section: string;
    block: string;
  };
  features: string[];
  dimensions: {
    length: number;
    width: number;
    height?: number;
  };
  accessibility: {
    disabled: boolean;
    wheelchairAccess: boolean;
    proximityToElevator: boolean;
  };
  monthlyRate?: number;
  hourlyRate?: number;
  images?: File[];
}

export interface ParkingAssignmentFormData {
  slotId: string;
  member: AssignedMember;
  vehicleDetails: VehicleDetails;
  assignedDate: string;
  expiryDate?: string;
  monthlyRate?: number;
  notes?: string;
}

export interface VehicleFormData {
  make: string;
  model: string;
  licensePlate: string;
  type: VehicleType;
  color: string;
  year?: number;
  registrationDate?: string;
  insuranceExpiry?: string;
  pollutionCertificate?: {
    number: string;
    expiryDate: string;
  };
}

// Statistics Types
export interface ParkingStatistics {
  totalSlots: number;
  occupiedSlots: number;
  vacantSlots: number;
  underMaintenanceSlots: number;
  coveredSlots: number;
  uncoveredSlots: number;
  visitorSlots: number;
  occupancyRate: number;
  monthlyRevenue: number;
  averageOccupancyTime: number; // in hours
  maintenancePending: number;
}

// Export Types
export interface ParkingExportData {
  slotNumber: string;
  type: string;
  status: string;
  assignedTo: string;
  apartmentNumber: string;
  vehicleMake: string;
  vehicleModel: string;
  licensePlate: string;
  location: string;
  monthlyRate: string;
  assignedDate: string;
  lastMaintenance: string;
}

// Modal Types
export type ParkingModalType = 'add' | 'edit' | 'view' | 'assign' | 'maintenance' | 'history' | null;

export interface ParkingModalState {
  type: ParkingModalType;
  slot?: ParkingSlot;
  isOpen: boolean;
}

// Notification Types
export interface ParkingNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  slotId?: string;
  actionType?: 'create' | 'update' | 'delete' | 'assign' | 'maintenance';
}

// Revenue and Billing Types
export interface ParkingBilling {
  id: string;
  slotId: string;
  memberId: string;
  amount: number;
  period: {
    startDate: string;
    endDate: string;
  };
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: string;
  paidDate?: string;
  paymentMethod?: 'cash' | 'online' | 'cheque' | 'card';
  notes?: string;
}

// Visitor Parking Types
export interface VisitorParkingRequest {
  id: string;
  visitorName: string;
  visitorPhone: string;
  hostMember: {
    name: string;
    apartmentNumber: string;
  };
  vehicleDetails: VehicleDetails;
  expectedDuration: number; // in hours
  requestedDate: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  assignedSlot?: string;
  checkInTime?: string;
  checkOutTime?: string;
  totalAmount?: number;
  notes?: string;
}