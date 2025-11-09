import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import {
  FiTruck,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiPhone,
  FiMail,
  FiStar,
  FiSearch,
  FiFilter,
  FiMoreHorizontal,
  FiDownload,
  FiUpload,
  FiEye,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiCheck,
  FiX,
  FiAlertTriangle,
  FiGrid,
  FiList,
  FiPause,
  FiPlay
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import AddVendorForm from './AddVendorForm';
import EditVendorForm from './EditVendorForm';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import VendorViewModal from './VendorViewModal';
import VendorContactModal from './VendorContactModal';
import VendorSendMessageModal from './VendorSendMessageModal';

// Enhanced Vendor Interface
interface Vendor {
  id: number;
  name: string;
  category: string;
  phone: string;
  email: string;
  rating: number;
  totalJobs: number;
  societyId: number;
  societyName: string;
  address: string;
  website?: string;
  description: string;
  specialties: string[];
  priceRange: 'budget' | 'mid-range' | 'premium';
  availability: 'available' | 'busy' | 'unavailable';
  verificationStatus: 'verified' | 'pending' | 'rejected';
  joinedDate: Date;
  lastActivity: Date;
  completedJobs: number;
  avgResponseTime: number; // in hours
  documents: string[];
  emergencyAvailable: boolean;
  contractType: 'hourly' | 'fixed' | 'contract';
}

interface VendorManagementPageProps {}

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

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
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
            transform: translateY(-1px);
            box-shadow: ${theme.boxShadow.md};
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
            border-color: ${theme.colors.primary[300]};
            color: ${theme.colors.primary[600]};
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
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ViewToggle = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[1]};
`;

const ViewButton = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing[2]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme, active }) => active ? theme.colors.white : 'transparent'};
  color: ${({ theme, active }) => active ? theme.colors.primary[600] : theme.colors.gray[500]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  box-shadow: ${({ theme, active }) => active ? theme.boxShadow.sm : 'none'};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const ContentArea = styled.div<{ view: 'grid' | 'list' }>`
  ${({ view }) => view === 'grid' ? `
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 24px;
  ` : `
    display: flex;
    flex-direction: column;
    gap: 12px;
  `}
`;

const VendorCard = styled.div<{ view: 'grid' | 'list' }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: ${({ theme }) => theme.transition.all};
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.boxShadow.lg};
    border-color: ${({ theme }) => theme.colors.primary[200]};
  }

  ${({ view }) => view === 'grid' ? `
    padding: 24px;
    display: flex;
    flex-direction: column;
  ` : `
    padding: 20px 24px;
    display: flex;
    align-items: center;
    gap: 24px;
  `}
`;

const VendorHeader = styled.div<{ view: 'grid' | 'list' }>`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${({ theme, view }) => view === 'grid' ? theme.spacing[4] : '0'};
  
  ${({ view }) => view === 'list' && `
    flex: 1;
    margin-bottom: 0;
  `}
`;

const VendorInfo = styled.div`
  flex: 1;
`;

const VendorName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const VendorMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  flex-wrap: wrap;
`;

const Badge = styled.span<{ variant?: 'category' | 'status' | 'price' }>`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;

  ${({ variant = 'category', theme }) => {
    switch (variant) {
      case 'status':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
        `;
      case 'price':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
        `;
      default:
        return `
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[700]};
        `;
    }
  }}
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.warning[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const VendorDetails = styled.div<{ view: 'grid' | 'list' }>`
  ${({ view }) => view === 'grid' ? `
    margin-bottom: 20px;
  ` : `
    display: flex;
    gap: 40px;
    align-items: center;
    flex: 2;
  `}
`;

const ContactInfo = styled.div<{ view: 'grid' | 'list' }>`
  ${({ view }) => view === 'list' && `
    display: flex;
    gap: 24px;
  `}
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  &:last-child {
    margin-bottom: 0;
  }
`;

const VendorStats = styled.div<{ view: 'grid' | 'list' }>`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]} 0;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[100]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  margin: ${({ theme, view }) => view === 'grid' ? `${theme.spacing[4]} 0` : '0'};
  
  ${({ view }) => view === 'list' && `
    flex-direction: column;
    gap: 8px;
    border: none;
    margin: 0;
  `}
`;

const StatGroup = styled.div<{ view?: 'grid' | 'list' }>`
  text-align: center;
  
  ${({ view }) => view === 'list' && `
    text-align: left;
    display: flex;
    align-items: center;
    gap: 8px;
  `}
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const StatText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ActionButtons = styled.div<{ view: 'grid' | 'list' }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  
  ${({ view }) => view === 'grid' ? `
    margin-top: auto;
  ` : `
    flex-shrink: 0;
  `}
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' | 'warning'; view?: 'grid' | 'list' }>`
  ${({ view }) => view === 'grid' ? 'flex: 1;' : ''}
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
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
      case 'warning':
        return `
          background: ${theme.colors.warning[600]};
          color: ${theme.colors.white};
          border-color: ${theme.colors.warning[600]};
          
          &:hover {
            background: ${theme.colors.warning[700]};
            border-color: ${theme.colors.warning[700]};
          }
        `;
      default:
        return `
          background: ${theme.colors.white};
          color: ${theme.colors.gray[700]};
          border-color: ${theme.colors.gray[300]};
          
          &:hover {
            border-color: ${theme.colors.primary[300]};
            color: ${theme.colors.primary[600]};
          }
        `;
    }
  }}
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

const LoadingCard = styled.div`
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  height: 300px;
  animation: pulse 1.5s ease-in-out infinite alternate;
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    100% { opacity: 1; }
  }
`;

const VendorManagementPage: React.FC<VendorManagementPageProps> = () => {
  const { user } = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showSendMessageModal, setShowSendMessageModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [deletingVendor, setDeletingVendor] = useState<Vendor | null>(null);
  const [viewingVendor, setViewingVendor] = useState<Vendor | null>(null);
  const [contactingVendor, setContactingVendor] = useState<Vendor | null>(null);
  const [messagingVendor, setMessagingVendor] = useState<Vendor | null>(null);
  const [selectedVendors, setSelectedVendors] = useState<number[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const categories = [
    'all', 'plumbing', 'electrical', 'cleaning', 'security', 'gardening', 
    'carpentry', 'painting', 'pest-control', 'appliance-repair'
  ];

  const statusOptions = [
    'all', 'verified', 'pending', 'rejected'
  ];

  const availabilityOptions = [
    'all', 'available', 'busy', 'unavailable'
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'rating', label: 'Rating' },
    { value: 'totalJobs', label: 'Total Jobs' },
    { value: 'joinedDate', label: 'Join Date' }
  ];

  // Mock data generation
  useEffect(() => {
    const mockVendors: Vendor[] = [
      {
        id: 1,
        name: 'QuickFix Plumbers',
        category: 'plumbing',
        phone: '+91 9876543210',
        email: 'contact@quickfix.com',
        rating: 4.8,
        totalJobs: 156,
        completedJobs: 142,
        societyId: 1,
        societyName: 'SNN Raj Serenity',
        address: '123 Main St, Bangalore',
        website: 'www.quickfix.com',
        description: 'Professional plumbing services with 24/7 emergency support',
        specialties: ['Emergency Repairs', 'Pipe Installation', 'Water Heater Service'],
        priceRange: 'mid-range',
        availability: 'available',
        verificationStatus: 'verified',
        joinedDate: new Date('2023-01-15'),
        lastActivity: new Date(),
        avgResponseTime: 2,
        documents: ['license.pdf', 'insurance.pdf'],
        emergencyAvailable: true,
        contractType: 'hourly'
      },
      {
        id: 2,
        name: 'PowerUp Electricians',
        category: 'electrical',
        phone: '+91 9876543211',
        email: 'info@powerup.com',
        rating: 4.6,
        totalJobs: 89,
        completedJobs: 83,
        societyId: 1,
        societyName: 'SNN Raj Serenity',
        address: '456 Electric Ave, Bangalore',
        description: 'Certified electrical contractors for residential and commercial projects',
        specialties: ['Wiring', 'Panel Upgrades', 'Smart Home Installation'],
        priceRange: 'premium',
        availability: 'busy',
        verificationStatus: 'verified',
        joinedDate: new Date('2023-03-20'),
        lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
        avgResponseTime: 4,
        documents: ['certification.pdf'],
        emergencyAvailable: false,
        contractType: 'fixed'
      },
      {
        id: 3,
        name: 'CleanPro Services',
        category: 'cleaning',
        phone: '+91 9876543212',
        email: 'hello@cleanpro.com',
        rating: 4.9,
        totalJobs: 234,
        completedJobs: 229,
        societyId: 2,
        societyName: 'Brigade Meadows',
        address: '789 Clean Street, Bangalore',
        description: 'Eco-friendly cleaning services for homes and offices',
        specialties: ['Deep Cleaning', 'Sanitization', 'Carpet Cleaning'],
        priceRange: 'budget',
        availability: 'available',
        verificationStatus: 'verified',
        joinedDate: new Date('2022-11-10'),
        lastActivity: new Date(),
        avgResponseTime: 1,
        documents: ['registration.pdf', 'eco-cert.pdf'],
        emergencyAvailable: true,
        contractType: 'contract'
      },
      {
        id: 4,
        name: 'SecureGuard Agency',
        category: 'security',
        phone: '+91 9876543213',
        email: 'contact@secureguard.com',
        rating: 4.7,
        totalJobs: 78,
        completedJobs: 75,
        societyId: 1,
        societyName: 'SNN Raj Serenity',
        address: '321 Safety Blvd, Bangalore',
        description: 'Professional security services with trained personnel',
        specialties: ['CCTV Installation', 'Security Guards', 'Access Control'],
        priceRange: 'mid-range',
        availability: 'available',
        verificationStatus: 'pending',
        joinedDate: new Date('2023-05-01'),
        lastActivity: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        avgResponseTime: 6,
        documents: ['license.pdf'],
        emergencyAvailable: true,
        contractType: 'contract'
      },
      {
        id: 5,
        name: 'GreenThumb Gardeners',
        category: 'gardening',
        phone: '+91 9876543214',
        email: 'info@greenthumb.com',
        rating: 4.5,
        totalJobs: 67,
        completedJobs: 62,
        societyId: 1,
        societyName: 'SNN Raj Serenity',
        address: '555 Garden Lane, Bangalore',
        description: 'Landscaping and garden maintenance specialists',
        specialties: ['Landscaping', 'Tree Trimming', 'Pest Control'],
        priceRange: 'mid-range',
        availability: 'unavailable',
        verificationStatus: 'verified',
        joinedDate: new Date('2023-02-28'),
        lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        avgResponseTime: 12,
        documents: ['certification.pdf'],
        emergencyAvailable: false,
        contractType: 'hourly'
      }
    ];

    setTimeout(() => {
      setVendors(mockVendors);
      setLoading(false);
    }, 1000);
  }, []);

  // Filtered and sorted vendors
  const filteredVendors = useMemo(() => {
    let filtered = vendors.filter(vendor => {
      const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || vendor.verificationStatus === statusFilter;
      const matchesAvailability = availabilityFilter === 'all' || vendor.availability === availabilityFilter;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesAvailability;
    });

    // Sort vendors
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'totalJobs':
          return b.totalJobs - a.totalJobs;
        case 'joinedDate':
          return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [vendors, searchQuery, categoryFilter, statusFilter, availabilityFilter, sortBy]);

  const stats = useMemo(() => ({
    total: vendors.length,
    verified: vendors.filter(v => v.verificationStatus === 'verified').length,
    available: vendors.filter(v => v.availability === 'available').length,
    onHold: vendors.filter(v => v.availability === 'unavailable').length,
    avgRating: vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length || 0
  }), [vendors]);

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setShowEditForm(true);
  };

  const handleDeleteVendor = (vendorId: number) => {
    const vendor = vendors.find(v => v.id === vendorId);
    if (vendor) {
      setDeletingVendor(vendor);
      setShowDeleteModal(true);
    }
  };

  const handleViewVendor = (vendor: Vendor) => {
    setViewingVendor(vendor);
    setShowViewModal(true);
  };

  const handleContactVendor = (vendor: Vendor) => {
    setContactingVendor(vendor);
    setShowContactModal(true);
  };

  const handleHoldVendor = async (vendor: Vendor) => {
    try {
      const isCurrentlyOnHold = vendor.availability === 'unavailable';
      const newAvailability = isCurrentlyOnHold ? 'available' : 'unavailable';
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setVendors(prev => prev.map(v => 
        v.id === vendor.id 
          ? { ...v, availability: newAvailability }
          : v
      ));
      
      toast.success(
        isCurrentlyOnHold 
          ? `Vendor "${vendor.name}" has been reactivated`
          : `Vendor "${vendor.name}" has been put on hold`
      );
    } catch (error) {
      toast.error('Failed to update vendor status. Please try again.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingVendor) return;
    
    setIsDeleting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVendors(prev => prev.filter(v => v.id !== deletingVendor.id));
      toast.success(`Vendor "${deletingVendor.name}" deleted successfully`);
      
      setShowDeleteModal(false);
      setDeletingVendor(null);
    } catch (error) {
      toast.error('Failed to delete vendor. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
      setDeletingVendor(null);
    }
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingVendor(null);
  };

  const handleCloseContactModal = () => {
    setShowContactModal(false);
    setContactingVendor(null);
  };

  const handleSendMessageVendor = (vendor: Vendor) => {
    setMessagingVendor(vendor);
    setShowSendMessageModal(true);
  };

  const handleCloseSendMessageModal = () => {
    setShowSendMessageModal(false);
    setMessagingVendor(null);
  };

  const handleAddVendor = async (vendorData: Omit<Vendor, 'id' | 'rating' | 'totalJobs' | 'completedJobs' | 'joinedDate' | 'lastActivity'>) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: Math.max(...vendors.map(v => v.id), 0) + 1,
      rating: 0,
      totalJobs: 0,
      completedJobs: 0,
      joinedDate: new Date(),
      lastActivity: new Date()
    };
    
    setVendors(prev => [...prev, newVendor]);
  };

  const handleUpdateVendor = async (updatedVendor: Vendor) => {
    setVendors(prev => prev.map(v => v.id === updatedVendor.id ? updatedVendor : v));
    setEditingVendor(null);
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <FiStar key={i} size={12} fill={i < Math.floor(rating) ? 'currentColor' : 'none'} />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'success';
      case 'pending': return 'price';
      default: return 'category';
    }
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>
            <FiTruck size={32} />
            Vendor Management
          </Title>
        </Header>
        
        <ContentArea view={viewMode}>
          {Array(6).fill(0).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </ContentArea>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <FiTruck size={32} />
          Vendor Management
        </Title>
        <HeaderActions>
          <Button variant="secondary">
            <FiDownload size={16} />
            Export
          </Button>
          <Button variant="secondary">
            <FiUpload size={16} />
            Import
          </Button>
          <Button variant="primary" onClick={() => setShowAddForm(true)}>
            <FiPlus size={16} />
            Add Vendor
          </Button>
        </HeaderActions>
      </Header>

      <FilterSection>
        <FilterRow>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>

          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : 
                 category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
              </option>
            ))}
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : 
                 status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </Select>

          <Select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            {availabilityOptions.map(availability => (
              <option key={availability} value={availability}>
                {availability === 'all' ? 'All Availability' : 
                 availability === 'unavailable' ? 'On Hold' :
                 availability.charAt(0).toUpperCase() + availability.slice(1)}
              </option>
            ))}
          </Select>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                Sort by {option.label}
              </option>
            ))}
          </Select>
        </FilterRow>

        <StatsRow>
          <StatsGroup>
            <StatItem>
              <StatValue>{stats.total}</StatValue>
              <StatLabel>Total</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.verified}</StatValue>
              <StatLabel>Verified</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.available}</StatValue>
              <StatLabel>Available</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.onHold}</StatValue>
              <StatLabel>On Hold</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.avgRating.toFixed(1)}</StatValue>
              <StatLabel>Avg Rating</StatLabel>
            </StatItem>
          </StatsGroup>

          <ViewToggle>
            <ViewButton 
              active={viewMode === 'grid'} 
              onClick={() => setViewMode('grid')}
            >
              <FiGrid size={16} />
            </ViewButton>
            <ViewButton 
              active={viewMode === 'list'} 
              onClick={() => setViewMode('list')}
            >
              <FiList size={16} />
            </ViewButton>
          </ViewToggle>
        </StatsRow>
      </FilterSection>

      {filteredVendors.length === 0 ? (
        <EmptyState>
          <FiTruck size={64} />
          <h3>No vendors found</h3>
          <p>
            {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' || availabilityFilter !== 'all'
              ? 'Try adjusting your search criteria or filters.'
              : 'Get started by adding your first vendor.'}
          </p>
          {(!searchQuery && categoryFilter === 'all' && statusFilter === 'all' && availabilityFilter === 'all') && (
            <Button 
              variant="primary" 
              onClick={() => setShowAddForm(true)}
              style={{ marginTop: '16px' }}
            >
              <FiPlus size={16} />
              Add First Vendor
            </Button>
          )}
        </EmptyState>
      ) : (
        <ContentArea view={viewMode}>
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id} view={viewMode}>
              <VendorHeader view={viewMode}>
                <VendorInfo>
                  <VendorName>{vendor.name}</VendorName>
                  <VendorMeta>
                    <Badge variant="category">{vendor.category}</Badge>
                    <Badge variant="status" style={{ 
                      background: getStatusColor(vendor.verificationStatus) === 'success' ? '#dcfce7' : 
                                 getStatusColor(vendor.verificationStatus) === 'price' ? '#fef3c7' : '#fee2e2',
                      color: getStatusColor(vendor.verificationStatus) === 'success' ? '#16a34a' :
                             getStatusColor(vendor.verificationStatus) === 'price' ? '#d97706' : '#dc2626'
                    }}>
                      {vendor.verificationStatus}
                    </Badge>
                    {vendor.availability === 'unavailable' && (
                      <Badge style={{ 
                        background: '#fef3c7',
                        color: '#d97706'
                      }}>
                        On Hold
                      </Badge>
                    )}
                    <Badge variant="price">{vendor.priceRange}</Badge>
                  </VendorMeta>
                  <Rating>
                    {renderStars(vendor.rating)}
                    <span>{vendor.rating}</span>
                    <span>({vendor.totalJobs} jobs)</span>
                  </Rating>
                </VendorInfo>
              </VendorHeader>

              <VendorDetails view={viewMode}>
                <ContactInfo view={viewMode}>
                  <ContactItem>
                    <FiPhone size={14} />
                    {vendor.phone}
                  </ContactItem>
                  <ContactItem>
                    <FiMail size={14} />
                    {vendor.email}
                  </ContactItem>
                  <ContactItem>
                    <FiMapPin size={14} />
                    {vendor.address}
                  </ContactItem>
                </ContactInfo>

                {viewMode === 'list' && (
                  <VendorStats view={viewMode}>
                    <StatGroup view={viewMode}>
                      <StatNumber>{vendor.completedJobs}</StatNumber>
                      <StatText>Completed</StatText>
                    </StatGroup>
                    <StatGroup view={viewMode}>
                      <StatNumber>{vendor.avgResponseTime}h</StatNumber>
                      <StatText>Response</StatText>
                    </StatGroup>
                  </VendorStats>
                )}
              </VendorDetails>

              {viewMode === 'grid' && (
                <VendorStats view={viewMode}>
                  <StatGroup>
                    <StatNumber>{vendor.completedJobs}</StatNumber>
                    <StatText>Completed</StatText>
                  </StatGroup>
                  <StatGroup>
                    <StatNumber>{vendor.avgResponseTime}h</StatNumber>
                    <StatText>Response</StatText>
                  </StatGroup>
                  <StatGroup>
                    <StatNumber>{vendor.emergencyAvailable ? 'Yes' : 'No'}</StatNumber>
                    <StatText>Emergency</StatText>
                  </StatGroup>
                </VendorStats>
              )}

              <ActionButtons view={viewMode}>
                <ActionButton view={viewMode} onClick={() => handleViewVendor(vendor)}>
                  <FiEye size={14} />
                  View
                </ActionButton>
                <ActionButton view={viewMode} onClick={() => handleContactVendor(vendor)}>
                  <FiPhone size={14} />
                  Contact
                </ActionButton>
                <ActionButton 
                  view={viewMode} 
                  variant={vendor.availability === 'unavailable' ? 'primary' : 'warning'}
                  onClick={() => handleHoldVendor(vendor)}
                >
                  {vendor.availability === 'unavailable' ? (
                    <>
                      <FiPlay size={14} />
                      Activate
                    </>
                  ) : (
                    <>
                      <FiPause size={14} />
                      Hold
                    </>
                  )}
                </ActionButton>
                <ActionButton view={viewMode} onClick={() => handleEditVendor(vendor)}>
                  <FiEdit size={14} />
                  Edit
                </ActionButton>
                <ActionButton view={viewMode} variant="danger" onClick={() => handleDeleteVendor(vendor.id)}>
                  <FiTrash2 size={14} />
                  Delete
                </ActionButton>
              </ActionButtons>
            </VendorCard>
          ))}
        </ContentArea>
      )}

      <AddVendorForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSubmit={handleAddVendor}
      />

      <EditVendorForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        onSubmit={handleUpdateVendor}
        vendor={editingVendor}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        vendorName={deletingVendor?.name || ''}
        isDeleting={isDeleting}
      />

      <VendorViewModal
        isOpen={showViewModal}
        onClose={handleCloseViewModal}
        vendor={viewingVendor}
      />

      <VendorContactModal
        isOpen={showContactModal}
        onClose={handleCloseContactModal}
        vendor={contactingVendor}
      />
    </Container>
  );
};

export default VendorManagementPage;