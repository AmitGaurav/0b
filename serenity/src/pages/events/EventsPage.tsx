import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { 
  FiCalendar, 
  FiPlus, 
  FiFilter, 
  FiSearch, 
  FiMapPin, 
  FiUsers, 
  FiClock, 
  FiAlertCircle,
  FiEdit,
  FiTrash2,
  FiEye,
  FiShare2,
  FiDownload,
  FiTag,
  FiVideo,
  FiDollarSign,
  FiCheckSquare,
  FiX,
  FiList,
  FiGrid,
  FiTrendingUp,
  FiStar,
  FiCopy
} from 'react-icons/fi';
import { Event, EventFilter, EventSort, EventView, EventStats, CreateEventData } from '../../types/events';
import CreateEventForm from './CreateEventForm';

// Styled Components
const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 700;
`;

const ViewToggle = styled.div`
  display: flex;
  background: #f8f9fa;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #e0e6ed;
`;

const ViewButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.$active ? '#3498db' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#7f8c8d'};
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$active ? '#2980b9' : '#e9ecef'};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  border: 1px solid #e0e6ed;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: ${props => props.$color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color};
  font-size: 1.25rem;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-size: 0.875rem;
`;

const ControlsBar = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  border: 1px solid #e0e6ed;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e0e6ed;
  border-radius: 6px;
  background: #f8f9fa;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    background: white;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #e0e6ed;
  border-radius: 6px;
  background: white;
  font-size: 0.875rem;
  color: #2c3e50;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #2980b9;
    transform: translateY(-1px);
  }
`;

const EventsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const EventCard = styled.div<{ $isPast?: boolean }>`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  border: 1px solid #e0e6ed;
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${props => props.$isPast ? 0.7 : 1};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const EventHeader = styled.div<{ $category: Event['category'] }>`
  background: ${props => {
    switch (props.$category) {
      case 'cultural': return 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)';
      case 'sports': return 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
      case 'social': return 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)';
      case 'educational': return 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)';
      case 'maintenance': return 'linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)';
      case 'meeting': return 'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)';
      case 'celebration': return 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)';
      default: return 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)';
    }
  }};
  color: white;
  padding: 1.5rem;
`;

const EventDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  opacity: 0.9;
`;

const EventTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.3;
`;

const EventMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.875rem;
  opacity: 0.9;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const EventContent = styled.div`
  padding: 1.5rem;
`;

const EventDescription = styled.p`
  margin: 0 0 1rem 0;
  color: #7f8c8d;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const EventDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

const DetailIcon = styled.div<{ $color: string }>`
  color: ${props => props.$color};
  display: flex;
  align-items: center;
`;

const DetailText = styled.div`
  color: #2c3e50;
`;

const EventTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  padding: 0.25rem 0.5rem;
  background: #ecf0f1;
  color: #2c3e50;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const StatusBadge = styled.span<{ $status: Event['status'] }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    switch (props.$status) {
      case 'published':
        return '#27ae60';
      case 'ongoing':
        return '#f39c12';
      case 'completed':
        return '#95a5a6';
      case 'cancelled':
        return '#e74c3c';
      case 'postponed':
        return '#e67e22';
      case 'draft':
        return '#3498db';
      default:
        return '#95a5a6';
    }
  }};
  color: white;
`;

const PriorityBadge = styled.span<{ $priority: Event['priority'] }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.$priority) {
      case 'urgent':
        return '#e74c3c20';
      case 'high':
        return '#e67e2220';
      case 'medium':
        return '#f39c1220';
      case 'low':
        return '#95a5a620';
      default:
        return '#95a5a620';
    }
  }};
  color: ${props => {
    switch (props.$priority) {
      case 'urgent':
        return '#e74c3c';
      case 'high':
        return '#e67e22';
      case 'medium':
        return '#f39c12';
      case 'low':
        return '#95a5a6';
      default:
        return '#95a5a6';
    }
  }};
`;

const RSVPSection = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
`;

const RSVPHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const RSVPTitle = styled.div`
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.875rem;
`;

const RSVPStats = styled.div`
  font-size: 0.75rem;
  color: #7f8c8d;
`;

const RSVPButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const RSVPButton = styled.button<{ $variant: 'attending' | 'maybe' | 'not-attending'; $active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid;
  
  ${props => {
    const colors = {
      attending: { bg: '#27ae60', text: 'white' },
      maybe: { bg: '#f39c12', text: 'white' },
      'not-attending': { bg: '#e74c3c', text: 'white' }
    };
    
    const color = colors[props.$variant];
    
    if (props.$active) {
      return `
        background: ${color.bg};
        border-color: ${color.bg};
        color: ${color.text};
      `;
    }
    
    return `
      background: transparent;
      border-color: ${color.bg}50;
      color: ${color.bg};
      
      &:hover {
        background: ${color.bg}10;
        border-color: ${color.bg};
      }
    `;
  }}
`;

const EventActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e6ed;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border: 1px solid;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: #3498db;
          border-color: #3498db;
          color: white;
          &:hover {
            background: #2980b9;
            border-color: #2980b9;
          }
        `;
      case 'danger':
        return `
          background: transparent;
          border-color: #e74c3c;
          color: #e74c3c;
          &:hover {
            background: #e74c3c;
            color: white;
          }
        `;
      default:
        return `
          background: transparent;
          border-color: #bdc3c7;
          color: #7f8c8d;
          &:hover {
            background: #f8f9fa;
            border-color: #95a5a6;
          }
        `;
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #7f8c8d;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  color: #bdc3c7;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
`;

const EmptyDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
`;

// Mock Data
const mockEventStats: EventStats = {
  totalEvents: 42,
  upcomingEvents: 8,
  pastEvents: 32,
  draftEvents: 2,
  totalAttendees: 1248,
  averageAttendance: 85.3,
  popularCategory: 'Social',
  thisMonthEvents: 6
};

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Annual Society Cultural Festival',
    description: 'Join us for our grand annual cultural festival featuring performances, food stalls, games, and prizes for all age groups. A celebration of our diverse community!',
    category: 'cultural',
    type: 'community',
    status: 'published',
    priority: 'high',
    startDate: new Date('2025-09-28T16:00:00'),
    endDate: new Date('2025-09-28T22:00:00'),
    isAllDay: false,
    timezone: 'Asia/Kolkata',
    recurrence: { type: 'yearly', interval: 1 },
    location: {
      id: '1',
      name: 'Society Club House',
      address: 'Main Hall, Society Club House',
      capacity: 300,
      amenities: ['Sound System', 'Stage', 'Catering Kitchen', 'Parking'],
      bookingFee: 5000
    },
    isVirtual: false,
    attendees: [],
    maxAttendees: 300,
    isRsvpRequired: true,
    rsvpDeadline: new Date('2025-09-25T23:59:59'),
    allowGuestRsvp: true,
    waitlistEnabled: true,
    organizer: { id: '1', name: 'Cultural Committee', email: 'cultural@society.com', role: 'Committee' },
    isPublic: true,
    targetAudience: 'all',
    requiredApproval: false,
    tags: ['festival', 'cultural', 'community', 'annual'],
    attachments: [],
    cost: { amount: 500, currency: 'INR', paymentDeadline: new Date('2025-09-25T23:59:59'), paymentInstructions: 'Pay at the venue or online' },
    createdBy: { id: '1', name: 'Cultural Committee', role: 'Committee' },
    createdAt: new Date('2025-08-15'),
    updatedAt: new Date('2025-09-10'),
    publishedAt: new Date('2025-08-20'),
    viewCount: 245,
    rsvpCount: { attending: 156, notAttending: 23, maybe: 42, pending: 15 },
    checkedInCount: 0
  },
  {
    id: '2',
    title: 'Monthly Committee Meeting',
    description: 'Regular monthly committee meeting to discuss society matters, maintenance updates, financial reports, and upcoming initiatives.',
    category: 'meeting',
    type: 'committee',
    status: 'published',
    priority: 'medium',
    startDate: new Date('2025-09-30T19:00:00'),
    endDate: new Date('2025-09-30T21:00:00'),
    isAllDay: false,
    timezone: 'Asia/Kolkata',
    recurrence: { type: 'monthly', interval: 1 },
    location: {
      id: '2',
      name: 'Committee Room',
      address: 'Committee Room, Block A',
      capacity: 25,
      amenities: ['Projector', 'Whiteboard', 'AC', 'WiFi'],
      bookingFee: 0
    },
    isVirtual: false,
    attendees: [],
    maxAttendees: 25,
    isRsvpRequired: true,
    rsvpDeadline: new Date('2025-09-29T18:00:00'),
    allowGuestRsvp: false,
    waitlistEnabled: false,
    organizer: { id: '2', name: 'Society Secretary', email: 'secretary@society.com', role: 'Secretary' },
    isPublic: false,
    targetAudience: 'committee',
    requiredApproval: false,
    tags: ['meeting', 'committee', 'monthly'],
    attachments: [],
    createdBy: { id: '2', name: 'Society Secretary', role: 'Secretary' },
    createdAt: new Date('2025-09-01'),
    updatedAt: new Date('2025-09-15'),
    publishedAt: new Date('2025-09-15'),
    viewCount: 45,
    rsvpCount: { attending: 18, notAttending: 2, maybe: 3, pending: 2 },
    checkedInCount: 0
  },
  {
    id: '3',
    title: 'Swimming Pool Maintenance',
    description: 'Scheduled maintenance and cleaning of the swimming pool. Pool will be closed during this period.',
    category: 'maintenance',
    type: 'society',
    status: 'published',
    priority: 'medium',
    startDate: new Date('2025-10-02T08:00:00'),
    endDate: new Date('2025-10-02T17:00:00'),
    isAllDay: false,
    timezone: 'Asia/Kolkata',
    recurrence: { type: 'monthly', interval: 1 },
    location: {
      id: '3',
      name: 'Swimming Pool Area',
      address: 'Swimming Pool, Recreation Area',
      capacity: 0,
      amenities: [],
      bookingFee: 0
    },
    isVirtual: false,
    attendees: [],
    isRsvpRequired: false,
    allowGuestRsvp: false,
    waitlistEnabled: false,
    organizer: { id: '3', name: 'Maintenance Team', email: 'maintenance@society.com', role: 'Staff' },
    isPublic: true,
    targetAudience: 'all',
    requiredApproval: false,
    tags: ['maintenance', 'pool', 'scheduled'],
    attachments: [],
    createdBy: { id: '3', name: 'Facility Manager', role: 'Manager' },
    createdAt: new Date('2025-09-20'),
    updatedAt: new Date('2025-09-20'),
    publishedAt: new Date('2025-09-20'),
    viewCount: 89,
    rsvpCount: { attending: 0, notAttending: 0, maybe: 0, pending: 0 },
    checkedInCount: 0
  },
  {
    id: '4',
    title: 'Yoga & Wellness Workshop',
    description: 'Join our certified yoga instructor for a refreshing morning session focusing on mindfulness, breathing techniques, and basic yoga poses suitable for all levels.',
    category: 'social',
    type: 'community',
    status: 'published',
    priority: 'low',
    startDate: new Date('2025-10-05T07:00:00'),
    endDate: new Date('2025-10-05T08:30:00'),
    isAllDay: false,
    timezone: 'Asia/Kolkata',
    recurrence: { type: 'weekly', interval: 1, daysOfWeek: [6] },
    location: {
      id: '4',
      name: 'Garden Area',
      address: 'Central Garden, Society Premises',
      capacity: 30,
      amenities: ['Open Air', 'Mats Provided', 'Water Station'],
      bookingFee: 0
    },
    isVirtual: false,
    attendees: [],
    maxAttendees: 30,
    isRsvpRequired: true,
    rsvpDeadline: new Date('2025-10-04T20:00:00'),
    allowGuestRsvp: true,
    waitlistEnabled: true,
    organizer: { id: '4', name: 'Wellness Committee', email: 'wellness@society.com', role: 'Committee' },
    isPublic: true,
    targetAudience: 'all',
    requiredApproval: false,
    tags: ['yoga', 'wellness', 'health', 'weekly'],
    attachments: [],
    cost: { amount: 200, currency: 'INR', paymentInstructions: 'Pay per session or monthly package available' },
    createdBy: { id: '4', name: 'Wellness Committee', role: 'Committee' },
    createdAt: new Date('2025-09-18'),
    updatedAt: new Date('2025-09-19'),
    publishedAt: new Date('2025-09-19'),
    viewCount: 127,
    rsvpCount: { attending: 24, notAttending: 3, maybe: 8, pending: 5 },
    checkedInCount: 0
  },
  {
    id: '5',
    title: 'Children\'s Sports Day',
    description: 'Fun-filled sports day for children with various games, races, and activities. Prizes and certificates for all participants!',
    category: 'sports',
    type: 'community',
    status: 'completed',
    priority: 'medium',
    startDate: new Date('2025-09-15T09:00:00'),
    endDate: new Date('2025-09-15T13:00:00'),
    isAllDay: false,
    timezone: 'Asia/Kolkata',
    recurrence: { type: 'none', interval: 1 },
    location: {
      id: '5',
      name: 'Sports Ground',
      address: 'Society Sports Ground',
      capacity: 100,
      amenities: ['First Aid', 'Refreshments', 'Sound System', 'Seating'],
      bookingFee: 2000
    },
    isVirtual: false,
    attendees: [],
    maxAttendees: 100,
    isRsvpRequired: true,
    rsvpDeadline: new Date('2025-09-12T23:59:59'),
    allowGuestRsvp: true,
    waitlistEnabled: false,
    organizer: { id: '5', name: 'Sports Committee', email: 'sports@society.com', role: 'Committee' },
    isPublic: true,
    targetAudience: 'all',
    requiredApproval: false,
    tags: ['sports', 'children', 'competition', 'prizes'],
    attachments: [],
    createdBy: { id: '5', name: 'Sports Committee', role: 'Committee' },
    createdAt: new Date('2025-08-20'),
    updatedAt: new Date('2025-09-10'),
    publishedAt: new Date('2025-08-25'),
    viewCount: 312,
    rsvpCount: { attending: 67, notAttending: 12, maybe: 8, pending: 0 },
    checkedInCount: 67
  }
];

const EventsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<EventFilter>('all');
  const [selectedSort, setSelectedSort] = useState<EventSort>('date-asc');
  const [selectedView, setSelectedView] = useState<EventView>('card');
  const [userRSVPs, setUserRSVPs] = useState<Record<string, 'attending' | 'maybe' | 'not-attending'>>({});
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let filtered = mockEvents;
    const now = new Date();

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    switch (selectedFilter) {
      case 'upcoming':
        filtered = filtered.filter(event => 
          event.startDate > now && (event.status === 'published' || event.status === 'ongoing')
        );
        break;
      case 'past':
        filtered = filtered.filter(event => 
          event.endDate < now || event.status === 'completed'
        );
        break;
      case 'my-events':
        // In a real app, this would filter by current user's created events
        filtered = filtered.filter(event => event.createdBy.id === '1');
        break;
      case 'attending':
        // In a real app, this would filter events the user is attending
        filtered = filtered.filter(event => userRSVPs[event.id] === 'attending');
        break;
      case 'draft':
        filtered = filtered.filter(event => event.status === 'draft');
        break;
    }

    // Apply sorting
    switch (selectedSort) {
      case 'date-desc':
        filtered = filtered.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
        break;
      case 'alphabetical':
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'popularity':
        filtered = filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'created-date':
        filtered = filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'date-asc':
      default:
        filtered = filtered.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
        break;
    }

    return filtered;
  }, [searchTerm, selectedFilter, selectedSort, userRSVPs]);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isEventPast = (event: Event): boolean => {
    return event.endDate < new Date() || event.status === 'completed';
  };

  const handleRSVP = (eventId: string, response: 'attending' | 'maybe' | 'not-attending') => {
    setUserRSVPs(prev => ({
      ...prev,
      [eventId]: response
    }));
    console.log(`RSVP ${response} for event ${eventId}`);
    // In a real app, this would make an API call
  };

  const handleCreateEvent = () => {
    setShowCreateEventModal(true);
  };

  const handleCreateEventSubmit = async (eventData: CreateEventData) => {
    try {
      console.log('Creating new event:', eventData);
      // In a real app, this would make an API call to create the event
      // const response = await api.createEvent(eventData);
      
      // For now, we'll just simulate success
      alert('Event created successfully!');
      setShowCreateEventModal(false);
      
      // TODO: Refresh events list or add the new event to the existing list
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  const getTotalRSVPs = (event: Event): number => {
    return event.rsvpCount.attending + event.rsvpCount.maybe + event.rsvpCount.notAttending + event.rsvpCount.pending;
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Title>Events & Activities</Title>
        </HeaderLeft>
        <HeaderRight>
          <ViewToggle>
            <ViewButton 
              $active={selectedView === 'card'}
              onClick={() => setSelectedView('card')}
            >
              <FiGrid />
              Cards
            </ViewButton>
            <ViewButton 
              $active={selectedView === 'list'}
              onClick={() => setSelectedView('list')}
            >
              <FiList />
              List
            </ViewButton>
            <ViewButton 
              $active={selectedView === 'calendar'}
              onClick={() => setSelectedView('calendar')}
            >
              <FiCalendar />
              Calendar
            </ViewButton>
          </ViewToggle>
          <CreateButton onClick={handleCreateEvent}>
            <FiPlus />
            Create Event
          </CreateButton>
        </HeaderRight>
      </Header>

      {/* Statistics */}
      <StatsGrid>
        <StatCard>
          <StatIcon $color="#3498db">
            <FiCalendar />
          </StatIcon>
          <StatContent>
            <StatValue>{mockEventStats.totalEvents}</StatValue>
            <StatLabel>Total Events</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon $color="#2ecc71">
            <FiClock />
          </StatIcon>
          <StatContent>
            <StatValue>{mockEventStats.upcomingEvents}</StatValue>
            <StatLabel>Upcoming Events</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon $color="#f39c12">
            <FiUsers />
          </StatIcon>
          <StatContent>
            <StatValue>{mockEventStats.totalAttendees}</StatValue>
            <StatLabel>Total Attendees</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIcon $color="#9b59b6">
            <FiTrendingUp />
          </StatIcon>
          <StatContent>
            <StatValue>{mockEventStats.averageAttendance}%</StatValue>
            <StatLabel>Avg. Attendance</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      {/* Controls */}
      <ControlsBar>
        <SearchContainer>
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
          <SearchInput
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        
        <FilterSelect
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value as EventFilter)}
        >
          <option value="all">All Events</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past Events</option>
          <option value="my-events">My Events</option>
          <option value="attending">Attending</option>
          <option value="draft">Drafts</option>
        </FilterSelect>

        <FilterSelect
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value as EventSort)}
        >
          <option value="date-asc">Date (Earliest)</option>
          <option value="date-desc">Date (Latest)</option>
          <option value="alphabetical">A-Z</option>
          <option value="popularity">Most Popular</option>
          <option value="created-date">Recently Created</option>
        </FilterSelect>
      </ControlsBar>

      {/* Events List */}
      {filteredEvents.length > 0 ? (
        <EventsGrid>
          {filteredEvents.map((event) => (
            <EventCard key={event.id} $isPast={isEventPast(event)}>
              <EventHeader $category={event.category}>
                <EventDate>
                  <FiCalendar />
                  {formatDate(event.startDate)}
                  {!event.isAllDay && ` • ${formatTime(event.startDate)} - ${formatTime(event.endDate)}`}
                </EventDate>
                <EventTitle>{event.title}</EventTitle>
                <EventMeta>
                  <MetaItem>
                    <StatusBadge $status={event.status}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </StatusBadge>
                  </MetaItem>
                  <MetaItem>
                    <PriorityBadge $priority={event.priority}>
                      {event.priority.charAt(0).toUpperCase() + event.priority.slice(1)} Priority
                    </PriorityBadge>
                  </MetaItem>
                  {event.isVirtual && (
                    <MetaItem>
                      <FiVideo />
                      Virtual
                    </MetaItem>
                  )}
                  <MetaItem>
                    <FiEye />
                    {event.viewCount} views
                  </MetaItem>
                </EventMeta>
              </EventHeader>

              <EventContent>
                <EventDescription>{event.description}</EventDescription>

                <EventDetails>
                  <DetailItem>
                    <DetailIcon $color="#3498db">
                      <FiMapPin />
                    </DetailIcon>
                    <DetailText>{event.location.name}</DetailText>
                  </DetailItem>
                  <DetailItem>
                    <DetailIcon $color="#2ecc71">
                      <FiUsers />
                    </DetailIcon>
                    <DetailText>
                      {getTotalRSVPs(event)} RSVPs
                      {event.maxAttendees && ` / ${event.maxAttendees} max`}
                    </DetailText>
                  </DetailItem>
                  <DetailItem>
                    <DetailIcon $color="#9b59b6">
                      <FiTag />
                    </DetailIcon>
                    <DetailText>{event.category.charAt(0).toUpperCase() + event.category.slice(1)}</DetailText>
                  </DetailItem>
                  {event.cost && (
                    <DetailItem>
                      <DetailIcon $color="#f39c12">
                        <FiDollarSign />
                      </DetailIcon>
                      <DetailText>₹{event.cost.amount}</DetailText>
                    </DetailItem>
                  )}
                </EventDetails>

                {event.tags.length > 0 && (
                  <EventTags>
                    {event.tags.map((tag, index) => (
                      <Tag key={index}>{tag}</Tag>
                    ))}
                  </EventTags>
                )}

                {event.isRsvpRequired && !isEventPast(event) && (
                  <RSVPSection>
                    <RSVPHeader>
                      <RSVPTitle>RSVP Required</RSVPTitle>
                      <RSVPStats>
                        {event.rsvpCount.attending} attending • {event.rsvpCount.maybe} maybe • {event.rsvpCount.notAttending} not attending
                      </RSVPStats>
                    </RSVPHeader>
                    <RSVPButtons>
                      <RSVPButton 
                        $variant="attending"
                        $active={userRSVPs[event.id] === 'attending'}
                        onClick={() => handleRSVP(event.id, 'attending')}
                      >
                        <FiCheckSquare />
                        Attending
                      </RSVPButton>
                      <RSVPButton 
                        $variant="maybe"
                        $active={userRSVPs[event.id] === 'maybe'}
                        onClick={() => handleRSVP(event.id, 'maybe')}
                      >
                        <FiStar />
                        Maybe
                      </RSVPButton>
                      <RSVPButton 
                        $variant="not-attending"
                        $active={userRSVPs[event.id] === 'not-attending'}
                        onClick={() => handleRSVP(event.id, 'not-attending')}
                      >
                        <FiX />
                        Can't Attend
                      </RSVPButton>
                    </RSVPButtons>
                  </RSVPSection>
                )}

                <EventActions>
                  <ActionButton $variant="primary">
                    <FiEye />
                    View Details
                  </ActionButton>
                  <ActionButton>
                    <FiShare2 />
                    Share
                  </ActionButton>
                  <ActionButton>
                    <FiCopy />
                    Copy Link
                  </ActionButton>
                  {event.status === 'completed' && (
                    <ActionButton>
                      <FiDownload />
                      Photos & Report
                    </ActionButton>
                  )}
                  {!isEventPast(event) && event.isVirtual && event.meetingLink && (
                    <ActionButton $variant="primary">
                      <FiVideo />
                      Join Meeting
                    </ActionButton>
                  )}
                </EventActions>
              </EventContent>
            </EventCard>
          ))}
        </EventsGrid>
      ) : (
        <EmptyState>
          <EmptyIcon>
            <FiCalendar />
          </EmptyIcon>
          <EmptyTitle>No events found</EmptyTitle>
          <EmptyDescription>
            {searchTerm ? 
              'No events match your search criteria. Try different keywords or filters.' :
              'No events available. Create a new event to get started with community engagement.'
            }
          </EmptyDescription>
        </EmptyState>
      )}
      
      <CreateEventForm
        isOpen={showCreateEventModal}
        onClose={() => setShowCreateEventModal(false)}
        onSubmit={handleCreateEventSubmit}
      />
    </Container>
  );
};

export default EventsPage;