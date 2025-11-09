// Types for Documents module

export enum DocumentType {
  POLICY = 'policy',
  PROCEDURE = 'procedure',
  FORM = 'form',
  NOTICE = 'notice',
  MANUAL = 'manual',
  REPORT = 'report',
  CONTRACT = 'contract',
  CERTIFICATE = 'certificate',
  INVOICE = 'invoice',
  RECEIPT = 'receipt',
  LEGAL = 'legal',
  BYLAWS = 'bylaws',
  MEETING_MINUTES = 'meeting-minutes',
  FINANCIAL = 'financial',
  MAINTENANCE = 'maintenance',
  INSURANCE = 'insurance',
  COMPLIANCE = 'compliance',
  OTHER = 'other'
}

export enum DocumentCategory {
  SOCIETY_MANAGEMENT = 'society-management',
  FINANCIAL = 'financial',
  LEGAL_COMPLIANCE = 'legal-compliance',
  MAINTENANCE = 'maintenance',
  SECURITY = 'security',
  AMENITIES = 'amenities',
  MEMBER_SERVICES = 'member-services',
  VENDOR_MANAGEMENT = 'vendor-management',
  EMERGENCY = 'emergency',
  GOVERNANCE = 'governance',
  HR = 'hr',
  INSURANCE = 'insurance',
  COMMUNICATIONS = 'communications',
  GENERAL = 'general'
}

export enum DocumentStatus {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under-review',
  APPROVED = 'approved',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  EXPIRED = 'expired',
  REJECTED = 'rejected'
}

export enum DocumentAccessLevel {
  PUBLIC = 'public',
  MEMBERS_ONLY = 'members-only',
  COMMITTEE_ONLY = 'committee-only',
  ADMIN_ONLY = 'admin-only',
  RESTRICTED = 'restricted'
}

export enum DocumentAction {
  VIEW = 'view',
  DOWNLOAD = 'download',
  EDIT = 'edit',
  DELETE = 'delete',
  SHARE = 'share',
  APPROVE = 'approve',
  ARCHIVE = 'archive'
}

export interface DocumentVersion {
  id: string;
  versionNumber: string;
  fileName: string;
  fileSize: number;
  uploadedAt: Date;
  uploadedBy: {
    id: string;
    name: string;
    role: string;
  };
  changeLog?: string;
  isActive: boolean;
}

export interface DocumentApproval {
  id: string;
  approver: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  approvedAt?: Date;
  level: number; // Approval hierarchy level
}

export interface DocumentPermission {
  userId?: string;
  roleId?: string;
  groupId?: string;
  actions: DocumentAction[];
  expiresAt?: Date;
}

export interface DocumentTag {
  id: string;
  name: string;
  color: string;
}

export interface DocumentComment {
  id: string;
  author: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  isResolved?: boolean;
  parentId?: string; // For threaded comments
}

export interface DocumentActivity {
  id: string;
  action: string;
  performedBy: {
    id: string;
    name: string;
    role: string;
  };
  timestamp: Date;
  details?: string;
  ipAddress?: string;
}

export interface Document {
  id: string;
  title: string;
  description: string;
  type: DocumentType;
  category: DocumentCategory;
  status: DocumentStatus;
  accessLevel: DocumentAccessLevel;
  versions: DocumentVersion[];
  currentVersion: DocumentVersion;
  createdBy: {
    id: string;
    name: string;
    role: string;
    avatar?: string;
  };
  approvals: DocumentApproval[];
  permissions: DocumentPermission[];
  tags: DocumentTag[];
  comments: DocumentComment[];
  activities: DocumentActivity[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  expiresAt?: Date;
  downloadCount: number;
  viewCount: number;
  isTemplate: boolean;
  templateData?: {
    fields: Array<{
      name: string;
      type: 'text' | 'number' | 'date' | 'dropdown';
      required: boolean;
      options?: string[];
    }>;
  };
  relatedDocuments: string[]; // Document IDs
  metadata: Record<string, any>;
  checksum?: string;
  isEncrypted: boolean;
  retention?: {
    period: number; // in days
    action: 'archive' | 'delete';
  };
}

export interface DocumentStats {
  total: number;
  published: number;
  draft: number;
  underReview: number;
  archived: number;
  totalSize: number; // in bytes
  totalDownloads: number;
  totalViews: number;
  recentUploads: number; // last 30 days
}

export interface CreateDocumentData {
  title: string;
  description: string;
  type: DocumentType;
  category: DocumentCategory;
  accessLevel: DocumentAccessLevel;
  file: File;
  tags?: string[];
  expiresAt?: Date;
  isTemplate?: boolean;
  templateData?: {
    fields: Array<{
      name: string;
      type: 'text' | 'number' | 'date' | 'dropdown';
      required: boolean;
      options?: string[];
    }>;
  };
  relatedDocuments?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateDocumentData {
  id: string;
  title?: string;
  description?: string;
  type?: DocumentType;
  category?: DocumentCategory;
  accessLevel?: DocumentAccessLevel;
  status?: DocumentStatus;
  tags?: string[];
  expiresAt?: Date;
  file?: File; // New version
  changeLog?: string;
  relatedDocuments?: string[];
  metadata?: Record<string, any>;
}

export interface DocumentFilters {
  status?: DocumentStatus[];
  type?: DocumentType[];
  category?: DocumentCategory[];
  accessLevel?: DocumentAccessLevel[];
  tags?: string[];
  createdBy?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  searchQuery?: string;
  hasExpiry?: boolean;
  isTemplate?: boolean;
}

export interface DocumentSortOptions {
  field: 'title' | 'createdAt' | 'updatedAt' | 'publishedAt' | 'downloadCount' | 'viewCount' | 'fileSize';
  direction: 'asc' | 'desc';
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  [DocumentType.POLICY]: 'Policy',
  [DocumentType.PROCEDURE]: 'Procedure',
  [DocumentType.FORM]: 'Form',
  [DocumentType.NOTICE]: 'Notice',
  [DocumentType.MANUAL]: 'Manual',
  [DocumentType.REPORT]: 'Report',
  [DocumentType.CONTRACT]: 'Contract',
  [DocumentType.CERTIFICATE]: 'Certificate',
  [DocumentType.INVOICE]: 'Invoice',
  [DocumentType.RECEIPT]: 'Receipt',
  [DocumentType.LEGAL]: 'Legal Document',
  [DocumentType.BYLAWS]: 'Bylaws',
  [DocumentType.MEETING_MINUTES]: 'Meeting Minutes',
  [DocumentType.FINANCIAL]: 'Financial Document',
  [DocumentType.MAINTENANCE]: 'Maintenance Document',
  [DocumentType.INSURANCE]: 'Insurance Document',
  [DocumentType.COMPLIANCE]: 'Compliance Document',
  [DocumentType.OTHER]: 'Other'
};

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  [DocumentCategory.SOCIETY_MANAGEMENT]: 'Society Management',
  [DocumentCategory.FINANCIAL]: 'Financial',
  [DocumentCategory.LEGAL_COMPLIANCE]: 'Legal & Compliance',
  [DocumentCategory.MAINTENANCE]: 'Maintenance',
  [DocumentCategory.SECURITY]: 'Security',
  [DocumentCategory.AMENITIES]: 'Amenities',
  [DocumentCategory.MEMBER_SERVICES]: 'Member Services',
  [DocumentCategory.VENDOR_MANAGEMENT]: 'Vendor Management',
  [DocumentCategory.EMERGENCY]: 'Emergency',
  [DocumentCategory.GOVERNANCE]: 'Governance',
  [DocumentCategory.HR]: 'Human Resources',
  [DocumentCategory.INSURANCE]: 'Insurance',
  [DocumentCategory.COMMUNICATIONS]: 'Communications',
  [DocumentCategory.GENERAL]: 'General'
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
  [DocumentStatus.DRAFT]: 'Draft',
  [DocumentStatus.UNDER_REVIEW]: 'Under Review',
  [DocumentStatus.APPROVED]: 'Approved',
  [DocumentStatus.PUBLISHED]: 'Published',
  [DocumentStatus.ARCHIVED]: 'Archived',
  [DocumentStatus.EXPIRED]: 'Expired',
  [DocumentStatus.REJECTED]: 'Rejected'
};

export const DOCUMENT_ACCESS_LEVEL_LABELS: Record<DocumentAccessLevel, string> = {
  [DocumentAccessLevel.PUBLIC]: 'Public',
  [DocumentAccessLevel.MEMBERS_ONLY]: 'Members Only',
  [DocumentAccessLevel.COMMITTEE_ONLY]: 'Committee Only',
  [DocumentAccessLevel.ADMIN_ONLY]: 'Admin Only',
  [DocumentAccessLevel.RESTRICTED]: 'Restricted'
};

// Utility functions
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
  return imageExtensions.includes(getFileExtension(filename));
};

export const isPdfFile = (filename: string): boolean => {
  return getFileExtension(filename) === 'pdf';
};

export const isOfficeFile = (filename: string): boolean => {
  const officeExtensions = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
  return officeExtensions.includes(getFileExtension(filename));
};