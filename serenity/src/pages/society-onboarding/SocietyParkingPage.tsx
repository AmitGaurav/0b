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
  FaCar,
  FaMotorcycle,
  FaMapMarkerAlt,
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
  FaArrowUp,
  FaParking,
  FaShieldAlt,
  FaHome,
  FaUser
} from 'react-icons/fa';

import {
  ParkingSlot,
  SlotStatus,
  SlotType,
  VehicleType,
  ParkingSearchFilters,
  ParkingTableConfig,
  ParkingBulkAction,
  AssignedMember,
  VehicleDetails,
  BookingHistory,
  MaintenanceRecord,
  ParkingImage,
  ParkingStatistics
} from '../../types/society-parking';

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
  grid-template-columns: 40px 1fr 120px 180px 120px 200px 150px 120px 100px 120px;
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
  grid-template-columns: 40px 1fr 120px 180px 120px 200px 150px 120px 100px 120px;
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
const StatusBadge = styled.span<{ status: SlotStatus }>`
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

const TypeBadge = styled.span<{ type: SlotType }>`
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
      case 'covered':
        return `
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[800]};
        `;
      case 'uncovered':
        return `
          background: ${theme.colors.secondary[100]};
          color: ${theme.colors.secondary[800]};
        `;
      case 'visitor':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[800]};
        `;
      case 'reserved':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[800]};
        `;
      case 'disabled':
        return `
          background: ${theme.colors.info[100]};
          color: ${theme.colors.info[800]};
        `;
      case 'electric':
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

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const VehicleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  
  .vehicle-details {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }
  
  .license-plate {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.gray[600]};
    font-family: monospace;
  }
`;

const DurationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
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
const generateMockParkingSlots = (count: number = 50): ParkingSlot[] => {
  const types: SlotType[] = ['covered', 'uncovered', 'visitor', 'reserved', 'disabled', 'electric'];
  const statuses: SlotStatus[] = ['occupied', 'vacant', 'under_maintenance', 'blocked', 'reserved', 'available'];
  const vehicleTypes: VehicleType[] = ['car', 'bike', 'scooter', 'suv', 'truck'];
  const floors = ['Ground', 'Basement 1', 'Basement 2', 'Level 1', 'Level 2'];
  const sections = ['A', 'B', 'C', 'D', 'E'];
  const blocks = ['Block 1', 'Block 2', 'Block 3'];
  
  const carMakes = ['Toyota', 'Honda', 'Maruti', 'Hyundai', 'Ford', 'BMW', 'Audi', 'Mercedes'];
  const bikeModels = ['Activa', 'Splendor', 'Pulsar', 'FZ', 'Duke', 'Classic'];
  const colors = ['Red', 'Blue', 'White', 'Black', 'Silver', 'Gray', 'Green'];

  return Array.from({ length: count }, (_, index) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const floor = floors[Math.floor(Math.random() * floors.length)];
    const section = sections[Math.floor(Math.random() * sections.length)];
    const block = blocks[Math.floor(Math.random() * blocks.length)];
    const slotNumber = `${section}${String(index + 1).padStart(3, '0')}`;
    
    const isOccupied = status === 'occupied';
    const vehicleType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
    
    const vehicleDetails = isOccupied ? {
      id: `vehicle-${index}`,
      make: vehicleType === 'bike' || vehicleType === 'scooter' ? 'Honda' : carMakes[Math.floor(Math.random() * carMakes.length)],
      model: vehicleType === 'bike' || vehicleType === 'scooter' ? bikeModels[Math.floor(Math.random() * bikeModels.length)] : `Model ${Math.floor(Math.random() * 10) + 1}`,
      licensePlate: `DL${Math.floor(Math.random() * 10)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 9000) + 1000}`,
      type: vehicleType,
      color: colors[Math.floor(Math.random() * colors.length)],
      year: 2018 + Math.floor(Math.random() * 6),
      registrationDate: new Date(Date.now() - Math.random() * 365 * 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      insuranceExpiry: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    } : undefined;

    const assignedMember = isOccupied ? {
      id: `member-${index}`,
      name: `Member ${index + 1}`,
      apartmentNumber: `${Math.floor(Math.random() * 20) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 10))}`,
      phoneNumber: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      email: `member${index + 1}@example.com`,
      membershipType: Math.random() > 0.8 ? 'visitor' as const : Math.random() > 0.3 ? 'owner' as const : 'tenant' as const,
      assignedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    } : undefined;

    const monthlyRate = type === 'covered' ? 3000 + Math.floor(Math.random() * 2000) :
                      type === 'electric' ? 4000 + Math.floor(Math.random() * 2000) :
                      type === 'visitor' ? 50 :
                      type === 'disabled' ? 2000 :
                      2000 + Math.floor(Math.random() * 1000);

    const slot: ParkingSlot = {
      id: `slot-${index + 1}`,
      slotNumber,
      type,
      assignedTo: assignedMember,
      status,
      vehicleDetails,
      parkingDuration: isOccupied ? {
        startTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        totalHours: Math.floor(Math.random() * 720) + 24
      } : undefined,
      location: {
        floor,
        section,
        block,
        coordinates: {
          x: Math.floor(Math.random() * 100),
          y: Math.floor(Math.random() * 100)
        }
      },
      bookingHistory: isOccupied ? [{
        id: `booking-${index}`,
        memberName: assignedMember!.name,
        apartmentNumber: assignedMember!.apartmentNumber,
        vehicleDetails: vehicleDetails!,
        startDate: assignedMember!.assignedDate,
        duration: Math.floor(Math.random() * 12) + 6,
        amount: monthlyRate,
        status: 'active',
        bookingType: assignedMember!.membershipType === 'visitor' ? 'temporary' : 'permanent'
      }] : [],
      images: [{
        id: `image-${index}`,
        url: `https://example.com/slot-${index + 1}.jpg`,
        alt: `Parking Slot ${slotNumber}`,
        type: 'slot_view',
        uploadedDate: new Date().toISOString().split('T')[0],
        uploadedBy: 'Admin'
      }],
      maintenanceRecords: [{
        id: `maintenance-${index}`,
        type: 'cleaning',
        description: 'Regular cleaning and maintenance',
        scheduledDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'scheduled',
        assignedTo: `Maintenance Team ${Math.floor(Math.random() * 3) + 1}`
      }],
      monthlyRate,
      hourlyRate: type === 'visitor' ? 50 : undefined,
      features: [
        'CCTV Surveillance',
        type === 'covered' ? 'Covered Parking' : 'Open Parking',
        type === 'electric' ? 'Electric Charging' : 'Standard Power',
        'Security Patrol',
        '24/7 Access'
      ],
      dimensions: {
        length: vehicleType === 'bike' || vehicleType === 'scooter' ? 2.5 : 5.0,
        width: vehicleType === 'bike' || vehicleType === 'scooter' ? 1.2 : 2.5,
        height: type === 'covered' ? 2.5 : undefined
      },
      accessibility: {
        disabled: type === 'disabled',
        wheelchairAccess: type === 'disabled' || Math.random() > 0.7,
        proximityToElevator: Math.random() > 0.5
      },
      lastUpdated: new Date().toISOString().split('T')[0],
      createdDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdBy: 'Admin',
      updatedBy: 'Admin'
    };

    return slot;
  });
};

const SocietyParkingPage: React.FC = () => {
  // State management
  const [slots] = useState<ParkingSlot[]>(generateMockParkingSlots(50));
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<ParkingSearchFilters>({
    search: '',
    type: 'all',
    status: 'all',
    location: 'all',
    assignedMember: 'all',
    floor: 'all',
    vehicleType: 'all',
    membershipType: 'all'
  });
  
  const [tableConfig, setTableConfig] = useState<ParkingTableConfig>({
    sortBy: 'slotNumber',
    sortDirection: 'asc',
    currentPage: 1,
    itemsPerPage: 10,
    selectedItems: []
  });

  // Computed values
  const statistics: ParkingStatistics = useMemo(() => {
    const totalSlots = slots.length;
    const occupiedSlots = slots.filter(s => s.status === 'occupied').length;
    const vacantSlots = slots.filter(s => s.status === 'vacant').length;
    const underMaintenanceSlots = slots.filter(s => s.status === 'under_maintenance').length;
    const coveredSlots = slots.filter(s => s.type === 'covered').length;
    const uncoveredSlots = slots.filter(s => s.type === 'uncovered').length;
    const visitorSlots = slots.filter(s => s.type === 'visitor').length;
    const occupancyRate = Math.round((occupiedSlots / totalSlots) * 100);
    const occupiedWithRates = slots.filter(s => s.status === 'occupied' && s.monthlyRate);
    const monthlyRevenue = occupiedWithRates.reduce((sum, s) => sum + (s.monthlyRate || 0), 0);
    const averageOccupancyTime = Math.round(
      slots.filter(s => s.parkingDuration?.totalHours)
           .reduce((sum, s) => sum + (s.parkingDuration?.totalHours || 0), 0) / 
      slots.filter(s => s.parkingDuration?.totalHours).length || 0
    );
    const maintenancePending = slots.reduce((count, s) => 
      count + s.maintenanceRecords.filter(m => m.status === 'scheduled').length, 0
    );

    return {
      totalSlots,
      occupiedSlots,
      vacantSlots,
      underMaintenanceSlots,
      coveredSlots,
      uncoveredSlots,
      visitorSlots,
      occupancyRate,
      monthlyRevenue,
      averageOccupancyTime,
      maintenancePending
    };
  }, [slots]);

  // Filter and search logic
  const filteredSlots = useMemo(() => {
    return slots.filter(slot => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          slot.slotNumber.toLowerCase().includes(searchTerm) ||
          slot.type.toLowerCase().includes(searchTerm) ||
          slot.assignedTo?.name.toLowerCase().includes(searchTerm) ||
          slot.assignedTo?.apartmentNumber.toLowerCase().includes(searchTerm) ||
          slot.vehicleDetails?.licensePlate.toLowerCase().includes(searchTerm) ||
          slot.location.floor.toLowerCase().includes(searchTerm);
        
        if (!matchesSearch) return false;
      }

      // Type filter
      if (filters.type !== 'all' && slot.type !== filters.type) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && slot.status !== filters.status) {
        return false;
      }

      // Location filter
      if (filters.location !== 'all' && !slot.location.floor.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      // Assigned member filter
      if (filters.assignedMember !== 'all' && 
          (!slot.assignedTo || !slot.assignedTo.name.toLowerCase().includes(filters.assignedMember.toLowerCase()))) {
        return false;
      }

      // Vehicle type filter
      if (filters.vehicleType !== 'all' && 
          (!slot.vehicleDetails || slot.vehicleDetails.type !== filters.vehicleType)) {
        return false;
      }

      return true;
    });
  }, [slots, filters]);

  // Pagination logic
  const paginatedSlots = useMemo(() => {
    const startIndex = (tableConfig.currentPage - 1) * tableConfig.itemsPerPage;
    const endIndex = startIndex + tableConfig.itemsPerPage;
    return filteredSlots.slice(startIndex, endIndex);
  }, [filteredSlots, tableConfig.currentPage, tableConfig.itemsPerPage]);

  const totalPages = Math.ceil(filteredSlots.length / tableConfig.itemsPerPage);

  // Event handlers
  const handleSearch = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    setTableConfig(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const handleFilterChange = useCallback((key: keyof ParkingSearchFilters, value: any) => {
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
      selectedItems: checked ? paginatedSlots.map(s => s.id) : []
    }));
  }, [paginatedSlots]);

  const handleSelectItem = useCallback((slotId: string, checked: boolean) => {
    setTableConfig(prev => ({
      ...prev,
      selectedItems: checked
        ? [...prev.selectedItems, slotId]
        : prev.selectedItems.filter(id => id !== slotId)
    }));
  }, []);

  const handleBulkAction = useCallback((action: ParkingBulkAction) => {
    console.log('Bulk action:', action);
    // Implement bulk action logic
    setTableConfig(prev => ({ ...prev, selectedItems: [] }));
  }, []);

  const handleExport = useCallback(() => {
    // Implement export logic
    console.log('Exporting parking data...');
  }, []);

  const renderSortIcon = (field: string) => {
    if (tableConfig.sortBy !== field) return <FaSort />;
    return tableConfig.sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const formatDuration = (hours: number) => {
    if (hours < 24) {
      return `${hours}h`;
    } else if (hours < 24 * 30) {
      return `${Math.floor(hours / 24)}d`;
    } else {
      return `${Math.floor(hours / (24 * 30))}m`;
    }
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
            <Title>Society Parking Management</Title>
            <Subtitle>Configure and manage parking facilities, including allocation of parking slots to residents and visitors</Subtitle>
          </HeaderContent>
        </Header>

        {/* Statistics Dashboard */}
        <StatsGrid>
          <StatCard>
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-label">Total Slots</div>
                <div className="stat-value">{statistics.totalSlots.toLocaleString()}</div>
              </div>
              <div className="stat-icon" style={{ background: '#3B82F6' }}>
                <FaParking className="stat-icon" />
              </div>
            </div>
            <div className="stat-change positive">
              <FaArrowUp />
              <span>+3.2% from last month</span>
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-label">Occupied</div>
                <div className="stat-value">{statistics.occupiedSlots.toLocaleString()}</div>
              </div>
              <div className="stat-icon" style={{ background: '#10B981' }}>
                <FaCar />
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
                <div className="stat-label">Available</div>
                <div className="stat-value">{statistics.vacantSlots.toLocaleString()}</div>
              </div>
              <div className="stat-icon" style={{ background: '#F59E0B' }}>
                <FaCheckCircle />
              </div>
            </div>
            <div className="stat-change neutral">
              <span>Ready for assignment</span>
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-label">Under Maintenance</div>
                <div className="stat-value">{statistics.underMaintenanceSlots.toLocaleString()}</div>
              </div>
              <div className="stat-icon" style={{ background: '#EF4444' }}>
                <FaTools />
              </div>
            </div>
            <div className="stat-change neutral">
              <FaClock />
              <span>{statistics.maintenancePending} pending</span>
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-label">Covered Slots</div>
                <div className="stat-value">{statistics.coveredSlots.toLocaleString()}</div>
              </div>
              <div className="stat-icon" style={{ background: '#8B5CF6' }}>
                <FaShieldAlt />
              </div>
            </div>
            <div className="stat-change positive">
              <span>Premium parking spaces</span>
            </div>
          </StatCard>

          <StatCard>
            <div className="stat-header">
              <div className="stat-content">
                <div className="stat-label">Monthly Revenue</div>
                <div className="stat-value">₹{(statistics.monthlyRevenue / 100000).toFixed(1)}L</div>
              </div>
              <div className="stat-icon" style={{ background: '#06B6D4' }}>
                <FaMoneyBillWave />
              </div>
            </div>
            <div className="stat-change positive">
              <FaArrowUp />
              <span>+8.4% from last month</span>
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
                  placeholder="Search by slot number, type, or assigned member..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </SearchInput>

              <FilterSelect
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="covered">Covered</option>
                <option value="uncovered">Uncovered</option>
                <option value="visitor">Visitor</option>
                <option value="reserved">Reserved</option>
                <option value="disabled">Disabled Access</option>
                <option value="electric">Electric Charging</option>
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
                <option value="all">All Floors</option>
                <option value="ground">Ground Floor</option>
                <option value="basement 1">Basement 1</option>
                <option value="basement 2">Basement 2</option>
                <option value="level 1">Level 1</option>
                <option value="level 2">Level 2</option>
              </FilterSelect>
            </SearchAndFilters>

            <ActionButtons>
              <Button onClick={handleExport}>
                <FaDownload />
                Export
              </Button>
              <Button variant="primary">
                <FaPlus />
                Add New Slot
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
                onClick={() => handleBulkAction({ type: 'activate', slotIds: tableConfig.selectedItems })}
              >
                <FaCheckCircle />
                Activate
              </BulkActionButton>
              <BulkActionButton 
                onClick={() => handleBulkAction({ type: 'deactivate', slotIds: tableConfig.selectedItems })}
              >
                <FaTimes />
                Deactivate
              </BulkActionButton>
              <BulkActionButton 
                variant="danger"
                onClick={() => handleBulkAction({ type: 'delete', slotIds: tableConfig.selectedItems })}
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
                checked={tableConfig.selectedItems.length === paginatedSlots.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </div>
            <TableHeaderCell sortable onClick={() => handleSort('slotNumber')}>
              Slot Number {renderSortIcon('slotNumber')}
            </TableHeaderCell>
            <TableHeaderCell sortable onClick={() => handleSort('type')}>
              Type {renderSortIcon('type')}
            </TableHeaderCell>
            <TableHeaderCell sortable onClick={() => handleSort('assignedTo.name')}>
              Assigned To {renderSortIcon('assignedTo.name')}
            </TableHeaderCell>
            <TableHeaderCell sortable onClick={() => handleSort('status')}>
              Status {renderSortIcon('status')}
            </TableHeaderCell>
            <TableHeaderCell>
              Vehicle Details
            </TableHeaderCell>
            <TableHeaderCell>
              Duration
            </TableHeaderCell>
            <TableHeaderCell>
              Location
            </TableHeaderCell>
            <TableHeaderCell>
              Images
            </TableHeaderCell>
            <TableHeaderCell>
              Actions
            </TableHeaderCell>
          </TableHeader>

          <TableBody>
            {paginatedSlots.length === 0 ? (
              <EmptyState>
                <FaParking className="icon" />
                <div className="title">No Parking Slots Found</div>
                <div className="description">
                  {filters.search || filters.type !== 'all' || filters.status !== 'all' 
                    ? 'No parking slots match your current filters. Try adjusting your search criteria.'
                    : 'No parking slots have been added yet. Click "Add New Slot" to get started.'
                  }
                </div>
                <Button variant="primary">
                  <FaPlus />
                  Add First Slot
                </Button>
              </EmptyState>
            ) : (
              paginatedSlots.map((slot) => (
                <TableRow 
                  key={slot.id}
                  selected={tableConfig.selectedItems.includes(slot.id)}
                >
                  <TableCell>
                    <Checkbox
                      type="checkbox"
                      checked={tableConfig.selectedItems.includes(slot.id)}
                      onChange={(e) => handleSelectItem(slot.id, e.target.checked)}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        {slot.slotNumber}
                      </div>
                      <StatusBadge status={slot.status}>
                        {slot.status === 'occupied' && <FaCheckCircle />}
                        {slot.status === 'vacant' && <FaExclamationTriangle />}
                        {slot.status === 'under_maintenance' && <FaTools />}
                        {slot.status.replace('_', ' ')}
                      </StatusBadge>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <TypeBadge type={slot.type}>
                      {slot.type === 'covered' && <FaShieldAlt />}
                      {slot.type === 'visitor' && <FaUser />}
                      {slot.type.replace('_', ' ')}
                    </TypeBadge>
                  </TableCell>
                  
                  <TableCell>
                    {slot.assignedTo ? (
                      <div>
                        <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                          {slot.assignedTo.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          <FaHome style={{ marginRight: '4px' }} />
                          {slot.assignedTo.apartmentNumber}
                        </div>
                      </div>
                    ) : (
                      <span style={{ color: '#999', fontStyle: 'italic' }}>Unassigned</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <StatusBadge status={slot.status}>
                      {slot.status.replace('_', ' ')}
                    </StatusBadge>
                  </TableCell>
                  
                  <TableCell>
                    {slot.vehicleDetails ? (
                      <VehicleInfo>
                        <div className="vehicle-details">
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {slot.vehicleDetails.type === 'bike' || slot.vehicleDetails.type === 'scooter' ? 
                              <FaMotorcycle /> : <FaCar />}
                            {slot.vehicleDetails.make} {slot.vehicleDetails.model}
                          </span>
                        </div>
                        <div className="license-plate">
                          {slot.vehicleDetails.licensePlate}
                        </div>
                      </VehicleInfo>
                    ) : (
                      <span style={{ color: '#999', fontSize: '12px' }}>No vehicle</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {slot.parkingDuration?.totalHours ? (
                      <DurationInfo>
                        <FaClock />
                        {formatDuration(slot.parkingDuration.totalHours)}
                      </DurationInfo>
                    ) : (
                      <span style={{ color: '#999', fontSize: '12px' }}>-</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <LocationInfo>
                      <FaMapMarkerAlt />
                      <div>
                        <div>{slot.location.floor}</div>
                        <div style={{ fontSize: '11px' }}>{slot.location.section}-{slot.location.block}</div>
                      </div>
                    </LocationInfo>
                  </TableCell>
                  
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FaImages />
                      <span>{slot.images.length}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <ActionButtonGroup>
                      <ActionButton variant="view" title="View Details">
                        <FaEye />
                      </ActionButton>
                      <ActionButton variant="edit" title="Edit Slot">
                        <FaEdit />
                      </ActionButton>
                      <ActionButton variant="delete" title="Delete Slot">
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
        {filteredSlots.length > 0 && (
          <Pagination>
            <PaginationInfo>
              Showing {((tableConfig.currentPage - 1) * tableConfig.itemsPerPage) + 1} to{' '}
              {Math.min(tableConfig.currentPage * tableConfig.itemsPerPage, filteredSlots.length)} of{' '}
              {filteredSlots.length} slots
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

export default SocietyParkingPage;