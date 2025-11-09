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
  FaUserShield,
  FaBriefcase,
  FaMapMarkerAlt,
  FaCamera,
  FaFileImage
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { StaffRole, Department, StaffStatus } from '../../types/staff';
import {
  StaffMember,
  StaffDocument,
  EmploymentType,
  StaffSearchFilters,
  StaffSortOptions,
  StaffSortField,
  SortDirection,
  StaffBulkActionType,
  ExportFormat,
  PaginationOptions,
  StaffStats,
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
const StatusBadge = styled.span<{ status: StaffStatus }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${({ status, theme }) => {
    switch (status) {
      case StaffStatus.ACTIVE:
        return `background: ${theme.colors.success[100]}; color: ${theme.colors.success[700]};`;
      case StaffStatus.INACTIVE:
        return `background: ${theme.colors.gray[100]}; color: ${theme.colors.gray[700]};`;
      case StaffStatus.ON_LEAVE:
        return `background: ${theme.colors.warning[100]}; color: ${theme.colors.warning[700]};`;
      case StaffStatus.TERMINATED:
        return `background: ${theme.colors.error[100]}; color: ${theme.colors.error[700]};`;
      case StaffStatus.PROBATION:
        return `background: ${theme.colors.info[100]}; color: ${theme.colors.info[700]};`;
      case StaffStatus.PENDING_VERIFICATION:
        return `background: ${theme.colors.warning[100]}; color: ${theme.colors.warning[700]};`;
      default:
        return `background: ${theme.colors.gray[100]}; color: ${theme.colors.gray[700]};`;
    }
  }}
`;

// Avatar with profile picture support
const Avatar = styled.div<{ src?: string }>`
  width: 48px;
  height: 48px;
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
  border: 2px solid ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
`;

// Document count badge
const DocumentBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[700]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
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

// Staff profile details
const StaffInfoCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  
  .primary {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[900]};
  }
  
  .secondary {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.gray[600]};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[1]};
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  
  .contact-item {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[1]};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.gray[600]};
  }
`;

// Main Component
const StaffProfileManagementPage: React.FC = () => {
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

  // Mock data generator with enhanced profile information
  const generateMockStaff = useCallback((): StaffMember[] => {
    const mockStaff: StaffMember[] = [];
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Maria', 'Christopher', 'Jennifer', 'William', 'Elizabeth', 'Daniel', 'Jessica', 'Matthew', 'Ashley', 'Anthony', 'Amanda'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
    const roles = Object.values(StaffRole);
    const departments = Object.values(Department);
    const staffStatuses = Object.values(StaffStatus);
    const employmentTypes = Object.values(EmploymentType);
    const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm St', 'Maple Ave', 'Cedar Ln', 'Park Blvd', 'First St', 'Second Ave', 'Third St'];
    const cities = ['Springfield', 'Franklin', 'Georgetown', 'Madison', 'Washington', 'Arlington', 'Chester', 'Clinton', 'Fairview', 'Riverside'];
    
    for (let i = 1; i <= 75; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const role = roles[Math.floor(Math.random() * roles.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];
      const status = staffStatuses[Math.floor(Math.random() * staffStatuses.length)];
      const employmentType = employmentTypes[Math.floor(Math.random() * employmentTypes.length)];
      const street = streets[Math.floor(Math.random() * streets.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];
      
      mockStaff.push({
        id: `staff-${i}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@serenity.com`,
        phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        address: `${Math.floor(Math.random() * 999) + 1} ${street}, ${city}, State ${Math.floor(Math.random() * 50) + 10000}`,
        role,
        department,
        employmentType,
        dateOfJoining: new Date(Date.now() - Math.floor(Math.random() * 365 * 3) * 24 * 60 * 60 * 1000),
        profileImageUrl: Math.random() > 0.3 ? `https://i.pravatar.cc/150?u=${i}` : undefined,
        verificationStatus: 'approved' as any,
        status,
        createdDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 3) * 24 * 60 * 60 * 1000),
        updatedDate: new Date(),
        lastActiveDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        employmentDuration: Math.floor(Math.random() * 36) + 1,
        salary: Math.floor(Math.random() * 60000) + 35000,
        workingHours: ['9:00 AM - 5:00 PM', '8:00 AM - 4:00 PM', '10:00 AM - 6:00 PM'][Math.floor(Math.random() * 3)],
        societyId: 1,
        skills: ['Communication', 'Teamwork', 'Problem Solving', 'Time Management', 'Leadership', 'Technical Skills'].slice(0, Math.floor(Math.random() * 4) + 2),
        emergencyContactName: `Emergency Contact ${i}`,
        emergencyContactPhone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        emergencyContactRelation: ['Spouse', 'Parent', 'Sibling', 'Friend'][Math.floor(Math.random() * 4)],
        backgroundCheckStatus: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)] as any,
        backgroundCheckDate: Math.random() > 0.2 ? new Date() : undefined,
        performanceRating: Math.floor(Math.random() * 5) + 1,
        complianceScore: Math.floor(Math.random() * 100) + 1,
        trainingCompleted: ['Safety Training', 'Customer Service', 'First Aid', 'Security Protocols'].slice(0, Math.floor(Math.random() * 3) + 1),
        certificationsValid: Math.random() > 0.2,
        documentsSubmitted: Array.from({ length: Math.floor(Math.random() * 8) + 2 }, (_, idx) => ({
          id: `doc-${i}-${idx}`,
          staffId: `staff-${i}`,
          documentType: ['resume', 'identity_proof', 'address_proof', 'educational_certificate', 'experience_letter', 'medical_certificate', 'police_clearance', 'reference_letter'][Math.floor(Math.random() * 8)] as any,
          fileName: `Document_${idx + 1}.pdf`,
          fileUrl: '#',
          fileSize: Math.floor(Math.random() * 5000000) + 100000, // 100KB to 5MB
          uploadDate: new Date(),
          verificationStatus: ['pending', 'verified', 'rejected'][Math.floor(Math.random() * 3)] as any,
          verifiedBy: Math.random() > 0.5 ? 'Admin User' : undefined,
          verifiedDate: Math.random() > 0.5 ? new Date() : undefined,
          isRequired: Math.random() > 0.3
        }))
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
        pending: 0,
        approved: mockData.length,
        rejected: 0,
        active: mockData.filter(s => s.status === StaffStatus.ACTIVE).length,
        inactive: mockData.filter(s => s.status === StaffStatus.INACTIVE).length,
        newThisMonth: mockData.filter(s => {
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return s.createdDate > monthAgo;
        }).length,
        documentsRequired: mockData.filter(s => !s.documentsSubmitted || s.documentsSubmitted.length < 3).length,
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
    }, 800);
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
        staff.address.toLowerCase().includes(term) ||
        staff.role.toLowerCase().includes(term) ||
        staff.department.toLowerCase().includes(term)
      );
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
        case StaffBulkActionType.ACTIVATE:
          successMessage = `${selectedStaffIds.length} staff members activated successfully`;
          toast.info('Admin has been notified of staff activation');
          break;
        case StaffBulkActionType.DEACTIVATE:
          successMessage = `${selectedStaffIds.length} staff members deactivated`;
          toast.info('Admin has been notified of staff deactivation');
          break;
        case StaffBulkActionType.DELETE:
          successMessage = `${selectedStaffIds.length} staff members deleted`;
          toast.info('Admin has been notified of staff deletion');
          break;
        default:
          successMessage = 'Bulk action completed successfully';
      }
      
      toast.success(successMessage);
      setSelectedStaffIds([]);
    }, 1000);
  };

  const handleExport = (format: ExportFormat) => {
    toast.success(`Exporting ${filteredStaff.length} staff profiles in ${format.toUpperCase()} format...`);
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
    toast.info('Opening edit modal - admin will be notified of changes');
  };

  const handleDelete = (staff: StaffMember) => {
    if (window.confirm(`Are you sure you want to delete ${staff.name}? This action cannot be undone.`)) {
      toast.success(`${staff.name} has been deleted successfully`);
      toast.info('Admin has been notified of staff profile deletion');
    }
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
          <FaUsers />
          Staff Profile Management
        </h1>
        <p>
          Comprehensive staff profile management system with detailed information tracking, 
          document management, and complete employee lifecycle management for your organization.
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
            <StatLabel>Total Staff Profiles</StatLabel>
          </StatContent>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#22c55e">
            <FaUserCheck />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.active}</StatValue>
            <StatLabel>Active Employees</StatLabel>
          </StatContent>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#f59e0b">
            <FaUserCog />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.inactive}</StatValue>
            <StatLabel>Inactive Employees</StatLabel>
          </StatContent>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#8b5cf6">
            <FaCalendarAlt />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.newThisMonth}</StatValue>
            <StatLabel>New This Month</StatLabel>
          </StatContent>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#06b6d4">
            <FaFileAlt />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.documentsRequired}</StatValue>
            <StatLabel>Missing Documents</StatLabel>
          </StatContent>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#ef4444">
            <FaExclamationTriangle />
          </StatIcon>
          <StatContent>
            <StatValue>{stats.certificationsExpiring}</StatValue>
            <StatLabel>Certifications Expiring</StatLabel>
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
              placeholder="Search by name, email, phone, address, role, or department..."
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
                active={filters.status?.includes(StaffStatus.ON_LEAVE)}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  status: prev.status?.includes(StaffStatus.ON_LEAVE)
                    ? prev.status.filter(s => s !== StaffStatus.ON_LEAVE)
                    : [...(prev.status || []), StaffStatus.ON_LEAVE]
                }))}
              >
                <FaClock /> On Leave
              </FilterButton>
              <FilterButton 
                active={filters.status?.includes(StaffStatus.PROBATION)}
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  status: prev.status?.includes(StaffStatus.PROBATION)
                    ? prev.status.filter(s => s !== StaffStatus.PROBATION)
                    : [...(prev.status || []), StaffStatus.PROBATION]
                }))}
              >
                <FaCog /> Probation
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

          <FilterGroup>
            <FilterLabel>Staff Role</FilterLabel>
            <FilterButtons>
              <FilterButton 
                active={!filters.role}
                onClick={() => setFilters(prev => ({ ...prev, role: undefined }))}
              >
                All
              </FilterButton>
              {Object.values(StaffRole).map(role => (
                <FilterButton 
                  key={role}
                  active={filters.role?.includes(role)}
                  onClick={() => setFilters(prev => ({ 
                    ...prev, 
                    role: prev.role?.includes(role)
                      ? prev.role.filter(r => r !== role)
                      : [...(prev.role || []), role]
                  }))}
                >
                  {role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
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
          <h3>No Staff Profiles Found</h3>
          <p>No staff profiles match your current search and filter criteria.</p>
          <Button onClick={() => setSearchTerm('')} variant="primary">
            Clear Search
          </Button>
        </EmptyState>
      ) : (
        <TableWrapper>
          <TableHeader>
            <TableTitle>
              <FaUsers />
              Staff Profiles ({paginatedStaff.length} of {stats.total})
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
                    Staff Profile {getSortIcon(StaffSortField.NAME)}
                  </th>
                  <th>Contact Info</th>
                  <th>Address</th>
                  <th 
                    className="sortable"
                    onClick={() => handleSort(StaffSortField.ROLE)}
                  >
                    Role & Department {getSortIcon(StaffSortField.ROLE)}
                  </th>
                  <th 
                    className="sortable"
                    onClick={() => handleSort(StaffSortField.JOINING_DATE)}
                  >
                    Joining Date {getSortIcon(StaffSortField.JOINING_DATE)}
                  </th>
                  <th>Documents</th>
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
                        <StaffInfoCell>
                          <div className="primary">{staff.name}</div>
                          <div className="secondary">
                            <FaBriefcase />
                            ID: {staff.id}
                          </div>
                          <div className="secondary">
                            <FaClock />
                            {staff.employmentDuration} months
                          </div>
                        </StaffInfoCell>
                      </div>
                    </td>
                    <td>
                      <ContactInfo>
                        <div className="contact-item">
                          <FaEnvelope />
                          {staff.email}
                        </div>
                        <div className="contact-item">
                          <FaPhone />
                          {staff.phone}
                        </div>
                      </ContactInfo>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', maxWidth: '200px' }}>
                        <FaMapMarkerAlt style={{ marginRight: '4px' }} />
                        {staff.address}
                      </div>
                    </td>
                    <td>
                      <StaffInfoCell>
                        <div className="primary">
                          {staff.role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="secondary">
                          {staff.department.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="secondary">
                          {staff.employmentType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                      </StaffInfoCell>
                    </td>
                    <td>
                      <StaffInfoCell>
                        <div className="primary">
                          {staff.dateOfJoining.toLocaleDateString()}
                        </div>
                        <div className="secondary">
                          <FaClock />
                          {Math.floor((Date.now() - staff.dateOfJoining.getTime()) / (1000 * 60 * 60 * 24))} days ago
                        </div>
                      </StaffInfoCell>
                    </td>
                    <td>
                      <DocumentBadge>
                        <FaFileAlt />
                        {staff.documentsSubmitted?.length || 0} docs
                      </DocumentBadge>
                    </td>
                    <td>
                      <StatusBadge status={staff.status}>
                        {staff.status.replace(/_/g, ' ')}
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
                          title="Edit Profile"
                        >
                          <FaEdit />
                        </ActionButton>
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
              Showing {((pagination.page - 1) * pagination.pageSize) + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of {pagination.totalCount} staff profiles
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

export default StaffProfileManagementPage;