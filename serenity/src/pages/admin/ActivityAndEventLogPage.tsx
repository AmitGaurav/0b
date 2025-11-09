import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import {
  FaClipboardList,
  FaSearch,
  FaFilter,
  FaEye,
  FaDownload,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaBell,
  FaFileExport,
  FaTimes,
  FaInfoCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaFlag,
  FaEdit,
  FaCog,
  FaDatabase,
  FaSignInAlt,
  FaSignOutAlt,
  FaUserPlus,
  FaUserMinus,
  FaLock,
  FaUnlock,
  FaBan,
  FaCheck
} from 'react-icons/fa';
import { toast } from 'react-toastify';

// Interfaces
export enum EventType {
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  USER_REGISTRATION = 'user_registration',
  USER_PROFILE_UPDATE = 'user_profile_update',
  USER_PASSWORD_CHANGE = 'user_password_change',
  USER_ACCOUNT_LOCK = 'user_account_lock',
  USER_ACCOUNT_UNLOCK = 'user_account_unlock',
  USER_ROLE_CHANGE = 'user_role_change',
  USER_PERMISSION_CHANGE = 'user_permission_change',
  VENDOR_REGISTRATION = 'vendor_registration',
  VENDOR_VERIFICATION = 'vendor_verification',
  VENDOR_APPROVAL = 'vendor_approval',
  VENDOR_REJECTION = 'vendor_rejection',
  SERVICE_REQUEST = 'service_request',
  SERVICE_COMPLETION = 'service_completion',
  COMPLAINT_SUBMITTED = 'complaint_submitted',
  COMPLAINT_RESOLVED = 'complaint_resolved',
  MAINTENANCE_REQUEST = 'maintenance_request',
  MAINTENANCE_COMPLETED = 'maintenance_completed',
  ANNOUNCEMENT_CREATED = 'announcement_created',
  ANNOUNCEMENT_UPDATED = 'announcement_updated',
  ANNOUNCEMENT_DELETED = 'announcement_deleted',
  POLL_CREATED = 'poll_created',
  POLL_VOTED = 'poll_voted',
  EVENT_CREATED = 'event_created',
  EVENT_UPDATED = 'event_updated',
  EVENT_CANCELLED = 'event_cancelled',
  DOCUMENT_UPLOADED = 'document_uploaded',
  DOCUMENT_DOWNLOADED = 'document_downloaded',
  DOCUMENT_DELETED = 'document_deleted',
  PAYMENT_PROCESSED = 'payment_processed',
  PAYMENT_FAILED = 'payment_failed',
  SYSTEM_BACKUP = 'system_backup',
  SYSTEM_MAINTENANCE = 'system_maintenance',
  SECURITY_ALERT = 'security_alert',
  DATA_EXPORT = 'data_export',
  BULK_UPLOAD = 'bulk_upload',
  CONFIGURATION_CHANGE = 'configuration_change'
}

export enum EventStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  CANCELLED = 'cancelled',
  WARNING = 'warning'
}

export enum EventPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface ActivityEvent {
  id: string;
  eventType: EventType;
  title: string;
  description: string;
  userId: string;
  userName: string;
  userRole: string;
  timestamp: Date;
  status: EventStatus;
  priority: EventPriority;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  affectedResource?: string;
  beforeValue?: any;
  afterValue?: any;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface SearchFilters {
  query: string;
  eventType: EventType | '';
  status: EventStatus | '';
  priority: EventPriority | '';
  userId: string;
  dateFrom: string;
  dateTo: string;
}

export interface SortOptions {
  field: keyof ActivityEvent;
  direction: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
}

export interface ExportOptions {
  format: 'csv' | 'excel';
  includeFilters: boolean;
  selectedFields: (keyof ActivityEvent)[];
}

// Styled Components (following Society Members page design)
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

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.gray[50]};
  min-height: 100vh;
`;

const ContentCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  overflow: hidden;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const StatCard = styled(ContentCard)`
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.boxShadow.md};
  }
`;

const StatIcon = styled.div<{ color?: string }>`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.white};
  background: ${({ color, theme }) => color || theme.colors.primary[500]};
  flex-shrink: 0;
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
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

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

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border: 1px solid transparent;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  white-space: nowrap;
  
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
      case 'warning':
        return `
          background: ${theme.colors.warning[600]};
          color: ${theme.colors.white};
          border-color: ${theme.colors.warning[600]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.warning[700]};
            border-color: ${theme.colors.warning[700]};
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
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
  padding: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[700]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transition.colors};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

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

const EnhancedTable = styled.table`
  width: 100%;
  min-width: 1400px;
  border-collapse: collapse;
  table-layout: fixed;
  
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
    position: sticky;
    top: 0;
    z-index: 10;
    
    &:hover {
      background: ${({ theme }) => theme.colors.gray[100]};
    }
  }
  
  tbody tr:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }
  
  .col-id { width: 100px; }
  .col-type { width: 150px; }
  .col-title { width: 200px; }
  .col-description { width: 250px; }
  .col-user { width: 150px; }
  .col-timestamp { width: 180px; }
  .col-status { width: 120px; }
  .col-priority { width: 100px; }
  .col-actions { width: 120px; }
`;

const Badge = styled.span<{ variant?: 'success' | 'danger' | 'warning' | 'info' | 'primary' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'success':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[800]};
        `;
      case 'danger':
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
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[800]};
        `;
    }
  }}
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.gray[50]};
`;

const PaginationInfo = styled.div`
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const PaginationControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ active, theme }) => active ? theme.colors.primary[600] : theme.colors.white};
  color: ${({ active, theme }) => active ? theme.colors.white : theme.colors.gray[700]};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover:not(:disabled) {
    background: ${({ active, theme }) => active ? theme.colors.primary[700] : theme.colors.gray[50]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[12]};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]};
  color: ${({ theme }) => theme.colors.gray[500]};
  
  .icon {
    font-size: 48px;
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.gray[400]};
  }
  
  h3 {
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

// Modal Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  width: 90vw;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.boxShadow.xl};
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.gray[600]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[200]};
  }
`;

const ModalContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const DetailItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const DetailLabel = styled.dt`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DetailValue = styled.dd`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
  word-break: break-word;
`;

const CodeBlock = styled.pre`
  background: ${({ theme }) => theme.colors.gray[100]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[800]};
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ActivityAndEventLogPage: React.FC = () => {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityEvent | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<ActivityEvent | null>(null);
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    eventType: '',
    status: '',
    priority: '',
    userId: '',
    dateFrom: '',
    dateTo: ''
  });
  
  const [sort, setSort] = useState<SortOptions>({
    field: 'timestamp',
    direction: 'desc'
  });
  
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    limit: 25,
    total: 0
  });

  // Mock data
  const mockActivities: ActivityEvent[] = [
    {
      id: 'evt_001',
      eventType: EventType.USER_LOGIN,
      title: 'User Login',
      description: 'User successfully logged into the system',
      userId: 'user_123',
      userName: 'John Doe',
      userRole: 'Admin',
      timestamp: new Date('2024-01-15T10:30:00Z'),
      status: EventStatus.SUCCESS,
      priority: EventPriority.LOW,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: 'sess_abc123',
      metadata: { loginMethod: 'password' }
    },
    {
      id: 'evt_002',
      eventType: EventType.VENDOR_REGISTRATION,
      title: 'New Vendor Registration',
      description: 'QuickFix Plumbers registered as a new vendor',
      userId: 'admin_456',
      userName: 'Sarah Admin',
      userRole: 'Super Admin',
      timestamp: new Date('2024-01-15T09:15:00Z'),
      status: EventStatus.PENDING,
      priority: EventPriority.MEDIUM,
      affectedResource: 'vendor_789',
      metadata: { vendorName: 'QuickFix Plumbers', category: 'plumbing' }
    },
    {
      id: 'evt_003',
      eventType: EventType.SECURITY_ALERT,
      title: 'Multiple Failed Login Attempts',
      description: 'Detected 5 consecutive failed login attempts from suspicious IP',
      userId: 'system',
      userName: 'System',
      userRole: 'System',
      timestamp: new Date('2024-01-15T08:45:00Z'),
      status: EventStatus.WARNING,
      priority: EventPriority.HIGH,
      ipAddress: '203.0.113.10',
      errorMessage: 'Account temporarily locked due to suspicious activity',
      metadata: { attemptCount: 5, targetUser: 'user_456' }
    },
    {
      id: 'evt_004',
      eventType: EventType.COMPLAINT_SUBMITTED,
      title: 'New Complaint Submitted',
      description: 'Resident submitted complaint about noise disturbance',
      userId: 'user_789',
      userName: 'Mike Resident',
      userRole: 'Resident',
      timestamp: new Date('2024-01-15T14:20:00Z'),
      status: EventStatus.SUCCESS,
      priority: EventPriority.MEDIUM,
      affectedResource: 'complaint_101',
      metadata: { category: 'noise', building: 'A', floor: 3 }
    },
    {
      id: 'evt_005',
      eventType: EventType.SYSTEM_BACKUP,
      title: 'Automated System Backup',
      description: 'Daily system backup completed successfully',
      userId: 'system',
      userName: 'System',
      userRole: 'System',
      timestamp: new Date('2024-01-15T02:00:00Z'),
      status: EventStatus.SUCCESS,
      priority: EventPriority.LOW,
      metadata: { backupSize: '2.3GB', duration: '45min' }
    },
    {
      id: 'evt_006',
      eventType: EventType.PAYMENT_FAILED,
      title: 'Payment Processing Failed',
      description: 'Monthly maintenance payment failed for unit A-301',
      userId: 'user_234',
      userName: 'Lisa Thompson',
      userRole: 'Resident',
      timestamp: new Date('2024-01-15T11:30:00Z'),
      status: EventStatus.FAILED,
      priority: EventPriority.HIGH,
      affectedResource: 'payment_567',
      errorMessage: 'Insufficient funds in account',
      metadata: { amount: 2500, unit: 'A-301', paymentMethod: 'credit_card' }
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setActivities(mockActivities);
      setPagination(prev => ({ ...prev, total: mockActivities.length }));
      setLoading(false);
    }, 1000);
  }, []);

  const filteredAndSortedActivities = useMemo(() => {
    let filtered = activities.filter(activity => {
      const matchesQuery = !filters.query || 
        activity.id.toLowerCase().includes(filters.query.toLowerCase()) ||
        activity.title.toLowerCase().includes(filters.query.toLowerCase()) ||
        activity.description.toLowerCase().includes(filters.query.toLowerCase()) ||
        activity.userName.toLowerCase().includes(filters.query.toLowerCase());
      
      const matchesType = !filters.eventType || activity.eventType === filters.eventType;
      const matchesStatus = !filters.status || activity.status === filters.status;
      const matchesPriority = !filters.priority || activity.priority === filters.priority;
      const matchesUser = !filters.userId || activity.userId.includes(filters.userId);
      
      const matchesDateFrom = !filters.dateFrom || 
        new Date(activity.timestamp) >= new Date(filters.dateFrom);
      const matchesDateTo = !filters.dateTo || 
        new Date(activity.timestamp) <= new Date(filters.dateTo + 'T23:59:59');
      
      return matchesQuery && matchesType && matchesStatus && matchesPriority && 
             matchesUser && matchesDateFrom && matchesDateTo;
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sort.field];
      const bValue = b[sort.field];
      
      if (aValue instanceof Date && bValue instanceof Date) {
        return sort.direction === 'asc' 
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (sort.direction === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });

    return filtered;
  }, [activities, filters, sort]);

  const paginatedActivities = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return filteredAndSortedActivities.slice(start, end);
  }, [filteredAndSortedActivities, pagination.page, pagination.limit]);

  const stats = useMemo(() => {
    const total = activities.length;
    const successful = activities.filter(a => a.status === EventStatus.SUCCESS).length;
    const failed = activities.filter(a => a.status === EventStatus.FAILED).length;
    const warnings = activities.filter(a => a.status === EventStatus.WARNING).length;
    const critical = activities.filter(a => a.priority === EventPriority.CRITICAL).length;
    const high = activities.filter(a => a.priority === EventPriority.HIGH).length;

    return { total, successful, failed, warnings, critical, high };
  }, [activities]);

  const handleSort = (field: keyof ActivityEvent) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleExport = (format: 'csv' | 'excel') => {
    const data = filteredAndSortedActivities.map(activity => ({
      'Event ID': activity.id,
      'Event Type': activity.eventType,
      'Title': activity.title,
      'Description': activity.description,
      'User': activity.userName,
      'Role': activity.userRole,
      'Date & Time': activity.timestamp.toLocaleString(),
      'Status': activity.status,
      'Priority': activity.priority,
      'IP Address': activity.ipAddress || 'N/A',
      'Error Message': activity.errorMessage || 'N/A'
    }));

    if (format === 'csv') {
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      // For Excel export, you would typically use a library like xlsx
      toast.info('Excel export functionality would be implemented with xlsx library');
    }
    
    toast.success(`Activity log exported as ${format.toUpperCase()}`);
  };

  const handleDelete = (activity: ActivityEvent) => {
    setActivities(prev => prev.filter(a => a.id !== activity.id));
    setShowDeleteConfirm(null);
    toast.success('Activity log entry deleted successfully');
  };

  const handleClearFilters = () => {
    setFilters({
      query: '',
      eventType: '',
      status: '',
      priority: '',
      userId: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const getStatusIcon = (status: EventStatus) => {
    switch (status) {
      case EventStatus.SUCCESS:
        return <FaCheckCircle />;
      case EventStatus.FAILED:
        return <FaTimesCircle />;
      case EventStatus.WARNING:
        return <FaExclamationTriangle />;
      case EventStatus.PENDING:
        return <FaClock />;
      case EventStatus.IN_PROGRESS:
        return <FaSpinner className="fa-spin" />;
      default:
        return <FaInfoCircle />;
    }
  };

  const getStatusVariant = (status: EventStatus): 'success' | 'danger' | 'warning' | 'info' => {
    switch (status) {
      case EventStatus.SUCCESS:
        return 'success';
      case EventStatus.FAILED:
        return 'danger';
      case EventStatus.WARNING:
        return 'warning';
      default:
        return 'info';
    }
  };

  const getPriorityVariant = (priority: EventPriority): 'success' | 'danger' | 'warning' | 'info' => {
    switch (priority) {
      case EventPriority.CRITICAL:
        return 'danger';
      case EventPriority.HIGH:
        return 'warning';
      case EventPriority.MEDIUM:
        return 'info';
      default:
        return 'success';
    }
  };

  const getEventTypeIcon = (eventType: EventType) => {
    switch (eventType) {
      case EventType.USER_LOGIN:
      case EventType.USER_LOGOUT:
        return <FaSignInAlt />;
      case EventType.USER_REGISTRATION:
        return <FaUserPlus />;
      case EventType.SECURITY_ALERT:
        return <FaExclamationTriangle />;
      case EventType.SYSTEM_BACKUP:
        return <FaDatabase />;
      case EventType.VENDOR_REGISTRATION:
        return <FaUser />;
      case EventType.COMPLAINT_SUBMITTED:
        return <FaExclamationCircle />;
      case EventType.PAYMENT_PROCESSED:
      case EventType.PAYMENT_FAILED:
        return <FaCog />;
      default:
        return <FaInfoCircle />;
    }
  };

  const getSortIcon = (field: keyof ActivityEvent) => {
    if (sort.field !== field) return <FaSort />;
    return sort.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const totalPages = Math.ceil(filteredAndSortedActivities.length / pagination.limit);

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner>
          <FaSpinner className="fa-spin" size={32} />
        </LoadingSpinner>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <h1>
          <FaClipboardList />
          Activity & Event Log
        </h1>
        <p>
          Monitor and track all system activities, user actions, and events in real-time.
          Keep your society management secure and transparent with comprehensive logging.
        </p>
      </Header>

      {/* Statistics */}
      <StatsGrid>
        <StatCard>
          <StatIcon color="#10B981">
            <FaClipboardList />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total Events</StatLabel>
          </StatInfo>
        </StatCard>
        
        <StatCard>
          <StatIcon color="#059669">
            <FaCheckCircle />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats.successful}</StatValue>
            <StatLabel>Successful</StatLabel>
          </StatInfo>
        </StatCard>
        
        <StatCard>
          <StatIcon color="#DC2626">
            <FaTimesCircle />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats.failed}</StatValue>
            <StatLabel>Failed</StatLabel>
          </StatInfo>
        </StatCard>
        
        <StatCard>
          <StatIcon color="#D97706">
            <FaExclamationTriangle />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats.warnings}</StatValue>
            <StatLabel>Warnings</StatLabel>
          </StatInfo>
        </StatCard>
        
        <StatCard>
          <StatIcon color="#DC2626">
            <FaFlag />
          </StatIcon>
          <StatInfo>
            <StatValue>{stats.critical + stats.high}</StatValue>
            <StatLabel>High Priority</StatLabel>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      {/* Search and Filters */}
      <FiltersCard>
        <div style={{ padding: '1.5rem' }}>
          <SearchFilterRow>
            <SearchInputContainer>
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by event ID, type, description, or user..."
                value={filters.query}
                onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              />
            </SearchInputContainer>
            
            <FilterToggleButton
              active={showFilters}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter />
              Filters
            </FilterToggleButton>
            
            <Button onClick={() => handleExport('csv')}>
              <FaDownload />
              Export CSV
            </Button>
            
            <Button onClick={() => handleExport('excel')}>
              <FaFileExport />
              Export Excel
            </Button>
          </SearchFilterRow>
        </div>

        <FiltersSection show={showFilters}>
          <FilterGrid>
            <FilterGroup>
              <FilterLabel>Event Type</FilterLabel>
              <Select
                value={filters.eventType}
                onChange={(e) => setFilters(prev => ({ ...prev, eventType: e.target.value as EventType }))}
              >
                <option value="">All Types</option>
                {Object.values(EventType).map(type => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Status</FilterLabel>
              <Select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as EventStatus }))}
              >
                <option value="">All Statuses</option>
                {Object.values(EventStatus).map(status => (
                  <option key={status} value={status}>
                    {status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Priority</FilterLabel>
              <Select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as EventPriority }))}
              >
                <option value="">All Priorities</option>
                {Object.values(EventPriority).map(priority => (
                  <option key={priority} value={priority}>
                    {priority.replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>User ID</FilterLabel>
              <Input
                type="text"
                placeholder="Filter by user ID"
                value={filters.userId}
                onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value }))}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Date From</FilterLabel>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Date To</FilterLabel>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              />
            </FilterGroup>
          </FilterGrid>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button onClick={handleClearFilters}>
              <FaTimes />
              Clear Filters
            </Button>
          </div>
        </FiltersSection>
      </FiltersCard>

      {/* Activity Table */}
      <TableWrapper>
        <TableHeader>
          <TableTitle>
            <FaClipboardList />
            Activity Events ({filteredAndSortedActivities.length})
          </TableTitle>
          <TableControls>
            <Button onClick={() => window.location.reload()}>
              <FaBell />
              Refresh
            </Button>
          </TableControls>
        </TableHeader>

        <ScrollableTableContainer>
          <EnhancedTable>
            <thead>
              <tr>
                <th className="col-id" onClick={() => handleSort('id')}>
                  Event ID {getSortIcon('id')}
                </th>
                <th className="col-type" onClick={() => handleSort('eventType')}>
                  Event Type {getSortIcon('eventType')}
                </th>
                <th className="col-title" onClick={() => handleSort('title')}>
                  Title {getSortIcon('title')}
                </th>
                <th className="col-description">
                  Description
                </th>
                <th className="col-user" onClick={() => handleSort('userName')}>
                  User {getSortIcon('userName')}
                </th>
                <th className="col-timestamp" onClick={() => handleSort('timestamp')}>
                  Date & Time {getSortIcon('timestamp')}
                </th>
                <th className="col-status" onClick={() => handleSort('status')}>
                  Status {getSortIcon('status')}
                </th>
                <th className="col-priority" onClick={() => handleSort('priority')}>
                  Priority {getSortIcon('priority')}
                </th>
                <th className="col-actions">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedActivities.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <EmptyState>
                      <div className="icon">
                        <FaClipboardList />
                      </div>
                      <h3>No activities found</h3>
                      <p>Try adjusting your search criteria or filters.</p>
                    </EmptyState>
                  </td>
                </tr>
              ) : (
                paginatedActivities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="col-id">
                      <code>{activity.id}</code>
                    </td>
                    <td className="col-type">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {getEventTypeIcon(activity.eventType)}
                        {activity.eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </div>
                    </td>
                    <td className="col-title" title={activity.title}>
                      {activity.title}
                    </td>
                    <td className="col-description" title={activity.description}>
                      {activity.description.length > 100 
                        ? `${activity.description.substring(0, 100)}...` 
                        : activity.description}
                    </td>
                    <td className="col-user">
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{activity.userName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{activity.userRole}</div>
                      </div>
                    </td>
                    <td className="col-timestamp">
                      <div>
                        <div>{activity.timestamp.toLocaleDateString()}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                          {activity.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </td>
                    <td className="col-status">
                      <Badge variant={getStatusVariant(activity.status)}>
                        {getStatusIcon(activity.status)}
                        {activity.status}
                      </Badge>
                    </td>
                    <td className="col-priority">
                      <Badge variant={getPriorityVariant(activity.priority)}>
                        {activity.priority}
                      </Badge>
                    </td>
                    <td className="col-actions">
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button
                          variant="secondary"
                          onClick={() => setSelectedActivity(activity)}
                          title="View Details"
                        >
                          <FaEye />
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => setShowDeleteConfirm(activity)}
                          title="Delete"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </EnhancedTable>
        </ScrollableTableContainer>

        {/* Pagination */}
        <PaginationContainer style={{ justifyContent: 'space-between' }}>
          <PaginationInfo>
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, filteredAndSortedActivities.length)} of{' '}
            {filteredAndSortedActivities.length} activities
          </PaginationInfo>
          
          <PaginationControls>
            <PageButton
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <FaChevronLeft />
            </PageButton>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = Math.max(1, Math.min(totalPages - 4, pagination.page - 2)) + i;
              return (
                <PageButton
                  key={page}
                  active={pagination.page === page}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </PageButton>
              );
            })}
            
            <PageButton
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
            >
              <FaChevronRight />
            </PageButton>
          </PaginationControls>
        </PaginationContainer>
      </TableWrapper>

      {/* View Details Modal */}
      {selectedActivity && (
        <Overlay onClick={() => setSelectedActivity(null)}>
          <Modal onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Activity Details</ModalTitle>
              <CloseButton onClick={() => setSelectedActivity(null)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            <ModalContent>
              <DetailGrid>
                <DetailItem>
                  <DetailLabel>Event ID</DetailLabel>
                  <DetailValue><code>{selectedActivity.id}</code></DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>Event Type</DetailLabel>
                  <DetailValue>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {getEventTypeIcon(selectedActivity.eventType)}
                      {selectedActivity.eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  </DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>Title</DetailLabel>
                  <DetailValue>{selectedActivity.title}</DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>Status</DetailLabel>
                  <DetailValue>
                    <Badge variant={getStatusVariant(selectedActivity.status)}>
                      {getStatusIcon(selectedActivity.status)}
                      {selectedActivity.status}
                    </Badge>
                  </DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>Priority</DetailLabel>
                  <DetailValue>
                    <Badge variant={getPriorityVariant(selectedActivity.priority)}>
                      {selectedActivity.priority}
                    </Badge>
                  </DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>User</DetailLabel>
                  <DetailValue>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{selectedActivity.userName}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                        ID: {selectedActivity.userId} | Role: {selectedActivity.userRole}
                      </div>
                    </div>
                  </DetailValue>
                </DetailItem>
                
                <DetailItem>
                  <DetailLabel>Timestamp</DetailLabel>
                  <DetailValue>
                    <div>
                      <div>{selectedActivity.timestamp.toLocaleString()}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                        {selectedActivity.timestamp.toISOString()}
                      </div>
                    </div>
                  </DetailValue>
                </DetailItem>
                
                {selectedActivity.ipAddress && (
                  <DetailItem>
                    <DetailLabel>IP Address</DetailLabel>
                    <DetailValue>{selectedActivity.ipAddress}</DetailValue>
                  </DetailItem>
                )}
                
                {selectedActivity.sessionId && (
                  <DetailItem>
                    <DetailLabel>Session ID</DetailLabel>
                    <DetailValue><code>{selectedActivity.sessionId}</code></DetailValue>
                  </DetailItem>
                )}
                
                {selectedActivity.affectedResource && (
                  <DetailItem>
                    <DetailLabel>Affected Resource</DetailLabel>
                    <DetailValue><code>{selectedActivity.affectedResource}</code></DetailValue>
                  </DetailItem>
                )}
              </DetailGrid>
              
              <DetailItem>
                <DetailLabel>Description</DetailLabel>
                <DetailValue>{selectedActivity.description}</DetailValue>
              </DetailItem>
              
              {selectedActivity.errorMessage && (
                <DetailItem>
                  <DetailLabel>Error Message</DetailLabel>
                  <DetailValue style={{ color: '#DC2626' }}>
                    {selectedActivity.errorMessage}
                  </DetailValue>
                </DetailItem>
              )}
              
              {selectedActivity.userAgent && (
                <DetailItem>
                  <DetailLabel>User Agent</DetailLabel>
                  <CodeBlock>{selectedActivity.userAgent}</CodeBlock>
                </DetailItem>
              )}
              
              {selectedActivity.metadata && Object.keys(selectedActivity.metadata).length > 0 && (
                <DetailItem>
                  <DetailLabel>Metadata</DetailLabel>
                  <CodeBlock>
                    {JSON.stringify(selectedActivity.metadata, null, 2)}
                  </CodeBlock>
                </DetailItem>
              )}
            </ModalContent>
          </Modal>
        </Overlay>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Overlay onClick={() => setShowDeleteConfirm(null)}>
          <Modal onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <ModalHeader>
              <ModalTitle>Confirm Deletion</ModalTitle>
              <CloseButton onClick={() => setShowDeleteConfirm(null)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            <ModalContent>
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <FaExclamationTriangle size={48} style={{ color: '#DC2626', marginBottom: '1rem' }} />
                <h3 style={{ marginBottom: '1rem' }}>Delete Activity Log Entry?</h3>
                <p style={{ marginBottom: '2rem', color: '#6B7280' }}>
                  Are you sure you want to delete this activity log entry? This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <Button onClick={() => setShowDeleteConfirm(null)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="danger"
                    onClick={() => handleDelete(showDeleteConfirm)}
                  >
                    <FaTrash />
                    Delete
                  </Button>
                </div>
              </div>
            </ModalContent>
          </Modal>
        </Overlay>
      )}
    </PageContainer>
  );
};

export default ActivityAndEventLogPage;