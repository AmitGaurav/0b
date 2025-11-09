// My Society Page TypeScript Interfaces

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age?: number;
  occupation?: string;
  contactNumber?: string;
  emergencyContact: boolean;
}

export interface Vehicle {
  id: string;
  type: 'car' | 'bike' | 'scooter' | 'bicycle';
  make: string;
  model: string;
  year: number;
  color: string;
  registrationNumber: string;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  apartmentNumber: string;
  floor: number;
  wing?: string;
  role: 'resident' | 'owner' | 'tenant';
  status: 'active' | 'inactive' | 'pending';
  dateJoined: Date;
  lastActive: Date;
  profilePicture?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  familyMembers: FamilyMember[];
  vehicles: Vehicle[];
}

export interface Unit {
  id: string;
  unitNumber: string;
  type: 'apartment' | 'villa' | 'studio' | 'penthouse';
  size: number; // in square feet
  bedrooms: number;
  bathrooms: number;
  floorNumber: number;
  wing?: string;
  status: 'occupied' | 'vacant' | 'maintenance';
  amenities: string[];
  maintenanceSchedule: MaintenanceSchedule[];
  contactPerson: {
    name: string;
    role: string;
    phone: string;
    email: string;
  };
  location: {
    building: string;
    block?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  bookingHistory: BookingRecord[];
  feedback: UnitFeedback[];
  images: string[];
  monthlyRent?: number;
  deposit?: number;
  leaseStartDate?: Date;
  leaseEndDate?: Date;
}

export interface MaintenanceSchedule {
  id: string;
  type: 'routine' | 'repair' | 'emergency';
  description: string;
  scheduledDate: Date;
  completedDate?: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  technician?: string;
  cost?: number;
}

export interface BookingRecord {
  id: string;
  type: 'amenity' | 'facility' | 'service';
  name: string;
  date: Date;
  duration: number; // in minutes
  status: 'confirmed' | 'cancelled' | 'completed';
  cost?: number;
}

export interface UnitFeedback {
  id: string;
  rating: number; // 1-5
  comment: string;
  category: 'maintenance' | 'facility' | 'service' | 'general';
  date: Date;
  respondedBy?: string;
  response?: string;
}

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  type: 'covered' | 'uncovered' | 'basement' | 'open';
  assignedTo: string; // user ID
  status: 'occupied' | 'available' | 'reserved' | 'maintenance';
  vehicleDetails: {
    registrationNumber: string;
    type: string;
    make: string;
    model: string;
  };
  parkingDuration: {
    startDate: Date;
    endDate?: Date;
    isMonthly: boolean;
  };
  location: {
    floor: number;
    section: string;
    nearestEntrance: string;
  };
  bookingHistory: ParkingBooking[];
  images: string[];
  monthlyFee: number;
}

export interface ParkingBooking {
  id: string;
  date: Date;
  duration: number; // in hours
  vehicleNumber: string;
  status: 'active' | 'completed' | 'cancelled';
  cost: number;
}

export interface Transaction {
  id: string;
  date: Date;
  amount: number;
  type: 'maintenance' | 'rent' | 'utility' | 'amenity' | 'penalty' | 'deposit' | 'refund' | 'other';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: 'cash' | 'card' | 'upi' | 'net-banking' | 'cheque';
  description: string;
  receiptNumber?: string;
  relatedUnit?: string;
  category: string;
  taxAmount?: number;
  discountAmount?: number;
}

export interface Due {
  id: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'overdue' | 'partially-paid' | 'paid';
  type: 'maintenance' | 'rent' | 'utility' | 'penalty' | 'special-assessment';
  description: string;
  paymentMethod?: 'cash' | 'card' | 'upi' | 'net-banking' | 'cheque';
  instalmentPlan?: {
    totalInstallments: number;
    paidInstallments: number;
    nextDueDate: Date;
    installmentAmount: number;
  };
  lateFee?: number;
  discountApplicable?: {
    percentage: number;
    validUntil: Date;
    description: string;
  };
  relatedUnit: string;
}

// Section visibility and permissions
export interface SectionVisibility {
  profile: boolean;
  units: boolean;
  parking: boolean;
  transactions: boolean;
  dues: boolean;
}

export interface MySocietyData {
  userProfile: UserProfile;
  units: Unit[];
  parkingSlots: ParkingSlot[];
  transactions: Transaction[];
  dues: Due[];
  sectionVisibility: SectionVisibility;
  lastUpdated: Date;
}

// Component Props
export interface ProfileSectionProps {
  profile: UserProfile;
  onEdit?: () => void;
  isEditing?: boolean;
}

export interface UnitsSectionProps {
  units: Unit[];
  onViewDetails?: (unitId: string) => void;
  onBookAmenity?: (unitId: string) => void;
}

export interface ParkingSectionProps {
  parkingSlots: ParkingSlot[];
  onViewDetails?: (slotId: string) => void;
  onExtendBooking?: (slotId: string) => void;
}

export interface TransactionsSectionProps {
  transactions: Transaction[];
  onViewReceipt?: (transactionId: string) => void;
  onDownloadStatement?: (period: string) => void;
}

export interface DuesSectionProps {
  dues: Due[];
  onPayDue?: (dueId: string) => void;
  onSetupInstalment?: (dueId: string) => void;
}

// Filter and Search interfaces
export interface TransactionFilters {
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  type?: Transaction['type'][];
  status?: Transaction['status'][];
  minAmount?: number;
  maxAmount?: number;
}

export interface DueFilters {
  status?: Due['status'][];
  type?: Due['type'][];
  overdue?: boolean;
}

// API Response interfaces
export interface GetMySocietyDataResponse {
  success: boolean;
  data: MySocietyData;
  message?: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  profile: UserProfile;
  message?: string;
}

export interface PayDueResponse {
  success: boolean;
  transaction: Transaction;
  updatedDue: Due;
  message?: string;
}