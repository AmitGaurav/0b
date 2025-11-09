import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiClock,
  FiUser,
  FiMapPin,
  FiAlertCircle,
  FiCheckCircle,
  FiXCircle,
  FiTool,
  FiCalendar,
  FiDollarSign,
  FiStar,
  FiMessageCircle,
  FiPaperclip
} from 'react-icons/fi';
import {
  MaintenanceRequest,
  MaintenanceRequestType,
  MaintenanceRequestStatus,
  MaintenanceRequestPriority,
  MaintenanceRequestLocation,
  MaintenanceRequestStats,
  MaintenanceRequestTechnician,
  CreateMaintenanceRequestData,
  MAINTENANCE_REQUEST_TYPE_LABELS,
  MAINTENANCE_REQUEST_STATUS_LABELS,
  MAINTENANCE_REQUEST_PRIORITY_LABELS,
  MAINTENANCE_REQUEST_LOCATION_LABELS
} from '../../types/maintenance-requests';
import NewMaintenanceRequestForm from './NewMaintenanceRequestForm';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
  flex-wrap: wrap;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 1px solid;

  &.primary {
    background: ${({ theme }) => theme.colors.primary[500]};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary[500]};

    &:hover {
      background: ${({ theme }) => theme.colors.primary[600]};
      border-color: ${({ theme }) => theme.colors.primary[600]};
    }
  }

  &.secondary {
    background: white;
    color: ${({ theme }) => theme.colors.gray[600]};
    border-color: ${({ theme }) => theme.colors.gray[300]};

    &:hover {
      background: ${({ theme }) => theme.colors.gray[50]};
      border-color: ${({ theme }) => theme.colors.gray[400]};
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const StatCard = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const FilterSection = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const FilterRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
  flex-wrap: wrap;
`;

const SearchInput = styled.div`
  position: relative;
  min-width: 300px;

  input {
    width: 100%;
    padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[10]};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary[500]};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    }
  }

  svg {
    position: absolute;
    left: ${({ theme }) => theme.spacing[3]};
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  min-width: 150px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const RequestsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const RequestCard = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const RequestHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const RequestTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
`;

const RequestId = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  background: ${({ theme }) => theme.colors.gray[100]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ActionMenu = styled.div`
  position: relative;

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: ${({ theme }) => theme.colors.gray[100]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    color: ${({ theme }) => theme.colors.gray[600]};
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    &:hover {
      background: ${({ theme }) => theme.colors.gray[200]};
    }
  }
`;

const RequestContent = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const RequestRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};

  svg {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const Badge = styled.span<{ variant: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

  ${({ variant, theme }) => {
    switch (variant) {
      case 'submitted':
        return `background: ${theme.colors.info[100]}; color: ${theme.colors.info[800]};`;
      case 'acknowledged':
        return `background: ${theme.colors.warning[100]}; color: ${theme.colors.warning[800]};`;
      case 'assigned':
        return `background: ${theme.colors.secondary[100]}; color: ${theme.colors.secondary[800]};`;
      case 'in-progress':
        return `background: ${theme.colors.warning[100]}; color: ${theme.colors.warning[800]};`;
      case 'completed':
        return `background: ${theme.colors.success[100]}; color: ${theme.colors.success[800]};`;
      case 'cancelled':
      case 'rejected':
        return `background: ${theme.colors.error[100]}; color: ${theme.colors.error[800]};`;
      case 'emergency':
        return `background: ${theme.colors.error[100]}; color: ${theme.colors.error[800]};`;
      case 'urgent':
        return `background: ${theme.colors.warning[100]}; color: ${theme.colors.warning[800]};`;
      case 'high':
        return `background: ${theme.colors.warning[100]}; color: ${theme.colors.warning[800]};`;
      case 'medium':
        return `background: ${theme.colors.info[100]}; color: ${theme.colors.info[800]};`;
      case 'low':
        return `background: ${theme.colors.gray[100]}; color: ${theme.colors.gray[800]};`;
      default:
        return `background: ${theme.colors.gray[100]}; color: ${theme.colors.gray[800]};`;
    }
  }}
`;

const RequestDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0;
  line-height: 1.5;
`;

const TechnicianInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const TechnicianAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const TechnicianDetails = styled.div`
  flex: 1;

  .name {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[800]};
    margin-bottom: ${({ theme }) => theme.spacing[1]};
  }

  .specialization {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.gray[600]};
  }
`;

const TechnicianRating = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

// Mock Data
const mockTechnicians: MaintenanceRequestTechnician[] = [
  {
    id: '1',
    name: 'John Smith',
    specialization: [MaintenanceRequestType.PLUMBING, MaintenanceRequestType.GENERAL],
    phone: '+1-555-0101',
    email: 'john.smith@maintenance.com',
    rating: 4.8,
    totalJobs: 156,
    isAvailable: true
  },
  {
    id: '2', 
    name: 'Sarah Johnson',
    specialization: [MaintenanceRequestType.ELECTRICAL, MaintenanceRequestType.HVAC],
    phone: '+1-555-0102',
    email: 'sarah.johnson@maintenance.com',
    rating: 4.9,
    totalJobs: 203,
    isAvailable: true
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    specialization: [MaintenanceRequestType.CARPENTRY, MaintenanceRequestType.PAINTING],
    phone: '+1-555-0103',
    email: 'mike.rodriguez@maintenance.com',
    rating: 4.7,
    totalJobs: 189,
    isAvailable: false
  }
];

const mockRequests: MaintenanceRequest[] = [
  {
    id: 'REQ-001',
    title: 'Kitchen Sink Leakage',
    description: 'The kitchen sink has been leaking under the counter for the past two days. Water is pooling and may cause damage to the cabinet.',
    type: MaintenanceRequestType.PLUMBING,
    priority: MaintenanceRequestPriority.HIGH,
    status: MaintenanceRequestStatus.IN_PROGRESS,
    location: MaintenanceRequestLocation.APARTMENT,
    unitNumber: 'A-301',
    requestedBy: {
      id: '1',
      name: 'Alice Johnson',
      phone: '+1-555-1001',
      email: 'alice.johnson@email.com',
      unitNumber: 'A-301'
    },
    assignedTechnician: mockTechnicians[0],
    attachments: [],
    comments: [],
    history: [],
    createdAt: new Date('2025-09-19T09:30:00'),
    updatedAt: new Date('2025-09-20T14:15:00'),
    acknowledgedAt: new Date('2025-09-19T10:00:00'),
    assignedAt: new Date('2025-09-19T11:30:00'),
    startedAt: new Date('2025-09-20T08:00:00'),
    estimatedCost: 150,
    estimatedDuration: 2,
    tags: ['urgent', 'water-damage']
  },
  {
    id: 'REQ-002',
    title: 'Elevator Not Working',
    description: 'Main elevator is stuck on the 5th floor and not responding to calls. Residents are using stairs.',
    type: MaintenanceRequestType.ELEVATOR,
    priority: MaintenanceRequestPriority.EMERGENCY,
    status: MaintenanceRequestStatus.ASSIGNED,
    location: MaintenanceRequestLocation.ELEVATOR,
    requestedBy: {
      id: '2',
      name: 'Building Security',
      phone: '+1-555-2001',
      email: 'security@building.com',
      unitNumber: 'N/A'
    },
    assignedTechnician: mockTechnicians[1],
    attachments: [],
    comments: [],
    history: [],
    createdAt: new Date('2025-09-21T07:45:00'),
    updatedAt: new Date('2025-09-21T08:00:00'),
    acknowledgedAt: new Date('2025-09-21T07:50:00'),
    assignedAt: new Date('2025-09-21T08:00:00'),
    estimatedCost: 800,
    estimatedDuration: 4,
    tags: ['emergency', 'elevator']
  },
  {
    id: 'REQ-003',
    title: 'AC Not Cooling Properly',
    description: 'The air conditioning unit in the bedroom is running but not cooling effectively. Temperature stays around 78°F.',
    type: MaintenanceRequestType.HVAC,
    priority: MaintenanceRequestPriority.MEDIUM,
    status: MaintenanceRequestStatus.COMPLETED,
    location: MaintenanceRequestLocation.APARTMENT,
    unitNumber: 'B-205',
    requestedBy: {
      id: '3',
      name: 'Robert Chen',
      phone: '+1-555-3001', 
      email: 'robert.chen@email.com',
      unitNumber: 'B-205'
    },
    assignedTechnician: mockTechnicians[1],
    attachments: [],
    comments: [],
    history: [],
    createdAt: new Date('2025-09-18T16:20:00'),
    updatedAt: new Date('2025-09-19T17:30:00'),
    acknowledgedAt: new Date('2025-09-18T17:00:00'),
    assignedAt: new Date('2025-09-19T08:00:00'),
    startedAt: new Date('2025-09-19T14:00:00'),
    completedAt: new Date('2025-09-19T17:30:00'),
    estimatedCost: 200,
    actualCost: 180,
    estimatedDuration: 3,
    actualDuration: 2.5,
    tags: ['hvac', 'cooling']
  },
  {
    id: 'REQ-004',
    title: 'Gym Equipment Maintenance',
    description: 'Regular monthly maintenance for all gym equipment including treadmills, ellipticals, and weight machines.',
    type: MaintenanceRequestType.GENERAL,
    priority: MaintenanceRequestPriority.LOW,
    status: MaintenanceRequestStatus.SUBMITTED,
    location: MaintenanceRequestLocation.COMMON_AREA,
    requestedBy: {
      id: '4',
      name: 'Facility Manager',
      phone: '+1-555-4001',
      email: 'facility@building.com',
      unitNumber: 'N/A'
    },
    attachments: [],
    comments: [],
    history: [],
    createdAt: new Date('2025-09-21T09:00:00'),
    updatedAt: new Date('2025-09-21T09:00:00'),
    estimatedCost: 500,
    estimatedDuration: 6,
    recurring: {
      isRecurring: true,
      frequency: 'monthly',
      nextDueDate: new Date('2025-10-21T09:00:00')
    },
    tags: ['preventive', 'gym', 'equipment']
  },
  {
    id: 'REQ-005',
    title: 'Parking Garage Light Replacement',
    description: 'Several LED lights in the parking garage need replacement. Areas are poorly lit during evening hours.',
    type: MaintenanceRequestType.ELECTRICAL,
    priority: MaintenanceRequestPriority.MEDIUM,
    status: MaintenanceRequestStatus.ACKNOWLEDGED,
    location: MaintenanceRequestLocation.PARKING,
    requestedBy: {
      id: '5',
      name: 'Maria Gonzalez',
      phone: '+1-555-5001',
      email: 'maria.gonzalez@email.com',
      unitNumber: 'C-102'
    },
    attachments: [],
    comments: [],
    history: [],
    createdAt: new Date('2025-09-20T18:30:00'),
    updatedAt: new Date('2025-09-20T19:15:00'),
    acknowledgedAt: new Date('2025-09-20T19:15:00'),
    estimatedCost: 300,
    estimatedDuration: 4,
    tags: ['lighting', 'safety', 'parking']
  },
  {
    id: 'REQ-006',
    title: 'Garden Sprinkler System Repair',
    description: 'Automatic sprinkler system in the front garden is not working. Some zones are not getting water.',
    type: MaintenanceRequestType.LANDSCAPING,
    priority: MaintenanceRequestPriority.LOW,
    status: MaintenanceRequestStatus.ON_HOLD,
    location: MaintenanceRequestLocation.GARDEN,
    requestedBy: {
      id: '6',
      name: 'David Kim',
      phone: '+1-555-6001',
      email: 'david.kim@email.com',
      unitNumber: 'A-105'
    },
    attachments: [],
    comments: [],
    history: [],
    createdAt: new Date('2025-09-17T10:15:00'),
    updatedAt: new Date('2025-09-18T14:30:00'),
    acknowledgedAt: new Date('2025-09-17T11:00:00'),
    assignedAt: new Date('2025-09-18T09:00:00'),
    estimatedCost: 250,
    estimatedDuration: 3,
    tags: ['irrigation', 'landscaping']
  }
];

const MaintenanceRequestsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isNewRequestFormOpen, setIsNewRequestFormOpen] = useState(false);

  const filteredRequests = useMemo(() => {
    let filtered = [...mockRequests];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(request => 
        request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.requestedBy.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(request => request.type === typeFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(request => request.priority === priorityFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof MaintenanceRequest];
      let bValue: any = b[sortBy as keyof MaintenanceRequest];

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [mockRequests, searchQuery, statusFilter, typeFilter, priorityFilter, sortBy, sortOrder]);

  const stats: MaintenanceRequestStats = useMemo(() => {
    const total = mockRequests.length;
    const submitted = mockRequests.filter(r => r.status === MaintenanceRequestStatus.SUBMITTED).length;
    const inProgress = mockRequests.filter(r => 
      r.status === MaintenanceRequestStatus.IN_PROGRESS || 
      r.status === MaintenanceRequestStatus.ASSIGNED
    ).length;
    const completed = mockRequests.filter(r => r.status === MaintenanceRequestStatus.COMPLETED).length;
    const overdue = mockRequests.filter(r => {
      const daysSinceCreated = (Date.now() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceCreated > 7 && r.status !== MaintenanceRequestStatus.COMPLETED;
    }).length;
    const emergencyCount = mockRequests.filter(r => r.priority === MaintenanceRequestPriority.EMERGENCY).length;

    const completedRequests = mockRequests.filter(r => r.completedAt);
    const avgResolutionTime = completedRequests.length > 0 
      ? completedRequests.reduce((sum, r) => {
          const resolutionTime = (new Date(r.completedAt!).getTime() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60);
          return sum + resolutionTime;
        }, 0) / completedRequests.length
      : 0;

    const totalCost = mockRequests.reduce((sum, r) => sum + (r.actualCost || r.estimatedCost || 0), 0);
    const avgRating = 4.6; // Mock average rating

    return {
      total,
      submitted,
      inProgress,
      completed,
      overdue,
      avgResolutionTime,
      avgRating,
      totalCost,
      emergencyCount
    };
  }, []);

  const formatDuration = (hours: number): string => {
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${hours.toFixed(1)}h`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours.toFixed(1)}h`;
  };

  const getStatusIcon = (status: MaintenanceRequestStatus) => {
    switch (status) {
      case MaintenanceRequestStatus.COMPLETED:
        return <FiCheckCircle />;
      case MaintenanceRequestStatus.IN_PROGRESS:
        return <FiClock />;
      case MaintenanceRequestStatus.CANCELLED:
      case MaintenanceRequestStatus.REJECTED:
        return <FiXCircle />;
      default:
        return <FiAlertCircle />;
    }
  };

  const getPriorityIcon = (priority: MaintenanceRequestPriority) => {
    switch (priority) {
      case MaintenanceRequestPriority.EMERGENCY:
      case MaintenanceRequestPriority.URGENT:
        return <FiAlertCircle />;
      default:
        return null;
    }
  };

  const handleNewRequestSubmit = async (data: CreateMaintenanceRequestData) => {
    try {
      // Mock API call - in real implementation, this would call your API
      console.log('Submitting new maintenance request:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would:
      // 1. Call your API to create the request
      // 2. Refresh the requests list or add the new request to state
      // 3. Show success message
      
      alert('Maintenance request submitted successfully!');
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      alert('Error submitting maintenance request. Please try again.');
    }
  };

  return (
    <PageContainer>
      <Header>
        <Title>Maintenance Requests</Title>
        <ActionButtons>
          <Button className="secondary">
            <FiDownload size={16} />
            Export
          </Button>
          <Button className="primary" onClick={() => setIsNewRequestFormOpen(true)}>
            <FiPlus size={16} />
            New Request
          </Button>
        </ActionButtons>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Requests</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.inProgress}</StatValue>
          <StatLabel>In Progress</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.completed}</StatValue>
          <StatLabel>Completed</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.overdue}</StatValue>
          <StatLabel>Overdue</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{formatDuration(stats.avgResolutionTime)}</StatValue>
          <StatLabel>Avg Resolution Time</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>${stats.totalCost.toLocaleString()}</StatValue>
          <StatLabel>Total Cost</StatLabel>
        </StatCard>
      </StatsGrid>

      <FilterSection>
        <FilterRow>
          <SearchInput>
            <FiSearch size={16} />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchInput>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            {Object.entries(MAINTENANCE_REQUEST_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            {Object.entries(MAINTENANCE_REQUEST_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
          <Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">All Priority</option>
            {Object.entries(MAINTENANCE_REQUEST_PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
          <Select value={`${sortBy}-${sortOrder}`} onChange={(e) => {
            const [field, order] = e.target.value.split('-');
            setSortBy(field);
            setSortOrder(order as 'asc' | 'desc');
          }}>
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="priority-desc">High Priority First</option>
            <option value="status-asc">Status A-Z</option>
          </Select>
        </FilterRow>
      </FilterSection>

      <RequestsGrid>
        {filteredRequests.map((request) => (
          <RequestCard key={request.id}>
            <RequestHeader>
              <div>
                <RequestTitle>{request.title}</RequestTitle>
                <RequestId>{request.id}</RequestId>
              </div>
              <ActionMenu>
                <button>
                  <FiMoreVertical size={16} />
                </button>
              </ActionMenu>
            </RequestHeader>

            <RequestContent>
              <RequestDescription>{request.description}</RequestDescription>
              
              <RequestRow>
                <InfoItem>
                  <FiTool />
                  {MAINTENANCE_REQUEST_TYPE_LABELS[request.type]}
                </InfoItem>
                <InfoItem>
                  <FiMapPin />
                  {MAINTENANCE_REQUEST_LOCATION_LABELS[request.location]}
                  {request.unitNumber && ` - ${request.unitNumber}`}
                </InfoItem>
                <InfoItem>
                  <FiUser />
                  {request.requestedBy.name}
                </InfoItem>
                <InfoItem>
                  <FiCalendar />
                  {new Date(request.createdAt).toLocaleDateString()}
                </InfoItem>
              </RequestRow>

              <RequestRow>
                <Badge variant={request.status}>
                  {getStatusIcon(request.status)}
                  {MAINTENANCE_REQUEST_STATUS_LABELS[request.status]}
                </Badge>
                <Badge variant={request.priority}>
                  {getPriorityIcon(request.priority)}
                  {MAINTENANCE_REQUEST_PRIORITY_LABELS[request.priority]}
                </Badge>
                {request.estimatedCost && (
                  <InfoItem>
                    <FiDollarSign />
                    ${request.estimatedCost}
                    {request.actualCost && request.actualCost !== request.estimatedCost && 
                      ` (Actual: $${request.actualCost})`
                    }
                  </InfoItem>
                )}
                {request.estimatedDuration && (
                  <InfoItem>
                    <FiClock />
                    {formatDuration(request.estimatedDuration)}
                    {request.actualDuration && request.actualDuration !== request.estimatedDuration && 
                      ` (Actual: ${formatDuration(request.actualDuration)})`
                    }
                  </InfoItem>
                )}
              </RequestRow>

              {request.assignedTechnician && (
                <TechnicianInfo>
                  <TechnicianAvatar>
                    {request.assignedTechnician.name.split(' ').map(n => n[0]).join('')}
                  </TechnicianAvatar>
                  <TechnicianDetails>
                    <div className="name">{request.assignedTechnician.name}</div>
                    <div className="specialization">
                      {request.assignedTechnician.specialization
                        .map(s => MAINTENANCE_REQUEST_TYPE_LABELS[s])
                        .join(', ')
                      }
                    </div>
                  </TechnicianDetails>
                  <TechnicianRating>
                    <FiStar />
                    {request.assignedTechnician.rating}
                  </TechnicianRating>
                </TechnicianInfo>
              )}
            </RequestContent>
          </RequestCard>
        ))}
      </RequestsGrid>

      <NewMaintenanceRequestForm
        isOpen={isNewRequestFormOpen}
        onClose={() => setIsNewRequestFormOpen(false)}
        onSubmit={handleNewRequestSubmit}
      />
    </PageContainer>
  );
};

export default MaintenanceRequestsPage;