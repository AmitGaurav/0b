// User roles and permissions for society management system
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER', 
  GUEST = 'GUEST'
}

export enum Permission {
  VIEW = 'VIEW',
  DOWNLOAD = 'DOWNLOAD',
  UPLOAD = 'UPLOAD',
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  ASSIGN = 'ASSIGN',
  RESPOND = 'RESPOND',
  PARTICIPATE = 'PARTICIPATE'
}

// Role-based permissions for each module
export interface ModulePermissions {
  [UserRole.ADMIN]: Permission[];
  [UserRole.USER]: Permission[];
  [UserRole.GUEST]: Permission[];
}

// Society modules configuration
export enum SocietyModuleType {
  DOCUMENT_CENTER = 'DOCUMENT_CENTER',
  FORM_CENTER = 'FORM_CENTER',
  NOTICE_BOARD = 'NOTICE_BOARD',
  EVENT_MANAGEMENT = 'EVENT_MANAGEMENT',
  STAFF_MANAGEMENT = 'STAFF_MANAGEMENT',
  VENDOR_MANAGEMENT = 'VENDOR_MANAGEMENT',
  FACILITY_MANAGEMENT = 'FACILITY_MANAGEMENT',
  POLLS_SURVEYS = 'POLLS_SURVEYS',
  SOCIETY_DIRECTORY = 'SOCIETY_DIRECTORY',
  ANNOUNCEMENTS = 'ANNOUNCEMENTS',
  GALLERY = 'GALLERY',
  FEEDBACK_SUGGESTIONS = 'FEEDBACK_SUGGESTIONS',
  MAINTENANCE_REQUESTS = 'MAINTENANCE_REQUESTS',
  PARKING_MANAGEMENT = 'PARKING_MANAGEMENT',
  SECURITY_MANAGEMENT = 'SECURITY_MANAGEMENT',
  INVENTORY_MANAGEMENT = 'INVENTORY_MANAGEMENT',
  SUSTAINABILITY_INITIATIVES = 'SUSTAINABILITY_INITIATIVES',
  LEGAL_COMPLIANCE = 'LEGAL_COMPLIANCE'
}

export interface SocietyModule {
  id: SocietyModuleType;
  title: string;
  description: string;
  icon: string;
  route: string;
  permissions: ModulePermissions;
  isActive: boolean;
  color: string;
  category: ModuleCategory;
}

export enum ModuleCategory {
  ADMINISTRATION = 'ADMINISTRATION',
  COMMUNITY = 'COMMUNITY', 
  SERVICES = 'SERVICES',
  MANAGEMENT = 'MANAGEMENT'
}

// Document Center Types
export interface Document {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: Date;
  uploadedBy: string;
  category: DocumentCategory;
  accessLevel: AccessLevel;
  downloadCount: number;
  societyId: string;
  tags: string[];
}

export enum DocumentCategory {
  BYLAWS = 'BYLAWS',
  FINANCIAL = 'FINANCIAL',
  LEGAL = 'LEGAL',
  MAINTENANCE = 'MAINTENANCE',
  MEETINGS = 'MEETINGS',
  POLICIES = 'POLICIES',
  PROCEDURES = 'PROCEDURES',
  AGREEMENTS = 'AGREEMENTS',
  CERTIFICATES = 'CERTIFICATES',
  OTHER = 'OTHER'
}

export enum AccessLevel {
  PUBLIC = 'PUBLIC',
  RESIDENTS = 'RESIDENTS',
  ADMIN_ONLY = 'ADMIN_ONLY'
}

// Form Center Types
export interface FormTemplate {
  id: string;
  title: string;
  description: string;
  category: FormCategory;
  fields: FormField[];
  requiredRole: UserRole[];
  approvalRequired: boolean;
  isActive: boolean;
  createdDate: Date;
  updatedDate: Date;
  societyId: string;
}

export enum FormCategory {
  VENDOR_ONBOARDING = 'VENDOR_ONBOARDING',
  STAFF_ONBOARDING = 'STAFF_ONBOARDING',
  TENANT_REGISTRATION = 'TENANT_REGISTRATION',
  OWNER_TRANSFER = 'OWNER_TRANSFER',
  MAINTENANCE_REQUEST = 'MAINTENANCE_REQUEST',
  FACILITY_BOOKING = 'FACILITY_BOOKING',
  PARKING_ALLOCATION = 'PARKING_ALLOCATION',
  COMPLAINT_REGISTRATION = 'COMPLAINT_REGISTRATION',
  NOC_REQUEST = 'NOC_REQUEST',
  VISITOR_REGISTRATION = 'VISITOR_REGISTRATION',
  EVENT_PERMISSION = 'EVENT_PERMISSION',
  RENOVATION_APPROVAL = 'RENOVATION_APPROVAL',
  VEHICLE_REGISTRATION = 'VEHICLE_REGISTRATION',
  PET_REGISTRATION = 'PET_REGISTRATION',
  EMERGENCY_CONTACT = 'EMERGENCY_CONTACT'
}

export interface FormField {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: FormValidation;
}

export enum FormFieldType {
  TEXT = 'TEXT',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  SELECT = 'SELECT',
  MULTI_SELECT = 'MULTI_SELECT',
  TEXTAREA = 'TEXTAREA',
  FILE = 'FILE',
  CHECKBOX = 'CHECKBOX',
  RADIO = 'RADIO'
}

export interface FormValidation {
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

// Event Management Types
export interface Event {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  startDate: Date;
  endDate: Date;
  location: string;
  organizer: string;
  maxParticipants?: number;
  currentParticipants: number;
  registrationRequired: boolean;
  registrationDeadline?: Date;
  status: EventStatus;
  imageUrl?: string;
  societyId: string;
  createdBy: string;
  createdDate: Date;
}

export enum EventCategory {
  FESTIVAL = 'FESTIVAL',
  CULTURAL = 'CULTURAL',
  SPORTS = 'SPORTS',
  EDUCATIONAL = 'EDUCATIONAL',
  HEALTH = 'HEALTH',
  SOCIAL = 'SOCIAL',
  MAINTENANCE = 'MAINTENANCE',
  MEETING = 'MEETING',
  OTHER = 'OTHER'
}

export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

// Staff Management Types
export interface StaffMember {
  id: string;
  name: string;
  designation: string;
  department: StaffDepartment;
  contactNumber: string;
  email?: string;
  address: string;
  joinDate: Date;
  salary?: number;
  shift: ShiftType;
  status: StaffStatus;
  skills: string[];
  emergencyContact: EmergencyContact;
  documents: Document[];
  societyId: string;
}

export enum StaffDepartment {
  SECURITY = 'SECURITY',
  HOUSEKEEPING = 'HOUSEKEEPING',
  MAINTENANCE = 'MAINTENANCE',
  ADMINISTRATION = 'ADMINISTRATION',
  GARDENING = 'GARDENING'
}

export enum ShiftType {
  DAY = 'DAY',
  NIGHT = 'NIGHT',
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME'
}

export enum StaffStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_LEAVE = 'ON_LEAVE',
  TERMINATED = 'TERMINATED'
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  address: string;
}

// Poll and Survey Types
export interface Poll {
  id: string;
  title: string;
  description: string;
  type: PollType;
  questions: PollQuestion[];
  startDate: Date;
  endDate: Date;
  status: PollStatus;
  allowAnonymous: boolean;
  allowMultipleVotes: boolean;
  societyId: string;
  createdBy: string;
  createdDate: Date;
  totalVotes: number;
}

export enum PollType {
  POLL = 'POLL',
  SURVEY = 'SURVEY'
}

export enum PollStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED'
}

export interface PollQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: PollOption[];
  required: boolean;
}

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TEXT = 'TEXT',
  RATING = 'RATING'
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

// User Context with Role
export interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  apartment: string;
  societyId: string;
  permissions: Permission[];
}

// Module Access Control
export interface ModuleAccess {
  moduleType: SocietyModuleType;
  userRole: UserRole;
  hasAccess: boolean;
  permissions: Permission[];
}

// Utility functions for permission checking
export const hasPermission = (
  userRole: UserRole,
  module: SocietyModule,
  permission: Permission
): boolean => {
  return module.permissions[userRole].includes(permission);
};

export const getAccessibleModules = (
  userRole: UserRole,
  modules: SocietyModule[]
): SocietyModule[] => {
  return modules.filter(module => 
    module.permissions[userRole].length > 0 && module.isActive
  );
};

export const canAccessModule = (
  userRole: UserRole,
  module: SocietyModule
): boolean => {
  return module.permissions[userRole].includes(Permission.VIEW);
};