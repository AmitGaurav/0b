import React from 'react';
import styled from 'styled-components';
import {
  FiX,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiGlobe,
  FiStar,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiCheck,
  FiCheckCircle,
  FiAlertCircle,
  FiXCircle,
  FiTool,
  FiFileText,
  FiShield,
  FiActivity,
  FiTrendingUp,
  FiAward,
  FiDownload
} from 'react-icons/fi';
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

interface VendorViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
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
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  width: 90vw;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.boxShadow.xl};
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[50]} 0%, ${({ theme }) => theme.colors.white} 100%);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const VendorAvatar = styled.div`
  width: 64px;
  height: 64px;
  background: ${({ theme }) => theme.colors.primary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const VendorBasicInfo = styled.div`
  flex: 1;
`;

const VendorName = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const VendorMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Badge = styled.span<{ variant?: 'category' | 'status' | 'availability' | 'price' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.025em;

  ${({ variant, theme }) => {
    switch (variant) {
      case 'category':
        return `
          background: ${theme.colors.info[100]};
          color: ${theme.colors.info[700]};
        `;
      case 'status':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
        `;
      case 'availability':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
        `;
      case 'price':
        return `
          background: ${theme.colors.secondary[100]};
          color: ${theme.colors.secondary[700]};
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[700]};
        `;
    }
  }}
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled(FiStar)<{ filled: boolean }>`
  color: ${({ filled, theme }) => filled ? theme.colors.warning[400] : theme.colors.gray[300]};
  fill: ${({ filled, theme }) => filled ? theme.colors.warning[400] : 'none'};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.gray[600]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[200]};
    color: ${({ theme }) => theme.colors.gray[800]};
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding-bottom: ${({ theme }) => theme.spacing[2]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const InfoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.primary[100]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoLabel = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  text-transform: uppercase;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  letter-spacing: 0.025em;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const InfoValue = styled.span`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[900]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[200]};
    box-shadow: ${({ theme }) => theme.boxShadow.sm};
  }
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.colors.primary[100]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin: 0 auto ${({ theme }) => theme.spacing[3]};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const SpecialtiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const SpecialtyTag = styled.span`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.info[50]};
  color: ${({ theme }) => theme.colors.info[700]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  border: 1px solid ${({ theme }) => theme.colors.info[200]};
`;

const DocumentsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[3]};
`;

const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.success[50]};
  border: 1px solid ${({ theme }) => theme.colors.success[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  color: ${({ theme }) => theme.colors.success[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.gray[700]};
  line-height: 1.6;
  background: ${({ theme }) => theme.colors.gray[50]};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border-left: 4px solid ${({ theme }) => theme.colors.primary[400]};
`;

const DocumentsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const DownloadAllButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  min-width: 150px;
  justify-content: center;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.boxShadow.md};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[400]};
    color: ${({ theme }) => theme.colors.white};
    cursor: not-allowed;
    transform: none;
    opacity: 0.7;
  }
`;

const DocumentsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const VendorViewModal: React.FC<VendorViewModalProps> = ({
  isOpen,
  onClose,
  vendor
}) => {
  const [isDownloading, setIsDownloading] = React.useState(false);

  if (!isOpen || !vendor) return null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} filled={index < Math.floor(rating)} />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return { bg: 'green', text: 'green' };
      case 'pending':
        return { bg: 'yellow', text: 'yellow' };
      case 'rejected':
        return { bg: 'red', text: 'red' };
      default:
        return { bg: 'gray', text: 'gray' };
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return { bg: 'green', text: 'green' };
      case 'busy':
        return { bg: 'orange', text: 'orange' };
      case 'unavailable':
        return { bg: 'red', text: 'red' };
      default:
        return { bg: 'gray', text: 'gray' };
    }
  };

  const handleDownloadAllDocuments = async () => {
    if (!vendor.documents || vendor.documents.length === 0) {
      toast.error('No documents available to download');
      return;
    }

    setIsDownloading(true);
    
    try {
      // In a real application, you would make an API call to generate and download the zip file
      // For now, we'll simulate the download process
      
      toast.info('Preparing documents for download...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate zip file creation and download
      const zipFileName = `${vendor.name.replace(/\s+/g, '_')}_Documents.zip`;
      
      // In a real implementation, you would:
      // 1. Call your backend API to create a zip file with all documents
      // 2. The API would return a download URL or blob
      // 3. Then trigger the download
      
      // For demonstration, we'll create a simulated download
      const simulatedZipContent = `Documents for ${vendor.name}:\n\n${vendor.documents.map((doc, index) => `${index + 1}. ${doc}`).join('\n')}`;
      const blob = new Blob([simulatedZipContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = zipFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(`${vendor.documents.length} documents downloaded successfully as ${zipFileName}`);
      
    } catch (error) {
      console.error('Error downloading documents:', error);
      toast.error('Failed to download documents. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderLeft>
            <VendorAvatar>
              {vendor.name.charAt(0).toUpperCase()}
            </VendorAvatar>
            <VendorBasicInfo>
              <VendorName>{vendor.name}</VendorName>
              <VendorMeta>
                <Badge variant="category">
                  <FiTool size={12} />
                  {vendor.category}
                </Badge>
                <Badge variant="status">
                  {vendor.verificationStatus === 'verified' ? (
                    <FiCheckCircle size={12} />
                  ) : vendor.verificationStatus === 'pending' ? (
                    <FiAlertCircle size={12} />
                  ) : (
                    <FiXCircle size={12} />
                  )}
                  {vendor.verificationStatus}
                </Badge>
                <Badge variant="availability">
                  <FiActivity size={12} />
                  {vendor.availability}
                </Badge>
                <Badge variant="price">
                  <FiDollarSign size={12} />
                  {vendor.priceRange}
                </Badge>
              </VendorMeta>
              <RatingContainer>
                <Stars>{renderStars(vendor.rating)}</Stars>
                <span>{vendor.rating}</span>
              </RatingContainer>
            </VendorBasicInfo>
          </HeaderLeft>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </Header>

        <Content>
          <Section>
            <SectionTitle>
              <FiTrendingUp />
              Performance Statistics
            </SectionTitle>
            <StatsGrid>
              <StatCard>
                <StatIcon>
                  <FiAward />
                </StatIcon>
                <StatValue>{vendor.totalJobs}</StatValue>
                <StatLabel>Total Jobs</StatLabel>
              </StatCard>
              <StatCard>
                <StatIcon>
                  <FiCheck />
                </StatIcon>
                <StatValue>{vendor.completedJobs}</StatValue>
                <StatLabel>Completed</StatLabel>
              </StatCard>
              <StatCard>
                <StatIcon>
                  <FiStar />
                </StatIcon>
                <StatValue>{vendor.rating}</StatValue>
                <StatLabel>Rating</StatLabel>
              </StatCard>
              <StatCard>
                <StatIcon>
                  <FiClock />
                </StatIcon>
                <StatValue>{vendor.avgResponseTime}h</StatValue>
                <StatLabel>Avg Response</StatLabel>
              </StatCard>
            </StatsGrid>
          </Section>

          <Section>
            <SectionTitle>
              <FiUser />
              Contact Information
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoIcon>
                  <FiPhone />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Phone</InfoLabel>
                  <InfoValue>{vendor.phone}</InfoValue>
                </InfoContent>
              </InfoItem>
              <InfoItem>
                <InfoIcon>
                  <FiMail />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>{vendor.email}</InfoValue>
                </InfoContent>
              </InfoItem>
              <InfoItem>
                <InfoIcon>
                  <FiMapPin />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Address</InfoLabel>
                  <InfoValue>{vendor.address}</InfoValue>
                </InfoContent>
              </InfoItem>
              {vendor.website && (
                <InfoItem>
                  <InfoIcon>
                    <FiGlobe />
                  </InfoIcon>
                  <InfoContent>
                    <InfoLabel>Website</InfoLabel>
                    <InfoValue>{vendor.website}</InfoValue>
                  </InfoContent>
                </InfoItem>
              )}
            </InfoGrid>
          </Section>

          <Section>
            <SectionTitle>
              <FiFileText />
              Service Details
            </SectionTitle>
            <InfoGrid>
              <InfoItem>
                <InfoIcon>
                  <FiCalendar />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Joined Date</InfoLabel>
                  <InfoValue>{vendor.joinedDate.toLocaleDateString()}</InfoValue>
                </InfoContent>
              </InfoItem>
              <InfoItem>
                <InfoIcon>
                  <FiActivity />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Last Activity</InfoLabel>
                  <InfoValue>{vendor.lastActivity.toLocaleDateString()}</InfoValue>
                </InfoContent>
              </InfoItem>
              <InfoItem>
                <InfoIcon>
                  <FiDollarSign />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Contract Type</InfoLabel>
                  <InfoValue>{vendor.contractType}</InfoValue>
                </InfoContent>
              </InfoItem>
              <InfoItem>
                <InfoIcon>
                  <FiShield />
                </InfoIcon>
                <InfoContent>
                  <InfoLabel>Emergency Available</InfoLabel>
                  <InfoValue>{vendor.emergencyAvailable ? 'Yes' : 'No'}</InfoValue>
                </InfoContent>
              </InfoItem>
            </InfoGrid>
          </Section>

          <Section>
            <SectionTitle>
              <FiTool />
              Specialties
            </SectionTitle>
            <SpecialtiesList>
              {vendor.specialties.map((specialty, index) => (
                <SpecialtyTag key={index}>{specialty}</SpecialtyTag>
              ))}
            </SpecialtiesList>
          </Section>

          <Section>
            <DocumentsHeader>
              <SectionTitle style={{ marginBottom: 0, paddingBottom: 0, border: 'none' }}>
                <FiFileText />
                Documents
              </SectionTitle>
              {vendor.documents.length > 0 && (
                <DownloadAllButton 
                  onClick={handleDownloadAllDocuments}
                  disabled={isDownloading}
                >
                  <FiDownload size={16} />
                  {isDownloading ? 'Preparing...' : `Download All (${vendor.documents.length})`}
                </DownloadAllButton>
              )}
            </DocumentsHeader>
            <DocumentsSection>
              {vendor.documents.length > 0 ? (
                <DocumentsList>
                  {vendor.documents.map((document, index) => (
                    <DocumentItem key={index}>
                      <FiFileText />
                      {document}
                    </DocumentItem>
                  ))}
                </DocumentsList>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '2rem', 
                  color: '#6b7280',
                  fontSize: '0.875rem'
                }}>
                  No documents available
                </div>
              )}
            </DocumentsSection>
          </Section>

          <Section>
            <SectionTitle>
              <FiFileText />
              Description
            </SectionTitle>
            <Description>{vendor.description}</Description>
          </Section>
        </Content>
      </Modal>
    </Overlay>
  );
};

export default VendorViewModal;