import React, { useState, useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import {
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiPlus,
  FiBell,
  FiEye,
  FiHeart,
  FiShare2,
  FiBookmark,
  FiClock,
  FiUser,
  FiCalendar,
  FiTag,
  FiPaperclip,
  FiAlertTriangle,
  FiInfo,
  FiCheckCircle,
  FiX,
  FiChevronDown,
  FiChevronRight,
  FiMoreVertical,
  FiEdit3,
  FiTrash2,
  FiDownload,
  FiPrinter,
  FiExternalLink
} from 'react-icons/fi';
import { format, isToday, isYesterday, formatDistanceToNow, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import {
  Announcement,
  AnnouncementCategory,
  AnnouncementPriority,
  AnnouncementSearchFilters,
  AnnouncementStats,
  AnnouncementsState,
  CreateAnnouncementData
} from '../../types/announcements';
import NewAnnouncementForm from './NewAnnouncementForm';

// Main Container
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

// Header Section
const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  flex: 1;
  min-width: 300px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

// Search and Filter Section
const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  padding-left: ${({ theme }) => theme.spacing[12]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray[400]};
  width: 18px;
  height: 18px;
`;

// Action Buttons
const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.primary[500] : theme.colors.gray[300]};
  background: ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.primary[500] : theme.colors.white};
  color: ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.white : theme.colors.gray[700]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover:not(:disabled) {
    background: ${({ theme, variant }) => 
      variant === 'primary' ? theme.colors.primary[600] : theme.colors.gray[50]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const ViewButton = styled.button<{ isActive: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: none;
  background: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary[500] : theme.colors.white};
  color: ${({ theme, isActive }) => 
    isActive ? theme.colors.white : theme.colors.gray[600]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover:not(:disabled) {
    background: ${({ theme, isActive }) => 
      isActive ? theme.colors.primary[600] : theme.colors.gray[50]};
  }
`;

// Filters Section
const FiltersSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  flex-wrap: wrap;
  align-items: center;
`;

const FilterButton = styled.button<{ isActive: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme, isActive }) => 
    isActive ? theme.colors.primary[500] : theme.colors.gray[300]};
  background: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary[50] : theme.colors.white};
  color: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary[700] : theme.colors.gray[600]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
`;

// Stats Section
const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  text-align: center;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    box-shadow: ${({ theme }) => theme.boxShadow.sm};
  }
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

// Content Section
const ContentSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const AnnouncementsList = styled.div<{ viewMode: 'list' | 'grid' }>`
  flex: 1;
  display: ${({ viewMode }) => viewMode === 'grid' ? 'grid' : 'flex'};
  ${({ viewMode }) => viewMode === 'grid' && 'grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));'}
  gap: ${({ theme }) => theme.spacing[4]};
  ${({ viewMode }) => viewMode === 'list' && 'flex-direction: column;'}
`;

const AnnouncementCard = styled.div<{ isSelected?: boolean; isUnread?: boolean }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme, isSelected }) => 
    isSelected ? theme.colors.primary[300] : theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[5]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  position: relative;
  
  ${({ isUnread, theme }) => isUnread && `
    border-left: 4px solid ${theme.colors.primary[500]};
  `}

  &:hover {
    box-shadow: ${({ theme }) => theme.boxShadow.md};
    border-color: ${({ theme }) => theme.colors.primary[300]};
  }
`;

const AnnouncementHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const AnnouncementMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const PriorityBadge = styled.span<{ priority: AnnouncementPriority }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  background: ${({ theme, priority }) => {
    switch (priority) {
      case 'urgent': return theme.colors.error[100];
      case 'high': return theme.colors.warning[100];
      case 'normal': return theme.colors.primary[100];
      case 'low': return theme.colors.gray[100];
      default: return theme.colors.gray[100];
    }
  }};
  color: ${({ theme, priority }) => {
    switch (priority) {
      case 'urgent': return theme.colors.error[700];
      case 'high': return theme.colors.warning[700];
      case 'normal': return theme.colors.primary[700];
      case 'low': return theme.colors.gray[700];
      default: return theme.colors.gray[700];
    }
  }};
`;

const CategoryBadge = styled.span<{ category: AnnouncementCategory }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[700]};
  text-transform: capitalize;
`;

const AnnouncementTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  line-height: 1.4;
`;

const AnnouncementSummary = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const AnnouncementFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const AnnouncementActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ActionIcon = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const UnreadDot = styled.div`
  width: 8px;
  height: 8px;
  background: ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  position: absolute;
  top: ${({ theme }) => theme.spacing[4]};
  right: ${({ theme }) => theme.spacing[4]};
`;

// Detail Panel (when announcement is selected)
const DetailPanel = styled.div`
  width: 400px;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  height: fit-content;
  position: sticky;
  top: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 1024px) {
    width: 100%;
    position: static;
  }
`;

const DetailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const DetailTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  line-height: 1.3;
`;

const DetailContent = styled.div`
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const DetailMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

// Empty State
const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[4]};
`;

const EmptyStateIcon = styled.div`
  width: 64px;
  height: 64px;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const EmptyStateTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const EmptyStateDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const AnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedAnnouncementId, setSelectedAnnouncementId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewAnnouncementModal, setShowNewAnnouncementModal] = useState(false);
  const [filters, setFilters] = useState<AnnouncementSearchFilters>({
    category: 'all',
    priority: 'all',
    status: 'all',
    dateRange: {},
    author: [],
    tags: [],
    hasAttachments: false,
    requiresAcknowledgment: false,
    searchQuery: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  // Sample data - in real app, this would come from API
  const [announcements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'Water Supply Maintenance - Building A & B',
      content: `Dear Residents,

We will be conducting routine maintenance on the water supply system for Building A and Building B on September 23, 2025.

**Details:**
- Date: September 23, 2025
- Time: 10:00 AM - 2:00 PM
- Affected Buildings: A & B
- Alternative arrangements: Water tankers will be available

Please plan accordingly and store water for your needs during this period. We apologize for any inconvenience caused.

For any urgent queries, please contact the maintenance team at ext. 101.

Thank you for your cooperation.`,
      summary: 'Water supply maintenance scheduled for Buildings A & B on Sept 23, 10 AM - 2 PM. Water tankers will be available.',
      category: 'maintenance',
      priority: 'high',
      status: 'published',
      author: {
        id: '1',
        name: 'Maintenance Team',
        role: 'maintenance',
        department: 'Facility Management'
      },
      attachments: [],
      reactions: [],
      readBy: [],
      createdAt: new Date('2025-09-21T08:30:00'),
      updatedAt: new Date('2025-09-21T08:30:00'),
      publishedAt: new Date('2025-09-21T08:30:00'),
      isPinned: true,
      isSticky: false,
      tags: ['water', 'maintenance', 'building-a', 'building-b'],
      targetAudience: ['resident'],
      visibility: 'all',
      allowComments: true,
      requireAcknowledgment: false,
      viewCount: 145
    },
    {
      id: '2',
      title: 'Diwali Celebration - Community Hall Booking',
      content: `Dear Residents,

We are excited to announce that the Community Hall is now available for booking for Diwali celebrations!

**Booking Details:**
- Available dates: October 25-27, 2025
- Time slots: 6:00 PM - 11:00 PM
- Booking fee: ₹2,000 per day
- Decoration allowed with prior approval

**How to book:**
1. Visit the management office
2. Fill out the booking form
3. Pay the booking fee
4. Submit decoration plan (if any)

First come, first served basis. Limited slots available.

Contact the community management team for more information.

Let's celebrate together and make this Diwali memorable!`,
      summary: 'Community Hall available for Diwali celebrations (Oct 25-27). Booking fee ₹2,000/day. First come, first served.',
      category: 'events',
      priority: 'normal',
      status: 'published',
      author: {
        id: '2',
        name: 'Community Manager',
        role: 'admin',
        department: 'Community Management'
      },
      attachments: [],
      reactions: [],
      readBy: [],
      createdAt: new Date('2025-09-20T14:15:00'),
      updatedAt: new Date('2025-09-20T14:15:00'),
      publishedAt: new Date('2025-09-20T14:15:00'),
      isPinned: false,
      isSticky: false,
      tags: ['diwali', 'community-hall', 'booking', 'celebration'],
      targetAudience: ['resident'],
      visibility: 'all',
      allowComments: true,
      requireAcknowledgment: false,
      viewCount: 89
    },
    {
      id: '3',
      title: 'URGENT: Power Outage in Building C - Elevator Service Affected',
      content: `URGENT NOTICE

We are experiencing an unexpected power outage in Building C due to a technical fault in the main electrical panel.

**Current Status:**
- Power outage since 2:00 PM today
- Elevators are out of service
- Emergency lighting is functional
- Security systems running on backup power

**Action Being Taken:**
- Electricians are working to resolve the issue
- Expected restoration time: 6:00 PM today
- Generator backup being arranged for essential services

**Safety Instructions:**
- Use stairways only - elevators are not operational
- Keep flashlights handy
- Avoid using candles for safety reasons
- Report any emergencies to security immediately

We will update you as soon as power is restored. Thank you for your patience.

Emergency contact: Security - 9876543210`,
      summary: 'URGENT: Power outage in Building C. Elevators out of service. Expected restoration by 6 PM. Use stairways only.',
      category: 'emergency',
      priority: 'urgent',
      status: 'published',
      author: {
        id: '3',
        name: 'Security Team',
        role: 'security',
        department: 'Security & Safety'
      },
      attachments: [],
      reactions: [],
      readBy: [],
      createdAt: new Date('2025-09-21T14:30:00'),
      updatedAt: new Date('2025-09-21T15:15:00'),
      publishedAt: new Date('2025-09-21T14:30:00'),
      isPinned: true,
      isSticky: true,
      tags: ['urgent', 'power-outage', 'building-c', 'elevator'],
      targetAudience: ['resident'],
      visibility: 'all',
      allowComments: false,
      requireAcknowledgment: true,
      viewCount: 234
    },
    {
      id: '4',
      title: 'Monthly Society Meeting - October 2025',
      content: `Dear Residents,

You are cordially invited to attend the Monthly Society Meeting for October 2025.

**Meeting Details:**
- Date: October 5, 2025
- Time: 7:00 PM - 9:00 PM
- Venue: Community Hall
- Agenda attached (see attachment)

**Key Topics:**
1. Monthly financial report review
2. Upcoming maintenance projects discussion
3. New policy proposals
4. Resident concerns and suggestions
5. Festival celebration planning

Your participation is valuable for the betterment of our community. Light refreshments will be served.

Please confirm your attendance by replying to this announcement or contacting the management office.

Looking forward to seeing you there!`,
      summary: 'Monthly Society Meeting on Oct 5, 7-9 PM in Community Hall. Financial review, maintenance projects, and policy discussions.',
      category: 'general',
      priority: 'normal',
      status: 'published',
      author: {
        id: '4',
        name: 'Society Secretary',
        role: 'admin',
        department: 'Administration'
      },
      attachments: [
        {
          id: '1',
          name: 'October_Meeting_Agenda.pdf',
          type: 'application/pdf',
          size: 245760,
          url: '/attachments/agenda.pdf'
        }
      ],
      reactions: [],
      readBy: [],
      createdAt: new Date('2025-09-19T11:00:00'),
      updatedAt: new Date('2025-09-19T11:00:00'),
      publishedAt: new Date('2025-09-19T11:00:00'),
      isPinned: false,
      isSticky: false,
      tags: ['meeting', 'monthly', 'society', 'financial-report'],
      targetAudience: ['resident'],
      visibility: 'all',
      allowComments: true,
      requireAcknowledgment: true,
      viewCount: 67
    }
  ]);

  const stats: AnnouncementStats = useMemo(() => ({
    totalAnnouncements: announcements.length,
    unreadCount: 3,
    highPriorityCount: announcements.filter(a => a.priority === 'high').length,
    urgentCount: announcements.filter(a => a.priority === 'urgent').length,
    expiringCount: 0,
    categoryBreakdown: {
      general: announcements.filter(a => a.category === 'general').length,
      maintenance: announcements.filter(a => a.category === 'maintenance').length,
      events: announcements.filter(a => a.category === 'events').length,
      safety: announcements.filter(a => a.category === 'safety').length,
      financial: announcements.filter(a => a.category === 'financial').length,
      utilities: announcements.filter(a => a.category === 'utilities').length,
      community: announcements.filter(a => a.category === 'community').length,
      emergency: announcements.filter(a => a.category === 'emergency').length,
    },
    priorityBreakdown: {
      low: announcements.filter(a => a.priority === 'low').length,
      normal: announcements.filter(a => a.priority === 'normal').length,
      high: announcements.filter(a => a.priority === 'high').length,
      urgent: announcements.filter(a => a.priority === 'urgent').length,
    },
    readRate: 75,
    averageReadTime: 2.5
  }), [announcements]);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(announcement => {
      const matchesSearch = searchQuery === '' || 
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filters.category === 'all' || announcement.category === filters.category;
      const matchesPriority = filters.priority === 'all' || announcement.priority === filters.priority;
      
      return matchesSearch && matchesCategory && matchesPriority;
    }).sort((a, b) => {
      // Sort by pinned first, then by selected sort criteria
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      if (filters.sortBy === 'date') {
        const dateA = a.publishedAt || a.createdAt;
        const dateB = b.publishedAt || b.createdAt;
        return filters.sortOrder === 'desc' ? 
          dateB.getTime() - dateA.getTime() : 
          dateA.getTime() - dateB.getTime();
      }
      
      return 0;
    });
  }, [announcements, searchQuery, filters]);

  const selectedAnnouncement = announcements.find(a => a.id === selectedAnnouncementId);

  const handleAnnouncementSelect = useCallback((id: string) => {
    setSelectedAnnouncementId(id);
    // Mark as read logic would go here
  }, []);

  const handleFilterChange = useCallback((key: keyof AnnouncementSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleNewAnnouncement = () => {
    setShowNewAnnouncementModal(true);
  };

  const handleNewAnnouncementSubmit = async (announcementData: CreateAnnouncementData) => {
    try {
      console.log('Creating new announcement:', announcementData);
      // In a real app, this would make an API call to create the announcement
      // const response = await api.createAnnouncement(announcementData);
      
      // For now, we'll just simulate success
      alert('Announcement created successfully!');
      setShowNewAnnouncementModal(false);
      
      // TODO: Refresh announcements list or add the new announcement to the existing list
    } catch (error) {
      console.error('Error creating announcement:', error);
      alert('Failed to create announcement. Please try again.');
    }
  };

  const formatAnnouncementDate = (date: Date) => {
    if (isToday(date)) {
      return `Today, ${format(date, 'HH:mm')}`;
    } else if (isYesterday(date)) {
      return `Yesterday, ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM dd, yyyy HH:mm');
    }
  };

  const isAnnouncementUnread = (announcementId: string) => {
    // In real app, this would check against user's read status
    return ['1', '3', '4'].includes(announcementId);
  };

  if (!user) {
    return (
      <Container>
        <EmptyState>
          <EmptyStateIcon>
            <FiBell size={32} />
          </EmptyStateIcon>
          <EmptyStateTitle>Authentication Required</EmptyStateTitle>
          <EmptyStateDescription>
            Please log in to view announcements.
          </EmptyStateDescription>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>
        <FiBell size={32} />
        Announcements
      </Title>

      <HeaderSection>
        <HeaderLeft>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </SearchContainer>
        </HeaderLeft>

        <HeaderRight>
          <ActionButton>
            <FiFilter size={16} />
            Filters
          </ActionButton>
          
          <ViewToggle>
            <ViewButton 
              isActive={viewMode === 'list'} 
              onClick={() => setViewMode('list')}
            >
              <FiList size={16} />
            </ViewButton>
            <ViewButton 
              isActive={viewMode === 'grid'} 
              onClick={() => setViewMode('grid')}
            >
              <FiGrid size={16} />
            </ViewButton>
          </ViewToggle>

          <ActionButton variant="primary" onClick={handleNewAnnouncement}>
            <FiPlus size={16} />
            New Announcement
          </ActionButton>
        </HeaderRight>
      </HeaderSection>

      <StatsSection>
        <StatCard>
          <StatNumber>{stats.totalAnnouncements}</StatNumber>
          <StatLabel>Total Announcements</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.unreadCount}</StatNumber>
          <StatLabel>Unread</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.urgentCount}</StatNumber>
          <StatLabel>Urgent</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{stats.highPriorityCount}</StatNumber>
          <StatLabel>High Priority</StatLabel>
        </StatCard>
      </StatsSection>

      <FiltersSection>
        <FilterButton
          isActive={filters.category === 'all'}
          onClick={() => handleFilterChange('category', 'all')}
        >
          All Categories
        </FilterButton>
        <FilterButton
          isActive={filters.category === 'maintenance'}
          onClick={() => handleFilterChange('category', 'maintenance')}
        >
          Maintenance
        </FilterButton>
        <FilterButton
          isActive={filters.category === 'events'}
          onClick={() => handleFilterChange('category', 'events')}
        >
          Events
        </FilterButton>
        <FilterButton
          isActive={filters.category === 'emergency'}
          onClick={() => handleFilterChange('category', 'emergency')}
        >
          Emergency
        </FilterButton>
        <FilterButton
          isActive={filters.category === 'general'}
          onClick={() => handleFilterChange('category', 'general')}
        >
          General
        </FilterButton>
      </FiltersSection>

      <ContentSection>
        <AnnouncementsList viewMode={viewMode}>
          {filteredAnnouncements.length > 0 ? (
            filteredAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                isSelected={announcement.id === selectedAnnouncementId}
                isUnread={isAnnouncementUnread(announcement.id)}
                onClick={() => handleAnnouncementSelect(announcement.id)}
              >
                {isAnnouncementUnread(announcement.id) && <UnreadDot />}
                
                <AnnouncementMeta>
                  <PriorityBadge priority={announcement.priority}>
                    {announcement.priority}
                  </PriorityBadge>
                  <CategoryBadge category={announcement.category}>
                    {announcement.category}
                  </CategoryBadge>
                  <span>•</span>
                  <span>{formatAnnouncementDate(announcement.publishedAt || announcement.createdAt)}</span>
                  <span>•</span>
                  <span>by {announcement.author.name}</span>
                </AnnouncementMeta>

                <AnnouncementTitle>{announcement.title}</AnnouncementTitle>
                <AnnouncementSummary>{announcement.summary}</AnnouncementSummary>

                <AnnouncementFooter>
                  <AnnouncementActions>
                    <ActionIcon>
                      <FiEye size={14} />
                      {announcement.viewCount}
                    </ActionIcon>
                    {announcement.attachments.length > 0 && (
                      <ActionIcon>
                        <FiPaperclip size={14} />
                        {announcement.attachments.length}
                      </ActionIcon>
                    )}
                    {announcement.requireAcknowledgment && (
                      <ActionIcon>
                        <FiCheckCircle size={14} />
                        Required
                      </ActionIcon>
                    )}
                  </AnnouncementActions>

                  <AnnouncementActions>
                    <ActionIcon>
                      <FiHeart size={14} />
                    </ActionIcon>
                    <ActionIcon>
                      <FiBookmark size={14} />
                    </ActionIcon>
                    <ActionIcon>
                      <FiShare2 size={14} />
                    </ActionIcon>
                  </AnnouncementActions>
                </AnnouncementFooter>
              </AnnouncementCard>
            ))
          ) : (
            <EmptyState>
              <EmptyStateIcon>
                <FiSearch size={32} />
              </EmptyStateIcon>
              <EmptyStateTitle>No announcements found</EmptyStateTitle>
              <EmptyStateDescription>
                {searchQuery ? 
                  'Try adjusting your search terms or filters.' : 
                  'No announcements match your current filters.'
                }
              </EmptyStateDescription>
            </EmptyState>
          )}
        </AnnouncementsList>

        {selectedAnnouncement && (
          <DetailPanel>
            <DetailHeader>
              <div>
                <DetailTitle>{selectedAnnouncement.title}</DetailTitle>
                <AnnouncementMeta>
                  <PriorityBadge priority={selectedAnnouncement.priority}>
                    {selectedAnnouncement.priority}
                  </PriorityBadge>
                  <CategoryBadge category={selectedAnnouncement.category}>
                    {selectedAnnouncement.category}
                  </CategoryBadge>
                </AnnouncementMeta>
              </div>
              <ActionIcon>
                <FiX size={20} onClick={() => setSelectedAnnouncementId(null)} />
              </ActionIcon>
            </DetailHeader>

            <DetailMeta>
              <MetaItem>
                <FiUser size={14} />
                <span>{selectedAnnouncement.author.name} ({selectedAnnouncement.author.department})</span>
              </MetaItem>
              <MetaItem>
                <FiCalendar size={14} />
                <span>{formatAnnouncementDate(selectedAnnouncement.publishedAt || selectedAnnouncement.createdAt)}</span>
              </MetaItem>
              <MetaItem>
                <FiEye size={14} />
                <span>{selectedAnnouncement.viewCount} views</span>
              </MetaItem>
              {selectedAnnouncement.attachments.length > 0 && (
                <MetaItem>
                  <FiPaperclip size={14} />
                  <span>{selectedAnnouncement.attachments.length} attachments</span>
                </MetaItem>
              )}
            </DetailMeta>

            <DetailContent>
              {selectedAnnouncement.content.split('\n').map((paragraph, index) => (
                <p key={index} style={{ marginBottom: '12px' }}>
                  {paragraph}
                </p>
              ))}
            </DetailContent>

            {selectedAnnouncement.attachments.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>
                  Attachments:
                </h4>
                {selectedAnnouncement.attachments.map((attachment) => (
                  <ActionIcon key={attachment.id} style={{ justifyContent: 'flex-start', width: '100%', marginBottom: '4px' }}>
                    <FiDownload size={14} />
                    {attachment.name}
                  </ActionIcon>
                ))}
              </div>
            )}

            <AnnouncementActions style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <ActionIcon>
                  <FiHeart size={16} />
                  Like
                </ActionIcon>
                <ActionIcon>
                  <FiBookmark size={16} />
                  Save
                </ActionIcon>
              </div>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <ActionIcon>
                  <FiShare2 size={16} />
                </ActionIcon>
                <ActionIcon>
                  <FiPrinter size={16} />
                </ActionIcon>
                <ActionIcon>
                  <FiMoreVertical size={16} />
                </ActionIcon>
              </div>
            </AnnouncementActions>
          </DetailPanel>
        )}
      </ContentSection>

      <NewAnnouncementForm
        isOpen={showNewAnnouncementModal}
        onClose={() => setShowNewAnnouncementModal(false)}
        onSubmit={handleNewAnnouncementSubmit}
      />
    </Container>
  );
};

export default AnnouncementsPage;