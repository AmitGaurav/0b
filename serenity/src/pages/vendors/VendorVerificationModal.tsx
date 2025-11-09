import React from 'react';
import styled from 'styled-components';
import { 
  FiX, 
  FiCheckCircle, 
  FiXCircle, 
  FiFileText, 
  FiUser, 
  FiPhone, 
  FiMail, 
  FiMapPin 
} from 'react-icons/fi';

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

interface VendorVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
  onVerify: (vendorId: number) => void;
  onReject: (vendorId: number) => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.boxShadow.xl};
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing[1]};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray[400]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    color: ${({ theme }) => theme.colors.gray[600]};
    background: ${({ theme }) => theme.colors.gray[100]};
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SectionTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing[4]} 0;
  color: ${({ theme }) => theme.colors.gray[800]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const InfoLabel = styled.span`
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.gray[900]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[700]};
  line-height: 1.6;
`;

const DocumentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const DocumentName = styled.span`
  flex: 1;
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const StatusBadge = styled.span<{ status: 'pending' | 'verified' | 'rejected' }>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
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

const Footer = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Button = styled.button<{ variant?: 'primary' | 'success' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  border: 1px solid;

  ${({ variant = 'primary', theme }) => {
    switch (variant) {
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

const VendorVerificationModal: React.FC<VendorVerificationModalProps> = ({
  isOpen,
  onClose,
  vendor,
  onVerify,
  onReject
}) => {
  if (!isOpen || !vendor) return null;

  const handleVerify = () => {
    onVerify(vendor.id);
    onClose();
  };

  const handleReject = () => {
    onReject(vendor.id);
    onClose();
  };

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Modal>
        <Header>
          <Title>Vendor Verification Details</Title>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </Header>

        <Content>
          <Section>
            <SectionTitle>
              <FiUser size={20} />
              Basic Information
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>Name:</InfoLabel>
                <InfoValue>{vendor.name}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Category:</InfoLabel>
                <InfoValue>{vendor.category}</InfoValue>
              </InfoItem>
              <InfoItem>
                <FiPhone size={16} />
                <InfoValue>{vendor.phone}</InfoValue>
              </InfoItem>
              <InfoItem>
                <FiMail size={16} />
                <InfoValue>{vendor.email}</InfoValue>
              </InfoItem>
              <div style={{ gridColumn: '1 / -1' }}>
                <InfoItem>
                  <FiMapPin size={16} />
                  <InfoValue>{vendor.address}</InfoValue>
                </InfoItem>
              </div>
              <InfoItem>
                <InfoLabel>Submitted:</InfoLabel>
                <InfoValue>{vendor.submittedAt.toLocaleDateString()}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Status:</InfoLabel>
                <StatusBadge status={vendor.verificationStatus}>
                  {vendor.verificationStatus}
                </StatusBadge>
              </InfoItem>
            </InfoGrid>
          </Section>

          <Section>
            <SectionTitle>Description</SectionTitle>
            <Description>{vendor.description}</Description>
          </Section>

          <Section>
            <SectionTitle>
              <FiFileText size={20} />
              Documents Submitted
            </SectionTitle>
            <DocumentList>
              {vendor.documents.map((doc, index) => (
                <DocumentItem key={index}>
                  <FiFileText size={16} />
                  <DocumentName>{doc}</DocumentName>
                  <Button variant="primary">View</Button>
                </DocumentItem>
              ))}
            </DocumentList>
          </Section>
        </Content>

        <Footer>
          <Button onClick={onClose}>Close</Button>
          {vendor.verificationStatus === 'pending' && (
            <>
              <Button variant="danger" onClick={handleReject}>
                <FiXCircle size={16} />
                Reject
              </Button>
              <Button variant="success" onClick={handleVerify}>
                <FiCheckCircle size={16} />
                Verify
              </Button>
            </>
          )}
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default VendorVerificationModal;
