// Bulk Upload Types and Interfaces for Society Management System

export enum BulkUploadType {
  // Core System Uploads
  MEMBER = 'member',
  SOCIETY = 'society', 
  VENDOR = 'vendor',
  STAFF = 'staff',
  FACILITY = 'facility',
  
  // Communication & Events
  EVENT = 'event',
  NOTICE = 'notice',
  DOCUMENT = 'document',
  FORM = 'form',
  POLL = 'poll',
  SURVEY = 'survey',
  ANNOUNCEMENT = 'announcement',
  FEEDBACK = 'feedback',
  SUGGESTION = 'suggestion',
  
  // Maintenance & Operations
  MAINTENANCE_REQUEST = 'maintenance_request',
  PARKING_SLOT = 'parking_slot',
  SECURITY_PERSONNEL = 'security_personnel',
  INVENTORY_ITEM = 'inventory_item',
  
  // Legal & Compliance
  SUSTAINABILITY_INITIATIVE = 'sustainability_initiative',
  LEGAL_DOCUMENT = 'legal_document',
  COMPLIANCE_DOCUMENT = 'compliance_document',
  
  // Financial Management
  EXPENSE = 'expense',
  BUDGET = 'budget',
  PAYMENT = 'payment',
  FINANCIAL_REPORT = 'financial_report',
  TAX_DETAIL = 'tax_detail',
  AUDIT_DETAIL = 'audit_detail',
  INVOICE = 'invoice',
  VENDOR_PAYMENT = 'vendor_payment',
  FUND = 'fund',
  INVESTMENT = 'investment',
  LOAN = 'loan',
  MEMBERSHIP_FEE = 'membership_fee',
  FINANCIAL_EVENT = 'financial_event',
  FINANCIAL_ANNOUNCEMENT = 'financial_announcement',
  FINANCIAL_FEEDBACK = 'financial_feedback',
  FINANCIAL_SUGGESTION = 'financial_suggestion',
  
  // Templates
  TEMPLATE_DOWNLOAD = 'template_download'
}

export enum BulkUploadStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface BulkUploadConfig {
  type: BulkUploadType;
  displayName: string;
  description: string;
  icon: string;
  maxFileSize: number; // in MB
  maxRecords: number;
  acceptedFormats: string[];
  templateFileName: string;
  requiredFields: string[];
  optionalFields: string[];
  validationRules: ValidationRule[];
  category: BulkUploadCategory;
}

export enum BulkUploadCategory {
  CORE_SYSTEM = 'core_system',
  COMMUNICATION = 'communication',
  FINANCIAL = 'financial',
  OPERATIONS = 'operations',
  LEGAL_COMPLIANCE = 'legal_compliance',
  TEMPLATES = 'templates'
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'email' | 'phone' | 'date' | 'number' | 'enum' | 'regex';
  value?: any;
  message: string;
}

export interface BulkUploadRequest {
  id: string;
  type: BulkUploadType;
  fileName: string;
  fileSize: number;
  recordCount: number;
  status: BulkUploadStatus;
  uploadedBy: string;
  uploadedAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  successCount?: number;
  errorCount?: number;
  errors?: BulkUploadError[];
  options: BulkUploadOptions;
}

export interface BulkUploadError {
  row: number;
  field: string;
  value: string;
  message: string;
}

export interface BulkUploadOptions {
  skipDuplicates: boolean;
  autoApprove: boolean;
  sendNotifications: boolean;
  validateOnly: boolean;
  overwriteExisting: boolean;
}

export interface BulkUploadStats {
  totalUploads: number;
  pendingUploads: number;
  completedUploads: number;
  failedUploads: number;
  totalRecordsProcessed: number;
  successRate: number;
}

export interface TemplateField {
  name: string;
  displayName: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'email' | 'phone' | 'enum';
  required: boolean;
  description: string;
  example: string;
  validValues?: string[];
  format?: string;
}

export interface CSVTemplate {
  type: BulkUploadType;
  fileName: string;
  headers: string[];
  fields: TemplateField[];
  sampleData: Record<string, any>[];
}

// Bulk Upload Configurations for all 40 types
export const BULK_UPLOAD_CONFIGS: Record<BulkUploadType, BulkUploadConfig> = {
  [BulkUploadType.MEMBER]: {
    type: BulkUploadType.MEMBER,
    displayName: 'Member Bulk Upload',
    description: 'Upload multiple society members at once using CSV file',
    icon: '👥',
    maxFileSize: 10,
    maxRecords: 500,
    acceptedFormats: ['.csv'],
    templateFileName: 'member_upload_template.csv',
    requiredFields: ['firstName', 'lastName', 'email', 'phone', 'membershipType'],
    optionalFields: ['dateOfBirth', 'alternatePhone', 'gender', 'unitNumber'],
    validationRules: [
      { field: 'email', type: 'email', message: 'Invalid email format' },
      { field: 'phone', type: 'phone', message: 'Invalid phone number' }
    ],
    category: BulkUploadCategory.CORE_SYSTEM
  },

  [BulkUploadType.SOCIETY]: {
    type: BulkUploadType.SOCIETY,
    displayName: 'Society Bulk Upload',
    description: 'Upload multiple societies at once using CSV file',
    icon: '🏢',
    maxFileSize: 5,
    maxRecords: 100,
    acceptedFormats: ['.csv'],
    templateFileName: 'society_upload_template.csv',
    requiredFields: ['name', 'address', 'city', 'state', 'registrationNumber'],
    optionalFields: ['description', 'establishedDate', 'totalUnits', 'amenities'],
    validationRules: [
      { field: 'name', type: 'required', message: 'Society name is required' }
    ],
    category: BulkUploadCategory.CORE_SYSTEM
  },

  [BulkUploadType.VENDOR]: {
    type: BulkUploadType.VENDOR,
    displayName: 'Vendor Bulk Upload', 
    description: 'Upload multiple vendors at once using CSV file',
    icon: '🏪',
    maxFileSize: 8,
    maxRecords: 200,
    acceptedFormats: ['.csv'],
    templateFileName: 'vendor_upload_template.csv',
    requiredFields: ['name', 'contactPerson', 'phone', 'email', 'serviceType'],
    optionalFields: ['address', 'gstNumber', 'panNumber', 'rating'],
    validationRules: [
      { field: 'email', type: 'email', message: 'Invalid email format' },
      { field: 'phone', type: 'phone', message: 'Invalid phone number' }
    ],
    category: BulkUploadCategory.CORE_SYSTEM
  },

  [BulkUploadType.STAFF]: {
    type: BulkUploadType.STAFF,
    displayName: 'Staff Bulk Upload',
    description: 'Upload multiple staff members at once using CSV file',
    icon: '👷',
    maxFileSize: 6,
    maxRecords: 150,
    acceptedFormats: ['.csv'],
    templateFileName: 'staff_upload_template.csv',
    requiredFields: ['firstName', 'lastName', 'phone', 'designation', 'department'],
    optionalFields: ['email', 'joiningDate', 'salary', 'address'],
    validationRules: [
      { field: 'phone', type: 'phone', message: 'Invalid phone number' }
    ],
    category: BulkUploadCategory.CORE_SYSTEM
  },

  [BulkUploadType.FACILITY]: {
    type: BulkUploadType.FACILITY,
    displayName: 'Facility Bulk Upload',
    description: 'Upload multiple facilities at once using CSV file',
    icon: '🏛️',
    maxFileSize: 4,
    maxRecords: 100,
    acceptedFormats: ['.csv'],
    templateFileName: 'facility_upload_template.csv',
    requiredFields: ['name', 'type', 'capacity', 'location'],
    optionalFields: ['description', 'amenities', 'bookingRate', 'maintenanceSchedule'],
    validationRules: [
      { field: 'capacity', type: 'number', message: 'Capacity must be a number' }
    ],
    category: BulkUploadCategory.CORE_SYSTEM
  },

  [BulkUploadType.EVENT]: {
    type: BulkUploadType.EVENT,
    displayName: 'Event Bulk Upload',
    description: 'Upload multiple events at once using CSV file', 
    icon: '📅',
    maxFileSize: 3,
    maxRecords: 50,
    acceptedFormats: ['.csv'],
    templateFileName: 'event_upload_template.csv',
    requiredFields: ['title', 'description', 'startDate', 'endDate', 'venue'],
    optionalFields: ['category', 'maxAttendees', 'registrationFee', 'organizer'],
    validationRules: [
      { field: 'startDate', type: 'date', message: 'Invalid start date format' },
      { field: 'endDate', type: 'date', message: 'Invalid end date format' }
    ],
    category: BulkUploadCategory.COMMUNICATION
  },

  [BulkUploadType.NOTICE]: {
    type: BulkUploadType.NOTICE,
    displayName: 'Notice Bulk Upload',
    description: 'Upload multiple notices at once using CSV file',
    icon: '📢',
    maxFileSize: 2,
    maxRecords: 100,
    acceptedFormats: ['.csv'],
    templateFileName: 'notice_upload_template.csv',
    requiredFields: ['title', 'content', 'publishDate', 'category'],
    optionalFields: ['expiryDate', 'priority', 'targetAudience', 'attachments'],
    validationRules: [
      { field: 'publishDate', type: 'date', message: 'Invalid publish date format' }
    ],
    category: BulkUploadCategory.COMMUNICATION
  },

  [BulkUploadType.DOCUMENT]: {
    type: BulkUploadType.DOCUMENT,
    displayName: 'Document Bulk Upload',
    description: 'Upload multiple documents at once using CSV file',
    icon: '📄',
    maxFileSize: 15,
    maxRecords: 200,
    acceptedFormats: ['.csv'],
    templateFileName: 'document_upload_template.csv',
    requiredFields: ['title', 'category', 'filePath', 'uploadedBy'],
    optionalFields: ['description', 'tags', 'expiryDate', 'accessLevel'],
    validationRules: [
      { field: 'title', type: 'required', message: 'Document title is required' }
    ],
    category: BulkUploadCategory.COMMUNICATION
  },

  [BulkUploadType.FORM]: {
    type: BulkUploadType.FORM,
    displayName: 'Form Bulk Upload',
    description: 'Upload multiple forms at once using CSV file',
    icon: '📝',
    maxFileSize: 5,
    maxRecords: 75,
    acceptedFormats: ['.csv'],
    templateFileName: 'form_upload_template.csv',
    requiredFields: ['title', 'description', 'category', 'fields'],
    optionalFields: ['isActive', 'submissionLimit', 'deadline', 'requiredApproval'],
    validationRules: [
      { field: 'title', type: 'required', message: 'Form title is required' }
    ],
    category: BulkUploadCategory.COMMUNICATION
  },

  [BulkUploadType.POLL]: {
    type: BulkUploadType.POLL,
    displayName: 'Poll Bulk Upload',
    description: 'Upload multiple polls at once using CSV file',
    icon: '🗳️',
    maxFileSize: 3,
    maxRecords: 50,
    acceptedFormats: ['.csv'],
    templateFileName: 'poll_upload_template.csv',
    requiredFields: ['question', 'options', 'startDate', 'endDate'],
    optionalFields: ['category', 'multipleChoice', 'anonymous', 'targetAudience'],
    validationRules: [
      { field: 'startDate', type: 'date', message: 'Invalid start date format' },
      { field: 'endDate', type: 'date', message: 'Invalid end date format' }
    ],
    category: BulkUploadCategory.COMMUNICATION
  },

  [BulkUploadType.SURVEY]: {
    type: BulkUploadType.SURVEY,
    displayName: 'Survey Bulk Upload',
    description: 'Upload multiple surveys at once using CSV file',
    icon: '📊',
    maxFileSize: 4,
    maxRecords: 30,
    acceptedFormats: ['.csv'],
    templateFileName: 'survey_upload_template.csv',
    requiredFields: ['title', 'description', 'questions', 'deadline'],
    optionalFields: ['category', 'anonymous', 'targetAudience', 'incentives'],
    validationRules: [
      { field: 'deadline', type: 'date', message: 'Invalid deadline format' }
    ],
    category: BulkUploadCategory.COMMUNICATION
  },

  [BulkUploadType.ANNOUNCEMENT]: {
    type: BulkUploadType.ANNOUNCEMENT,
    displayName: 'Announcement Bulk Upload',
    description: 'Upload multiple announcements at once using CSV file',
    icon: '📣',
    maxFileSize: 3,
    maxRecords: 100,
    acceptedFormats: ['.csv'],
    templateFileName: 'announcement_upload_template.csv',
    requiredFields: ['title', 'content', 'publishDate', 'priority'],
    optionalFields: ['category', 'expiryDate', 'targetAudience', 'images'],
    validationRules: [
      { field: 'publishDate', type: 'date', message: 'Invalid publish date format' }
    ],
    category: BulkUploadCategory.COMMUNICATION
  },

  [BulkUploadType.FEEDBACK]: {
    type: BulkUploadType.FEEDBACK,
    displayName: 'Feedback Bulk Upload',
    description: 'Upload multiple feedback entries at once using CSV file',
    icon: '💬',
    maxFileSize: 2,
    maxRecords: 200,
    acceptedFormats: ['.csv'],
    templateFileName: 'feedback_upload_template.csv',
    requiredFields: ['subject', 'content', 'category', 'submittedBy'],
    optionalFields: ['priority', 'status', 'responseDate', 'assignedTo'],
    validationRules: [
      { field: 'subject', type: 'required', message: 'Feedback subject is required' }
    ],
    category: BulkUploadCategory.COMMUNICATION
  },

  [BulkUploadType.SUGGESTION]: {
    type: BulkUploadType.SUGGESTION,
    displayName: 'Suggestion Bulk Upload',
    description: 'Upload multiple suggestions at once using CSV file',
    icon: '💡',
    maxFileSize: 2,
    maxRecords: 150,
    acceptedFormats: ['.csv'],
    templateFileName: 'suggestion_upload_template.csv',
    requiredFields: ['title', 'description', 'category', 'submittedBy'],
    optionalFields: ['priority', 'status', 'implementationDate', 'benefits'],
    validationRules: [
      { field: 'title', type: 'required', message: 'Suggestion title is required' }
    ],
    category: BulkUploadCategory.COMMUNICATION
  },

  [BulkUploadType.MAINTENANCE_REQUEST]: {
    type: BulkUploadType.MAINTENANCE_REQUEST,
    displayName: 'Maintenance Request Bulk Upload',
    description: 'Upload multiple maintenance requests at once using CSV file',
    icon: '🔧',
    maxFileSize: 5,
    maxRecords: 100,
    acceptedFormats: ['.csv'],
    templateFileName: 'maintenance_request_upload_template.csv',
    requiredFields: ['title', 'description', 'location', 'priority', 'requestedBy'],
    optionalFields: ['category', 'estimatedCost', 'deadline', 'assignedTo'],
    validationRules: [
      { field: 'priority', type: 'enum', value: ['low', 'medium', 'high', 'critical'], message: 'Invalid priority level' }
    ],
    category: BulkUploadCategory.OPERATIONS
  },

  [BulkUploadType.PARKING_SLOT]: {
    type: BulkUploadType.PARKING_SLOT,
    displayName: 'Parking Slot Bulk Upload',
    description: 'Upload multiple parking slots at once using CSV file',
    icon: '🅿️',
    maxFileSize: 3,
    maxRecords: 500,
    acceptedFormats: ['.csv'],
    templateFileName: 'parking_slot_upload_template.csv',
    requiredFields: ['slotNumber', 'type', 'location', 'status'],
    optionalFields: ['assignedTo', 'monthlyRate', 'dimensions', 'specialFeatures'],
    validationRules: [
      { field: 'slotNumber', type: 'required', message: 'Slot number is required' }
    ],
    category: BulkUploadCategory.OPERATIONS
  },

  [BulkUploadType.SECURITY_PERSONNEL]: {
    type: BulkUploadType.SECURITY_PERSONNEL,
    displayName: 'Security Personnel Bulk Upload',
    description: 'Upload multiple security personnel at once using CSV file',
    icon: '🛡️',
    maxFileSize: 4,
    maxRecords: 50,
    acceptedFormats: ['.csv'],
    templateFileName: 'security_personnel_upload_template.csv',
    requiredFields: ['firstName', 'lastName', 'phone', 'shift', 'licenseNumber'],
    optionalFields: ['email', 'joiningDate', 'specialization', 'emergencyContact'],
    validationRules: [
      { field: 'phone', type: 'phone', message: 'Invalid phone number' }
    ],
    category: BulkUploadCategory.OPERATIONS
  },

  [BulkUploadType.INVENTORY_ITEM]: {
    type: BulkUploadType.INVENTORY_ITEM,
    displayName: 'Inventory Item Bulk Upload',
    description: 'Upload multiple inventory items at once using CSV file',
    icon: '📦',
    maxFileSize: 6,
    maxRecords: 1000,
    acceptedFormats: ['.csv'],
    templateFileName: 'inventory_item_upload_template.csv',
    requiredFields: ['itemName', 'category', 'quantity', 'unit', 'location'],
    optionalFields: ['description', 'minStock', 'maxStock', 'supplier', 'cost'],
    validationRules: [
      { field: 'quantity', type: 'number', message: 'Quantity must be a number' }
    ],
    category: BulkUploadCategory.OPERATIONS
  },

  [BulkUploadType.SUSTAINABILITY_INITIATIVE]: {
    type: BulkUploadType.SUSTAINABILITY_INITIATIVE,
    displayName: 'Sustainability Initiative Bulk Upload',
    description: 'Upload multiple sustainability initiatives at once using CSV file',
    icon: '🌱',
    maxFileSize: 3,
    maxRecords: 50,
    acceptedFormats: ['.csv'],
    templateFileName: 'sustainability_initiative_upload_template.csv',
    requiredFields: ['title', 'description', 'category', 'startDate', 'targetDate'],
    optionalFields: ['budget', 'expectedImpact', 'metrics', 'responsiblePerson'],
    validationRules: [
      { field: 'startDate', type: 'date', message: 'Invalid start date format' }
    ],
    category: BulkUploadCategory.LEGAL_COMPLIANCE
  },

  [BulkUploadType.LEGAL_DOCUMENT]: {
    type: BulkUploadType.LEGAL_DOCUMENT,
    displayName: 'Legal Document Bulk Upload',
    description: 'Upload multiple legal documents at once using CSV file',
    icon: '⚖️',
    maxFileSize: 10,
    maxRecords: 100,
    acceptedFormats: ['.csv'],
    templateFileName: 'legal_document_upload_template.csv',
    requiredFields: ['title', 'type', 'filePath', 'issuedBy', 'issueDate'],
    optionalFields: ['expiryDate', 'renewalDate', 'status', 'description'],
    validationRules: [
      { field: 'issueDate', type: 'date', message: 'Invalid issue date format' }
    ],
    category: BulkUploadCategory.LEGAL_COMPLIANCE
  },

  [BulkUploadType.COMPLIANCE_DOCUMENT]: {
    type: BulkUploadType.COMPLIANCE_DOCUMENT,
    displayName: 'Compliance Document Bulk Upload',
    description: 'Upload multiple compliance documents at once using CSV file',
    icon: '📋',
    maxFileSize: 8,
    maxRecords: 100,
    acceptedFormats: ['.csv'],
    templateFileName: 'compliance_document_upload_template.csv',
    requiredFields: ['title', 'regulationType', 'filePath', 'complianceDate'],
    optionalFields: ['authority', 'renewalDate', 'status', 'penalties'],
    validationRules: [
      { field: 'complianceDate', type: 'date', message: 'Invalid compliance date format' }
    ],
    category: BulkUploadCategory.LEGAL_COMPLIANCE
  },

  // Financial Management Bulk Uploads
  [BulkUploadType.EXPENSE]: {
    type: BulkUploadType.EXPENSE,
    displayName: 'Expense Bulk Upload',
    description: 'Upload multiple expenses at once using CSV file',
    icon: '💸',
    maxFileSize: 10,
    maxRecords: 1000,
    acceptedFormats: ['.csv'],
    templateFileName: 'expense_upload_template.csv',
    requiredFields: ['description', 'amount', 'category', 'date', 'paymentMethod'],
    optionalFields: ['vendor', 'receiptNumber', 'approvedBy', 'budgetCategory'],
    validationRules: [
      { field: 'amount', type: 'number', message: 'Amount must be a number' },
      { field: 'date', type: 'date', message: 'Invalid date format' }
    ],
    category: BulkUploadCategory.FINANCIAL
  },

  [BulkUploadType.BUDGET]: {
    type: BulkUploadType.BUDGET,
    displayName: 'Budget Bulk Upload',
    description: 'Upload multiple budgets at once using CSV file',
    icon: '📊',
    maxFileSize: 5,
    maxRecords: 200,
    acceptedFormats: ['.csv'],
    templateFileName: 'budget_upload_template.csv',
    requiredFields: ['category', 'allocatedAmount', 'period', 'department'],
    optionalFields: ['description', 'spentAmount', 'remainingAmount', 'approvedBy'],
    validationRules: [
      { field: 'allocatedAmount', type: 'number', message: 'Allocated amount must be a number' }
    ],
    category: BulkUploadCategory.FINANCIAL
  },

  [BulkUploadType.PAYMENT]: {
    type: BulkUploadType.PAYMENT,
    displayName: 'Payment Bulk Upload',
    description: 'Upload multiple payments at once using CSV file',
    icon: '💳',
    maxFileSize: 8,
    maxRecords: 500,
    acceptedFormats: ['.csv'],
    templateFileName: 'payment_upload_template.csv',
    requiredFields: ['amount', 'paymentDate', 'paymentMethod', 'paidBy', 'purpose'],
    optionalFields: ['transactionId', 'receiptNumber', 'notes', 'status'],
    validationRules: [
      { field: 'amount', type: 'number', message: 'Amount must be a number' },
      { field: 'paymentDate', type: 'date', message: 'Invalid payment date format' }
    ],
    category: BulkUploadCategory.FINANCIAL
  },

  [BulkUploadType.FINANCIAL_REPORT]: {
    type: BulkUploadType.FINANCIAL_REPORT,
    displayName: 'Financial Report Bulk Upload',
    description: 'Upload multiple financial reports at once using CSV file',
    icon: '📈',
    maxFileSize: 12,
    maxRecords: 100,
    acceptedFormats: ['.csv'],
    templateFileName: 'financial_report_upload_template.csv',
    requiredFields: ['title', 'reportType', 'period', 'filePath', 'preparedBy'],
    optionalFields: ['summary', 'approvedBy', 'publishDate', 'confidential'],
    validationRules: [
      { field: 'title', type: 'required', message: 'Report title is required' }
    ],
    category: BulkUploadCategory.FINANCIAL
  },

  [BulkUploadType.TAX_DETAIL]: {
    type: BulkUploadType.TAX_DETAIL,
    displayName: 'Tax Detail Bulk Upload',
    description: 'Upload multiple tax details at once using CSV file',
    icon: '🏛️',
    maxFileSize: 6,
    maxRecords: 200,
    acceptedFormats: ['.csv'],
    templateFileName: 'tax_detail_upload_template.csv',
    requiredFields: ['taxType', 'amount', 'period', 'dueDate', 'status'],
    optionalFields: ['paymentDate', 'penaltyAmount', 'filedBy', 'receiptNumber'],
    validationRules: [
      { field: 'amount', type: 'number', message: 'Tax amount must be a number' },
      { field: 'dueDate', type: 'date', message: 'Invalid due date format' }
    ],
    category: BulkUploadCategory.FINANCIAL
  },

  [BulkUploadType.AUDIT_DETAIL]: {
    type: BulkUploadType.AUDIT_DETAIL,
    displayName: 'Audit Detail Bulk Upload',
    description: 'Upload multiple audit details at once using CSV file',
    icon: '🔍',
    maxFileSize: 8,
    maxRecords: 150,
    acceptedFormats: ['.csv'],
    templateFileName: 'audit_detail_upload_template.csv',
    requiredFields: ['auditType', 'auditor', 'auditDate', 'findings', 'status'],
    optionalFields: ['recommendations', 'followUpDate', 'resolved', 'reportPath'],
    validationRules: [
      { field: 'auditDate', type: 'date', message: 'Invalid audit date format' }
    ],
    category: BulkUploadCategory.FINANCIAL
  },

  [BulkUploadType.INVOICE]: {
    type: BulkUploadType.INVOICE,
    displayName: 'Invoice Bulk Upload',
    description: 'Upload multiple invoices at once using CSV file',
    icon: '🧾',
    maxFileSize: 10,
    maxRecords: 500,
    acceptedFormats: ['.csv'],
    templateFileName: 'invoice_upload_template.csv',
    requiredFields: ['invoiceNumber', 'amount', 'issueDate', 'dueDate', 'vendor'],
    optionalFields: ['description', 'taxAmount', 'paidDate', 'status', 'poNumber'],
    validationRules: [
      { field: 'amount', type: 'number', message: 'Invoice amount must be a number' },
      { field: 'issueDate', type: 'date', message: 'Invalid issue date format' }
    ],
    category: BulkUploadCategory.FINANCIAL
  },

  [BulkUploadType.VENDOR_PAYMENT]: {
    type: BulkUploadType.VENDOR_PAYMENT,
    displayName: 'Vendor Payment Bulk Upload',
    description: 'Upload multiple vendor payments at once using CSV file',
    icon: '💰',
    maxFileSize: 7,
    maxRecords: 300,
    acceptedFormats: ['.csv'],
    templateFileName: 'vendor_payment_upload_template.csv',
    requiredFields: ['vendorName', 'amount', 'paymentDate', 'paymentMethod', 'invoiceNumber'],
    optionalFields: ['description', 'approvedBy', 'bankDetails', 'status'],
    validationRules: [
      { field: 'amount', type: 'number', message: 'Payment amount must be a number' },
      { field: 'paymentDate', type: 'date', message: 'Invalid payment date format' }
    ],
    category: BulkUploadCategory.FINANCIAL
  },

  [BulkUploadType.FUND]: {
    type: BulkUploadType.FUND,
    displayName: 'Fund Bulk Upload',
    description: 'Upload multiple funds at once using CSV file',
    icon: '🏦',
    maxFileSize: 5,
    maxRecords: 100,
    acceptedFormats: ['.csv'],
    templateFileName: 'fund_upload_template.csv',
    requiredFields: ['fundName', 'type', 'currentBalance', 'purpose'],
    optionalFields: ['targetAmount', 'interestRate', 'maturityDate', 'manager'],
    validationRules: [
      { field: 'currentBalance', type: 'number', message: 'Current balance must be a number' }
    ],
    category: BulkUploadCategory.FINANCIAL
  },

  [BulkUploadType.INVESTMENT]: {
    type: BulkUploadType.INVESTMENT,
    displayName: 'Investment Bulk Upload',
    description: 'Upload multiple investments at once using CSV file',
    icon: '📈',
    maxFileSize: 6,
    maxRecords: 150,
    acceptedFormats: ['.csv'],
    templateFileName: 'investment_upload_template.csv',
    requiredFields: ['investmentType', 'amount', 'investmentDate', 'expectedReturn'],
    optionalFields: ['maturityDate', 'riskLevel', 'portfolio', 'advisor'],
    validationRules: [
      { field: 'amount', type: 'number', message: 'Investment amount must be a number' },
      { field: 'investmentDate', type: 'date', message: 'Invalid investment date format' }
    ],
    category: BulkUploadCategory.FINANCIAL
  },

  [BulkUploadType.LOAN]: {
    type: BulkUploadType.LOAN,
    displayName: 'Loan Bulk Upload',
    description: 'Upload multiple loans at once using CSV file',
    icon: '🏦',
    maxFileSize: 4,
    maxRecords: 100,
    acceptedFormats: ['.csv'],
    templateFileName: 'loan_upload_template.csv',
    requiredFields: ['loanAmount', 'interestRate', 'tenure', 'purpose', 'borrower'],
    optionalFields: ['emiAmount', 'startDate', 'collateral', 'guarantor'],
    validationRules: [
      { field: 'loanAmount', type: 'number', message: 'Loan amount must be a number' },
      { field: 'interestRate', type: 'number', message: 'Interest rate must be a number' }
    ],
    category: BulkUploadCategory.FINANCIAL
  },

  [BulkUploadType.MEMBERSHIP_FEE]: {
    type: BulkUploadType.MEMBERSHIP_FEE,
    displayName: 'Membership Fee Bulk Upload',
    description: 'Upload multiple membership fees at once using CSV file',
    icon: '💳',
    maxFileSize: 8,
    maxRecords: 1000,
    acceptedFormats: ['.csv'],
    templateFileName: 'membership_fee_upload_template.csv',
    requiredFields: ['memberName', 'feeType', 'amount', 'dueDate'],
    optionalFields: ['paidDate', 'paymentMethod', 'lateFee', 'status'],
    validationRules: [
      { field: 'amount', type: 'number', message: 'Fee amount must be a number' },
      { field: 'dueDate', type: 'date', message: 'Invalid due date format' }
    ],
    category: BulkUploadCategory.FINANCIAL
  },

  [BulkUploadType.FINANCIAL_EVENT]: {
    type: BulkUploadType.FINANCIAL_EVENT,
    displayName: 'Financial Event Bulk Upload',
    description: 'Upload multiple financial events at once using CSV file',
    icon: '📊',
    maxFileSize: 3,
    maxRecords: 200,
    acceptedFormats: ['.csv'],
    templateFileName: 'financial_event_upload_template.csv',
    requiredFields: ['eventName', 'type', 'amount', 'date', 'impact'],
    optionalFields: ['description', 'category', 'approvedBy', 'reportRequired'],
    validationRules: [
      { field: 'amount', type: 'number', message: 'Event amount must be a number' },
      { field: 'date', type: 'date', message: 'Invalid event date format' }
    ],
    category: BulkUploadCategory.FINANCIAL
  },

  [BulkUploadType.FINANCIAL_ANNOUNCEMENT]: {
    type: BulkUploadType.FINANCIAL_ANNOUNCEMENT,
    displayName: 'Financial Announcement Bulk Upload',
    description: 'Upload multiple financial announcements at once using CSV file',
    icon: '📢',
    maxFileSize: 2,
    maxRecords: 100,
    acceptedFormats: ['.csv'],
    templateFileName: 'financial_announcement_upload_template.csv',
    requiredFields: ['title', 'content', 'publishDate', 'audience'],
    optionalFields: ['category', 'expiryDate', 'attachments', 'urgency'],
    validationRules: [
      { field: 'publishDate', type: 'date', message: 'Invalid publish date format' }
    ],
    category: BulkUploadCategory.FINANCIAL
  },

  [BulkUploadType.FINANCIAL_FEEDBACK]: {
    type: BulkUploadType.FINANCIAL_FEEDBACK,
    displayName: 'Financial Feedback Bulk Upload',
    description: 'Upload multiple financial feedback entries at once using CSV file',
    icon: '💬',
    maxFileSize: 2,
    maxRecords: 150,
    acceptedFormats: ['.csv'],
    templateFileName: 'financial_feedback_upload_template.csv',
    requiredFields: ['subject', 'content', 'submittedBy', 'category'],
    optionalFields: ['priority', 'status', 'assignedTo', 'responseDate'],
    validationRules: [
      { field: 'subject', type: 'required', message: 'Feedback subject is required' }
    ],
    category: BulkUploadCategory.FINANCIAL
  },

  [BulkUploadType.FINANCIAL_SUGGESTION]: {
    type: BulkUploadType.FINANCIAL_SUGGESTION,
    displayName: 'Financial Suggestion Bulk Upload',
    description: 'Upload multiple financial suggestions at once using CSV file',
    icon: '💡',
    maxFileSize: 2,
    maxRecords: 100,
    acceptedFormats: ['.csv'],
    templateFileName: 'financial_suggestion_upload_template.csv',
    requiredFields: ['title', 'description', 'submittedBy', 'expectedBenefit'],
    optionalFields: ['category', 'implementationCost', 'timeline', 'status'],
    validationRules: [
      { field: 'title', type: 'required', message: 'Suggestion title is required' }
    ],
    category: BulkUploadCategory.FINANCIAL
  },

  [BulkUploadType.TEMPLATE_DOWNLOAD]: {
    type: BulkUploadType.TEMPLATE_DOWNLOAD,
    displayName: 'Template Download',
    description: 'Download CSV templates for bulk upload functionality',
    icon: '📥',
    maxFileSize: 0,
    maxRecords: 0,
    acceptedFormats: [],
    templateFileName: 'all_templates.zip',
    requiredFields: [],
    optionalFields: [],
    validationRules: [],
    category: BulkUploadCategory.TEMPLATES
  }
};

// Helper functions
export const getBulkUploadsByCategory = (category: BulkUploadCategory): BulkUploadConfig[] => {
  return Object.values(BULK_UPLOAD_CONFIGS).filter(config => config.category === category);
};

export const getBulkUploadConfig = (type: BulkUploadType): BulkUploadConfig | undefined => {
  return BULK_UPLOAD_CONFIGS[type];
};

export const getAllBulkUploadTypes = (): BulkUploadType[] => {
  return Object.values(BulkUploadType);
};

export const getBulkUploadCategories = (): BulkUploadCategory[] => {
  return Object.values(BulkUploadCategory);
};