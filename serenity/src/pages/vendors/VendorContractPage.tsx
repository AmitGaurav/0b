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
  FiCalendar,
  FiClock,
  FiUser,
  FiDollarSign,
  FiFilter,
  FiGrid,
  FiList,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiAlertTriangle,
  FiUpload,
  FiCopy,
  FiSend,
  FiArchive,
  FiRotateCw,
  FiAlertOctagon,
  FiTrendingUp,
  FiTrendingDown
} from 'react-icons/fi';
import VendorContractModal from './VendorContractModal';
import { toast } from 'react-toastify';

// Contract Management Interface
interface VendorContract {
  id: number;
  contractNumber: string;
  vendorId: number;
  vendorName: string;
  contractTitle: string;
  contractType: 'service' | 'maintenance' | 'supply' | 'consulting' | 'construction' | 'other';
  status: 'draft' | 'pending_approval' | 'active' | 'expired' | 'terminated' | 'renewed' | 'suspended';
  startDate: Date;
  endDate: Date;
  renewalDate?: Date;
  autoRenewal: boolean;
  renewalPeriod?: number; // in months
  value: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR';
  paymentTerms: 'monthly' | 'quarterly' | 'annually' | 'milestone' | 'completion';
  billingCycle: number; // in days
  description: string;
  scope: string;
  terms: string;
  createdBy: string;
  approvedBy?: string;
  signedBy?: string;
  createdDate: Date;
  approvedDate?: Date;
  signedDate?: Date;
  lastModified: Date;
  attachments: string[];
  performanceMetrics: {
    slaCompliance: number;
    qualityScore: number;
    timelyCompletion: number;
    costEfficiency: number;
  };
  milestones: {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    status: 'pending' | 'in_progress' | 'completed' | 'delayed';
    value: number;
  }[];
  amendments: {
    id: number;
    title: string;
    description: string;
    date: Date;
    approvedBy: string;
    impact: 'financial' | 'scope' | 'timeline' | 'terms';
  }[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  complianceStatus: 'compliant' | 'non_compliant' | 'under_review';
  nextReviewDate: Date;
  tags: string[];
  notes: string;
}

// Styled Components
const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  gap: ${({ theme }) => theme.spacing[4]};
  flex-wrap: wrap;
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
  align-items: center;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const StatIconWrapper = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ color }) => color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => color};
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const FiltersContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: end;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FilterLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const FilterInput = styled.input`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[1]};
`;

const ViewButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  
  ${({ active, theme }) => active ? `
    background: ${theme.colors.white};
    color: ${theme.colors.primary[600]};
    box-shadow: ${theme.boxShadow.sm};
  ` : `
    background: transparent;
    color: ${theme.colors.gray[600]};
    
    &:hover {
      color: ${theme.colors.gray[900]};
    }
  `}
`;

const ContractsContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  overflow: hidden;
`;

const ContractsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[6]};
`;

const ContractCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[5]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  position: relative;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[300]};
    box-shadow: ${({ theme }) => theme.boxShadow.md};
    transform: translateY(-2px);
  }
`;

const ContractHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ContractTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ContractNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-family: monospace;
`;

const StatusBadge = styled.div<{ status: string }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: capitalize;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'active':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[800]};
        `;
      case 'pending_approval':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[800]};
        `;
      case 'expired':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[800]};
        `;
      case 'terminated':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[800]};
        `;
      case 'draft':
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[800]};
        `;
      case 'renewed':
        return `
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[800]};
        `;
      case 'suspended':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[800]};
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[800]};
        `;
    }
  }}
`;

const RiskBadge = styled.div<{ risk: string }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  right: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  
  ${({ risk, theme }) => {
    switch (risk) {
      case 'critical':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[800]};
        `;
      case 'high':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[800]};
        `;
      case 'medium':
        return `
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[800]};
        `;
      case 'low':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[800]};
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[800]};
        `;
    }
  }}
`;

const ContractInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ContractVendor = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const ContractValue = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const ContractValueAmount = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const ContractDates = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const ContractDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ContractActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  padding-top: ${({ theme }) => theme.spacing[3]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
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

const ExpiryWarning = styled.div`
  background: ${({ theme }) => theme.colors.warning[50]};
  border: 1px solid ${({ theme }) => theme.colors.warning[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[2]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.warning[800]};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid transparent;
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

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[300]};
`;

const EmptyStateText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const EmptyStateDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const VendorContractPage: React.FC = () => {
  const [contracts, setContracts] = useState<VendorContract[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContract, setSelectedContract] = useState<VendorContract | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | 'renew'>('create');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVendor, setFilterVendor] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [sortBy, setSortBy] = useState('endDate');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // Load contracts
  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    setLoading(true);
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockContracts: VendorContract[] = [
        {
          id: 1,
          contractNumber: 'CNT-2024-001',
          vendorId: 1,
          vendorName: 'TechCorp Solutions',
          contractTitle: 'IT Infrastructure Management',
          contractType: 'service',
          status: 'active',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          renewalDate: new Date('2024-11-01'),
          autoRenewal: true,
          renewalPeriod: 12,
          value: 120000,
          currency: 'USD',
          paymentTerms: 'monthly',
          billingCycle: 30,
          description: 'Comprehensive IT infrastructure management and support services',
          scope: 'Network management, server maintenance, security monitoring, and technical support',
          terms: 'Standard service agreement with SLA guarantees',
          createdBy: 'Admin User',
          approvedBy: 'John Manager',
          signedBy: 'TechCorp CEO',
          createdDate: new Date('2023-11-15'),
          approvedDate: new Date('2023-12-01'),
          signedDate: new Date('2023-12-15'),
          lastModified: new Date(),
          attachments: ['contract.pdf', 'sla_agreement.pdf'],
          performanceMetrics: {
            slaCompliance: 98.5,
            qualityScore: 95,
            timelyCompletion: 92,
            costEfficiency: 88
          },
          milestones: [
            {
              id: 1,
              title: 'Infrastructure Setup',
              description: 'Complete initial setup of monitoring systems',
              dueDate: new Date('2024-02-15'),
              status: 'completed',
              value: 20000
            },
            {
              id: 2,
              title: 'Security Implementation',
              description: 'Deploy security monitoring and threat detection',
              dueDate: new Date('2024-04-15'),
              status: 'completed',
              value: 30000
            }
          ],
          amendments: [],
          riskLevel: 'low',
          complianceStatus: 'compliant',
          nextReviewDate: new Date('2024-11-01'),
          tags: ['IT', 'Infrastructure', 'Support'],
          notes: 'Excellent performance, considering renewal'
        },
        {
          id: 2,
          contractNumber: 'CNT-2024-002',
          vendorId: 2,
          vendorName: 'BuildPro Services',
          contractTitle: 'Facility Maintenance Contract',
          contractType: 'maintenance',
          status: 'active',
          startDate: new Date('2024-03-01'),
          endDate: new Date('2025-02-28'),
          autoRenewal: false,
          value: 85000,
          currency: 'USD',
          paymentTerms: 'quarterly',
          billingCycle: 90,
          description: 'Comprehensive facility maintenance and repair services',
          scope: 'HVAC maintenance, electrical repairs, plumbing, and general building maintenance',
          terms: 'Standard maintenance contract with emergency response guarantees',
          createdBy: 'Facility Manager',
          approvedBy: 'Operations Director',
          createdDate: new Date('2024-01-15'),
          approvedDate: new Date('2024-02-01'),
          lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          attachments: ['maintenance_contract.pdf'],
          performanceMetrics: {
            slaCompliance: 94,
            qualityScore: 91,
            timelyCompletion: 96,
            costEfficiency: 92
          },
          milestones: [],
          amendments: [
            {
              id: 1,
              title: 'Scope Extension',
              description: 'Added elevator maintenance to the contract',
              date: new Date('2024-06-15'),
              approvedBy: 'Operations Director',
              impact: 'scope'
            }
          ],
          riskLevel: 'medium',
          complianceStatus: 'compliant',
          nextReviewDate: new Date('2024-12-01'),
          tags: ['Maintenance', 'Facility', 'HVAC'],
          notes: 'Good performance, some delays in emergency responses'
        },
        {
          id: 3,
          contractNumber: 'CNT-2024-003',
          vendorId: 3,
          vendorName: 'CleanCo Services',
          contractTitle: 'Cleaning Services Agreement',
          contractType: 'service',
          status: 'pending_approval',
          startDate: new Date('2024-10-01'),
          endDate: new Date('2025-09-30'),
          autoRenewal: true,
          renewalPeriod: 12,
          value: 48000,
          currency: 'USD',
          paymentTerms: 'monthly',
          billingCycle: 30,
          description: 'Daily cleaning and maintenance services for office spaces',
          scope: 'Daily cleaning, waste management, restroom maintenance, and deep cleaning services',
          terms: 'Standard cleaning service agreement with quality guarantees',
          createdBy: 'Office Manager',
          createdDate: new Date('2024-08-15'),
          lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          attachments: ['cleaning_proposal.pdf'],
          performanceMetrics: {
            slaCompliance: 0,
            qualityScore: 0,
            timelyCompletion: 0,
            costEfficiency: 0
          },
          milestones: [],
          amendments: [],
          riskLevel: 'low',
          complianceStatus: 'under_review',
          nextReviewDate: new Date('2024-09-15'),
          tags: ['Cleaning', 'Office', 'Daily'],
          notes: 'Pending final approval from management'
        },
        {
          id: 4,
          contractNumber: 'CNT-2023-015',
          vendorId: 4,
          vendorName: 'SecureGuard Security',
          contractTitle: 'Security Services Contract',
          contractType: 'service',
          status: 'expired',
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-12-31'),
          autoRenewal: false,
          value: 156000,
          currency: 'USD',
          paymentTerms: 'monthly',
          billingCycle: 30,
          description: 'Physical security and surveillance services',
          scope: '24/7 security guard services, CCTV monitoring, access control',
          terms: 'Security service agreement with liability coverage',
          createdBy: 'Security Manager',
          approvedBy: 'General Manager',
          signedBy: 'SecureGuard Director',
          createdDate: new Date('2022-11-01'),
          approvedDate: new Date('2022-11-15'),
          signedDate: new Date('2022-12-01'),
          lastModified: new Date('2024-01-01'),
          attachments: ['security_contract.pdf', 'liability_insurance.pdf'],
          performanceMetrics: {
            slaCompliance: 87,
            qualityScore: 89,
            timelyCompletion: 95,
            costEfficiency: 83
          },
          milestones: [],
          amendments: [],
          riskLevel: 'high',
          complianceStatus: 'compliant',
          nextReviewDate: new Date('2024-01-15'),
          tags: ['Security', 'Guard', 'Surveillance'],
          notes: 'Contract expired, renewal negotiations in progress'
        }
      ];
      
      setContracts(mockContracts);
    } catch (error) {
      console.error('Error loading contracts:', error);
      toast.error('Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      const matchesSearch = !searchTerm || 
        contract.contractTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.contractNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesVendor = !filterVendor || contract.vendorName === filterVendor;
      const matchesStatus = !filterStatus || contract.status === filterStatus;
      const matchesType = !filterType || contract.contractType === filterType;
      const matchesRisk = !filterRisk || contract.riskLevel === filterRisk;
      
      const matchesDateFrom = !filterDateFrom || contract.startDate >= new Date(filterDateFrom);
      const matchesDateTo = !filterDateTo || contract.endDate <= new Date(filterDateTo + 'T23:59:59');
      
      return matchesSearch && matchesVendor && matchesStatus && 
             matchesType && matchesRisk && matchesDateFrom && matchesDateTo;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'endDate':
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        case 'value':
          return b.value - a.value;
        case 'contractTitle':
          return a.contractTitle.localeCompare(b.contractTitle);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });
  }, [contracts, searchTerm, filterVendor, filterStatus, filterType, 
      filterRisk, filterDateFrom, filterDateTo, sortBy]);

  // Get unique values for filters
  const uniqueVendors = useMemo(() => 
    Array.from(new Set(contracts.map(c => c.vendorName))).sort(), 
    [contracts]
  );

  // Calculate statistics
  const stats = useMemo(() => {
    const total = contracts.length;
    const active = contracts.filter(c => c.status === 'active').length;
    const expiringSoon = contracts.filter(c => {
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      return c.status === 'active' && c.endDate <= thirtyDaysFromNow;
    }).length;
    const totalValue = contracts.reduce((sum, c) => sum + c.value, 0);
    
    return { total, active, expiringSoon, totalValue };
  }, [contracts]);

  const handleContractClick = (contract: VendorContract) => {
    setSelectedContract(contract);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleCreateContract = () => {
    setSelectedContract(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditContract = (e: React.MouseEvent, contract: VendorContract) => {
    e.stopPropagation();
    setSelectedContract(contract);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleRenewContract = (e: React.MouseEvent, contract: VendorContract) => {
    e.stopPropagation();
    setSelectedContract(contract);
    setModalMode('renew');
    setIsModalOpen(true);
  };

  const handleDeleteContract = (e: React.MouseEvent, contractId: number) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this contract?')) {
      setContracts(contracts.filter(c => c.id !== contractId));
      toast.success('Contract deleted successfully');
    }
  };

  const handleRefresh = () => {
    loadContracts();
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const getDaysUntilExpiry = (endDate: Date) => {
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return FiCheckCircle;
      case 'pending_approval': return FiClock;
      case 'expired': return FiXCircle;
      case 'terminated': return FiXCircle;
      case 'draft': return FiEdit;
      case 'renewed': return FiRotateCw;
      case 'suspended': return FiAlertTriangle;
      default: return FiFileText;
    }
  };

  return (
    <Container>
      <Header>
        <Title>
          <FiFileText />
          Vendor Contracts
        </Title>
        <HeaderActions>
          <ViewToggle>
            <ViewButton 
              active={viewMode === 'grid'} 
              onClick={() => setViewMode('grid')}
            >
              <FiGrid />
              Grid
            </ViewButton>
            <ViewButton 
              active={viewMode === 'list'} 
              onClick={() => setViewMode('list')}
            >
              <FiList />
              List
            </ViewButton>
          </ViewToggle>
          <Button onClick={handleRefresh}>
            <FiRefreshCw />
            Refresh
          </Button>
          <Button variant="primary" onClick={handleCreateContract}>
            <FiPlus />
            New Contract
          </Button>
        </HeaderActions>
      </Header>

      <StatsContainer>
        <StatCard>
          <StatIconWrapper color="#3B82F6">
            <FiFileText />
          </StatIconWrapper>
          <StatContent>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total Contracts</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIconWrapper color="#10B981">
            <FiCheckCircle />
          </StatIconWrapper>
          <StatContent>
            <StatValue>{stats.active}</StatValue>
            <StatLabel>Active Contracts</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIconWrapper color="#F59E0B">
            <FiClock />
          </StatIconWrapper>
          <StatContent>
            <StatValue>{stats.expiringSoon}</StatValue>
            <StatLabel>Expiring Soon</StatLabel>
          </StatContent>
        </StatCard>
        <StatCard>
          <StatIconWrapper color="#8B5CF6">
            <FiDollarSign />
          </StatIconWrapper>
          <StatContent>
            <StatValue>${(stats.totalValue / 1000000).toFixed(1)}M</StatValue>
            <StatLabel>Total Value</StatLabel>
          </StatContent>
        </StatCard>
      </StatsContainer>

      <FiltersContainer>
        <FiltersGrid>
          <FilterGroup>
            <FilterLabel>Search</FilterLabel>
            <FilterInput
              type="text"
              placeholder="Search contracts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Vendor</FilterLabel>
            <FilterSelect
              value={filterVendor}
              onChange={(e) => setFilterVendor(e.target.value)}
            >
              <option value="">All Vendors</option>
              {uniqueVendors.map(vendor => (
                <option key={vendor} value={vendor}>{vendor}</option>
              ))}
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Status</FilterLabel>
            <FilterSelect
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="terminated">Terminated</option>
              <option value="renewed">Renewed</option>
              <option value="suspended">Suspended</option>
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Contract Type</FilterLabel>
            <FilterSelect
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="service">Service</option>
              <option value="maintenance">Maintenance</option>
              <option value="supply">Supply</option>
              <option value="consulting">Consulting</option>
              <option value="construction">Construction</option>
              <option value="other">Other</option>
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Risk Level</FilterLabel>
            <FilterSelect
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
            >
              <option value="">All Risk Levels</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Sort By</FilterLabel>
            <FilterSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="endDate">End Date</option>
              <option value="value">Contract Value</option>
              <option value="contractTitle">Contract Title</option>
              <option value="status">Status</option>
            </FilterSelect>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>Start Date From</FilterLabel>
            <FilterInput
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
            />
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>End Date To</FilterLabel>
            <FilterInput
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
            />
          </FilterGroup>
        </FiltersGrid>
      </FiltersContainer>

      <ContractsContainer>
        {loading ? (
          <EmptyState>
            <EmptyStateIcon>
              <FiRefreshCw />
            </EmptyStateIcon>
            <EmptyStateText>Loading Contracts...</EmptyStateText>
            <EmptyStateDescription>Please wait while we fetch the contract data</EmptyStateDescription>
          </EmptyState>
        ) : filteredContracts.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>
              <FiFileText />
            </EmptyStateIcon>
            <EmptyStateText>No Contracts Found</EmptyStateText>
            <EmptyStateDescription>
              No contracts match your current filters. Try adjusting your search criteria or create a new contract.
            </EmptyStateDescription>
          </EmptyState>
        ) : (
          <ContractsGrid>
            {filteredContracts.map((contract) => {
              const daysUntilExpiry = getDaysUntilExpiry(contract.endDate);
              const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;
              const StatusIcon = getStatusIcon(contract.status);
              
              return (
                <ContractCard key={contract.id} onClick={() => handleContractClick(contract)}>
                  <RiskBadge risk={contract.riskLevel}>
                    {contract.riskLevel}
                  </RiskBadge>
                  
                  <ContractHeader>
                    <div>
                      <ContractTitle>{contract.contractTitle}</ContractTitle>
                      <ContractNumber>{contract.contractNumber}</ContractNumber>
                    </div>
                    <StatusBadge status={contract.status}>
                      <StatusIcon size={12} />
                      {contract.status.replace('_', ' ')}
                    </StatusBadge>
                  </ContractHeader>

                  <ContractInfo>
                    <ContractVendor>
                      <FiUser size={14} />
                      {contract.vendorName}
                    </ContractVendor>
                    
                    <ContractValue>
                      <FiDollarSign size={14} />
                      <ContractValueAmount>
                        {formatCurrency(contract.value, contract.currency)}
                      </ContractValueAmount>
                      <span>({contract.paymentTerms})</span>
                    </ContractValue>
                  </ContractInfo>

                  <ContractDates>
                    <span>{formatDate(contract.startDate)} - {formatDate(contract.endDate)}</span>
                    <span>{contract.contractType}</span>
                  </ContractDates>

                  <ContractDescription>
                    {contract.description}
                  </ContractDescription>

                  {isExpiringSoon && (
                    <ExpiryWarning>
                      <FiAlertTriangle size={14} />
                      Expires in {daysUntilExpiry} days
                    </ExpiryWarning>
                  )}

                  <ContractActions>
                    <ActionButton onClick={(e) => handleEditContract(e, contract)}>
                      <FiEdit size={12} />
                      Edit
                    </ActionButton>
                    
                    {contract.status === 'active' && (
                      <ActionButton 
                        variant="primary" 
                        onClick={(e) => handleRenewContract(e, contract)}
                      >
                        <FiRotateCw size={12} />
                        Renew
                      </ActionButton>
                    )}
                    
                    <ActionButton>
                      <FiDownload size={12} />
                      Download
                    </ActionButton>
                    
                    <ActionButton 
                      variant="danger" 
                      onClick={(e) => handleDeleteContract(e, contract.id)}
                    >
                      <FiTrash2 size={12} />
                      Delete
                    </ActionButton>
                  </ContractActions>
                </ContractCard>
              );
            })}
          </ContractsGrid>
        )}
      </ContractsContainer>

      {isModalOpen && (
        <VendorContractModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedContract(null);
          }}
          contract={selectedContract}
          mode={modalMode}
          onSave={(contractData: any) => {
            if (modalMode === 'create') {
              const newContract = {
                ...contractData,
                id: contracts.length + 1,
                contractNumber: `CNT-2024-${(contracts.length + 1).toString().padStart(3, '0')}`,
                createdDate: new Date(),
                lastModified: new Date()
              };
              setContracts([...contracts, newContract]);
              toast.success('Contract created successfully');
            } else if (modalMode === 'edit' && selectedContract) {
              const updatedContracts = contracts.map(c => 
                c.id === selectedContract.id 
                  ? { ...contractData, id: selectedContract.id, lastModified: new Date() }
                  : c
              );
              setContracts(updatedContracts);
              toast.success('Contract updated successfully');
            } else if (modalMode === 'renew' && selectedContract) {
              // Handle renewal logic
              const renewedContract = {
                ...selectedContract,
                status: 'renewed' as const,
                startDate: new Date(selectedContract.endDate),
                endDate: new Date(selectedContract.endDate.getTime() + (selectedContract.renewalPeriod || 12) * 30 * 24 * 60 * 60 * 1000),
                lastModified: new Date()
              };
              const updatedContracts = contracts.map(c => 
                c.id === selectedContract.id ? renewedContract : c
              );
              setContracts(updatedContracts);
              toast.success('Contract renewed successfully');
            }
            setIsModalOpen(false);
            setSelectedContract(null);
          }}
        />
      )}
    </Container>
  );
};

export default VendorContractPage;