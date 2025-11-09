export interface EmergencyContact {
  id: string;
  name: string;
  designation: string;
  department: ContactDepartment;
  category: ContactCategory;
  phone: string;
  alternatePhone?: string;
  email?: string;
  availability: Availability;
  isEmergency: boolean;
  priority: ContactPriority;
  societyId?: string; // For multi-tenant support
  description?: string;
  location?: string;
  languages?: string[];
}

export enum ContactDepartment {
  SECURITY = 'SECURITY',
  MAINTENANCE = 'MAINTENANCE',
  MEDICAL = 'MEDICAL',
  ADMINISTRATION = 'ADMINISTRATION',
  COMMITTEE = 'COMMITTEE',
  UTILITIES = 'UTILITIES',
  CLEANING = 'CLEANING',
  PARKING = 'PARKING',
  LEGAL = 'LEGAL',
  FINANCE = 'FINANCE',
  EXTERNAL = 'EXTERNAL'
}

export enum ContactCategory {
  // Security
  CHIEF_SECURITY = 'CHIEF_SECURITY',
  NIGHT_SECURITY = 'NIGHT_SECURITY',
  DAY_SECURITY = 'DAY_SECURITY',
  CCTV_MONITORING = 'CCTV_MONITORING',
  
  // Maintenance
  CHIEF_MAINTENANCE = 'CHIEF_MAINTENANCE',
  PLUMBER = 'PLUMBER',
  ELECTRICIAN = 'ELECTRICIAN',
  CARPENTER = 'CARPENTER',
  PAINTER = 'PAINTER',
  AC_TECHNICIAN = 'AC_TECHNICIAN',
  LIFT_TECHNICIAN = 'LIFT_TECHNICIAN',
  GENERATOR_OPERATOR = 'GENERATOR_OPERATOR',
  PEST_CONTROL = 'PEST_CONTROL',
  
  // Medical & Emergency
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  AMBULANCE = 'AMBULANCE',
  FIRE_BRIGADE = 'FIRE_BRIGADE',
  POLICE = 'POLICE',
  HOSPITAL = 'HOSPITAL',
  
  // Administration
  SOCIETY_MANAGER = 'SOCIETY_MANAGER',
  ASSISTANT_MANAGER = 'ASSISTANT_MANAGER',
  ACCOUNTANT = 'ACCOUNTANT',
  RECEPTIONIST = 'RECEPTIONIST',
  
  // Committee
  CHAIRMAN = 'CHAIRMAN',
  SECRETARY = 'SECRETARY',
  TREASURER = 'TREASURER',
  COMMITTEE_MEMBER = 'COMMITTEE_MEMBER',
  
  // Utilities
  WATER_SUPPLY = 'WATER_SUPPLY',
  ELECTRICITY_BOARD = 'ELECTRICITY_BOARD',
  GAS_AGENCY = 'GAS_AGENCY',
  INTERNET_SERVICE = 'INTERNET_SERVICE',
  DTH_SERVICE = 'DTH_SERVICE',
  
  // Services
  HOUSEKEEPING_HEAD = 'HOUSEKEEPING_HEAD',
  GARBAGE_COLLECTION = 'GARBAGE_COLLECTION',
  PARKING_ATTENDANT = 'PARKING_ATTENDANT',
  GARDENER = 'GARDENER',
  
  // Legal & Finance
  LEGAL_ADVISOR = 'LEGAL_ADVISOR',
  INSURANCE_AGENT = 'INSURANCE_AGENT',
  BANK_MANAGER = 'BANK_MANAGER',
  
  // Vendors
  GROCERY_VENDOR = 'GROCERY_VENDOR',
  MILK_VENDOR = 'MILK_VENDOR',
  NEWSPAPER_VENDOR = 'NEWSPAPER_VENDOR',
  COURIER_SERVICE = 'COURIER_SERVICE',
  CAB_SERVICE = 'CAB_SERVICE'
}

export enum ContactPriority {
  CRITICAL = 'CRITICAL',    // Life-threatening emergencies
  HIGH = 'HIGH',           // Urgent but not life-threatening
  MEDIUM = 'MEDIUM',       // Important services
  LOW = 'LOW'             // General inquiries
}

export enum Availability {
  FULL_TIME = 'FULL_TIME',        // 24/7
  BUSINESS_HOURS = 'BUSINESS_HOURS', // 9 AM - 6 PM
  DAY_SHIFT = 'DAY_SHIFT',        // 6 AM - 6 PM
  NIGHT_SHIFT = 'NIGHT_SHIFT',    // 6 PM - 6 AM
  ON_CALL = 'ON_CALL',           // Available on call
  EMERGENCY_ONLY = 'EMERGENCY_ONLY' // Only during emergencies
}

export interface ContactFilter {
  department?: ContactDepartment;
  category?: ContactCategory;
  priority?: ContactPriority;
  availability?: Availability;
  isEmergency?: boolean;
  searchTerm?: string;
}

export interface QuickAction {
  type: 'CALL' | 'SMS' | 'EMAIL' | 'WHATSAPP';
  label: string;
  value: string;
  icon: string;
}

// Emergency protocols and instructions
export interface EmergencyProtocol {
  id: string;
  title: string;
  category: ContactCategory;
  steps: string[];
  importantContacts: string[]; // Contact IDs
  priority: ContactPriority;
}

// Help center statistics
export interface HelpCenterStats {
  totalContacts: number;
  emergencyContacts: number;
  availableNow: number;
  departmentCount: Record<ContactDepartment, number>;
}