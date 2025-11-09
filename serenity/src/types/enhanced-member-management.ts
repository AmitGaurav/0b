// Enhanced Member Management Types and Interfaces
// For Super Admin access only - comprehensive society member management

// Import existing types
import { 
  MemberRole, 
  Permission 
} from './member-management';

// Enhanced Society Member Status
export enum SocietyMemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
  PENDING_APPROVAL = 'pending_approval'
}

// Enhanced Verification Status
export enum VerificationStatus {
  VERIFIED = 'verified',
  PENDING = 'pending',
  REJECTED = 'rejected',
  IN_REVIEW = 'in_review',
  EXPIRED = 'expired'
}

// Gender enum
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

// Marital Status
export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  SEPARATED = 'separated'
}

// Blood Group
export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-'
}

// Contact Information interface
export interface ContactInformation {
  primaryPhone: string;
  secondaryPhone?: string;
  primaryEmail: string;
  secondaryEmail?: string;
  whatsappNumber?: string;
  telegramId?: string;
  linkedinProfile?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
}

// Personal Details interface
export interface PersonalDetails {
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: Date;
  gender: Gender;
  nationality: string;
  occupation: string;
  workAddress?: string;
  maritalStatus: MaritalStatus;
  bloodGroup?: BloodGroup;
  aadhaarNumber?: string;
  panNumber?: string;
  passportNumber?: string;
  drivingLicenseNumber?: string;
}

// Family Relation enum
export enum FamilyRelation {
  SPOUSE = 'spouse',
  CHILD = 'child',
  PARENT = 'parent',
  SIBLING = 'sibling',
  GRANDPARENT = 'grandparent',
  GRANDCHILD = 'grandchild',
  OTHER = 'other'
}

// Family Member interface
export interface FamilyMember {
  id: string;
  name: string;
  relation: FamilyRelation;
  dateOfBirth: Date;
  gender: Gender;
  occupation?: string;
  contactNumber?: string;
  email?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  isResident: boolean;
  profilePicture?: string;
}

// Document types
export enum DocumentType {
  AADHAAR = 'aadhaar',
  PAN = 'pan',
  PASSPORT = 'passport',
  DRIVING_LICENSE = 'driving_license',
  VOTER_ID = 'voter_id',
  OTHER = 'other'
}

export interface Document {
  id: string;
  type: DocumentType;
  name: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
  verificationStatus: VerificationStatus;
  expiryDate?: Date;
  issuingAuthority?: string;
  documentNumber?: string;
}

// Unit and Vehicle types
export enum UnitType {
  APARTMENT = 'apartment',
  VILLA = 'villa',
  PENTHOUSE = 'penthouse'
}

export enum OwnershipType {
  OWNED = 'owned',
  RENTED = 'rented',
  LEASED = 'leased'
}

export enum VehicleType {
  TWO_WHEELER = 'two_wheeler',
  FOUR_WHEELER = 'four_wheeler',
  BICYCLE = 'bicycle'
}

export interface Unit {
  id: string;
  unitNumber: string;
  unitType: UnitType;
  ownershipType: OwnershipType;
  area: number;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  isActive: boolean;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string;
  vehicleType: VehicleType;
  brand: string;
  model: string;
  color: string;
  registrationDate: Date;
  isActive: boolean;
}

// Emergency Contact
export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
}

// Activity Log
export enum ActivityAction {
  LOGIN = 'login',
  PROFILE_UPDATE = 'profile_update',
  DOCUMENT_UPLOAD = 'document_upload'
}

export interface ActivityLogEntry {
  id: string;
  action: ActivityAction;
  description: string;
  timestamp: Date;
  ipAddress?: string;
  deviceInfo?: string;
}

// Notification Settings
export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  whatsappNotifications: boolean;
  maintenanceReminders: boolean;
  eventNotifications: boolean;
  paymentReminders: boolean;
  securityAlerts: boolean;
}

// Main Member Interface
export interface Member {
  id: string;
  name: string;
  apartmentNumber: string;
  role: MemberRole;
  contactInformation: ContactInformation;
  status: SocietyMemberStatus;
  dateJoined: Date;
  lastActiveDate: Date;
  lastLoginDate?: Date;
  profilePicture?: string;
  membershipDuration: number; // in months
  notes?: string;
  personalDetails: PersonalDetails;
  familyDetails: FamilyMember[];
  documents: Document[];
  verificationStatus: VerificationStatus;
  units: Unit[];
  vehicles: Vehicle[];
  emergencyContacts: EmergencyContact[];
  activityLog: ActivityLogEntry[];
  notifications: NotificationSettings;
  permissions: Permission[];
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt?: Date;
}

// Search and Filter interfaces
export interface MemberSearchFilters {
  status?: SocietyMemberStatus;
  role?: MemberRole[];
  verificationStatus?: VerificationStatus;
  dateJoinedFrom?: Date;
  dateJoinedTo?: Date;
  lastActiveFrom?: Date;
  lastActiveTo?: Date;
  apartmentNumber?: string;
}

// Sort options
export enum MemberSortField {
  NAME = 'name',
  APARTMENT_NUMBER = 'apartmentNumber',
  ROLE = 'role',
  STATUS = 'status',
  DATE_JOINED = 'dateJoined',
  LAST_ACTIVE_DATE = 'lastActiveDate',
  MEMBERSHIP_DURATION = 'membershipDuration'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export interface MemberSortOptions {
  field: MemberSortField;
  direction: SortDirection;
}

// Bulk Actions
export enum BulkActionType {
  ACTIVATE = 'activate',
  DEACTIVATE = 'deactivate',
  DELETE = 'delete',
  EXPORT = 'export'
}

export interface BulkAction {
  type: BulkActionType;
  memberIds: string[];
  performedBy: string;
  timestamp: Date;
}

// Export functionality
export enum ExportFormat {
  CSV = 'csv',
  EXCEL = 'excel'
}

export enum ExportField {
  NAME = 'name',
  APARTMENT_NUMBER = 'apartmentNumber',
  CONTACT = 'contact',
  STATUS = 'status',
  ROLE = 'role',
  DATE_JOINED = 'dateJoined',
  LAST_ACTIVE = 'lastActiveDate',
  MEMBERSHIP_DURATION = 'membershipDuration'
}

export interface ExportOptions {
  format: ExportFormat;
  fields: ExportField[];
  memberIds?: string[];
  filters?: MemberSearchFilters;
}

// Pagination
export interface PaginationOptions {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// Notifications
export enum NotificationType {
  MEMBER_ADDED = 'member_added',
  MEMBER_UPDATED = 'member_updated',
  MEMBER_DELETED = 'member_deleted',
  MEMBER_ACTIVATED = 'member_activated',
  MEMBER_DEACTIVATED = 'member_deactivated',
  BULK_ACTION_COMPLETED = 'bulk_action_completed'
}

// Form data for member creation/editing
export interface MemberFormData {
  personalDetails: PersonalDetails;
  contactInformation: ContactInformation;
  role: MemberRole;
  status: SocietyMemberStatus;
  units: Unit[];
  vehicles: Vehicle[];
  familyDetails: FamilyMember[];
  documents: Document[];
  emergencyContacts: EmergencyContact[];
  notifications: NotificationSettings;
  permissions: Permission[];
  notes?: string;
  profilePicture?: File;
}