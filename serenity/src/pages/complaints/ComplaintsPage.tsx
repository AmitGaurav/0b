import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiMessageCircle, 
  FiPlus, 
  FiFilter, 
  FiSearch, 
  FiCalendar,
  FiUser,
  FiMapPin,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,
  FiEye,
  FiEdit,
  FiTrash2,
  FiMessageSquare,
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiRefreshCw
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../contexts/AuthContext';
import ComplaintForm from '../../components/forms/ComplaintForm';
import { ComplaintFormData, ComplaintStatus, ComplaintPriority, ComplaintType } from '../../types/complaint';

// Styled Components
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: space-between;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[600]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[700]};
  }

  &.secondary {
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.gray[700]};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};

    &:hover {
      background: ${({ theme }) => theme.colors.gray[50]};
    }
  }
`;

const FiltersSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr;
    gap: ${({ theme }) => theme.spacing[3]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

// Advanced Filters Components
const MoreFiltersPanel = styled.div<{ isOpen: boolean }>`
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding: ${({ isOpen, theme }) => isOpen ? theme.spacing[6] : '0'};
  max-height: ${({ isOpen }) => isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  border: ${({ isOpen, theme }) => isOpen ? `1px solid ${theme.colors.gray[200]}` : 'none'};
`;

const FilterPanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FilterPanelTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
`;

const FilterActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ClearFiltersButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray[100]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[200]};
  }
`;

const AdvancedFilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FilterLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const DateRangeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
`;

const DateInput = styled.input`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const DateSeparator = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
  text-align: center;
`;

const FilterSummary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const FilterTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[800]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const RemoveFilterButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary[600]};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[800]};
  }
`;

const SearchInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    width: 100%;
    padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[10]} ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[3]};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary[500]};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    }
  }

  .search-icon {
    position: absolute;
    right: ${({ theme }) => theme.spacing[3]};
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const TabsContainer = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[1]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  overflow-x: auto;
`;

const Tab = styled.button<{ active: boolean }>`
  flex: 1;
  min-width: 200px;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  white-space: nowrap;

  ${({ active, theme }) => active ? `
    background: ${theme.colors.primary[100]};
    color: ${theme.colors.primary[700]};
  ` : `
    background: transparent;
    color: ${theme.colors.gray[600]};

    &:hover {
      background: ${theme.colors.gray[50]};
    }
  `}
`;

const ComplaintsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ComplaintCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-left: 4px solid ${({ theme, color }) => color || theme.colors.primary[500]};
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    box-shadow: ${({ theme }) => theme.boxShadow.md};
  }
`;

const ComplaintHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ComplaintInfo = styled.div`
  flex: 1;
`;

const ComplaintTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ComplaintMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ComplaintDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  
  ${({ status, theme }) => {
    switch (status) {
      case 'new':
        return `
          background: ${theme.colors.info[100]};
          color: ${theme.colors.info[800]};
        `;
      case 'in-progress':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[800]};
        `;
      case 'resolved':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[800]};
        `;
      case 'closed':
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[800]};
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[800]};
        `;
    }
  }}
`;

const PriorityBadge = styled.span<{ priority: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;

  ${({ theme, priority }) => {
    switch (priority) {
      case 'high':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[700]};
        `;
      case 'medium':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
        `;
      case 'low':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[700]};
        `;
    }
  }}
`;

const ComplaintActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.gray[600]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[200]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }

  &.primary {
    background: ${({ theme }) => theme.colors.primary[100]};
    color: ${({ theme }) => theme.colors.primary[700]};

    &:hover {
      background: ${({ theme }) => theme.colors.primary[200]};
    }
  }

  &.danger {
    background: ${({ theme }) => theme.colors.error[100]};
    color: ${({ theme }) => theme.colors.error[700]};

    &:hover {
      background: ${({ theme }) => theme.colors.error[200]};
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const EmptyStateIcon = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

// Types
interface Complaint {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  reportedBy: string;
  reportedDate: string;
  assignedTo?: string;
  resolvedDate?: string;
  location: string;
  block?: string;
  unit?: string;
  isPublic: boolean;
  commentsCount: number;
}

const ComplaintsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-complaints');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [complaints, setComplaints] = useState<LegacyComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Advanced Filters State
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [assignedToFilter, setAssignedToFilter] = useState('all');
  const [blockFilter, setBlockFilter] = useState('all');
  const [escalationLevelFilter, setEscalationLevelFilter] = useState('all');
  const [reopeningCountFilter, setReopeningCountFilter] = useState('all');
  const [isPublicFilter, setIsPublicFilter] = useState('all');
  const [commentsCountFilter, setCommentsCountFilter] = useState('all');

// Legacy Complaint interface (for existing mock data)
interface LegacyComplaint {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  reportedBy: string;
  reportedDate: string;
  assignedTo?: string;
  resolvedDate?: string;
  location?: string;
  block: string;
  unit?: string;
  isPublic: boolean;
  commentsCount?: number;
}

  // Mock data - replace with actual API calls
  const mockComplaints: LegacyComplaint[] = [
    {
      id: 1,
      title: 'Water leakage in parking area',
      description: 'There is a significant water leakage in the basement parking area near Block A. The water is accumulating and causing issues for residents parking their vehicles.',
      category: 'Maintenance',
      priority: 'high',
      status: 'new',
      reportedBy: 'John Doe',
      reportedDate: '2024-01-15',
      location: 'Block A - Parking',
      block: 'A1',
      unit: 'A101',
      isPublic: false,
      commentsCount: 3
    },
    {
      id: 2,
      title: 'Noise complaint from construction work',
      description: 'Construction work is starting very early in the morning (6 AM) causing disturbance to residents. This has been ongoing for the past week.',
      category: 'Noise',
      priority: 'medium',
      status: 'in-progress',
      reportedBy: 'Jane Smith',
      reportedDate: '2024-01-14',
      assignedTo: 'Security Team',
      location: 'Block C - Construction Site',
      block: 'C1',
      isPublic: true,
      commentsCount: 7
    },
    {
      id: 3,
      title: 'Elevator maintenance required',
      description: 'The elevator in Block A is making unusual noises and sometimes stops between floors. Urgent maintenance required for safety.',
      category: 'Safety',
      priority: 'high',
      status: 'resolved',
      reportedBy: 'Mike Johnson',
      reportedDate: '2024-01-12',
      resolvedDate: '2024-01-14',
      assignedTo: 'Maintenance Team',
      location: 'Block A - Elevator',
      block: 'A1',
      isPublic: true,
      commentsCount: 12
    },
    {
      id: 4,
      title: 'Garbage collection delay',
      description: 'Garbage has not been collected from our block for the past 3 days. The accumulation is causing hygiene issues.',
      category: 'Housekeeping',
      priority: 'medium',
      status: 'in-progress',
      reportedBy: 'Sarah Wilson',
      reportedDate: '2024-01-13',
      assignedTo: 'Housekeeping Team',
      location: 'Block C2',
      block: 'C2',
      unit: 'C201',
      isPublic: true,
      commentsCount: 5
    },
    {
      id: 5,
      title: 'Security gate malfunction',
      description: 'The main security gate is not working properly and remains open most of the time, posing a security risk.',
      category: 'Security',
      priority: 'high',
      status: 'new',
      reportedBy: 'David Brown',
      reportedDate: '2024-01-15',
      location: 'Main Gate',
      block: 'Common Area',
      isPublic: true,
      commentsCount: 2
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setComplaints(mockComplaints);
      setLoading(false);
    }, 1000);
  }, []);

  // Helper function to get user's block from property ID or address
  const getUserBlock = (user: User | null): string => {
    if (!user) return 'A1';
    
    // If we have defaultPropertyId, we could map it to blocks
    // For now, let's derive from address or use a default mapping
    if (user.defaultPropertyId) {
      // Simple mapping based on property ID ranges
      // You can customize this based on your actual property ID to block mapping
      const propertyId = user.defaultPropertyId;
      if (propertyId >= 1 && propertyId <= 100) return 'A1';
      if (propertyId >= 101 && propertyId <= 200) return 'A2';
      if (propertyId >= 201 && propertyId <= 300) return 'C1';
      if (propertyId >= 301 && propertyId <= 400) return 'C2';
      if (propertyId >= 401) return 'C3';
    }
    
    // Fallback: try to extract from address
    const address = user.address?.toUpperCase();
    if (address) {
      if (address.includes('A1') || address.includes('A-1')) return 'A1';
      if (address.includes('A2') || address.includes('A-2')) return 'A2';
      if (address.includes('C1') || address.includes('C-1')) return 'C1';
      if (address.includes('C2') || address.includes('C-2')) return 'C2';
      if (address.includes('C3') || address.includes('C-3')) return 'C3';
    }
    
    return 'A1'; // Default block
  };

  const tabs = [
    { id: 'my-complaints', label: 'My Complaints', count: getMyComplaints().length },
    { id: 'block-complaints', label: `Block ${getUserBlock(user)} Complaints`, count: getBlockComplaints().length },
    { id: 'public-complaints', label: 'Public Complaints', count: getPublicComplaints().length }
  ];

  function getMyComplaints(): LegacyComplaint[] {
    return complaints.filter(complaint => complaint.reportedBy === user?.name);
  }

  function getBlockComplaints(): LegacyComplaint[] {
    const userBlock = getUserBlock(user); // Get user's block using helper function
    return complaints.filter(complaint => 
      complaint.block === userBlock && complaint.reportedBy !== user?.name
    );
  }

  function getPublicComplaints(): LegacyComplaint[] {
    return complaints.filter(complaint => complaint.isPublic);
  }

  function getFilteredComplaints(): LegacyComplaint[] {
    let filtered: LegacyComplaint[] = [];

    switch (activeTab) {
      case 'my-complaints':
        filtered = getMyComplaints();
        break;
      case 'block-complaints':
        filtered = getBlockComplaints();
        break;
      case 'public-complaints':
        filtered = getPublicComplaints();
        break;
      default:
        filtered = complaints;
    }

    // Apply basic filters
    if (searchTerm) {
      filtered = filtered.filter(complaint =>
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.category === categoryFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.priority === priorityFilter);
    }

    // Apply advanced filters
    if (dateFromFilter) {
      filtered = filtered.filter(complaint => complaint.reportedDate >= dateFromFilter);
    }

    if (dateToFilter) {
      filtered = filtered.filter(complaint => complaint.reportedDate <= dateToFilter);
    }

    if (assignedToFilter !== 'all') {
      if (assignedToFilter === 'assigned') {
        filtered = filtered.filter(complaint => complaint.assignedTo);
      } else if (assignedToFilter === 'unassigned') {
        filtered = filtered.filter(complaint => !complaint.assignedTo);
      }
    }

    if (blockFilter !== 'all') {
      filtered = filtered.filter(complaint => complaint.block === blockFilter);
    }

    if (isPublicFilter !== 'all') {
      const isPublic = isPublicFilter === 'public';
      filtered = filtered.filter(complaint => complaint.isPublic === isPublic);
    }

    if (commentsCountFilter !== 'all') {
      switch (commentsCountFilter) {
        case 'none':
          filtered = filtered.filter(complaint => !complaint.commentsCount || complaint.commentsCount === 0);
          break;
        case 'low':
          filtered = filtered.filter(complaint => complaint.commentsCount && complaint.commentsCount <= 3);
          break;
        case 'medium':
          filtered = filtered.filter(complaint => complaint.commentsCount && complaint.commentsCount > 3 && complaint.commentsCount <= 10);
          break;
        case 'high':
          filtered = filtered.filter(complaint => complaint.commentsCount && complaint.commentsCount > 10);
          break;
      }
    }

    return filtered;
  }

  // Clear all advanced filters
  const clearAdvancedFilters = () => {
    setDateFromFilter('');
    setDateToFilter('');
    setAssignedToFilter('all');
    setBlockFilter('all');
    setEscalationLevelFilter('all');
    setReopeningCountFilter('all');
    setIsPublicFilter('all');
    setCommentsCountFilter('all');
  };

  // Clear all filters (basic + advanced)
  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setPriorityFilter('all');
    clearAdvancedFilters();
  };

  // Get count of active advanced filters
  const getActiveAdvancedFiltersCount = () => {
    let count = 0;
    if (dateFromFilter) count++;
    if (dateToFilter) count++;
    if (assignedToFilter !== 'all') count++;
    if (blockFilter !== 'all') count++;
    if (escalationLevelFilter !== 'all') count++;
    if (reopeningCountFilter !== 'all') count++;
    if (isPublicFilter !== 'all') count++;
    if (commentsCountFilter !== 'all') count++;
    return count;
  };

  // Get active filters summary
  const getActiveFilters = () => {
    const filters = [];
    if (dateFromFilter) filters.push({ key: 'dateFrom', label: `From: ${dateFromFilter}`, value: dateFromFilter });
    if (dateToFilter) filters.push({ key: 'dateTo', label: `To: ${dateToFilter}`, value: dateToFilter });
    if (assignedToFilter !== 'all') filters.push({ key: 'assigned', label: `Assignment: ${assignedToFilter}`, value: assignedToFilter });
    if (blockFilter !== 'all') filters.push({ key: 'block', label: `Block: ${blockFilter}`, value: blockFilter });
    if (isPublicFilter !== 'all') filters.push({ key: 'public', label: `Visibility: ${isPublicFilter}`, value: isPublicFilter });
    if (commentsCountFilter !== 'all') filters.push({ key: 'comments', label: `Comments: ${commentsCountFilter}`, value: commentsCountFilter });
    return filters;
  };

  const removeFilter = (filterKey: string) => {
    switch (filterKey) {
      case 'dateFrom': setDateFromFilter(''); break;
      case 'dateTo': setDateToFilter(''); break;
      case 'assigned': setAssignedToFilter('all'); break;
      case 'block': setBlockFilter('all'); break;
      case 'public': setIsPublicFilter('all'); break;
      case 'comments': setCommentsCountFilter('all'); break;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <FiAlertTriangle size={12} />;
      case 'in-progress':
        return <FiClock size={12} />;
      case 'resolved':
        return <FiCheckCircle size={12} />;
      default:
        return null;
    }
  };

  const getBorderColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const renderComplaintCard = (complaint: LegacyComplaint) => (
    <ComplaintCard key={complaint.id} color={getBorderColor(complaint.priority)}>
      <ComplaintHeader>
        <ComplaintInfo>
          <ComplaintTitle>{complaint.title}</ComplaintTitle>
          <ComplaintMeta>
            <MetaItem>
              <FiUser />
              {complaint.reportedBy}
            </MetaItem>
            <MetaItem>
              <FiCalendar />
              {new Date(complaint.reportedDate).toLocaleDateString()}
            </MetaItem>
            <MetaItem>
              <FiMapPin />
              {complaint.location}
            </MetaItem>
            {complaint.commentsCount && complaint.commentsCount > 0 && (
              <MetaItem>
                <FiMessageSquare />
                {complaint.commentsCount} comments
              </MetaItem>
            )}
          </ComplaintMeta>
          <ComplaintDescription>{complaint.description}</ComplaintDescription>
        </ComplaintInfo>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
          <StatusBadge status={complaint.status}>
            {getStatusIcon(complaint.status)}
            {complaint.status}
          </StatusBadge>
          <PriorityBadge priority={complaint.priority}>
            {complaint.priority}
          </PriorityBadge>
        </div>
      </ComplaintHeader>
      <ComplaintActions>
        <IconButton className="primary" title="View Details">
          <FiEye size={14} />
        </IconButton>
        {activeTab === 'my-complaints' && (
          <>
            <IconButton title="Edit Complaint">
              <FiEdit size={14} />
            </IconButton>
            <IconButton className="danger" title="Delete Complaint">
              <FiTrash2 size={14} />
            </IconButton>
          </>
        )}
        <IconButton title="Add Comment">
          <FiMessageSquare size={14} />
        </IconButton>
      </ComplaintActions>
    </ComplaintCard>
  );

  // Handle form submission
  const handleComplaintSubmit = async (formData: ComplaintFormData) => {
    try {
      // Create new complaint object that matches the legacy format
      const newComplaint: LegacyComplaint = {
        id: Math.max(...complaints.map(c => c.id)) + 1,
        title: `${formData.type.replace('_', ' ')} Issue`, // Generate title from type
        description: formData.details,
        category: formData.type.replace('_', ' '),
        priority: formData.priority.toLowerCase(),
        status: 'new',
        reportedBy: user?.name || 'Unknown User',
        reportedDate: new Date().toISOString().split('T')[0],
        location: `Block ${blocks.find(b => b.id === formData.blockId)?.name} - Unit ${units.find(u => u.id === formData.unitId)?.unitNumber}`,
        block: blocks.find(b => b.id === formData.blockId)?.name || 'A1',
        unit: units.find(u => u.id === formData.unitId)?.unitNumber,
        isPublic: formData.visibility === 'public', // Use visibility from form
        commentsCount: 0
      };

      // Add the new complaint to the list
      setComplaints(prev => [newComplaint, ...prev]);
      
      // TODO: Replace with actual API call
      console.log('New complaint submitted:', newComplaint);
      console.log('Form data:', formData);
      
    } catch (error) {
      console.error('Error submitting complaint:', error);
      throw error; // Re-throw to show error in form
    }
  };

  // Mock data for blocks and units (used in form)
  const blocks = [
    { id: 1, name: 'A1', societyId: 1 },
    { id: 2, name: 'A2', societyId: 1 },
    { id: 3, name: 'C1', societyId: 1 },
    { id: 4, name: 'C2', societyId: 1 },
    { id: 5, name: 'C3', societyId: 1 }
  ];

  const units = [
    { id: 1001, unitNumber: 'A1-001', blockId: 1, type: '2BHK' },
    { id: 1002, unitNumber: 'A1-002', blockId: 1, type: '3BHK' },
    // Add more units as needed
  ];

  if (loading) {
    return (
      <Container>
        <Title>
          <FiMessageCircle size={32} />
          Complaints Management
        </Title>
        <div>Loading complaints...</div>
      </Container>
    );
  }

  const filteredComplaints = getFilteredComplaints();

  return (
    <Container>
      <Header>
        <Title>
          <FiMessageCircle size={32} />
          Complaints Management
        </Title>
        <HeaderActions>
          <ActionButton onClick={() => setIsFormOpen(true)}>
            <FiPlus size={16} />
            New Complaint
          </ActionButton>
        </HeaderActions>
      </Header>

      <FiltersSection>
        <FilterGrid>
          <SearchInput>
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="search-icon" size={16} />
          </SearchInput>

          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </Select>

          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Security">Security</option>
            <option value="Noise">Noise</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Safety">Safety</option>
          </Select>

          <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>

          <ActionButton 
            className="secondary" 
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            style={{ position: 'relative' }}
          >
            <FiFilter size={16} />
            More Filters
            {showMoreFilters ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
            {getActiveAdvancedFiltersCount() > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: '#EF4444',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {getActiveAdvancedFiltersCount()}
              </span>
            )}
          </ActionButton>
        </FilterGrid>
        
        {/* Advanced Filters Panel */}
        <MoreFiltersPanel isOpen={showMoreFilters}>
          <FilterPanelHeader>
            <FilterPanelTitle>Advanced Filters</FilterPanelTitle>
            <FilterActions>
              <ClearFiltersButton onClick={clearAdvancedFilters}>
                <FiRefreshCw size={14} />
                Clear Filters
              </ClearFiltersButton>
            </FilterActions>
          </FilterPanelHeader>

          <AdvancedFilterGrid>
            <FilterGroup>
              <FilterLabel>Date Range</FilterLabel>
              <DateRangeContainer>
                <DateInput
                  type="date"
                  value={dateFromFilter}
                  onChange={(e) => setDateFromFilter(e.target.value)}
                  placeholder="From date"
                />
                <DateSeparator>to</DateSeparator>
                <DateInput
                  type="date"
                  value={dateToFilter}
                  onChange={(e) => setDateToFilter(e.target.value)}
                  placeholder="To date"
                />
              </DateRangeContainer>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Assignment Status</FilterLabel>
              <Select 
                value={assignedToFilter} 
                onChange={(e) => setAssignedToFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="assigned">Assigned</option>
                <option value="unassigned">Unassigned</option>
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Block</FilterLabel>
              <Select 
                value={blockFilter} 
                onChange={(e) => setBlockFilter(e.target.value)}
              >
                <option value="all">All Blocks</option>
                <option value="A1">Block A1</option>
                <option value="A2">Block A2</option>
                <option value="C1">Block C1</option>
                <option value="C2">Block C2</option>
                <option value="C3">Block C3</option>
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Visibility</FilterLabel>
              <Select 
                value={isPublicFilter} 
                onChange={(e) => setIsPublicFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Comments Activity</FilterLabel>
              <Select 
                value={commentsCountFilter} 
                onChange={(e) => setCommentsCountFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="none">No Comments</option>
                <option value="low">Few Comments (1-3)</option>
                <option value="medium">Some Comments (4-10)</option>
                <option value="high">Many Comments (10+)</option>
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Escalation Level</FilterLabel>
              <Select 
                value={escalationLevelFilter} 
                onChange={(e) => setEscalationLevelFilter(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="0">Level 0 (Initial)</option>
                <option value="1">Level 1 (Escalated)</option>
                <option value="2">Level 2 (High Escalation)</option>
                <option value="3">Level 3+ (Critical)</option>
              </Select>
            </FilterGroup>
          </AdvancedFilterGrid>

          {/* Active Filters Summary */}
          {getActiveFilters().length > 0 && (
            <FilterSummary>
              <FilterLabel>Active Filters:</FilterLabel>
              {getActiveFilters().map((filter) => (
                <FilterTag key={filter.key}>
                  {filter.label}
                  <RemoveFilterButton onClick={() => removeFilter(filter.key)}>
                    <FiX size={12} />
                  </RemoveFilterButton>
                </FilterTag>
              ))}
            </FilterSummary>
          )}
        </MoreFiltersPanel>
      </FiltersSection>

      <TabsContainer>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label} ({tab.count})
          </Tab>
        ))}
      </TabsContainer>

      <ComplaintsGrid>
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map(renderComplaintCard)
        ) : (
          <EmptyState>
            <EmptyStateIcon>
              <FiMessageCircle size={48} />
            </EmptyStateIcon>
            <EmptyStateText>
              {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all'
                ? 'No complaints match your current filters.'
                : 'No complaints found in this section.'}
            </EmptyStateText>
            {activeTab === 'my-complaints' && (
              <ActionButton onClick={() => setIsFormOpen(true)}>
                <FiPlus size={16} />
                Create Your First Complaint
              </ActionButton>
            )}
          </EmptyState>
        )}
      </ComplaintsGrid>
      
      {/* Complaint Form Modal */}
      <ComplaintForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleComplaintSubmit}
      />
    </Container>
  );
};

export default ComplaintsPage;