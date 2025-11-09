import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import {
  FiFileText,
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiDownload,
  FiEye,
  FiUpload,
  FiCheck,
  FiX,
  FiAlertTriangle,
  FiClock,
  FiUser,
  FiCalendar,
  FiFilter,
  FiGrid,
  FiList,
  FiFolder,
  FiFile,
  FiImage,
  FiArchive,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw
} from 'react-icons/fi';
import VendorDocumentsModal from './VendorDocumentsModal';
import { toast } from 'react-toastify';

// Document Management Interface
interface VendorDocument {
  id: number;
  vendorId: number;
  vendorName: string;
  documentName: string;
  documentType: 'license' | 'certificate' | 'insurance' | 'registration' | 'contract' | 'identification' | 'other';
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: Date;
  uploadedBy: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedDate?: Date;
  expiryDate?: Date | string;
  isRequired: boolean;
  description: string;
  rejectionReason?: string;
  version: number;
  downloadCount: number;
  lastAccessed?: Date;
  tags: string[];
  category: string;
  isActive: boolean;
  fileUrl: string;
}

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
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
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' | 'success' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid;
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
      case 'success':
        return `
          background: ${theme.colors.success[600]};
          color: ${theme.colors.white};
          border-color: ${theme.colors.success[600]};
          
          &:hover {
            background: ${theme.colors.success[700]};
            border-color: ${theme.colors.success[700]};
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

const FilterSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const SearchContainer = styled.div`
  position: relative;
  min-width: 300px;
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: ${({ theme }) => theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray[400]};
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  padding-left: ${({ theme }) => theme.spacing[10]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.all};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const StatsGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const StatValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ViewToggle = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
`;

const ViewButton = styled.button<{ isActive: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: none;
  background: ${({ isActive, theme }) => 
    isActive ? theme.colors.primary[600] : theme.colors.white};
  color: ${({ isActive, theme }) => 
    isActive ? theme.colors.white : theme.colors.gray[600]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};

  &:hover {
    background: ${({ isActive, theme }) => 
      isActive ? theme.colors.primary[700] : theme.colors.gray[100]};
  }
`;

const DocumentsContainer = styled.div<{ viewMode: 'grid' | 'list' }>`
  ${({ viewMode, theme }) => 
    viewMode === 'grid' 
      ? `
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: ${theme.spacing[4]};
      `
      : `
        display: flex;
        flex-direction: column;
        gap: ${theme.spacing[3]};
      `
  }
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DocumentCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => theme.spacing[4]};
  transition: ${({ theme }) => theme.transition.all};
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.boxShadow.lg};
    border-color: ${({ theme }) => theme.colors.primary[300]};
  }
`;

const DocumentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const DocumentInfo = styled.div`
  flex: 1;
`;

const DocumentTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing[1]} 0;
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const VendorName = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const DocumentMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const Badge = styled.span<{ variant?: 'type' | 'status' | 'required' | 'expired' }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;

  ${({ variant = 'type', theme }) => {
    switch (variant) {
      case 'status':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
        `;
      case 'required':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
        `;
      case 'expired':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[700]};
        `;
      default:
        return `
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[700]};
        `;
    }
  }}
`;

const DocumentDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const DocumentDetails = styled.div`
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[1]};

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const DetailValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const DocumentActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' | 'success' }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};

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
      case 'success':
        return `
          background: ${theme.colors.success[600]};
          color: ${theme.colors.white};
          border-color: ${theme.colors.success[600]};
          
          &:hover {
            background: ${theme.colors.success[700]};
            border-color: ${theme.colors.success[700]};
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

const StatusIndicator = styled.div<{ status: string }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  right: ${({ theme }) => theme.spacing[3]};
  width: 12px;
  height: 12px;
  border-radius: 50%;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'verified':
        return `background: ${theme.colors.success[500]};`;
      case 'pending':
        return `background: ${theme.colors.warning[500]};`;
      case 'rejected':
        return `background: ${theme.colors.error[500]};`;
      default:
        return `background: ${theme.colors.gray[400]};`;
    }
  }}
`;

const ExpiryWarning = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.warning[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[500]};
  
  svg {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.gray[400]};
  }
  
  h3 {
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const VendorDocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<VendorDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<VendorDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('uploadDate');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocument, setSelectedDocument] = useState<VendorDocument | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for vendor documents
  const mockDocuments: VendorDocument[] = [
    {
      id: 1,
      vendorId: 1,
      vendorName: 'QuickFix Plumbers',
      documentName: 'Business License',
      documentType: 'license',
      fileName: 'business-license-2024.pdf',
      fileSize: 2456789,
      fileType: 'application/pdf',
      uploadDate: new Date('2024-01-15'),
      uploadedBy: 'Admin User',
      verificationStatus: 'verified',
      verifiedBy: 'John Smith',
      verifiedDate: new Date('2024-01-16'),
      expiryDate: new Date('2025-12-31'),
      isRequired: true,
      description: 'Valid business license required for plumbing operations',
      version: 1,
      downloadCount: 15,
      lastAccessed: new Date('2024-09-20'),
      tags: ['license', 'mandatory'],
      category: 'plumbing',
      isActive: true,
      fileUrl: '/documents/business-license-2024.pdf'
    },
    {
      id: 2,
      vendorId: 1,
      vendorName: 'QuickFix Plumbers',
      documentName: 'Insurance Certificate',
      documentType: 'insurance',
      fileName: 'insurance-cert-2024.pdf',
      fileSize: 1234567,
      fileType: 'application/pdf',
      uploadDate: new Date('2024-02-01'),
      uploadedBy: 'Vendor',
      verificationStatus: 'pending',
      expiryDate: new Date('2024-12-31'),
      isRequired: true,
      description: 'Liability insurance certificate covering plumbing services',
      version: 2,
      downloadCount: 8,
      lastAccessed: new Date('2024-09-18'),
      tags: ['insurance', 'liability'],
      category: 'plumbing',
      isActive: true,
      fileUrl: '/documents/insurance-cert-2024.pdf'
    },
    {
      id: 3,
      vendorId: 2,
      vendorName: 'PowerTech Electricians',
      documentName: 'Electrical License',
      documentType: 'license',
      fileName: 'electrical-license.pdf',
      fileSize: 3456789,
      fileType: 'application/pdf',
      uploadDate: new Date('2024-03-10'),
      uploadedBy: 'Vendor',
      verificationStatus: 'verified',
      verifiedBy: 'Sarah Johnson',
      verifiedDate: new Date('2024-03-12'),
      expiryDate: new Date('2026-03-10'),
      isRequired: true,
      description: 'Professional electrical contractor license',
      version: 1,
      downloadCount: 22,
      lastAccessed: new Date('2024-09-21'),
      tags: ['license', 'electrical'],
      category: 'electrical',
      isActive: true,
      fileUrl: '/documents/electrical-license.pdf'
    },
    {
      id: 4,
      vendorId: 2,
      vendorName: 'PowerTech Electricians',
      documentName: 'Safety Certificate',
      documentType: 'certificate',
      fileName: 'safety-cert-2024.jpg',
      fileSize: 891234,
      fileType: 'image/jpeg',
      uploadDate: new Date('2024-06-15'),
      uploadedBy: 'Admin User',
      verificationStatus: 'rejected',
      rejectionReason: 'Document quality too low, please upload a clearer version',
      isRequired: false,
      description: 'Workplace safety training certificate',
      version: 1,
      downloadCount: 3,
      tags: ['safety', 'training'],
      category: 'electrical',
      isActive: true,
      fileUrl: '/documents/safety-cert-2024.jpg'
    },
    {
      id: 5,
      vendorId: 3,
      vendorName: 'EcoClean Solutions',
      documentName: 'Eco Certification',
      documentType: 'certificate',
      fileName: 'eco-cert-2024.pdf',
      fileSize: 1876543,
      fileType: 'application/pdf',
      uploadDate: new Date('2024-04-20'),
      uploadedBy: 'Vendor',
      verificationStatus: 'verified',
      verifiedBy: 'Mike Davis',
      verifiedDate: new Date('2024-04-22'),
      expiryDate: new Date('2025-04-20'),
      isRequired: false,
      description: 'Environmental certification for eco-friendly cleaning practices',
      version: 3,
      downloadCount: 12,
      lastAccessed: new Date('2024-09-19'),
      tags: ['eco-friendly', 'certification'],
      category: 'cleaning',
      isActive: true,
      fileUrl: '/documents/eco-cert-2024.pdf'
    },
    {
      id: 6,
      vendorId: 4,
      vendorName: 'SecureGuard Agency',
      documentName: 'Security License',
      documentType: 'license',
      fileName: 'security-license-expired.pdf',
      fileSize: 2234567,
      fileType: 'application/pdf',
      uploadDate: new Date('2023-08-15'),
      uploadedBy: 'Vendor',
      verificationStatus: 'verified',
      verifiedBy: 'Tom Wilson',
      verifiedDate: new Date('2023-08-16'),
      expiryDate: new Date('2024-08-15'), // Expired
      isRequired: true,
      description: 'Private security services license - EXPIRED',
      version: 1,
      downloadCount: 25,
      lastAccessed: new Date('2024-09-15'),
      tags: ['license', 'security', 'expired'],
      category: 'security',
      isActive: false,
      fileUrl: '/documents/security-license-expired.pdf'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setDocuments(mockDocuments);
      setFilteredDocuments(mockDocuments);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = documents.filter(document => {
      const matchesSearch = document.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          document.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          document.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          document.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesVendor = selectedVendor === 'all' || document.vendorName === selectedVendor;
      const matchesType = selectedType === 'all' || document.documentType === selectedType;
      const matchesStatus = selectedStatus === 'all' || document.verificationStatus === selectedStatus;

      return matchesSearch && matchesVendor && matchesType && matchesStatus;
    });

    // Sort logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'documentName':
          return a.documentName.localeCompare(b.documentName);
        case 'vendorName':
          return a.vendorName.localeCompare(b.vendorName);
        case 'uploadDate':
          return b.uploadDate.getTime() - a.uploadDate.getTime();
        case 'verificationStatus':
          return a.verificationStatus.localeCompare(b.verificationStatus);
        case 'expiryDate':
          if (!a.expiryDate && !b.expiryDate) return 0;
          if (!a.expiryDate) return 1;
          if (!b.expiryDate) return -1;
          const dateA = parseDate(a.expiryDate);
          const dateB = parseDate(b.expiryDate);
          if (!dateA && !dateB) return 0;
          if (!dateA) return 1;
          if (!dateB) return -1;
          return dateA.getTime() - dateB.getTime();
        case 'fileSize':
          return b.fileSize - a.fileSize;
        default:
          return 0;
      }
    });

    setFilteredDocuments(filtered);
  }, [documents, searchTerm, selectedVendor, selectedType, selectedStatus, sortBy]);

  const handleAddDocument = () => {
    setSelectedDocument(null);
    setIsModalOpen(true);
  };

  const handleEditDocument = (document: VendorDocument) => {
    setSelectedDocument(document);
    setIsModalOpen(true);
  };

  const handleDeleteDocument = (documentId: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(d => d.id !== documentId));
      toast.success('Document deleted successfully');
    }
  };

  const handleVerifyDocument = (documentId: number) => {
    setDocuments(documents.map(doc =>
      doc.id === documentId
        ? {
            ...doc,
            verificationStatus: 'verified' as const,
            verifiedBy: 'Current User',
            verifiedDate: new Date()
          }
        : doc
    ));
    toast.success('Document verified successfully');
  };

  const handleRejectDocument = (documentId: number) => {
    const reason = window.prompt('Please provide a reason for rejection:');
    if (reason) {
      setDocuments(documents.map(doc =>
        doc.id === documentId
          ? {
              ...doc,
              verificationStatus: 'rejected' as const,
              rejectionReason: reason
            }
          : doc
      ));
      toast.error('Document rejected');
    }
  };

  const handleDocumentSubmit = (documentData: Partial<VendorDocument>) => {
    if (selectedDocument) {
      // Edit existing document
      const updatedDocuments = documents.map(document =>
        document.id === selectedDocument.id
          ? { ...document, ...documentData }
          : document
      );
      setDocuments(updatedDocuments);
      toast.success('Document updated successfully');
    } else {
      // Add new document
      const newDocument: VendorDocument = {
        id: Date.now(),
        uploadDate: new Date(),
        version: 1,
        downloadCount: 0,
        verificationStatus: 'pending',
        isActive: true,
        tags: [],
        ...documentData
      } as VendorDocument;
      
      setDocuments([...documents, newDocument]);
      toast.success('Document added successfully');
    }
    setIsModalOpen(false);
  };

  const handleDownload = (document: VendorDocument) => {
    // Increment download count
    setDocuments(documents.map(doc =>
      doc.id === document.id
        ? { ...doc, downloadCount: doc.downloadCount + 1, lastAccessed: new Date() }
        : doc
    ));
    
    // Simulate download
    toast.info(`Downloading ${document.fileName}...`);
  };

  const stats = useMemo(() => {
    const totalDocuments = documents.length;
    const verifiedDocuments = documents.filter(d => d.verificationStatus === 'verified').length;
    const pendingDocuments = documents.filter(d => d.verificationStatus === 'pending').length;
    const expiredDocuments = documents.filter(d => d.expiryDate && d.expiryDate < new Date()).length;
    const totalVendors = new Set(documents.map(d => d.vendorId)).size;

    return { totalDocuments, verifiedDocuments, pendingDocuments, expiredDocuments, totalVendors };
  }, [documents]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string, fileType: string) => {
    if (fileType.includes('image')) return <FiImage size={18} />;
    if (fileType.includes('pdf') || fileName.endsWith('.pdf')) return <FiFileText size={18} />;
    return <FiFile size={18} />;
  };

  const getUniqueVendors = () => {
    const vendors = new Set(documents.map(d => d.vendorName));
    return Array.from(vendors);
  };

  // Utility function to convert string or Date to Date object
  const parseDate = (date?: Date | string): Date | null => {
    if (!date) return null;
    if (date instanceof Date) return date;
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const isExpiringSoon = (expiryDate?: Date | string) => {
    const date = parseDate(expiryDate);
    if (!date) return false;
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return date <= thirtyDaysFromNow && date >= new Date();
  };

  const isExpired = (expiryDate?: Date | string) => {
    const date = parseDate(expiryDate);
    if (!date) return false;
    return date < new Date();
  };

  if (isLoading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '1.5rem', color: '#666' }}>Loading vendor documents...</div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <FiFileText size={32} />
          Vendor Documents
        </Title>
        <HeaderActions>
          <Button onClick={handleAddDocument} variant="primary">
            <FiPlus size={18} />
            Add Document
          </Button>
        </HeaderActions>
      </Header>

      <FilterSection>
        <FilterRow>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search documents, vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          
          <Select
            value={selectedVendor}
            onChange={(e) => setSelectedVendor(e.target.value)}
          >
            <option value="all">All Vendors</option>
            {getUniqueVendors().map(vendor => (
              <option key={vendor} value={vendor}>{vendor}</option>
            ))}
          </Select>

          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="license">License</option>
            <option value="certificate">Certificate</option>
            <option value="insurance">Insurance</option>
            <option value="registration">Registration</option>
            <option value="contract">Contract</option>
            <option value="identification">Identification</option>
            <option value="other">Other</option>
          </Select>

          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </Select>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="uploadDate">Sort by Upload Date</option>
            <option value="documentName">Sort by Document Name</option>
            <option value="vendorName">Sort by Vendor</option>
            <option value="verificationStatus">Sort by Status</option>
            <option value="expiryDate">Sort by Expiry</option>
            <option value="fileSize">Sort by File Size</option>
          </Select>
        </FilterRow>

        <StatsRow>
          <StatsGroup>
            <StatItem>
              <StatValue>{stats.totalDocuments}</StatValue>
              <StatLabel>Total Documents</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.verifiedDocuments}</StatValue>
              <StatLabel>Verified</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.pendingDocuments}</StatValue>
              <StatLabel>Pending</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.expiredDocuments}</StatValue>
              <StatLabel>Expired</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.totalVendors}</StatValue>
              <StatLabel>Vendors</StatLabel>
            </StatItem>
          </StatsGroup>

          <ViewToggle>
            <ViewButton
              isActive={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
            >
              <FiGrid size={16} />
              Grid
            </ViewButton>
            <ViewButton
              isActive={viewMode === 'list'}
              onClick={() => setViewMode('list')}
            >
              <FiList size={16} />
              List
            </ViewButton>
          </ViewToggle>
        </StatsRow>
      </FilterSection>

      {filteredDocuments.length === 0 ? (
        <EmptyState>
          <FiFileText size={48} />
          <h3>No documents found</h3>
          <p>Try adjusting your search criteria or add a new document.</p>
        </EmptyState>
      ) : (
        <DocumentsContainer viewMode={viewMode}>
          {filteredDocuments.map((document) => (
            <DocumentCard key={document.id}>
              <StatusIndicator status={document.verificationStatus} />
              
              <DocumentHeader>
                <DocumentInfo>
                  <DocumentTitle>
                    {getFileIcon(document.fileName, document.fileType)}
                    {document.documentName}
                  </DocumentTitle>
                  <VendorName>{document.vendorName}</VendorName>
                  <DocumentMeta>
                    <Badge variant="type">{document.documentType}</Badge>
                    <Badge variant="status">{document.verificationStatus}</Badge>
                    {document.isRequired && <Badge variant="required">Required</Badge>}
                    {isExpired(document.expiryDate) && <Badge variant="expired">Expired</Badge>}
                  </DocumentMeta>
                </DocumentInfo>
              </DocumentHeader>

              <DocumentDescription>{document.description}</DocumentDescription>

              <DocumentDetails>
                <DetailRow>
                  <DetailLabel>File Name:</DetailLabel>
                  <DetailValue>{document.fileName}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>File Size:</DetailLabel>
                  <DetailValue>{formatFileSize(document.fileSize)}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Uploaded:</DetailLabel>
                  <DetailValue>{document.uploadDate.toLocaleDateString()}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Version:</DetailLabel>
                  <DetailValue>v{document.version}</DetailValue>
                </DetailRow>
                {document.expiryDate && (
                  <DetailRow>
                    <DetailLabel>Expires:</DetailLabel>
                    <DetailValue>
                      {parseDate(document.expiryDate)?.toLocaleDateString() || String(document.expiryDate)}
                    </DetailValue>
                  </DetailRow>
                )}
                <DetailRow>
                  <DetailLabel>Downloads:</DetailLabel>
                  <DetailValue>{document.downloadCount}</DetailValue>
                </DetailRow>
              </DocumentDetails>

              {isExpiringSoon(document.expiryDate) && !isExpired(document.expiryDate) && (
                <ExpiryWarning>
                  <FiAlertTriangle size={16} />
                  <span>Expires soon!</span>
                </ExpiryWarning>
              )}

              {document.verificationStatus === 'rejected' && document.rejectionReason && (
                <ExpiryWarning>
                  <FiXCircle size={16} />
                  <span>{document.rejectionReason}</span>
                </ExpiryWarning>
              )}

              <DocumentActions>
                <ActionButton onClick={() => handleDownload(document)}>
                  <FiDownload size={14} />
                  Download
                </ActionButton>
                <ActionButton onClick={() => handleEditDocument(document)}>
                  <FiEdit size={14} />
                  Edit
                </ActionButton>
                {document.verificationStatus === 'pending' && (
                  <>
                    <ActionButton
                      variant="success"
                      onClick={() => handleVerifyDocument(document.id)}
                    >
                      <FiCheckCircle size={14} />
                      Verify
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      onClick={() => handleRejectDocument(document.id)}
                    >
                      <FiXCircle size={14} />
                      Reject
                    </ActionButton>
                  </>
                )}
                <ActionButton
                  variant="danger"
                  onClick={() => handleDeleteDocument(document.id)}
                >
                  <FiTrash2 size={14} />
                </ActionButton>
              </DocumentActions>
            </DocumentCard>
          ))}
        </DocumentsContainer>
      )}

      {isModalOpen && (
        <VendorDocumentsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          document={selectedDocument}
          onSubmit={handleDocumentSubmit}
        />
      )}
    </Container>
  );
};

export default VendorDocumentsPage;