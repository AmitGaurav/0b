import React from 'react';
import styled from 'styled-components';
import {
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiCalendar,
  FiBriefcase,
  FiTruck,
  FiShield,
  FiFileText,
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import {
  DirectoryEntry,
  DirectoryEntryType,
  isMemberEntry,
  isVendorEntry,
  isStaffEntry,
  isSecurityEntry
} from '../../types/society-directory';

interface DirectoryEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry: DirectoryEntry | null;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: ${({ theme }) => theme.boxShadow.xl};
`;

const ModalHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.colors.white};
  z-index: 1;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.gray[600]};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[2]};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.gray[900]};
  }
`;

const ModalContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  min-width: 120px;
`;

const Value = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[900]};
  flex: 1;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ status, theme }) => {
    switch (status) {
      case 'ACTIVE':
        return theme.colors.success[100];
      case 'INACTIVE':
        return theme.colors.gray[100];
      case 'SUSPENDED':
        return theme.colors.error[100];
      case 'PENDING':
        return theme.colors.warning[100];
      default:
        return theme.colors.gray[100];
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case 'ACTIVE':
        return theme.colors.success[700];
      case 'INACTIVE':
        return theme.colors.gray[700];
      case 'SUSPENDED':
        return theme.colors.error[700];
      case 'PENDING':
        return theme.colors.warning[700];
      default:
        return theme.colors.gray[700];
    }
  }};
`;

const DocumentList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const DocumentItem = styled.a`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.gray[700]};
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
  }
`;

const DirectoryEntryModal: React.FC<DirectoryEntryModalProps> = ({ isOpen, onClose, entry }) => {
  if (!entry) return null;

  const renderBasicInfo = () => (
    <Section>
      <SectionTitle>
        <FiUser />
        Basic Information
      </SectionTitle>
      <Grid>
        <InfoItem>
          <Label>Name:</Label>
          <Value>{entry.name}</Value>
        </InfoItem>
        <InfoItem>
          <Label>Email:</Label>
          <Value>{entry.email}</Value>
        </InfoItem>
        <InfoItem>
          <Label>Phone:</Label>
          <Value>{entry.phone}</Value>
        </InfoItem>
        <InfoItem>
          <Label>Status:</Label>
          <Value>
            <StatusBadge status={entry.status}>
              {entry.status === 'ACTIVE' ? <FiCheckCircle /> : <FiAlertCircle />}
              {entry.status}
            </StatusBadge>
          </Value>
        </InfoItem>
        <InfoItem>
          <Label>Date Joined:</Label>
          <Value>{entry.dateJoined.toLocaleDateString()}</Value>
        </InfoItem>
      </Grid>
    </Section>
  );

  const renderMemberSpecific = () => {
    if (!isMemberEntry(entry)) return null;
    return (
      <Section>
        <SectionTitle>
          <FiHome />
          Residence Information
        </SectionTitle>
        <Grid>
          <InfoItem>
            <Label>Unit Number:</Label>
            <Value>{entry.unitNumber}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Unit Type:</Label>
            <Value>{entry.unitType}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Floor Number:</Label>
            <Value>{entry.floorNumber}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Block Number:</Label>
            <Value>{entry.blockNumber || 'N/A'}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Committee Member:</Label>
            <Value>{entry.isCommitteeMember ? 'Yes' : 'No'}</Value>
          </InfoItem>
          {entry.committeePosition && (
            <InfoItem>
              <Label>Position:</Label>
              <Value>{entry.committeePosition}</Value>
            </InfoItem>
          )}
        </Grid>
      </Section>
    );
  };

  const renderVendorSpecific = () => {
    if (!isVendorEntry(entry)) return null;
    return (
      <Section>
        <SectionTitle>
          <FiTruck />
          Vendor Information
        </SectionTitle>
        <Grid>
          <InfoItem>
            <Label>Company Name:</Label>
            <Value>{entry.companyName}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Vendor Type:</Label>
            <Value>{entry.vendorType}</Value>
          </InfoItem>
          <InfoItem>
            <Label>GST Number:</Label>
            <Value>{entry.gstNumber || 'N/A'}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Contract Period:</Label>
            <Value>
              {entry.contractStartDate.toLocaleDateString()} - {entry.contractEndDate.toLocaleDateString()}
            </Value>
          </InfoItem>
          <InfoItem>
            <Label>Rating:</Label>
            <Value>{entry.rating}/10</Value>
          </InfoItem>
        </Grid>
      </Section>
    );
  };

  const renderStaffSpecific = () => {
    if (!isStaffEntry(entry)) return null;
    return (
      <Section>
        <SectionTitle>
          <FiBriefcase />
          Employment Information
        </SectionTitle>
        <Grid>
          <InfoItem>
            <Label>Employee ID:</Label>
            <Value>{entry.employeeId}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Role:</Label>
            <Value>{entry.role}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Department:</Label>
            <Value>{entry.department}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Working Hours:</Label>
            <Value>{entry.workingHours}</Value>
          </InfoItem>
          {entry.supervisorName && (
            <InfoItem>
              <Label>Supervisor:</Label>
              <Value>{entry.supervisorName}</Value>
            </InfoItem>
          )}
        </Grid>
      </Section>
    );
  };

  const renderSecuritySpecific = () => {
    if (!isSecurityEntry(entry)) return null;
    return (
      <Section>
        <SectionTitle>
          <FiShield />
          Security Information
        </SectionTitle>
        <Grid>
          <InfoItem>
            <Label>Employee ID:</Label>
            <Value>{entry.employeeId}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Role:</Label>
            <Value>{entry.role}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Shift:</Label>
            <Value>{entry.shift}</Value>
          </InfoItem>
          <InfoItem>
            <Label>License Number:</Label>
            <Value>{entry.licenseNumber}</Value>
          </InfoItem>
          <InfoItem>
            <Label>License Expiry:</Label>
            <Value>{entry.licenseExpiryDate.toLocaleDateString()}</Value>
          </InfoItem>
          <InfoItem>
            <Label>Assigned Gates:</Label>
            <Value>{entry.assignedGates.join(', ')}</Value>
          </InfoItem>
        </Grid>
      </Section>
    );
  };

  const renderDocuments = () => (
    <Section>
      <SectionTitle>
        <FiFileText />
        Documents
      </SectionTitle>
      <DocumentList>
        {entry.documents.map((doc, index) => (
          <DocumentItem key={index} href="#">
            <FiFileText />
            {doc}
          </DocumentItem>
        ))}
      </DocumentList>
    </Section>
  );

  return (
    <ModalOverlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>{entry.name}</h2>
          <CloseButton onClick={onClose}>
            <FiX size={24} />
          </CloseButton>
        </ModalHeader>
        <ModalContent>
          {renderBasicInfo()}
          {renderMemberSpecific()}
          {renderVendorSpecific()}
          {renderStaffSpecific()}
          {renderSecuritySpecific()}
          {renderDocuments()}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default DirectoryEntryModal;