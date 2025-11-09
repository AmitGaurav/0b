// Society Amenities Management Types
export interface SocietyAmenity {
  id: number;
  name: string;
  description: string;
  category: AmenityCategory;
  location: string;
  capacity: number;
  operatingHours: {
    start: string;
    end: string;
    days: string[];
  };
  availabilityStatus: AvailabilityStatus;
  bookingStatus: BookingStatus;
  usageGuidelines: string;
  maintenanceSchedule: MaintenanceSchedule;
  contactPerson: ContactPerson;
  amenitiesProvided: string[];
  rulesAndRegulations: string;
  images: AmenityImage[];
  bookingHistory: BookingRecord[];
  feedbackAndRatings: FeedbackRecord[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastUpdatedBy: string;
  isActive: boolean;
  societyId: number;
  pricing?: AmenityPricing;
  usage: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  revenue: number;
  reviews: ReviewRecord[];
}

export interface AmenityImage {
  id: number;
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
  isPrimary: boolean;
  alt: string;
}

export interface BookingRecord {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  purpose: string;
  status: BookingRecordStatus;
  amount: number;
  paymentStatus: PaymentStatus;
  createdAt: string;
  cancelledAt?: string;
  cancelReason?: string;
  attendees: number;
  notes?: string;
}

export interface FeedbackRecord {
  id: number;
  userId: number;
  userName: string;
  rating: number; // 1-5 stars
  feedback: string;
  submittedAt: string;
  bookingId?: number;
  isVerified: boolean;
  helpfulVotes: number;
  response?: {
    text: string;
    respondedAt: string;
    respondedBy: string;
  };
}

export interface ReviewRecord {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  review: string;
  date: string;
  verified: boolean;
}

export interface MaintenanceSchedule {
  nextScheduledDate: string;
  lastMaintenanceDate: string;
  maintenanceType: MaintenanceType;
  frequency: MaintenanceFrequency;
  assignedTo: string;
  estimatedDuration: number; // in hours
  cost: number;
  notes?: string;
  isOverdue: boolean;
  recurringSchedule?: {
    pattern: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
    interval: number;
    endDate?: string;
  };
}

export interface ContactPerson {
  name: string;
  designation: string;
  phoneNumber: string;
  email: string;
  alternatePhone?: string;
  availability: string; // e.g., "9 AM - 6 PM"
  isEmergencyContact: boolean;
}

export interface AmenityPricing {
  hourlyRate?: number;
  dailyRate?: number;
  weeklyRate?: number;
  monthlyRate?: number;
  seasonalRates?: {
    season: string;
    rate: number;
    startDate: string;
    endDate: string;
  }[];
  memberDiscount?: number; // percentage
  securityDeposit?: number;
}

// Enums and Types
export type AmenityCategory = 
  | 'sports' 
  | 'fitness' 
  | 'recreation' 
  | 'social' 
  | 'business' 
  | 'outdoor' 
  | 'wellness' 
  | 'entertainment' 
  | 'utility' 
  | 'other';

export type AvailabilityStatus = 'available' | 'unavailable' | 'maintenance' | 'reserved';
export type BookingStatus = 'open' | 'booked' | 'partially_booked' | 'closed';
export type BookingRecordStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'no_show';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded' | 'partial';
export type MaintenanceType = 'routine' | 'repair' | 'deep_cleaning' | 'inspection' | 'upgrade';
export type MaintenanceFrequency = 'weekly' | 'monthly' | 'quarterly' | 'biannual' | 'annual' | 'as_needed';

// Search and Filter Types
export interface AmenitySearchFilters {
  searchTerm: string;
  category: AmenityCategory | '';
  availabilityStatus: AvailabilityStatus | '';
  bookingStatus: BookingStatus | '';
  location: string;
  operatingHours: {
    start: string;
    end: string;
  } | null;
  capacity: {
    min: number;
    max: number;
  } | null;
  priceRange: {
    min: number;
    max: number;
  } | null;
  hasImages: boolean | null;
  rating: number | null; // minimum rating filter
  isActive: boolean | null;
  maintenanceOverdue: boolean | null;
  dateRange: {
    start: string;
    end: string;
  } | null;
}

// Sort Options
export interface AmenitySortOptions {
  field: AmenitySortField;
  direction: SortDirection;
}

export type AmenitySortField = 
  | 'name' 
  | 'category' 
  | 'location' 
  | 'capacity' 
  | 'availabilityStatus'
  | 'bookingStatus'
  | 'createdAt'
  | 'updatedAt'
  | 'usage.daily'
  | 'usage.weekly'
  | 'usage.monthly'
  | 'rating'
  | 'revenue';

export type SortDirection = 'asc' | 'desc';

// Bulk Actions
export interface AmenityBulkAction {
  action: AmenityBulkActionType;
  amenityIds: number[];
  params?: any;
}

export type AmenityBulkActionType = 
  | 'activate' 
  | 'deactivate' 
  | 'delete' 
  | 'update_category'
  | 'update_status'
  | 'export'
  | 'maintenance_schedule'
  | 'price_update';

// Export Options
export interface AmenityExportOptions {
  format: ExportFormat;
  fields: AmenityExportField[];
  filters: AmenitySearchFilters;
  includeImages: boolean;
  includeBookingHistory: boolean;
  includeFeedback: boolean;
}

export type ExportFormat = 'csv' | 'excel' | 'pdf';
export type AmenityExportField = keyof SocietyAmenity | 'rating' | 'totalBookings' | 'totalRevenue';

// Pagination
export interface AmenityPaginationOptions {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Form Data Types
export interface AmenityFormData {
  name: string;
  description: string;
  category: AmenityCategory;
  location: string;
  capacity: number;
  operatingHours: {
    start: string;
    end: string;
    days: string[];
  };
  usageGuidelines: string;
  amenitiesProvided: string[];
  rulesAndRegulations: string;
  contactPerson: ContactPerson;
  maintenanceSchedule: Partial<MaintenanceSchedule>;
  pricing?: Partial<AmenityPricing>;
  images: File[];
  availabilityStatus: AvailabilityStatus;
  bookingStatus: BookingStatus;
  bookingRequired: boolean;
}

export type WeekDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const WEEK_DAYS: WeekDay[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const AVAILABILITY_STATUSES: AvailabilityStatus[] = ['available', 'unavailable', 'maintenance', 'reserved'];

export const BOOKING_STATUSES: BookingStatus[] = ['open', 'booked', 'partially_booked', 'closed'];

// Notification Types
export interface AmenityNotification {
  id: string;
  type: AmenityNotificationType;
  title: string;
  message: string;
  amenityId: number;
  amenityName: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  priority: NotificationPriority;
}

export type AmenityNotificationType = 
  | 'amenity_added'
  | 'amenity_updated'
  | 'amenity_deactivated'
  | 'amenity_deleted'
  | 'booking_created'
  | 'booking_cancelled'
  | 'maintenance_due'
  | 'maintenance_overdue'
  | 'feedback_received'
  | 'rating_received';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

// Statistics and Analytics
export interface AmenityStats {
  totalAmenities: number;
  activeAmenities: number;
  availableAmenities: number;
  bookedAmenities: number;
  maintenanceOverdue: number;
  averageRating: number;
  totalRevenue: number;
  totalBookings: number;
  mostPopularAmenity: {
    id: number;
    name: string;
    bookings: number;
  };
  categoryDistribution: {
    category: AmenityCategory;
    count: number;
    percentage: number;
  }[];
  usageTrends: {
    period: string;
    usage: number;
    revenue: number;
  }[];
}

// API Response Types
export interface AmenityListResponse {
  amenities: SocietyAmenity[];
  pagination: AmenityPaginationOptions;
  stats: AmenityStats;
  filters: AmenitySearchFilters;
}

export interface AmenityResponse {
  amenity: SocietyAmenity;
  relatedAmenities: SocietyAmenity[];
  recentBookings: BookingRecord[];
}

// Component Props Types
export interface AmenityTableProps {
  amenities: SocietyAmenity[];
  onEdit: (amenity: SocietyAmenity) => void;
  onDelete: (amenityId: number) => void;
  onView: (amenity: SocietyAmenity) => void;
  onSelect: (amenityId: number, selected: boolean) => void;
  selectedIds: number[];
  sortOptions: AmenitySortOptions;
  onSort: (field: AmenitySortField) => void;
  isLoading?: boolean;
}

export interface AmenityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AmenityFormData) => void;
  amenity?: SocietyAmenity;
  mode: 'add' | 'edit' | 'view';
  isLoading?: boolean;
}

export interface AmenityFiltersProps {
  filters: AmenitySearchFilters;
  onFiltersChange: (filters: AmenitySearchFilters) => void;
  onReset: () => void;
  categories: AmenityCategory[];
  locations: string[];
}

// Security and Permissions
export interface AmenityPermissions {
  canView: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
  canManageMaintenance: boolean;
  canViewBookings: boolean;
  canViewFinancials: boolean;
  canReceiveNotifications: boolean;
}