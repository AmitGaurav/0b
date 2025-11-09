import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiCheckCircle, FiXCircle, FiSearch, FiEye, FiUserCheck, FiAlertCircle } from 'react-icons/fi';
import VendorVerificationModal from './VendorVerificationModal';
import { toast } from 'react-toastify';

interface Vendor {
  id: number;
  name: string;
  category: string;
  phone: string;
  email: string;
  address: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  submittedAt: Date;
  documents: string[];
  description: string;
}

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

const SearchContainer = styled.div`
  position: relative;
  min-width: 300px;
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

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: ${({ theme }) => theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray[400]};
  pointer-events: none;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
`;

const Th = styled.th`
  background: ${({ theme }) => theme.colors.gray[50]};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  padding: ${({ theme }) => theme.spacing[3]};
  text-align: left;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.gray[800]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const StatusBadge = styled.span<{ status: 'pending' | 'verified' | 'rejected' }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  text-transform: capitalize;
  ${({ status, theme }) => {
    switch (status) {
      case 'verified':
        return `background: ${theme.colors.success[100]}; color: ${theme.colors.success[700]};`;
      case 'rejected':
        return `background: ${theme.colors.error[100]}; color: ${theme.colors.error[700]};`;
      default:
        return `background: ${theme.colors.warning[100]}; color: ${theme.colors.warning[700]};`;
    }
  }}
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[700]};
  transition: ${({ theme }) => theme.transition.all};
  &:hover {
    background: ${({ theme }) => theme.colors.primary[100]};
    color: ${({ theme }) => theme.colors.primary[900]};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const mockVendors: Vendor[] = [
  {
    id: 1,
    name: 'QuickFix Plumbers',
    category: 'Plumbing',
    phone: '+91 9876543210',
    email: 'contact@quickfix.com',
    address: '123 Main St, Bangalore',
    verificationStatus: 'pending',
    submittedAt: new Date('2025-09-20'),
    documents: ['registration.pdf', 'insurance.pdf'],
    description: 'Expert plumbing services for residential and commercial needs.'
  },
  {
    id: 2,
    name: 'SecureGuard Agency',
    category: 'Security',
    phone: '+91 9876543213',
    email: 'contact@secureguard.com',
    address: '321 Safety Blvd, Bangalore',
    verificationStatus: 'pending',
    submittedAt: new Date('2025-09-18'),
    documents: ['license.pdf', 'training.pdf'],
    description: 'Professional security services with trained personnel.'
  },
  {
    id: 3,
    name: 'EcoClean Solutions',
    category: 'Cleaning',
    phone: '+91 9876543212',
    email: 'info@ecoclean.com',
    address: '789 Clean Street, Bangalore',
    verificationStatus: 'verified',
    submittedAt: new Date('2025-09-10'),
    documents: ['registration.pdf', 'eco-cert.pdf'],
    description: 'Eco-friendly cleaning services for homes and offices.'
  }
];

const VendorVerificationPage: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState('');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setVendors(mockVendors);
  }, []);

  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.category.toLowerCase().includes(search.toLowerCase()) ||
    v.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleVerify = (vendorId: number) => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, verificationStatus: 'verified' } : v));
    toast.success('Vendor verified successfully');
  };

  const handleReject = (vendorId: number) => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, verificationStatus: 'rejected' } : v));
    toast.error('Vendor rejected');
  };

  const handleReview = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setShowModal(true);
  };

  return (
    <Container>
      <Header>
        <Title>
          <FiUserCheck size={32} />
          Vendor Verification
        </Title>
        <SearchContainer>
          <SearchIcon size={18} />
          <SearchInput
            type="text"
            placeholder="Search vendors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </SearchContainer>
      </Header>

      {filteredVendors.length === 0 ? (
        <EmptyState>
          <FiAlertCircle size={48} />
          <h3>No vendors found</h3>
          <p>Try adjusting your search or check back later.</p>
        </EmptyState>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Category</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Submitted</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map(vendor => (
              <tr key={vendor.id}>
                <Td>{vendor.name}</Td>
                <Td>{vendor.category}</Td>
                <Td>{vendor.email}</Td>
                <Td>{vendor.phone}</Td>
                <Td>{vendor.submittedAt.toLocaleDateString()}</Td>
                <Td>
                  <StatusBadge status={vendor.verificationStatus}>
                    {vendor.verificationStatus}
                  </StatusBadge>
                </Td>
                <Td>
                  <ActionButton onClick={() => handleReview(vendor)}>
                    <FiEye size={16} /> Review
                  </ActionButton>
                  {vendor.verificationStatus === 'pending' && (
                    <>
                      <ActionButton onClick={() => handleVerify(vendor.id)}>
                        <FiCheckCircle size={16} /> Verify
                      </ActionButton>
                      <ActionButton onClick={() => handleReject(vendor.id)}>
                        <FiXCircle size={16} /> Reject
                      </ActionButton>
                    </>
                  )}
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <VendorVerificationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        vendor={selectedVendor}
        onVerify={handleVerify}
        onReject={handleReject}
      />
    </Container>
  );
};

export default VendorVerificationPage;
