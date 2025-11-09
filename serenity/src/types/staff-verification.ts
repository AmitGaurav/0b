import { StaffFormData, StaffRole, Department, StaffStatus } from './staff';

// Enhanced Staff Verification Status
export enum StaffVerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  DOCUMENTS_REQUIRED = 'DOCUMENTS_REQUIRED'
}

// Employment Type enum (not in original staff.ts)
export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  TEMPORARY = 'TEMPORARY',
  INTERN = 'INTERN'
}

// Enhanced Staff interface for verification
export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: StaffRole;
  department: Department;
  employmentType: EmploymentType;
  dateOfJoining: Date;
  profileImageUrl?: string;
  verificationStatus: StaffVerificationStatus;
  status: StaffStatus;
  createdDate: Date;
  updatedDate: Date;
  verifiedBy?: string;
  verifiedDate?: Date;
  rejectionReason?: string;
  lastActiveDate?: Date;
  employmentDuration?: number; // in months
  salary?: number;
  workingHours?: string;
  supervisorId?: number;
  societyId: number;
  skills?: string[];
  emergencyContact?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  bloodGroup?: string;
  dateOfBirth?: Date;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  
  // Additional verification fields
  documentsSubmitted: StaffDocument[];
  verificationNotes?: string;
  backgroundCheckStatus: 'pending' | 'completed' | 'failed';
  backgroundCheckDate?: Date;
  
  // Performance and compliance
  performanceRating?: number; // 1-5 scale
  complianceScore?: number; // 1-100 percentage
  trainingCompleted: string[]; // list of completed training programs
  certificationsValid: boolean; // are all certifications still valid
}

// Staff Document interface
export interface StaffDocument {
  id: string;
  staffId: string;
  documentType: 'resume' | 'identity_proof' | 'address_proof' | 'educational_certificate' | 
               'experience_letter' | 'medical_certificate' | 'police_clearance' | 'reference_letter' | 'other';
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadDate: Date;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedDate?: Date;
  rejectionReason?: string;
  expiryDate?: Date;
  isRequired: boolean;
}

// Search and Filter interfaces
export interface StaffSearchFilters {
  verificationStatus?: StaffVerificationStatus[];
  status?: StaffStatus[];
  role?: StaffRole[];
  department?: Department[];
  employmentType?: EmploymentType[];
  joiningDateFrom?: Date;
  joiningDateTo?: Date;
  lastActiveDateFrom?: Date;
  lastActiveDateTo?: Date;
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  backgroundCheckStatus?: ('pending' | 'completed' | 'failed')[];
  certificationsValid?: boolean;
}

// Sort options
export enum StaffSortField {
  NAME = 'name',
  EMAIL = 'email',
  ROLE = 'role',
  DEPARTMENT = 'department',
  JOINING_DATE = 'joiningDate',
  VERIFICATION_STATUS = 'verificationStatus',
  STATUS = 'status',
  LAST_ACTIVE_DATE = 'lastActiveDate',
  EMPLOYMENT_DURATION = 'employmentDuration',
  SALARY = 'salary'
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export interface StaffSortOptions {
  field: StaffSortField;
  direction: SortDirection;
}

// Bulk actions
export enum StaffBulkActionType {
  APPROVE = 'approve',
  REJECT = 'reject',
  ACTIVATE = 'activate',
  DEACTIVATE = 'deactivate',
  SUSPEND = 'suspend',
  DELETE = 'delete',
  REQUEST_DOCUMENTS = 'request_documents',
  SEND_NOTIFICATION = 'send_notification'
}

export interface StaffBulkAction {
  type: StaffBulkActionType;
  staffIds: string[];
  performedBy: string;
  timestamp: Date;
  reason?: string;
  notes?: string;
}

// Export options
export enum ExportFormat {
  CSV = 'csv',
  EXCEL = 'excel',
  PDF = 'pdf'
}

export enum ExportField {
  NAME = 'name',
  EMAIL = 'email',
  PHONE = 'phone',
  ROLE = 'role',
  DEPARTMENT = 'department',
  JOINING_DATE = 'joiningDate',
  VERIFICATION_STATUS = 'verificationStatus',
  STATUS = 'status',
  SALARY = 'salary',
  ADDRESS = 'address',
  EMERGENCY_CONTACT = 'emergencyContact',
  DOCUMENTS = 'documents'
}

export interface ExportOptions {
  format: ExportFormat;
  fields: ExportField[];
  staffIds?: string[];
  filters?: StaffSearchFilters;
}

// Pagination
export interface PaginationOptions {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// Stats interface
export interface StaffStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  documentsRequired: number;
  backgroundChecksPending: number;
  certificationsExpiring: number; // expiring in next 30 days
}

// Modal modes
export type StaffModalMode = 'add' | 'edit' | 'view' | 'verify';

// Verification action types
export enum VerificationActionType {
  APPROVE = 'approve',
  REJECT = 'reject',
  REQUEST_DOCUMENTS = 'request_documents',
  SCHEDULE_INTERVIEW = 'schedule_interview',
  REQUEST_BACKGROUND_CHECK = 'request_background_check'
}

export interface VerificationAction {
  type: VerificationActionType;
  staffId: string;
  performedBy: string;
  timestamp: Date;
  notes?: string;
  reason?: string;
  documentTypes?: string[]; // for REQUEST_DOCUMENTS action
  interviewDate?: Date; // for SCHEDULE_INTERVIEW action
}

// Notification types
export interface StaffNotification {
  id: string;
  staffId: string;
  type: 'verification_approved' | 'verification_rejected' | 'documents_required' | 
        'interview_scheduled' | 'background_check_completed';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

// Activity log
export interface StaffActivityLog {
  id: string;
  staffId: string;
  action: string;
  performedBy: string;
  timestamp: Date;
  details?: any;
  ipAddress?: string;
}

// Component props interfaces
export interface StaffVerificationPageProps {
  // Optional props for customization
  defaultFilters?: StaffSearchFilters;
  defaultSortOptions?: StaffSortOptions;
  showBulkActions?: boolean;
  showExportOptions?: boolean;
}

export interface StaffDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
  mode: StaffModalMode;
  onSave?: (staff: Partial<StaffMember>) => void;
  onVerificationAction?: (action: VerificationAction) => void;
}

export interface StaffEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: StaffMember | null;
  onSave: (staff: Partial<StaffMember>) => void;
}

export interface StaffTableProps {
  staff: StaffMember[];
  selectedStaffIds: string[];
  onSelectionChange: (staffIds: string[]) => void;
  onView: (staff: StaffMember) => void;
  onEdit: (staff: StaffMember) => void;
  onDelete: (staff: StaffMember) => void;
  onVerificationAction: (staff: StaffMember, action: VerificationActionType) => void;
  sortOptions: StaffSortOptions;
  onSortChange: (sortOptions: StaffSortOptions) => void;
  isLoading?: boolean;
}