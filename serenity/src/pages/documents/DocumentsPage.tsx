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
  FiEye,
  FiShare2,
  FiFile,
  FiFileText,
  FiFilePlus,
  FiFolder,
  FiCalendar,
  FiUser,
  FiTag,
  FiClock,
  FiBarChart2,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiLock,
  FiUnlock,
  FiArchive,
  FiRefreshCw,
  FiCopy,
  FiStar
} from 'react-icons/fi';
import {
  Document,
  DocumentType,
  DocumentCategory,
  DocumentStatus,
  DocumentAccessLevel,
  DocumentStats,
  DocumentVersion,
  DocumentTag,
  CreateDocumentData,
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_CATEGORY_LABELS,
  DOCUMENT_STATUS_LABELS,
  DOCUMENT_ACCESS_LEVEL_LABELS,
  formatFileSize,
  getFileExtension,
  isImageFile,
  isPdfFile,
  isOfficeFile
} from '../../types/documents';
import UploadDocumentForm from './UploadDocumentForm';

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
  justify-content: space-between;
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
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

const DocumentsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const DocumentCard = styled.div`
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

const DocumentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const DocumentTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FileIcon = styled.div<{ fileType: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 16px;

  ${({ fileType, theme }) => {
    if (fileType === 'pdf') {
      return `background: ${theme.colors.error[100]}; color: ${theme.colors.error[600]};`;
    } else if (fileType === 'doc' || fileType === 'docx') {
      return `background: ${theme.colors.info[100]}; color: ${theme.colors.info[600]};`;
    } else if (fileType === 'xls' || fileType === 'xlsx') {
      return `background: ${theme.colors.success[100]}; color: ${theme.colors.success[600]};`;
    } else if (fileType === 'ppt' || fileType === 'pptx') {
      return `background: ${theme.colors.warning[100]}; color: ${theme.colors.warning[600]};`;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(fileType)) {
      return `background: ${theme.colors.secondary[100]}; color: ${theme.colors.secondary[600]};`;
    } else {
      return `background: ${theme.colors.gray[100]}; color: ${theme.colors.gray[600]};`;
    }
  }}
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

const DocumentContent = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const DocumentRow = styled.div`
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
      case 'draft':
        return `background: ${theme.colors.gray[100]}; color: ${theme.colors.gray[800]};`;
      case 'under-review':
        return `background: ${theme.colors.warning[100]}; color: ${theme.colors.warning[800]};`;
      case 'approved':
        return `background: ${theme.colors.info[100]}; color: ${theme.colors.info[800]};`;
      case 'published':
        return `background: ${theme.colors.success[100]}; color: ${theme.colors.success[800]};`;
      case 'archived':
        return `background: ${theme.colors.secondary[100]}; color: ${theme.colors.secondary[800]};`;
      case 'expired':
      case 'rejected':
        return `background: ${theme.colors.error[100]}; color: ${theme.colors.error[800]};`;
      case 'public':
        return `background: ${theme.colors.success[100]}; color: ${theme.colors.success[800]};`;
      case 'members-only':
        return `background: ${theme.colors.info[100]}; color: ${theme.colors.info[800]};`;
      case 'committee-only':
        return `background: ${theme.colors.warning[100]}; color: ${theme.colors.warning[800]};`;
      case 'admin-only':
      case 'restricted':
        return `background: ${theme.colors.error[100]}; color: ${theme.colors.error[800]};`;
      default:
        return `background: ${theme.colors.gray[100]}; color: ${theme.colors.gray[800]};`;
    }
  }}
`;

const DocumentDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0;
  line-height: 1.5;
`;

const TagsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[800]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
`;

const VersionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const QuickActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const QuickActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray[100]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[200]};
  }

  &.primary {
    background: ${({ theme }) => theme.colors.primary[100]};
    color: ${({ theme }) => theme.colors.primary[700]};

    &:hover {
      background: ${({ theme }) => theme.colors.primary[200]};
    }
  }
`;

// Mock Data
const mockTags: DocumentTag[] = [
  { id: '1', name: 'Important', color: '#ef4444' },
  { id: '2', name: 'Policy', color: '#3b82f6' },
  { id: '3', name: 'Annual', color: '#10b981' },
  { id: '4', name: 'Legal', color: '#f59e0b' },
  { id: '5', name: 'Financial', color: '#8b5cf6' },
  { id: '6', name: 'Emergency', color: '#ef4444' }
];

const mockDocuments: Document[] = [
  {
    id: 'DOC-001',
    title: 'Society Bylaws 2025',
    description: 'Complete set of bylaws governing the society operations, resident rights, and committee responsibilities.',
    type: DocumentType.BYLAWS,
    category: DocumentCategory.GOVERNANCE,
    status: DocumentStatus.PUBLISHED,
    accessLevel: DocumentAccessLevel.MEMBERS_ONLY,
    versions: [],
    currentVersion: {
      id: 'v1',
      versionNumber: '2.1',
      fileName: 'society-bylaws-2025.pdf',
      fileSize: 2547832,
      uploadedAt: new Date('2025-01-15T10:00:00'),
      uploadedBy: {
        id: '1',
        name: 'Legal Committee',
        role: 'Committee'
      },
      changeLog: 'Updated pet policy and noise regulations',
      isActive: true
    },
    createdBy: {
      id: '1',
      name: 'Legal Committee',
      role: 'Committee'
    },
    approvals: [],
    permissions: [],
    tags: [mockTags[1], mockTags[3]],
    comments: [],
    activities: [],
    createdAt: new Date('2025-01-10T08:00:00'),
    updatedAt: new Date('2025-01-15T10:00:00'),
    publishedAt: new Date('2025-01-15T10:00:00'),
    downloadCount: 156,
    viewCount: 324,
    isTemplate: false,
    relatedDocuments: [],
    metadata: {},
    isEncrypted: false
  },
  {
    id: 'DOC-002',
    title: 'Annual Financial Report 2024',
    description: 'Comprehensive financial report including income statements, balance sheet, and audit findings for the fiscal year 2024.',
    type: DocumentType.FINANCIAL,
    category: DocumentCategory.FINANCIAL,
    status: DocumentStatus.PUBLISHED,
    accessLevel: DocumentAccessLevel.MEMBERS_ONLY,
    versions: [],
    currentVersion: {
      id: 'v1',
      versionNumber: '1.0',
      fileName: 'annual-financial-report-2024.pdf',
      fileSize: 4235776,
      uploadedAt: new Date('2025-02-01T14:30:00'),
      uploadedBy: {
        id: '2',
        name: 'Finance Manager',
        role: 'Admin'
      },
      isActive: true
    },
    createdBy: {
      id: '2',
      name: 'Finance Manager',
      role: 'Admin'
    },
    approvals: [],
    permissions: [],
    tags: [mockTags[4], mockTags[2]],
    comments: [],
    activities: [],
    createdAt: new Date('2025-01-25T09:00:00'),
    updatedAt: new Date('2025-02-01T14:30:00'),
    publishedAt: new Date('2025-02-01T14:30:00'),
    downloadCount: 89,
    viewCount: 167,
    isTemplate: false,
    relatedDocuments: [],
    metadata: {},
    isEncrypted: true
  },
  {
    id: 'DOC-003',
    title: 'Emergency Evacuation Procedures',
    description: 'Detailed emergency evacuation procedures for fire, earthquake, and other emergency situations.',
    type: DocumentType.PROCEDURE,
    category: DocumentCategory.EMERGENCY,
    status: DocumentStatus.PUBLISHED,
    accessLevel: DocumentAccessLevel.PUBLIC,
    versions: [],
    currentVersion: {
      id: 'v1',
      versionNumber: '3.2',
      fileName: 'emergency-evacuation-procedures.pdf',
      fileSize: 1876543,
      uploadedAt: new Date('2025-03-10T11:15:00'),
      uploadedBy: {
        id: '3',
        name: 'Safety Officer',
        role: 'Staff'
      },
      changeLog: 'Updated assembly points and contact information',
      isActive: true
    },
    createdBy: {
      id: '3',
      name: 'Safety Officer',
      role: 'Staff'
    },
    approvals: [],
    permissions: [],
    tags: [mockTags[5], mockTags[0]],
    comments: [],
    activities: [],
    createdAt: new Date('2025-03-01T10:00:00'),
    updatedAt: new Date('2025-03-10T11:15:00'),
    publishedAt: new Date('2025-03-10T11:15:00'),
    downloadCount: 234,
    viewCount: 456,
    isTemplate: false,
    relatedDocuments: [],
    metadata: {},
    isEncrypted: false
  },
  {
    id: 'DOC-004',
    title: 'Maintenance Request Form Template',
    description: 'Standard template for residents to submit maintenance requests with all required information.',
    type: DocumentType.FORM,
    category: DocumentCategory.MAINTENANCE,
    status: DocumentStatus.PUBLISHED,
    accessLevel: DocumentAccessLevel.MEMBERS_ONLY,
    versions: [],
    currentVersion: {
      id: 'v1',
      versionNumber: '1.5',
      fileName: 'maintenance-request-form.docx',
      fileSize: 145689,
      uploadedAt: new Date('2025-04-05T09:20:00'),
      uploadedBy: {
        id: '4',
        name: 'Maintenance Manager',
        role: 'Staff'
      },
      changeLog: 'Added priority level field and contact preferences',
      isActive: true
    },
    createdBy: {
      id: '4',
      name: 'Maintenance Manager',
      role: 'Staff'
    },
    approvals: [],
    permissions: [],
    tags: [mockTags[1]],
    comments: [],
    activities: [],
    createdAt: new Date('2025-03-20T14:00:00'),
    updatedAt: new Date('2025-04-05T09:20:00'),
    publishedAt: new Date('2025-04-05T09:20:00'),
    downloadCount: 67,
    viewCount: 123,
    isTemplate: true,
    templateData: {
      fields: [
        { name: 'requestType', type: 'dropdown', required: true, options: ['Plumbing', 'Electrical', 'HVAC', 'General'] },
        { name: 'description', type: 'text', required: true },
        { name: 'priority', type: 'dropdown', required: true, options: ['Low', 'Medium', 'High', 'Urgent'] },
        { name: 'contactMethod', type: 'dropdown', required: false, options: ['Email', 'Phone', 'SMS'] }
      ]
    },
    relatedDocuments: [],
    metadata: {},
    isEncrypted: false
  },
  {
    id: 'DOC-005',
    title: 'Insurance Policy Certificate',
    description: 'Current insurance policy certificate covering building structure, liability, and common areas.',
    type: DocumentType.CERTIFICATE,
    category: DocumentCategory.INSURANCE,
    status: DocumentStatus.PUBLISHED,
    accessLevel: DocumentAccessLevel.COMMITTEE_ONLY,
    versions: [],
    currentVersion: {
      id: 'v1',
      versionNumber: '1.0',
      fileName: 'insurance-policy-certificate-2025.pdf',
      fileSize: 987234,
      uploadedAt: new Date('2025-01-01T00:00:00'),
      uploadedBy: {
        id: '5',
        name: 'Insurance Agent',
        role: 'External'
      },
      isActive: true
    },
    createdBy: {
      id: '1',
      name: 'Management Committee',
      role: 'Committee'
    },
    approvals: [],
    permissions: [],
    tags: [mockTags[0], mockTags[2]],
    comments: [],
    activities: [],
    createdAt: new Date('2025-01-01T00:00:00'),
    updatedAt: new Date('2025-01-01T00:00:00'),
    publishedAt: new Date('2025-01-01T00:00:00'),
    expiresAt: new Date('2025-12-31T23:59:59'),
    downloadCount: 12,
    viewCount: 28,
    isTemplate: false,
    relatedDocuments: [],
    metadata: { policyNumber: 'INS-2025-00123', insuranceCompany: 'ABC Insurance Ltd' },
    isEncrypted: true
  },
  {
    id: 'DOC-006',
    title: 'Committee Meeting Minutes - September 2025',
    description: 'Minutes from the monthly management committee meeting discussing budget approvals and upcoming projects.',
    type: DocumentType.MEETING_MINUTES,
    category: DocumentCategory.GOVERNANCE,
    status: DocumentStatus.UNDER_REVIEW,
    accessLevel: DocumentAccessLevel.COMMITTEE_ONLY,
    versions: [],
    currentVersion: {
      id: 'v1',
      versionNumber: '1.0',
      fileName: 'committee-meeting-minutes-sep-2025.docx',
      fileSize: 234567,
      uploadedAt: new Date('2025-09-20T16:45:00'),
      uploadedBy: {
        id: '6',
        name: 'Committee Secretary',
        role: 'Committee'
      },
      isActive: true
    },
    createdBy: {
      id: '6',
      name: 'Committee Secretary',
      role: 'Committee'
    },
    approvals: [
      {
        id: 'app1',
        approver: {
          id: '7',
          name: 'Committee Chairperson',
          role: 'Committee'
        },
        status: 'pending',
        level: 1
      }
    ],
    permissions: [],
    tags: [mockTags[1]],
    comments: [],
    activities: [],
    createdAt: new Date('2025-09-20T16:45:00'),
    updatedAt: new Date('2025-09-20T16:45:00'),
    downloadCount: 0,
    viewCount: 5,
    isTemplate: false,
    relatedDocuments: [],
    metadata: { meetingDate: '2025-09-15', attendees: 8 },
    isEncrypted: false
  }
];

const DocumentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [accessLevelFilter, setAccessLevelFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);

  const filteredDocuments = useMemo(() => {
    let filtered = [...mockDocuments];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.currentVersion.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(doc => doc.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.type === typeFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(doc => doc.category === categoryFilter);
    }

    // Apply access level filter
    if (accessLevelFilter !== 'all') {
      filtered = filtered.filter(doc => doc.accessLevel === accessLevelFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Document];
      let bValue: any = b[sortBy as keyof Document];

      if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'publishedAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortBy === 'fileSize') {
        aValue = a.currentVersion.fileSize;
        bValue = b.currentVersion.fileSize;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [mockDocuments, searchQuery, statusFilter, typeFilter, categoryFilter, accessLevelFilter, sortBy, sortOrder]);

  const stats: DocumentStats = useMemo(() => {
    const total = mockDocuments.length;
    const published = mockDocuments.filter(d => d.status === DocumentStatus.PUBLISHED).length;
    const draft = mockDocuments.filter(d => d.status === DocumentStatus.DRAFT).length;
    const underReview = mockDocuments.filter(d => d.status === DocumentStatus.UNDER_REVIEW).length;
    const archived = mockDocuments.filter(d => d.status === DocumentStatus.ARCHIVED).length;
    const totalSize = mockDocuments.reduce((sum, d) => sum + d.currentVersion.fileSize, 0);
    const totalDownloads = mockDocuments.reduce((sum, d) => sum + d.downloadCount, 0);
    const totalViews = mockDocuments.reduce((sum, d) => sum + d.viewCount, 0);
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUploads = mockDocuments.filter(d => new Date(d.createdAt) > thirtyDaysAgo).length;

    return {
      total,
      published,
      draft,
      underReview,
      archived,
      totalSize,
      totalDownloads,
      totalViews,
      recentUploads
    };
  }, []);

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case DocumentStatus.PUBLISHED:
        return <FiCheckCircle />;
      case DocumentStatus.UNDER_REVIEW:
        return <FiClock />;
      case DocumentStatus.DRAFT:
        return <FiEdit />;
      case DocumentStatus.ARCHIVED:
        return <FiArchive />;
      case DocumentStatus.EXPIRED:
      case DocumentStatus.REJECTED:
        return <FiXCircle />;
      default:
        return <FiFile />;
    }
  };

  const getAccessIcon = (accessLevel: DocumentAccessLevel) => {
    switch (accessLevel) {
      case DocumentAccessLevel.PUBLIC:
        return <FiUnlock />;
      case DocumentAccessLevel.RESTRICTED:
      case DocumentAccessLevel.ADMIN_ONLY:
        return <FiLock />;
      default:
        return <FiEye />;
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = getFileExtension(fileName);
    
    if (isPdfFile(fileName)) return <FiFileText />;
    if (isOfficeFile(fileName)) return <FiFile />;
    if (isImageFile(fileName)) return <FiFolder />;
    return <FiFile />;
  };

  const handleDocumentUpload = async (data: CreateDocumentData) => {
    try {
      // Mock API call - in real implementation, this would call your API
      console.log('Uploading document:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would:
      // 1. Upload the file to your storage service
      // 2. Create the document record in your database
      // 3. Refresh the documents list or add the new document to state
      // 4. Show success message
      
      alert('Document uploaded successfully!');
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Error uploading document. Please try again.');
    }
  };

  return (
    <PageContainer>
      <Header>
        <Title>Documents</Title>
        <ActionButtons>
          <Button className="secondary">
            <FiDownload size={16} />
            Export
          </Button>
          <Button className="primary" onClick={() => setIsUploadFormOpen(true)}>
            <FiPlus size={16} />
            Upload Document
          </Button>
        </ActionButtons>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total Documents</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.published}</StatValue>
          <StatLabel>Published</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.underReview}</StatValue>
          <StatLabel>Under Review</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{formatFileSize(stats.totalSize)}</StatValue>
          <StatLabel>Total Size</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.totalDownloads.toLocaleString()}</StatValue>
          <StatLabel>Total Downloads</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue>{stats.recentUploads}</StatValue>
          <StatLabel>Recent Uploads</StatLabel>
        </StatCard>
      </StatsGrid>

      <FilterSection>
        <FilterRow>
          <SearchInput>
            <FiSearch size={16} />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchInput>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            {Object.entries(DOCUMENT_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
          <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {Object.entries(DOCUMENT_CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
          <Select value={accessLevelFilter} onChange={(e) => setAccessLevelFilter(e.target.value)}>
            <option value="all">All Access Levels</option>
            {Object.entries(DOCUMENT_ACCESS_LEVEL_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </Select>
          <Select value={`${sortBy}-${sortOrder}`} onChange={(e) => {
            const [field, order] = e.target.value.split('-');
            setSortBy(field);
            setSortOrder(order as 'asc' | 'desc');
          }}>
            <option value="updatedAt-desc">Recently Updated</option>
            <option value="createdAt-desc">Recently Created</option>
            <option value="title-asc">Title A-Z</option>
            <option value="downloadCount-desc">Most Downloaded</option>
            <option value="viewCount-desc">Most Viewed</option>
          </Select>
        </FilterRow>
      </FilterSection>

      <DocumentsGrid>
        {filteredDocuments.map((document) => (
          <DocumentCard key={document.id}>
            <DocumentHeader>
              <DocumentTitle>
                <FileIcon fileType={getFileExtension(document.currentVersion.fileName)}>
                  {getFileIcon(document.currentVersion.fileName)}
                </FileIcon>
                {document.title}
              </DocumentTitle>
              <ActionMenu>
                <button>
                  <FiMoreVertical size={16} />
                </button>
              </ActionMenu>
            </DocumentHeader>

            <DocumentContent>
              <DocumentDescription>{document.description}</DocumentDescription>
              
              <DocumentRow>
                <InfoItem>
                  <FiFolder />
                  {DOCUMENT_TYPE_LABELS[document.type]}
                </InfoItem>
                <InfoItem>
                  <FiTag />
                  {DOCUMENT_CATEGORY_LABELS[document.category]}
                </InfoItem>
                <InfoItem>
                  <FiUser />
                  {document.createdBy.name}
                </InfoItem>
                <InfoItem>
                  <FiCalendar />
                  {new Date(document.updatedAt).toLocaleDateString()}
                </InfoItem>
                <InfoItem>
                  <FiFile />
                  {formatFileSize(document.currentVersion.fileSize)}
                </InfoItem>
              </DocumentRow>

              <DocumentRow>
                <Badge variant={document.status}>
                  {getStatusIcon(document.status)}
                  {DOCUMENT_STATUS_LABELS[document.status]}
                </Badge>
                <Badge variant={document.accessLevel}>
                  {getAccessIcon(document.accessLevel)}
                  {DOCUMENT_ACCESS_LEVEL_LABELS[document.accessLevel]}
                </Badge>
                {document.isTemplate && (
                  <Badge variant="template">
                    <FiCopy />
                    Template
                  </Badge>
                )}
                {document.isEncrypted && (
                  <Badge variant="encrypted">
                    <FiLock />
                    Encrypted
                  </Badge>
                )}
              </DocumentRow>

              {document.tags.length > 0 && (
                <TagsList>
                  {document.tags.map((tag) => (
                    <Tag key={tag.id}>
                      <FiTag size={12} />
                      {tag.name}
                    </Tag>
                  ))}
                </TagsList>
              )}

              <VersionInfo>
                <InfoItem>
                  <FiRefreshCw />
                  Version {document.currentVersion.versionNumber}
                </InfoItem>
                <InfoItem>
                  <FiDownload />
                  {document.downloadCount} downloads
                </InfoItem>
                <InfoItem>
                  <FiEye />
                  {document.viewCount} views
                </InfoItem>
                {document.expiresAt && (
                  <InfoItem>
                    <FiClock />
                    Expires {new Date(document.expiresAt).toLocaleDateString()}
                  </InfoItem>
                )}
              </VersionInfo>

              <QuickActions>
                <QuickActionButton className="primary">
                  <FiEye size={14} />
                  View
                </QuickActionButton>
                <QuickActionButton>
                  <FiDownload size={14} />
                  Download
                </QuickActionButton>
                <QuickActionButton>
                  <FiShare2 size={14} />
                  Share
                </QuickActionButton>
                {document.isTemplate && (
                  <QuickActionButton>
                    <FiCopy size={14} />
                    Use Template
                  </QuickActionButton>
                )}
              </QuickActions>
            </DocumentContent>
          </DocumentCard>
        ))}
      </DocumentsGrid>

      <UploadDocumentForm
        isOpen={isUploadFormOpen}
        onClose={() => setIsUploadFormOpen(false)}
        onSubmit={handleDocumentUpload}
      />
    </PageContainer>
  );
};

export default DocumentsPage;