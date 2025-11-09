import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import {
  FaUsers,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
  FaUpload,
  FaCheck,
  FaTimes,
  FaCog,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUser,
  FaUserCheck,
  FaUserTimes,
  FaUserCog,
  FaClock,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaCar,
  FaFileAlt,
  FaBell,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaExpand,
  FaCompress
} from 'react-icons/fa';
import {
  Member,
  SocietyMemberStatus,
  MemberSearchFilters,
  MemberSortOptions,
  MemberSortField,
  SortDirection,
  BulkAction,
  BulkActionType,
  ExportOptions,
  ExportFormat,
  ExportField,
  PaginationOptions,
  MemberFormData,
  NotificationType,
  VerificationStatus,
  ActivityAction,
  Gender,
  MaritalStatus,
  BloodGroup,
  UnitType,
  OwnershipType,
  VehicleType
} from '../../types/enhanced-member-management';
import {
  MemberRole,
  Permission,
  hasPermission
} from '../../types/member-management';
import MemberModal from '../../components/modals/MemberModal';
import {
  PageContainer,
  PageTitle,
  PageSubtitle,
  ContentCard,
  StatsGrid,
  StatCard as LayoutStatCard,
  StatIcon,
  StatValue,
  StatLabel,
  Button,
  TableContainer as LayoutTableContainer,
  Table as LayoutTable,
  FormInput,
  Badge
} from '../../components/common/PageLayout';

// Styled Components with clean white theme
const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  
  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[3]};
  }
  
  p {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    color: ${({ theme }) => theme.colors.gray[600]};
    max-width: 800px;
    margin: 0 auto;
  }
`;



// Styled Components for filters and controls
const FiltersCard = styled(ContentCard)`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SearchFilterRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto auto;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

const SearchInputContainer = styled.div`
  position: relative;
  
  input {
    width: 100%;
    padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[3]} 48px;
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    background: ${({ theme }) => theme.colors.white};
    transition: ${({ theme }) => theme.transition.colors};
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.gray[500]};
    }
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary[500]};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    }
  }
  
  .search-icon {
    position: absolute;
    left: ${({ theme }) => theme.spacing[3]};
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

const FilterToggleButton = styled(Button)<{ active?: boolean }>`
  ${props => props.active && `
    background: ${props.theme.colors.primary[600]};
    color: ${props.theme.colors.white};
    border-color: ${props.theme.colors.primary[600]};
  `}
`;

const FiltersSection = styled.div<{ show?: boolean }>`
  display: ${props => props.show ? 'block' : 'none'};
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const FilterGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ active?: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  
  ${props => props.active ? `
    background: ${props.theme.colors.primary[600]};
    color: ${props.theme.colors.white};
    border-color: ${props.theme.colors.primary[600]};
  ` : `
    background: ${props.theme.colors.white};
    color: ${props.theme.colors.gray[700]};
    
    &:hover {
      background: ${props.theme.colors.gray[50]};
      border-color: ${props.theme.colors.gray[400]};
    }
  `}
`;

// Enhanced table components for professional look
const TableWrapper = styled(ContentCard)`
  padding: 0;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const TableHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TableTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const TableControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
`;

const ScrollableTableContainer = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  
  /* Custom scrollbar for better UX */
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray[100]};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[400]};
    border-radius: 4px;
    
    &:hover {
      background: ${({ theme }) => theme.colors.gray[500]};
    }
  }
`;

const EnhancedTable = styled.table`
  width: 100%;
  min-width: 1400px; /* Increased to accommodate all columns properly */
  border-collapse: collapse;
  table-layout: fixed; /* Use fixed layout for better column control */
  
  th, td {
    padding: ${({ theme }) => theme.spacing[4]};
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  th {
    background: ${({ theme }) => theme.colors.gray[50]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[700]};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    user-select: none;
    position: sticky;
    top: 0;
    z-index: 10;
    
    &:hover {
      background: ${({ theme }) => theme.colors.gray[100]};
    }
    
    /* Fixed column widths to prevent overlapping */
    &:nth-child(1) { /* Checkbox */
      position: sticky;
      left: 0;
      z-index: 11;
      width: 60px;
      min-width: 60px;
    }
    
    &:nth-child(2) { /* Member */
      position: sticky;
      left: 60px;
      z-index: 11;
      width: 250px;
      min-width: 250px;
    }
    
    &:nth-child(3) { /* Apartment */
      width: 120px;
      min-width: 120px;
    }
    
    &:nth-child(4) { /* Role */
      width: 100px;
      min-width: 100px;
    }
    
    &:nth-child(5) { /* Contact */
      width: 200px;
      min-width: 200px;
    }
    
    &:nth-child(6) { /* Status */
      width: 120px;
      min-width: 120px;
    }
    
    &:nth-child(7) { /* Date Joined */
      width: 140px;
      min-width: 140px;
    }
    
    &:nth-child(8) { /* Last Active */
      width: 140px;
      min-width: 140px;
    }
    
    &:nth-child(9) { /* Duration */
      width: 120px;
      min-width: 120px;
    }
    
    &:nth-child(10) { /* Actions */
      width: 140px;
      min-width: 140px;
    }
  }
  
  tbody tr {
    transition: ${({ theme }) => theme.transition.colors};
    
    &:hover {
      background: ${({ theme }) => theme.colors.primary[50]};
    }
    
    td {
      /* Apply same width constraints to data cells */
      &:nth-child(1) {
        position: sticky;
        left: 0;
        background: ${({ theme }) => theme.colors.white};
        z-index: 9;
        width: 60px;
        min-width: 60px;
      }
      
      &:nth-child(2) {
        position: sticky;
        left: 60px;
        background: ${({ theme }) => theme.colors.white};
        z-index: 9;
        width: 250px;
        min-width: 250px;
      }
      
      &:nth-child(3) { width: 120px; min-width: 120px; }
      &:nth-child(4) { width: 100px; min-width: 100px; }
      &:nth-child(5) { width: 200px; min-width: 200px; }
      &:nth-child(6) { width: 120px; min-width: 120px; }
      &:nth-child(7) { width: 140px; min-width: 140px; }
      &:nth-child(8) { width: 140px; min-width: 140px; }
      &:nth-child(9) { width: 120px; min-width: 120px; }
      &:nth-child(10) { width: 140px; min-width: 140px; }
    }
    
    &:hover td:nth-child(1),
    &:hover td:nth-child(2) {
      background: ${({ theme }) => theme.colors.primary[50]};
    }
  }
  
  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const ColumnHeader = styled.th<{ sortable?: boolean; width?: string }>`
  ${props => props.sortable && `
    cursor: pointer;
    user-select: none;
    
    &:hover {
      background: ${props.theme.colors.gray[100]};
    }
  `}
  
  ${props => props.width && `
    width: ${props.width};
    min-width: ${props.width};
  `}
  
  .header-content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: ${({ theme }) => theme.spacing[2]};
    white-space: nowrap;
  }
`;

const SortIcon = styled.span`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray[500]};
  flex-shrink: 0;
`;

const BulkActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  flex-wrap: wrap;
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing[4]};
  
  span {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.primary[700]};
  }
`;



const MemberCell = styled.td`
  .member-info {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[3]};
  }
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary[500]};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.white};
    font-size: 1.2rem;
  }
  
  .details {
    .name {
      font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
      color: ${({ theme }) => theme.colors.gray[900]};
      margin-bottom: 4px;
    }
    
    .apartment {
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
      color: ${({ theme }) => theme.colors.gray[600]};
    }
  }
`;

const StatusBadge = styled(Badge)<{ status: string }>`
  ${props => {
    switch (props.status.toLowerCase()) {
      case 'active':
        return 'background-color: #10B981; color: white;';
      case 'inactive':
        return 'background-color: #EF4444; color: white;';
      case 'suspended':
        return 'background-color: #F59E0B; color: white;';
      case 'pending_verification':
        return 'background-color: #3B82F6; color: white;';
      default:
        return `background-color: ${props.theme.colors.gray[500]}; color: white;`;
    }
  }}
`;

const RoleBadge = styled(Badge)<{ role: string }>`
  ${props => {
    switch (props.role.toLowerCase()) {
      case 'admin':
        return 'background-color: #8B5CF6; color: white;';
      case 'resident':
        return 'background-color: #3B82F6; color: white;';
      case 'guest':
        return 'background-color: #6B7280; color: white;';
      default:
        return `background-color: ${props.theme.colors.gray[500]}; color: white;`;
    }
  }}
`;

const ActionCell = styled.td`
  .actions {
    display: flex;
    gap: ${({ theme }) => theme.spacing[2]};
  }
  
  .action-btn {
    padding: ${({ theme }) => theme.spacing[2]};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.gray[600]};
    cursor: pointer;
    transition: ${({ theme }) => theme.transition.all};
    
    &:hover {
      transform: scale(1.1);
    }
    
    &.view { 
      &:hover { 
        background: ${({ theme }) => theme.colors.primary[500]};
        color: ${({ theme }) => theme.colors.white};
        border-color: ${({ theme }) => theme.colors.primary[500]};
      } 
    }
    &.edit { 
      &:hover { 
        background: ${({ theme }) => theme.colors.warning[500]};
        color: ${({ theme }) => theme.colors.white};
        border-color: ${({ theme }) => theme.colors.warning[500]};
      } 
    }
    &.delete { 
      &:hover { 
        background: ${({ theme }) => theme.colors.error[500]};
        color: ${({ theme }) => theme.colors.white};
        border-color: ${({ theme }) => theme.colors.error[500]};
      } 
    }
  }
`;

const PaginationContainer = styled(ContentCard)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
`;

const PaginationInfo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${props => props.active 
    ? props.theme.colors.primary[600]
    : props.theme.colors.white
  };
  color: ${props => props.active 
    ? props.theme.colors.white
    : props.theme.colors.gray[700]
  };
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[500]};
    color: ${({ theme }) => theme.colors.white};
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const LoadingSpinner = styled(ContentCard)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[16]};
  
  .spinner {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primary[500]};
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled(ContentCard)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[16]} ${({ theme }) => theme.spacing[6]};
  
  .icon {
    font-size: 4rem;
    margin-bottom: ${({ theme }) => theme.spacing[6]};
    color: ${({ theme }) => theme.colors.gray[400]};
  }
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
  
  p {
    color: ${({ theme }) => theme.colors.gray[600]};
    margin-bottom: ${({ theme }) => theme.spacing[6]};
  }
`;

// Mock data generator
const generateMockMembers = (count: number): Member[] => {
  const names = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Eva Brown', 'Frank Miller', 'Grace Taylor', 'Henry Anderson', 'Ivy Thomas', 'Jack Robinson'];
  const statuses = [SocietyMemberStatus.ACTIVE, SocietyMemberStatus.INACTIVE, SocietyMemberStatus.PENDING_VERIFICATION, SocietyMemberStatus.SUSPENDED];
  const roles = [MemberRole.ADMIN, MemberRole.RESIDENT, MemberRole.GUEST];
  
  return Array.from({ length: count }, (_, i) => {
    const randomName = names[i % names.length];
    return {
      id: `member_${i + 1}`,
      name: `${randomName} ${i + 1}`,
      apartmentNumber: `${Math.floor(Math.random() * 20) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`,
      contactInformation: {
        primaryPhone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        primaryEmail: `${randomName.toLowerCase().replace(' ', '.')}${i + 1}@example.com`,
      },
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      dateJoined: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000),
      lastActiveDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      membershipDuration: Math.floor(Math.random() * 60) + 1,
      notes: `Notes for ${randomName}`,
    } as Member;
  });
};

// Component
interface SocietyMembersPageProps {}

const SocietyMembersPage: React.FC<SocietyMembersPageProps> = () => {
  // State management
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberModalMode, setMemberModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  // Search and Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<MemberSearchFilters>({});
  const [sortOptions, setSortOptions] = useState<MemberSortOptions>({
    field: MemberSortField.NAME,
    direction: SortDirection.ASC
  });
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  });
  
  // Permission checking - Only Super Admin can access all features
  const currentUserRole = MemberRole.ADMIN; // This would come from auth context
  const canManageMembers = hasPermission([currentUserRole], Permission.VIEW_ALL_MEMBERS);
  
  // Mock data for demonstration
  const generateMockMembers = useCallback((): Member[] => {
    const mockMembers: Member[] = [];
    const names = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Emily Davis', 'Chris Miller', 'Anna Garcia'];
    const apartments = ['A101', 'B205', 'C303', 'D401', 'E502', 'F603', 'G701', 'H802'];
    
    for (let i = 0; i < 50; i++) {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomApartment = apartments[Math.floor(Math.random() * apartments.length)] + (i + 1);
      
      mockMembers.push({
        id: `member_${i + 1}`,
        name: `${randomName} ${i + 1}`,
        apartmentNumber: randomApartment,
        role: Object.values(MemberRole)[Math.floor(Math.random() * Object.values(MemberRole).length)],
        contactInformation: {
          primaryPhone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          primaryEmail: `${randomName.toLowerCase().replace(' ', '.')}${i + 1}@example.com`,
          emergencyContactName: 'Emergency Contact',
          emergencyContactPhone: '+91 9876543210',
          emergencyContactRelation: 'Spouse'
        },
        status: Object.values(SocietyMemberStatus)[Math.floor(Math.random() * Object.values(SocietyMemberStatus).length)],
        dateJoined: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000 * 3)),
        lastActiveDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)),
        lastLoginDate: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
        membershipDuration: Math.floor(Math.random() * 36) + 1,
        notes: `Notes for ${randomName}`,
        personalDetails: {
          firstName: randomName.split(' ')[0],
          lastName: randomName.split(' ')[1] || 'Doe',
          dateOfBirth: new Date(1980 + Math.floor(Math.random() * 40), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          gender: Object.values(Gender)[Math.floor(Math.random() * Object.values(Gender).length)],
          nationality: 'Indian',
          occupation: 'Software Engineer',
          maritalStatus: Object.values(MaritalStatus)[Math.floor(Math.random() * Object.values(MaritalStatus).length)]
        },
        familyDetails: [],
        documents: [],
        verificationStatus: Object.values(VerificationStatus)[Math.floor(Math.random() * Object.values(VerificationStatus).length)],
        units: [],
        vehicles: [],
        emergencyContacts: [],
        activityLog: [],
        notifications: {
          emailNotifications: true,
          smsNotifications: true,
          pushNotifications: true,
          whatsappNotifications: false,
          maintenanceReminders: true,
          eventNotifications: true,
          paymentReminders: true,
          securityAlerts: true
        },
        permissions: [],
        createdBy: 'admin',
        createdAt: new Date(),
      });
    }
    
    return mockMembers;
  }, []);
  
  // Initialize data
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const mockMembers = generateMockMembers();
      setMembers(mockMembers);
      setFilteredMembers(mockMembers);
      setPagination(prev => ({
        ...prev,
        totalCount: mockMembers.length,
        totalPages: Math.ceil(mockMembers.length / prev.pageSize)
      }));
      setIsLoading(false);
    }, 1000);
  }, [generateMockMembers]);
  
  // Filter and search logic
  useEffect(() => {
    let filtered = [...members];
    
    // Search functionality
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(term) ||
        member.apartmentNumber.toLowerCase().includes(term) ||
        member.contactInformation.primaryPhone.includes(term) ||
        member.contactInformation.primaryEmail.toLowerCase().includes(term)
      );
    }
    
    // Status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(member => filters.status!.includes(member.status));
    }
    
    // Role filter
    if (filters.role && filters.role.length > 0) {
      filtered = filtered.filter(member => filters.role!.includes(member.role));
    }
    
    // Date filters
    if (filters.dateJoinedFrom) {
      filtered = filtered.filter(member => member.dateJoined >= filters.dateJoinedFrom!);
    }
    
    if (filters.dateJoinedTo) {
      filtered = filtered.filter(member => member.dateJoined <= filters.dateJoinedTo!);
    }
    
    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortOptions.field) {
        case MemberSortField.NAME:
          aValue = a.name;
          bValue = b.name;
          break;
        case MemberSortField.APARTMENT_NUMBER:
          aValue = a.apartmentNumber;
          bValue = b.apartmentNumber;
          break;
        case MemberSortField.DATE_JOINED:
          aValue = a.dateJoined.getTime();
          bValue = b.dateJoined.getTime();
          break;
        case MemberSortField.LAST_ACTIVE_DATE:
          aValue = a.lastActiveDate.getTime();
          bValue = b.lastActiveDate.getTime();
          break;
        case MemberSortField.MEMBERSHIP_DURATION:
          aValue = a.membershipDuration;
          bValue = b.membershipDuration;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOptions.direction === SortDirection.ASC 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortOptions.direction === SortDirection.ASC 
        ? aValue - bValue
        : bValue - aValue;
    });
    
    setFilteredMembers(filtered);
    setPagination(prev => ({
      ...prev,
      page: 1,
      totalCount: filtered.length,
      totalPages: Math.ceil(filtered.length / prev.pageSize)
    }));
  }, [members, searchTerm, filters, sortOptions]);
  
  // Pagination logic
  const paginatedMembers = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredMembers.slice(startIndex, endIndex);
  }, [filteredMembers, pagination.page, pagination.pageSize]);
  
  // Event handlers
  const handleSort = (field: MemberSortField) => {
    setSortOptions(prev => ({
      field,
      direction: prev.field === field && prev.direction === SortDirection.ASC 
        ? SortDirection.DESC 
        : SortDirection.ASC
    }));
  };
  
  const handleSelectMember = (memberId: string, selected: boolean) => {
    if (selected) {
      setSelectedMembers(prev => [...prev, memberId]);
    } else {
      setSelectedMembers(prev => prev.filter(id => id !== memberId));
    }
  };
  
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedMembers(paginatedMembers.map(member => member.id));
    } else {
      setSelectedMembers([]);
    }
  };
  
  const handleBulkAction = (action: BulkActionType) => {
    if (selectedMembers.length === 0) {
      alert('Please select members to perform bulk action');
      return;
    }
    
    const actionText = action.replace('_', ' ').toLowerCase();
    const confirm = window.confirm(`Are you sure you want to ${actionText} ${selectedMembers.length} selected member(s)?`);
    
    if (confirm) {
      // Here you would implement the actual bulk action API call
      console.log(`Performing ${action} on members:`, selectedMembers);
      alert(`Successfully performed ${actionText} on ${selectedMembers.length} member(s)`);
      setSelectedMembers([]);
      
      // Simulate notification
      sendNotification(NotificationType.BULK_ACTION_COMPLETED, {
        action,
        memberCount: selectedMembers.length,
        performedBy: 'Super Admin'
      });
    }
  };
  
  const handleExport = (format: ExportFormat) => {
    const exportData = {
      format,
      members: selectedMembers.length > 0 
        ? filteredMembers.filter(m => selectedMembers.includes(m.id))
        : filteredMembers,
      filters,
      timestamp: new Date()
    };
    
    // Here you would implement the actual export functionality
    console.log('Exporting data:', exportData);
    alert(`Exporting ${exportData.members.length} members to ${format.toUpperCase()} format`);
  };
  
  const handleAddMember = () => {
    setSelectedMember(null);
    setMemberModalMode('add');
    setShowMemberModal(true);
  };
  
  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setMemberModalMode('edit');
    setShowMemberModal(true);
  };
  
  const handleViewMember = (member: Member) => {
    setSelectedMember(member);
    setMemberModalMode('view');
    setShowMemberModal(true);
  };
  
  const handleDeleteMember = (member: Member) => {
    const confirm = window.confirm(`Are you sure you want to delete ${member.name}?`);
    if (confirm) {
      setMembers(prev => prev.filter(m => m.id !== member.id));
      alert(`${member.name} has been deleted successfully`);
      
      // Simulate notification
      sendNotification(NotificationType.MEMBER_DELETED, {
        memberName: member.name,
        performedBy: 'Super Admin'
      });
    }
  };
  
  const handleSaveMember = async (memberData: MemberFormData) => {
    try {
      if (memberModalMode === 'add') {
        // Create new member
        const newMember: Member = {
          id: `member_${Date.now()}`,
          name: `${memberData.personalDetails.firstName} ${memberData.personalDetails.lastName}`,
          apartmentNumber: 'TBD', // This would come from unit selection
          role: memberData.role,
          contactInformation: memberData.contactInformation,
          status: memberData.status,
          dateJoined: new Date(),
          lastActiveDate: new Date(),
          membershipDuration: 0,
          notes: memberData.notes,
          personalDetails: memberData.personalDetails,
          familyDetails: [],
          documents: [],
          verificationStatus: VerificationStatus.PENDING,
          units: [],
          vehicles: [],
          emergencyContacts: [],
          activityLog: [],
          notifications: memberData.notifications,
          permissions: memberData.permissions,
          createdBy: 'Super Admin',
          createdAt: new Date(),
          profilePicture: memberData.profilePicture ? URL.createObjectURL(memberData.profilePicture) : undefined
        };
        
        setMembers(prev => [...prev, newMember]);
        
        // Send notification
        sendNotification(NotificationType.MEMBER_ADDED, {
          memberName: newMember.name,
          performedBy: 'Super Admin'
        });
        
        alert('Member added successfully!');
        
      } else if (memberModalMode === 'edit' && selectedMember) {
        // Update existing member
        const updatedMember: Member = {
          ...selectedMember,
          name: `${memberData.personalDetails.firstName} ${memberData.personalDetails.lastName}`,
          role: memberData.role,
          contactInformation: memberData.contactInformation,
          status: memberData.status,
          notes: memberData.notes,
          personalDetails: memberData.personalDetails,
          notifications: memberData.notifications,
          permissions: memberData.permissions,
          updatedBy: 'Super Admin',
          updatedAt: new Date(),
          profilePicture: memberData.profilePicture ? URL.createObjectURL(memberData.profilePicture) : selectedMember.profilePicture
        };
        
        setMembers(prev => prev.map(m => m.id === selectedMember.id ? updatedMember : m));
        
        // Send notification
        sendNotification(NotificationType.MEMBER_UPDATED, {
          memberName: updatedMember.name,
          performedBy: 'Super Admin'
        });
        
        alert('Member updated successfully!');
      }
    } catch (error) {
      console.error('Error saving member:', error);
      alert('Error saving member. Please try again.');
    }
  };
  
  const sendNotification = (type: NotificationType, data: any) => {
    // Simulate notification system
    console.log(`Notification sent: ${type}`, data);
  };
  
  // Helper functions
  const getSortIcon = (field: MemberSortField) => {
    if (sortOptions.field !== field) return <FaSort />;
    return sortOptions.direction === SortDirection.ASC ? <FaSortUp /> : <FaSortDown />;
  };
  
  const getStatusIcon = (status: SocietyMemberStatus) => {
    switch (status) {
      case SocietyMemberStatus.ACTIVE: return <FaCheckCircle style={{ color: '#4CAF50' }} />;
      case SocietyMemberStatus.INACTIVE: return <FaTimes style={{ color: '#f44336' }} />;
      case SocietyMemberStatus.SUSPENDED: return <FaExclamationTriangle style={{ color: '#FF9800' }} />;
      default: return <FaClock style={{ color: '#2196F3' }} />;
    }
  };
  
  const getRoleIcon = (role: MemberRole) => {
    switch (role) {
      case MemberRole.ADMIN: return <FaUserCog />;
      case MemberRole.COMMITTEE_MEMBER: return <FaUserCheck />;
      case MemberRole.RESIDENT: return <FaUser />;
      case MemberRole.GUEST: return <FaUserTimes />;
      default: return <FaUser />;
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatDuration = (months: number) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) return `${remainingMonths}m`;
    if (remainingMonths === 0) return `${years}y`;
    return `${years}y ${remainingMonths}m`;
  };
  
  // Calculate stats
  const stats = useMemo(() => {
    const total = members.length;
    const active = members.filter(m => m.status === SocietyMemberStatus.ACTIVE).length;
    const inactive = members.filter(m => m.status === SocietyMemberStatus.INACTIVE).length;
    const pending = members.filter(m => m.status === SocietyMemberStatus.PENDING_VERIFICATION).length;
    const newThisMonth = members.filter(m => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return m.dateJoined >= monthAgo;
    }).length;
    
    return { total, active, inactive, pending, newThisMonth };
  }, [members]);
  
  if (!canManageMembers) {
    return (
      <PageContainer>
        <Header>
          <h1><FaUsers /> Society Members Management</h1>
          <p>Super Admin access required to manage society members</p>
        </Header>
        <EmptyState>
          <div className="icon">
            <FaUsers />
          </div>
          <h3>Access Restricted</h3>
          <p>You don't have permission to access member management features.</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
            Only super administrators can view and manage society members.
          </p>
        </EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <h1><FaUsers /> Society Members Management</h1>
        <p>Comprehensive member management system with advanced features for super administrators</p>
      </Header>
      
      {/* Statistics Dashboard */}
      <StatsGrid>
        <LayoutStatCard>
          <StatIcon color="#4CAF50">
            <FaUsers />
          </StatIcon>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Members</StatLabel>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#4CAF50">
            <FaCheckCircle />
          </StatIcon>
          <StatValue>{stats.active}</StatValue>
          <StatLabel>Active Members</StatLabel>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#f44336">
            <FaTimes />
          </StatIcon>
          <StatValue>{stats.inactive}</StatValue>
          <StatLabel>Inactive Members</StatLabel>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#FF9800">
            <FaClock />
          </StatIcon>
          <StatValue>{stats.pending}</StatValue>
          <StatLabel>Pending Verification</StatLabel>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#2196F3">
            <FaCalendarAlt />
          </StatIcon>
          <StatValue>{stats.newThisMonth}</StatValue>
          <StatLabel>New This Month</StatLabel>
        </LayoutStatCard>
      </StatsGrid>
      
      {/* Search and Filter Controls */}
      <FiltersCard>
        <SearchFilterRow>
          <SearchInputContainer>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, apartment, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInputContainer>
          
          <FilterToggleButton 
            active={showFilters}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            Filters
          </FilterToggleButton>
          
          <Button onClick={handleAddMember} variant="primary">
            <FaPlus />
            Add Member
          </Button>
          
          <Button onClick={() => handleExport(ExportFormat.CSV)} variant="secondary">
            <FaDownload />
            Export
          </Button>
        </SearchFilterRow>
        
        {/* Filter Options */}
        <FiltersSection show={showFilters}>
          <FilterGroup>
            <FilterLabel>Member Status</FilterLabel>
            <FilterButtons>
              <FilterButton 
                active={!filters.status}
                onClick={() => setFilters(prev => ({ ...prev, status: undefined }))}
              >
                All
              </FilterButton>
              <FilterButton 
                active={filters.status === SocietyMemberStatus.ACTIVE}
                onClick={() => setFilters(prev => ({ ...prev, status: SocietyMemberStatus.ACTIVE }))}
              >
                <FaCheckCircle /> Active
              </FilterButton>
              <FilterButton 
                active={filters.status === SocietyMemberStatus.INACTIVE}
                onClick={() => setFilters(prev => ({ ...prev, status: SocietyMemberStatus.INACTIVE }))}
              >
                <FaTimes /> Inactive
              </FilterButton>
              <FilterButton 
                active={filters.status === SocietyMemberStatus.PENDING_VERIFICATION}
                onClick={() => setFilters(prev => ({ ...prev, status: SocietyMemberStatus.PENDING_VERIFICATION }))}
              >
                <FaClock /> Pending
              </FilterButton>
              <FilterButton 
                active={filters.status === SocietyMemberStatus.SUSPENDED}
                onClick={() => setFilters(prev => ({ ...prev, status: SocietyMemberStatus.SUSPENDED }))}
              >
                <FaExclamationTriangle /> Suspended
              </FilterButton>
            </FilterButtons>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Member Role</FilterLabel>
            <FilterButtons>
              <FilterButton 
                active={!filters.role || filters.role.length === 0}
                onClick={() => setFilters(prev => ({ ...prev, role: [] }))}
              >
                All Roles
              </FilterButton>
              <FilterButton 
                active={filters.role?.includes(MemberRole.ADMIN) || false}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  role: prev.role?.includes(MemberRole.ADMIN) 
                    ? prev.role.filter(r => r !== MemberRole.ADMIN)
                    : [...(prev.role || []), MemberRole.ADMIN]
                }))}
              >
                <FaUserCog /> Admin
              </FilterButton>
              <FilterButton 
                active={filters.role?.includes(MemberRole.RESIDENT) || false}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  role: prev.role?.includes(MemberRole.RESIDENT) 
                    ? prev.role.filter(r => r !== MemberRole.RESIDENT)
                    : [...(prev.role || []), MemberRole.RESIDENT]
                }))}
              >
                <FaUser /> Resident
              </FilterButton>
              <FilterButton 
                active={filters.role?.includes(MemberRole.GUEST) || false}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  role: prev.role?.includes(MemberRole.GUEST) 
                    ? prev.role.filter(r => r !== MemberRole.GUEST)
                    : [...(prev.role || []), MemberRole.GUEST]
                }))}
              >
                <FaUser /> Guest
              </FilterButton>
            </FilterButtons>
          </FilterGroup>
        </FiltersSection>
        
        {/* Bulk Actions */}
        {selectedMembers.length > 0 && (
          <BulkActionsRow>
            <span>{selectedMembers.length} selected</span>
            <Button 
              onClick={() => handleBulkAction(BulkActionType.ACTIVATE)}
              variant="success"
            >
              <FaCheck />
              Activate
            </Button>
            <Button 
              onClick={() => handleBulkAction(BulkActionType.DEACTIVATE)}
              variant="secondary"
            >
              <FaTimes />
              Deactivate
            </Button>
            <Button 
              onClick={() => handleBulkAction(BulkActionType.DELETE)}
              variant="danger"
            >
              <FaTrash />
              Delete
            </Button>
          </BulkActionsRow>
        )}
      </FiltersCard>
      
      {/* Members Table */}
      {isLoading ? (
        <LoadingSpinner>
          <FaSpinner className="spinner" />
        </LoadingSpinner>
      ) : paginatedMembers.length === 0 ? (
        <EmptyState>
          <div className="icon">
            <FaUsers />
          </div>
          <h3>No Members Found</h3>
          <p>No members match your current search and filter criteria.</p>
          <Button onClick={() => setSearchTerm('')} variant="primary">
            Clear Search
          </Button>
        </EmptyState>
      ) : (
        <TableWrapper>
          <TableHeader>
            <TableTitle>
              <FaUsers />
              Members Directory ({paginatedMembers.length} of {stats.total})
            </TableTitle>
            <TableControls>
              <Button onClick={() => handleExport(ExportFormat.CSV)} variant="secondary">
                <FaDownload />
                Export
              </Button>
              <Button onClick={handleAddMember} variant="primary">
                <FaPlus />
                Add Member
              </Button>
            </TableControls>
          </TableHeader>
          
          <ScrollableTableContainer>
            <EnhancedTable>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedMembers.length === paginatedMembers.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <ColumnHeader as="th" sortable onClick={() => handleSort(MemberSortField.NAME)}>
                    <div className="header-content">
                      <span>Member</span>
                      <SortIcon>{getSortIcon(MemberSortField.NAME)}</SortIcon>
                    </div>
                  </ColumnHeader>
                  <ColumnHeader as="th" sortable onClick={() => handleSort(MemberSortField.APARTMENT_NUMBER)}>
                    <div className="header-content">
                      <span>Apartment</span>
                      <SortIcon>{getSortIcon(MemberSortField.APARTMENT_NUMBER)}</SortIcon>
                    </div>
                  </ColumnHeader>
                  <th>Role</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <ColumnHeader as="th" sortable onClick={() => handleSort(MemberSortField.DATE_JOINED)}>
                    <div className="header-content">
                      <span>Date Joined</span>
                      <SortIcon>{getSortIcon(MemberSortField.DATE_JOINED)}</SortIcon>
                    </div>
                  </ColumnHeader>
                  <ColumnHeader as="th" sortable onClick={() => handleSort(MemberSortField.LAST_ACTIVE_DATE)}>
                    <div className="header-content">
                      <span>Last Active</span>
                      <SortIcon>{getSortIcon(MemberSortField.LAST_ACTIVE_DATE)}</SortIcon>
                    </div>
                  </ColumnHeader>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
            <tbody>
              {paginatedMembers.map((member) => (
                <tr key={member.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={(e) => handleSelectMember(member.id, e.target.checked)}
                    />
                  </td>
                  <MemberCell>
                    <div className="member-info">
                      <div className="avatar">
                        {member.profilePicture ? (
                          <img src={member.profilePicture} alt={member.name} />
                        ) : (
                          member.name.charAt(0)
                        )}
                      </div>
                      <div className="details">
                        <div className="name">{member.name}</div>
                        <div className="apartment">{getStatusIcon(member.status)} {getRoleIcon(member.role)}</div>
                      </div>
                    </div>
                  </MemberCell>
                  <td>{member.apartmentNumber}</td>
                  <td>
                    <RoleBadge role={member.role}>{member.role}</RoleBadge>
                  </td>
                  <td>
                    <div>
                      <FaPhone style={{ marginRight: '8px', fontSize: '0.8rem' }} />
                      {member.contactInformation.primaryPhone}
                    </div>
                    <div style={{ fontSize: '0.85rem', opacity: '0.8', marginTop: '4px' }}>
                      <FaEnvelope style={{ marginRight: '8px', fontSize: '0.7rem' }} />
                      {member.contactInformation.primaryEmail}
                    </div>
                  </td>
                  <td>
                    <StatusBadge status={member.status}>{member.status}</StatusBadge>
                  </td>
                  <td>{formatDate(member.dateJoined)}</td>
                  <td>
                    {formatDate(member.lastActiveDate)}
                    {member.lastLoginDate && (
                      <div style={{ fontSize: '0.8rem', opacity: '0.7', marginTop: '2px' }}>
                        Login: {formatDate(member.lastLoginDate)}
                      </div>
                    )}
                  </td>
                  <td>{formatDuration(member.membershipDuration)}</td>
                  <ActionCell>
                    <div className="actions">
                      <button
                        className="action-btn view"
                        onClick={() => handleViewMember(member)}
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        className="action-btn edit"
                        onClick={() => handleEditMember(member)}
                        title="Edit Member"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDeleteMember(member)}
                        title="Delete Member"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </ActionCell>
                </tr>
              ))}
                          </tbody>
            </EnhancedTable>
          </ScrollableTableContainer>
        </TableWrapper>
      )}
      
      {/* Pagination */}
      <PaginationContainer>
        <PaginationInfo>
          Showing {((pagination.page - 1) * pagination.pageSize) + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of {pagination.totalCount} members
        </PaginationInfo>
        
        <PaginationControls>
          <PageButton
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page === 1}
          >
            <FaChevronLeft />
          </PageButton>
          
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            const page = i + 1;
            return (
              <PageButton
                key={page}
                active={page === pagination.page}
                onClick={() => setPagination(prev => ({ ...prev, page }))}
              >
                {page}
              </PageButton>
            );
          })}
          
          <PageButton
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page === pagination.totalPages}
          >
            <FaChevronRight />
          </PageButton>
        </PaginationControls>
      </PaginationContainer>
      
      {/* Member Modal */}
      <MemberModal
        isOpen={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        member={selectedMember}
        mode={memberModalMode}
        onSave={handleSaveMember}
      />
    </PageContainer>
  );
};

export default SocietyMembersPage;