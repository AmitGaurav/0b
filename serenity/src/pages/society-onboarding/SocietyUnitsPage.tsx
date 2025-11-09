import React, { useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import {
  FaPlus,
  FaSearch,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaPhone,
  FaEnvelope,
  FaImages,
  FaMoneyBillWave,
  FaTools,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBell,
  FaPercentage,
  FaCogs,
  FaArrowUp,
  FaBuilding,
  FaHome,
  FaRuler
} from 'react-icons/fa';

import {
  SocietyUnit,
  UnitStatus,
  UnitType,
  UnitSearchFilters,
  UnitTableConfig,
  UnitBulkAction,
  ContactPerson,
  AssignedMember,
  MaintenanceSchedule,
  BookingHistory,
  UnitFeedback,
  UnitImage,
  UnitStatistics
} from '../../types/society-units';

// Layout Components - using div wrapper instead of PageLayout
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
    {children}
  </div>
);

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[6]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
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
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

// Statistics Section
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing[3]};
  }
  
  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    color: ${({ theme }) => theme.colors.white};
  }
  
  .stat-content {
    flex: 1;
  }
  
  .stat-label {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.gray[600]};
    margin-bottom: ${({ theme }) => theme.spacing[1]};
  }
  
  .stat-value {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.gray[900]};
  }
  
  .stat-change {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[1]};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    margin-top: ${({ theme }) => theme.spacing[2]};
    
    &.positive {
      color: ${({ theme }) => theme.colors.success[600]};
    }
    
    &.negative {
      color: ${({ theme }) => theme.colors.error[600]};
    }
    
    &.neutral {
      color: ${({ theme }) => theme.colors.gray[600]};
    }
  }
`;

// Controls Section
const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const TopControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchAndFilters = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  flex: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
  
  input {
    width: 100%;
    padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[12]};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    transition: ${({ theme }) => theme.transition.colors};
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary[500]};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    }
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.gray[500]};
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

const FilterSelect = styled.select`
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

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: stretch;
    
    button {
      flex: 1;
    }
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' | 'success' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};
  border: none;
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary[600]};
          color: ${theme.colors.white};
          &:hover {
            background: ${theme.colors.primary[700]};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error[600]};
          color: ${theme.colors.white};
          &:hover {
            background: ${theme.colors.error[700]};
          }
        `;
      case 'success':
        return `
          background: ${theme.colors.success[600]};
          color: ${theme.colors.white};
          &:hover {
            background: ${theme.colors.success[700]};
          }
        `;
      default:
        return `
          background: ${theme.colors.white};
          color: ${theme.colors.gray[700]};
          border: 1px solid ${theme.colors.gray[300]};
          &:hover {
            background: ${theme.colors.gray[50]};
          }
        `;
    }
  }}
`;

// Bulk Actions Bar
const BulkActionsBar = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => visible ? 'flex' : 'none'};
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const BulkActionsLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const BulkActionsRight = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const BulkActionButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
`;

// Table Section
const TableContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 1fr 120px 100px 120px 180px 120px 150px 120px 120px 100px 100px 120px;
  background: ${({ theme }) => theme.colors.gray[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const TableHeaderCell = styled.div<{ sortable?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  cursor: ${({ sortable }) => sortable ? 'pointer' : 'default'};
  
  &:hover {
    color: ${({ sortable, theme }) => sortable ? theme.colors.primary[600] : 'inherit'};
  }
`;

const TableBody = styled.div`
  max-height: 600px;
  overflow-y: auto;
`;

const TableRow = styled.div<{ selected?: boolean }>`
  display: grid;
  grid-template-columns: 40px 1fr 120px 100px 120px 180px 120px 150px 120px 120px 100px 100px 120px;
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  background: ${({ selected, theme }) => selected ? theme.colors.primary[50] : theme.colors.white};
  transition: ${({ theme }) => theme.transition.colors};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.div`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

// Status and Type Badges
const StatusBadge = styled.span<{ status: UnitStatus }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: capitalize;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'occupied':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[800]};
        `;
      case 'vacant':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[800]};
        `;
      case 'under_maintenance':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[800]};
        `;
      case 'reserved':
        return `
          background: ${theme.colors.info[100]};
          color: ${theme.colors.info[800]};
        `;
      case 'blocked':
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[800]};
        `;
      default:
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[800]};
        `;
    }
  }}
`;

const TypeBadge = styled.span<{ type: UnitType }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: capitalize;
  
  ${({ type, theme }) => {
    switch (type) {
      case 'apartment':
        return `
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[800]};
        `;
      case 'studio':
        return `
          background: ${theme.colors.secondary[100]};
          color: ${theme.colors.secondary[800]};
        `;
      case 'commercial':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[800]};
        `;
      case 'penthouse':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[800]};
        `;
      case 'duplex':
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

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const SizeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const RatingStars = styled.div`
  display: flex;
  gap: 1px;
`;

const StarIcon = styled(FaStar)<{ filled: boolean }>`
  color: ${({ filled, theme }) => filled ? theme.colors.warning[400] : theme.colors.gray[300]};
  font-size: 12px;
`;

// Action Buttons
const ActionButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const ActionButton = styled.button<{ variant?: 'view' | 'edit' | 'delete' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'view':
        return `
          background: ${theme.colors.info[100]};
          color: ${theme.colors.info[600]};
          &:hover {
            background: ${theme.colors.info[200]};
          }
        `;
      case 'edit':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[600]};
          &:hover {
            background: ${theme.colors.warning[200]};
          }
        `;
      case 'delete':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[600]};
          &:hover {
            background: ${theme.colors.error[200]};
          }
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[600]};
          &:hover {
            background: ${theme.colors.gray[200]};
          }
        `;
    }
  }}
`;

// Pagination
const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.white};
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

const PageButton = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ active, theme }) => active ? theme.colors.primary[600] : theme.colors.white};
  color: ${({ active, theme }) => active ? theme.colors.white : theme.colors.gray[700]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};
  
  &:hover:not(:disabled) {
    background: ${({ active, theme }) => active ? theme.colors.primary[700] : theme.colors.gray[50]};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageSizeSelect = styled.select`
  padding: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};
`;

// Loading and Empty States
const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[12]};
  
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
  padding: ${({ theme }) => theme.spacing[12]};
  text-align: center;
  
  .icon {
    font-size: 48px;
    color: ${({ theme }) => theme.colors.gray[400]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
  
  .title {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
  
  .description {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    color: ${({ theme }) => theme.colors.gray[600]};
    margin-bottom: ${({ theme }) => theme.spacing[6]};
  }
`;

// Mock data generation function
const generateMockUnits = (count: number = 50): SocietyUnit[] => {
  const types: UnitType[] = ['apartment', 'studio', 'commercial', 'penthouse', 'duplex'];
  const statuses: UnitStatus[] = ['occupied', 'vacant', 'under_maintenance', 'reserved', 'blocked', 'available'];
  const buildings = ['Tower A', 'Tower B', 'Tower C', 'Block 1', 'Block 2'];
  const wings = ['East Wing', 'West Wing', 'North Wing', 'South Wing', 'Central Wing'];
  
  const unitNames: Record<UnitType, string[]> = {
    apartment: ['Standard Apartment', 'Deluxe Apartment', 'Premium Apartment', 'Executive Apartment'],
    studio: ['Modern Studio', 'Compact Studio', 'Luxury Studio', 'Urban Studio'],
    commercial: ['Office Space', 'Retail Shop', 'Restaurant Space', 'Medical Clinic'],
    penthouse: ['Luxury Penthouse', 'Executive Penthouse', 'Premium Penthouse', 'Sky Villa'],
    duplex: ['Garden Duplex', 'Terrace Duplex', 'Premium Duplex', 'Executive Duplex'],
    other: ['Storage Unit', 'Utility Room', 'Community Space', 'Service Room']
  };
  
  const amenitiesList = [
    'Air Conditioning', 'Parking', 'Balcony', 'Garden View', 'Swimming Pool Access',
    'Gym Access', 'Elevator', 'Security', 'Power Backup', 'Water Supply',
    'Internet Ready', 'Cable TV', 'Intercom', 'Fire Safety', 'CCTV'
  ];
  
  const featuresList = [
    'Modular Kitchen', 'Wooden Flooring', 'False Ceiling', 'Built-in Wardrobes',
    'Study Room', 'Servant Room', 'Pooja Room', 'Utility Area', 'Store Room'
  ];

  return Array.from({ length: count }, (_, index) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const building = buildings[Math.floor(Math.random() * buildings.length)];
    const wing = wings[Math.floor(Math.random() * wings.length)];
    const floor = Math.floor(Math.random() * 20) + 1;
    const unitNum = `${floor}${String(index % 10 + 1).padStart(2, '0')}`;
    
    const names = unitNames[type];
    const baseSize = type === 'studio' ? 400 : type === 'commercial' ? 600 : type === 'penthouse' ? 2000 : type === 'duplex' ? 1500 : 1000;
    const size = baseSize + Math.floor(Math.random() * 500);
    
    const isOccupied = status === 'occupied';
    const assignedMember = isOccupied ? {
      id: `member-${index}`,
      name: `Member ${index + 1}`,
      apartmentNumber: unitNum,
      phoneNumber: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      email: `member${index + 1}@example.com`,
      moveInDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      leaseEndDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    } : undefined;

    const rentAmount = type === 'commercial' ? 50000 + Math.floor(Math.random() * 100000) :
                     type === 'penthouse' ? 80000 + Math.floor(Math.random() * 120000) :
                     type === 'duplex' ? 60000 + Math.floor(Math.random() * 80000) :
                     type === 'studio' ? 15000 + Math.floor(Math.random() * 25000) :
                     25000 + Math.floor(Math.random() * 50000);

    const unit: SocietyUnit = {
      id: `unit-${index + 1}`,
      unitNumber: unitNum,
      type,
      size,
      floorNumber: floor,
      assignedTo: assignedMember,
      status,
      amenities: amenitiesList.slice(0, Math.floor(Math.random() * 8) + 5),
      maintenanceSchedule: [{
        id: `maintenance-${index}`,
        type: 'routine',
        description: 'Regular maintenance check',
        scheduledDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'scheduled',
        assignedTo: `Technician ${Math.floor(Math.random() * 5) + 1}`
      }],
      contactPerson: {
        id: `contact-${index}`,
        name: `Contact Person ${Math.floor(Math.random() * 10) + 1}`,
        designation: 'Property Manager',
        phoneNumber: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        email: `contact${index}@society.com`,
        emergencyContact: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`
      },
      location: {
        building,
        wing,
        address: `${building}, ${wing}, Floor ${floor}`,
        coordinates: {
          lat: 28.5355 + Math.random() * 0.1,
          lng: 77.3910 + Math.random() * 0.1
        }
      },
      bookingHistory: isOccupied ? [{
        id: `booking-${index}`,
        memberName: assignedMember!.name,
        bookingDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        moveInDate: assignedMember!.moveInDate!,
        duration: Math.floor(Math.random() * 24) + 12,
        rentAmount,
        securityDeposit: rentAmount * 2,
        status: 'active'
      }] : [],
      feedback: isOccupied ? [{
        id: `feedback-${index}`,
        memberName: assignedMember!.name,
        rating: Math.floor(Math.random() * 2) + 4,
        comment: 'Great unit with excellent amenities!',
        submittedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        category: 'overall'
      }] : [],
      images: [{
        id: `image-${index}`,
        url: `https://example.com/unit-${index + 1}.jpg`,
        alt: `Unit ${unitNum} interior`,
        type: 'interior',
        uploadedDate: new Date().toISOString().split('T')[0],
        uploadedBy: 'Admin'
      }],
      rentAmount,
      securityDeposit: rentAmount * 2,
      availableFrom: !isOccupied ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
      description: `Beautiful ${type} with modern amenities and excellent location.`,
      features: featuresList.slice(0, Math.floor(Math.random() * 5) + 3),
      createdDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      createdBy: 'Admin',
      updatedBy: 'Admin'
    };

    return unit;
  });
};

const SocietyUnitsPage: React.FC = () => {
  // State management
  const [units] = useState<SocietyUnit[]>(generateMockUnits(50));
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<UnitSearchFilters>({
    search: '',
    type: 'all',
    status: 'all',
    location: 'all',
    assignedMember: 'all',
    floorNumber: 'all',
    sizeRange: { min: 0, max: 5000 },
    rentRange: { min: 0, max: 200000 }
  });
  
  const [tableConfig, setTableConfig] = useState<UnitTableConfig>({
    sortBy: 'unitNumber',
    sortDirection: 'asc',
    currentPage: 1,
    itemsPerPage: 10,
    selectedItems: []
  });

  // Computed values
  const statistics: UnitStatistics = useMemo(() => {
    const totalUnits = units.length;
    const occupiedUnits = units.filter(u => u.status === 'occupied').length;
    const vacantUnits = units.filter(u => u.status === 'vacant').length;
    const underMaintenanceUnits = units.filter(u => u.status === 'under_maintenance').length;
    const averageSize = Math.round(units.reduce((sum, u) => sum + u.size, 0) / totalUnits);
    const occupiedRentals = units.filter(u => u.status === 'occupied' && u.rentAmount);
    const averageRent = occupiedRentals.length > 0 ? 
      Math.round(occupiedRentals.reduce((sum, u) => sum + (u.rentAmount || 0), 0) / occupiedRentals.length) : 0;
    const occupancyRate = Math.round((occupiedUnits / totalUnits) * 100);
    const revenueGenerated = occupiedRentals.reduce((sum, u) => sum + (u.rentAmount || 0), 0);
    const upcomingMaintenances = units.reduce((count, u) => 
      count + u.maintenanceSchedule.filter(m => m.status === 'scheduled').length, 0
    );
    const pendingAssignments = units.filter(u => u.status === 'vacant').length;

    return {
      totalUnits,
      occupiedUnits,
      vacantUnits,
      underMaintenanceUnits,
      averageSize,
      averageRent,
      occupancyRate,
      revenueGenerated,
      upcomingMaintenances,
      pendingAssignments
    };
  }, [units]);

  // Filter and search logic
  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          unit.unitNumber.toLowerCase().includes(searchTerm) ||
          unit.type.toLowerCase().includes(searchTerm) ||
          unit.assignedTo?.name.toLowerCase().includes(searchTerm) ||
          unit.location.building.toLowerCase().includes(searchTerm) ||
          unit.location.wing.toLowerCase().includes(searchTerm);
        
        if (!matchesSearch) return false;
      }

      // Type filter
      if (filters.type !== 'all' && unit.type !== filters.type) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && unit.status !== filters.status) {
        return false;
      }

      // Location filter
      if (filters.location !== 'all' && !unit.location.building.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Assigned member filter
      if (filters.assignedMember !== 'all' && 
          (!unit.assignedTo || !unit.assignedTo.name.toLowerCase().includes(filters.assignedMember.toLowerCase()))) {
        return false;
      }

      return true;
    });
  }, [units, filters]);

  // Pagination logic
  const paginatedUnits = useMemo(() => {
    const startIndex = (tableConfig.currentPage - 1) * tableConfig.itemsPerPage;
    const endIndex = startIndex + tableConfig.itemsPerPage;
    return filteredUnits.slice(startIndex, endIndex);
  }, [filteredUnits, tableConfig.currentPage, tableConfig.itemsPerPage]);

  const totalPages = Math.ceil(filteredUnits.length / tableConfig.itemsPerPage);

  // Event handlers
  const handleSearch = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setTableConfig(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const handleFilterChange = useCallback((key: keyof UnitSearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setTableConfig(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const handleSort = useCallback((field: string) => {
    setTableConfig(prev => ({
      ...prev,
      sortBy: field as any,
      sortDirection: prev.sortBy === field && prev.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    setTableConfig(prev => ({
      ...prev,
      selectedItems: checked ? paginatedUnits.map(u => u.id) : []
    }));
  }, [paginatedUnits]);

  const handleSelectItem = useCallback((unitId: string, checked: boolean) => {
    setTableConfig(prev => ({
      ...prev,
      selectedItems: checked
        ? [...prev.selectedItems, unitId]
        : prev.selectedItems.filter(id => id !== unitId)
    }));
  }, []);

  const handleBulkAction = useCallback((action: UnitBulkAction) => {
    console.log('Bulk action:', action);
    // Implement bulk action logic
    setTableConfig(prev => ({ ...prev, selectedItems: [] }));
  }, []);

  const handleExport = useCallback(() => {
    // Implement export logic
    console.log('Exporting units data...');
  }, []);

  const renderSortIcon = (field: string) => {
    if (tableConfig.sortBy !== field) return <FaSort />;
    return tableConfig.sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const renderRating = (rating: number) => {
    return (
      <RatingStars>
        {[1, 2, 3, 4, 5].map(star => (
          <StarIcon key={star} filled={star <= rating} />
        ))}
      </RatingStars>
    );
  };

  const getAverageRating = (feedback: UnitFeedback[]) => {
    if (feedback.length === 0) return 0;
    return feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length;
  };

  if (loading) {
    return (
      <PageWrapper>
        <Container>
          <LoadingSpinner>
            <FaSpinner />
          </LoadingSpinner>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        {/* Header */}
        <Header>
          <HeaderContent>
            <Title>Society Units Management</Title>
            <Subtitle>Manage and allocate residential and commercial units within the society</Subtitle>
          </HeaderContent>
        </Header>

        {/* Statistics Dashboard */}
        <StatsGrid>
          <StatCard>
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-label">Total Units</div>
                <div className="stat-value">{statistics.totalUnits.toLocaleString()}</div>
              </div>
              <div className="stat-icon" style={{ background: '#3B82F6' }}>
                <FaBuilding className="stat-icon" />
              </div>
            </div>
            <div className="stat-change positive">
              <FaArrowUp />
              <span>+5.2% from last month</span>
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-label">Occupied Units</div>
                <div className="stat-value">{statistics.occupiedUnits.toLocaleString()}</div>
              </div>
              <div className="stat-icon" style={{ background: '#10B981' }}>
                <FaHome />
              </div>
            </div>
            <div className="stat-change positive">
              <FaPercentage />
              <span>{statistics.occupancyRate}% occupancy rate</span>
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-label">Vacant Units</div>
                <div className="stat-value">{statistics.vacantUnits.toLocaleString()}</div>
              </div>
              <div className="stat-icon" style={{ background: '#F59E0B' }}>
                <FaExclamationTriangle />
              </div>
            </div>
            <div className="stat-change neutral">
              <span>Available for assignment</span>
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-label">Under Maintenance</div>
                <div className="stat-value">{statistics.underMaintenanceUnits.toLocaleString()}</div>
              </div>
              <div className="stat-icon" style={{ background: '#EF4444' }}>
                <FaTools />
              </div>
            </div>
            <div className="stat-change neutral">
              <FaClock />
              <span>{statistics.upcomingMaintenances} scheduled</span>
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-label">Average Size</div>
                <div className="stat-value">{statistics.averageSize.toLocaleString()} sq ft</div>
              </div>
              <div className="stat-icon" style={{ background: '#8B5CF6' }}>
                <FaRuler />
              </div>
            </div>
            <div className="stat-change positive">
              <span>Across all unit types</span>
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-label">Monthly Revenue</div>
                <div className="stat-value">₹{(statistics.revenueGenerated / 100000).toFixed(1)}L</div>
              </div>
              <div className="stat-icon" style={{ background: '#06B6D4' }}>
                <FaMoneyBillWave />
              </div>
            </div>
            <div className="stat-change positive">
              <FaArrowUp />
              <span>+12.3% from last month</span>
            </div>
          </StatCard>
        </StatsGrid>

        {/* Controls */}
        <Controls>
          <TopControls>
            <SearchAndFilters>
              <SearchInput>
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by unit number, type, or assigned member..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </SearchInput>

              <FilterSelect
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="studio">Studio</option>
                <option value="commercial">Commercial</option>
                <option value="penthouse">Penthouse</option>
                <option value="duplex">Duplex</option>
                <option value="other">Other</option>
              </FilterSelect>

              <FilterSelect
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="occupied">Occupied</option>
                <option value="vacant">Vacant</option>
                <option value="under_maintenance">Under Maintenance</option>
                <option value="reserved">Reserved</option>
                <option value="blocked">Blocked</option>
                <option value="available">Available</option>
              </FilterSelect>

              <FilterSelect
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                <option value="all">All Locations</option>
                <option value="tower a">Tower A</option>
                <option value="tower b">Tower B</option>
                <option value="tower c">Tower C</option>
                <option value="block 1">Block 1</option>
                <option value="block 2">Block 2</option>
              </FilterSelect>
            </SearchAndFilters>

            <ActionButtons>
              <Button onClick={handleExport}>
                <FaDownload />
                Export
              </Button>
              <Button variant="primary">
                <FaPlus />
                Add New Unit
              </Button>
            </ActionButtons>
          </TopControls>

          {/* Bulk Actions Bar */}
          <BulkActionsBar visible={tableConfig.selectedItems.length > 0}>
            <BulkActionsLeft>
              <span>{tableConfig.selectedItems.length} items selected</span>
            </BulkActionsLeft>
            <BulkActionsRight>
              <BulkActionButton 
                variant="success"
                onClick={() => handleBulkAction({ type: 'activate', unitIds: tableConfig.selectedItems })}
              >
                <FaCheckCircle />
                Activate
              </BulkActionButton>
              <BulkActionButton 
                onClick={() => handleBulkAction({ type: 'deactivate', unitIds: tableConfig.selectedItems })}
              >
                <FaTimes />
                Deactivate
              </BulkActionButton>
              <BulkActionButton 
                variant="danger"
                onClick={() => handleBulkAction({ type: 'delete', unitIds: tableConfig.selectedItems })}
              >
                <FaTrash />
                Delete
              </BulkActionButton>
            </BulkActionsRight>
          </BulkActionsBar>
        </Controls>

        {/* Table */}
        <TableContainer>
          <TableHeader>
            <div>
              <Checkbox
                type="checkbox"
                checked={tableConfig.selectedItems.length === paginatedUnits.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </div>
            <TableHeaderCell sortable onClick={() => handleSort('unitNumber')}>
              Unit Number {renderSortIcon('unitNumber')}
            </TableHeaderCell>
            <TableHeaderCell sortable onClick={() => handleSort('type')}>
              Type {renderSortIcon('type')}
            </TableHeaderCell>
            <TableHeaderCell sortable onClick={() => handleSort('size')}>
              Size {renderSortIcon('size')}
            </TableHeaderCell>
            <TableHeaderCell sortable onClick={() => handleSort('floorNumber')}>
              Floor {renderSortIcon('floorNumber')}
            </TableHeaderCell>
            <TableHeaderCell sortable onClick={() => handleSort('assignedTo.name')}>
              Assigned To {renderSortIcon('assignedTo.name')}
            </TableHeaderCell>
            <TableHeaderCell sortable onClick={() => handleSort('status')}>
              Status {renderSortIcon('status')}
            </TableHeaderCell>
            <TableHeaderCell>
              Location
            </TableHeaderCell>
            <TableHeaderCell sortable onClick={() => handleSort('rentAmount')}>
              Rent {renderSortIcon('rentAmount')}
            </TableHeaderCell>
            <TableHeaderCell>
              Contact
            </TableHeaderCell>
            <TableHeaderCell>
              Rating
            </TableHeaderCell>
            <TableHeaderCell>
              Images
            </TableHeaderCell>
            <TableHeaderCell>
              Actions
            </TableHeaderCell>
          </TableHeader>

          <TableBody>
            {paginatedUnits.length === 0 ? (
              <EmptyState>
                <FaHome className="icon" />
                <div className="title">No Units Found</div>
                <div className="description">
                  {filters.search || filters.type !== 'all' || filters.status !== 'all' 
                    ? 'No units match your current filters. Try adjusting your search criteria.'
                    : 'No units have been added yet. Click "Add New Unit" to get started.'
                  }
                </div>
                <Button variant="primary">
                  <FaPlus />
                  Add First Unit
                </Button>
              </EmptyState>
            ) : (
              paginatedUnits.map((unit) => (
                <TableRow 
                  key={unit.id}
                  selected={tableConfig.selectedItems.includes(unit.id)}
                >
                  <TableCell>
                    <Checkbox
                      type="checkbox"
                      checked={tableConfig.selectedItems.includes(unit.id)}
                      onChange={(e) => handleSelectItem(unit.id, e.target.checked)}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {unit.unitNumber}
                      </div>
                      <StatusBadge status={unit.status}>
                        {unit.status === 'occupied' && <FaCheckCircle />}
                        {unit.status === 'vacant' && <FaExclamationTriangle />}
                        {unit.status === 'under_maintenance' && <FaTools />}
                        {unit.status.replace('_', ' ')}
                      </StatusBadge>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <TypeBadge type={unit.type}>
                      {unit.type === 'apartment' && <FaHome />}
                      {unit.type === 'commercial' && <FaBuilding />}
                      {unit.type.replace('_', ' ')}
                    </TypeBadge>
                  </TableCell>
                  
                  <TableCell>
                    <SizeInfo>
                      <FaRuler />
                      {unit.size.toLocaleString()} sq ft
                    </SizeInfo>
                  </TableCell>
                  
                  <TableCell>
                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                      {unit.floorNumber}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {unit.assignedTo ? (
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                          {unit.assignedTo.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {unit.assignedTo.apartmentNumber}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: '#999', fontStyle: 'italic' }}>Unassigned</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <StatusBadge status={unit.status}>
                      {unit.status.replace('_', ' ')}
                    </StatusBadge>
                  </TableCell>
                  
                  <TableCell>
                    <LocationInfo>
                      <FaMapMarkerAlt />
                      <div>
                        <div>{unit.location.building}</div>
                        <div style={{ fontSize: '11px' }}>{unit.location.wing}</div>
                      </div>
                    </LocationInfo>
                  </TableCell>
                  
                  <TableCell>
                    {unit.rentAmount ? (
                      <div style={{ fontWeight: 'bold' }}>
                        ₹{unit.rentAmount.toLocaleString()}
                      </div>
                    ) : (
                      <span style={{ color: '#999' }}>-</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <div style={{ fontSize: '12px', marginBottom: '2px' }}>
                        {unit.contactPerson.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        <FaPhone style={{ marginRight: '4px' }} />
                        {unit.contactPerson.phoneNumber.slice(-4)}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {unit.feedback.length > 0 ? (
                      <div>
                        {renderRating(getAverageRating(unit.feedback))}
                        <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                          ({unit.feedback.length} review{unit.feedback.length !== 1 ? 's' : ''})
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: '#999', fontSize: '12px' }}>No reviews</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaImages />
                      <span>{unit.images.length}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <ActionButtonGroup>
                      <ActionButton variant="view" title="View Details">
                        <FaEye />
                      </ActionButton>
                      <ActionButton variant="edit" title="Edit Unit">
                        <FaEdit />
                      </ActionButton>
                      <ActionButton variant="delete" title="Delete Unit">
                        <FaTrash />
                      </ActionButton>
                    </ActionButtonGroup>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </TableContainer>

        {/* Pagination */}
        {filteredUnits.length > 0 && (
          <Pagination>
            <PaginationInfo>
              Showing {((tableConfig.currentPage - 1) * tableConfig.itemsPerPage) + 1} to{' '}
              {Math.min(tableConfig.currentPage * tableConfig.itemsPerPage, filteredUnits.length)} of{' '}
              {filteredUnits.length} units
            </PaginationInfo>
            
            <PaginationControls>
              <PageSizeSelect
                value={tableConfig.itemsPerPage}
                onChange={(e) => setTableConfig(prev => ({ 
                  ...prev, 
                  itemsPerPage: parseInt(e.target.value),
                  currentPage: 1
                }))}
              >
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
                <option value={100}>100 per page</option>
              </PageSizeSelect>
              
              <PageButton
                disabled={tableConfig.currentPage === 1}
                onClick={() => setTableConfig(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              >
                <FaChevronLeft />
              </PageButton>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <PageButton
                    key={page}
                    active={page === tableConfig.currentPage}
                    onClick={() => setTableConfig(prev => ({ ...prev, currentPage: page }))}
                  >
                    {page}
                  </PageButton>
                );
              })}
              
              <PageButton
                disabled={tableConfig.currentPage === totalPages}
                onClick={() => setTableConfig(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              >
                <FaChevronRight />
              </PageButton>
            </PaginationControls>
          </Pagination>
        )}
      </Container>
    </PageWrapper>
  );
};

export default SocietyUnitsPage;