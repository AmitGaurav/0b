import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import {
  FiTool,
  FiSearch,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiStar,
  FiDollarSign,
  FiClock,
  FiCalendar,
  FiUsers,
  FiBarChart,
  FiFilter,
  FiGrid,
  FiList,
  FiSettings,
  FiTag,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiTrendingUp
} from 'react-icons/fi';
import VendorServicesModal from './VendorServicesModal';
import { toast } from 'react-toastify';

// Vendor Interface (from VendorManagementPage)
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
  avgResponseTime: number;
  documents: string[];
  emergencyAvailable: boolean;
  contractType: 'hourly' | 'fixed' | 'contract';
  completedJobs: number;
}

// Service Management Interface
interface VendorService {
  id: number;
  vendorId: number;
  vendorName: string;
  serviceName: string;
  category: string;
  description: string;
  pricing: {
    basePrice: number;
    priceType: 'hourly' | 'fixed' | 'per_sqft' | 'per_unit';
    minimumCharge: number;
    additionalCharges?: {
      emergencyFee?: number;
      weekendSurcharge?: number;
      materialCost?: number;
      seasonalSurcharge?: number;
    };
  };
  duration: {
    estimated: number; // in hours
    minimum: number;
    maximum: number;
  };
  availability: {
    status: 'available' | 'busy' | 'unavailable';
    workingDays: string[];
    workingHours: {
      start: string;
      end: string;
    };
    emergencyAvailable: boolean;
  };
  requirements: string[];
  serviceArea: string[];
  rating: number;
  totalBookings: number;
  completedBookings: number;
  activeBookings: number;
  revenue: number;
  images: string[];
  tags: string[];
  createdDate: Date;
  lastUpdated: Date;
  isActive: boolean;
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

const ServicesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ServiceCard = styled.div`
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

const ServiceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const ServiceInfo = styled.div`
  flex: 1;
`;

const ServiceTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing[1]} 0;
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const VendorName = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ServiceMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const Badge = styled.span<{ variant?: 'category' | 'status' | 'price' | 'time' }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 11px;
  font-weight: 500;
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
      case 'time':
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

const ServiceDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.5;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PricingInfo = styled.div`
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[1]};

  &:last-child {
    margin-bottom: 0;
  }
`;

const PriceLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const PriceValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const ServiceStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const StatGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const StatIcon = styled.div<{ color?: string }>`
  color: ${({ color, theme }) => color || theme.colors.gray[500]};
  display: flex;
  align-items: center;
`;

const StatText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const ServiceActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
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
      case 'available':
        return `background: ${theme.colors.success[500]};`;
      case 'busy':
        return `background: ${theme.colors.warning[500]};`;
      case 'unavailable':
        return `background: ${theme.colors.error[500]};`;
      default:
        return `background: ${theme.colors.gray[400]};`;
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

const VendorServicesPage: React.FC = () => {
  const [services, setServices] = useState<VendorService[]>([]);
  const [filteredServices, setFilteredServices] = useState<VendorService[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedService, setSelectedService] = useState<VendorService | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for vendor services
  const mockServices: VendorService[] = [
    {
      id: 1,
      vendorId: 1,
      vendorName: 'QuickFix Plumbers',
      serviceName: 'Emergency Plumbing Repair',
      category: 'plumbing',
      description: 'Fast emergency plumbing repairs including pipe bursts, leaks, and blockages. Available 24/7 with rapid response time.',
      pricing: {
        basePrice: 500,
        priceType: 'hourly',
        minimumCharge: 800,
        additionalCharges: {
          emergencyFee: 200,
          weekendSurcharge: 150,
          materialCost: 0
        }
      },
      duration: {
        estimated: 2,
        minimum: 1,
        maximum: 4
      },
      availability: {
        status: 'available',
        workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        workingHours: {
          start: '00:00',
          end: '23:59'
        },
        emergencyAvailable: true
      },
      requirements: ['Water supply access', 'Electrical safety'],
      serviceArea: ['Bangalore', 'Whitefield', 'Electronic City'],
      rating: 4.8,
      totalBookings: 156,
      completedBookings: 142,
      activeBookings: 3,
      revenue: 85600,
      images: ['plumbing1.jpg', 'plumbing2.jpg'],
      tags: ['emergency', '24/7', 'licensed'],
      createdDate: new Date('2024-01-15'),
      lastUpdated: new Date(),
      isActive: true
    },
    {
      id: 2,
      vendorId: 2,
      vendorName: 'PowerTech Electricians',
      serviceName: 'Home Electrical Installation',
      category: 'electrical',
      description: 'Complete electrical installation services for new homes and renovations. Includes wiring, switches, outlets, and panel upgrades.',
      pricing: {
        basePrice: 150,
        priceType: 'per_sqft',
        minimumCharge: 5000,
        additionalCharges: {
          materialCost: 0,
          weekendSurcharge: 500
        }
      },
      duration: {
        estimated: 8,
        minimum: 4,
        maximum: 16
      },
      availability: {
        status: 'busy',
        workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        workingHours: {
          start: '09:00',
          end: '18:00'
        },
        emergencyAvailable: false
      },
      requirements: ['Electrical clearance', 'Site access', 'Power shutdown coordination'],
      serviceArea: ['Bangalore', 'HSR Layout', 'Koramangala'],
      rating: 4.6,
      totalBookings: 89,
      completedBookings: 85,
      activeBookings: 2,
      revenue: 125400,
      images: ['electrical1.jpg'],
      tags: ['certified', 'licensed', 'warranty'],
      createdDate: new Date('2024-02-01'),
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      isActive: true
    },
    {
      id: 3,
      vendorId: 3,
      vendorName: 'EcoClean Solutions',
      serviceName: 'Deep House Cleaning',
      category: 'cleaning',
      description: 'Comprehensive deep cleaning service for homes and apartments. Includes all rooms, bathrooms, kitchen, and balconies with eco-friendly products.',
      pricing: {
        basePrice: 25,
        priceType: 'per_sqft',
        minimumCharge: 2500,
        additionalCharges: {
          weekendSurcharge: 300
        }
      },
      duration: {
        estimated: 6,
        minimum: 3,
        maximum: 8
      },
      availability: {
        status: 'available',
        workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        workingHours: {
          start: '08:00',
          end: '19:00'
        },
        emergencyAvailable: false
      },
      requirements: ['Home access', 'Water supply', 'Storage space for belongings'],
      serviceArea: ['Bangalore', 'Indiranagar', 'Marathahalli'],
      rating: 4.9,
      totalBookings: 234,
      completedBookings: 228,
      activeBookings: 4,
      revenue: 156800,
      images: ['cleaning1.jpg', 'cleaning2.jpg', 'cleaning3.jpg'],
      tags: ['eco-friendly', 'insured', 'background-verified'],
      createdDate: new Date('2023-12-10'),
      lastUpdated: new Date(),
      isActive: true
    },
    {
      id: 4,
      vendorId: 4,
      vendorName: 'SecureGuard Agency',
      serviceName: 'Security Guard Services',
      category: 'security',
      description: 'Professional security guard services for residential complexes. Trained personnel with background verification and 24/7 monitoring.',
      pricing: {
        basePrice: 20000,
        priceType: 'fixed',
        minimumCharge: 20000,
        additionalCharges: {
          weekendSurcharge: 2000,
          emergencyFee: 1000
        }
      },
      duration: {
        estimated: 720, // 30 days
        minimum: 240,   // 10 days
        maximum: 2160   // 90 days
      },
      availability: {
        status: 'available',
        workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        workingHours: {
          start: '00:00',
          end: '23:59'
        },
        emergencyAvailable: true
      },
      requirements: ['Security cabin/post', 'CCTV access', 'Communication systems'],
      serviceArea: ['Bangalore', 'Whitefield', 'Electronic City', 'Hebbal'],
      rating: 4.7,
      totalBookings: 45,
      completedBookings: 42,
      activeBookings: 2,
      revenue: 890000,
      images: ['security1.jpg'],
      tags: ['verified', '24/7', 'trained-personnel'],
      createdDate: new Date('2024-03-01'),
      lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      isActive: true
    },
    {
      id: 5,
      vendorId: 5,
      vendorName: 'GreenThumb Gardening',
      serviceName: 'Landscape Maintenance',
      category: 'gardening',
      description: 'Complete landscape maintenance including lawn care, plant maintenance, garden design, and seasonal plantation services.',
      pricing: {
        basePrice: 15,
        priceType: 'per_sqft',
        minimumCharge: 3000,
        additionalCharges: {
          materialCost: 0,
          seasonalSurcharge: 500
        }
      },
      duration: {
        estimated: 4,
        minimum: 2,
        maximum: 8
      },
      availability: {
        status: 'unavailable',
        workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        workingHours: {
          start: '06:00',
          end: '16:00'
        },
        emergencyAvailable: false
      },
      requirements: ['Garden access', 'Water supply', 'Tool storage space'],
      serviceArea: ['Bangalore', 'Koramangala', 'Jayanagar'],
      rating: 4.5,
      totalBookings: 67,
      completedBookings: 63,
      activeBookings: 0,
      revenue: 98500,
      images: ['gardening1.jpg', 'gardening2.jpg'],
      tags: ['organic', 'licensed', 'plant-warranty'],
      createdDate: new Date('2024-01-20'),
      lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      isActive: false
    }
  ];

  // Mock vendors data (only verified vendors for service creation)
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
      id: 5,
      name: 'GreenThumb Gardening',
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
      emergencyAvailable: true,
      contractType: 'contract'
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setServices(mockServices);
      setFilteredServices(mockServices);
      setVendors(mockVendors);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = services.filter(service => {
      const matchesSearch = service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || service.availability.status === selectedStatus;
      
      const matchesPriceRange = selectedPriceRange === 'all' || 
        (selectedPriceRange === 'budget' && service.pricing.basePrice < 1000) ||
        (selectedPriceRange === 'mid-range' && service.pricing.basePrice >= 1000 && service.pricing.basePrice < 5000) ||
        (selectedPriceRange === 'premium' && service.pricing.basePrice >= 5000);

      return matchesSearch && matchesCategory && matchesStatus && matchesPriceRange && service.isActive;
    });

    // Sort logic
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.serviceName.localeCompare(b.serviceName);
        case 'vendor':
          return a.vendorName.localeCompare(b.vendorName);
        case 'rating':
          return b.rating - a.rating;
        case 'bookings':
          return b.totalBookings - a.totalBookings;
        case 'price':
          return a.pricing.basePrice - b.pricing.basePrice;
        case 'created':
          return b.createdDate.getTime() - a.createdDate.getTime();
        default:
          return 0;
      }
    });

    setFilteredServices(filtered);
  }, [services, searchTerm, selectedCategory, selectedStatus, selectedPriceRange, sortBy]);

  const handleAddService = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleEditService = (service: VendorService) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDeleteService = (serviceId: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== serviceId));
      toast.success('Service deleted successfully');
    }
  };

  const handleServiceSubmit = (serviceData: Partial<VendorService>) => {
    if (selectedService) {
      // Edit existing service
      const updatedServices = services.map(service =>
        service.id === selectedService.id
          ? { ...service, ...serviceData, lastUpdated: new Date() }
          : service
      );
      setServices(updatedServices);
      toast.success('Service updated successfully');
    } else {
      // Add new service
      const newService: VendorService = {
        id: Date.now(),
        createdDate: new Date(),
        lastUpdated: new Date(),
        totalBookings: 0,
        completedBookings: 0,
        activeBookings: 0,
        revenue: 0,
        rating: 0,
        isActive: true,
        images: [],
        tags: [],
        requirements: [],
        serviceArea: [],
        ...serviceData
      } as VendorService;
      
      setServices([...services, newService]);
      toast.success('Service added successfully');
    }
    setIsModalOpen(false);
  };

  const stats = useMemo(() => {
    const totalServices = services.filter(s => s.isActive).length;
    const totalBookings = services.reduce((sum, s) => sum + s.totalBookings, 0);
    const totalRevenue = services.reduce((sum, s) => sum + s.revenue, 0);
    const avgRating = services.length > 0 
      ? services.reduce((sum, s) => sum + s.rating, 0) / services.length 
      : 0;

    return { totalServices, totalBookings, totalRevenue, avgRating };
  }, [services]);

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <FiStar key={i} size={14} fill={i < Math.floor(rating) ? 'currentColor' : 'none'} />
    ));
  };

  if (isLoading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <div style={{ fontSize: '1.5rem', color: '#666' }}>Loading vendor services...</div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <FiTool size={32} />
          Vendor Services
        </Title>
        <HeaderActions>
          <Button onClick={handleAddService} variant="primary">
            <FiPlus size={18} />
            Add Service
          </Button>
        </HeaderActions>
      </Header>

      <FilterSection>
        <FilterRow>
          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search services, vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="plumbing">Plumbing</option>
            <option value="electrical">Electrical</option>
            <option value="cleaning">Cleaning</option>
            <option value="security">Security</option>
            <option value="gardening">Gardening</option>
            <option value="carpentry">Carpentry</option>
            <option value="painting">Painting</option>
          </Select>

          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="unavailable">Unavailable</option>
          </Select>

          <Select
            value={selectedPriceRange}
            onChange={(e) => setSelectedPriceRange(e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="budget">Budget (&lt; ₹1000)</option>
            <option value="mid-range">Mid-range (₹1000-₹5000)</option>
            <option value="premium">Premium (&gt; ₹5000)</option>
          </Select>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="vendor">Sort by Vendor</option>
            <option value="rating">Sort by Rating</option>
            <option value="bookings">Sort by Bookings</option>
            <option value="price">Sort by Price</option>
            <option value="created">Sort by Date</option>
          </Select>
        </FilterRow>

        <StatsRow>
          <StatsGroup>
            <StatItem>
              <StatValue>{stats.totalServices}</StatValue>
              <StatLabel>Total Services</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.totalBookings}</StatValue>
              <StatLabel>Total Bookings</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>₹{(stats.totalRevenue / 1000).toFixed(0)}K</StatValue>
              <StatLabel>Revenue</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{stats.avgRating.toFixed(1)}</StatValue>
              <StatLabel>Avg Rating</StatLabel>
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

      {filteredServices.length === 0 ? (
        <EmptyState>
          <FiTool size={48} />
          <h3>No services found</h3>
          <p>Try adjusting your search criteria or add a new service.</p>
        </EmptyState>
      ) : (
        <ServicesContainer>
          {filteredServices.map((service) => (
            <ServiceCard key={service.id}>
              <StatusIndicator status={service.availability.status} />
              
              <ServiceHeader>
                <ServiceInfo>
                  <ServiceTitle>{service.serviceName}</ServiceTitle>
                  <VendorName>{service.vendorName}</VendorName>
                  <ServiceMeta>
                    <Badge variant="category">{service.category}</Badge>
                    <Badge variant="status">{service.availability.status}</Badge>
                    <Badge variant="time">{service.duration.estimated}h</Badge>
                    <Badge variant="price">₹{service.pricing.basePrice}/{service.pricing.priceType}</Badge>
                  </ServiceMeta>
                </ServiceInfo>
              </ServiceHeader>

              <ServiceDescription>{service.description}</ServiceDescription>

              <PricingInfo>
                <PriceRow>
                  <PriceLabel>Base Price:</PriceLabel>
                  <PriceValue>₹{service.pricing.basePrice}/{service.pricing.priceType}</PriceValue>
                </PriceRow>
                <PriceRow>
                  <PriceLabel>Minimum Charge:</PriceLabel>
                  <PriceValue>₹{service.pricing.minimumCharge}</PriceValue>
                </PriceRow>
                {service.pricing.additionalCharges?.emergencyFee && (
                  <PriceRow>
                    <PriceLabel>Emergency Fee:</PriceLabel>
                    <PriceValue>₹{service.pricing.additionalCharges.emergencyFee}</PriceValue>
                  </PriceRow>
                )}
              </PricingInfo>

              <ServiceStats>
                <StatGroup>
                  <StatIcon color="#f59e0b">
                    {renderStars(service.rating)}
                  </StatIcon>
                  <StatText>{service.rating}</StatText>
                </StatGroup>
                <StatGroup>
                  <StatIcon>
                    <FiUsers size={16} />
                  </StatIcon>
                  <StatText>{service.totalBookings} bookings</StatText>
                </StatGroup>
                <StatGroup>
                  <StatIcon color="#10b981">
                    <FiTrendingUp size={16} />
                  </StatIcon>
                  <StatText>₹{(service.revenue / 1000).toFixed(0)}K</StatText>
                </StatGroup>
              </ServiceStats>

              <ServiceActions>
                <ActionButton onClick={() => handleEditService(service)}>
                  <FiEdit size={14} />
                  Edit
                </ActionButton>
                <ActionButton>
                  <FiEye size={14} />
                  View
                </ActionButton>
                <ActionButton
                  variant="danger"
                  onClick={() => handleDeleteService(service.id)}
                >
                  <FiTrash2 size={14} />
                </ActionButton>
              </ServiceActions>
            </ServiceCard>
          ))}
        </ServicesContainer>
      )}

      {isModalOpen && (
        <VendorServicesModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          service={selectedService}
          onSubmit={handleServiceSubmit}
          vendors={vendors}
        />
      )}
    </Container>
  );
};

export default VendorServicesPage;