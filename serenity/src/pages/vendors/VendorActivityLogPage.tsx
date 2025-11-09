import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import {
  FiActivity,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiUser,
  FiEye,
  FiRefreshCw,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiEdit,
  FiTrash2,
  FiFileText,
  FiDollarSign,
  FiSettings,
  FiMail,
  FiPhone,
  FiPlus,
  FiMinus,
  FiArrowUp,
  FiArrowDown,
  FiTrendingUp,
  FiTrendingDown,
  FiMoreHorizontal,
  FiDownload,
  FiUpload
} from 'react-icons/fi';
import VendorActivityLogModal from './VendorActivityLogModal';
import { toast } from 'react-toastify';

// Activity Log Interface
interface VendorActivity {
  id: number;
  vendorId: number;
  vendorName: string;
  activityType: 'profile_update' | 'document_upload' | 'verification' | 'payment' | 'service_update' | 'login' | 'registration' | 'contract' | 'communication' | 'system';
  action: string;
  description: string;
  timestamp: Date;
  performedBy: string;
  performedById: number;
  ipAddress?: string;
  userAgent?: string;
  previousValue?: string;
  newValue?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'completed' | 'in_progress' | 'failed' | 'pending';
  relatedEntityType?: string;
  relatedEntityId?: number;
  metadata?: Record<string, any>;
  isSystemGenerated: boolean;
}

// Styled Components
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  gap: ${({ theme }) => theme.spacing[4]};
  flex-wrap: wrap;
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
  margin-left: auto;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const StatIconWrapper = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ color }) => color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const FiltersContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: end;
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

const FilterInput = styled.input`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
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

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const ActivityContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  overflow: hidden;
`;

const ActivityHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActivityTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const ActivityList = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;

const ActivityItem = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: flex-start;
  transition: ${({ theme }) => theme.transition.all};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIconWrapper = styled.div<{ activityType: string; severity: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  ${({ activityType, severity, theme }) => {
    const getColor = () => {
      if (severity === 'critical') return theme.colors.error[500];
      if (severity === 'high') return theme.colors.warning[500];
      if (activityType === 'verification') return theme.colors.success[500];
      if (activityType === 'payment') return theme.colors.primary[500];
      return theme.colors.gray[500];
    };
    
    const color = getColor();
    return `
      background: ${color}20;
      color: ${color};
    `;
  }}
`;

const ActivityContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ActivityMainInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ActivityAction = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const ActivityTimestamp = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  flex-shrink: 0;
`;

const ActivityDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  line-height: 1.5;
`;

const ActivityMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
`;

const ActivityMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const ActivityStatus = styled.div<{ status: string }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: capitalize;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'completed':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[800]};
        `;
      case 'in_progress':
        return `
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[800]};
        `;
      case 'failed':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[800]};
        `;
      case 'pending':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[800]};
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[800]};
        `;
    }
  }}
`;

const SeverityBadge = styled.div<{ severity: string }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: capitalize;
  
  ${({ severity, theme }) => {
    switch (severity) {
      case 'critical':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[800]};
        `;
      case 'high':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[800]};
        `;
      case 'medium':
        return `
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[800]};
        `;
      case 'low':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[800]};
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[800]};
        `;
    }
  }}
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  ${({ variant = 'secondary', theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary[600]};
          color: ${theme.colors.white};
          border-color: ${theme.colors.primary[600]};
          
          &:hover {
            background: ${theme.colors.primary[700]};
            border-color: ${theme.colors.primary[700]};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error[600]};
          color: ${theme.colors.white};
          border-color: ${theme.colors.error[600]};
          
          &:hover {
            background: ${theme.colors.error[700]};
            border-color: ${theme.colors.error[700]};
          }
        `;
      default:
        return `
          background: ${theme.colors.white};
          color: ${theme.colors.gray[700]};
          border-color: ${theme.colors.gray[300]};
          
          &:hover {
            background: ${theme.colors.gray[50]};
            border-color: ${theme.colors.gray[400]};
          }
        `;
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[300]};
`;

const EmptyStateText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const EmptyStateDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const VendorActivityLogPage: React.FC = () => {
  const [activities, setActivities] = useState<VendorActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<VendorActivity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const [filterActivityType, setFilterActivityType] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterPerformedBy, setFilterPerformedBy] = useState('');

  // Load activities
  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockActivities: VendorActivity[] = [
        {
          id: 1,
          vendorId: 1,
          vendorName: 'TechCorp Solutions',
          activityType: 'profile_update',
          action: 'Profile Information Updated',
          description: 'Updated contact information including phone number and email address',
          timestamp: new Date(),
          performedBy: 'John Smith',
          performedById: 101,
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          previousValue: 'old_email@example.com',
          newValue: 'new_email@techcorp.com',
          severity: 'low',
          status: 'completed',
          relatedEntityType: 'vendor_profile',
          relatedEntityId: 1,
          isSystemGenerated: false
        },
        {
          id: 2,
          vendorId: 2,
          vendorName: 'BuildPro Services',
          activityType: 'document_upload',
          action: 'Document Uploaded',
          description: 'Uploaded insurance certificate for verification',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          performedBy: 'Sarah Johnson',
          performedById: 102,
          severity: 'medium',
          status: 'pending',
          relatedEntityType: 'document',
          relatedEntityId: 25,
          isSystemGenerated: false
        },
        {
          id: 3,
          vendorId: 1,
          vendorName: 'TechCorp Solutions',
          activityType: 'verification',
          action: 'Verification Completed',
          description: 'All required documents have been verified and approved',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          performedBy: 'Admin System',
          performedById: 0,
          severity: 'high',
          status: 'completed',
          isSystemGenerated: true
        },
        {
          id: 4,
          vendorId: 3,
          vendorName: 'CleanCo Services',
          activityType: 'payment',
          action: 'Payment Processed',
          description: 'Monthly service payment of $2,500.00 processed successfully',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          performedBy: 'Finance Team',
          performedById: 103,
          severity: 'medium',
          status: 'completed',
          relatedEntityType: 'payment',
          relatedEntityId: 150,
          isSystemGenerated: false
        },
        {
          id: 5,
          vendorId: 2,
          vendorName: 'BuildPro Services',
          activityType: 'service_update',
          action: 'Service Portfolio Updated',
          description: 'Added new construction services and updated pricing',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          performedBy: 'Mike Wilson',
          performedById: 104,
          severity: 'low',
          status: 'completed',
          isSystemGenerated: false
        },
        {
          id: 6,
          vendorId: 4,
          vendorName: 'GreenSpace Landscaping',
          activityType: 'login',
          action: 'Vendor Login',
          description: 'Vendor logged into the system',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          performedBy: 'GreenSpace Admin',
          performedById: 105,
          ipAddress: '10.0.0.50',
          severity: 'low',
          status: 'completed',
          isSystemGenerated: true
        },
        {
          id: 7,
          vendorId: 5,
          vendorName: 'SecureGuard Security',
          activityType: 'registration',
          action: 'New Vendor Registration',
          description: 'New vendor completed registration process',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          performedBy: 'SecureGuard Admin',
          performedById: 106,
          severity: 'medium',
          status: 'completed',
          isSystemGenerated: false
        },
        {
          id: 8,
          vendorId: 1,
          vendorName: 'TechCorp Solutions',
          activityType: 'contract',
          action: 'Contract Renewal',
          description: 'Annual service contract renewed for 2025-2026',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000),
          performedBy: 'Legal Team',
          performedById: 107,
          severity: 'high',
          status: 'completed',
          relatedEntityType: 'contract',
          relatedEntityId: 89,
          isSystemGenerated: false
        }
      ];
      
      setActivities(mockActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
      toast.error('Failed to load activity log');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search activities
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesSearch = !searchTerm || 
        activity.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.performedBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesVendor = !filterVendor || activity.vendorName === filterVendor;
      const matchesActivityType = !filterActivityType || activity.activityType === filterActivityType;
      const matchesSeverity = !filterSeverity || activity.severity === filterSeverity;
      const matchesStatus = !filterStatus || activity.status === filterStatus;
      const matchesPerformedBy = !filterPerformedBy || activity.performedBy === filterPerformedBy;
      
      const matchesDateFrom = !filterDateFrom || activity.timestamp >= new Date(filterDateFrom);
      const matchesDateTo = !filterDateTo || activity.timestamp <= new Date(filterDateTo + 'T23:59:59');
      
      return matchesSearch && matchesVendor && matchesActivityType && 
             matchesSeverity && matchesStatus && matchesPerformedBy &&
             matchesDateFrom && matchesDateTo;
    });
  }, [activities, searchTerm, filterVendor, filterActivityType, filterSeverity, 
      filterStatus, filterPerformedBy, filterDateFrom, filterDateTo]);

  // Get unique values for filters
  const uniqueVendors = useMemo(() => 
    Array.from(new Set(activities.map(a => a.vendorName))).sort(), 
    [activities]
  );
  
  const uniquePerformedBy = useMemo(() => 
    Array.from(new Set(activities.map(a => a.performedBy))).sort(), 
    [activities]
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredActivities.length;
    const today = filteredActivities.filter(a => 
      new Date(a.timestamp).toDateString() === new Date().toDateString()
    ).length;
    const critical = filteredActivities.filter(a => a.severity === 'critical').length;
    const failed = filteredActivities.filter(a => a.status === 'failed').length;
    
    return { total, today, critical, failed };
  }, [filteredActivities]);

  const handleActivityClick = (activity: VendorActivity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    loadActivities();
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'profile_update': return FiUser;
      case 'document_upload': return FiUpload;
      case 'verification': return FiCheckCircle;
      case 'payment': return FiDollarSign;
      case 'service_update': return FiSettings;
      case 'login': return FiActivity;
      case 'registration': return FiPlus;
      case 'contract': return FiFileText;
      case 'communication': return FiMail;
      case 'system': return FiSettings;
      default: return FiActivity;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    
    return timestamp.toLocaleDateString();
  };

  return (
    <Container>
      <Header>
        <Title>
          <FiActivity />
          Vendor Activity Log
        </Title>
        <HeaderActions>
          <Button onClick={handleRefresh}>
            <FiRefreshCw />
            Refresh
          </Button>
          <Button>
            <FiDownload />
            Export Log
          </Button>
        </HeaderActions>
      </Header>

      <StatsContainer>
        <StatCard>
          <StatIconWrapper color="#3B82F6">
            <FiActivity />
          </StatIconWrapper>
          <StatContent>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total Activities</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIconWrapper color="#10B981">
            <FiTrendingUp />
          </StatIconWrapper>
          <StatContent>
            <StatValue>{stats.today}</StatValue>
            <StatLabel>Today's Activities</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIconWrapper color="#EF4444">
            <FiAlertTriangle />
          </StatIconWrapper>
          <StatContent>
            <StatValue>{stats.critical}</StatValue>
            <StatLabel>Critical Activities</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIconWrapper color="#F59E0B">
            <FiXCircle />
          </StatIconWrapper>
          <StatContent>
            <StatValue>{stats.failed}</StatValue>
            <StatLabel>Failed Activities</StatLabel>
          </StatContent>
        </StatCard>
      </StatsContainer>

      <FiltersContainer>
        <FiltersGrid>
          <FilterGroup>
            <FilterLabel>Search</FilterLabel>
            <FilterInput
              type="text"
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Vendor</FilterLabel>
            <FilterSelect
              value={filterVendor}
              onChange={(e) => setFilterVendor(e.target.value)}
            >
              <option value="">All Vendors</option>
              {uniqueVendors.map(vendor => (
                <option key={vendor} value={vendor}>{vendor}</option>
              ))}
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Activity Type</FilterLabel>
            <FilterSelect
              value={filterActivityType}
              onChange={(e) => setFilterActivityType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="profile_update">Profile Update</option>
              <option value="document_upload">Document Upload</option>
              <option value="verification">Verification</option>
              <option value="payment">Payment</option>
              <option value="service_update">Service Update</option>
              <option value="login">Login</option>
              <option value="registration">Registration</option>
              <option value="contract">Contract</option>
              <option value="communication">Communication</option>
              <option value="system">System</option>
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Severity</FilterLabel>
            <FilterSelect
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
            >
              <option value="">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Status</FilterLabel>
            <FilterSelect
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Performed By</FilterLabel>
            <FilterSelect
              value={filterPerformedBy}
              onChange={(e) => setFilterPerformedBy(e.target.value)}
            >
              <option value="">All Users</option>
              {uniquePerformedBy.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Date From</FilterLabel>
            <FilterInput
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
            />
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Date To</FilterLabel>
            <FilterInput
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
            />
          </FilterGroup>
        </FiltersGrid>
      </FiltersContainer>

      <ActivityContainer>
        <ActivityHeader>
          <ActivityTitle>
            Activity Timeline ({filteredActivities.length} activities)
          </ActivityTitle>
        </ActivityHeader>
        
        <ActivityList>
          {loading ? (
            <EmptyState>
              <EmptyStateIcon>
                <FiRefreshCw />
              </EmptyStateIcon>
              <EmptyStateText>Loading Activities...</EmptyStateText>
              <EmptyStateDescription>Please wait while we fetch the activity log</EmptyStateDescription>
            </EmptyState>
          ) : filteredActivities.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>
                <FiActivity />
              </EmptyStateIcon>
              <EmptyStateText>No Activities Found</EmptyStateText>
              <EmptyStateDescription>
                No activities match your current filters. Try adjusting your search criteria.
              </EmptyStateDescription>
            </EmptyState>
          ) : (
            filteredActivities.map((activity) => {
              const IconComponent = getActivityIcon(activity.activityType);
              
              return (
                <ActivityItem key={activity.id} onClick={() => handleActivityClick(activity)}>
                  <ActivityIconWrapper 
                    activityType={activity.activityType} 
                    severity={activity.severity}
                  >
                    <IconComponent />
                  </ActivityIconWrapper>
                  
                  <ActivityContent>
                    <ActivityMainInfo>
                      <ActivityAction>{activity.action}</ActivityAction>
                      <ActivityTimestamp>{formatTimestamp(activity.timestamp)}</ActivityTimestamp>
                    </ActivityMainInfo>
                    
                    <ActivityDescription>{activity.description}</ActivityDescription>
                    
                    <ActivityMeta>
                      <ActivityMetaItem>
                        <FiUser />
                        {activity.vendorName}
                      </ActivityMetaItem>
                      
                      <ActivityMetaItem>
                        <FiUser />
                        by {activity.performedBy}
                      </ActivityMetaItem>
                      
                      {activity.ipAddress && (
                        <ActivityMetaItem>
                          IP: {activity.ipAddress}
                        </ActivityMetaItem>
                      )}
                      
                      <ActivityStatus status={activity.status}>
                        {activity.status.replace('_', ' ')}
                      </ActivityStatus>
                      
                      <SeverityBadge severity={activity.severity}>
                        {activity.severity}
                      </SeverityBadge>
                      
                      {activity.isSystemGenerated && (
                        <ActivityMetaItem>
                          <FiSettings />
                          System Generated
                        </ActivityMetaItem>
                      )}
                    </ActivityMeta>
                  </ActivityContent>
                </ActivityItem>
              );
            })
          )}
        </ActivityList>
      </ActivityContainer>

      {selectedActivity && (
        <VendorActivityLogModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedActivity(null);
          }}
          activity={selectedActivity}
        />
      )}
    </Container>
  );
};

export default VendorActivityLogPage;