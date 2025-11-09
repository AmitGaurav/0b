import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiTruck, FiPlus, FiEdit, FiTrash2, FiPhone, FiMail, FiStar } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const Container = styled.div`
  max-width: 1200px;
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

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[600]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[700]};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.boxShadow.md};
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const Tab = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: none;
  background: none;
  color: ${({ theme, active }) => active ? theme.colors.primary[600] : theme.colors.gray[600]};
  font-weight: ${({ theme, active }) => active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
  border-bottom: 2px solid ${({ theme, active }) => active ? theme.colors.primary[600] : 'transparent'};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const VendorCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.boxShadow.lg};
  }
`;

const VendorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
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

const VendorCategory = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[700]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.warning[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ContactInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const ActionButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[700]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[300]};
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

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
}

const VendorsPage: React.FC = () => {
  const { user } = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const categories = ['all', 'plumbing', 'electrical', 'cleaning', 'security', 'gardening'];

  // Mock data for demonstration
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
        societyId: 1,
        societyName: 'SNN Raj Serenity'
      },
      {
        id: 2,
        name: 'PowerUp Electricians',
        category: 'electrical',
        phone: '+91 9876543211',
        email: 'info@powerup.com',
        rating: 4.6,
        totalJobs: 89,
        societyId: 1,
        societyName: 'SNN Raj Serenity'
      },
      {
        id: 3,
        name: 'CleanPro Services',
        category: 'cleaning',
        phone: '+91 9876543212',
        email: 'hello@cleanpro.com',
        rating: 4.9,
        totalJobs: 234,
        societyId: 2,
        societyName: 'Brigade Meadows'
      },
      {
        id: 4,
        name: 'SecureGuard Agency',
        category: 'security',
        phone: '+91 9876543213',
        email: 'contact@secureguard.com',
        rating: 4.7,
        totalJobs: 78,
        societyId: 1,
        societyName: 'SNN Raj Serenity'
      }
    ];

    setTimeout(() => {
      setVendors(mockVendors);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredVendors = vendors.filter(vendor => 
    activeTab === 'all' || vendor.category === activeTab
  );

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <FiStar key={i} size={12} fill={i < rating ? 'currentColor' : 'none'} />
    ));
  };

  if (loading) {
    return (
      <Container>
        <Title>
          <FiTruck size={32} />
          Vendors
        </Title>
        <EmptyState>Loading vendors...</EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <FiTruck size={32} />
          Vendors
        </Title>
        <AddButton>
          <FiPlus size={16} />
          Add Vendor
        </AddButton>
      </Header>

      <FilterTabs>
        {categories.map((category) => (
          <Tab
            key={category}
            active={activeTab === category}
            onClick={() => setActiveTab(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Tab>
        ))}
      </FilterTabs>

      {filteredVendors.length === 0 ? (
        <EmptyState>
          <FiTruck size={64} />
          <h3>No vendors found</h3>
          <p>Get started by adding your first vendor.</p>
        </EmptyState>
      ) : (
        <Grid>
          {filteredVendors.map((vendor) => (
            <VendorCard key={vendor.id}>
              <VendorHeader>
                <VendorInfo>
                  <VendorName>{vendor.name}</VendorName>
                  <VendorCategory>{vendor.category}</VendorCategory>
                  <Rating>
                    {renderStars(Math.floor(vendor.rating))}
                    <span>{vendor.rating}</span>
                    <span>({vendor.totalJobs} jobs)</span>
                  </Rating>
                </VendorInfo>
              </VendorHeader>

              <ContactInfo>
                <ContactItem>
                  <FiPhone size={14} />
                  {vendor.phone}
                </ContactItem>
                <ContactItem>
                  <FiMail size={14} />
                  {vendor.email}
                </ContactItem>
                <ContactItem>
                  <FiTruck size={14} />
                  {vendor.societyName}
                </ContactItem>
              </ContactInfo>

              <ActionButtons>
                <ActionButton>
                  <FiPhone size={14} />
                  Contact
                </ActionButton>
                <ActionButton>
                  <FiEdit size={14} />
                  Edit
                </ActionButton>
                <ActionButton>
                  <FiTrash2 size={14} />
                  Remove
                </ActionButton>
              </ActionButtons>
            </VendorCard>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default VendorsPage;
