import React, { useState } from 'react';
import styled from 'styled-components';
import { FiHome, FiMapPin, FiUsers, FiCheck, FiArrowRight } from 'react-icons/fi';
import { Society, UserSocietyMembership } from '../../types/society';

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.boxShadow.xl};
`;

const ModalHeader = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[600]}, ${({ theme }) => theme.colors.primary[700]});
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
`;

const WelcomeTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const WelcomeSubtitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  opacity: 0.9;
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const SectionTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing[4]} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  text-align: center;
`;

const SocietiesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SocietyCard = styled.div<{ isSelected: boolean }>`
  border: 2px solid ${({ isSelected, theme }) => 
    isSelected ? theme.colors.primary[500] : theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[4]};
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${({ isSelected, theme }) => 
    isSelected ? theme.colors.primary[50] : theme.colors.white};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.primary[50]};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.boxShadow.md};
  }
`;

const SocietyHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const SocietyIcon = styled.div<{ isSelected: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ isSelected, theme }) => 
    isSelected ? theme.colors.primary[500] : theme.colors.gray[400]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  margin-right: ${({ theme }) => theme.spacing[3]};
  flex-shrink: 0;
`;

const SocietyInfo = styled.div`
  flex: 1;
`;

const SocietyName = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing[1]} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const SocietyAddress = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const MembershipBadge = styled.div<{ type: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-top: ${({ theme }) => theme.spacing[2]};
  
  ${({ type, theme }) => {
    switch (type) {
      case 'OWNER':
        return `background: ${theme.colors.success[100]}; color: ${theme.colors.success[700]};`;
      case 'TENANT':
        return `background: ${theme.colors.primary[100]}; color: ${theme.colors.primary[700]};`;
      case 'ADMIN':
        return `background: ${theme.colors.warning[100]}; color: ${theme.colors.warning[700]};`;
      default:
        return `background: ${theme.colors.gray[100]}; color: ${theme.colors.gray[700]};`;
    }
  }}
`;

const UnitInfo = styled.div`
  margin-top: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const SelectionIndicator = styled.div<{ isSelected: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 2px solid ${({ isSelected, theme }) => 
    isSelected ? theme.colors.primary[500] : theme.colors.gray[300]};
  background: ${({ isSelected, theme }) => 
    isSelected ? theme.colors.primary[500] : theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  margin-left: ${({ theme }) => theme.spacing[3]};
  flex-shrink: 0;
`;

const ContinueButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ disabled, theme }) => 
    disabled ? theme.colors.gray[300] : theme.colors.primary[600]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: ${({ theme }) => theme.transition.colors};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[700]};
  }

  &:disabled {
    opacity: 0.6;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface SocietySelectionModalProps {
  isOpen: boolean;
  societies: UserSocietyMembership[];
  userName: string;
  onSelectSociety: (societyId: number) => Promise<void>;
}

const SocietySelectionModal: React.FC<SocietySelectionModalProps> = ({
  isOpen,
  societies,
  userName,
  onSelectSociety
}) => {
  const [selectedSocietyId, setSelectedSocietyId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSocietySelect = (societyId: number) => {
    setSelectedSocietyId(societyId);
  };

  const handleContinue = async () => {
    if (!selectedSocietyId) return;

    try {
      setIsLoading(true);
      await onSelectSociety(selectedSocietyId);
    } catch (error) {
      console.error('Error selecting society:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMembershipIcon = (type: string) => {
    switch (type) {
      case 'OWNER':
        return <FiHome size={16} />;
      case 'TENANT':
        return <FiUsers size={16} />;
      default:
        return <FiHome size={16} />;
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <WelcomeTitle>Welcome, {userName}! 🏠</WelcomeTitle>
          <WelcomeSubtitle>
            We found that you're a member of multiple societies. Please select which one you'd like to access.
          </WelcomeSubtitle>
        </ModalHeader>

        <ModalBody>
          <SectionTitle>Select Your Society</SectionTitle>

          <SocietiesGrid>
            {societies.map((membership) => (
              <SocietyCard
                key={membership.societyId}
                isSelected={selectedSocietyId === membership.societyId}
                onClick={() => handleSocietySelect(membership.societyId)}
              >
                <SocietyHeader>
                  <SocietyIcon isSelected={selectedSocietyId === membership.societyId}>
                    <FiHome size={24} />
                  </SocietyIcon>
                  <SocietyInfo>
                    <SocietyName>{membership.society.name}</SocietyName>
                    <SocietyAddress>
                      <FiMapPin size={14} />
                      {membership.society.address}, {membership.society.city}
                    </SocietyAddress>
                    <MembershipBadge type={membership.membershipType}>
                      {getMembershipIcon(membership.membershipType)}
                      {membership.membershipType}
                    </MembershipBadge>
                    <UnitInfo>
                      Unit: {membership.unitNumber}, Block: {membership.blockNumber}
                    </UnitInfo>
                  </SocietyInfo>
                  <SelectionIndicator isSelected={selectedSocietyId === membership.societyId}>
                    {selectedSocietyId === membership.societyId && <FiCheck size={16} />}
                  </SelectionIndicator>
                </SocietyHeader>
              </SocietyCard>
            ))}
          </SocietiesGrid>

          <ContinueButton
            disabled={!selectedSocietyId || isLoading}
            onClick={handleContinue}
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                Accessing Society...
              </>
            ) : (
              <>
                Continue to Dashboard
                <FiArrowRight size={18} />
              </>
            )}
          </ContinueButton>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SocietySelectionModal;