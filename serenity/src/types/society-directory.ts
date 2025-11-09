// Society Directory Types for Serenity UI

export enum DirectoryEntryType {
  MEMBER = 'MEMBER',
  VENDOR = 'VENDOR',
  STAFF = 'STAFF',
  SECURITY = 'SECURITY'
}

export enum MemberRole {
  OWNER = 'OWNER',
  TENANT = 'TENANT',
  RESIDENT = 'RESIDENT',
  COMMITTEE_MEMBER = 'COMMITTEE_MEMBER',
  PRESIDENT = 'PRESIDENT',
  SECRETARY = 'SECRETARY',
  TREASURER = 'TREASURER'
}

export enum VendorType {
  MAINTENANCE = 'MAINTENANCE',
  CLEANING = 'CLEANING',
  SECURITY = 'SECURITY',
  CATERING = 'CATERING',
  TRANSPORTATION = 'TRANSPORTATION',
  UTILITIES = 'UTILITIES',
  SUPPLIES = 'SUPPLIES',
  SERVICES = 'SERVICES',
  OTHER = 'OTHER'
}

export enum StaffRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  RECEPTIONIST = 'RECEPTIONIST',
  MAINTENANCE = 'MAINTENANCE',
  HOUSEKEEPING = 'HOUSEKEEPING',
  GARDENER = 'GARDENER',
  DRIVER = 'DRIVER',
  OTHER = 'OTHER'
}

export enum SecurityRole {
  HEAD_SECURITY = 'HEAD_SECURITY',
  SECURITY_GUARD = 'SECURITY_GUARD',
  GATE_KEEPER = 'GATE_KEEPER',
  PATROL_OFFICER = 'PATROL_OFFICER',
  SUPERVISOR = 'SUPERVISOR'
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

export enum PersonStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING = 'PENDING',
  TERMINATED = 'TERMINATED'
}

export enum UnitType {
  APARTMENT = 'APARTMENT',
  VILLA = 'VILLA',
  PENTHOUSE = 'PENTHOUSE',
  STUDIO = 'STUDIO',
  DUPLEX = 'DUPLEX',
  COMMERCIAL = 'COMMERCIAL'
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC'
}

export enum DirectorySortField {
  NAME = 'NAME',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  ROLE = 'ROLE',
  DEPARTMENT = 'DEPARTMENT',
  UNIT_NUMBER = 'UNIT_NUMBER',
  VENDOR_TYPE = 'VENDOR_TYPE',
  DATE_JOINED = 'DATE_JOINED',
  STATUS = 'STATUS'
}

export enum ExportFormat {
  CSV = 'CSV',
  EXCEL = 'EXCEL'
}

// Base interface for all directory entries
export interface BaseDirectoryEntry {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  profilePicture?: string;
  status: PersonStatus;
  dateJoined: Date;
  emergencyContact?: string;
  documents: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Member-specific interface
export interface MemberDirectoryEntry extends BaseDirectoryEntry {
  type: DirectoryEntryType.MEMBER;
  role: MemberRole;
  unitNumber: string;
  unitType: UnitType;
  floorNumber: number;
  blockNumber?: string;
  membershipId: string;
  familyMembers: number;
  vehicleCount: number;
  balanceAmount: number;
  isCommitteeMember: boolean;
  committeePosition?: string;
}

// Vendor-specific interface
export interface VendorDirectoryEntry extends BaseDirectoryEntry {
  type: DirectoryEntryType.VENDOR;
  vendorType: VendorType;
  companyName: string;
  gstNumber?: string;
  contractStartDate: Date;
  contractEndDate: Date;
  serviceAreas: string[];
  rating: number;
  totalContracts: number;
  isActive: boolean;
  contactPerson: string;
  licenseNumber?: string;
}

// Staff-specific interface
export interface StaffDirectoryEntry extends BaseDirectoryEntry {
  type: DirectoryEntryType.STAFF;
  role: StaffRole;
  department: Department;
  employeeId: string;
  salary: number;
  workingHours: string;
  supervisorId?: number;
  supervisorName?: string;
  skills: string[];
  bloodGroup?: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}

// Security-specific interface
export interface SecurityDirectoryEntry extends BaseDirectoryEntry {
  type: DirectoryEntryType.SECURITY;
  role: SecurityRole;
  department: Department.SECURITY;
  employeeId: string;
  salary: number;
  shift: 'DAY' | 'NIGHT' | 'ROTATING';
  licenseNumber: string;
  licenseExpiryDate: Date;
  trainingCertificates: string[];
  supervisorId?: number;
  supervisorName?: string;
  assignedGates: string[];
  bloodGroup?: string;
  dateOfBirth: Date;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
}

// Union type for all directory entries
export type DirectoryEntry = 
  | MemberDirectoryEntry 
  | VendorDirectoryEntry 
  | StaffDirectoryEntry 
  | SecurityDirectoryEntry;

// Search and filter interfaces
export interface DirectorySearchFilters {
  searchTerm: string;
  entryType?: DirectoryEntryType;
  role?: MemberRole | VendorType | StaffRole | SecurityRole;
  department?: Department;
  unitNumber?: string;
  vendorType?: VendorType;
  status?: PersonStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface DirectorySortOptions {
  field: DirectorySortField;
  direction: SortDirection;
}

export interface DirectoryPaginationOptions {
  page: number;
  limit: number;
  total?: number;
}

// Tab configuration
export interface DirectoryTab {
  id: DirectoryEntryType;
  label: string;
  icon: React.ComponentType;
  count: number;
}

// Export options
export interface DirectoryExportOptions {
  format: ExportFormat;
  entryType: DirectoryEntryType;
  includeFilters: boolean;
  selectedFields: DirectoryExportField[];
}

export enum DirectoryExportField {
  NAME = 'NAME',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  ADDRESS = 'ADDRESS',
  ROLE = 'ROLE',
  DEPARTMENT = 'DEPARTMENT',
  UNIT_NUMBER = 'UNIT_NUMBER',
  VENDOR_TYPE = 'VENDOR_TYPE',
  COMPANY_NAME = 'COMPANY_NAME',
  CONTRACT_DATES = 'CONTRACT_DATES',
  STATUS = 'STATUS',
  DATE_JOINED = 'DATE_JOINED',
  EMERGENCY_CONTACT = 'EMERGENCY_CONTACT'
}

// Modal mode for viewing details
export interface DirectoryModalMode {
  type: 'view';
  data: DirectoryEntry;
}

// Statistics for the directory
export interface DirectoryStats {
  totalMembers: number;
  totalVendors: number;
  totalStaff: number;
  totalSecurity: number;
  activeEntries: number;
  inactiveEntries: number;
}

// View configuration for different entry types
export interface DirectoryViewConfig {
  columns: DirectoryColumnConfig[];
  filters: DirectoryFilterConfig[];
  exportFields: DirectoryExportField[];
}

export interface DirectoryColumnConfig {
  key: string;
  label: string;
  sortable: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, entry: DirectoryEntry) => React.ReactNode;
}

export interface DirectoryFilterConfig {
  key: string;
  label: string;
  type: 'select' | 'text' | 'date' | 'number';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

// Notification types
export interface DirectoryNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

// Helper type guards
export const isMemberEntry = (entry: DirectoryEntry): entry is MemberDirectoryEntry => {
  return entry.type === DirectoryEntryType.MEMBER;
};

export const isVendorEntry = (entry: DirectoryEntry): entry is VendorDirectoryEntry => {
  return entry.type === DirectoryEntryType.VENDOR;
};

export const isStaffEntry = (entry: DirectoryEntry): entry is StaffDirectoryEntry => {
  return entry.type === DirectoryEntryType.STAFF;
};

export const isSecurityEntry = (entry: DirectoryEntry): entry is SecurityDirectoryEntry => {
  return entry.type === DirectoryEntryType.SECURITY;
};

// Utility functions
export const getEntryTypeLabel = (type: DirectoryEntryType): string => {
  switch (type) {
    case DirectoryEntryType.MEMBER:
      return 'Members';
    case DirectoryEntryType.VENDOR:
      return 'Vendors';
    case DirectoryEntryType.STAFF:
      return 'Staff';
    case DirectoryEntryType.SECURITY:
      return 'Security Personnel';
    default:
      return 'Unknown';
  }
};

export const getStatusColor = (status: PersonStatus): string => {
  switch (status) {
    case PersonStatus.ACTIVE:
      return 'success';
    case PersonStatus.INACTIVE:
      return 'default';
    case PersonStatus.SUSPENDED:
      return 'error';
    case PersonStatus.PENDING:
      return 'warning';
    case PersonStatus.TERMINATED:
      return 'error';
    default:
      return 'default';
  }
};