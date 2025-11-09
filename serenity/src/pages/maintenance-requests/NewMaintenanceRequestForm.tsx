import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FiX,
  FiUpload,
  FiPlus,
  FiMinus,
  FiAlertCircle,
  FiCheck,
  FiClock,
  FiMapPin,
  FiTool,
  FiUser,
  FiPhone,
  FiMail,
  FiCalendar,
  FiDollarSign,
  FiRepeat,
  FiTag,
  FiFileText,
  FiPaperclip
} from 'react-icons/fi';
import {
  MaintenanceRequestType,
  MaintenanceRequestPriority,
  MaintenanceRequestLocation,
  CreateMaintenanceRequestData,
  MAINTENANCE_REQUEST_TYPE_LABELS,
  MAINTENANCE_REQUEST_PRIORITY_LABELS,
  MAINTENANCE_REQUEST_LOCATION_LABELS
} from '../../types/maintenance-requests';

interface NewMaintenanceRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMaintenanceRequestData) => void;
}

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
  padding: ${({ theme }) => theme.spacing[4]};
`;

const ModalContent = styled.div`
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.gray[600]};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[200]};
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const Form = styled.form`
  display: grid;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const Section = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }

  &.full-width {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};

  .required {
    color: ${({ theme }) => theme.colors.error[500]};
  }
`;

const Input = styled.input<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme, hasError }) => 
    hasError ? theme.colors.error[300] : theme.colors.gray[300]
  };
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => 
      hasError ? theme.colors.error[500] : theme.colors.primary[500]
    };
    box-shadow: 0 0 0 3px ${({ theme, hasError }) => 
      hasError ? theme.colors.error[100] : theme.colors.primary[100]
    };
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const Textarea = styled.textarea<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme, hasError }) => 
    hasError ? theme.colors.error[300] : theme.colors.gray[300]
  };
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => 
      hasError ? theme.colors.error[500] : theme.colors.primary[500]
    };
    box-shadow: 0 0 0 3px ${({ theme, hasError }) => 
      hasError ? theme.colors.error[100] : theme.colors.primary[100]
    };
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const Select = styled.select<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme, hasError }) => 
    hasError ? theme.colors.error[300] : theme.colors.gray[300]
  };
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: white;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => 
      hasError ? theme.colors.error[500] : theme.colors.primary[500]
    };
    box-shadow: 0 0 0 3px ${({ theme, hasError }) => 
      hasError ? theme.colors.error[100] : theme.colors.primary[100]
    };
  }
`;

const FileUpload = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }

  input {
    display: none;
  }
`;

const FileUploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const FileList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const RemoveFileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: ${({ theme }) => theme.colors.error[100]};
  color: ${({ theme }) => theme.colors.error[600]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.colors.error[200]};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const RecurringOptions = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const TagInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
  min-height: 40px;
  padding: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  input {
    border: none;
    outline: none;
    flex: 1;
    min-width: 120px;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};

    &::placeholder {
      color: ${({ theme }) => theme.colors.gray[400]};
    }
  }
`;

const Tag = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[800]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};

  button {
    border: none;
    background: none;
    color: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0;
    margin-left: ${({ theme }) => theme.spacing[1]};

    &:hover {
      color: ${({ theme }) => theme.colors.primary[900]};
    }
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.error[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 1px solid;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.primary {
    background: ${({ theme }) => theme.colors.primary[500]};
    color: white;
    border-color: ${({ theme }) => theme.colors.primary[500]};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primary[600]};
      border-color: ${({ theme }) => theme.colors.primary[600]};
    }
  }

  &.secondary {
    background: white;
    color: ${({ theme }) => theme.colors.gray[600]};
    border-color: ${({ theme }) => theme.colors.gray[300]};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.gray[50]};
      border-color: ${({ theme }) => theme.colors.gray[400]};
    }
  }
`;

const NewMaintenanceRequestForm: React.FC<NewMaintenanceRequestFormProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: MaintenanceRequestType.GENERAL,
    priority: MaintenanceRequestPriority.MEDIUM,
    location: MaintenanceRequestLocation.APARTMENT,
    unitNumber: '',
    isRecurring: false,
    frequency: 'monthly' as 'weekly' | 'monthly' | 'quarterly' | 'annually',
    tags: [] as string[]
  });

  const [files, setFiles] = useState<File[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!formData.tags.includes(newTag)) {
        handleInputChange('tags', [...formData.tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.location === MaintenanceRequestLocation.APARTMENT && !formData.unitNumber.trim()) {
      newErrors.unitNumber = 'Unit number is required for apartment requests';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const submitData: CreateMaintenanceRequestData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        priority: formData.priority,
        location: formData.location,
        unitNumber: formData.unitNumber.trim() || undefined,
        attachments: files.length > 0 ? files : undefined,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        recurring: formData.isRecurring ? {
          isRecurring: true,
          frequency: formData.frequency
        } : undefined
      };

      await onSubmit(submitData);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: MaintenanceRequestType.GENERAL,
        priority: MaintenanceRequestPriority.MEDIUM,
        location: MaintenanceRequestLocation.APARTMENT,
        unitNumber: '',
        isRecurring: false,
        frequency: 'monthly',
        tags: []
      });
      setFiles([]);
      setTagInput('');
      setErrors({});
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>New Maintenance Request</ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX size={16} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <Section>
              <SectionTitle>
                <FiFileText />
                Request Details
              </SectionTitle>
              
              <FormRow className="full-width">
                <FormGroup>
                  <Label>
                    Title <span className="required">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Brief description of the issue"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    hasError={!!errors.title}
                  />
                  {errors.title && (
                    <ErrorMessage>
                      <FiAlertCircle size={14} />
                      {errors.title}
                    </ErrorMessage>
                  )}
                </FormGroup>
              </FormRow>

              <FormRow className="full-width">
                <FormGroup>
                  <Label>
                    Description <span className="required">*</span>
                  </Label>
                  <Textarea
                    placeholder="Provide detailed information about the maintenance issue, including any relevant context or background information..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    hasError={!!errors.description}
                  />
                  {errors.description && (
                    <ErrorMessage>
                      <FiAlertCircle size={14} />
                      {errors.description}
                    </ErrorMessage>
                  )}
                </FormGroup>
              </FormRow>
            </Section>

            <Section>
              <SectionTitle>
                <FiTool />
                Request Classification
              </SectionTitle>
              
              <FormRow>
                <FormGroup>
                  <Label>Request Type</Label>
                  <Select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value as MaintenanceRequestType)}
                  >
                    {Object.entries(MAINTENANCE_REQUEST_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Priority Level</Label>
                  <Select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value as MaintenanceRequestPriority)}
                  >
                    {Object.entries(MAINTENANCE_REQUEST_PRIORITY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </Select>
                </FormGroup>
              </FormRow>
            </Section>

            <Section>
              <SectionTitle>
                <FiMapPin />
                Location Information
              </SectionTitle>
              
              <FormRow>
                <FormGroup>
                  <Label>Location</Label>
                  <Select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value as MaintenanceRequestLocation)}
                  >
                    {Object.entries(MAINTENANCE_REQUEST_LOCATION_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </Select>
                </FormGroup>

                {formData.location === MaintenanceRequestLocation.APARTMENT && (
                  <FormGroup>
                    <Label>
                      Unit Number <span className="required">*</span>
                    </Label>
                    <Input
                      type="text"
                      placeholder="e.g., A-301, B-205"
                      value={formData.unitNumber}
                      onChange={(e) => handleInputChange('unitNumber', e.target.value)}
                      hasError={!!errors.unitNumber}
                    />
                    {errors.unitNumber && (
                      <ErrorMessage>
                        <FiAlertCircle size={14} />
                        {errors.unitNumber}
                      </ErrorMessage>
                    )}
                  </FormGroup>
                )}
              </FormRow>
            </Section>

            <Section>
              <SectionTitle>
                <FiPaperclip />
                Attachments
              </SectionTitle>
              
              <FileUpload>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileChange}
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <FileUploadContent>
                    <FiUpload size={24} />
                    <div>
                      <strong>Click to upload files</strong> or drag and drop
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      PDF, DOC, JPG, PNG up to 10MB each
                    </div>
                  </FileUploadContent>
                </label>
              </FileUpload>

              {files.length > 0 && (
                <FileList>
                  {files.map((file, index) => (
                    <FileItem key={index}>
                      <FileInfo>
                        <FiPaperclip size={16} />
                        <div>
                          <div>{file.name}</div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                      </FileInfo>
                      <RemoveFileButton onClick={() => removeFile(index)}>
                        <FiX size={14} />
                      </RemoveFileButton>
                    </FileItem>
                  ))}
                </FileList>
              )}
            </Section>

            <Section>
              <SectionTitle>
                <FiTag />
                Additional Options
              </SectionTitle>
              
              <FormRow className="full-width">
                <FormGroup>
                  <Label>Tags</Label>
                  <TagInput>
                    {formData.tags.map((tag) => (
                      <Tag key={tag}>
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)}>
                          <FiX size={12} />
                        </button>
                      </Tag>
                    ))}
                    <input
                      type="text"
                      placeholder="Add tags (press Enter)"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInput}
                    />
                  </TagInput>
                </FormGroup>
              </FormRow>

              <FormRow className="full-width">
                <FormGroup>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      checked={formData.isRecurring}
                      onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                    />
                    <Label>
                      <FiRepeat />
                      This is a recurring maintenance request
                    </Label>
                  </CheckboxGroup>
                  
                  {formData.isRecurring && (
                    <RecurringOptions>
                      <FormGroup>
                        <Label>Frequency</Label>
                        <Select
                          value={formData.frequency}
                          onChange={(e) => handleInputChange('frequency', e.target.value)}
                        >
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="annually">Annually</option>
                        </Select>
                      </FormGroup>
                    </RecurringOptions>
                  )}
                </FormGroup>
              </FormRow>
            </Section>
          </Form>
        </ModalBody>

        <ModalFooter>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            Fields marked with <span style={{ color: '#ef4444' }}>*</span> are required
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button type="button" className="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="button" 
              className="primary" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FiClock size={16} />
                  Submitting...
                </>
              ) : (
                <>
                  <FiCheck size={16} />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewMaintenanceRequestForm;