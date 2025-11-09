export enum VerificationStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  REJECTED = 'rejected'
}

export enum VerificationCategory {
  DOCUMENTATION = 'documentation',
  LEGAL_COMPLIANCE = 'legal_compliance',
  INFRASTRUCTURE = 'infrastructure',
  MANAGEMENT = 'management',
  FINANCIAL = 'financial',
  SAFETY_SECURITY = 'safety_security'
}

export enum VerificationPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface VerificationItem {
  id: string;
  title: string;
  description: string;
  category: VerificationCategory;
  priority: VerificationPriority;
  status: VerificationStatus;
  isRequired: boolean;
  verifiedBy?: string;
  verifiedDate?: Date;
  rejectionReason?: string;
  documents?: VerificationDocument[];
  notes?: string;
}

export interface VerificationDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: Date;
  isVerified: boolean;
}

export interface SocietyVerification {
  id: string;
  societyId: string;
  societyName: string;
  overallStatus: VerificationStatus;
  progress: number; // Percentage completed
  verificationItems: VerificationItem[];
  startDate: Date;
  targetCompletionDate: Date;
  completionDate?: Date;
  verifiedBy?: string;
  isActivated: boolean;
  activatedDate?: Date;
  activatedBy?: string;
}

export interface VerificationStats {
  totalItems: number;
  completedItems: number;
  pendingItems: number;
  inProgressItems: number;
  rejectedItems: number;
  completionPercentage: number;
}

// Verification categories configuration
export const VERIFICATION_CATEGORIES = {
  [VerificationCategory.DOCUMENTATION]: {
    label: 'Documentation',
    description: 'Essential documents and paperwork verification',
    color: '#3498db',
    icon: 'FaFileAlt'
  },
  [VerificationCategory.LEGAL_COMPLIANCE]: {
    label: 'Legal & Compliance',
    description: 'Legal requirements and regulatory compliance',
    color: '#8e44ad',
    icon: 'FaGavel'
  },
  [VerificationCategory.INFRASTRUCTURE]: {
    label: 'Infrastructure',
    description: 'Physical infrastructure and facility verification',
    color: '#e67e22',
    icon: 'FaBuilding'
  },
  [VerificationCategory.MANAGEMENT]: {
    label: 'Management',
    description: 'Management structure and personnel verification',
    color: '#1abc9c',
    icon: 'FaUsers'
  },
  [VerificationCategory.FINANCIAL]: {
    label: 'Financial',
    description: 'Financial setup and accounting verification',
    color: '#f39c12',
    icon: 'FaDollarSign'
  },
  [VerificationCategory.SAFETY_SECURITY]: {
    label: 'Safety & Security',
    description: 'Safety measures and security protocols',
    color: '#e74c3c',
    icon: 'FaShieldAlt'
  }
};

// Default verification checklist template
export const DEFAULT_VERIFICATION_ITEMS: Omit<VerificationItem, 'id' | 'status' | 'verifiedBy' | 'verifiedDate'>[] = [
  // Documentation
  {
    title: 'Society Registration Certificate',
    description: 'Valid society registration certificate from appropriate authority',
    category: VerificationCategory.DOCUMENTATION,
    priority: VerificationPriority.HIGH,
    isRequired: true
  },
  {
    title: 'Bylaws and Rules',
    description: 'Complete society bylaws and house rules documentation',
    category: VerificationCategory.DOCUMENTATION,
    priority: VerificationPriority.HIGH,
    isRequired: true
  },
  {
    title: 'Land Title Documents',
    description: 'Property ownership and title documents verification',
    category: VerificationCategory.DOCUMENTATION,
    priority: VerificationPriority.HIGH,
    isRequired: true
  },
  {
    title: 'Building Plan Approval',
    description: 'Approved building plans from municipal authority',
    category: VerificationCategory.DOCUMENTATION,
    priority: VerificationPriority.MEDIUM,
    isRequired: true
  },

  // Legal & Compliance
  {
    title: 'Legal Entity Verification',
    description: 'Verification of society as a legal entity',
    category: VerificationCategory.LEGAL_COMPLIANCE,
    priority: VerificationPriority.HIGH,
    isRequired: true
  },
  {
    title: 'Tax Compliance',
    description: 'Tax registration and compliance status verification',
    category: VerificationCategory.LEGAL_COMPLIANCE,
    priority: VerificationPriority.HIGH,
    isRequired: true
  },
  {
    title: 'Environmental Clearances',
    description: 'Required environmental clearances and NOCs',
    category: VerificationCategory.LEGAL_COMPLIANCE,
    priority: VerificationPriority.MEDIUM,
    isRequired: false
  },
  {
    title: 'Insurance Coverage',
    description: 'Adequate insurance coverage for society property',
    category: VerificationCategory.LEGAL_COMPLIANCE,
    priority: VerificationPriority.MEDIUM,
    isRequired: true
  },

  // Infrastructure
  {
    title: 'Building Structure Safety',
    description: 'Structural safety assessment and certification',
    category: VerificationCategory.INFRASTRUCTURE,
    priority: VerificationPriority.HIGH,
    isRequired: true
  },
  {
    title: 'Utility Connections',
    description: 'Water, electricity, and sewage connections verification',
    category: VerificationCategory.INFRASTRUCTURE,
    priority: VerificationPriority.HIGH,
    isRequired: true
  },
  {
    title: 'Common Area Facilities',
    description: 'Common areas and shared facilities inspection',
    category: VerificationCategory.INFRASTRUCTURE,
    priority: VerificationPriority.MEDIUM,
    isRequired: true
  },
  {
    title: 'Parking Arrangements',
    description: 'Adequate parking space allocation and marking',
    category: VerificationCategory.INFRASTRUCTURE,
    priority: VerificationPriority.MEDIUM,
    isRequired: false
  },

  // Management
  {
    title: 'Management Committee',
    description: 'Elected management committee with proper documentation',
    category: VerificationCategory.MANAGEMENT,
    priority: VerificationPriority.HIGH,
    isRequired: true
  },
  {
    title: 'Secretary Appointment',
    description: 'Appointed secretary with necessary qualifications',
    category: VerificationCategory.MANAGEMENT,
    priority: VerificationPriority.HIGH,
    isRequired: true
  },
  {
    title: 'Staff Verification',
    description: 'Background verification of essential staff members',
    category: VerificationCategory.MANAGEMENT,
    priority: VerificationPriority.MEDIUM,
    isRequired: true
  },
  {
    title: 'Maintenance Contracts',
    description: 'Service contracts for maintenance and upkeep',
    category: VerificationCategory.MANAGEMENT,
    priority: VerificationPriority.LOW,
    isRequired: false
  },

  // Financial
  {
    title: 'Bank Account Setup',
    description: 'Society bank account with proper signatories',
    category: VerificationCategory.FINANCIAL,
    priority: VerificationPriority.HIGH,
    isRequired: true
  },
  {
    title: 'Financial Audit',
    description: 'Initial financial audit and accounting setup',
    category: VerificationCategory.FINANCIAL,
    priority: VerificationPriority.HIGH,
    isRequired: true
  },
  {
    title: 'Maintenance Fund',
    description: 'Adequate corpus fund for maintenance activities',
    category: VerificationCategory.FINANCIAL,
    priority: VerificationPriority.MEDIUM,
    isRequired: true
  },
  {
    title: 'Budget Planning',
    description: 'Annual budget and financial planning documentation',
    category: VerificationCategory.FINANCIAL,
    priority: VerificationPriority.MEDIUM,
    isRequired: false
  },

  // Safety & Security
  {
    title: 'Fire Safety Systems',
    description: 'Fire safety equipment and emergency evacuation plans',
    category: VerificationCategory.SAFETY_SECURITY,
    priority: VerificationPriority.HIGH,
    isRequired: true
  },
  {
    title: 'Security Arrangements',
    description: 'Security personnel or systems installation',
    category: VerificationCategory.SAFETY_SECURITY,
    priority: VerificationPriority.HIGH,
    isRequired: true
  },
  {
    title: 'CCTV Surveillance',
    description: 'CCTV installation in common areas',
    category: VerificationCategory.SAFETY_SECURITY,
    priority: VerificationPriority.MEDIUM,
    isRequired: false
  },
  {
    title: 'Emergency Protocols',
    description: 'Emergency response protocols and contact systems',
    category: VerificationCategory.SAFETY_SECURITY,
    priority: VerificationPriority.MEDIUM,
    isRequired: true
  }
];

export const calculateVerificationStats = (items: VerificationItem[]): VerificationStats => {
  const totalItems = items.length;
  const completedItems = items.filter(item => item.status === VerificationStatus.COMPLETED).length;
  const pendingItems = items.filter(item => item.status === VerificationStatus.PENDING).length;
  const inProgressItems = items.filter(item => item.status === VerificationStatus.IN_PROGRESS).length;
  const rejectedItems = items.filter(item => item.status === VerificationStatus.REJECTED).length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return {
    totalItems,
    completedItems,
    pendingItems,
    inProgressItems,
    rejectedItems,
    completionPercentage
  };
};

export const canActivateSociety = (items: VerificationItem[]): boolean => {
  const requiredItems = items.filter(item => item.isRequired);
  const completedRequiredItems = requiredItems.filter(item => item.status === VerificationStatus.COMPLETED);
  return completedRequiredItems.length === requiredItems.length;
};