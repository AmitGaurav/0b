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
  FiClock,
  FiCalendar,
  FiUser,
  FiUserCheck,
  FiUserX,
  FiSettings,
  FiChevronDown,
  FiChevronUp,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiList,
  FiX,
  FiCheck,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiActivity,
  FiCopy,
  FiArchive
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  StaffAttendance,
  AttendanceStatus,
  AttendanceActionType,
  AttendanceSearchFilters,
  AttendanceSortOptions,
  AttendanceSortField,
  SortDirection,
  BulkAttendanceAction,
  AttendanceExportOptions,
  ExportFormat,
  AttendanceExportField,
  AttendancePaginationOptions,
  AttendanceModalMode,
  AttendanceStats
} from '../../types/staff-attendance';
import { StaffRole, Department, StaffStatus } from '../../types/staff';
import AttendanceModal from '../../components/modals/AttendanceModal';

// Mock data generation functions
const createMockAttendanceData = (count: number): StaffAttendance[] => {
  const names = [
    'John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson',
    'Lisa Anderson', 'Robert Taylor', 'Jennifer Martinez', 'Christopher Garcia', 'Amanda Rodriguez',
    'Matthew Lopez', 'Michelle Lee', 'Daniel White', 'Ashley Thompson', 'James Clark',
    'Jessica Lewis', 'William Walker', 'Nicole Hall', 'Richard Allen', 'Stephanie Young',
    'Joseph King', 'Rachel Wright', 'Thomas Hill', 'Laura Scott', 'Charles Green',
    'Melissa Adams', 'Anthony Baker', 'Kimberly Nelson', 'Mark Carter', 'Donna Mitchell',
    'Steven Perez', 'Carol Roberts', 'Paul Turner', 'Sandra Phillips', 'Kevin Campbell',
    'Helen Parker', 'Edward Evans', 'Betty Edwards', 'Ronald Collins', 'Dorothy Stewart',
    'Jason Flores', 'Ruth Morris', 'Jeffrey Reed', 'Sharon Cook', 'Ryan Bailey',
    'Cynthia Rivera', 'Jacob Cooper', 'Kathleen Richardson', 'Gary Cox', 'Anna Howard'
  ];

  const emails = names.map(name => 
    `${name.toLowerCase().replace(' ', '.')}@serenity-ui.com`
  );

  const phones = Array.from({ length: count }, () => 
    `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`
  );

  const roles = Object.values(StaffRole);
  const departments = Object.values(Department);
  const statuses = Object.values(StaffStatus);
  const attendanceStatuses = Object.values(AttendanceStatus);

  const profilePictures = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1494790108755-2616b332845c?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  ];

  const generateCheckInTime = () => {
    const today = new Date();
    const baseTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0); // 9:00 AM
    const variation = Math.random() * 60 * 60 * 1000; // Up to 1 hour variation
    return new Date(baseTime.getTime() + variation);
  };

  const generateCheckOutTime = (checkIn: Date) => {
    const workDuration = 8 * 60 * 60 * 1000; // 8 hours
    const variation = Math.random() * 2 * 60 * 60 * 1000; // Up to 2 hours variation
    return new Date(checkIn.getTime() + workDuration + variation);
  };

  return Array.from({ length: count }, (_, index) => {
    const checkInTime = generateCheckInTime();
    const checkOutTime = generateCheckOutTime(checkInTime);
    const workingHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    const joiningDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    
    return {
      id: index + 1,
      staffId: index + 1001,
      name: names[index % names.length],
      email: emails[index % emails.length],
      phone: phones[index],
      role: roles[Math.floor(Math.random() * roles.length)],
      department: departments[Math.floor(Math.random() * departments.length)],
      dateOfJoining: joiningDate,
      profilePicture: profilePictures[Math.floor(Math.random() * profilePictures.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      attendanceStatus: attendanceStatuses[Math.floor(Math.random() * attendanceStatuses.length)],
      checkInTime: Math.random() > 0.1 ? checkInTime : undefined,
      checkOutTime: Math.random() > 0.3 ? checkOutTime : undefined,
      workingHours: Math.random() > 0.1 ? parseFloat(workingHours.toFixed(2)) : undefined,
      breakTime: Math.random() > 0.5 ? Math.floor(Math.random() * 90 + 30) : undefined,
      overtimeHours: Math.random() > 0.7 ? parseFloat((Math.random() * 3).toFixed(2)) : undefined,
      notes: Math.random() > 0.8 ? ['On field duty', 'Training session', 'Client meeting', 'Medical checkup'][Math.floor(Math.random() * 4)] : undefined,
      date: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      markedBy: Math.random() > 0.5 ? 'System Auto' : 'Admin User'
    };
  });
};

// Styled Components
const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  min-height: calc(100vh - 6rem);
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
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const HeaderContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  align-items: center;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const StatsCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.boxShadow.md};
  }
`;

const StatsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const StatsIcon = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ color }) => color};
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
`;

const StatsValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatsLabel = styled.div`
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
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[10]} ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[900]};
  background: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray[400]};
  pointer-events: none;
`;

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[900]};
  background: ${({ theme }) => theme.colors.white};
  min-width: 150px;
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const Button = styled.button<{ 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'warning' | 'outline-danger';
  size?: 'sm' | 'md' | 'lg';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme, size }) => {
    switch (size) {
      case 'sm': return `${theme.spacing[2]} ${theme.spacing[3]}`;
      case 'lg': return `${theme.spacing[4]} ${theme.spacing[6]}`;
      default: return `${theme.spacing[3]} ${theme.spacing[4]}`;
    }
  }};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme, size }) => {
    switch (size) {
      case 'sm': return theme.typography.fontSize.xs;
      case 'lg': return theme.typography.fontSize.lg;
      default: return theme.typography.fontSize.sm;
    }
  }};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  white-space: nowrap;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ theme, variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary[600]};
          border-color: ${theme.colors.primary[600]};
          color: ${theme.colors.white};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary[700]};
            border-color: ${theme.colors.primary[700]};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error[600]};
          border-color: ${theme.colors.error[600]};
          color: ${theme.colors.white};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.error[700]};
            border-color: ${theme.colors.error[700]};
          }
        `;
      case 'success':
        return `
          background: ${theme.colors.success[600]};
          border-color: ${theme.colors.success[600]};
          color: ${theme.colors.white};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.success[700]};
            border-color: ${theme.colors.success[700]};
          }
        `;
      case 'warning':
        return `
          background: ${theme.colors.warning[600]};
          border-color: ${theme.colors.warning[600]};
          color: ${theme.colors.white};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.warning[700]};
            border-color: ${theme.colors.warning[700]};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          border-color: ${theme.colors.gray[300]};
          color: ${theme.colors.gray[700]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.gray[50]};
            border-color: ${theme.colors.gray[400]};
          }
        `;
      case 'outline-danger':
        return `
          background: transparent;
          border-color: ${theme.colors.error[600]};
          color: ${theme.colors.error[600]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.error[600]};
            color: ${theme.colors.white};
          }
        `;
      default:
        return `
          background: ${theme.colors.white};
          border-color: ${theme.colors.gray[300]};
          color: ${theme.colors.gray[700]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.gray[50]};
            border-color: ${theme.colors.gray[400]};
          }
        `;
    }
  }}
`;

const BulkActionsBar = styled.div<{ show: boolean }>`
  display: ${({ show }) => show ? 'flex' : 'none'};
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary[200]};
`;

const BulkActionsLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const BulkActionsRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const SelectedCount = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary[700]};
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

const TableHeaderRow = styled.tr``;

const TableHeaderCell = styled.th<{ sortable?: boolean }>`
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: left;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  cursor: ${({ sortable }) => sortable ? 'pointer' : 'default'};
  user-select: none;
  position: relative;

  &:hover {
    background: ${({ theme, sortable }) => sortable ? theme.colors.gray[100] : 'transparent'};
  }

  &:first-child {
    padding-left: ${({ theme }) => theme.spacing[4]};
  }

  &:last-child {
    padding-right: ${({ theme }) => theme.spacing[4]};
  }
`;

const SortIcon = styled.span`
  margin-left: ${({ theme }) => theme.spacing[1]};
  display: inline-flex;
  flex-direction: column;
  align-items: center;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{ selected?: boolean }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: ${({ theme }) => theme.transition.colors};
  background: ${({ theme, selected }) => selected ? theme.colors.primary[50] : theme.colors.white};

  &:hover {
    background: ${({ theme, selected }) => selected ? theme.colors.primary[100] : theme.colors.gray[50]};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[900]};
  vertical-align: middle;

  &:first-child {
    padding-left: ${({ theme }) => theme.spacing[4]};
  }

  &:last-child {
    padding-right: ${({ theme }) => theme.spacing[4]};
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  cursor: pointer;

  &:checked {
    background: ${({ theme }) => theme.colors.primary[600]};
    border-color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const Avatar = styled.div<{ src?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme, src }) => src ? `url(${src}) center/cover` : theme.colors.gray[300]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray[600]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border: 2px solid ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
`;

const StaffInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const StaffDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const StaffName = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const StaffEmail = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const Badge = styled.span<{ variant: 'success' | 'error' | 'warning' | 'info' | 'default' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.025em;

  ${({ theme, variant }) => {
    switch (variant) {
      case 'success':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[800]};
        `;
      case 'error':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[800]};
        `;
      case 'warning':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[800]};
        `;
      case 'info':
        return `
          background: ${theme.colors.info[100]};
          color: ${theme.colors.info[800]};
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[800]};
        `;
    }
  }}
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[400]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[600]};
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.gray[50]};
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

const PaginationButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid ${({ theme, active }) => active ? theme.colors.primary[500] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, active }) => active ? theme.colors.primary[500] : theme.colors.white};
  color: ${({ theme, active }) => active ? theme.colors.white : theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};

  &:hover:not(:disabled) {
    background: ${({ theme, active }) => active ? theme.colors.primary[600] : theme.colors.gray[50]};
    border-color: ${({ theme, active }) => active ? theme.colors.primary[600] : theme.colors.gray[400]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Utility functions
const getAttendanceStatusVariant = (status: AttendanceStatus): 'success' | 'error' | 'warning' | 'info' | 'default' => {
  switch (status) {
    case AttendanceStatus.PRESENT:
      return 'success';
    case AttendanceStatus.ABSENT:
      return 'error';
    case AttendanceStatus.LATE:
      return 'warning';
    case AttendanceStatus.HALF_DAY:
      return 'info';
    case AttendanceStatus.LEAVE:
      return 'info';
    case AttendanceStatus.HOLIDAY:
      return 'default';
    default:
      return 'default';
  }
};

const getAttendanceStatusIcon = (status: AttendanceStatus) => {
  switch (status) {
    case AttendanceStatus.PRESENT:
      return <FiCheckCircle />;
    case AttendanceStatus.ABSENT:
      return <FiXCircle />;
    case AttendanceStatus.LATE:
      return <FiAlertCircle />;
    case AttendanceStatus.HALF_DAY:
      return <FiClock />;
    case AttendanceStatus.LEAVE:
      return <FiCalendar />;
    case AttendanceStatus.HOLIDAY:
      return <FiCalendar />;
    default:
      return <FiActivity />;
  }
};

const formatTime = (date?: Date): string => {
  if (!date) return '--';
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const StaffAttendancePage: React.FC = () => {
  // State management
  const [attendanceData, setAttendanceData] = useState<StaffAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Search and filter state
  const [searchFilters, setSearchFilters] = useState<AttendanceSearchFilters>({
    searchTerm: '',
    role: undefined,
    department: undefined,
    attendanceStatus: undefined,
    startDate: undefined,
    endDate: undefined
  });

  // Sort state
  const [sortOptions, setSortOptions] = useState<AttendanceSortOptions>({
    field: AttendanceSortField.NAME,
    direction: SortDirection.ASC
  });

  // Pagination state
  const [pagination, setPagination] = useState<AttendancePaginationOptions>({
    page: 1,
    limit: 10,
    total: 0
  });

  // Modal state
  const [modalMode, setModalMode] = useState<AttendanceModalMode | null>(null);

  // Load mock data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockData = createMockAttendanceData(50);
        setAttendanceData(mockData);
        setPagination(prev => ({ ...prev, total: mockData.length }));
      } catch (error) {
        toast.error('Failed to load staff attendance data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate stats
  const stats: AttendanceStats = useMemo(() => {
    const totalStaff = attendanceData.length;
    const present = attendanceData.filter(staff => staff.attendanceStatus === AttendanceStatus.PRESENT).length;
    const absent = attendanceData.filter(staff => staff.attendanceStatus === AttendanceStatus.ABSENT).length;
    const late = attendanceData.filter(staff => staff.attendanceStatus === AttendanceStatus.LATE).length;
    const onLeave = attendanceData.filter(staff => staff.attendanceStatus === AttendanceStatus.LEAVE).length;
    const attendanceRate = totalStaff > 0 ? (present / totalStaff) * 100 : 0;

    return {
      totalStaff,
      present,
      absent,
      late,
      onLeave,
      attendanceRate
    };
  }, [attendanceData]);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...attendanceData];

    // Apply search filter
    if (searchFilters.searchTerm) {
      const searchTerm = searchFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm) ||
        staff.email.toLowerCase().includes(searchTerm) ||
        staff.phone.toLowerCase().includes(searchTerm)
      );
    }

    // Apply role filter
    if (searchFilters.role) {
      filtered = filtered.filter(staff => staff.role === searchFilters.role);
    }

    // Apply department filter
    if (searchFilters.department) {
      filtered = filtered.filter(staff => staff.department === searchFilters.department);
    }

    // Apply attendance status filter
    if (searchFilters.attendanceStatus) {
      filtered = filtered.filter(staff => staff.attendanceStatus === searchFilters.attendanceStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortOptions.field) {
        case AttendanceSortField.NAME:
          aValue = a.name;
          bValue = b.name;
          break;
        case AttendanceSortField.EMAIL:
          aValue = a.email;
          bValue = b.email;
          break;
        case AttendanceSortField.PHONE:
          aValue = a.phone;
          bValue = b.phone;
          break;
        case AttendanceSortField.ROLE:
          aValue = a.role;
          bValue = b.role;
          break;
        case AttendanceSortField.DEPARTMENT:
          aValue = a.department;
          bValue = b.department;
          break;
        case AttendanceSortField.DATE_OF_JOINING:
          aValue = a.dateOfJoining.getTime();
          bValue = b.dateOfJoining.getTime();
          break;
        case AttendanceSortField.ATTENDANCE_STATUS:
          aValue = a.attendanceStatus;
          bValue = b.attendanceStatus;
          break;
        case AttendanceSortField.CHECK_IN_TIME:
          aValue = a.checkInTime?.getTime() || 0;
          bValue = b.checkInTime?.getTime() || 0;
          break;
        case AttendanceSortField.CHECK_OUT_TIME:
          aValue = a.checkOutTime?.getTime() || 0;
          bValue = b.checkOutTime?.getTime() || 0;
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOptions.direction === SortDirection.ASC) {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [attendanceData, searchFilters, sortOptions]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    return filteredAndSortedData.slice(startIndex, endIndex);
  }, [filteredAndSortedData, pagination.page, pagination.limit]);

  // Update pagination total when filtered data changes
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: filteredAndSortedData.length,
      page: 1 // Reset to first page when filters change
    }));
  }, [filteredAndSortedData.length]);

  // Event handlers
  const handleSearch = useCallback((searchTerm: string) => {
    setSearchFilters(prev => ({ ...prev, searchTerm }));
  }, []);

  const handleFilterChange = useCallback((key: keyof AttendanceSearchFilters, value: any) => {
    setSearchFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleSort = useCallback((field: AttendanceSortField) => {
    setSortOptions(prev => ({
      field,
      direction: prev.field === field && prev.direction === SortDirection.ASC 
        ? SortDirection.DESC 
        : SortDirection.ASC
    }));
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedStaff([]);
    } else {
      setSelectedStaff(paginatedData.map(staff => staff.id));
    }
    setSelectAll(!selectAll);
  }, [selectAll, paginatedData]);

  const handleSelectStaff = useCallback((staffId: number) => {
    setSelectedStaff(prev => {
      const newSelected = prev.includes(staffId)
        ? prev.filter(id => id !== staffId)
        : [...prev, staffId];
      
      setSelectAll(newSelected.length === paginatedData.length);
      return newSelected;
    });
  }, [paginatedData.length]);

  const handleBulkAction = useCallback(async (action: AttendanceActionType) => {
    if (selectedStaff.length === 0) {
      toast.warning('Please select staff members to perform bulk action');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let message = '';
      switch (action) {
        case AttendanceActionType.MARK_PRESENT:
          message = `Marked ${selectedStaff.length} staff members as present`;
          break;
        case AttendanceActionType.MARK_ABSENT:
          message = `Marked ${selectedStaff.length} staff members as absent`;
          break;
        case AttendanceActionType.DELETE:
          message = `Deleted attendance records for ${selectedStaff.length} staff members`;
          break;
        default:
          message = `Bulk action performed on ${selectedStaff.length} staff members`;
      }

      toast.success(message);
      setSelectedStaff([]);
      setSelectAll(false);
    } catch (error) {
      toast.error('Failed to perform bulk action');
    }
  }, [selectedStaff]);

  const handleExport = useCallback(async (format: ExportFormat) => {
    try {
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Staff attendance data exported as ${format}`);
    } catch (error) {
      toast.error('Failed to export data');
    }
  }, []);

  const handleRefresh = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData = createMockAttendanceData(50);
      setAttendanceData(mockData);
      toast.success('Data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleView = useCallback((staff: StaffAttendance) => {
    setModalMode({ type: 'view', data: staff });
  }, []);

  const handleEdit = useCallback((staff: StaffAttendance) => {
    setModalMode({ type: 'edit', data: staff });
  }, []);

  const handleDelete = useCallback(async (staffId: number) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        toast.success('Attendance record deleted successfully');
      } catch (error) {
        toast.error('Failed to delete attendance record');
      }
    }
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil((pagination.total || 0) / pagination.limit);
  const startIndex = (pagination.page - 1) * pagination.limit + 1;
  const endIndex = Math.min(pagination.page * pagination.limit, pagination.total || 0);

  return (
    <Container>
      {/* Page Header */}
      <PageHeader>
        <HeaderTop>
          <HeaderContent>
            <Title>
              <FiUsers />
              Staff Attendance
            </Title>
            <Subtitle>
              Monitor and manage daily attendance for all staff members
            </Subtitle>
          </HeaderContent>
          <HeaderActions>
            <Button variant="outline" onClick={handleRefresh} disabled={loading}>
              <FiRefreshCw />
              Refresh
            </Button>
            <Button variant="outline" onClick={() => handleExport(ExportFormat.CSV)}>
              <FiDownload />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport(ExportFormat.EXCEL)}>
              <FiDownload />
              Export Excel
            </Button>
          </HeaderActions>
        </HeaderTop>

        {/* Stats */}
        <StatsContainer>
          <StatsCard>
            <StatsHeader>
              <StatsIcon color="#10B981">
                <FiUsers />
              </StatsIcon>
            </StatsHeader>
            <StatsValue>{stats.totalStaff}</StatsValue>
            <StatsLabel>Total Staff</StatsLabel>
          </StatsCard>
          
          <StatsCard>
            <StatsHeader>
              <StatsIcon color="#059669">
                <FiCheckCircle />
              </StatsIcon>
            </StatsHeader>
            <StatsValue>{stats.present}</StatsValue>
            <StatsLabel>Present Today</StatsLabel>
          </StatsCard>
          
          <StatsCard>
            <StatsHeader>
              <StatsIcon color="#DC2626">
                <FiXCircle />
              </StatsIcon>
            </StatsHeader>
            <StatsValue>{stats.absent}</StatsValue>
            <StatsLabel>Absent Today</StatsLabel>
          </StatsCard>
          
          <StatsCard>
            <StatsHeader>
              <StatsIcon color="#D97706">
                <FiAlertCircle />
              </StatsIcon>
            </StatsHeader>
            <StatsValue>{stats.late}</StatsValue>
            <StatsLabel>Late Today</StatsLabel>
          </StatsCard>
          
          <StatsCard>
            <StatsHeader>
              <StatsIcon color="#2563EB">
                <FiCalendar />
              </StatsIcon>
            </StatsHeader>
            <StatsValue>{stats.onLeave}</StatsValue>
            <StatsLabel>On Leave</StatsLabel>
          </StatsCard>
          
          <StatsCard>
            <StatsHeader>
              <StatsIcon color="#7C3AED">
                <FiActivity />
              </StatsIcon>
            </StatsHeader>
            <StatsValue>{stats.attendanceRate.toFixed(1)}%</StatsValue>
            <StatsLabel>Attendance Rate</StatsLabel>
          </StatsCard>
        </StatsContainer>
      </PageHeader>

      {/* Content */}
      <ContentCard>
        {/* Filters */}
        <FilterSection>
          <FilterRow>
            <SearchContainer>
              <SearchIcon>
                <FiSearch />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchFilters.searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </SearchContainer>
            
            <FilterSelect
              value={searchFilters.role || ''}
              onChange={(e) => handleFilterChange('role', e.target.value || undefined)}
            >
              <option value="">All Roles</option>
              {Object.values(StaffRole).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </FilterSelect>
            
            <FilterSelect
              value={searchFilters.department || ''}
              onChange={(e) => handleFilterChange('department', e.target.value || undefined)}
            >
              <option value="">All Departments</option>
              {Object.values(Department).map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </FilterSelect>
            
            <FilterSelect
              value={searchFilters.attendanceStatus || ''}
              onChange={(e) => handleFilterChange('attendanceStatus', e.target.value || undefined)}
            >
              <option value="">All Status</option>
              {Object.values(AttendanceStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </FilterSelect>
          </FilterRow>
        </FilterSection>

        {/* Bulk Actions */}
        <BulkActionsBar show={selectedStaff.length > 0}>
          <BulkActionsLeft>
            <SelectedCount>{selectedStaff.length} selected</SelectedCount>
          </BulkActionsLeft>
          <BulkActionsRight>
            <Button 
              variant="success" 
              size="sm" 
              onClick={() => handleBulkAction(AttendanceActionType.MARK_PRESENT)}
            >
              <FiCheck />
              Mark Present
            </Button>
            <Button 
              variant="warning" 
              size="sm" 
              onClick={() => handleBulkAction(AttendanceActionType.MARK_ABSENT)}
            >
              <FiX />
              Mark Absent
            </Button>
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={() => handleBulkAction(AttendanceActionType.DELETE)}
            >
              <FiTrash2 />
              Delete
            </Button>
          </BulkActionsRight>
        </BulkActionsBar>

        {/* Table */}
        <TableContainer>
          <Table>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </TableHeaderCell>
                <TableHeaderCell sortable onClick={() => handleSort(AttendanceSortField.NAME)}>
                  Staff Member
                  <SortIcon>
                    {sortOptions.field === AttendanceSortField.NAME && sortOptions.direction === SortDirection.ASC && <FiChevronUp />}
                    {sortOptions.field === AttendanceSortField.NAME && sortOptions.direction === SortDirection.DESC && <FiChevronDown />}
                  </SortIcon>
                </TableHeaderCell>
                <TableHeaderCell sortable onClick={() => handleSort(AttendanceSortField.PHONE)}>
                  Phone Number
                </TableHeaderCell>
                <TableHeaderCell sortable onClick={() => handleSort(AttendanceSortField.ROLE)}>
                  Role
                </TableHeaderCell>
                <TableHeaderCell sortable onClick={() => handleSort(AttendanceSortField.DEPARTMENT)}>
                  Department
                </TableHeaderCell>
                <TableHeaderCell sortable onClick={() => handleSort(AttendanceSortField.DATE_OF_JOINING)}>
                  Date of Joining
                </TableHeaderCell>
                <TableHeaderCell sortable onClick={() => handleSort(AttendanceSortField.ATTENDANCE_STATUS)}>
                  Attendance Status
                </TableHeaderCell>
                <TableHeaderCell sortable onClick={() => handleSort(AttendanceSortField.CHECK_IN_TIME)}>
                  Check In
                </TableHeaderCell>
                <TableHeaderCell sortable onClick={() => handleSort(AttendanceSortField.CHECK_OUT_TIME)}>
                  Check Out
                </TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading attendance data...
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} style={{ textAlign: 'center', padding: '2rem' }}>
                    No staff attendance records found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((staff) => (
                  <TableRow key={staff.id} selected={selectedStaff.includes(staff.id)}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStaff.includes(staff.id)}
                        onChange={() => handleSelectStaff(staff.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <StaffInfo>
                        <Avatar src={staff.profilePicture}>
                          {!staff.profilePicture && <FiUser />}
                        </Avatar>
                        <StaffDetails>
                          <StaffName>{staff.name}</StaffName>
                          <StaffEmail>{staff.email}</StaffEmail>
                        </StaffDetails>
                      </StaffInfo>
                    </TableCell>
                    <TableCell>{staff.phone}</TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>{staff.department}</TableCell>
                    <TableCell>{formatDate(staff.dateOfJoining)}</TableCell>
                    <TableCell>
                      <Badge variant={getAttendanceStatusVariant(staff.attendanceStatus)}>
                        {getAttendanceStatusIcon(staff.attendanceStatus)}
                        {staff.attendanceStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatTime(staff.checkInTime)}</TableCell>
                    <TableCell>{formatTime(staff.checkOutTime)}</TableCell>
                    <TableCell>
                      <ActionsContainer>
                        <ActionButton onClick={() => handleView(staff)} title="View Details">
                          <FiEye />
                        </ActionButton>
                        <ActionButton onClick={() => handleEdit(staff)} title="Edit Attendance">
                          <FiEdit3 />
                        </ActionButton>
                        <ActionButton onClick={() => handleDelete(staff.id)} title="Delete Record">
                          <FiTrash2 />
                        </ActionButton>
                      </ActionsContainer>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <PaginationContainer>
          <PaginationInfo>
            Showing {startIndex} to {endIndex} of {pagination.total} entries
          </PaginationInfo>
          <PaginationControls>
            <PaginationButton
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <FiChevronLeft />
            </PaginationButton>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = i + 1;
              return (
                <PaginationButton
                  key={pageNumber}
                  active={pageNumber === pagination.page}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </PaginationButton>
              );
            })}
            
            <PaginationButton
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
            >
              <FiChevronRight />
            </PaginationButton>
          </PaginationControls>
        </PaginationContainer>
      </ContentCard>

      {/* Attendance Modal */}
      {modalMode && (
        <AttendanceModal
          mode={modalMode}
          onClose={() => setModalMode(null)}
          onSave={async (data) => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            // In real app, this would call the API to save attendance data
            console.log('Saving attendance data:', data);
          }}
        />
      )}
    </Container>
  );
};

export default StaffAttendancePage;