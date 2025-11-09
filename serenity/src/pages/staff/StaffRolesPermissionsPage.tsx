import React, { useState, useCallback, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiDownload,
  FiRefreshCw,
  FiMoreVertical,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiUsers,
  FiShield,
  FiKey,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiCalendar,
  FiUser,
  FiSettings,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiList,
  FiX,
  FiCheck,
  FiCopy,
  FiArchive,
  FiActivity
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  StaffRole,
  Permission,
  RoleStatus,
  RoleType,
  RoleSortField,
  SortDirection,
  ExportFormat,
  RoleModalMode
} from '../../types/staff-roles';

// Mock data generation functions
const createMockRoles = (count: number): StaffRole[] => {
  const roles: StaffRole[] = [];
  const roleNames = [
    'Super Administrator', 'Administrator', 'Manager', 'Security Officer',
    'Maintenance Supervisor', 'Finance Manager', 'HR Manager', 'IT Support',
    'Guest Relations', 'Compliance Officer', 'Operations Manager', 'Receptionist'
  ];

  const descriptions = [
    'Full system access and control',
    'Administrative privileges with limitations',
    'Department management responsibilities',
    'Security monitoring and enforcement',
    'Maintenance coordination and oversight',
    'Financial operations management',
    'Human resources administration',
    'Technical support and maintenance',
    'Guest services and relations',
    'Regulatory compliance management',
    'Daily operations coordination',
    'Front desk and visitor management'
  ];

  for (let i = 0; i < count; i++) {
    const nameIndex = i % roleNames.length;
    const role: StaffRole = {
      id: `role-${i + 1}`,
      name: roleNames[nameIndex] + (i >= roleNames.length ? ` ${Math.floor(i / roleNames.length) + 1}` : ''),
      description: descriptions[nameIndex],
      permissions: Object.values(Permission).slice(0, Math.floor(Math.random() * 10) + 3),
      userCount: Math.floor(Math.random() * 50) + 1,
      status: Math.random() > 0.2 ? RoleStatus.ACTIVE : RoleStatus.INACTIVE,
      type: Math.random() > 0.3 ? RoleType.CUSTOM : RoleType.SYSTEM,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      createdBy: `user-${Math.floor(Math.random() * 10) + 1}`,
      category: ['Administration', 'Security', 'Maintenance', 'Finance', 'HR'][Math.floor(Math.random() * 5)],
      color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)]
    };
    roles.push(role);
  }

  return roles;
};

// Simple search filters interface
interface SimpleRoleFilters {
  searchTerm: string;
  status: RoleStatus | 'all';
  type: RoleType | 'all';
  category: string | 'all';
}

// Styled Components
const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  background-color: ${({ theme }) => theme.colors.gray[50]};
  min-height: 100vh;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

const PageHeader = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  margin: 0;
  line-height: 1.5;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
    justify-content: stretch;
    
    > button {
      flex: 1;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.gray[50]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const ContentCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  overflow: hidden;
`;

const FilterSection = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.gray[50]};
`;

const FilterRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    gap: ${({ theme }) => theme.spacing[3]};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[10]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: ${({ theme }) => theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray[400]};
  width: 18px;
  height: 18px;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' | 'success' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  ${({ variant = 'secondary', theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary[600]};
          border-color: ${theme.colors.primary[600]};
          color: ${theme.colors.white};
          
          &:hover {
            background: ${theme.colors.primary[700]};
            border-color: ${theme.colors.primary[700]};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error[600]};
          border-color: ${theme.colors.error[600]};
          color: ${theme.colors.white};
          
          &:hover {
            background: ${theme.colors.error[700]};
            border-color: ${theme.colors.error[700]};
          }
        `;
      case 'success':
        return `
          background: ${theme.colors.success[600]};
          border-color: ${theme.colors.success[600]};
          color: ${theme.colors.white};
          
          &:hover {
            background: ${theme.colors.success[700]};
            border-color: ${theme.colors.success[700]};
          }
        `;
      default:
        return `
          background: ${theme.colors.white};
          border-color: ${theme.colors.gray[300]};
          color: ${theme.colors.gray[700]};
          
          &:hover {
            background: ${theme.colors.gray[50]};
            border-color: ${theme.colors.gray[400]};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const IconButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ variant = 'secondary', theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary[600]};
          border-color: ${theme.colors.primary[600]};
          color: ${theme.colors.white};
          
          &:hover {
            background: ${theme.colors.primary[700]};
            border-color: ${theme.colors.primary[700]};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error[600]};
          border-color: ${theme.colors.error[600]};
          color: ${theme.colors.white};
          
          &:hover {
            background: ${theme.colors.error[700]};
            border-color: ${theme.colors.error[700]};
          }
        `;
      default:
        return `
          background: ${theme.colors.white};
          border-color: ${theme.colors.gray[300]};
          color: ${theme.colors.gray[600]};
          
          &:hover {
            background: ${theme.colors.gray[50]};
            border-color: ${theme.colors.gray[400]};
          }
        `;
    }
  }}
`;

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: ${({ theme }) => theme.colors.gray[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const TableRow = styled.tr<{ selected?: boolean }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  transition: all 0.2s ease;
  
  ${({ selected, theme }) => selected && `
    background: ${theme.colors.primary[50]};
  `}

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }
`;

const TableHeaderCell = styled.th<{ sortable?: boolean }>`
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: left;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  white-space: nowrap;
  
  ${({ sortable }) => sortable && `
    cursor: pointer;
    user-select: none;
    
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  `}
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[900]};
  vertical-align: middle;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const Badge = styled.span<{ variant: 'active' | 'inactive' | 'system' | 'custom' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'active':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[800]};
        `;
      case 'inactive':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[800]};
        `;
      case 'system':
        return `
          background: ${theme.colors.info[100]};
          color: ${theme.colors.info[800]};
        `;
      case 'custom':
        return `
          background: ${theme.colors.secondary[100]};
          color: ${theme.colors.secondary[800]};
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[800]};
        `;
    }
  }}
`;

const PermissionGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[1]};
  max-width: 300px;
`;

const PermissionBadge = styled.span`
  background: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.gray[700]};
  padding: 2px ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  white-space: nowrap;
`;

const ActionMenu = styled.div`
  position: relative;
  display: inline-block;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
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

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  right: 0;
  top: 100%;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 10;
  min-width: 180px;
  opacity: ${({ isOpen }) => isOpen ? 1 : 0};
  visibility: ${({ isOpen }) => isOpen ? 'visible' : 'hidden'};
  transform: ${({ isOpen }) => isOpen ? 'translateY(4px)' : 'translateY(0)'};
  transition: all 0.2s ease;
`;

const DropdownItem = styled.button<{ variant?: 'danger' }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]};
  border: none;
  background: transparent;
  text-align: left;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant, theme }) => variant === 'danger' 
    ? `color: ${theme.colors.error[600]};`
    : `color: ${theme.colors.gray[700]};`
  }

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }

  &:first-child {
    border-top-left-radius: ${({ theme }) => theme.borderRadius.md};
    border-top-right-radius: ${({ theme }) => theme.borderRadius.md};
  }

  &:last-child {
    border-bottom-left-radius: ${({ theme }) => theme.borderRadius.md};
    border-bottom-right-radius: ${({ theme }) => theme.borderRadius.md};
  }
`;

const BulkActionsBar = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => visible ? 'flex' : 'none'};
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary[200]};
`;

const BulkActionText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.primary[700]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.gray[50]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
  }
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
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  background: ${({ active, theme }) => active ? theme.colors.primary[600] : theme.colors.white};
  color: ${({ active, theme }) => active ? theme.colors.white : theme.colors.gray[700]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ active, theme }) => active ? theme.colors.primary[700] : theme.colors.gray[50]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]};
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  width: 64px;
  height: 64px;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const EmptyStateText = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
`;

const EmptyStateSubtext = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0 0 ${({ theme }) => theme.spacing[4]} 0;
`;

// Main Component
const StaffRolesPermissionsPage: React.FC = () => {
  // State Management
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<SimpleRoleFilters>({
    searchTerm: '',
    status: 'all',
    type: 'all',
    category: 'all'
  });
  const [sortField, setSortField] = useState<keyof StaffRole>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);


  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockRoles = createMockRoles(50);
        setRoles(mockRoles);
      } catch (error) {
        toast.error('Failed to load roles data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtered and sorted data
  const filteredRoles = useMemo(() => {
    let filtered = roles;

    // Apply search filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(role =>
        role.name.toLowerCase().includes(searchTerm) ||
        role.description.toLowerCase().includes(searchTerm) ||
        (role.category && role.category.toLowerCase().includes(searchTerm))
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(role => role.status === filters.status);
    }

    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(role => role.type === filters.type);
    }

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(role => role.category === filters.category);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'userCount') {
        aValue = a.userCount;
        bValue = b.userCount;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortOrder === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

    return filtered;
  }, [roles, filters, sortField, sortOrder]);

  // Pagination
  const totalItems = filteredRoles.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentRoles = filteredRoles.slice(startIndex, endIndex);

  // Statistics
  const stats = useMemo(() => {
    return {
      totalRoles: roles.length,
      activeRoles: roles.filter(r => r.status === RoleStatus.ACTIVE).length,
      systemRoles: roles.filter(r => r.type === RoleType.SYSTEM).length,
      customRoles: roles.filter(r => r.type === RoleType.CUSTOM).length,
    };
  }, [roles]);

  // Event Handlers
  const handleSearch = useCallback((searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
    setCurrentPage(1);
  }, []);

  const handleFilterChange = useCallback((key: keyof SimpleRoleFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((field: keyof StaffRole) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }, [sortField]);

  const handleSelectRole = useCallback((roleId: string, selected: boolean) => {
    setSelectedRoles(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(roleId);
      } else {
        newSet.delete(roleId);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedRoles(new Set(currentRoles.map(r => r.id)));
    } else {
      setSelectedRoles(new Set());
    }
  }, [currentRoles]);

  const handleBulkAction = useCallback(async (action: string) => {
    const selectedCount = selectedRoles.size;
    if (selectedCount === 0) {
      toast.warn('Please select roles to perform bulk action');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      switch (action) {
        case 'activate':
          toast.success(`Activated ${selectedCount} role(s)`);
          break;
        case 'deactivate':
          toast.success(`Deactivated ${selectedCount} role(s)`);
          break;
        case 'delete':
          toast.success(`Deleted ${selectedCount} role(s)`);
          break;
        case 'duplicate':
          toast.success(`Duplicated ${selectedCount} role(s)`);
          break;
        case 'archive':
          toast.success(`Archived ${selectedCount} role(s)`);
          break;
      }
      
      setSelectedRoles(new Set());
    } catch (error) {
      toast.error('Failed to perform bulk action');
    }
  }, [selectedRoles]);

  const handleExport = useCallback(async (format: string) => {
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(`Exported ${filteredRoles.length} roles as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export roles');
    }
  }, [filteredRoles]);

  const handleRoleAction = useCallback((role: StaffRole, action: string) => {
    setActiveDropdown(null);
    
    switch (action) {
      case 'view':
        toast.info(`Viewing role: ${role.name}`);
        break;
      case 'edit':
        toast.info(`Editing role: ${role.name}`);
        break;
      case 'duplicate':
        toast.info(`Duplicating role: ${role.name}`);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this role?')) {
          toast.success('Role deleted successfully');
        }
        break;
    }
  }, []);

  const handleAddRole = useCallback(() => {
    toast.info('Add new role modal would open here');
  }, []);

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockRoles = createMockRoles(50);
      setRoles(mockRoles);
      toast.success('Roles data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh roles data');
    } finally {
      setLoading(false);
    }
  }, []);

  const getSortIcon = (field: keyof StaffRole) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatPermissions = (permissions: Permission[]) => {
    if (permissions.length <= 3) {
      return permissions;
    }
    return [...permissions.slice(0, 3)];
  };

  // Get unique values for filters
  const categories = useMemo(() => 
    Array.from(new Set(roles.filter(r => r.category).map(r => r.category))).sort(), 
    [roles]
  );

  if (loading) {
    return (
      <PageContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div>Loading roles...</div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader>
        <HeaderTop>
          <HeaderContent>
            <Title>
              <FiShield size={28} />
              Staff Roles & Permissions
            </Title>
            <Subtitle>
              Manage staff roles, permissions, and access control settings across your organization
            </Subtitle>
          </HeaderContent>
          <HeaderActions>
            <Button onClick={handleRefresh}>
              <FiRefreshCw size={16} />
              Refresh
            </Button>
            <Button onClick={() => handleExport('excel')}>
              <FiDownload size={16} />
              Export
            </Button>
            <Button variant="primary" onClick={handleAddRole}>
              <FiPlus size={16} />
              Add Role
            </Button>
          </HeaderActions>
        </HeaderTop>

        {/* Statistics */}
        <StatsGrid>
          <StatCard>
            <StatValue>{stats.totalRoles}</StatValue>
            <StatLabel>Total Roles</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.activeRoles}</StatValue>
            <StatLabel>Active Roles</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.systemRoles}</StatValue>
            <StatLabel>System Roles</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.customRoles}</StatValue>
            <StatLabel>Custom Roles</StatLabel>
          </StatCard>
        </StatsGrid>
      </PageHeader>

      {/* Main Content */}
      <ContentCard>
        {/* Filters */}
        <FilterSection>
          <FilterRow>
            <SearchContainer>
              <SearchIcon />
              <SearchInput
                type="text"
                placeholder="Search roles by name, description, or department..."
                value={filters.searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </SearchContainer>
            
            <FilterGroup>
              <Select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
              
              <Select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value as RoleType | 'all')}
              >
                <option value="all">All Types</option>
                <option value={RoleType.SYSTEM}>System</option>
                <option value={RoleType.CUSTOM}>Custom</option>
              </Select>
              
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
            </FilterGroup>
          </FilterRow>
        </FilterSection>

        {/* Bulk Actions */}
        <BulkActionsBar visible={selectedRoles.size > 0}>
          <BulkActionText>
            {selectedRoles.size} role(s) selected
          </BulkActionText>
          <Button onClick={() => handleBulkAction('activate')}>
            <FiCheckCircle size={16} />
            Activate
          </Button>
          <Button onClick={() => handleBulkAction('deactivate')}>
            <FiXCircle size={16} />
            Deactivate
          </Button>
          <Button onClick={() => handleBulkAction('duplicate')}>
            <FiCopy size={16} />
            Duplicate
          </Button>
          <Button variant="danger" onClick={() => handleBulkAction('delete')}>
            <FiTrash2 size={16} />
            Delete
          </Button>
        </BulkActionsBar>

        {/* Table */}
        {currentRoles.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>
              <FiShield size={32} />
            </EmptyStateIcon>
            <EmptyStateText>No roles found</EmptyStateText>
            <EmptyStateSubtext>
              {filters.searchTerm || filters.status !== 'all' || filters.type !== 'all' || filters.category !== 'all'
                ? 'Try adjusting your filters to see more results.'
                : 'Get started by creating your first role.'
              }
            </EmptyStateSubtext>
            {filters.searchTerm === '' && filters.status === 'all' && filters.type === 'all' && filters.category === 'all' && (
              <Button variant="primary" onClick={handleAddRole}>
                <FiPlus size={16} />
                Add First Role
              </Button>
            )}
          </EmptyState>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>
                      <Checkbox
                        type="checkbox"
                        checked={selectedRoles.size === currentRoles.length && currentRoles.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </TableHeaderCell>
                    <TableHeaderCell sortable onClick={() => handleSort('name')}>
                      Role Name {getSortIcon('name')}
                    </TableHeaderCell>
                    <TableHeaderCell sortable onClick={() => handleSort('category')}>
                      Category {getSortIcon('category')}
                    </TableHeaderCell>
                    <TableHeaderCell sortable onClick={() => handleSort('type')}>
                      Type {getSortIcon('type')}
                    </TableHeaderCell>
                    <TableHeaderCell sortable onClick={() => handleSort('status')}>
                      Status {getSortIcon('status')}
                    </TableHeaderCell>
                    <TableHeaderCell sortable onClick={() => handleSort('userCount')}>
                      Users {getSortIcon('userCount')}
                    </TableHeaderCell>
                    <TableHeaderCell>Permissions
                    </TableHeaderCell>
                    <TableHeaderCell sortable onClick={() => handleSort('createdAt')}>
                      Created {getSortIcon('createdAt')}
                    </TableHeaderCell>
                    <TableHeaderCell>Actions</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <tbody>
                  {currentRoles.map((role) => (
                    <TableRow key={role.id} selected={selectedRoles.has(role.id)}>
                      <TableCell>
                        <Checkbox
                          type="checkbox"
                          checked={selectedRoles.has(role.id)}
                          onChange={(e) => handleSelectRole(role.id, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                            {role.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6B7280' }}>
                            {role.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{role.category || 'Uncategorized'}</TableCell>
                      <TableCell>
                        <Badge variant={role.type === RoleType.SYSTEM ? 'system' : 'custom'}>
                          {role.type === RoleType.SYSTEM ? <FiSettings size={12} /> : <FiUser size={12} />}
                          {role.type === RoleType.SYSTEM ? 'System' : 'Custom'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={role.status === RoleStatus.ACTIVE ? 'active' : 'inactive'}>
                          {role.status === RoleStatus.ACTIVE ? <FiCheckCircle size={12} /> : <FiXCircle size={12} />}
                          {role.status === RoleStatus.ACTIVE ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FiUsers size={14} />
                          {role.userCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <PermissionGrid>
                          {formatPermissions(role.permissions).map((permission, index) => (
                            <PermissionBadge key={index}>
                              {permission.replace('_', ' ').toLowerCase()}
                            </PermissionBadge>
                          ))}
                          {role.permissions.length > 3 && (
                            <PermissionBadge>
                              +{role.permissions.length - 3} more
                            </PermissionBadge>
                          )}
                        </PermissionGrid>
                      </TableCell>
                      <TableCell>
                        <div style={{ fontSize: '12px' }}>
                          {formatDate(role.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <ActionMenu>
                          <ActionButton
                            onClick={() => setActiveDropdown(
                              activeDropdown === role.id ? null : role.id
                            )}
                          >
                            <FiMoreVertical size={16} />
                          </ActionButton>
                          <DropdownMenu isOpen={activeDropdown === role.id}>
                            <DropdownItem onClick={() => handleRoleAction(role, 'view')}>
                              <FiEye size={16} />
                              View Details
                            </DropdownItem>
                            <DropdownItem onClick={() => handleRoleAction(role, 'edit')}>
                              <FiEdit3 size={16} />
                              Edit Role
                            </DropdownItem>
                            <DropdownItem onClick={() => handleRoleAction(role, 'duplicate')}>
                              <FiCopy size={16} />
                              Duplicate
                            </DropdownItem>
                            <DropdownItem 
                              variant="danger" 
                              onClick={() => handleRoleAction(role, 'delete')}
                            >
                              <FiTrash2 size={16} />
                              Delete Role
                            </DropdownItem>
                          </DropdownMenu>
                        </ActionMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <PaginationContainer>
              <PaginationInfo>
                Showing {startIndex + 1}-{endIndex} of {totalItems} roles
              </PaginationInfo>
              <PaginationControls>
                <PageButton
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <FiChevronLeft size={16} />
                </PageButton>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <PageButton
                      key={page}
                      active={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PageButton>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span>...</span>
                    <PageButton onClick={() => setCurrentPage(totalPages)}>
                      {totalPages}
                    </PageButton>
                  </>
                )}
                
                <PageButton
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  <FiChevronRight size={16} />
                </PageButton>
              </PaginationControls>
              
              <Select
                value={pageSize.toString()}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
                <option value="100">100 per page</option>
              </Select>
            </PaginationContainer>
          </>
        )}
      </ContentCard>

      {/* Click outside to close dropdowns */}
      {activeDropdown && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 5
          }}
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </PageContainer>
  );
};

export default StaffRolesPermissionsPage;