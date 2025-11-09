import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { 
  FiUser, 
  FiSearch, 
  FiEdit, 
  FiEye, 
  FiStar,
  FiPhone,
  FiMail,
  FiMapPin,
  FiCalendar,
  FiTruck,
  FiFilter,
  FiGrid,
  FiList,
  FiSettings
} from 'react-icons/fi';
import VendorProfileModal from './VendorProfileModal';
import { toast } from 'react-toastify';

interface Vendor {
  id: number;
  name: string;
  category: string;
  phone: string;
  email: string;
  rating: number;
  totalJobs: number;
  completedJobs: number;
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

const Badge = styled.span<{ variant?: 'category' | 'status' | 'availability' }>`
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
      case 'availability':
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

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary'; view?: 'grid' | 'list' }>`
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
    address: '123 Main Street, Bangalore',
    website: 'www.quickfix.com',
    description: 'Expert plumbing services for residential and commercial needs',
    specialties: ['Emergency Repairs', 'Pipe Installation', 'Bathroom Fitting'],
    priceRange: 'mid-range',
    availability: 'available',
    verificationStatus: 'verified',
    joinedDate: new Date('2022-01-15'),
    lastActivity: new Date(),
    avgResponseTime: 2,
    documents: ['registration.pdf', 'insurance.pdf'],
    emergencyAvailable: true,
    contractType: 'hourly'
  },
  {
    id: 2,
    name: 'PowerTech Electricians',
    category: 'electrical',
    phone: '+91 9876543211',
    email: 'info@powertech.com',
    rating: 4.6,
    totalJobs: 89,
    completedJobs: 84,
    societyId: 1,
    societyName: 'SNN Raj Serenity',
    address: '456 Electric Avenue, Bangalore',
    website: 'www.powertech.com',
    description: 'Professional electrical services and maintenance',
    specialties: ['Wiring', 'Panel Installation', 'Emergency Repairs'],
    priceRange: 'premium',
    availability: 'busy',
    verificationStatus: 'verified',
    joinedDate: new Date('2022-03-20'),
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    avgResponseTime: 1,
    documents: ['license.pdf', 'certifications.pdf'],
    emergencyAvailable: true,
    contractType: 'fixed'
  },
  {
    id: 3,
    name: 'EcoClean Solutions',
    category: 'cleaning',
    phone: '+91 9876543212',
    email: 'info@ecoclean.com',
    rating: 4.9,
    totalJobs: 234,
    completedJobs: 228,
    societyId: 1,
    societyName: 'SNN Raj Serenity',
    address: '789 Clean Street, Bangalore',
    website: 'www.ecoclean.com',
    description: 'Eco-friendly cleaning services for homes and offices',
    specialties: ['Deep Cleaning', 'Sanitization', 'Carpet Cleaning'],
    priceRange: 'budget',
    availability: 'available',
    verificationStatus: 'verified',
    joinedDate: new Date('2021-11-10'),
    lastActivity: new Date(),
    avgResponseTime: 1,
    documents: ['registration.pdf', 'eco-cert.pdf'],
    emergencyAvailable: true,
    contractType: 'contract'
  }
];

const VendorProfileManagementPage: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const categories = [
    'all', 'plumbing', 'electrical', 'cleaning', 'security', 'gardening', 
    'carpentry', 'painting', 'pest-control', 'appliance-repair'
  ];

  const statusOptions = [
    'all', 'verified', 'pending', 'rejected'
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'rating', label: 'Rating' },
    { value: 'totalJobs', label: 'Total Jobs' },
    { value: 'joinedDate', label: 'Join Date' }
  ];

  useEffect(() => {
    // Simulate API call
    const loadVendors = async () => {
      setLoading(true);
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVendors(mockVendors);
      setLoading(false);
    };
    
    loadVendors();
  }, []);

  const filteredVendors = useMemo(() => {
    return vendors.filter(vendor => {
      const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           vendor.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || vendor.verificationStatus === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => {
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
  }, [vendors, searchQuery, categoryFilter, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const total = vendors.length;
    const verified = vendors.filter(v => v.verificationStatus === 'verified').length;
    const active = vendors.filter(v => v.availability === 'available').length;
    const avgRating = vendors.length > 0 
      ? vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length 
      : 0;

    return { total, verified, active, avgRating };
  }, [vendors]);

  const handleEditProfile = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowProfileModal(true);
  };

  const handleViewProfile = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowProfileModal(true);
  };

  const handleUpdateProfile = (updatedVendor: Vendor) => {
    setVendors(prev => prev.map(v => v.id === updatedVendor.id ? updatedVendor : v));
    setSelectedVendor(null);
    setShowProfileModal(false);
    toast.success('Vendor profile updated successfully');
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <FiStar key={i} size={12} fill={i < Math.floor(rating) ? 'currentColor' : 'none'} />
    ));
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'status';
      case 'busy': return 'availability';
      default: return 'category';
    }
  };

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>
            <FiSettings size={32} />
            Vendor Profile Management
          </Title>
        </Header>
        
        <ContentArea view={viewMode}>
          {Array(6).fill(0).map((_, i) => (
            <div key={i} style={{
              background: '#f3f4f6',
              borderRadius: '24px',
              height: '300px',
              animation: 'pulse 1.5s ease-in-out infinite alternate'
            }} />
          ))}
        </ContentArea>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <FiSettings size={32} />
          Vendor Profile Management
        </Title>
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
              <StatValue>{stats.active}</StatValue>
              <StatLabel>Available</StatLabel>
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
            {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search criteria or filters.'
              : 'No vendors available for profile management.'}
          </p>
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
                    <Badge variant={getAvailabilityColor(vendor.availability)}>
                      {vendor.availability}
                    </Badge>
                    {vendor.verificationStatus === 'verified' && (
                      <Badge variant="status">Verified</Badge>
                    )}
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
                  <ContactItem>
                    <FiCalendar size={14} />
                    Joined {vendor.joinedDate.toLocaleDateString()}
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
                <ActionButton view={viewMode} onClick={() => handleViewProfile(vendor)}>
                  <FiEye size={14} />
                  View
                </ActionButton>
                <ActionButton view={viewMode} variant="primary" onClick={() => handleEditProfile(vendor)}>
                  <FiEdit size={14} />
                  Edit Profile
                </ActionButton>
              </ActionButtons>
            </VendorCard>
          ))}
        </ContentArea>
      )}

      <VendorProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        vendor={selectedVendor}
        onUpdate={handleUpdateProfile}
      />
    </Container>
  );
};

export default VendorProfileManagementPage;