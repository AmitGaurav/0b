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
  FaFileAlt,
  FaBell,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaExpand,
  FaCompress,
  FaShieldAlt,
  FaClipboardCheck,
  FaIdCard,
  FaUserShield
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { StaffRole, Department, StaffStatus } from '../../types/staff';
import {
  StaffMember,
  StaffVerificationStatus,
  EmploymentType,
  StaffSearchFilters,
  StaffSortOptions,
  StaffSortField,
  SortDirection,
  StaffBulkActionType,
  ExportFormat,
  ExportField,
  PaginationOptions,
  StaffStats,
  VerificationActionType,
  StaffModalMode
} from '../../types/staff-verification';

// Main Container matching Society Members page
const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.gray[50]};
  min-height: 100vh;
`;

// Header Section
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

// Content Card Base
const ContentCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => theme.spacing[6]};
`;

// Stats Grid matching Society Members
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const LayoutStatCard = styled(ContentCard)`
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const StatIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${props => props.color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
  font-size: 1.5rem;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

// Filters and Search Components
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
    padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[10]};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    transition: ${({ theme }) => theme.transition.all};
    
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

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  border: 1px solid transparent;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${({ variant = 'secondary', theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary[600]};
          color: ${theme.colors.white};
          border-color: ${theme.colors.primary[600]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary[700]};
            border-color: ${theme.colors.primary[700]};
            transform: translateY(-1px);
            box-shadow: ${theme.boxShadow.md};
          }
        `;
      case 'success':
        return `
          background: ${theme.colors.success[600]};
          color: ${theme.colors.white};
          border-color: ${theme.colors.success[600]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.success[700]};
            border-color: ${theme.colors.success[700]};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error[600]};
          color: ${theme.colors.white};
          border-color: ${theme.colors.error[600]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.error[700]};
            border-color: ${theme.colors.error[700]};
          }
        `;
      default:
        return `
          background: ${theme.colors.white};
          color: ${theme.colors.gray[700]};
          border-color: ${theme.colors.gray[300]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.gray[50]};
            border-color: ${theme.colors.gray[400]};
          }
        `;
    }
  }}
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
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  
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

// Bulk Actions
const BulkActionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.info[50]};
  border: 1px solid ${({ theme }) => theme.colors.info[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing[4]};
  
  span {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.info[700]};
  }
`;

// Table Components
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

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  th, td {
    padding: ${({ theme }) => theme.spacing[4]};
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    white-space: nowrap;
  }
  
  th {
    background: ${({ theme }) => theme.colors.gray[50]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[700]};
    cursor: pointer;
    user-select: none;
    
    &:hover {
      background: ${({ theme }) => theme.colors.gray[100]};
    }
    
    .sort-icon {
      margin-left: ${({ theme }) => theme.spacing[1]};
      opacity: 0.5;
    }
    
    &.sortable:hover .sort-icon {
      opacity: 1;
    }
  }
  
  tbody tr {
    transition: ${({ theme }) => theme.transition.all};
    
    &:hover {
      background: ${({ theme }) => theme.colors.gray[50]};
    }
    
    &.selected {
      background: ${({ theme }) => theme.colors.info[50]};
    }
  }
`;

// Status badges
const StatusBadge = styled.span<{ status: StaffVerificationStatus | StaffStatus }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${({ status, theme }) => {
    switch (status) {
      case StaffVerificationStatus.APPROVED:
        return `background: ${theme.colors.success[100]}; color: ${theme.colors.success[700]};`;
      case StaffVerificationStatus.PENDING:
        return `background: ${theme.colors.warning[100]}; color: ${theme.colors.warning[700]};`;
      case StaffVerificationStatus.REJECTED:
        return `background: ${theme.colors.error[100]}; color: ${theme.colors.error[700]};`;
      case StaffVerificationStatus.UNDER_REVIEW:
        return `background: ${theme.colors.info[100]}; color: ${theme.colors.info[700]};`;
      case StaffVerificationStatus.DOCUMENTS_REQUIRED:
        return `background: ${theme.colors.warning[100]}; color: ${theme.colors.warning[700]};`;
      case StaffStatus.ACTIVE:
        return `background: ${theme.colors.success[100]}; color: ${theme.colors.success[700]};`;
      case StaffStatus.INACTIVE:
        return `background: ${theme.colors.gray[100]}; color: ${theme.colors.gray[700]};`;
      case StaffStatus.TERMINATED:
        return `background: ${theme.colors.error[100]}; color: ${theme.colors.error[700]};`;
      case StaffStatus.PROBATION:
        return `background: ${theme.colors.error[100]}; color: ${theme.colors.error[700]};`;
      default:
        return `background: ${theme.colors.gray[100]}; color: ${theme.colors.gray[700]};`;
    }
  }}
`;

// Avatar
const Avatar = styled.div<{ src?: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme, src }) => src ? `url(${src})` : theme.colors.gray[300]};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray[600]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  flex-shrink: 0;
`;

// Action buttons
const ActionButton = styled.button`
  padding: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[600]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[700]};
    border-color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
`;

// Pagination
const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.gray[50]};
`;

const PaginationInfo = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const PaginationControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  align-items: center;
`;

const PageButton = styled.button<{ active?: boolean; disabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${({ active, theme }) => active && `
    background: ${theme.colors.primary[600]};
    color: ${theme.colors.white};
    border-color: ${theme.colors.primary[600]};
  `}
  
  &:hover:not(:disabled) {
    background: ${({ active, theme }) => active ? theme.colors.primary[700] : theme.colors.gray[50]};
    border-color: ${({ active, theme }) => active ? theme.colors.primary[700] : theme.colors.gray[400]};
  }
`;

// Loading and Empty States
const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[12]};
  
  .spinner {
    animation: spin 1s linear infinite;
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primary[600]};
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]};
  color: ${({ theme }) => theme.colors.gray[500]};
  
  .icon {
    font-size: 3rem;
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.gray[400]};
  }
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[700]};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
  
  p {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

// Main Component
const StaffVerificationPage: React.FC = () => {
  // State management
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffModalMode, setStaffModalMode] = useState<StaffModalMode>('add');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  
  // Search and Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<StaffSearchFilters>({});
  const [sortOptions, setSortOptions] = useState<StaffSortOptions>({
    field: StaffSortField.NAME,
    direction: SortDirection.ASC
  });
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  });
  
  // Stats state
  const [stats, setStats] = useState<StaffStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    active: 0,
    inactive: 0,
    newThisMonth: 0,
    documentsRequired: 0,
    backgroundChecksPending: 0,
    certificationsExpiring: 0
  });

  // Mock data generator
  const generateMockStaff = useCallback((): StaffMember[] => {
    const mockStaff: StaffMember[] = [];
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Maria'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const roles = Object.values(StaffRole);
    const departments = Object.values(Department);
    const verificationStatuses = Object.values(StaffVerificationStatus);
    const staffStatuses = Object.values(StaffStatus);
    const employmentTypes = Object.values(EmploymentType);
    
    for (let i = 1; i <= 50; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const role = roles[Math.floor(Math.random() * roles.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];
      const verificationStatus = verificationStatuses[Math.floor(Math.random() * verificationStatuses.length)];
      const status = staffStatuses[Math.floor(Math.random() * staffStatuses.length)];
      const employmentType = employmentTypes[Math.floor(Math.random() * employmentTypes.length)];
      
      mockStaff.push({
        id: `staff-${i}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@serenity.com`,
        phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        address: `${Math.floor(Math.random() * 999) + 1} Main St, City, State`,
        role,
        department,
        employmentType,
        dateOfJoining: new Date(Date.now() - Math.floor(Math.random() * 365 * 2) * 24 * 60 * 60 * 1000),
        profileImageUrl: Math.random() > 0.5 ? `https://i.pravatar.cc/150?u=${i}` : undefined,
        verificationStatus,
        status,
        createdDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 2) * 24 * 60 * 60 * 1000),
        updatedDate: new Date(),
        lastActiveDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        employmentDuration: Math.floor(Math.random() * 24) + 1,
        salary: Math.floor(Math.random() * 50000) + 30000,
        workingHours: '9:00 AM - 5:00 PM',
        societyId: 1,
        skills: ['Communication', 'Teamwork', 'Problem Solving'].slice(0, Math.floor(Math.random() * 3) + 1),
        emergencyContactName: `Emergency Contact ${i}`,
        emergencyContactPhone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        emergencyContactRelation: 'Spouse',
        backgroundCheckStatus: ['pending', 'completed', 'failed'][Math.floor(Math.random() * 3)] as any,
        backgroundCheckDate: Math.random() > 0.5 ? new Date() : undefined,
        performanceRating: Math.floor(Math.random() * 5) + 1,
        complianceScore: Math.floor(Math.random() * 100) + 1,
        trainingCompleted: ['Safety Training', 'Customer Service'].slice(0, Math.floor(Math.random() * 2) + 1),
        certificationsValid: Math.random() > 0.3,
        documentsSubmitted: []
      });
    }
    
    return mockStaff;
  }, []);

  // Load data
  useEffect(() => {
    setIsLoading(true);
    
    setTimeout(() => {
      const mockData = generateMockStaff();
      setStaffMembers(mockData);
      
      // Calculate stats
      const newStats: StaffStats = {
        total: mockData.length,
        pending: mockData.filter(s => s.verificationStatus === StaffVerificationStatus.PENDING).length,
        approved: mockData.filter(s => s.verificationStatus === StaffVerificationStatus.APPROVED).length,
        rejected: mockData.filter(s => s.verificationStatus === StaffVerificationStatus.REJECTED).length,
        active: mockData.filter(s => s.status === StaffStatus.ACTIVE).length,
        inactive: mockData.filter(s => s.status === StaffStatus.INACTIVE).length,
        newThisMonth: mockData.filter(s => {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return s.createdDate > monthAgo;
        }).length,
        documentsRequired: mockData.filter(s => s.verificationStatus === StaffVerificationStatus.DOCUMENTS_REQUIRED).length,
        backgroundChecksPending: mockData.filter(s => s.backgroundCheckStatus === 'pending').length,
        certificationsExpiring: mockData.filter(s => !s.certificationsValid).length
      };
      
      setStats(newStats);
      setPagination(prev => ({
        ...prev,
        totalCount: mockData.length,
        totalPages: Math.ceil(mockData.length / prev.pageSize)
      }));
      setIsLoading(false);
    }, 1000);
  }, [generateMockStaff]);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...staffMembers];
    
    // Search functionality
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(staff => 
        staff.name.toLowerCase().includes(term) ||
        staff.email.toLowerCase().includes(term) ||
        staff.phone.includes(term) ||
        staff.role.toLowerCase().includes(term) ||
        staff.department.toLowerCase().includes(term)
      );
    }
    
    // Verification status filter
    if (filters.verificationStatus && filters.verificationStatus.length > 0) {
      filtered = filtered.filter(staff => filters.verificationStatus!.includes(staff.verificationStatus));
    }
    
    // Status filter
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(staff => filters.status!.includes(staff.status));
    }
    
    // Role filter
    if (filters.role && filters.role.length > 0) {
      filtered = filtered.filter(staff => filters.role!.includes(staff.role));
    }
    
    // Department filter
    if (filters.department && filters.department.length > 0) {
      filtered = filtered.filter(staff => filters.department!.includes(staff.department));
    }
    
    // Date filters
    if (filters.joiningDateFrom) {
      filtered = filtered.filter(staff => staff.dateOfJoining >= filters.joiningDateFrom!);
    }
    
    if (filters.joiningDateTo) {
      filtered = filtered.filter(staff => staff.dateOfJoining <= filters.joiningDateTo!);
    }
    
    // Sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortOptions.field) {
        case StaffSortField.NAME:
          aValue = a.name;
          bValue = b.name;
          break;
        case StaffSortField.EMAIL:
          aValue = a.email;
          bValue = b.email;
          break;
        case StaffSortField.ROLE:
          aValue = a.role;
          bValue = b.role;
          break;
        case StaffSortField.DEPARTMENT:
          aValue = a.department;
          bValue = b.department;
          break;
        case StaffSortField.JOINING_DATE:
          aValue = a.dateOfJoining.getTime();
          bValue = b.dateOfJoining.getTime();
          break;
        case StaffSortField.VERIFICATION_STATUS:
          aValue = a.verificationStatus;
          bValue = b.verificationStatus;
          break;
        case StaffSortField.STATUS:
          aValue = a.status;
          bValue = b.status;
          break;
        case StaffSortField.LAST_ACTIVE_DATE:
          aValue = a.lastActiveDate?.getTime() || 0;
          bValue = b.lastActiveDate?.getTime() || 0;
          break;
        case StaffSortField.EMPLOYMENT_DURATION:
          aValue = a.employmentDuration || 0;
          bValue = b.employmentDuration || 0;
          break;
        case StaffSortField.SALARY:
          aValue = a.salary || 0;
          bValue = b.salary || 0;
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
    
    setFilteredStaff(filtered);
    setPagination(prev => ({
      ...prev,
      page: 1,
      totalCount: filtered.length,
      totalPages: Math.ceil(filtered.length / prev.pageSize)
    }));
  }, [staffMembers, searchTerm, filters, sortOptions]);

  // Pagination logic
  const paginatedStaff = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredStaff.slice(startIndex, endIndex);
  }, [filteredStaff, pagination.page, pagination.pageSize]);

  // Event handlers
  const handleSort = (field: StaffSortField) => {
    setSortOptions(prev => ({
      field,
      direction: prev.field === field && prev.direction === SortDirection.ASC 
        ? SortDirection.DESC 
        : SortDirection.ASC
    }));
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStaffIds(paginatedStaff.map(staff => staff.id));
    } else {
      setSelectedStaffIds([]);
    }
  };

  const handleSelectStaff = (staffId: string, checked: boolean) => {
    if (checked) {
      setSelectedStaffIds(prev => [...prev, staffId]);
    } else {
      setSelectedStaffIds(prev => prev.filter(id => id !== staffId));
    }
  };

  const handleBulkAction = (actionType: StaffBulkActionType) => {
    if (selectedStaffIds.length === 0) {
      toast.warning('Please select staff members to perform bulk action');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      let successMessage = '';
      
      switch (actionType) {
        case StaffBulkActionType.APPROVE:
          successMessage = `${selectedStaffIds.length} staff members approved successfully`;
          break;
        case StaffBulkActionType.REJECT:
          successMessage = `${selectedStaffIds.length} staff members rejected`;
          break;
        case StaffBulkActionType.ACTIVATE:
          successMessage = `${selectedStaffIds.length} staff members activated`;
          break;
        case StaffBulkActionType.DEACTIVATE:
          successMessage = `${selectedStaffIds.length} staff members deactivated`;
          break;
        case StaffBulkActionType.DELETE:
          successMessage = `${selectedStaffIds.length} staff members deleted`;
          break;
        default:
          successMessage = 'Bulk action completed successfully';
      }
      
      toast.success(successMessage);
      setSelectedStaffIds([]);
    }, 1000);
  };

  const handleExport = (format: ExportFormat) => {
    toast.success(`Exporting ${filteredStaff.length} staff records in ${format.toUpperCase()} format...`);
  };

  const handleView = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setStaffModalMode('view');
    setShowStaffModal(true);
  };

  const handleEdit = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setStaffModalMode('edit');
    setShowStaffModal(true);
  };

  const handleDelete = (staff: StaffMember) => {
    if (window.confirm(`Are you sure you want to delete ${staff.name}?`)) {
      toast.success(`${staff.name} has been deleted successfully`);
    }
  };

  const handleVerificationAction = (staff: StaffMember, action: VerificationActionType) => {
    let message = '';
    
    switch (action) {
      case VerificationActionType.APPROVE:
        message = `${staff.name} has been approved successfully`;
        break;
      case VerificationActionType.REJECT:
        message = `${staff.name} has been rejected`;
        break;
      case VerificationActionType.REQUEST_DOCUMENTS:
        message = `Document request sent to ${staff.name}`;
        break;
      default:
        message = 'Verification action completed';
    }
    
    toast.success(message);
  };

  const getSortIcon = (field: StaffSortField) => {
    if (sortOptions.field !== field) {
      return <FaSort className="sort-icon" />;
    }
    return sortOptions.direction === SortDirection.ASC 
      ? <FaSortUp className="sort-icon" />
      : <FaSortDown className="sort-icon" />;
  };

  return (
    <PageContainer>
      <Header>
        <h1>
          <FaUserShield />
          Staff Verification & Management
        </h1>
        <p>
          Comprehensive staff verification system with document management, background checks, 
          and approval workflows to ensure secure and compliant staff onboarding.
        </p>
      </Header>

      {/* Stats Dashboard */}
      <StatsGrid>
        <LayoutStatCard>
          <StatIcon color="#2563eb">
            <FaUsers />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total Staff</StatLabel>
          </StatContent>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#f59e0b">
            <FaClock />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.pending}</StatValue>
            <StatLabel>Pending Verification</StatLabel>
          </StatContent>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#22c55e">
            <FaCheckCircle />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.approved}</StatValue>
            <StatLabel>Approved</StatLabel>
          </StatContent>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#ef4444">
            <FaExclamationTriangle />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.rejected}</StatValue>
            <StatLabel>Rejected</StatLabel>
          </StatContent>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#8b5cf6">
            <FaFileAlt />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.documentsRequired}</StatValue>
            <StatLabel>Documents Required</StatLabel>
          </StatContent>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#06b6d4">
            <FaShieldAlt />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.backgroundChecksPending}</StatValue>
            <StatLabel>Background Checks Pending</StatLabel>
          </StatContent>
        </LayoutStatCard>
      </StatsGrid>

      {/* Search and Filter Controls */}
      <FiltersCard>
        <SearchFilterRow>
          <SearchInputContainer>
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, email, phone, role, or department..."
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
          
          <Button onClick={() => handleExport(ExportFormat.CSV)} variant="secondary">
            <FaDownload />
            Export
          </Button>
          
          <Button onClick={() => setShowStaffModal(true)} variant="primary">
            <FaPlus />
            Add Staff
          </Button>
        </SearchFilterRow>
        
        {/* Filter Options */}
        <FiltersSection show={showFilters}>
          <FilterGroup>
            <FilterLabel>Verification Status</FilterLabel>
            <FilterButtons>
              <FilterButton 
                active={!filters.verificationStatus}
                onClick={() => setFilters(prev => ({ ...prev, verificationStatus: undefined }))}
              >
                All
              </FilterButton>
              <FilterButton 
                active={filters.verificationStatus?.includes(StaffVerificationStatus.PENDING)}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  verificationStatus: prev.verificationStatus?.includes(StaffVerificationStatus.PENDING)
                    ? prev.verificationStatus.filter(s => s !== StaffVerificationStatus.PENDING)
                    : [...(prev.verificationStatus || []), StaffVerificationStatus.PENDING]
                }))}
              >
                <FaClock /> Pending
              </FilterButton>
              <FilterButton 
                active={filters.verificationStatus?.includes(StaffVerificationStatus.APPROVED)}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  verificationStatus: prev.verificationStatus?.includes(StaffVerificationStatus.APPROVED)
                    ? prev.verificationStatus.filter(s => s !== StaffVerificationStatus.APPROVED)
                    : [...(prev.verificationStatus || []), StaffVerificationStatus.APPROVED]
                }))}
              >
                <FaCheckCircle /> Approved
              </FilterButton>
              <FilterButton 
                active={filters.verificationStatus?.includes(StaffVerificationStatus.REJECTED)}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  verificationStatus: prev.verificationStatus?.includes(StaffVerificationStatus.REJECTED)
                    ? prev.verificationStatus.filter(s => s !== StaffVerificationStatus.REJECTED)
                    : [...(prev.verificationStatus || []), StaffVerificationStatus.REJECTED]
                }))}
              >
                <FaTimes /> Rejected
              </FilterButton>
              <FilterButton 
                active={filters.verificationStatus?.includes(StaffVerificationStatus.DOCUMENTS_REQUIRED)}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  verificationStatus: prev.verificationStatus?.includes(StaffVerificationStatus.DOCUMENTS_REQUIRED)
                    ? prev.verificationStatus.filter(s => s !== StaffVerificationStatus.DOCUMENTS_REQUIRED)
                    : [...(prev.verificationStatus || []), StaffVerificationStatus.DOCUMENTS_REQUIRED]
                }))}
              >
                <FaFileAlt /> Documents Required
              </FilterButton>
            </FilterButtons>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Staff Status</FilterLabel>
            <FilterButtons>
              <FilterButton 
                active={!filters.status}
                onClick={() => setFilters(prev => ({ ...prev, status: undefined }))}
              >
                All
              </FilterButton>
              <FilterButton 
                active={filters.status?.includes(StaffStatus.ACTIVE)}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  status: prev.status?.includes(StaffStatus.ACTIVE)
                    ? prev.status.filter(s => s !== StaffStatus.ACTIVE)
                    : [...(prev.status || []), StaffStatus.ACTIVE]
                }))}
              >
                <FaUserCheck /> Active
              </FilterButton>
              <FilterButton 
                active={filters.status?.includes(StaffStatus.INACTIVE)}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  status: prev.status?.includes(StaffStatus.INACTIVE)
                    ? prev.status.filter(s => s !== StaffStatus.INACTIVE)
                    : [...(prev.status || []), StaffStatus.INACTIVE]
                }))}
              >
                <FaUserTimes /> Inactive
              </FilterButton>
              <FilterButton 
                active={filters.status?.includes(StaffStatus.TERMINATED)}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  status: prev.status?.includes(StaffStatus.TERMINATED)
                    ? prev.status.filter(s => s !== StaffStatus.TERMINATED)
                    : [...(prev.status || []), StaffStatus.TERMINATED]
                }))}
              >
                <FaExclamationTriangle /> Terminated
              </FilterButton>
            </FilterButtons>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Department</FilterLabel>
            <FilterButtons>
              <FilterButton 
                active={!filters.department}
                onClick={() => setFilters(prev => ({ ...prev, department: undefined }))}
              >
                All
              </FilterButton>
              {Object.values(Department).map(dept => (
                <FilterButton 
                  key={dept}
                  active={filters.department?.includes(dept)}
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    department: prev.department?.includes(dept)
                      ? prev.department.filter(d => d !== dept)
                      : [...(prev.department || []), dept]
                  }))}
                >
                  {dept.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                </FilterButton>
              ))}
            </FilterButtons>
          </FilterGroup>
        </FiltersSection>
        
        {/* Bulk Actions */}
        {selectedStaffIds.length > 0 && (
          <BulkActionsRow>
            <span>{selectedStaffIds.length} selected</span>
            <Button 
              onClick={() => handleBulkAction(StaffBulkActionType.APPROVE)}
              variant="success"
            >
              <FaCheck />
              Approve
            </Button>
            <Button 
              onClick={() => handleBulkAction(StaffBulkActionType.REJECT)}
              variant="secondary"
            >
              <FaTimes />
              Reject
            </Button>
            <Button 
              onClick={() => handleBulkAction(StaffBulkActionType.ACTIVATE)}
              variant="success"
            >
              <FaUserCheck />
              Activate
            </Button>
            <Button 
              onClick={() => handleBulkAction(StaffBulkActionType.DEACTIVATE)}
              variant="secondary"
            >
              <FaUserTimes />
              Deactivate
            </Button>
            <Button 
              onClick={() => handleBulkAction(StaffBulkActionType.DELETE)}
              variant="danger"
            >
              <FaTrash />
              Delete
            </Button>
          </BulkActionsRow>
        )}
      </FiltersCard>

      {/* Staff Table */}
      {isLoading ? (
        <LoadingSpinner>
          <FaSpinner className="spinner" />
        </LoadingSpinner>
      ) : paginatedStaff.length === 0 ? (
        <EmptyState>
          <div className="icon">
            <FaUsers />
          </div>
          <h3>No Staff Members Found</h3>
          <p>No staff members match your current search and filter criteria.</p>
          <Button onClick={() => setSearchTerm('')} variant="primary">
            Clear Search
          </Button>
        </EmptyState>
      ) : (
        <TableWrapper>
          <TableHeader>
            <TableTitle>
              <FaUsers />
              Staff Directory ({paginatedStaff.length} of {stats.total})
            </TableTitle>
            <TableControls>
              <Button onClick={() => handleExport(ExportFormat.CSV)} variant="secondary">
                <FaDownload />
                Export
              </Button>
              <Button onClick={() => setShowStaffModal(true)} variant="primary">
                <FaPlus />
                Add Staff
              </Button>
            </TableControls>
          </TableHeader>
          
          <ScrollableTableContainer>
            <StyledTable>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedStaffIds.length === paginatedStaff.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th 
                    className="sortable"
                    onClick={() => handleSort(StaffSortField.NAME)}
                  >
                    Staff {getSortIcon(StaffSortField.NAME)}
                  </th>
                  <th 
                    className="sortable"
                    onClick={() => handleSort(StaffSortField.ROLE)}
                  >
                    Role {getSortIcon(StaffSortField.ROLE)}
                  </th>
                  <th 
                    className="sortable"
                    onClick={() => handleSort(StaffSortField.DEPARTMENT)}
                  >
                    Department {getSortIcon(StaffSortField.DEPARTMENT)}
                  </th>
                  <th 
                    className="sortable"
                    onClick={() => handleSort(StaffSortField.JOINING_DATE)}
                  >
                    Joining Date {getSortIcon(StaffSortField.JOINING_DATE)}
                  </th>
                  <th 
                    className="sortable"
                    onClick={() => handleSort(StaffSortField.VERIFICATION_STATUS)}
                  >
                    Verification {getSortIcon(StaffSortField.VERIFICATION_STATUS)}
                  </th>
                  <th 
                    className="sortable"
                    onClick={() => handleSort(StaffSortField.STATUS)}
                  >
                    Status {getSortIcon(StaffSortField.STATUS)}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStaff.map((staff) => (
                  <tr 
                    key={staff.id}
                    className={selectedStaffIds.includes(staff.id) ? 'selected' : ''}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedStaffIds.includes(staff.id)}
                        onChange={(e) => handleSelectStaff(staff.id, e.target.checked)}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar src={staff.profileImageUrl}>
                          {!staff.profileImageUrl && <FaUser />}
                        </Avatar>
                        <div>
                          <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                            {staff.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {staff.email}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                            {staff.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>
                        {staff.role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        {staff.employmentType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    </td>
                    <td>
                      {staff.department.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </td>
                    <td>
                      {staff.dateOfJoining.toLocaleDateString()}
                    </td>
                    <td>
                      <StatusBadge status={staff.verificationStatus}>
                        {staff.verificationStatus.replace(/_/g, ' ')}
                      </StatusBadge>
                    </td>
                    <td>
                      <StatusBadge status={staff.status}>
                        {staff.status}
                      </StatusBadge>
                    </td>
                    <td>
                      <ActionButtonGroup>
                        <ActionButton 
                          onClick={() => handleView(staff)}
                          title="View Details"
                        >
                          <FaEye />
                        </ActionButton>
                        <ActionButton 
                          onClick={() => handleEdit(staff)}
                          title="Edit Staff"
                        >
                          <FaEdit />
                        </ActionButton>
                        {staff.verificationStatus === StaffVerificationStatus.PENDING && (
                          <>
                            <ActionButton 
                              onClick={() => handleVerificationAction(staff, VerificationActionType.APPROVE)}
                              title="Approve"
                              style={{ color: '#22c55e', borderColor: '#22c55e' }}
                            >
                              <FaCheck />
                            </ActionButton>
                            <ActionButton 
                              onClick={() => handleVerificationAction(staff, VerificationActionType.REJECT)}
                              title="Reject"
                              style={{ color: '#ef4444', borderColor: '#ef4444' }}
                            >
                              <FaTimes />
                            </ActionButton>
                          </>
                        )}
                        <ActionButton 
                          onClick={() => handleDelete(staff)}
                          title="Delete Staff"
                          style={{ color: '#ef4444', borderColor: '#ef4444' }}
                        >
                          <FaTrash />
                        </ActionButton>
                      </ActionButtonGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </ScrollableTableContainer>
          
          {/* Pagination */}
          <PaginationContainer>
            <PaginationInfo>
              Showing {((pagination.page - 1) * pagination.pageSize) + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of {pagination.totalCount} staff members
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
        </TableWrapper>
      )}

      {/* TODO: Add Staff Details Modal */}
      {/* TODO: Add Staff Edit Modal */}
      {/* TODO: Add Staff Add Modal */}
    </PageContainer>
  );
};

export default StaffVerificationPage;