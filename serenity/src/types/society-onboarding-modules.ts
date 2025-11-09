// Society Onboarding Module Types and Interfaces

export enum OnboardingUserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}

export enum OnboardingPermission {
  VIEW = 'view',
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
  APPROVE = 'approve',
  REJECT = 'reject',
  MANAGE = 'manage',
  ADD = 'add'
}

export enum SocietyOnboardingModuleType {
  SOCIETY_REGISTRATION = 'society-registration',
  SOCIETY_VERIFICATION = 'society-verification',
  SOCIETY_PROFILE_MANAGEMENT = 'society-profile-management',
  SOCIETY_AMENITIES = 'society-amenities',
  SOCIETY_PARKING = 'society-parking',
  SOCIETY_UNITS = 'society-units',
  SOCIETY_MEMBERS = 'society-members',
  SOCIETY_SETTINGS = 'society-settings',
  BULK_UPLOAD = 'bulk-upload'
}

export enum OnboardingModuleCategory {
  SETUP = 'setup',
  MANAGEMENT = 'management',
  CONFIGURATION = 'configuration'
}

export interface SocietyOnboardingModule {
  id: SocietyOnboardingModuleType;
  title: string;
  description: string;
  icon: string;
  route: string;
  category: OnboardingModuleCategory;
  color: string;
  isActive: boolean;
  permissions: {
    [key in OnboardingUserRole]: OnboardingPermission[];
  };
}

// Permission check utility functions
export function canAccessOnboardingModule(
  userRole: OnboardingUserRole,
  module: SocietyOnboardingModule
): boolean {
  const userPermissions = module.permissions[userRole];
  return userPermissions && userPermissions.length > 0;
}

export function hasOnboardingPermission(
  userRole: OnboardingUserRole,
  module: SocietyOnboardingModule,
  permission: OnboardingPermission
): boolean {
  const userPermissions = module.permissions[userRole];
  return userPermissions ? userPermissions.includes(permission) : false;
}

// Society Onboarding specific interfaces
export interface SocietyRegistration {
  id: string;
  societyName: string;
  registrationNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  establishedDate: Date;
  totalUnits: number;
  societyType: 'residential' | 'commercial' | 'mixed';
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  registrationDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
  rejectionReason?: string;
  documents: Array<{
    name: string;
    type: string;
    url: string;
    uploadDate: Date;
  }>;
}

export interface SocietyVerification {
  id: string;
  societyId: string;
  verificationType: 'document' | 'physical' | 'legal' | 'financial';
  verificationStatus: 'pending' | 'in_progress' | 'verified' | 'rejected';
  verificationDate: Date;
  verifiedBy?: string;
  verificationNotes: string;
  requiredDocuments: string[];
  submittedDocuments: Array<{
    documentType: string;
    documentUrl: string;
    submissionDate: Date;
    verificationStatus: 'pending' | 'approved' | 'rejected';
  }>;
  verificationScore: number;
  nextReviewDate?: Date;
}

export interface SocietyProfile {
  id: string;
  societyId: string;
  societyName: string;
  description: string;
  logo?: string;
  bannerImage?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
    fax?: string;
  };
  management: {
    managementType: 'self' | 'professional' | 'committee';
    managementCompany?: string;
    chairperson: string;
    secretary: string;
    treasurer: string;
  };
  facilities: string[];
  amenities: string[];
  rules: string[];
  emergencyContacts: Array<{
    name: string;
    designation: string;
    phone: string;
    email: string;
  }>;
  lastUpdated: Date;
}

export interface SocietyAmenity {
  id: string;
  societyId: string;
  name: string;
  description: string;
  category: 'recreational' | 'fitness' | 'utility' | 'safety' | 'convenience';
  location: string;
  capacity?: number;
  operatingHours: {
    start: string;
    end: string;
    days: string[];
  };
  bookingRequired: boolean;
  charges?: number;
  maintenanceSchedule: string;
  status: 'active' | 'inactive' | 'under_maintenance';
  images: string[];
  rules: string[];
  addedDate: Date;
  lastUpdated: Date;
}

export interface SocietyParking {
  id: string;
  societyId: string;
  slotNumber: string;
  slotType: 'covered' | 'open' | 'premium' | 'visitor' | 'disabled';
  location: string;
  floor?: string;
  block?: string;
  dimensions: {
    length: number;
    width: number;
  };
  isAssigned: boolean;
  assignedTo?: {
    unitId: string;
    ownerName: string;
    vehicleNumber: string;
    vehicleType: 'car' | 'bike' | 'suv' | 'other';
  };
  monthlyCharges: number;
  securityDeposit: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  addedDate: Date;
  lastUpdated: Date;
}

export interface SocietyUnit {
  id: string;
  societyId: string;
  unitNumber: string;
  floor: number;
  block?: string;
  wing?: string;
  unitType: '1BHK' | '2BHK' | '3BHK' | '4BHK' | 'penthouse' | 'duplex' | 'commercial';
  carpetArea: number;
  builtUpArea: number;
  balconies: number;
  bathrooms: number;
  bedrooms: number;
  facing: 'north' | 'south' | 'east' | 'west' | 'northeast' | 'northwest' | 'southeast' | 'southwest';
  isOccupied: boolean;
  owner?: {
    name: string;
    phone: string;
    email: string;
    occupation: string;
    familySize: number;
  };
  tenant?: {
    name: string;
    phone: string;
    email: string;
    occupation: string;
    familySize: number;
    leaseStart: Date;
    leaseEnd: Date;
  };
  maintenanceCharges: number;
  corpusFund: number;
  specialAssessments: number;
  status: 'owned' | 'rented' | 'vacant' | 'under_construction';
  addedDate: Date;
  lastUpdated: Date;
}

export interface SocietyMember {
  id: string;
  societyId: string;
  unitId: string;
  memberType: 'owner' | 'tenant' | 'family_member' | 'authorized_person';
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: 'male' | 'female' | 'other';
    bloodGroup: string;
    occupation: string;
    workAddress?: string;
  };
  contact: {
    phone: string;
    email: string;
    emergencyContact: string;
    alternatePhone?: string;
  };
  address: {
    permanent: string;
    current: string;
  };
  documents: Array<{
    type: 'aadhar' | 'pan' | 'passport' | 'driving_license' | 'voter_id' | 'police_verification';
    number: string;
    imageUrl: string;
    expiryDate?: Date;
    verified: boolean;
  }>;
  familyMembers: Array<{
    name: string;
    relationship: string;
    age: number;
    occupation?: string;
  }>;
  vehicles: Array<{
    type: 'car' | 'bike' | 'scooter' | 'cycle' | 'other';
    make: string;
    model: string;
    number: string;
    color: string;
    parkingSlotId?: string;
  }>;
  pets: Array<{
    type: string;
    breed: string;
    name: string;
    age: number;
    vaccinated: boolean;
  }>;
  joinedDate: Date;
  status: 'active' | 'inactive' | 'moved_out';
  lastUpdated: Date;
}

export interface SocietySettings {
  id: string;
  societyId: string;
  general: {
    societyName: string;
    tagline?: string;
    timeZone: string;
    currency: string;
    language: string;
    dateFormat: string;
  };
  maintenance: {
    chargesPerSqFt: number;
    dueDate: number; // day of month
    lateFeePercentage: number;
    gracePeriodDays: number;
    penalties: Array<{
      type: string;
      amount: number;
      description: string;
    }>;
  };
  security: {
    visitorRegistration: boolean;
    guestPolicyHours: number;
    securityGuardCount: number;
    cctvEnabled: boolean;
    accessCardRequired: boolean;
    emergencyProtocols: string[];
  };
  amenities: {
    bookingAdvanceDays: number;
    bookingSlotDuration: number; // in minutes
    cancellationHours: number;
    maxBookingsPerMonth: number;
    bookingCharges: boolean;
  };
  communication: {
    announcementApproval: boolean;
    complaintResolutionDays: number;
    feedbackEnabled: boolean;
    votingEnabled: boolean;
    meetingMinimumNotice: number; // days
  };
  parking: {
    visitorParkingSlots: number;
    visitorParkingHours: number;
    parkingFines: number;
    twoWheelerCharges: number;
    fourWheelerCharges: number;
  };
  financial: {
    budgetApprovalRequired: boolean;
    expenseApprovalLimit: number;
    auditFrequency: 'monthly' | 'quarterly' | 'yearly';
    financialYearStart: number; // month (1-12)
  };
  notifications: {
    smsEnabled: boolean;
    emailEnabled: boolean;
    pushEnabled: boolean;
    whatsappEnabled: boolean;
  };
  lastUpdated: Date;
  updatedBy: string;
}