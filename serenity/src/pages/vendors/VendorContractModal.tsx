import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  FiX,
  FiFileText,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiUpload,
  FiTrash2,
  FiDownload,
  FiPlus,
  FiClock,
  FiAlertTriangle,
  FiInfo,
  FiCheckCircle,
  FiEdit,
  FiRotateCw,
  FiSave,
  FiMinus
} from 'react-icons/fi';
import { toast } from 'react-toastify';

interface VendorContract {
  id: number;
  contractNumber: string;
  vendorId: number;
  vendorName: string;
  contractTitle: string;
  contractType: 'service' | 'maintenance' | 'supply' | 'consulting' | 'construction' | 'other';
  status: 'draft' | 'pending_approval' | 'active' | 'expired' | 'terminated' | 'renewed' | 'suspended';
  startDate: Date;
  endDate: Date;
  renewalDate?: Date;
  autoRenewal: boolean;
  renewalPeriod?: number;
  value: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR';
  paymentTerms: 'monthly' | 'quarterly' | 'annually' | 'milestone' | 'completion';
  billingCycle: number;
  description: string;
  scope: string;
  terms: string;
  createdBy: string;
  approvedBy?: string;
  signedBy?: string;
  createdDate: Date;
  approvedDate?: Date;
  signedDate?: Date;
  lastModified: Date;
  attachments: string[];
  performanceMetrics: {
    slaCompliance: number;
    qualityScore: number;
    timelyCompletion: number;
    costEfficiency: number;
  };
  milestones: {
    id: number;
    title: string;
    description: string;
    dueDate: Date;
    status: 'pending' | 'in_progress' | 'completed' | 'delayed';
    value: number;
  }[];
  amendments: {
    id: number;
    title: string;
    description: string;
    date: Date;
    approvedBy: string;
    impact: 'financial' | 'scope' | 'timeline' | 'terms';
  }[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  complianceStatus: 'compliant' | 'non_compliant' | 'under_review';
  nextReviewDate: Date;
  tags: string[];
  notes: string;
}

interface VendorContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: VendorContract | null;
  mode: 'create' | 'edit' | 'view' | 'renew';
  onSave: (contractData: Partial<VendorContract>) => void;
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
  max-width: 1000px;
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FormGroupFull = styled(FormGroup)`
  grid-column: 1 / -1;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
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

const AttachmentsContainer = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
`;

const AttachmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const AttachmentName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const AttachmentActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[200]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const MilestonesContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
`;

const MilestoneItem = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  
  &:last-child {
    border-bottom: none;
  }
`;

const MilestoneHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const MilestoneTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const MilestoneStatus = styled.span<{ status: string }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
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
      case 'delayed':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[800]};
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[800]};
        `;
    }
  }}
`;

const ModalFooter = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
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

const VendorContractModal: React.FC<VendorContractModalProps> = ({
  isOpen,
  onClose,
  contract,
  mode,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<VendorContract>>({
    contractTitle: '',
    vendorName: '',
    contractType: 'service',
    status: 'draft',
    startDate: new Date(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    autoRenewal: false,
    renewalPeriod: 12,
    value: 0,
    currency: 'USD',
    paymentTerms: 'monthly',
    billingCycle: 30,
    description: '',
    scope: '',
    terms: '',
    attachments: [],
    riskLevel: 'low',
    complianceStatus: 'under_review',
    nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    tags: [],
    notes: '',
    performanceMetrics: {
      slaCompliance: 0,
      qualityScore: 0,
      timelyCompletion: 0,
      costEfficiency: 0
    },
    milestones: [],
    amendments: []
  });

  useEffect(() => {
    if (contract && (mode === 'edit' || mode === 'view')) {
      setFormData(contract);
    } else if (contract && mode === 'renew') {
      // For renewal, prepare new contract based on existing one
      setFormData({
        ...contract,
        status: 'draft',
        startDate: contract.endDate,
        endDate: new Date(contract.endDate.getTime() + (contract.renewalPeriod || 12) * 30 * 24 * 60 * 60 * 1000),
        contractNumber: undefined, // Will be generated
        createdDate: undefined,
        approvedDate: undefined,
        signedDate: undefined,
        milestones: [],
        amendments: []
      });
    }
  }, [contract, mode]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof VendorContract, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.contractTitle || !formData.vendorName || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSave(formData);
  };

  const isReadOnly = mode === 'view';
  const isRenewal = mode === 'renew';

  const getModalTitle = () => {
    switch (mode) {
      case 'create': return 'Create New Contract';
      case 'edit': return 'Edit Contract';
      case 'view': return 'View Contract Details';
      case 'renew': return 'Renew Contract';
      default: return 'Contract';
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (field: keyof VendorContract, value: string) => {
    handleInputChange(field, new Date(value));
  };

  const addAttachment = () => {
    // In a real app, this would open a file picker
    const fileName = prompt('Enter attachment name:');
    if (fileName) {
      handleInputChange('attachments', [...(formData.attachments || []), fileName]);
      toast.success('Attachment added');
    }
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...(formData.attachments || [])];
    newAttachments.splice(index, 1);
    handleInputChange('attachments', newAttachments);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <FiFileText />
            {getModalTitle()}
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
            <FormGrid>
              <FormGroup>
                <Label>Contract Title *</Label>
                <Input
                  type="text"
                  value={formData.contractTitle || ''}
                  onChange={(e) => handleInputChange('contractTitle', e.target.value)}
                  disabled={isReadOnly}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Vendor Name *</Label>
                <Input
                  type="text"
                  value={formData.vendorName || ''}
                  onChange={(e) => handleInputChange('vendorName', e.target.value)}
                  disabled={isReadOnly}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Contract Type</Label>
                <Select
                  value={formData.contractType || 'service'}
                  onChange={(e) => handleInputChange('contractType', e.target.value)}
                  disabled={isReadOnly}
                >
                  <option value="service">Service</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="supply">Supply</option>
                  <option value="consulting">Consulting</option>
                  <option value="construction">Construction</option>
                  <option value="other">Other</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Status</Label>
                <Select
                  value={formData.status || 'draft'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  disabled={isReadOnly || isRenewal}
                >
                  <option value="draft">Draft</option>
                  <option value="pending_approval">Pending Approval</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="terminated">Terminated</option>
                  <option value="renewed">Renewed</option>
                  <option value="suspended">Suspended</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formatDate(formData.startDate as Date)}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  disabled={isReadOnly}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formatDate(formData.endDate as Date)}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  disabled={isReadOnly}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Risk Level</Label>
                <Select
                  value={formData.riskLevel || 'low'}
                  onChange={(e) => handleInputChange('riskLevel', e.target.value)}
                  disabled={isReadOnly}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    checked={formData.autoRenewal || false}
                    onChange={(e) => handleInputChange('autoRenewal', e.target.checked)}
                    disabled={isReadOnly}
                  />
                  <Label>Auto Renewal</Label>
                </CheckboxContainer>
              </FormGroup>
            </FormGrid>
          </Section>

          <Section>
            <SectionTitle>
              <FiDollarSign />
              Financial Terms
            </SectionTitle>
            <FormGrid>
              <FormGroup>
                <Label>Contract Value</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.value || 0}
                  onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                  disabled={isReadOnly}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Currency</Label>
                <Select
                  value={formData.currency || 'USD'}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  disabled={isReadOnly}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Payment Terms</Label>
                <Select
                  value={formData.paymentTerms || 'monthly'}
                  onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                  disabled={isReadOnly}
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                  <option value="milestone">Milestone</option>
                  <option value="completion">Completion</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Billing Cycle (days)</Label>
                <Input
                  type="number"
                  value={formData.billingCycle || 30}
                  onChange={(e) => handleInputChange('billingCycle', parseInt(e.target.value) || 30)}
                  disabled={isReadOnly}
                />
              </FormGroup>
            </FormGrid>
          </Section>

          <Section>
            <SectionTitle>
              <FiEdit />
              Contract Details
            </SectionTitle>
            <FormGrid>
              <FormGroupFull>
                <Label>Description *</Label>
                <TextArea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter contract description..."
                  disabled={isReadOnly}
                />
              </FormGroupFull>
              
              <FormGroupFull>
                <Label>Scope of Work</Label>
                <TextArea
                  value={formData.scope || ''}
                  onChange={(e) => handleInputChange('scope', e.target.value)}
                  placeholder="Define the scope of work..."
                  disabled={isReadOnly}
                />
              </FormGroupFull>
              
              <FormGroupFull>
                <Label>Terms & Conditions</Label>
                <TextArea
                  value={formData.terms || ''}
                  onChange={(e) => handleInputChange('terms', e.target.value)}
                  placeholder="Enter terms and conditions..."
                  disabled={isReadOnly}
                />
              </FormGroupFull>
              
              <FormGroupFull>
                <Label>Notes</Label>
                <TextArea
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional notes..."
                  disabled={isReadOnly}
                />
              </FormGroupFull>
            </FormGrid>
          </Section>

          {!isReadOnly && (
            <Section>
              <SectionTitle>
                <FiUpload />
                Attachments
              </SectionTitle>
              <AttachmentsContainer onClick={addAttachment}>
                <FiUpload size={24} />
                <div>Click to add attachment</div>
              </AttachmentsContainer>
              
              {formData.attachments && formData.attachments.length > 0 && (
                <AttachmentsList>
                  {formData.attachments.map((attachment, index) => (
                    <AttachmentItem key={index}>
                      <AttachmentName>{attachment}</AttachmentName>
                      <AttachmentActions>
                        <IconButton>
                          <FiDownload />
                        </IconButton>
                        <IconButton onClick={() => removeAttachment(index)}>
                          <FiTrash2 />
                        </IconButton>
                      </AttachmentActions>
                    </AttachmentItem>
                  ))}
                </AttachmentsList>
              )}
            </Section>
          )}

          {formData.milestones && formData.milestones.length > 0 && (
            <Section>
              <SectionTitle>
                <FiCheckCircle />
                Milestones
              </SectionTitle>
              <MilestonesContainer>
                {formData.milestones.map((milestone) => (
                  <MilestoneItem key={milestone.id}>
                    <MilestoneHeader>
                      <MilestoneTitle>{milestone.title}</MilestoneTitle>
                      <MilestoneStatus status={milestone.status}>
                        {milestone.status.replace('_', ' ')}
                      </MilestoneStatus>
                    </MilestoneHeader>
                    <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '8px' }}>
                      {milestone.description}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                      Due: {milestone.dueDate.toLocaleDateString()} | Value: ${milestone.value.toLocaleString()}
                    </div>
                  </MilestoneItem>
                ))}
              </MilestonesContainer>
            </Section>
          )}
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          {!isReadOnly && (
            <Button variant="primary" onClick={handleSubmit}>
              <FiSave />
              {mode === 'create' ? 'Create Contract' : 
               mode === 'renew' ? 'Renew Contract' : 'Save Changes'}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );
};

export default VendorContractModal;