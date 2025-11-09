import React, { useState, useCallback, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import {
  FaUsers,
  FaUserShield,
  FaDownload,
  FaUpload,
  FaSearch,
  FaFilter,
  FaEye,
  FaFileAlt,
  FaFileCsv,
  FaFileExcel,
  FaCheckCircle,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle,
  FaCloudUploadAlt,
  FaTrash,
  FaChartBar,
  FaCalendarAlt,
  FaClock,
  FaKey,
  FaLock,
  FaUserCog,
  FaShieldAlt,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaChevronLeft,
  FaChevronRight,
  FaCog
} from 'react-icons/fa';
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
  FormInput,
  Badge
} from '../../components/common/PageLayout';

// Types for vendor roles and permissions
interface VendorRole {
  id: string;
  vendorId: string;
  vendorName: string;
  role: string;
  permissions: string[];
  assignedBy: string;
  assignedDate: string;
  lastModified: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  description: string;
}

interface UploadStats {
  totalRoles: number;
  activeRoles: number;
  inactiveRoles: number;
  totalUploads: number;
  lastUpload: string | null;
}

interface UploadProgress {
  isUploading: boolean;
  progress: number;
  currentFile: string | null;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
}

interface UploadResult {
  id: string;
  fileName: string;
  status: 'success' | 'error' | 'warning';
  uploadedAt: string;
  totalRows: number;
  successRows: number;
  errorRows: number;
  errors: string[];
  warnings: string[];
}

interface FileInfo {
  file: File;
  id: string;
  errors: string[];
  isValid: boolean;
}

// Styled Components following Society Members design patterns
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
  border: 1px solid ${({ theme, active }) => 
    active ? theme.colors.primary[500] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, active }) => 
    active ? theme.colors.primary[50] : theme.colors.white};
  color: ${({ theme, active }) => 
    active ? theme.colors.primary[700] : theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
`;

// Upload Components
const UploadSection = styled(ContentCard)`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SampleDownloadSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SampleCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[300]};
    box-shadow: ${({ theme }) => theme.boxShadow.sm};
  }
  
  .icon {
    font-size: 2.5rem;
    color: ${({ theme }) => theme.colors.primary[500]};
    margin-bottom: ${({ theme }) => theme.spacing[3]};
  }
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
  
  p {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.gray[600]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

const DropZone = styled.div<{ isDragActive?: boolean; hasFiles?: boolean }>`
  border: 2px dashed ${({ theme, isDragActive, hasFiles }) => 
    isDragActive ? theme.colors.primary[400] : 
    hasFiles ? theme.colors.success[400] : 
    theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[8]};
  text-align: center;
  background: ${({ theme, isDragActive }) => 
    isDragActive ? theme.colors.primary[50] : theme.colors.gray[50]};
  transition: ${({ theme }) => theme.transition.all};
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
  
  .upload-icon {
    font-size: 3rem;
    color: ${({ theme, isDragActive }) => 
      isDragActive ? theme.colors.primary[500] : theme.colors.gray[400]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
  
  p {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.gray[600]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
  
  .supported-formats {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.gray[500]};
    margin-top: ${({ theme }) => theme.spacing[2]};
  }
`;

const FileList = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const FileItem = styled.div<{ isValid?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme, isValid }) => 
    isValid === false ? theme.colors.error[300] : theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  
  .file-info {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[3]};
    flex: 1;
    
    .file-icon {
      font-size: 1.5rem;
      color: ${({ theme, isValid }) => 
        isValid === false ? theme.colors.error[500] : theme.colors.primary[500]};
    }
    
    .file-details {
      .file-name {
        font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
        color: ${({ theme }) => theme.colors.gray[900]};
        margin-bottom: 2px;
      }
      
      .file-size {
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
        color: ${({ theme }) => theme.colors.gray[500]};
      }
      
      .file-errors {
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
        color: ${({ theme }) => theme.colors.error[600]};
        margin-top: 4px;
      }
    }
  }
  
  .file-actions {
    display: flex;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

const ProgressSection = styled.div<{ show?: boolean }>`
  display: ${props => props.show ? 'block' : 'none'};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const ProgressCard = styled(ContentCard)`
  text-align: center;
  
  .progress-icon {
    font-size: 3rem;
    color: ${({ theme }) => theme.colors.primary[500]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
  
  p {
    color: ${({ theme }) => theme.colors.gray[600]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.colors.primary[500]}, 
      ${({ theme }) => theme.colors.primary[600]}
    );
    transition: width 0.3s ease;
    border-radius: ${({ theme }) => theme.borderRadius.full};
  }
`;

const ResultsSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const ResultsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const ResultCard = styled.div<{ status?: 'success' | 'error' | 'warning' }>`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme, status }) => 
    status === 'success' ? theme.colors.success[300] :
    status === 'error' ? theme.colors.error[300] :
    status === 'warning' ? theme.colors.warning[300] :
    theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  
  .result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${({ theme }) => theme.spacing[3]};
    
    .result-info {
      display: flex;
      align-items: center;
      gap: ${({ theme }) => theme.spacing[3]};
      
      .result-icon {
        font-size: 1.5rem;
        color: ${({ theme, status }) => 
          status === 'success' ? theme.colors.success[500] :
          status === 'error' ? theme.colors.error[500] :
          status === 'warning' ? theme.colors.warning[500] :
          theme.colors.gray[500]};
      }
      
      .result-details {
        .file-name {
          font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
          color: ${({ theme }) => theme.colors.gray[900]};
        }
        
        .upload-time {
          font-size: ${({ theme }) => theme.typography.fontSize.xs};
          color: ${({ theme }) => theme.colors.gray[500]};
        }
      }
    }
    
    .result-actions {
      display: flex;
      gap: ${({ theme }) => theme.spacing[2]};
    }
  }
  
  .result-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing[4]};
    margin-bottom: ${({ theme }) => theme.spacing[3]};
    
    .stat {
      text-align: center;
      
      .stat-value {
        font-size: ${({ theme }) => theme.typography.fontSize.xl};
        font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
        color: ${({ theme }) => theme.colors.gray[900]};
      }
      
      .stat-label {
        font-size: ${({ theme }) => theme.typography.fontSize.xs};
        color: ${({ theme }) => theme.colors.gray[600]};
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }
  }
  
  .result-messages {
    .error-list, .warning-list {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
        padding: ${({ theme }) => theme.spacing[1]} 0;
        color: ${({ theme, status }) => 
          status === 'error' ? theme.colors.error[700] : theme.colors.warning[700]};
      }
    }
  }
`;

// Table Components
const TableWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const ScrollableTableContainer = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.white};
`;

const EnhancedTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  }
  
  th {
    background: ${({ theme }) => theme.colors.gray[50]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[900]};
    position: sticky;
    top: 0;
    z-index: 10;
  }
  
  tr:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }
  
  td:last-child {
    text-align: center;
  }
`;

const StatusBadge = styled(Badge)<{ status: string }>`
  ${({ status, theme }) => {
    switch (status) {
      case 'ACTIVE':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[800]};
        `;
      case 'INACTIVE':
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[800]};
        `;
      case 'SUSPENDED':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[800]};
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[800]};
        `;
    }
  }}
`;

const RoleBadge = styled(Badge)`
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[800]};
`;

const PermissionsList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  flex-wrap: wrap;
  max-width: 200px;
`;

const PermissionBadge = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  padding: 2px 6px;
  background: ${({ theme }) => theme.colors.secondary[100]};
  color: ${({ theme }) => theme.colors.secondary[800]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  white-space: nowrap;
`;

const ActionCell = styled.td`
  .actions {
    display: flex;
    gap: ${({ theme }) => theme.spacing[2]};
    justify-content: center;
    
    .action-btn {
      padding: ${({ theme }) => theme.spacing[2]};
      border: none;
      border-radius: ${({ theme }) => theme.borderRadius.md};
      cursor: pointer;
      transition: ${({ theme }) => theme.transition.all};
      display: flex;
      align-items: center;
      justify-content: center;
      
      &.view {
        background: ${({ theme }) => theme.colors.info[100]};
        color: ${({ theme }) => theme.colors.info[700]};
        
        &:hover {
          background: ${({ theme }) => theme.colors.info[200]};
        }
      }
    }
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
  }
`;

const PaginationInfo = styled.div`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const PaginationControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
`;

const PageButton = styled.button<{ active?: boolean; disabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme, active }) => 
    active ? theme.colors.primary[500] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, active }) => 
    active ? theme.colors.primary[500] : theme.colors.white};
  color: ${({ theme, active }) => 
    active ? theme.colors.white : theme.colors.gray[700]};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  transition: ${({ theme }) => theme.transition.all};
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme, active }) => 
      active ? theme.colors.primary[600] : theme.colors.primary[50]};
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const VendorRolesPermissionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isUploading: false,
    progress: 0,
    currentFile: null,
    status: 'idle'
  });
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data for vendor roles and permissions
  const [vendorRoles] = useState<VendorRole[]>([
    {
      id: '1',
      vendorId: 'V001',
      vendorName: 'ABC Cleaning Services',
      role: 'Service Provider',
      permissions: ['VIEW_SCHEDULE', 'UPDATE_STATUS', 'COMMUNICATE'],
      assignedBy: 'Admin',
      assignedDate: '2024-01-15',
      lastModified: '2024-01-20',
      status: 'ACTIVE',
      description: 'General cleaning service permissions'
    },
    {
      id: '2',
      vendorId: 'V002',
      vendorName: 'XYZ Security',
      role: 'Security Manager',
      permissions: ['VIEW_SCHEDULE', 'UPDATE_STATUS', 'COMMUNICATE', 'ACCESS_RESTRICTED', 'MANAGE_ALERTS'],
      assignedBy: 'Admin',
      assignedDate: '2024-01-10',
      lastModified: '2024-01-25',
      status: 'ACTIVE',
      description: 'Enhanced security permissions with alert management'
    },
    {
      id: '3',
      vendorId: 'V003',
      vendorName: 'Quick Repairs Co',
      role: 'Maintenance Tech',
      permissions: ['VIEW_SCHEDULE', 'UPDATE_STATUS'],
      assignedBy: 'Manager',
      assignedDate: '2024-01-05',
      lastModified: '2024-01-18',
      status: 'INACTIVE',
      description: 'Basic maintenance permissions'
    }
  ]);

  // Mock stats
  const [stats] = useState<UploadStats>({
    totalRoles: 15,
    activeRoles: 12,
    inactiveRoles: 3,
    totalUploads: 8,
    lastUpload: '2024-01-20'
  });

  // File validation with enhanced security checks
  const validateFile = useCallback((file: File): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const minSize = 1; // 1 byte minimum
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    // File type validation
    if (!allowedTypes.includes(file.type)) {
      errors.push('File type not supported. Please use CSV or Excel files.');
    }

    // File extension validation (additional security)
    const allowedExtensions = ['.csv', '.xls', '.xlsx'];
    const hasValidExtension = allowedExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    if (!hasValidExtension) {
      errors.push('File extension not allowed. Use .csv, .xls, or .xlsx files.');
    }

    // Size validation
    if (file.size > maxSize) {
      errors.push('File size too large. Maximum size is 10MB.');
    }
    if (file.size < minSize) {
      errors.push('File appears to be empty.');
    }

    // File name validation
    if (file.name.length > 100) {
      errors.push('File name too long. Maximum 100 characters.');
    }
    if (file.name.trim().length === 0) {
      errors.push('File name cannot be empty.');
    }

    // Security: Check for suspicious file names
    const suspiciousPatterns = [
      /\.(exe|bat|cmd|scr|com|pif)$/i,
      /\.(js|vbs|ps1|sh)$/i,
      /\.(php|asp|jsp|html|htm)$/i,
      /\.\./, // Path traversal
      /[<>:"|?*]/ // Invalid characters
    ];
    
    if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
      errors.push('File name contains invalid or suspicious characters.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // Handle file selection
  const handleFileSelect = useCallback((selectedFiles: FileList) => {
    const newFiles: FileInfo[] = [];
    let validCount = 0;
    let invalidCount = 0;
    
    Array.from(selectedFiles).forEach(file => {
      const validation = validateFile(file);
      newFiles.push({
        file,
        id: `${Date.now()}-${Math.random()}`,
        isValid: validation.isValid,
        errors: validation.errors
      });
      
      if (validation.isValid) {
        validCount++;
      } else {
        invalidCount++;
      }
    });

    setFiles(prev => [...prev, ...newFiles]);
    
    // Show notification
    if (validCount > 0 && invalidCount === 0) {
      toast.success(`${validCount} file(s) added successfully`);
    } else if (validCount > 0 && invalidCount > 0) {
      toast.warning(`${validCount} valid file(s) added, ${invalidCount} file(s) have errors`);
    } else if (invalidCount > 0) {
      toast.error(`${invalidCount} file(s) rejected due to validation errors`);
    }
  }, [validateFile]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  // File input click handler
  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  // Remove file
  const handleRemoveFile = (fileId: string) => {
    const fileToRemove = files.find(f => f.id === fileId);
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (fileToRemove) {
      toast.info(`File "${fileToRemove.file.name}" removed`);
    }
  };

  // Download sample files
  const handleDownloadSample = (format: 'csv' | 'excel') => {
    try {
      // Mock sample data for roles and permissions
      const sampleData = [
        ['Vendor ID', 'Vendor Name', 'Role', 'Permissions', 'Assigned By', 'Status', 'Description'],
        ['V001', 'ABC Cleaning Services', 'Service Provider', 'VIEW_SCHEDULE,UPDATE_STATUS,COMMUNICATE', 'Admin', 'ACTIVE', 'General cleaning service permissions'],
        ['V002', 'XYZ Security', 'Security Manager', 'VIEW_SCHEDULE,UPDATE_STATUS,COMMUNICATE,ACCESS_RESTRICTED,MANAGE_ALERTS', 'Admin', 'ACTIVE', 'Enhanced security permissions'],
        ['V003', 'Quick Repairs Co', 'Maintenance Tech', 'VIEW_SCHEDULE,UPDATE_STATUS', 'Manager', 'INACTIVE', 'Basic maintenance permissions']
      ];

      if (format === 'csv') {
        const csvContent = sampleData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'vendor_roles_permissions_template.csv';
        a.click();
        URL.revokeObjectURL(url);
        toast.success('CSV template downloaded successfully');
      } else {
        toast.info('Excel template download feature coming soon');
      }
    } catch (error) {
      toast.error('Failed to download template. Please try again.');
    }
  };

  // Start upload process
  const handleStartUpload = async () => {
    const validFiles = files.filter(f => f.isValid);
    if (validFiles.length === 0) {
      toast.error('No valid files to upload');
      return;
    }

    toast.info(`Starting upload of ${validFiles.length} file(s)...`);

    setUploadProgress({
      isUploading: true,
      progress: 0,
      currentFile: validFiles[0].file.name,
      status: 'uploading'
    });

    // Mock upload process
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        const mockResults: UploadResult[] = validFiles.map(fileInfo => ({
          id: fileInfo.id,
          fileName: fileInfo.file.name,
          status: Math.random() > 0.8 ? 'error' : 'success',
          uploadedAt: new Date().toISOString(),
          totalRows: Math.floor(Math.random() * 50) + 10,
          successRows: Math.floor(Math.random() * 45) + 5,
          errorRows: Math.floor(Math.random() * 3),
          errors: Math.random() > 0.7 ? ['Invalid permission format in row 3', 'Unknown vendor ID in row 7'] : [],
          warnings: Math.random() > 0.8 ? ['Duplicate role assignment in row 5'] : []
        }));

        const successCount = mockResults.filter(r => r.status === 'success').length;
        const errorCount = mockResults.filter(r => r.status === 'error').length;

        setUploadResults(mockResults);
        setUploadProgress(prev => ({ ...prev, status: 'completed', isUploading: false }));
        setFiles([]);

        // Admin notification
        if (errorCount === 0) {
          toast.success(`All ${successCount} file(s) uploaded successfully! Admin notified.`);
        } else if (successCount > 0) {
          toast.warning(`${successCount} file(s) uploaded successfully, ${errorCount} failed. Admin notified.`);
        } else {
          toast.error(`Upload failed for all ${errorCount} file(s). Admin notified.`);
        }
      } else {
        setUploadProgress(prev => ({ ...prev, progress }));
      }
    }, 200);
  };

  // Filter and search logic
  const filteredRoles = useMemo(() => {
    return vendorRoles.filter(role => {
      const matchesSearch = !searchTerm || 
        role.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        role.permissions.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = !selectedRole || role.role === selectedRole;
      const matchesStatus = !selectedStatus || role.status === selectedStatus;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [vendorRoles, searchTerm, selectedRole, selectedStatus]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Pagination logic
  const paginatedRoles = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const totalCount = filteredRoles.length;
    const totalPages = Math.ceil(totalCount / pagination.pageSize);
    
    setPagination(prev => ({ 
      ...prev, 
      totalCount, 
      totalPages: totalPages || 1
    }));
    
    return filteredRoles.slice(startIndex, endIndex);
  }, [filteredRoles, pagination.page, pagination.pageSize]);

  return (
    <PageContainer>
      <Header>
        <h1><FaUserShield /> Vendor Roles and Permissions</h1>
        <p>Manage vendor access roles and permissions with bulk upload capabilities and comprehensive tracking</p>
      </Header>

      {/* Statistics Dashboard */}
      <StatsGrid>
        <LayoutStatCard>
          <StatIcon color="#4CAF50">
            <FaUsers />
          </StatIcon>
          <StatValue>{stats.totalRoles}</StatValue>
          <StatLabel>Total Roles</StatLabel>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#4CAF50">
            <FaCheckCircle />
          </StatIcon>
          <StatValue>{stats.activeRoles}</StatValue>
          <StatLabel>Active Roles</StatLabel>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#f44336">
            <FaTimes />
          </StatIcon>
          <StatValue>{stats.inactiveRoles}</StatValue>
          <StatLabel>Inactive Roles</StatLabel>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#2196F3">
            <FaFileAlt />
          </StatIcon>
          <StatValue>{stats.totalUploads}</StatValue>
          <StatLabel>Total Uploads</StatLabel>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon color="#FF9800">
            <FaCalendarAlt />
          </StatIcon>
          <StatValue>{stats.lastUpload ? formatDate(stats.lastUpload) : 'Never'}</StatValue>
          <StatLabel>Last Upload</StatLabel>
        </LayoutStatCard>
      </StatsGrid>

      {/* Sample Download Section */}
      <UploadSection>
        <h2 style={{ marginBottom: '1.5rem', color: '#1a202c', fontWeight: 600 }}>
          <FaDownload style={{ marginRight: '0.5rem' }} />
          Download Sample Templates
        </h2>
        <SampleDownloadSection>
          <SampleCard>
            <div className="icon">
              <FaFileCsv />
            </div>
            <h3>CSV Template</h3>
            <p>Download a CSV template with sample roles and permissions data</p>
            <Button 
              onClick={() => handleDownloadSample('csv')} 
              variant="primary"
              aria-label="Download CSV template for vendor roles and permissions bulk upload"
            >
              <FaDownload aria-hidden="true" />
              Download CSV
            </Button>
          </SampleCard>
          <SampleCard>
            <div className="icon">
              <FaFileExcel />
            </div>
            <h3>Excel Template</h3>
            <p>Download an Excel template with formatted columns and validation rules</p>
            <Button 
              onClick={() => handleDownloadSample('excel')} 
              variant="primary"
              aria-label="Download Excel template for vendor roles and permissions bulk upload"
            >
              <FaDownload aria-hidden="true" />
              Download Excel
            </Button>
          </SampleCard>
        </SampleDownloadSection>
      </UploadSection>

      {/* Upload Section */}
      <UploadSection>
        <h2 style={{ marginBottom: '1.5rem', color: '#1a202c', fontWeight: 600 }}>
          <FaCloudUploadAlt style={{ marginRight: '0.5rem' }} />
          Upload Roles and Permissions Files
        </h2>
        
        <DropZone
          isDragActive={isDragActive}
          hasFiles={files.length > 0}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleFileInputClick}
          role="button"
          tabIndex={0}
          aria-label="Upload vendor roles and permissions files by dragging and dropping or clicking to browse"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleFileInputClick();
            }
          }}
        >
          <div className="upload-icon" aria-hidden="true">
            <FaCloudUploadAlt />
          </div>
          <h3>{isDragActive ? 'Drop files here' : 'Drag & drop files or click to browse'}</h3>
          <p>Upload your vendor roles and permissions data files for bulk processing</p>
          <Button variant="primary" aria-describedby="file-format-info">
            <FaUpload />
            Choose Files
          </Button>
          <div className="supported-formats" id="file-format-info">
            Supported formats: CSV, Excel (.xlsx, .xls) • Max size: 10MB per file
          </div>
        </DropZone>

        <HiddenFileInput
          ref={fileInputRef}
          type="file"
          multiple
          accept=".csv,.xlsx,.xls"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          aria-label="Select vendor roles and permissions files for bulk upload"
        />

        {files.length > 0 && (
          <FileList>
            <h3 style={{ marginBottom: '1rem', color: '#1a202c' }}>Selected Files ({files.length})</h3>
            {files.map(fileInfo => (
              <FileItem key={fileInfo.id} isValid={fileInfo.isValid}>
                <div className="file-info">
                  <div className="file-icon">
                    {fileInfo.file.type.includes('csv') ? <FaFileCsv /> : <FaFileExcel />}
                  </div>
                  <div className="file-details">
                    <div className="file-name">{fileInfo.file.name}</div>
                    <div className="file-size">
                      {(fileInfo.file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                    {fileInfo.errors.length > 0 && (
                      <div className="file-errors">
                        {fileInfo.errors.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
                <div className="file-actions">
                  <Button
                    variant="danger"
                    onClick={() => handleRemoveFile(fileInfo.id)}
                    style={{ padding: '0.5rem', minWidth: 'auto' }}
                    aria-label={`Remove file ${fileInfo.file.name}`}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </FileItem>
            ))}
            
            {files.some(f => f.isValid) && (
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <Button
                  onClick={handleStartUpload}
                  variant="primary"
                  disabled={uploadProgress.isUploading}
                  aria-label={`Upload ${files.filter(f => f.isValid).length} valid file(s)`}
                >
                  <FaUpload />
                  Upload {files.filter(f => f.isValid).length} File(s)
                </Button>
              </div>
            )}
          </FileList>
        )}
      </UploadSection>

      {/* Progress Section */}
      <ProgressSection show={uploadProgress.isUploading || uploadProgress.status === 'completed'}>
        <ProgressCard>
          {uploadProgress.isUploading && (
            <>
              <div className="progress-icon">
                <FaSpinner />
              </div>
              <h3>Uploading Files...</h3>
              <p>Processing: {uploadProgress.currentFile}</p>
              <ProgressBar>
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress.progress}%` }}
                />
              </ProgressBar>
              <p>{Math.round(uploadProgress.progress)}% Complete</p>
            </>
          )}
          
          {uploadProgress.status === 'completed' && (
            <>
              <div style={{ fontSize: '3rem', color: '#4CAF50', marginBottom: '1rem' }}>
                <FaCheckCircle />
              </div>
              <h3>Upload Completed!</h3>
              <p>All files have been processed. Admin has been notified. Check the results below.</p>
            </>
          )}
        </ProgressCard>
      </ProgressSection>

      {/* Results Section */}
      {uploadResults.length > 0 && (
        <ResultsSection>
          <ContentCard>
            <h2 style={{ marginBottom: '1.5rem', color: '#1a202c', fontWeight: 600 }}>
              <FaChartBar style={{ marginRight: '0.5rem' }} />
              Upload Results
            </h2>
            
            <ResultsGrid>
              {uploadResults.map(result => (
                <ResultCard key={result.id} status={result.status}>
                  <div className="result-header">
                    <div className="result-info">
                      <div className="result-icon">
                        {result.status === 'success' && <FaCheckCircle />}
                        {result.status === 'error' && <FaTimes />}
                        {result.status === 'warning' && <FaExclamationTriangle />}
                      </div>
                      <div className="result-details">
                        <div className="file-name">{result.fileName}</div>
                        <div className="upload-time">
                          {new Date(result.uploadedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="result-actions">
                      <Button variant="secondary" style={{ padding: '0.5rem', minWidth: 'auto' }}>
                        <FaEye />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="result-stats">
                    <div className="stat">
                      <div className="stat-value">{result.totalRows}</div>
                      <div className="stat-label">Total</div>
                    </div>
                    <div className="stat">
                      <div className="stat-value">{result.successRows}</div>
                      <div className="stat-label">Success</div>
                    </div>
                    <div className="stat">
                      <div className="stat-value">{result.errorRows}</div>
                      <div className="stat-label">Errors</div>
                    </div>
                  </div>
                  
                  {(result.errors.length > 0 || result.warnings.length > 0) && (
                    <div className="result-messages">
                      {result.errors.length > 0 && (
                        <ul className="error-list">
                          {result.errors.map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                        </ul>
                      )}
                      {result.warnings.length > 0 && (
                        <ul className="warning-list">
                          {result.warnings.map((warning, index) => (
                            <li key={index}>• {warning}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </ResultCard>
              ))}
            </ResultsGrid>
          </ContentCard>
        </ResultsSection>
      )}

      {/* Roles and Permissions Table */}
      <ContentCard>
        <h2 style={{ marginBottom: '1.5rem', color: '#1a202c', fontWeight: 600 }}>
          <FaKey style={{ marginRight: '0.5rem' }} />
          Current Vendor Roles and Permissions
        </h2>

        {/* Search and Filter Controls */}
        <FiltersCard>
          <SearchFilterRow>
            <SearchInputContainer>
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by vendor name, role, or permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search vendor roles and permissions"
              />
            </SearchInputContainer>
            
            <FilterToggleButton 
              active={showFilters}
              onClick={() => setShowFilters(!showFilters)}
              aria-expanded={showFilters}
              aria-controls="filters-section"
            >
              <FaFilter />
              Filters
            </FilterToggleButton>
          </SearchFilterRow>
          
          {/* Filter Options */}
          <FiltersSection show={showFilters} id="filters-section">
            <FilterGroup>
              <FilterLabel>Role Type</FilterLabel>
              <FilterButtons>
                <FilterButton 
                  active={!selectedRole}
                  onClick={() => setSelectedRole('')}
                >
                  All Roles
                </FilterButton>
                <FilterButton 
                  active={selectedRole === 'Service Provider'}
                  onClick={() => setSelectedRole('Service Provider')}
                >
                  <FaUserCog /> Service Provider
                </FilterButton>
                <FilterButton 
                  active={selectedRole === 'Security Manager'}
                  onClick={() => setSelectedRole('Security Manager')}
                >
                  <FaShieldAlt /> Security Manager
                </FilterButton>
                <FilterButton 
                  active={selectedRole === 'Maintenance Tech'}
                  onClick={() => setSelectedRole('Maintenance Tech')}
                >
                  <FaCog /> Maintenance Tech
                </FilterButton>
              </FilterButtons>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Status</FilterLabel>
              <FilterButtons>
                <FilterButton 
                  active={!selectedStatus}
                  onClick={() => setSelectedStatus('')}
                >
                  All Status
                </FilterButton>
                <FilterButton 
                  active={selectedStatus === 'ACTIVE'}
                  onClick={() => setSelectedStatus('ACTIVE')}
                >
                  <FaCheckCircle /> Active
                </FilterButton>
                <FilterButton 
                  active={selectedStatus === 'INACTIVE'}
                  onClick={() => setSelectedStatus('INACTIVE')}
                >
                  <FaTimes /> Inactive
                </FilterButton>
                <FilterButton 
                  active={selectedStatus === 'SUSPENDED'}
                  onClick={() => setSelectedStatus('SUSPENDED')}
                >
                  <FaExclamationTriangle /> Suspended
                </FilterButton>
              </FilterButtons>
            </FilterGroup>
          </FiltersSection>
        </FiltersCard>

        {/* Table */}
        <TableWrapper>
          <ScrollableTableContainer>
            <EnhancedTable role="table" aria-label="Vendor roles and permissions table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Role</th>
                  <th>Permissions</th>
                  <th>Assigned By</th>
                  <th>Status</th>
                  <th>Assigned Date</th>
                  <th>Last Modified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRoles.map(role => (
                  <tr key={role.id}>
                    <td>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                          {role.vendorName}
                        </div>
                        <div style={{ fontSize: '0.85rem', opacity: '0.7' }}>
                          ID: {role.vendorId}
                        </div>
                      </div>
                    </td>
                    <td>
                      <RoleBadge>{role.role}</RoleBadge>
                    </td>
                    <td>
                      <PermissionsList>
                        {role.permissions.map((permission, index) => (
                          <PermissionBadge key={index} title={permission}>
                            {permission.replace('_', ' ')}
                          </PermissionBadge>
                        ))}
                      </PermissionsList>
                    </td>
                    <td>{role.assignedBy}</td>
                    <td>
                      <StatusBadge status={role.status}>{role.status}</StatusBadge>
                    </td>
                    <td>{formatDate(role.assignedDate)}</td>
                    <td>{formatDate(role.lastModified)}</td>
                    <ActionCell>
                      <div className="actions">
                        <button
                          className="action-btn view"
                          onClick={() => console.log('View role details:', role)}
                          title="View Role Details"
                          aria-label={`View details for ${role.vendorName} role`}
                        >
                          <FaEye />
                        </button>
                      </div>
                    </ActionCell>
                  </tr>
                ))}
              </tbody>
            </EnhancedTable>
          </ScrollableTableContainer>
        </TableWrapper>

        {/* Pagination */}
        <PaginationContainer>
          <PaginationInfo>
            Showing {((pagination.page - 1) * pagination.pageSize) + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)} of {pagination.totalCount} roles
          </PaginationInfo>
          
          <PaginationControls>
            <PageButton
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              aria-label="Previous page"
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
                  aria-label={`Page ${page}`}
                  aria-current={page === pagination.page ? 'page' : undefined}
                >
                  {page}
                </PageButton>
              );
            })}
            
            <PageButton
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              aria-label="Next page"
            >
              <FaChevronRight />
            </PageButton>
          </PaginationControls>
        </PaginationContainer>
      </ContentCard>
    </PageContainer>
  );
};

export default VendorRolesPermissionsPage;