export interface EventAttendee {
  id: string;
  userId: string;
  userName: string;
  email: string;
  rsvpStatus: 'attending' | 'not-attending' | 'maybe' | 'pending';
  rsvpDate: Date;
  guestCount: number;
  comments?: string;
  checkedIn: boolean;
  checkedInAt?: Date;
}

export interface EventLocation {
  id: string;
  name: string;
  address: string;
  description?: string;
  capacity: number;
  amenities: string[];
  bookingFee?: number;
}

export interface EventRecurrence {
  type: 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number; // Every X days/weeks/months/years
  daysOfWeek?: number[]; // 0=Sunday, 1=Monday, etc.
  endDate?: Date;
  occurrences?: number; // Number of occurrences
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: 'cultural' | 'sports' | 'social' | 'educational' | 'maintenance' | 'meeting' | 'celebration' | 'other';
  type: 'community' | 'private' | 'committee' | 'society';
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled' | 'postponed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Date & Time
  startDate: Date;
  endDate: Date;
  isAllDay: boolean;
  timezone: string;
  recurrence: EventRecurrence;
  
  // Location
  location: EventLocation;
  isVirtual: boolean;
  meetingLink?: string;
  
  // Attendees & RSVP
  attendees: EventAttendee[];
  maxAttendees?: number;
  isRsvpRequired: boolean;
  rsvpDeadline?: Date;
  allowGuestRsvp: boolean;
  waitlistEnabled: boolean;
  
  // Organizer & Permissions
  organizer: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  isPublic: boolean;
  targetAudience: 'all' | 'owners' | 'tenants' | 'committee' | 'custom';
  requiredApproval: boolean;
  
  // Additional Details
  tags: string[];
  attachments: EventAttachment[];
  agenda?: string;
  requirements?: string[];
  cost?: {
    amount: number;
    currency: string;
    paymentDeadline?: Date;
    paymentInstructions?: string;
  };
  
  // Metadata
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  
  // Analytics
  viewCount: number;
  rsvpCount: {
    attending: number;
    notAttending: number;
    maybe: number;
    pending: number;
  };
  checkedInCount: number;
}

export interface EventAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface EventStats {
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  draftEvents: number;
  totalAttendees: number;
  averageAttendance: number;
  popularCategory: string;
  thisMonthEvents: number;
}

export interface CreateEventData {
  title: string;
  description: string;
  category: Event['category'];
  type: Event['type'];
  priority: Event['priority'];
  startDate: Date;
  endDate: Date;
  isAllDay: boolean;
  location: EventLocation;
  isVirtual: boolean;
  meetingLink?: string;
  maxAttendees?: number;
  isRsvpRequired: boolean;
  rsvpDeadline?: Date;
  allowGuestRsvp: boolean;
  waitlistEnabled: boolean;
  isPublic: boolean;
  targetAudience: Event['targetAudience'];
  requiredApproval: boolean;
  tags: string[];
  agenda?: string;
  requirements?: string[];
  cost?: Event['cost'];
  recurrence: EventRecurrence;
}

export type EventFilter = 'all' | 'upcoming' | 'past' | 'my-events' | 'attending' | 'draft';
export type EventSort = 'date-asc' | 'date-desc' | 'alphabetical' | 'popularity' | 'created-date';
export type EventView = 'list' | 'calendar' | 'card';