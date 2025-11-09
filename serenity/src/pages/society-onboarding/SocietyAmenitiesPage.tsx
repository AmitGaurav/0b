import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import {
  FaCog,
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
  FaUpload,
  FaCheck,
  FaTimes,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCalendarAlt,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaBell,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaBars,
  FaExpand,
  FaCompress,
  FaStar,
  FaImages,
  FaMoneyBillWave,
  FaTools,
  FaClipboardList,
  FaChartLine,
  FaBookmark
} from 'react-icons/fa';
import {
  SocietyAmenity,
  AmenitySearchFilters,
  AmenitySortOptions,
  AmenitySortField,
  SortDirection,
  AmenityBulkAction,
  AmenityBulkActionType,
  AmenityExportOptions,
  AmenityPaginationOptions,
  AmenityFormData,
  AmenityNotification,
  AmenityStats,
  AvailabilityStatus,
  BookingStatus,
  AmenityCategory,
  ExportFormat
} from '../../types/society-amenities';
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
  TableContainer as LayoutTableContainer,
  Table as LayoutTable,
  FormInput,
  Badge
} from '../../components/common/PageLayout';
import AddAmenityModal from '../../components/modals/AddAmenityModalSimple';

// Styled Components matching Society Members design
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
    
    svg {
      color: ${({ theme }) => theme.colors.primary[600]};
    }
  }
  
  p {
    color: ${({ theme }) => theme.colors.gray[600]};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    max-width: 600px;
    margin: 0 auto;
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const SearchAndFilters = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  flex: 1;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    align-items: center;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  
  input {
    padding-left: ${({ theme }) => theme.spacing[10]};
    background: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    transition: ${({ theme }) => theme.transition.all};
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary[500]};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    }
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.gray[400]};
    }
  }
  
  svg {
    position: absolute;
    left: ${({ theme }) => theme.spacing[3]};
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.gray[400]};
    width: 16px;
    height: 16px;
  }
`;

const FilterButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme, active }) => active ? theme.colors.primary[500] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme, active }) => active ? theme.colors.primary[50] : theme.colors.white};
  color: ${({ theme, active }) => active ? theme.colors.primary[700] : theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 100%;
    justify-content: stretch;
    
    button {
      flex: 1;
      min-width: 0;
    }
  }
`;

const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[600]}, ${({ theme }) => theme.colors.primary[700]});
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[700]}, ${({ theme }) => theme.colors.primary[800]});
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const SecondaryButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[700]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.primary[50]};
    color: ${({ theme }) => theme.colors.primary[700]};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const BulkActionsBar = styled.div<{ show: boolean }>`
  display: ${({ show }) => show ? 'flex' : 'none'};
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const BulkActionsLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  
  span {
    color: ${({ theme }) => theme.colors.primary[700]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

const BulkActionsRight = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const BulkActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[700]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const TableContainer = styled(LayoutTableContainer)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled(LayoutTable)`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: ${({ theme }) => theme.colors.gray[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const TableHeaderRow = styled.tr``;

const TableHeaderCell = styled.th<{ sortable?: boolean }>`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  text-align: left;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: ${({ sortable }) => sortable ? 'pointer' : 'default'};
  user-select: none;
  position: relative;
  white-space: nowrap;
  
  &:hover {
    background: ${({ theme, sortable }) => sortable ? theme.colors.gray[100] : 'transparent'};
  }
  
  svg {
    width: 14px;
    height: 14px;
    margin-left: ${({ theme }) => theme.spacing[2]};
    opacity: 0.5;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{ selected?: boolean }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  background: ${({ theme, selected }) => selected ? theme.colors.primary[50] : theme.colors.white};
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover {
    background: ${({ theme, selected }) => selected ? theme.colors.primary[100] : theme.colors.gray[50]};
  }
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  vertical-align: middle;
  
  &:first-child {
    width: 40px;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: ${({ theme }) => theme.colors.primary[600]};
    cursor: pointer;
  }
`;

const AmenityName = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  
  img {
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    object-fit: cover;
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  }
  
  .placeholder {
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    background: ${({ theme }) => theme.colors.gray[100]};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.gray[400]};
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const AmenityInfo = styled.div`
  h4 {
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: ${({ theme }) => theme.spacing[1]};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
  
  p {
    color: ${({ theme }) => theme.colors.gray[500]};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    margin: 0;
  }
`;

const StatusBadge = styled(Badge)<{ status: string }>`
  background: ${({ theme, status }) => {
    switch (status) {
      case 'available':
        return theme.colors.success[100];
      case 'unavailable':
        return theme.colors.error[100];
      case 'maintenance':
        return theme.colors.warning[100];
      case 'reserved':
        return theme.colors.info[100];
      default:
        return theme.colors.gray[100];
    }
  }};
  color: ${({ theme, status }) => {
    switch (status) {
      case 'available':
        return theme.colors.success[800];
      case 'unavailable':
        return theme.colors.error[800];
      case 'maintenance':
        return theme.colors.warning[800];
      case 'reserved':
        return theme.colors.info[800];
      default:
        return theme.colors.gray[800];
    }
  }};
`;

const BookingBadge = styled(Badge)<{ status: string }>`
  background: ${({ theme, status }) => {
    switch (status) {
      case 'open':
        return theme.colors.success[100];
      case 'booked':
        return theme.colors.error[100];
      case 'partially_booked':
        return theme.colors.warning[100];
      case 'closed':
        return theme.colors.gray[100];
      default:
        return theme.colors.gray[100];
    }
  }};
  color: ${({ theme, status }) => {
    switch (status) {
      case 'open':
        return theme.colors.success[800];
      case 'booked':
        return theme.colors.error[800];
      case 'partially_booked':
        return theme.colors.warning[800];
      case 'closed':
        return theme.colors.gray[800];
      default:
        return theme.colors.gray[800];
    }
  }};
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ActionButton = styled.button<{ variant?: 'view' | 'edit' | 'delete' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme, variant }) => {
    switch (variant) {
      case 'view':
        return theme.colors.info[300];
      case 'edit':
        return theme.colors.success[300];
      case 'delete':
        return theme.colors.error[300];
      default:
        return theme.colors.gray[300];
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme, variant }) => {
    switch (variant) {
      case 'view':
        return theme.colors.info[600];
      case 'edit':
        return theme.colors.success[600];
      case 'delete':
        return theme.colors.error[600];
      default:
        return theme.colors.gray[600];
    }
  }};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover {
    background: ${({ theme, variant }) => {
      switch (variant) {
        case 'view':
          return theme.colors.info[50];
        case 'edit':
          return theme.colors.success[50];
        case 'delete':
          return theme.colors.error[50];
        default:
          return theme.colors.gray[50];
      }
    }};
    border-color: ${({ theme, variant }) => {
      switch (variant) {
        case 'view':
          return theme.colors.info[400];
        case 'edit':
          return theme.colors.success[400];
        case 'delete':
          return theme.colors.error[400];
        default:
          return theme.colors.gray[400];
      }
    }};
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[100]};
  background: ${({ theme }) => theme.colors.white};
`;

const PaginationInfo = styled.div`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  flex: 1;
`;

const PaginationControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
`;

const PaginationButton = styled.button<{ active?: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid ${({ theme, active }) => active ? theme.colors.primary[500] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, active }) => active ? theme.colors.primary[600] : theme.colors.white};
  color: ${({ theme, active }) => active ? theme.colors.white : theme.colors.gray[700]};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: ${({ theme }) => theme.transition.all};
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme, active }) => active ? theme.colors.primary[700] : theme.colors.primary[50]};
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  
  svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[6]};
  text-align: center;
  
  svg {
    width: 64px;
    height: 64px;
    color: ${({ theme }) => theme.colors.gray[300]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
  
  p {
    color: ${({ theme }) => theme.colors.gray[500]};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    margin-bottom: ${({ theme }) => theme.spacing[6]};
  }
`;

// Mock data for development
const MOCK_AMENITIES: SocietyAmenity[] = [
  {
    id: 1,
    name: 'Swimming Pool',
    description: 'Olympic-size swimming pool with lanes for lap swimming and recreational area',
    category: 'sports',
    location: 'Block A, Ground Floor',
    capacity: 50,
    operatingHours: {
      start: '06:00',
      end: '22:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    availabilityStatus: 'available',
    bookingStatus: 'open',
    usageGuidelines: 'Proper swimwear required. No diving in shallow end. Children under 12 must be accompanied by adults.',
    maintenanceSchedule: {
      nextScheduledDate: '2025-10-01',
      lastMaintenanceDate: '2025-09-01',
      maintenanceType: 'routine',
      frequency: 'weekly',
      assignedTo: 'Pool Maintenance Team',
      estimatedDuration: 2,
      cost: 500,
      isOverdue: false
    },
    contactPerson: {
      name: 'John Smith',
      designation: 'Pool Manager',
      phoneNumber: '+1234567890',
      email: 'pool@society.com',
      availability: '8 AM - 8 PM',
      isEmergencyContact: true
    },
    amenitiesProvided: ['Changing rooms', 'Lockers', 'Pool equipment', 'First aid'],
    rulesAndRegulations: 'No glass containers. No running around pool area. Maximum 2 hours per session.',
    images: [
      {
        id: 1,
        url: '/api/images/pool1.jpg',
        filename: 'pool1.jpg',
        size: 1024000,
        uploadedAt: '2025-01-15T08:00:00Z',
        uploadedBy: 'admin',
        isPrimary: true,
        alt: 'Swimming pool main view'
      }
    ],
    bookingHistory: [],
    feedbackAndRatings: [],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-09-20T00:00:00Z',
    createdBy: 'admin',
    lastUpdatedBy: 'admin',
    isActive: true,
    societyId: 1,
    usage: {
      daily: 25,
      weekly: 150,
      monthly: 600
    },
    revenue: 15000,
    reviews: [
      {
        id: 1,
        userId: 1,
        userName: 'Alice Johnson',
        rating: 5,
        review: 'Excellent pool facility with clean water and good maintenance.',
        date: '2025-09-15T00:00:00Z',
        verified: true
      }
    ]
  },
  {
    id: 2,
    name: 'Gymnasium',
    description: 'Modern fitness center with cardio and weight training equipment',
    category: 'fitness',
    location: 'Block B, First Floor',
    capacity: 30,
    operatingHours: {
      start: '05:00',
      end: '23:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    availabilityStatus: 'available',
    bookingStatus: 'partially_booked',
    usageGuidelines: 'Proper gym attire and footwear required. Clean equipment after use. 90-minute maximum per session.',
    maintenanceSchedule: {
      nextScheduledDate: '2025-09-25',
      lastMaintenanceDate: '2025-09-18',
      maintenanceType: 'inspection',
      frequency: 'weekly',
      assignedTo: 'Fitness Equipment Services',
      estimatedDuration: 3,
      cost: 800,
      isOverdue: false
    },
    contactPerson: {
      name: 'Sarah Wilson',
      designation: 'Fitness Coordinator',
      phoneNumber: '+1234567891',
      email: 'gym@society.com',
      availability: '5 AM - 11 PM',
      isEmergencyContact: true
    },
    amenitiesProvided: ['Cardio machines', 'Weight training', 'Lockers', 'Towel service', 'Water station'],
    rulesAndRegulations: 'No personal trainers without approval. Spot others when lifting heavy weights. Maintain silence.',
    images: [
      {
        id: 2,
        url: '/api/images/gym1.jpg',
        filename: 'gym1.jpg',
        size: 856000,
        uploadedAt: '2025-01-15T08:30:00Z',
        uploadedBy: 'admin',
        isPrimary: true,
        alt: 'Gymnasium equipment area'
      }
    ],
    bookingHistory: [],
    feedbackAndRatings: [],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-09-20T00:00:00Z',
    createdBy: 'admin',
    lastUpdatedBy: 'admin',
    isActive: true,
    societyId: 1,
    usage: {
      daily: 20,
      weekly: 120,
      monthly: 480
    },
    revenue: 12000,
    reviews: [
      {
        id: 2,
        userId: 2,
        userName: 'Bob Smith',
        rating: 4,
        review: 'Good equipment variety, could use better ventilation.',
        date: '2025-09-12T00:00:00Z',
        verified: true
      }
    ]
  },
  {
    id: 3,
    name: 'Clubhouse',
    description: 'Multi-purpose hall for events, parties, and community gatherings',
    category: 'social',
    location: 'Block C, Ground Floor',
    capacity: 100,
    operatingHours: {
      start: '09:00',
      end: '23:00',
      days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    availabilityStatus: 'available',
    bookingStatus: 'booked',
    usageGuidelines: 'Advance booking required. Additional charges for decorations. Cleanup mandatory after events.',
    maintenanceSchedule: {
      nextScheduledDate: '2025-10-15',
      lastMaintenanceDate: '2025-09-10',
      maintenanceType: 'deep_cleaning',
      frequency: 'monthly',
      assignedTo: 'Event Services Team',
      estimatedDuration: 4,
      cost: 1200,
      isOverdue: false
    },
    contactPerson: {
      name: 'Michael Brown',
      designation: 'Events Manager',
      phoneNumber: '+1234567892',
      email: 'events@society.com',
      availability: '9 AM - 11 PM',
      isEmergencyContact: false
    },
    amenitiesProvided: ['Sound system', 'Projector', 'Stage', 'Kitchen access', 'Parking'],
    rulesAndRegulations: 'No smoking or alcohol without permission. Music volume restrictions after 10 PM. Security deposit required.',
    images: [
      {
        id: 3,
        url: '/api/images/clubhouse1.jpg',
        filename: 'clubhouse1.jpg',
        size: 1200000,
        uploadedAt: '2025-01-15T09:00:00Z',
        uploadedBy: 'admin',
        isPrimary: true,
        alt: 'Clubhouse main hall'
      }
    ],
    bookingHistory: [],
    feedbackAndRatings: [],
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-09-20T00:00:00Z',
    createdBy: 'admin',
    lastUpdatedBy: 'admin',
    isActive: true,
    societyId: 1,
    pricing: {
      dailyRate: 2000,
      memberDiscount: 10,
      securityDeposit: 5000
    },
    usage: {
      daily: 1,
      weekly: 3,
      monthly: 12
    },
    revenue: 25000,
    reviews: [
      {
        id: 3,
        userId: 3,
        userName: 'Carol Davis',
        rating: 5,
        review: 'Perfect venue for our family celebration. Well-maintained and spacious.',
        date: '2025-09-08T00:00:00Z',
        verified: true
      }
    ]
  }
];

const MOCK_STATS: AmenityStats = {
  totalAmenities: 3,
  activeAmenities: 3,
  availableAmenities: 3,
  bookedAmenities: 1,
  maintenanceOverdue: 0,
  averageRating: 4.7,
  totalRevenue: 52000,
  totalBookings: 85,
  mostPopularAmenity: {
    id: 1,
    name: 'Swimming Pool',
    bookings: 35
  },
  categoryDistribution: [
    { category: 'sports', count: 1, percentage: 33.3 },
    { category: 'fitness', count: 1, percentage: 33.3 },
    { category: 'social', count: 1, percentage: 33.3 }
  ],
  usageTrends: [
    { period: 'Jan 2025', usage: 180, revenue: 15000 },
    { period: 'Feb 2025', usage: 165, revenue: 14200 },
    { period: 'Mar 2025', usage: 195, revenue: 16800 }
  ]
};

const SocietyAmenitiesPage: React.FC = () => {
  // State management
  const [amenities, setAmenities] = useState<SocietyAmenity[]>(MOCK_AMENITIES);
  const [filteredAmenities, setFilteredAmenities] = useState<SocietyAmenity[]>(MOCK_AMENITIES);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<number[]>([]);
  const [searchFilters, setSearchFilters] = useState<AmenitySearchFilters>({
    searchTerm: '',
    category: '',
    availabilityStatus: '',
    bookingStatus: '',
    location: '',
    operatingHours: null,
    capacity: null,
    priceRange: null,
    hasImages: null,
    rating: null,
    isActive: null,
    maintenanceOverdue: null,
    dateRange: null
  });
  const [sortOptions, setSortOptions] = useState<AmenitySortOptions>({
    field: 'name',
    direction: 'asc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pagination, setPagination] = useState<AmenityPaginationOptions>({
    page: 1,
    pageSize: 10,
    total: MOCK_AMENITIES.length,
    totalPages: Math.ceil(MOCK_AMENITIES.length / 10)
  });
  const [stats] = useState<AmenityStats>(MOCK_STATS);
  const [isLoading, setIsLoading] = useState(false);

  // Handle search
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchFilters(prev => ({ ...prev, searchTerm }));
  }, []);

  // Handle filters
  const handleFiltersChange = useCallback((newFilters: Partial<AmenitySearchFilters>) => {
    setSearchFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  // Handle sorting
  const handleSort = useCallback((field: AmenitySortField) => {
    setSortOptions(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  // Handle selection
  const handleSelectAmenity = useCallback((amenityId: number, selected: boolean) => {
    setSelectedAmenityIds(prev => 
      selected 
        ? [...prev, amenityId]
        : prev.filter(id => id !== amenityId)
    );
  }, []);

  const handleSelectAll = useCallback((selected: boolean) => {
    setSelectedAmenityIds(selected ? filteredAmenities.map(a => a.id) : []);
  }, [filteredAmenities]);

  // Handle bulk actions
  const handleBulkAction = useCallback(async (action: AmenityBulkActionType) => {
    if (selectedAmenityIds.length === 0) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update amenities based on action
      switch (action) {
        case 'activate':
          setAmenities(prev => prev.map(amenity => 
            selectedAmenityIds.includes(amenity.id)
              ? { ...amenity, isActive: true }
              : amenity
          ));
          break;
        case 'deactivate':
          setAmenities(prev => prev.map(amenity => 
            selectedAmenityIds.includes(amenity.id)
              ? { ...amenity, isActive: false, availabilityStatus: 'unavailable' as AvailabilityStatus }
              : amenity
          ));
          break;
        case 'delete':
          setAmenities(prev => prev.filter(amenity => !selectedAmenityIds.includes(amenity.id)));
          break;
      }
      
      setSelectedAmenityIds([]);
    } catch (error) {
      console.error(`Error performing bulk action ${action}:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedAmenityIds]);

  // Handle pagination
  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  // Handle export
  const handleExport = useCallback(async (format: ExportFormat) => {
    setIsLoading(true);
    try {
      // Simulate export API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create mock export data
      const exportData = filteredAmenities.map(amenity => ({
        name: amenity.name,
        category: amenity.category,
        location: amenity.location,
        capacity: amenity.capacity,
        availabilityStatus: amenity.availabilityStatus,
        bookingStatus: amenity.bookingStatus,
        contactPerson: amenity.contactPerson.name,
        revenue: amenity.revenue
      }));
      
      console.log(`Exporting ${exportData.length} amenities as ${format}:`, exportData);
      
      // In real implementation, this would trigger file download
      alert(`Export of ${exportData.length} amenities as ${format.toUpperCase()} completed!`);
    } catch (error) {
      console.error('Error exporting amenities:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filteredAmenities]);

  // Filter and sort amenities
  const processedAmenities = useMemo(() => {
    let result = [...amenities];
    
    // Apply filters
    if (searchFilters.searchTerm) {
      const term = searchFilters.searchTerm.toLowerCase();
      result = result.filter(amenity => 
        amenity.name.toLowerCase().includes(term) ||
        amenity.description.toLowerCase().includes(term) ||
        amenity.location.toLowerCase().includes(term)
      );
    }
    
    if (searchFilters.category) {
      result = result.filter(amenity => amenity.category === searchFilters.category);
    }
    
    if (searchFilters.availabilityStatus) {
      result = result.filter(amenity => amenity.availabilityStatus === searchFilters.availabilityStatus);
    }
    
    if (searchFilters.bookingStatus) {
      result = result.filter(amenity => amenity.bookingStatus === searchFilters.bookingStatus);
    }
    
    if (searchFilters.isActive !== null) {
      result = result.filter(amenity => amenity.isActive === searchFilters.isActive);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      switch (sortOptions.field) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        case 'location':
          aValue = a.location;
          bValue = b.location;
          break;
        case 'capacity':
          aValue = a.capacity;
          bValue = b.capacity;
          break;
        case 'availabilityStatus':
          aValue = a.availabilityStatus;
          bValue = b.availabilityStatus;
          break;
        case 'bookingStatus':
          aValue = a.bookingStatus;
          bValue = b.bookingStatus;
          break;
        case 'usage.daily':
          aValue = a.usage.daily;
          bValue = b.usage.daily;
          break;
        case 'revenue':
          aValue = a.revenue;
          bValue = b.revenue;
          break;
        default:
          aValue = a[sortOptions.field as keyof SocietyAmenity];
          bValue = b[sortOptions.field as keyof SocietyAmenity];
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      return sortOptions.direction === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [amenities, searchFilters, sortOptions]);

  // Update filtered amenities
  useEffect(() => {
    setFilteredAmenities(processedAmenities);
    setPagination(prev => ({
      ...prev,
      total: processedAmenities.length,
      totalPages: Math.ceil(processedAmenities.length / prev.pageSize),
      page: 1
    }));
  }, [processedAmenities]);

  // Get paginated amenities
  const paginatedAmenities = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredAmenities.slice(start, end);
  }, [filteredAmenities, pagination]);

  // Mock handlers for CRUD operations
  const handleAddAmenity = useCallback(() => {
    setShowAddModal(true);
  }, []);

  const handleAddAmenitySubmit = useCallback(async (formData: AmenityFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new amenity from form data
      const newAmenity: SocietyAmenity = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        capacity: formData.capacity,
        operatingHours: formData.operatingHours,
        availabilityStatus: 'available',
        bookingStatus: 'open',
        usageGuidelines: formData.usageGuidelines,
        maintenanceSchedule: {
          nextScheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          lastMaintenanceDate: new Date().toISOString().split('T')[0],
          maintenanceType: formData.maintenanceSchedule.maintenanceType || 'routine',
          frequency: formData.maintenanceSchedule.frequency || 'weekly',
          assignedTo: formData.maintenanceSchedule.assignedTo || 'Maintenance Team',
          estimatedDuration: formData.maintenanceSchedule.estimatedDuration || 2,
          cost: formData.maintenanceSchedule.cost || 500,
          isOverdue: false
        },
        contactPerson: formData.contactPerson,
        amenitiesProvided: formData.amenitiesProvided,
        rulesAndRegulations: formData.rulesAndRegulations,
        images: [],
        bookingHistory: [],
        feedbackAndRatings: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'admin',
        lastUpdatedBy: 'admin',
        isActive: true,
        societyId: 1,
        pricing: formData.pricing,
        usage: {
          daily: 0,
          weekly: 0,
          monthly: 0
        },
        revenue: 0,
        reviews: []
      };
      
      setAmenities(prev => [newAmenity, ...prev]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding amenity:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleViewAmenity = useCallback((amenity: SocietyAmenity) => {
    console.log('View amenity:', amenity);
    // Will implement modal in next step
  }, []);

  const handleEditAmenity = useCallback((amenity: SocietyAmenity) => {
    console.log('Edit amenity:', amenity);
    // Will implement modal in next step
  }, []);

  const handleDeleteAmenity = useCallback(async (amenityId: number) => {
    if (window.confirm('Are you sure you want to delete this amenity?')) {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setAmenities(prev => prev.filter(a => a.id !== amenityId));
      } catch (error) {
        console.error('Error deleting amenity:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const getSortIcon = (field: AmenitySortField) => {
    if (sortOptions.field !== field) return <FaSort />;
    return sortOptions.direction === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const renderTableHeader = () => (
    <TableHeader>
      <TableHeaderRow>
        <TableHeaderCell>
          <CheckboxContainer>
            <input
              type="checkbox"
              checked={selectedAmenityIds.length === filteredAmenities.length && filteredAmenities.length > 0}
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
          </CheckboxContainer>
        </TableHeaderCell>
        <TableHeaderCell sortable onClick={() => handleSort('name')}>
          Amenity Name {getSortIcon('name')}
        </TableHeaderCell>
        <TableHeaderCell sortable onClick={() => handleSort('category')}>
          Category {getSortIcon('category')}
        </TableHeaderCell>
        <TableHeaderCell sortable onClick={() => handleSort('location')}>
          Location {getSortIcon('location')}
        </TableHeaderCell>
        <TableHeaderCell sortable onClick={() => handleSort('capacity')}>
          Capacity {getSortIcon('capacity')}
        </TableHeaderCell>
        <TableHeaderCell sortable onClick={() => handleSort('availabilityStatus')}>
          Availability {getSortIcon('availabilityStatus')}
        </TableHeaderCell>
        <TableHeaderCell sortable onClick={() => handleSort('bookingStatus')}>
          Booking Status {getSortIcon('bookingStatus')}
        </TableHeaderCell>
        <TableHeaderCell>Operating Hours</TableHeaderCell>
        <TableHeaderCell>Contact Person</TableHeaderCell>
        <TableHeaderCell sortable onClick={() => handleSort('usage.daily')}>
          Daily Usage {getSortIcon('usage.daily')}
        </TableHeaderCell>
        <TableHeaderCell sortable onClick={() => handleSort('revenue')}>
          Revenue {getSortIcon('revenue')}
        </TableHeaderCell>
        <TableHeaderCell>Actions</TableHeaderCell>
      </TableHeaderRow>
    </TableHeader>
  );

  const renderTableRow = (amenity: SocietyAmenity) => (
    <TableRow 
      key={amenity.id}
      selected={selectedAmenityIds.includes(amenity.id)}
    >
      <TableCell>
        <CheckboxContainer>
          <input
            type="checkbox"
            checked={selectedAmenityIds.includes(amenity.id)}
            onChange={(e) => handleSelectAmenity(amenity.id, e.target.checked)}
          />
        </CheckboxContainer>
      </TableCell>
      <TableCell>
        <AmenityName>
          {amenity.images.length > 0 ? (
            <img src={amenity.images[0].url} alt={amenity.images[0].alt} />
          ) : (
            <div className="placeholder">
              <FaImages />
            </div>
          )}
          <AmenityInfo>
            <h4>{amenity.name}</h4>
            <p>{amenity.description.length > 60 ? `${amenity.description.substring(0, 60)}...` : amenity.description}</p>
          </AmenityInfo>
        </AmenityName>
      </TableCell>
      <TableCell>
        <Badge>{amenity.category}</Badge>
      </TableCell>
      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <FaMapMarkerAlt style={{ width: '12px', height: '12px', color: '#6B7280' }} />
          {amenity.location}
        </div>
      </TableCell>
      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <FaUsers style={{ width: '12px', height: '12px', color: '#6B7280' }} />
          {amenity.capacity}
        </div>
      </TableCell>
      <TableCell>
        <StatusBadge status={amenity.availabilityStatus}>
          {amenity.availabilityStatus}
        </StatusBadge>
      </TableCell>
      <TableCell>
        <BookingBadge status={amenity.bookingStatus}>
          {amenity.bookingStatus.replace('_', ' ')}
        </BookingBadge>
      </TableCell>
      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
          <FaClock style={{ width: '12px', height: '12px', color: '#6B7280' }} />
          {amenity.operatingHours.start} - {amenity.operatingHours.end}
        </div>
      </TableCell>
      <TableCell>
        <div style={{ fontSize: '12px' }}>
          <div style={{ fontWeight: 600 }}>{amenity.contactPerson.name}</div>
          <div style={{ color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <FaPhone style={{ width: '10px', height: '10px' }} />
            {amenity.contactPerson.phoneNumber}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <FaChartLine style={{ width: '12px', height: '12px', color: '#6B7280' }} />
          {amenity.usage.daily}
        </div>
      </TableCell>
      <TableCell>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
          <FaMoneyBillWave style={{ width: '12px', height: '12px', color: '#10B981' }} />
          ${amenity.revenue.toLocaleString()}
        </div>
      </TableCell>
      <TableCell>
        <ActionButtonGroup>
          <ActionButton variant="view" onClick={() => handleViewAmenity(amenity)}>
            <FaEye />
          </ActionButton>
          <ActionButton variant="edit" onClick={() => handleEditAmenity(amenity)}>
            <FaEdit />
          </ActionButton>
          <ActionButton variant="delete" onClick={() => handleDeleteAmenity(amenity.id)}>
            <FaTrash />
          </ActionButton>
        </ActionButtonGroup>
      </TableCell>
    </TableRow>
  );

  return (
    <PageContainer>
      <Header>
        <h1>
          <FaCog />
          Society Amenities Management
        </h1>
        <p>Configure and manage society amenities like gym, pool, clubhouse, and recreational facilities</p>
      </Header>

      {/* Statistics */}
      <StatsGrid>
        <LayoutStatCard>
          <StatIcon>
            <FaCog />
          </StatIcon>
          <StatValue>{stats.totalAmenities}</StatValue>
          <StatLabel>Total Amenities</StatLabel>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon>
            <FaCheckCircle />
          </StatIcon>
          <StatValue>{stats.availableAmenities}</StatValue>
          <StatLabel>Available</StatLabel>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon>
            <FaBookmark />
          </StatIcon>
          <StatValue>{stats.bookedAmenities}</StatValue>
          <StatLabel>Booked Today</StatLabel>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon>
            <FaStar />
          </StatIcon>
          <StatValue>{stats.averageRating}</StatValue>
          <StatLabel>Average Rating</StatLabel>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon>
            <FaMoneyBillWave />
          </StatIcon>
          <StatValue>${stats.totalRevenue.toLocaleString()}</StatValue>
          <StatLabel>Total Revenue</StatLabel>
        </LayoutStatCard>
        <LayoutStatCard>
          <StatIcon>
            <FaTools />
          </StatIcon>
          <StatValue>{stats.maintenanceOverdue}</StatValue>
          <StatLabel>Maintenance Overdue</StatLabel>
        </LayoutStatCard>
      </StatsGrid>

      {/* Controls */}
      <ControlsContainer>
        <SearchAndFilters>
          <SearchContainer>
            <FaSearch />
            <FormInput
              type="text"
              placeholder="Search amenities by name, description, or location..."
              value={searchFilters.searchTerm}
              onChange={handleSearchChange}
            />
          </SearchContainer>
          <FilterButton 
            active={showFilters}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter />
            Filters
          </FilterButton>
        </SearchAndFilters>

        <ActionButtons>
          <SecondaryButton onClick={() => handleExport('csv')}>
            <FaDownload />
            Export CSV
          </SecondaryButton>
          <SecondaryButton onClick={() => handleExport('excel')}>
            <FaDownload />
            Export Excel
          </SecondaryButton>
          <PrimaryButton onClick={handleAddAmenity}>
            <FaPlus />
            Add Amenity
          </PrimaryButton>
        </ActionButtons>
      </ControlsContainer>

      {/* Bulk Actions */}
      <BulkActionsBar show={selectedAmenityIds.length > 0}>
        <BulkActionsLeft>
          <span>{selectedAmenityIds.length} amenities selected</span>
        </BulkActionsLeft>
        <BulkActionsRight>
          <BulkActionButton onClick={() => handleBulkAction('activate')}>
            <FaCheck />
            Activate
          </BulkActionButton>
          <BulkActionButton onClick={() => handleBulkAction('deactivate')}>
            <FaTimes />
            Deactivate
          </BulkActionButton>
          <BulkActionButton onClick={() => handleBulkAction('delete')}>
            <FaTrash />
            Delete
          </BulkActionButton>
        </BulkActionsRight>
      </BulkActionsBar>

      {/* Table */}
      <ContentCard style={{ position: 'relative' }}>
        {isLoading && (
          <LoadingOverlay>
            <FaSpinner size={32} />
          </LoadingOverlay>
        )}
        
        <TableContainer>
          <Table>
            {renderTableHeader()}
            <TableBody>
              {paginatedAmenities.length > 0 ? (
                paginatedAmenities.map(renderTableRow)
              ) : (
                <tr>
                  <td colSpan={12}>
                    <EmptyState>
                      <FaCog />
                      <h3>No amenities found</h3>
                      <p>
                        {searchFilters.searchTerm || searchFilters.category || searchFilters.availabilityStatus
                          ? 'Try adjusting your search criteria or filters'
                          : 'Get started by adding your first amenity'
                        }
                      </p>
                      {!searchFilters.searchTerm && !searchFilters.category && !searchFilters.availabilityStatus && (
                        <PrimaryButton onClick={handleAddAmenity}>
                          <FaPlus />
                          Add First Amenity
                        </PrimaryButton>
                      )}
                    </EmptyState>
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {filteredAmenities.length > 0 && (
          <PaginationContainer>
            <PaginationInfo>
              Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{' '}
              {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
              {pagination.total} amenities
            </PaginationInfo>
            <PaginationControls>
              <PaginationButton
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                <FaChevronLeft />
              </PaginationButton>
              {[...Array(pagination.totalPages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === pagination.totalPages ||
                  (page >= pagination.page - 1 && page <= pagination.page + 1)
                ) {
                  return (
                    <PaginationButton
                      key={page}
                      active={page === pagination.page}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationButton>
                  );
                } else if (page === pagination.page - 2 || page === pagination.page + 2) {
                  return <span key={page} style={{ padding: '0 8px' }}>...</span>;
                }
                return null;
              })}
              <PaginationButton
                disabled={pagination.page === pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                <FaChevronRight />
              </PaginationButton>
            </PaginationControls>
          </PaginationContainer>
        )}
      </ContentCard>

      {/* Add Amenity Modal */}
      <AddAmenityModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddAmenitySubmit}
        isLoading={isLoading}
      />
    </PageContainer>
  );
};

export default SocietyAmenitiesPage;