// Society Member Management Types and Interfaces

export enum MemberRegistrationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  UNDER_REVIEW = 'under_review',
  INCOMPLETE = 'incomplete'
}

export enum MemberVerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected',
  IN_PROGRESS = 'in_progress',
  EXPIRED = 'expired'
}

export enum MembershipType {
  OWNER = 'owner',
  TENANT = 'tenant',
  RELATIVE = 'relative',
  CARETAKER = 'caretaker',
  TEMPORARY = 'temporary'
}

export enum MemberRole {
  ADMIN = 'admin',
  COMMITTEE_MEMBER = 'committee_member',
  RESIDENT = 'resident',
  SECURITY_GUARD = 'security_guard',
  MAINTENANCE_STAFF = 'maintenance_staff',
  GUEST = 'guest'
}

export enum Permission {
  VIEW_ALL_MEMBERS = 'view_all_members',
  EDIT_ALL_MEMBERS = 'edit_all_members',
  APPROVE_REGISTRATIONS = 'approve_registrations',
  APPROVE_VERIFICATIONS = 'approve_verifications',
  MANAGE_DOCUMENTS = 'manage_documents',
  MANAGE_UNITS = 'manage_units',
  MANAGE_PARKING = 'manage_parking',
  ASSIGN_ROLES = 'assign_roles',
  VIEW_ACTIVITY_LOGS = 'view_activity_logs',
  MASS_UPLOAD = 'mass_upload',
  VIEW_OWN_DATA = 'view_own_data',
  EDIT_OWN_PROFILE = 'edit_own_profile',
  MANAGE_FAMILY_MEMBERS = 'manage_family_members',
  MANAGE_EMERGENCY_CONTACTS = 'manage_emergency_contacts',
  MANAGE_COMMUNICATION_PREFERENCES = 'manage_communication_preferences'
}

export enum CommunicationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  WHATSAPP = 'whatsapp',
  PHONE_CALL = 'phone_call',
  IN_APP_NOTIFICATION = 'in_app_notification',
  PHYSICAL_NOTICE = 'physical_notice'
}

export enum CommunicationType {
  MAINTENANCE_UPDATES = 'maintenance_updates',
  BILLING_NOTIFICATIONS = 'billing_notifications',
  EMERGENCY_ALERTS = 'emergency_alerts',
  SOCIETY_ANNOUNCEMENTS = 'society_announcements',
  EVENT_INVITATIONS = 'event_invitations',
  MEETING_REMINDERS = 'meeting_reminders',
  COMPLAINT_UPDATES = 'complaint_updates',
  SECURITY_ALERTS = 'security_alerts'
}

export enum DocumentType {
  IDENTITY_PROOF = 'identity_proof',
  ADDRESS_PROOF = 'address_proof',
  OWNERSHIP_PROOF = 'ownership_proof',
  RENTAL_AGREEMENT = 'rental_agreement',
  NOC_CERTIFICATE = 'noc_certificate',
  PHOTOGRAPH = 'photograph',
  POLICE_VERIFICATION = 'police_verification',
  INCOME_PROOF = 'income_proof'
}

export enum UnitType {
  RESIDENTIAL = 'residential',
  COMMERCIAL = 'commercial',
  OFFICE = 'office',
  RETAIL = 'retail',
  STORAGE = 'storage'
}

export enum ParkingType {
  COVERED = 'covered',
  OPEN = 'open',
  BASEMENT = 'basement',
  STILT = 'stilt',
  VISITOR = 'visitor'
}

export enum ActivityType {
  REGISTRATION = 'registration',
  VERIFICATION = 'verification',
  PROFILE_UPDATE = 'profile_update',
  DOCUMENT_UPLOAD = 'document_upload',
  UNIT_ASSIGNMENT = 'unit_assignment',
  PARKING_ASSIGNMENT = 'parking_assignment',
  ROLE_CHANGE = 'role_change',
  LOGIN = 'login',
  LOGOUT = 'logout',
  PASSWORD_CHANGE = 'password_change'
}

export interface MemberAddress {
  street: string;
  landmark?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: MemberAddress;
}

export interface CommunicationPreference {
  id: string;
  communicationType: CommunicationType;
  preferredChannels: CommunicationChannel[];
  isEnabled: boolean;
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
  timePreference?: {
    startTime: string; // HH:MM format
    endTime: string; // HH:MM format
  };
}

export interface MemberCommunicationSettings {
  memberId: string;
  preferences: CommunicationPreference[];
  globalOptOut: boolean;
  preferredLanguage: 'english' | 'hindi' | 'marathi' | 'gujarati' | 'tamil' | 'telugu';
  updatedDate: Date;
  updatedBy: string;
}

export interface MemberDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  uploadDate: Date;
  verificationStatus: MemberVerificationStatus;
  verifiedBy?: string;
  verificationDate?: Date;
  expiryDate?: Date;
  remarks?: string;
}

export interface MemberUnit {
  id: string;
  unitNumber: string;
  floor: number;
  building?: string;
  wing?: string;
  type: UnitType;
  area: number; // in sq ft
  bedrooms?: number;
  bathrooms?: number;
  isOwned: boolean;
  ownershipStartDate: Date;
  ownershipEndDate?: Date;
  monthlyMaintenance: number;
  remarks?: string;
}

export interface MemberParking {
  id: string;
  slotNumber: string;
  type: ParkingType;
  location: string;
  vehicleType: 'car' | 'bike' | 'bicycle' | 'other';
  vehicleNumber?: string;
  assignedDate: Date;
  monthlyCharge: number;
  isActive: boolean;
  remarks?: string;
}

export interface MemberActivityLog {
  id: string;
  memberId: string;
  activityType: ActivityType;
  description: string;
  timestamp: Date;
  performedBy: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

export interface SocietyMember {
  id: string;
  membershipId: string;
  
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  profileImage?: string;
  
  // Address Information
  currentAddress: MemberAddress;
  permanentAddress?: MemberAddress;
  
  // Society Information
  societyId: string;
  membershipType: MembershipType;
  registrationDate: Date;
  registrationStatus: MemberRegistrationStatus;
  verificationStatus: MemberVerificationStatus;
  
  // Family Information
  familyMembers?: {
    name: string;
    relationship: string;
    age?: number;
    phone?: string;
  }[];
  
  // Emergency Contacts
  emergencyContacts: EmergencyContact[];
  
  // Documents
  documents: MemberDocument[];
  
  // Units and Parking
  units: MemberUnit[];
  parking: MemberParking[];
  
  // Roles and Permissions
  roles: MemberRole[];
  permissions: Permission[];
  
  // Communication Settings
  communicationSettings?: MemberCommunicationSettings;
  
  // Status and Dates
  isActive: boolean;
  lastLoginDate?: Date;
  createdDate: Date;
  updatedDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
  
  // Additional Information
  occupation?: string;
  company?: string;
  remarks?: string;
  
  // Activity Log
  activityLogs?: MemberActivityLog[];
}

export interface MemberRegistrationForm {
  // Personal Details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  
  // Address
  currentAddress: MemberAddress;
  permanentAddress?: MemberAddress;
  sameAsCurrent: boolean;
  
  // Society Information
  membershipType: MembershipType;
  unitNumber: string;
  
  // Family Members
  familyMembers: {
    name: string;
    relationship: string;
    age?: number;
  }[];
  
  // Emergency Contacts
  emergencyContacts: EmergencyContact[];
  
  // Professional Information
  occupation?: string;
  company?: string;
  
  // Documents
  documents: {
    type: DocumentType;
    file: File;
  }[];
}

export interface MemberStats {
  totalMembers: number;
  activeMembers: number;
  pendingRegistrations: number;
  pendingVerifications: number;
  verifiedMembers: number;
  rejectedApplications: number;
  ownerMembers: number;
  tenantMembers: number;
  totalUnits: number;
  occupiedUnits: number;
  totalParkingSlots: number;
  occupiedParkingSlots: number;
}

export interface MemberFilter {
  searchTerm?: string;
  searchQuery?: string;
  registrationStatus?: MemberRegistrationStatus[];
  verificationStatus?: MemberVerificationStatus[];
  membershipType?: MembershipType[];
  roles?: MemberRole[];
  isActive?: boolean;
  relationship?: string;
  communicationChannel?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

// Role-based access control configuration
export const ROLE_PERMISSIONS: Record<MemberRole, Permission[]> = {
  [MemberRole.ADMIN]: [
    Permission.VIEW_ALL_MEMBERS,
    Permission.EDIT_ALL_MEMBERS,
    Permission.APPROVE_REGISTRATIONS,
    Permission.APPROVE_VERIFICATIONS,
    Permission.MANAGE_DOCUMENTS,
    Permission.MANAGE_UNITS,
    Permission.MANAGE_PARKING,
    Permission.ASSIGN_ROLES,
    Permission.VIEW_ACTIVITY_LOGS,
    Permission.MASS_UPLOAD,
    Permission.MANAGE_FAMILY_MEMBERS,
    Permission.MANAGE_EMERGENCY_CONTACTS,
    Permission.MANAGE_COMMUNICATION_PREFERENCES,
    Permission.VIEW_OWN_DATA,
    Permission.EDIT_OWN_PROFILE
  ],
  [MemberRole.COMMITTEE_MEMBER]: [
    Permission.VIEW_ALL_MEMBERS,
    Permission.APPROVE_REGISTRATIONS,
    Permission.APPROVE_VERIFICATIONS,
    Permission.VIEW_ACTIVITY_LOGS,
    Permission.MANAGE_EMERGENCY_CONTACTS,
    Permission.MANAGE_COMMUNICATION_PREFERENCES,
    Permission.VIEW_OWN_DATA,
    Permission.EDIT_OWN_PROFILE
  ],
  [MemberRole.RESIDENT]: [
    Permission.MANAGE_FAMILY_MEMBERS,
    Permission.MANAGE_EMERGENCY_CONTACTS,
    Permission.MANAGE_COMMUNICATION_PREFERENCES,
    Permission.VIEW_OWN_DATA,
    Permission.EDIT_OWN_PROFILE
  ],
  [MemberRole.SECURITY_GUARD]: [
    Permission.VIEW_ALL_MEMBERS,
    Permission.VIEW_OWN_DATA
  ],
  [MemberRole.MAINTENANCE_STAFF]: [
    Permission.VIEW_ALL_MEMBERS,
    Permission.VIEW_OWN_DATA
  ],
  [MemberRole.GUEST]: [
    Permission.MANAGE_COMMUNICATION_PREFERENCES,
    Permission.VIEW_OWN_DATA
  ]
};

// Document configuration
export const DOCUMENT_CONFIG = {
  [DocumentType.IDENTITY_PROOF]: {
    label: 'Identity Proof',
    description: 'Aadhaar Card, Passport, Voter ID, Driving License',
    required: true,
    acceptedFormats: ['jpg', 'jpeg', 'png', 'pdf'],
    maxSize: 2 // MB
  },
  [DocumentType.ADDRESS_PROOF]: {
    label: 'Address Proof',
    description: 'Aadhaar Card, Utility Bill, Bank Statement',
    required: true,
    acceptedFormats: ['jpg', 'jpeg', 'png', 'pdf'],
    maxSize: 2
  },
  [DocumentType.OWNERSHIP_PROOF]: {
    label: 'Ownership Proof',
    description: 'Sale Deed, Property Papers, Allotment Letter',
    required: false,
    acceptedFormats: ['jpg', 'jpeg', 'png', 'pdf'],
    maxSize: 5
  },
  [DocumentType.RENTAL_AGREEMENT]: {
    label: 'Rental Agreement',
    description: 'Registered rental agreement for tenants',
    required: false,
    acceptedFormats: ['jpg', 'jpeg', 'png', 'pdf'],
    maxSize: 5
  },
  [DocumentType.NOC_CERTIFICATE]: {
    label: 'NOC Certificate',
    description: 'No Objection Certificate from owner',
    required: false,
    acceptedFormats: ['jpg', 'jpeg', 'png', 'pdf'],
    maxSize: 2
  },
  [DocumentType.PHOTOGRAPH]: {
    label: 'Photograph',
    description: 'Recent passport size photograph',
    required: true,
    acceptedFormats: ['jpg', 'jpeg', 'png'],
    maxSize: 1
  },
  [DocumentType.POLICE_VERIFICATION]: {
    label: 'Police Verification',
    description: 'Police verification certificate',
    required: false,
    acceptedFormats: ['jpg', 'jpeg', 'png', 'pdf'],
    maxSize: 2
  },
  [DocumentType.INCOME_PROOF]: {
    label: 'Income Proof',
    description: 'Salary slip, ITR, Bank Statement',
    required: false,
    acceptedFormats: ['jpg', 'jpeg', 'png', 'pdf'],
    maxSize: 3
  }
};

// Utility functions
export const hasPermission = (userRoles: MemberRole[], requiredPermission: Permission): boolean => {
  return userRoles.some(role => ROLE_PERMISSIONS[role]?.includes(requiredPermission));
};

export const getMemberPermissions = (roles: MemberRole[]): Permission[] => {
  const permissions = new Set<Permission>();
  roles.forEach(role => {
    ROLE_PERMISSIONS[role]?.forEach(permission => permissions.add(permission));
  });
  return Array.from(permissions);
};

export const calculateMemberStats = (members: SocietyMember[]): MemberStats => {
  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.isActive).length;
  const pendingRegistrations = members.filter(m => m.registrationStatus === MemberRegistrationStatus.PENDING).length;
  const pendingVerifications = members.filter(m => m.verificationStatus === MemberVerificationStatus.PENDING).length;
  const verifiedMembers = members.filter(m => m.verificationStatus === MemberVerificationStatus.VERIFIED).length;
  const rejectedApplications = members.filter(m => 
    m.registrationStatus === MemberRegistrationStatus.REJECTED || 
    m.verificationStatus === MemberVerificationStatus.REJECTED
  ).length;
  const ownerMembers = members.filter(m => m.membershipType === MembershipType.OWNER).length;
  const tenantMembers = members.filter(m => m.membershipType === MembershipType.TENANT).length;
  
  const allUnits = members.flatMap(m => m.units);
  const totalUnits = allUnits.length;
  const occupiedUnits = allUnits.filter(u => u.isOwned).length;
  
  const allParkingSlots = members.flatMap(m => m.parking);
  const totalParkingSlots = allParkingSlots.length;
  const occupiedParkingSlots = allParkingSlots.filter(p => p.isActive).length;
  
  return {
    totalMembers,
    activeMembers,
    pendingRegistrations,
    pendingVerifications,
    verifiedMembers,
    rejectedApplications,
    ownerMembers,
    tenantMembers,
    totalUnits,
    occupiedUnits,
    totalParkingSlots,
    occupiedParkingSlots
  };
};

export const filterMembers = (members: SocietyMember[], filter: MemberFilter): SocietyMember[] => {
  return members.filter(member => {
    // Search term filter
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      const memberName = `${member.firstName} ${member.lastName}`.toLowerCase();
      const membershipId = member.membershipId.toLowerCase();
      const email = member.email.toLowerCase();
      
      if (!memberName.includes(searchLower) && 
          !membershipId.includes(searchLower) && 
          !email.includes(searchLower)) {
        return false;
      }
    }
    
    // Registration status filter
    if (filter.registrationStatus && filter.registrationStatus.length > 0) {
      if (!filter.registrationStatus.includes(member.registrationStatus)) {
        return false;
      }
    }
    
    // Verification status filter
    if (filter.verificationStatus && filter.verificationStatus.length > 0) {
      if (!filter.verificationStatus.includes(member.verificationStatus)) {
        return false;
      }
    }
    
    // Membership type filter
    if (filter.membershipType && filter.membershipType.length > 0) {
      if (!filter.membershipType.includes(member.membershipType)) {
        return false;
      }
    }
    
    // Roles filter
    if (filter.roles && filter.roles.length > 0) {
      const hasRole = filter.roles.some(role => member.roles.includes(role));
      if (!hasRole) {
        return false;
      }
    }
    
    // Active status filter
    if (filter.isActive !== undefined) {
      if (member.isActive !== filter.isActive) {
        return false;
      }
    }
    
    // Date range filter
    if (filter.dateRange) {
      const memberDate = new Date(member.registrationDate);
      if (memberDate < filter.dateRange.startDate || memberDate > filter.dateRange.endDate) {
        return false;
      }
    }
    
    return true;
  });
};

// Default member data for testing
export const DEFAULT_MEMBER: Omit<SocietyMember, 'id' | 'membershipId' | 'createdDate' | 'updatedDate'> = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  societyId: '',
  membershipType: MembershipType.OWNER,
  registrationDate: new Date(),
  registrationStatus: MemberRegistrationStatus.PENDING,
  verificationStatus: MemberVerificationStatus.PENDING,
  currentAddress: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  },
  emergencyContacts: [],
  documents: [],
  units: [],
  parking: [],
  roles: [MemberRole.RESIDENT],
  permissions: [Permission.VIEW_OWN_DATA, Permission.EDIT_OWN_PROFILE],
  isActive: true
};