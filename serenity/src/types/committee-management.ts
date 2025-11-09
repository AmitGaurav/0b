// Society Profile Management Types and Interfaces

export enum CommitteeType {
  MANAGING_COMMITTEE = 'managing_committee',
  MAINTENANCE_COMMITTEE = 'maintenance_committee',
  SECURITY_COMMITTEE = 'security_committee',
  FINANCE_COMMITTEE = 'finance_committee',
  CULTURAL_COMMITTEE = 'cultural_committee',
  SPORTS_COMMITTEE = 'sports_committee',
  ENVIRONMENT_COMMITTEE = 'environment_committee',
  DISCIPLINARY_COMMITTEE = 'disciplinary_committee',
  PARKING_COMMITTEE = 'parking_committee',
  REDEVELOPMENT_COMMITTEE = 'redevelopment_committee'
}

export enum MemberRole {
  CHAIRPERSON = 'chairperson',
  VICE_CHAIRPERSON = 'vice_chairperson',
  SECRETARY = 'secretary',
  TREASURER = 'treasurer',
  JOINT_SECRETARY = 'joint_secretary',
  MEMBER = 'member',
  CONVENOR = 'convenor',
  CO_CONVENOR = 'co_convenor'
}

export enum CommitteeMemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  RESIGNED = 'resigned',
  SUSPENDED = 'suspended'
}

export interface CommitteeMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  flatNumber: string;
  role: MemberRole;
  status: CommitteeMemberStatus;
  appointmentDate: Date;
  terminationDate?: Date;
  profileImage?: string;
  bio?: string;
  experience?: string;
  specialization?: string[];
  isElected: boolean;
  tenure: number; // in months
  votesReceived?: number;
}

export interface Committee {
  id: string;
  name: string;
  type: CommitteeType;
  description: string;
  isActive: boolean;
  formationDate: Date;
  members: CommitteeMember[];
  maxMembers: number;
  minMembers: number;
  responsibilities: string[];
  meetingFrequency: string;
  nextElection?: Date;
  lastElection?: Date;
  budget?: number;
  achievements?: string[];
}

export interface SocietyProfile {
  id: string;
  societyName: string;
  registrationNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  establishedDate: Date;
  totalUnits: number;
  totalMembers: number;
  societyType: 'residential' | 'commercial' | 'mixed';
  committees: Committee[];
  amenities: string[];
  rules: string[];
  lastUpdated: Date;
  updatedBy: string;
}

export interface CommitteeStats {
  totalCommittees: number;
  activeCommittees: number;
  totalMembers: number;
  activeMembers: number;
  vacantPositions: number;
  upcomingElections: number;
}

// Default committee configurations
export const DEFAULT_COMMITTEES: Omit<Committee, 'id' | 'members' | 'formationDate'>[] = [
  {
    name: 'Managing Committee',
    type: CommitteeType.MANAGING_COMMITTEE,
    description: 'Overall management and administration of the society',
    isActive: true,
    maxMembers: 11,
    minMembers: 7,
    responsibilities: [
      'Society administration and governance',
      'Financial planning and budgeting',
      'Policy making and implementation',
      'Conflict resolution',
      'Vendor management'
    ],
    meetingFrequency: 'Monthly'
  },
  {
    name: 'Maintenance Committee',
    type: CommitteeType.MAINTENANCE_COMMITTEE,
    description: 'Oversee building maintenance and repair activities',
    isActive: true,
    maxMembers: 7,
    minMembers: 3,
    responsibilities: [
      'Regular building maintenance',
      'Repair and renovation oversight',
      'Vendor coordination for maintenance',
      'Quality control of maintenance work',
      'Emergency repairs management'
    ],
    meetingFrequency: 'Bi-weekly'
  },
  {
    name: 'Security Committee',
    type: CommitteeType.SECURITY_COMMITTEE,
    description: 'Ensure safety and security of residents and property',
    isActive: true,
    maxMembers: 5,
    minMembers: 3,
    responsibilities: [
      'Security personnel management',
      'CCTV and surveillance systems',
      'Access control and visitor management',
      'Emergency response planning',
      'Security policy implementation'
    ],
    meetingFrequency: 'Monthly'
  },
  {
    name: 'Finance Committee',
    type: CommitteeType.FINANCE_COMMITTEE,
    description: 'Financial oversight and accounting management',
    isActive: true,
    maxMembers: 5,
    minMembers: 3,
    responsibilities: [
      'Budget preparation and monitoring',
      'Financial audit oversight',
      'Investment decisions',
      'Cost optimization',
      'Financial reporting'
    ],
    meetingFrequency: 'Monthly'
  },
  {
    name: 'Cultural Committee',
    type: CommitteeType.CULTURAL_COMMITTEE,
    description: 'Organize cultural events and community activities',
    isActive: true,
    maxMembers: 9,
    minMembers: 5,
    responsibilities: [
      'Festival celebrations',
      'Cultural event organization',
      'Community engagement activities',
      'Entertainment programs',
      'Art and cultural promotion'
    ],
    meetingFrequency: 'Bi-monthly'
  },
  {
    name: 'Sports Committee',
    type: CommitteeType.SPORTS_COMMITTEE,
    description: 'Manage sports facilities and organize sporting activities',
    isActive: true,
    maxMembers: 7,
    minMembers: 3,
    responsibilities: [
      'Sports facility maintenance',
      'Tournament organization',
      'Equipment management',
      'Sports coaching coordination',
      'Inter-society competitions'
    ],
    meetingFrequency: 'Bi-monthly'
  },
  {
    name: 'Environment Committee',
    type: CommitteeType.ENVIRONMENT_COMMITTEE,
    description: 'Promote environmental sustainability and green initiatives',
    isActive: true,
    maxMembers: 7,
    minMembers: 3,
    responsibilities: [
      'Waste management oversight',
      'Recycling programs',
      'Green energy initiatives',
      'Garden and landscaping',
      'Environmental awareness campaigns'
    ],
    meetingFrequency: 'Monthly'
  }
];

// Committee configuration mapping
export const COMMITTEE_CONFIG = {
  [CommitteeType.MANAGING_COMMITTEE]: {
    label: 'Managing Committee',
    description: 'Overall society governance and administration',
    color: '#3498db',
    icon: 'FaUserTie',
    maxMembers: 11,
    minMembers: 7,
    requiredRoles: [MemberRole.CHAIRPERSON, MemberRole.SECRETARY, MemberRole.TREASURER]
  },
  [CommitteeType.MAINTENANCE_COMMITTEE]: {
    label: 'Maintenance Committee',
    description: 'Building maintenance and repairs',
    color: '#e67e22',
    icon: 'FaTools',
    maxMembers: 7,
    minMembers: 3,
    requiredRoles: [MemberRole.CONVENOR]
  },
  [CommitteeType.SECURITY_COMMITTEE]: {
    label: 'Security Committee',
    description: 'Safety and security oversight',
    color: '#e74c3c',
    icon: 'FaShieldAlt',
    maxMembers: 5,
    minMembers: 3,
    requiredRoles: [MemberRole.CONVENOR]
  },
  [CommitteeType.FINANCE_COMMITTEE]: {
    label: 'Finance Committee',
    description: 'Financial oversight and planning',
    color: '#f39c12',
    icon: 'FaDollarSign',
    maxMembers: 5,
    minMembers: 3,
    requiredRoles: [MemberRole.CONVENOR, MemberRole.TREASURER]
  },
  [CommitteeType.CULTURAL_COMMITTEE]: {
    label: 'Cultural Committee',
    description: 'Cultural events and activities',
    color: '#9b59b6',
    icon: 'FaTheaterMasks',
    maxMembers: 9,
    minMembers: 5,
    requiredRoles: [MemberRole.CONVENOR]
  },
  [CommitteeType.SPORTS_COMMITTEE]: {
    label: 'Sports Committee',
    description: 'Sports facilities and activities',
    color: '#1abc9c',
    icon: 'FaFutbol',
    maxMembers: 7,
    minMembers: 3,
    requiredRoles: [MemberRole.CONVENOR]
  },
  [CommitteeType.ENVIRONMENT_COMMITTEE]: {
    label: 'Environment Committee',
    description: 'Environmental initiatives',
    color: '#27ae60',
    icon: 'FaLeaf',
    maxMembers: 7,
    minMembers: 3,
    requiredRoles: [MemberRole.CONVENOR]
  },
  [CommitteeType.DISCIPLINARY_COMMITTEE]: {
    label: 'Disciplinary Committee',
    description: 'Disciplinary actions and dispute resolution',
    color: '#8e44ad',
    icon: 'FaGavel',
    maxMembers: 5,
    minMembers: 3,
    requiredRoles: [MemberRole.CHAIRPERSON]
  },
  [CommitteeType.PARKING_COMMITTEE]: {
    label: 'Parking Committee',
    description: 'Parking management and allocation',
    color: '#34495e',
    icon: 'FaParking',
    maxMembers: 5,
    minMembers: 3,
    requiredRoles: [MemberRole.CONVENOR]
  },
  [CommitteeType.REDEVELOPMENT_COMMITTEE]: {
    label: 'Redevelopment Committee',
    description: 'Society redevelopment planning',
    color: '#95a5a6',
    icon: 'FaBuilding',
    maxMembers: 9,
    minMembers: 5,
    requiredRoles: [MemberRole.CHAIRPERSON, MemberRole.CONVENOR]
  }
};

// Role configuration mapping
export const ROLE_CONFIG = {
  [MemberRole.CHAIRPERSON]: {
    label: 'Chairperson',
    description: 'Overall leadership and decision making',
    color: '#e74c3c',
    priority: 1,
    responsibilities: ['Leadership', 'Strategic decisions', 'External representation']
  },
  [MemberRole.VICE_CHAIRPERSON]: {
    label: 'Vice Chairperson',
    description: 'Assist chairperson and act as backup',
    color: '#e67e22',
    priority: 2,
    responsibilities: ['Support chairperson', 'Leadership backup', 'Special projects']
  },
  [MemberRole.SECRETARY]: {
    label: 'Secretary',
    description: 'Documentation and communication',
    color: '#3498db',
    priority: 3,
    responsibilities: ['Meeting minutes', 'Documentation', 'Communication']
  },
  [MemberRole.TREASURER]: {
    label: 'Treasurer',
    description: 'Financial management and reporting',
    color: '#f39c12',
    priority: 4,
    responsibilities: ['Financial oversight', 'Budget management', 'Financial reporting']
  },
  [MemberRole.JOINT_SECRETARY]: {
    label: 'Joint Secretary',
    description: 'Assist secretary in documentation',
    color: '#3498db',
    priority: 5,
    responsibilities: ['Support secretary', 'Documentation backup', 'Communication support']
  },
  [MemberRole.CONVENOR]: {
    label: 'Convenor',
    description: 'Committee coordination and management',
    color: '#1abc9c',
    priority: 6,
    responsibilities: ['Committee coordination', 'Activity planning', 'Member coordination']
  },
  [MemberRole.CO_CONVENOR]: {
    label: 'Co-Convenor',
    description: 'Assist convenor in coordination',
    color: '#16a085',
    priority: 7,
    responsibilities: ['Support convenor', 'Activity assistance', 'Coordination backup']
  },
  [MemberRole.MEMBER]: {
    label: 'Member',
    description: 'General committee participation',
    color: '#95a5a6',
    priority: 8,
    responsibilities: ['Committee participation', 'Task execution', 'Input and feedback']
  }
};

export const calculateCommitteeStats = (committees: Committee[]): CommitteeStats => {
  const totalCommittees = committees.length;
  const activeCommittees = committees.filter(c => c.isActive).length;
  const allMembers = committees.flatMap(c => c.members);
  const totalMembers = allMembers.length;
  const activeMembers = allMembers.filter(m => m.status === CommitteeMemberStatus.ACTIVE).length;
  
  const vacantPositions = committees.reduce((total, committee) => {
    const currentMembers = committee.members.filter(m => m.status === CommitteeMemberStatus.ACTIVE).length;
    return total + Math.max(0, committee.minMembers - currentMembers);
  }, 0);

  const upcomingElections = committees.filter(c => 
    c.nextElection && c.nextElection > new Date()
  ).length;

  return {
    totalCommittees,
    activeCommittees,
    totalMembers,
    activeMembers,
    vacantPositions,
    upcomingElections
  };
};