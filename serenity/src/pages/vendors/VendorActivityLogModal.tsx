import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FiX,
  FiActivity,
  FiUser,
  FiCalendar,
  FiClock,
  FiMonitor,
  FiMapPin,
  FiInfo,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiEdit,
  FiFileText,
  FiDollarSign,
  FiSettings,
  FiMail,
  FiPhone,
  FiPlus,
  FiUpload,
  FiDownload,
  FiEye,
  FiCopy,
  FiExternalLink
} from 'react-icons/fi';
import { toast } from 'react-toastify';

interface VendorActivity {
  id: number;
  vendorId: number;
  vendorName: string;
  activityType: 'profile_update' | 'document_upload' | 'verification' | 'payment' | 'service_update' | 'login' | 'registration' | 'contract' | 'communication' | 'system';
  action: string;
  description: string;
  timestamp: Date;
  performedBy: string;
  performedById: number;
  ipAddress?: string;
  userAgent?: string;
  previousValue?: string;
  newValue?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'completed' | 'in_progress' | 'failed' | 'pending';
  relatedEntityType?: string;
  relatedEntityId?: number;
  metadata?: Record<string, any>;
  isSystemGenerated: boolean;
}

interface VendorActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: VendorActivity;
}

const ModalOverlay = styled.div`
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

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.boxShadow.xl};
`;

const ModalHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const ModalBody = styled.div`
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
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const DetailItem = styled.div`
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const DetailLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const DetailValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.gray[900]};
  word-break: break-word;
`;

const StatusBadge = styled.div<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: capitalize;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'completed':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[800]};
        `;
      case 'in_progress':
        return `
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[800]};
        `;
      case 'failed':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[800]};
        `;
      case 'pending':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[800]};
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[800]};
        `;
    }
  }}
`;

const SeverityBadge = styled.div<{ severity: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: capitalize;
  
  ${({ severity, theme }) => {
    switch (severity) {
      case 'critical':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[800]};
        `;
      case 'high':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[800]};
        `;
      case 'medium':
        return `
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[800]};
        `;
      case 'low':
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

const ChangeComparison = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  overflow: hidden;
`;

const ChangeHeader = styled.div`
  background: ${({ theme }) => theme.colors.gray[50]};
  padding: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const ChangeContent = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
`;

const ChangeItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ChangeLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ChangeValue = styled.div<{ type: 'old' | 'new' }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: monospace;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border: 1px solid;
  
  ${({ type, theme }) => {
    if (type === 'old') {
      return `
        background: ${theme.colors.error[50]};
        border-color: ${theme.colors.error[200]};
        color: ${theme.colors.error[800]};
      `;
    } else {
      return `
        background: ${theme.colors.success[50]};
        border-color: ${theme.colors.success[200]};
        color: ${theme.colors.success[800]};
      `;
    }
  }}
`;

const MetadataContainer = styled.div`
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const MetadataContent = styled.pre`
  font-family: monospace;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  white-space: pre-wrap;
  word-break: break-word;
  margin: 0;
  overflow-x: auto;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding-top: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
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

const VendorActivityLogModal: React.FC<VendorActivityLogModalProps> = ({
  isOpen,
  onClose,
  activity
}) => {
  if (!isOpen) return null;

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'profile_update': return FiUser;
      case 'document_upload': return FiUpload;
      case 'verification': return FiCheckCircle;
      case 'payment': return FiDollarSign;
      case 'service_update': return FiSettings;
      case 'login': return FiActivity;
      case 'registration': return FiPlus;
      case 'contract': return FiFileText;
      case 'communication': return FiMail;
      case 'system': return FiSettings;
      default: return FiActivity;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return FiCheckCircle;
      case 'in_progress': return FiRefreshCw;
      case 'failed': return FiXCircle;
      case 'pending': return FiClock;
      default: return FiInfo;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': case 'high': return FiAlertTriangle;
      case 'medium': return FiInfo;
      case 'low': return FiCheckCircle;
      default: return FiInfo;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const IconComponent = getActivityIcon(activity.activityType);
  const StatusIcon = getStatusIcon(activity.status);
  const SeverityIcon = getSeverityIcon(activity.severity);

  const handleViewVendor = () => {
    // Navigate to vendor details - this would be implemented based on routing
    toast.info(`Navigate to vendor: ${activity.vendorName}`);
  };

  const handleViewRelatedEntity = () => {
    if (activity.relatedEntityType && activity.relatedEntityId) {
      toast.info(`Navigate to ${activity.relatedEntityType}: ${activity.relatedEntityId}`);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <IconComponent />
            Activity Details
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Section>
            <SectionTitle>
              <FiInfo />
              Basic Information
            </SectionTitle>
            <DetailGrid>
              <DetailItem>
                <DetailLabel>
                  <FiActivity />
                  Action
                </DetailLabel>
                <DetailValue>{activity.action}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>
                  <FiFileText />
                  Activity Type
                </DetailLabel>
                <DetailValue style={{ textTransform: 'capitalize' }}>
                  {activity.activityType.replace('_', ' ')}
                </DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>
                  <FiCalendar />
                  Timestamp
                </DetailLabel>
                <DetailValue>{formatTimestamp(activity.timestamp)}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>
                  <FiUser />
                  Vendor
                </DetailLabel>
                <DetailValue>{activity.vendorName}</DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>
                  <FiUser />
                  Performed By
                </DetailLabel>
                <DetailValue>
                  {activity.performedBy}
                  {activity.isSystemGenerated && (
                    <span style={{ color: '#6B7280', fontSize: '0.875rem', marginLeft: '8px' }}>
                      (System Generated)
                    </span>
                  )}
                </DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>
                  Status
                </DetailLabel>
                <DetailValue>
                  <StatusBadge status={activity.status}>
                    <StatusIcon size={14} />
                    {activity.status.replace('_', ' ')}
                  </StatusBadge>
                </DetailValue>
              </DetailItem>
              
              <DetailItem>
                <DetailLabel>
                  Severity
                </DetailLabel>
                <DetailValue>
                  <SeverityBadge severity={activity.severity}>
                    <SeverityIcon size={14} />
                    {activity.severity}
                  </SeverityBadge>
                </DetailValue>
              </DetailItem>
              
              {activity.relatedEntityType && activity.relatedEntityId && (
                <DetailItem>
                  <DetailLabel>
                    <FiExternalLink />
                    Related Entity
                  </DetailLabel>
                  <DetailValue>
                    {activity.relatedEntityType} #{activity.relatedEntityId}
                  </DetailValue>
                </DetailItem>
              )}
            </DetailGrid>
          </Section>

          <Section>
            <SectionTitle>
              <FiFileText />
              Description
            </SectionTitle>
            <DetailItem>
              <DetailValue>{activity.description}</DetailValue>
            </DetailItem>
          </Section>

          {(activity.previousValue || activity.newValue) && (
            <Section>
              <SectionTitle>
                <FiEdit />
                Changes Made
              </SectionTitle>
              <ChangeComparison>
                <ChangeHeader>Value Comparison</ChangeHeader>
                <ChangeContent>
                  {activity.previousValue && (
                    <ChangeItem>
                      <ChangeLabel>Previous Value</ChangeLabel>
                      <ChangeValue type="old">{activity.previousValue}</ChangeValue>
                    </ChangeItem>
                  )}
                  {activity.newValue && (
                    <ChangeItem>
                      <ChangeLabel>New Value</ChangeLabel>
                      <ChangeValue type="new">{activity.newValue}</ChangeValue>
                    </ChangeItem>
                  )}
                </ChangeContent>
              </ChangeComparison>
            </Section>
          )}

          {(activity.ipAddress || activity.userAgent) && (
            <Section>
              <SectionTitle>
                <FiMonitor />
                Technical Information
              </SectionTitle>
              <DetailGrid>
                {activity.ipAddress && (
                  <DetailItem>
                    <DetailLabel>
                      <FiMapPin />
                      IP Address
                    </DetailLabel>
                    <DetailValue>{activity.ipAddress}</DetailValue>
                  </DetailItem>
                )}
                {activity.userAgent && (
                  <DetailItem>
                    <DetailLabel>
                      <FiMonitor />
                      User Agent
                    </DetailLabel>
                    <DetailValue style={{ fontSize: '0.875rem', wordBreak: 'break-all' }}>
                      {activity.userAgent}
                    </DetailValue>
                  </DetailItem>
                )}
              </DetailGrid>
            </Section>
          )}

          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
            <Section>
              <SectionTitle>
                <FiSettings />
                Additional Metadata
              </SectionTitle>
              <MetadataContainer>
                <MetadataContent>
                  {JSON.stringify(activity.metadata, null, 2)}
                </MetadataContent>
              </MetadataContainer>
            </Section>
          )}

          <ActionButtons>
            <Button variant="primary" onClick={handleViewVendor}>
              <FiUser />
              View Vendor
            </Button>
            
            {activity.relatedEntityType && (
              <Button onClick={handleViewRelatedEntity}>
                <FiExternalLink />
                View Related {activity.relatedEntityType}
              </Button>
            )}
            
            <Button onClick={() => copyToClipboard(JSON.stringify(activity, null, 2))}>
              <FiCopy />
              Copy Details
            </Button>
            
            <Button onClick={onClose}>
              Close
            </Button>
          </ActionButtons>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default VendorActivityLogModal;