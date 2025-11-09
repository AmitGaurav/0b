import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import {
  FiCreditCard,
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiDownload,
  FiEye,
  FiCheck,
  FiX,
  FiAlertTriangle,
  FiClock,
  FiUser,
  FiCalendar,
  FiFilter,
  FiGrid,
  FiList,
  FiDollarSign,
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiSend,
  FiArchive,
  FiPaperclip
} from 'react-icons/fi';
import VendorPaymentsModal from './VendorPaymentsModal';
import { toast } from 'react-toastify';

// Payment Management Interface
interface VendorPayment {
  id: number;
  vendorId: number;
  vendorName: string;
  invoiceNumber: string;
  paymentId: string;
  amount: number;
  serviceDescription: string;
  paymentDate: Date;
  dueDate: Date;
  processedDate?: Date;
  paymentMethod: 'bank_transfer' | 'check' | 'online' | 'cash' | 'card';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'on_hold';
  paymentType: 'service' | 'maintenance' | 'supplies' | 'contract' | 'emergency' | 'other';
  approvedBy?: string;
  processedBy?: string;
  rejectionReason?: string;
  attachments: string[];
  notes: string;
  taxAmount: number;
  discountAmount: number;
  netAmount: number;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  recurringPayment: boolean;
  nextPaymentDate?: Date;
  contractId?: string;
  isOverdue: boolean;
  createdBy: string;
  createdDate: Date;
  lastModified: Date;
  paymentReference: string;
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

const PaymentsContainer = styled.div<{ viewMode: 'grid' | 'list' }>`
  ${({ viewMode, theme }) => 
    viewMode === 'grid' 
      ? `
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
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

const PaymentCard = styled.div`
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

const PaymentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const PaymentInfo = styled.div`
  flex: 1;
`;

const PaymentTitle = styled.h3`
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

const PaymentMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const Badge = styled.span<{ variant?: 'type' | 'status' | 'priority' | 'overdue' | 'recurring' }>`
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
      case 'priority':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
        `;
      case 'overdue':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[700]};
        `;
      case 'recurring':
        return `
          background: ${theme.colors.info[100]};
          color: ${theme.colors.info[700]};
        `;
      default:
        return `
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[700]};
        `;
    }
  }}
`;

const AmountDisplay = styled.div`
  text-align: right;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const MainAmount = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const AmountBreakdown = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const PaymentDetails = styled.div`
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

const ServiceDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PaymentActions = styled.div`
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
      case 'completed':
        return `background: ${theme.colors.success[500]};`;
      case 'processing':
        return `background: ${theme.colors.info[500]};`;
      case 'pending':
        return `background: ${theme.colors.warning[500]};`;
      case 'failed':
      case 'cancelled':
        return `background: ${theme.colors.error[500]};`;
      case 'on_hold':
        return `background: ${theme.colors.gray[500]};`;
      default:
        return `background: ${theme.colors.gray[400]};`;
    }
  }}
`;

const OverdueWarning = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.error[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const RecurringIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.info[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const AttachmentsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.gray[600]};
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

const VendorPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<VendorPayment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<VendorPayment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('paymentDate');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPayment, setSelectedPayment] = useState<VendorPayment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for vendor payments
  const mockPayments: VendorPayment[] = [
    {
      id: 1,
      vendorId: 1,
      vendorName: 'QuickFix Plumbers',
      invoiceNumber: 'INV-2024-001',
      paymentId: 'PAY-001',
      amount: 15000,
      serviceDescription: 'Emergency plumbing repairs in Building A, including pipe replacement and fixture installation',
      paymentDate: new Date('2024-09-25'),
      dueDate: new Date('2024-09-30'),
      processedDate: new Date('2024-09-24'),
      paymentMethod: 'bank_transfer',
      status: 'completed',
      paymentType: 'maintenance',
      approvedBy: 'John Smith',
      processedBy: 'Sarah Johnson',
      attachments: ['invoice-001.pdf', 'work-photos.jpg'],
      notes: 'Priority repair work completed on schedule',
      taxAmount: 2250,
      discountAmount: 500,
      netAmount: 16750,
      category: 'plumbing',
      priority: 'high',
      recurringPayment: false,
      contractId: 'CNT-PLB-001',
      isOverdue: false,
      createdBy: 'Admin User',
      createdDate: new Date('2024-09-20'),
      lastModified: new Date('2024-09-24'),
      paymentReference: 'REF-2024-001'
    },
    {
      id: 2,
      vendorId: 2,
      vendorName: 'PowerTech Electricians',
      invoiceNumber: 'INV-2024-002',
      paymentId: 'PAY-002',
      amount: 8500,
      serviceDescription: 'Monthly electrical maintenance and LED installation in common areas',
      paymentDate: new Date('2024-09-15'),
      dueDate: new Date('2024-09-22'),
      paymentMethod: 'check',
      status: 'processing',
      paymentType: 'service',
      approvedBy: 'Mike Davis',
      attachments: ['invoice-002.pdf'],
      notes: 'Regular monthly service payment',
      taxAmount: 1275,
      discountAmount: 0,
      netAmount: 9775,
      category: 'electrical',
      priority: 'medium',
      recurringPayment: true,
      nextPaymentDate: new Date('2024-10-15'),
      contractId: 'CNT-ELC-002',
      isOverdue: false,
      createdBy: 'Admin User',
      createdDate: new Date('2024-09-10'),
      lastModified: new Date('2024-09-22'),
      paymentReference: 'REF-2024-002'
    },
    {
      id: 3,
      vendorId: 3,
      vendorName: 'EcoClean Solutions',
      invoiceNumber: 'INV-2024-003',
      paymentId: 'PAY-003',
      amount: 12000,
      serviceDescription: 'Deep cleaning services for all common areas and facilities',
      paymentDate: new Date('2024-09-10'),
      dueDate: new Date('2024-09-08'),
      paymentMethod: 'online',
      status: 'pending',
      paymentType: 'service',
      attachments: ['invoice-003.pdf', 'cleaning-checklist.pdf'],
      notes: 'Overdue payment - follow up required',
      taxAmount: 1800,
      discountAmount: 200,
      netAmount: 13600,
      category: 'cleaning',
      priority: 'high',
      recurringPayment: true,
      nextPaymentDate: new Date('2024-10-10'),
      contractId: 'CNT-CLN-003',
      isOverdue: true,
      createdBy: 'Admin User',
      createdDate: new Date('2024-09-05'),
      lastModified: new Date('2024-09-10'),
      paymentReference: 'REF-2024-003'
    },
    {
      id: 4,
      vendorId: 4,
      vendorName: 'SecureGuard Agency',
      invoiceNumber: 'INV-2024-004',
      paymentId: 'PAY-004',
      amount: 25000,
      serviceDescription: 'Security services for the month including night patrol and CCTV monitoring',
      paymentDate: new Date('2024-09-01'),
      dueDate: new Date('2024-09-05'),
      paymentMethod: 'bank_transfer',
      status: 'failed',
      paymentType: 'service',
      rejectionReason: 'Insufficient bank details provided',
      attachments: ['invoice-004.pdf'],
      notes: 'Payment failed due to incorrect bank information',
      taxAmount: 3750,
      discountAmount: 0,
      netAmount: 28750,
      category: 'security',
      priority: 'urgent',
      recurringPayment: true,
      nextPaymentDate: new Date('2024-10-01'),
      contractId: 'CNT-SEC-004',
      isOverdue: true,
      createdBy: 'Admin User',
      createdDate: new Date('2024-08-28'),
      lastModified: new Date('2024-09-05'),
      paymentReference: 'REF-2024-004'
    },
    {
      id: 5,
      vendorId: 5,
      vendorName: 'GreenGarden Services',
      invoiceNumber: 'INV-2024-005',
      paymentId: 'PAY-005',
      amount: 6500,
      serviceDescription: 'Landscaping and garden maintenance services for society premises',
      paymentDate: new Date('2024-09-28'),
      dueDate: new Date('2024-10-05'),
      paymentMethod: 'card',
      status: 'on_hold',
      paymentType: 'maintenance',
      attachments: ['invoice-005.pdf', 'before-after-photos.jpg'],
      notes: 'Payment on hold pending quality inspection',
      taxAmount: 975,
      discountAmount: 100,
      netAmount: 7375,
      category: 'landscaping',
      priority: 'low',
      recurringPayment: true,
      nextPaymentDate: new Date('2024-10-28'),
      contractId: 'CNT-GRD-005',
      isOverdue: false,
      createdBy: 'Admin User',
      createdDate: new Date('2024-09-25'),
      lastModified: new Date('2024-09-28'),
      paymentReference: 'REF-2024-005'
    },
    {
      id: 6,
      vendorId: 6,
      vendorName: 'TechSupport Pro',
      invoiceNumber: 'INV-2024-006',
      paymentId: 'PAY-006',
      amount: 4200,
      serviceDescription: 'IT support and network maintenance for society office systems',
      paymentDate: new Date('2024-09-18'),
      dueDate: new Date('2024-09-20'),
      processedDate: new Date('2024-09-19'),
      paymentMethod: 'online',
      status: 'completed',
      paymentType: 'service',
      approvedBy: 'Tom Wilson',
      processedBy: 'Lisa Brown',
      attachments: ['invoice-006.pdf'],
      notes: 'Regular IT maintenance payment',
      taxAmount: 630,
      discountAmount: 0,
      netAmount: 4830,
      category: 'technology',
      priority: 'medium',
      recurringPayment: true,
      nextPaymentDate: new Date('2024-10-18'),
      contractId: 'CNT-IT-006',
      isOverdue: false,
      createdBy: 'Admin User',
      createdDate: new Date('2024-09-15'),
      lastModified: new Date('2024-09-19'),
      paymentReference: 'REF-2024-006'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setPayments(mockPayments);
      setFilteredPayments(mockPayments);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = payments.filter(payment => {
      const matchesSearch = payment.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.serviceDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          payment.paymentReference.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesVendor = selectedVendor === 'all' || payment.vendorName === selectedVendor;
      const matchesStatus = selectedStatus === 'all' || payment.status === selectedStatus;
      const matchesType = selectedType === 'all' || payment.paymentType === selectedType;
      const matchesPriority = selectedPriority === 'all' || payment.priority === selectedPriority;

      return matchesSearch && matchesVendor && matchesStatus && matchesType && matchesPriority;
    });

    // Sort logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'vendorName':
          return a.vendorName.localeCompare(b.vendorName);
        case 'amount':
          return b.amount - a.amount;
        case 'paymentDate':
          return b.paymentDate.getTime() - a.paymentDate.getTime();
        case 'dueDate':
          return a.dueDate.getTime() - b.dueDate.getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        case 'priority':
          const priorityOrder = { 'urgent': 0, 'high': 1, 'medium': 2, 'low': 3 };
          return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
        default:
          return 0;
      }
    });

    setFilteredPayments(filtered);
  }, [payments, searchTerm, selectedVendor, selectedStatus, selectedType, selectedPriority, sortBy]);

  const handleAddPayment = () => {
    setSelectedPayment(null);
    setIsModalOpen(true);
  };

  const handleEditPayment = (payment: VendorPayment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const handleDeletePayment = (paymentId: number) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      setPayments(payments.filter(p => p.id !== paymentId));
      toast.success('Payment deleted successfully');
    }
  };

  const handleProcessPayment = (paymentId: number) => {
    setPayments(payments.map(payment =>
      payment.id === paymentId
        ? {
            ...payment,
            status: 'processing' as const,
            processedBy: 'Current User',
            processedDate: new Date(),
            lastModified: new Date()
          }
        : payment
    ));
    toast.success('Payment is being processed');
  };

  const handleCompletePayment = (paymentId: number) => {
    setPayments(payments.map(payment =>
      payment.id === paymentId
        ? {
            ...payment,
            status: 'completed' as const,
            processedBy: 'Current User',
            processedDate: new Date(),
            lastModified: new Date()
          }
        : payment
    ));
    toast.success('Payment completed successfully');
  };

  const handleHoldPayment = (paymentId: number) => {
    const reason = window.prompt('Please provide a reason for holding this payment:');
    if (reason) {
      setPayments(payments.map(payment =>
        payment.id === paymentId
          ? {
              ...payment,
              status: 'on_hold' as const,
              notes: `${payment.notes}\n[HOLD] ${reason}`,
              lastModified: new Date()
            }
          : payment
      ));
      toast.warning('Payment put on hold');
    }
  };

  const handlePaymentSubmit = (paymentData: Partial<VendorPayment>) => {
    if (selectedPayment) {
      // Edit existing payment
      const updatedPayments = payments.map(payment =>
        payment.id === selectedPayment.id
          ? { ...payment, ...paymentData, lastModified: new Date() }
          : payment
      );
      setPayments(updatedPayments);
      toast.success('Payment updated successfully');
    } else {
      // Add new payment
      const newPayment: VendorPayment = {
        id: Date.now(),
        paymentDate: new Date(),
        createdDate: new Date(),
        lastModified: new Date(),
        status: 'pending',
        attachments: [],
        taxAmount: 0,
        discountAmount: 0,
        netAmount: (paymentData.amount || 0),
        priority: 'medium',
        recurringPayment: false,
        isOverdue: false,
        createdBy: 'Current User',
        ...paymentData
      } as VendorPayment;
      
      setPayments([...payments, newPayment]);
      toast.success('Payment added successfully');
    }
    setIsModalOpen(false);
  };

  const stats = useMemo(() => {
    const totalPayments = payments.length;
    const completedPayments = payments.filter(p => p.status === 'completed').length;
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    const overduePayments = payments.filter(p => p.isOverdue).length;
    const totalAmount = payments.reduce((sum, p) => sum + p.netAmount, 0);
    const totalVendors = new Set(payments.map(p => p.vendorId)).size;

    return { totalPayments, completedPayments, pendingPayments, overduePayments, totalAmount, totalVendors };
  }, [payments]);

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getUniqueVendors = () => {
    const vendors = new Set(payments.map(p => p.vendorName));
    return Array.from(vendors);
  };

  const getPaymentIcon = (paymentType: string) => {
    switch (paymentType) {
      case 'service': return <FiCreditCard size={18} />;
      case 'maintenance': return <FiRefreshCw size={18} />;
      case 'supplies': return <FiArchive size={18} />;
      case 'contract': return <FiFileText size={18} />;
      case 'emergency': return <FiAlertTriangle size={18} />;
      default: return <FiDollarSign size={18} />;
    }
  };

  if (isLoading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '1.5rem', color: '#666' }}>Loading vendor payments...</div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <FiCreditCard size={32} />
          Vendor Payments
        </Title>
        <HeaderActions>
          <Button onClick={handleAddPayment} variant="primary">
            <FiPlus size={18} />
            Add Payment
          </Button>
        </HeaderActions>
      </Header>

      <FilterSection>
        <FilterRow>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search payments, vendors, invoices..."
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
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
            <option value="on_hold">On Hold</option>
          </Select>

          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="service">Service</option>
            <option value="maintenance">Maintenance</option>
            <option value="supplies">Supplies</option>
            <option value="contract">Contract</option>
            <option value="emergency">Emergency</option>
            <option value="other">Other</option>
          </Select>

          <Select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="paymentDate">Sort by Payment Date</option>
            <option value="vendorName">Sort by Vendor</option>
            <option value="amount">Sort by Amount</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="status">Sort by Status</option>
            <option value="priority">Sort by Priority</option>
          </Select>
        </FilterRow>

        <StatsRow>
          <StatsGroup>
            <StatItem>
              <StatValue>{stats.totalPayments}</StatValue>
              <StatLabel>Total Payments</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.completedPayments}</StatValue>
              <StatLabel>Completed</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.pendingPayments}</StatValue>
              <StatLabel>Pending</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.overduePayments}</StatValue>
              <StatLabel>Overdue</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{formatCurrency(stats.totalAmount)}</StatValue>
              <StatLabel>Total Amount</StatLabel>
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

      {filteredPayments.length === 0 ? (
        <EmptyState>
          <FiCreditCard size={48} />
          <h3>No payments found</h3>
          <p>Try adjusting your search criteria or add a new payment.</p>
        </EmptyState>
      ) : (
        <PaymentsContainer viewMode={viewMode}>
          {filteredPayments.map((payment) => (
            <PaymentCard key={payment.id}>
              <StatusIndicator status={payment.status} />
              
              <PaymentHeader>
                <PaymentInfo>
                  <PaymentTitle>
                    {getPaymentIcon(payment.paymentType)}
                    {payment.invoiceNumber}
                  </PaymentTitle>
                  <VendorName>{payment.vendorName}</VendorName>
                  <PaymentMeta>
                    <Badge variant="type">{payment.paymentType}</Badge>
                    <Badge variant="status">{payment.status}</Badge>
                    <Badge variant="priority">{payment.priority}</Badge>
                    {payment.recurringPayment && <Badge variant="recurring">Recurring</Badge>}
                    {payment.isOverdue && <Badge variant="overdue">Overdue</Badge>}
                  </PaymentMeta>
                </PaymentInfo>

                <AmountDisplay>
                  <MainAmount>{formatCurrency(payment.netAmount)}</MainAmount>
                  <AmountBreakdown>
                    Base: {formatCurrency(payment.amount)} | Tax: {formatCurrency(payment.taxAmount)}
                  </AmountBreakdown>
                </AmountDisplay>
              </PaymentHeader>

              <ServiceDescription>{payment.serviceDescription}</ServiceDescription>

              <PaymentDetails>
                <DetailRow>
                  <DetailLabel>Payment ID:</DetailLabel>
                  <DetailValue>{payment.paymentId}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Payment Method:</DetailLabel>
                  <DetailValue>{payment.paymentMethod.replace('_', ' ').toUpperCase()}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Payment Date:</DetailLabel>
                  <DetailValue>{payment.paymentDate.toLocaleDateString()}</DetailValue>
                </DetailRow>
                <DetailRow>
                  <DetailLabel>Due Date:</DetailLabel>
                  <DetailValue>{payment.dueDate.toLocaleDateString()}</DetailValue>
                </DetailRow>
                {payment.processedDate && (
                  <DetailRow>
                    <DetailLabel>Processed:</DetailLabel>
                    <DetailValue>{payment.processedDate.toLocaleDateString()}</DetailValue>
                  </DetailRow>
                )}
                {payment.contractId && (
                  <DetailRow>
                    <DetailLabel>Contract:</DetailLabel>
                    <DetailValue>{payment.contractId}</DetailValue>
                  </DetailRow>
                )}
              </PaymentDetails>

              {payment.isOverdue && (
                <OverdueWarning>
                  <FiAlertTriangle size={16} />
                  <span>Payment is overdue!</span>
                </OverdueWarning>
              )}

              {payment.recurringPayment && payment.nextPaymentDate && (
                <RecurringIndicator>
                  <FiRefreshCw size={16} />
                  <span>Next payment: {payment.nextPaymentDate.toLocaleDateString()}</span>
                </RecurringIndicator>
              )}

              {payment.attachments.length > 0 && (
                <AttachmentsInfo>
                  <FiPaperclip size={16} />
                  <span>{payment.attachments.length} attachment(s)</span>
                </AttachmentsInfo>
              )}

              <PaymentActions>
                <ActionButton onClick={() => handleEditPayment(payment)}>
                  <FiEdit size={14} />
                  Edit
                </ActionButton>
                {payment.status === 'pending' && (
                  <ActionButton
                    variant="primary"
                    onClick={() => handleProcessPayment(payment.id)}
                  >
                    <FiSend size={14} />
                    Process
                  </ActionButton>
                )}
                {payment.status === 'processing' && (
                  <ActionButton
                    variant="success"
                    onClick={() => handleCompletePayment(payment.id)}
                  >
                    <FiCheckCircle size={14} />
                    Complete
                  </ActionButton>
                )}
                <ActionButton
                  onClick={() => handleHoldPayment(payment.id)}
                >
                  <FiClock size={14} />
                  Hold
                </ActionButton>
                <ActionButton
                  variant="danger"
                  onClick={() => handleDeletePayment(payment.id)}
                >
                  <FiTrash2 size={14} />
                </ActionButton>
              </PaymentActions>
            </PaymentCard>
          ))}
        </PaymentsContainer>
      )}

      {isModalOpen && (
        <VendorPaymentsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          payment={selectedPayment}
          onSubmit={handlePaymentSubmit}
        />
      )}
    </Container>
  );
};

export default VendorPaymentsPage;