import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import {
  FiUsers,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiRefreshCw,
  FiGrid,
  FiList,
  FiChevronLeft,
  FiChevronRight,
  FiMoreVertical,
  FiUser,
  FiTruck,
  FiBriefcase,
  FiShield,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiClock,
  FiEdit3,
  FiTrash2,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiInfo
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  DirectoryEntry,
  DirectoryEntryType,
  DirectorySearchFilters,
  DirectorySortOptions,
  DirectoryPaginationOptions,
  DirectoryStats,
  DirectoryTab,
  DirectorySortField,
  SortDirection,
  PersonStatus,
  MemberRole,
  VendorType,
  StaffRole,
  SecurityRole,
  Department,
  ExportFormat,
  isMemberEntry,
  isVendorEntry,
  isStaffEntry,
  isSecurityEntry,
  getEntryTypeLabel,
  getStatusColor
} from '../../types/society-directory';
import { PageContainer, PageTitle, ContentCard } from '../../components/common/PageLayout';

// Styled Components
const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[3]};
  }
  
  p {
    color: ${({ theme }) => theme.colors.gray[600]};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.boxShadow.md};
    transform: translateY(-2px);
  }
`;

const StatIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
`;

const StatInfo = styled.div`
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
`;

const ControlsBar = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const TabsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const Tab = styled.button<{ isActive: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: none;
  background: ${({ isActive, theme }) => isActive ? theme.colors.primary[50] : 'transparent'};
  color: ${({ isActive, theme }) => isActive ? theme.colors.primary[600] : theme.colors.gray[600]};
  border-bottom: 2px solid ${({ isActive, theme }) => isActive ? theme.colors.primary[600] : 'transparent'};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[900]};
  }
`;

const TabBadge = styled.span<{ color: string }>`
  background: ${({ color }) => color};
  color: white;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const SearchAndFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  padding-left: ${({ theme }) => theme.spacing[10]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const FilterGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: white;
  cursor: pointer;
  min-width: 140px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-left: auto;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'outline' }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  transition: all 0.2s ease;
  white-space: nowrap;
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary[600]};
          color: white;
          border: 1px solid ${theme.colors.primary[600]};
          &:hover { background: ${theme.colors.primary[700]}; }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[700]};
          border: 1px solid ${theme.colors.gray[300]};
          &:hover { background: ${theme.colors.gray[200]}; }
        `;
      default:
        return `
          background: white;
          color: ${theme.colors.gray[700]};
          border: 1px solid ${theme.colors.gray[300]};
          &:hover { background: ${theme.colors.gray[50]}; }
        `;
    }
  }}
`;

const TableContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const TableHeader = styled.div`
  background: ${({ theme }) => theme.colors.gray[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => theme.spacing[4]};
  display: grid;
  grid-template-columns: 60px 1fr 1fr 1fr 120px 120px 100px 80px;
  gap: ${({ theme }) => theme.spacing[3]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const TableRow = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  display: grid;
  grid-template-columns: 60px 1fr 1fr 1fr 120px 120px 100px 80px;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const Avatar = styled.div<{ src?: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ src, theme }) => src ? `url(${src})` : theme.colors.gray[300]};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray[600]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const StatusBadge = styled.span<{ status: PersonStatus }>`
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  
  ${({ status, theme }) => {
    switch (status) {
      case PersonStatus.ACTIVE:
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
        `;
      case PersonStatus.INACTIVE:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[700]};
        `;
      case PersonStatus.SUSPENDED:
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[700]};
        `;
      case PersonStatus.PENDING:
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
        `;
      case PersonStatus.TERMINATED:
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[700]};
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[700]};
        `;
    }
  }}
`;

const ActionMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const ActionButton = styled.button`
  padding: ${({ theme }) => theme.spacing[1]};
  border: none;
  background: transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray[500]};
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const PaginationInfo = styled.div`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const PaginationControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-left: auto;
`;

const PageButton = styled.button<{ isActive?: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  background: ${({ isActive, theme }) => isActive ? theme.colors.primary[600] : 'white'};
  color: ${({ isActive, theme }) => isActive ? 'white' : theme.colors.gray[700]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${({ isActive, theme }) => isActive ? theme.colors.primary[700] : theme.colors.gray[50]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[4]};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[500]};
  
  svg {
    font-size: 3rem;
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.gray[400]};
  }
  
  h3 {
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

// Mock data generation
const generateMockData = (): DirectoryEntry[] => {
  const entries: DirectoryEntry[] = [];
  
  // Generate mock members
  for (let i = 1; i <= 25; i++) {
    entries.push({
      id: i,
      type: DirectoryEntryType.MEMBER,
      name: `Member ${i}`,
      email: `member${i}@example.com`,
      phone: `+91 98765 4321${i.toString().padStart(1, '0')}`,
      address: `Apt ${i}, Building A, Sample Society`,
      status: i % 4 === 0 ? PersonStatus.INACTIVE : PersonStatus.ACTIVE,
      dateJoined: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      role: Object.values(MemberRole)[Math.floor(Math.random() * Object.values(MemberRole).length)] as MemberRole,
      unitNumber: `A${i.toString().padStart(3, '0')}`,
      unitType: 'APARTMENT' as any,
      floorNumber: Math.floor(i / 4) + 1,
      membershipId: `MEM${i.toString().padStart(4, '0')}`,
      familyMembers: Math.floor(Math.random() * 5) + 1,
      vehicleCount: Math.floor(Math.random() * 3),
      balanceAmount: Math.random() * 10000,
      isCommitteeMember: Math.random() > 0.7
    } as any);
  }
  
  // Generate mock vendors
  for (let i = 1; i <= 15; i++) {
    entries.push({
      id: i + 100,
      type: DirectoryEntryType.VENDOR,
      name: `Vendor ${i}`,
      email: `vendor${i}@example.com`,
      phone: `+91 98765 5432${i.toString().padStart(1, '0')}`,
      address: `Office ${i}, Commercial Complex`,
      status: i % 5 === 0 ? PersonStatus.INACTIVE : PersonStatus.ACTIVE,
      dateJoined: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      vendorType: Object.values(VendorType)[Math.floor(Math.random() * Object.values(VendorType).length)] as VendorType,
      companyName: `Company ${i} Pvt Ltd`,
      contractStartDate: new Date(2023, 0, 1),
      contractEndDate: new Date(2024, 11, 31),
      serviceAreas: ['Maintenance', 'Cleaning'],
      rating: Math.random() * 2 + 3,
      totalContracts: Math.floor(Math.random() * 10) + 1,
      isActive: Math.random() > 0.2,
      contactPerson: `Contact Person ${i}`
    } as any);
  }
  
  // Generate mock staff
  for (let i = 1; i <= 20; i++) {
    entries.push({
      id: i + 200,
      type: DirectoryEntryType.STAFF,
      name: `Staff ${i}`,
      email: `staff${i}@example.com`,
      phone: `+91 98765 6543${i.toString().padStart(1, '0')}`,
      address: `Address ${i}`,
      status: i % 6 === 0 ? PersonStatus.INACTIVE : PersonStatus.ACTIVE,
      dateJoined: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      role: Object.values(StaffRole)[Math.floor(Math.random() * Object.values(StaffRole).length)] as StaffRole,
      department: Object.values(Department)[Math.floor(Math.random() * Object.values(Department).length)] as Department,
      employeeId: `EMP${i.toString().padStart(4, '0')}`,
      salary: Math.floor(Math.random() * 50000) + 25000,
      workingHours: '9 AM - 6 PM',
      skills: ['Skill 1', 'Skill 2'],
      dateOfBirth: new Date(1990, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      gender: Math.random() > 0.5 ? 'MALE' : 'FEMALE'
    } as any);
  }
  
  // Generate mock security
  for (let i = 1; i <= 12; i++) {
    entries.push({
      id: i + 300,
      type: DirectoryEntryType.SECURITY,
      name: `Security ${i}`,
      email: `security${i}@example.com`,
      phone: `+91 98765 7654${i.toString().padStart(1, '0')}`,
      address: `Address ${i}`,
      status: i % 7 === 0 ? PersonStatus.INACTIVE : PersonStatus.ACTIVE,
      dateJoined: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      documents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      role: Object.values(SecurityRole)[Math.floor(Math.random() * Object.values(SecurityRole).length)] as SecurityRole,
      department: Department.SECURITY,
      employeeId: `SEC${i.toString().padStart(4, '0')}`,
      salary: Math.floor(Math.random() * 40000) + 20000,
      shift: Math.random() > 0.66 ? 'DAY' : Math.random() > 0.5 ? 'NIGHT' : 'ROTATING',
      licenseNumber: `LIC${i.toString().padStart(6, '0')}`,
      licenseExpiryDate: new Date(2025, 11, 31),
      trainingCertificates: ['Basic Security', 'First Aid'],
      assignedGates: [`Gate ${i % 3 + 1}`],
      dateOfBirth: new Date(1985, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      gender: Math.random() > 0.3 ? 'MALE' : 'FEMALE'
    } as any);
  }
  
  return entries;
};

const SocietyDirectoryPage: React.FC = () => {
  // State management
  const [allEntries] = useState<DirectoryEntry[]>(generateMockData());
  const [activeTab, setActiveTab] = useState<DirectoryEntryType>(DirectoryEntryType.MEMBER);
  const [searchFilters, setSearchFilters] = useState<DirectorySearchFilters>({
    searchTerm: ''
  });
  const [sortOptions, setSortOptions] = useState<DirectorySortOptions>({
    field: DirectorySortField.NAME,
    direction: SortDirection.ASC
  });
  const [pagination, setPagination] = useState<DirectoryPaginationOptions>({
    page: 1,
    limit: 10
  });
  const [selectedEntry, setSelectedEntry] = useState<DirectoryEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tabs configuration
  const tabs: DirectoryTab[] = [
    {
      id: DirectoryEntryType.MEMBER,
      label: 'Members',
      icon: FiUser,
      count: allEntries.filter(e => e.type === DirectoryEntryType.MEMBER).length
    },
    {
      id: DirectoryEntryType.VENDOR,
      label: 'Vendors',
      icon: FiTruck,
      count: allEntries.filter(e => e.type === DirectoryEntryType.VENDOR).length
    },
    {
      id: DirectoryEntryType.STAFF,
      label: 'Staff',
      icon: FiBriefcase,
      count: allEntries.filter(e => e.type === DirectoryEntryType.STAFF).length
    },
    {
      id: DirectoryEntryType.SECURITY,
      label: 'Security',
      icon: FiShield,
      count: allEntries.filter(e => e.type === DirectoryEntryType.SECURITY).length
    }
  ];

  // Statistics
  const stats: DirectoryStats = useMemo(() => {
    const totalMembers = allEntries.filter(e => e.type === DirectoryEntryType.MEMBER).length;
    const totalVendors = allEntries.filter(e => e.type === DirectoryEntryType.VENDOR).length;
    const totalStaff = allEntries.filter(e => e.type === DirectoryEntryType.STAFF).length;
    const totalSecurity = allEntries.filter(e => e.type === DirectoryEntryType.SECURITY).length;
    const activeEntries = allEntries.filter(e => e.status === PersonStatus.ACTIVE).length;
    const inactiveEntries = allEntries.filter(e => e.status !== PersonStatus.ACTIVE).length;
    
    return {
      totalMembers,
      totalVendors,
      totalStaff,
      totalSecurity,
      activeEntries,
      inactiveEntries
    };
  }, [allEntries]);

  // Filtered and sorted entries
  const filteredEntries = useMemo(() => {
    let filtered = allEntries.filter(entry => entry.type === activeTab);
    
    // Apply search filter
    if (searchFilters.searchTerm) {
      const searchTerm = searchFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(entry =>
        entry.name.toLowerCase().includes(searchTerm) ||
        entry.email.toLowerCase().includes(searchTerm) ||
        entry.phone.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (searchFilters.status) {
      filtered = filtered.filter(entry => entry.status === searchFilters.status);
    }
    
    // Apply role filter
    if (searchFilters.role) {
      filtered = filtered.filter(entry => {
        if (isMemberEntry(entry)) return entry.role === searchFilters.role;
        if (isVendorEntry(entry)) return entry.vendorType === searchFilters.role;
        if (isStaffEntry(entry)) return entry.role === searchFilters.role;
        if (isSecurityEntry(entry)) return entry.role === searchFilters.role;
        return false;
      });
    }
    
    // Apply department filter
    if (searchFilters.department && (activeTab === DirectoryEntryType.STAFF || activeTab === DirectoryEntryType.SECURITY)) {
      filtered = filtered.filter(entry => {
        if (isStaffEntry(entry) || isSecurityEntry(entry)) {
          return entry.department === searchFilters.department;
        }
        return false;
      });
    }
    
    // Apply unit number filter for members
    if (searchFilters.unitNumber && activeTab === DirectoryEntryType.MEMBER) {
      filtered = filtered.filter(entry => {
        if (isMemberEntry(entry)) {
          return entry.unitNumber.toLowerCase().includes(searchFilters.unitNumber!.toLowerCase());
        }
        return false;
      });
    }
    
    // Apply vendor type filter
    if (searchFilters.vendorType && activeTab === DirectoryEntryType.VENDOR) {
      filtered = filtered.filter(entry => {
        if (isVendorEntry(entry)) {
          return entry.vendorType === searchFilters.vendorType;
        }
        return false;
      });
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = '';
      let bValue: any = '';
      
      switch (sortOptions.field) {
        case DirectorySortField.NAME:
          aValue = a.name;
          bValue = b.name;
          break;
        case DirectorySortField.EMAIL:
          aValue = a.email;
          bValue = b.email;
          break;
        case DirectorySortField.PHONE:
          aValue = a.phone;
          bValue = b.phone;
          break;
        case DirectorySortField.STATUS:
          aValue = a.status;
          bValue = b.status;
          break;
        case DirectorySortField.DATE_JOINED:
          aValue = a.dateJoined;
          bValue = b.dateJoined;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === 'string') {
        bValue = bValue.toLowerCase();
      }
      
      const compareResult = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOptions.direction === SortDirection.ASC ? compareResult : -compareResult;
    });
    
    return filtered;
  }, [allEntries, activeTab, searchFilters, sortOptions]);

  // Paginated entries
  const paginatedEntries = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    return filteredEntries.slice(startIndex, startIndex + pagination.limit);
  }, [filteredEntries, pagination]);
  
  const totalPages = Math.ceil(filteredEntries.length / pagination.limit);

  // Event handlers
  const handleSearch = useCallback((searchTerm: string) => {
    setSearchFilters(prev => ({ ...prev, searchTerm }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);
  
  const handleTabChange = useCallback((tab: DirectoryEntryType) => {
    setActiveTab(tab);
    setSearchFilters({ searchTerm: '' }); // Reset filters when changing tabs
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);
  
  const handleFilterChange = useCallback((filterKey: keyof DirectorySearchFilters, value: any) => {
    setSearchFilters(prev => ({ ...prev, [filterKey]: value || undefined }));
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);
  
  const handleSort = useCallback((field: DirectorySortField) => {
    setSortOptions(prev => ({
      field,
      direction: prev.field === field && prev.direction === SortDirection.ASC 
        ? SortDirection.DESC 
        : SortDirection.ASC
    }));
  }, []);
  
  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);
  
  const handleViewDetails = useCallback((entry: DirectoryEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  }, []);
  
  const handleExport = useCallback((format: ExportFormat) => {
    // Mock export functionality
    toast.success(`Exporting ${getEntryTypeLabel(activeTab)} in ${format} format...`);
    // In real implementation, generate and download the file
  }, [activeTab]);
  
  const handleRefresh = useCallback(() => {
    toast.success('Directory refreshed successfully');
    // In real implementation, refetch data from API
  }, []);

  // Get role options based on active tab
  const getRoleOptions = () => {
    switch (activeTab) {
      case DirectoryEntryType.MEMBER:
        return Object.values(MemberRole).map(role => ({ value: role, label: role }));
      case DirectoryEntryType.VENDOR:
        return Object.values(VendorType).map(type => ({ value: type, label: type }));
      case DirectoryEntryType.STAFF:
        return Object.values(StaffRole).map(role => ({ value: role, label: role }));
      case DirectoryEntryType.SECURITY:
        return Object.values(SecurityRole).map(role => ({ value: role, label: role }));
      default:
        return [];
    }
  };

  const formatCellData = (entry: DirectoryEntry, field: string) => {
    switch (field) {
      case 'role':
        if (isMemberEntry(entry)) return entry.role;
        if (isVendorEntry(entry)) return entry.vendorType;
        if (isStaffEntry(entry)) return entry.role;
        if (isSecurityEntry(entry)) return entry.role;
        return '';
      case 'department':
        if (isStaffEntry(entry) || isSecurityEntry(entry)) return entry.department;
        return '-';
      case 'unit':
        if (isMemberEntry(entry)) return entry.unitNumber;
        return '-';
      case 'company':
        if (isVendorEntry(entry)) return entry.companyName;
        return '-';
      default:
        return '';
    }
  };

  return (
    <PageContainer>
      <Header>
        <h1>
          <FiUsers />
          Society Directory
        </h1>
        <p>Comprehensive directory of all society members, staff, vendors, and security personnel</p>
      </Header>

      {/* Statistics */}
      <StatsGrid>
        <StatCard>
          <StatIcon color="#3B82F6">
            <FiUser />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats.totalMembers}</StatValue>
            <StatLabel>Total Members</StatLabel>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon color="#10B981">
            <FiTruck />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats.totalVendors}</StatValue>
            <StatLabel>Total Vendors</StatLabel>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon color="#F59E0B">
            <FiBriefcase />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats.totalStaff}</StatValue>
            <StatLabel>Total Staff</StatLabel>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon color="#EF4444">
            <FiShield />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats.totalSecurity}</StatValue>
            <StatLabel>Security Personnel</StatLabel>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      {/* Controls */}
      <ControlsBar>
        {/* Tabs */}
        <TabsContainer>
          {tabs.map(tab => (
            <Tab
              key={tab.id}
              isActive={activeTab === tab.id}
              onClick={() => handleTabChange(tab.id)}
            >
              <tab.icon />
              {tab.label}
              <TabBadge color={activeTab === tab.id ? '#3B82F6' : '#6B7280'}>
                {tab.count}
              </TabBadge>
            </Tab>
          ))}
        </TabsContainer>

        {/* Search and Filters */}
        <SearchAndFilters>
          <SearchBox>
            <SearchIcon>
              <FiSearch />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder={`Search ${getEntryTypeLabel(activeTab).toLowerCase()} by name, email, or phone...`}
              value={searchFilters.searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </SearchBox>

          <FilterGroup>
            <Select
              value={searchFilters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value as PersonStatus)}
            >
              <option value="">All Status</option>
              {Object.values(PersonStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Select>

            <Select
              value={searchFilters.role || ''}
              onChange={(e) => handleFilterChange('role', e.target.value)}
            >
              <option value="">All Roles</option>
              {getRoleOptions().map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>

            {(activeTab === DirectoryEntryType.STAFF || activeTab === DirectoryEntryType.SECURITY) && (
              <Select
                value={searchFilters.department || ''}
                onChange={(e) => handleFilterChange('department', e.target.value as Department)}
              >
                <option value="">All Departments</option>
                {Object.values(Department).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </Select>
            )}

            {activeTab === DirectoryEntryType.MEMBER && (
              <SearchInput
                type="text"
                placeholder="Unit number..."
                value={searchFilters.unitNumber || ''}
                onChange={(e) => handleFilterChange('unitNumber', e.target.value)}
                style={{ width: '140px', paddingLeft: '12px' }}
              />
            )}

            {activeTab === DirectoryEntryType.VENDOR && (
              <Select
                value={searchFilters.vendorType || ''}
                onChange={(e) => handleFilterChange('vendorType', e.target.value as VendorType)}
              >
                <option value="">All Types</option>
                {Object.values(VendorType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            )}
          </FilterGroup>

          <ActionButtons>
            <Button onClick={handleRefresh}>
              <FiRefreshCw />
              Refresh
            </Button>
            <Button onClick={() => handleExport(ExportFormat.CSV)}>
              <FiDownload />
              Export CSV
            </Button>
            <Button onClick={() => handleExport(ExportFormat.EXCEL)}>
              <FiDownload />
              Export Excel
            </Button>
          </ActionButtons>
        </SearchAndFilters>
      </ControlsBar>

      {/* Table */}
      <TableContainer>
        <TableHeader>
          <div>Avatar</div>
          <div onClick={() => handleSort(DirectorySortField.NAME)} style={{ cursor: 'pointer' }}>
            Name {sortOptions.field === DirectorySortField.NAME && (sortOptions.direction === SortDirection.ASC ? '↑' : '↓')}
          </div>
          <div onClick={() => handleSort(DirectorySortField.EMAIL)} style={{ cursor: 'pointer' }}>
            Email {sortOptions.field === DirectorySortField.EMAIL && (sortOptions.direction === SortDirection.ASC ? '↑' : '↓')}
          </div>
          <div onClick={() => handleSort(DirectorySortField.PHONE)} style={{ cursor: 'pointer' }}>
            Phone {sortOptions.field === DirectorySortField.PHONE && (sortOptions.direction === SortDirection.ASC ? '↑' : '↓')}
          </div>
          <div>Role/Type</div>
          <div onClick={() => handleSort(DirectorySortField.STATUS)} style={{ cursor: 'pointer' }}>
            Status {sortOptions.field === DirectorySortField.STATUS && (sortOptions.direction === SortDirection.ASC ? '↑' : '↓')}
          </div>
          <div onClick={() => handleSort(DirectorySortField.DATE_JOINED)} style={{ cursor: 'pointer' }}>
            Joined {sortOptions.field === DirectorySortField.DATE_JOINED && (sortOptions.direction === SortDirection.ASC ? '↑' : '↓')}
          </div>
          <div>Actions</div>
        </TableHeader>

        {paginatedEntries.length === 0 ? (
          <EmptyState>
            <FiUsers />
            <h3>No {getEntryTypeLabel(activeTab).toLowerCase()} found</h3>
            <p>Try adjusting your search criteria or filters.</p>
          </EmptyState>
        ) : (
          paginatedEntries.map(entry => (
            <TableRow key={entry.id}>
              <Avatar src={entry.profilePicture}>
                {!entry.profilePicture && entry.name.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <strong>{entry.name}</strong>
                {isMemberEntry(entry) && (
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                    Unit: {entry.unitNumber}
                  </div>
                )}
                {isVendorEntry(entry) && (
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                    {entry.companyName}
                  </div>
                )}
                {(isStaffEntry(entry) || isSecurityEntry(entry)) && (
                  <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                    ID: {entry.employeeId}
                  </div>
                )}
              </div>
              <div style={{ fontSize: '0.875rem' }}>{entry.email}</div>
              <div style={{ fontSize: '0.875rem' }}>{entry.phone}</div>
              <div style={{ fontSize: '0.875rem' }}>{formatCellData(entry, 'role')}</div>
              <div>
                <StatusBadge status={entry.status}>
                  {entry.status}
                </StatusBadge>
              </div>
              <div style={{ fontSize: '0.875rem' }}>
                {entry.dateJoined.toLocaleDateString()}
              </div>
              <div>
                <ActionMenu>
                  <Button variant="outline" onClick={() => handleViewDetails(entry)}>
                    <FiEye />
                  </Button>
                </ActionMenu>
              </div>
            </TableRow>
          ))
        )}
      </TableContainer>

      {/* Pagination */}
      {paginatedEntries.length > 0 && (
        <PaginationContainer>
          <PaginationInfo>
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, filteredEntries.length)} of{' '}
            {filteredEntries.length} entries
          </PaginationInfo>
          <PaginationControls>
            <PageButton
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              <FiChevronLeft />
            </PageButton>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <PageButton
                  key={page}
                  isActive={pagination.page === page}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </PageButton>
              );
            })}
            <PageButton
              disabled={pagination.page === totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              <FiChevronRight />
            </PageButton>
          </PaginationControls>
        </PaginationContainer>
      )}

      {/* Detail Modal Placeholder */}
      {isModalOpen && selectedEntry && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              background: 'white',
              padding: '2rem',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '1rem' }}>
              {selectedEntry.name} - {getEntryTypeLabel(selectedEntry.type)}
            </h2>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Email:</strong> {selectedEntry.email}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Phone:</strong> {selectedEntry.phone}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Address:</strong> {selectedEntry.address}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Status:</strong> {selectedEntry.status}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Date Joined:</strong> {selectedEntry.dateJoined.toLocaleDateString()}
            </div>
            {isMemberEntry(selectedEntry) && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Unit:</strong> {selectedEntry.unitNumber}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Role:</strong> {selectedEntry.role}
                </div>
              </>
            )}
            {isVendorEntry(selectedEntry) && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Company:</strong> {selectedEntry.companyName}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Type:</strong> {selectedEntry.vendorType}
                </div>
              </>
            )}
            {(isStaffEntry(selectedEntry) || isSecurityEntry(selectedEntry)) && (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Employee ID:</strong> {selectedEntry.employeeId}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Department:</strong> {selectedEntry.department}
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Role:</strong> {selectedEntry.role}
                </div>
              </>
            )}
            <div style={{ textAlign: 'right', marginTop: '2rem' }}>
              <Button onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default SocietyDirectoryPage;