import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FiX,
  FiBell,
  FiPlus,
  FiTrash2,
  FiCalendar,
  FiUsers,
  FiSettings,
  FiEye,
  FiEyeOff,
  FiLock,
  FiUnlock,
  FiAlertCircle,
  FiClock,
  FiTag,
  FiCheck,
  FiInfo,
  FiFileText,
  FiTarget,
  FiMessageSquare,
  FiPaperclip,
  FiAlertTriangle,
  FiStar,
  FiEdit3,
  FiUpload
} from 'react-icons/fi';
import {
  CreateAnnouncementData,
  AnnouncementCategory,
  AnnouncementPriority,
  UserRole
} from '../../types/announcements';

interface NewAnnouncementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAnnouncementData) => void;
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
  max-width: 1000px;
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

  &.three-columns {
    grid-template-columns: 1fr 1fr 1fr;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
      grid-template-columns: 1fr;
    }
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

const MultiSelectContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[2]};
  background: white;
  max-height: 120px;
  overflow-y: auto;
`;

const MultiSelectOption = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }
`;

const FileUploadArea = styled.div<{ isDragActive?: boolean }>`
  border: 2px dashed ${({ theme, isDragActive }) => 
    isDragActive ? theme.colors.primary[400] : theme.colors.gray[300]
  };
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  background: ${({ theme, isDragActive }) => 
    isDragActive ? theme.colors.primary[50] : theme.colors.gray[50]
  };
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
`;

const FileUploadText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const FileList = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FileName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[800]};
`;

const FileSize = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
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
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: ${({ theme }) => theme.colors.error[200]};
  }
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

const PriorityBadge = styled.div<{ priority: AnnouncementPriority }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  
  background: ${({ theme, priority }) => {
    switch (priority) {
      case 'urgent': return theme.colors.error[100];
      case 'high': return theme.colors.warning[100];
      case 'normal': return theme.colors.primary[100];
      default: return theme.colors.gray[100];
    }
  }};
  
  color: ${({ theme, priority }) => {
    switch (priority) {
      case 'urgent': return theme.colors.error[800];
      case 'high': return theme.colors.warning[800];
      case 'normal': return theme.colors.primary[800];
      default: return theme.colors.gray[800];
    }
  }};
`;

const InfoBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.primary[800]};
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

const NewAnnouncementForm: React.FC<NewAnnouncementFormProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    summary: '',
    category: 'general' as AnnouncementCategory,
    priority: 'normal' as AnnouncementPriority,
    attachments: [] as File[],
    tags: [] as string[],
    targetAudience: ['resident'] as UserRole[],
    visibility: 'all' as 'all' | 'residents' | 'staff' | 'admin',
    allowComments: true,
    requireAcknowledgment: false,
    expiresAt: '',
    isPinned: false,
    scheduledPublishAt: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTargetAudienceChange = (role: UserRole, checked: boolean) => {
    if (checked) {
      handleInputChange('targetAudience', [...formData.targetAudience, role]);
    } else {
      handleInputChange('targetAudience', formData.targetAudience.filter(r => r !== role));
    }
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

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const validFiles = Array.from(files).filter(file => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      return file.size <= maxSize;
    });

    if (validFiles.length !== files.length) {
      alert('Some files were too large (max 10MB each) and were not added.');
    }

    handleInputChange('attachments', [...formData.attachments, ...validFiles]);
  };

  const removeFile = (index: number) => {
    handleInputChange('attachments', formData.attachments.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Announcement title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Announcement content is required';
    }

    if (!formData.summary.trim()) {
      newErrors.summary = 'Summary is required';
    }

    if (formData.targetAudience.length === 0) {
      newErrors.targetAudience = 'At least one target audience must be selected';
    }

    // Validate scheduled publish date
    if (formData.scheduledPublishAt) {
      const scheduledDate = new Date(formData.scheduledPublishAt);
      const now = new Date();
      
      if (scheduledDate <= now) {
        newErrors.scheduledPublishAt = 'Scheduled publish time must be in the future';
      }
    }

    // Validate expiration date
    if (formData.expiresAt) {
      const expirationDate = new Date(formData.expiresAt);
      const publishDate = formData.scheduledPublishAt ? 
        new Date(formData.scheduledPublishAt) : new Date();
      
      if (expirationDate <= publishDate) {
        newErrors.expiresAt = 'Expiration date must be after publish date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const submitData: CreateAnnouncementData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        summary: formData.summary.trim(),
        category: formData.category,
        priority: formData.priority,
        attachments: formData.attachments,
        tags: formData.tags,
        targetAudience: formData.targetAudience,
        visibility: formData.visibility,
        allowComments: formData.allowComments,
        requireAcknowledgment: formData.requireAcknowledgment,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
        isPinned: formData.isPinned,
        scheduledPublishAt: formData.scheduledPublishAt ? new Date(formData.scheduledPublishAt) : undefined
      };

      await onSubmit(submitData);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        summary: '',
        category: 'general',
        priority: 'normal',
        attachments: [],
        tags: [],
        targetAudience: ['resident'],
        visibility: 'all',
        allowComments: true,
        requireAcknowledgment: false,
        expiresAt: '',
        isPinned: false,
        scheduledPublishAt: ''
      });
      setTagInput('');
      setErrors({});
    } catch (error) {
      console.error('Error creating announcement:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Create New Announcement</ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX size={16} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <Section>
              <SectionTitle>
                <FiFileText />
                Announcement Details
              </SectionTitle>
              
              <FormRow className="full-width">
                <FormGroup>
                  <Label>
                    Title <span className="required">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter announcement title"
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
                    Summary <span className="required">*</span>
                  </Label>
                  <Textarea
                    placeholder="Brief summary that will appear in notifications and previews..."
                    value={formData.summary}
                    onChange={(e) => handleInputChange('summary', e.target.value)}
                    hasError={!!errors.summary}
                    style={{ minHeight: '80px' }}
                  />
                  {errors.summary && (
                    <ErrorMessage>
                      <FiAlertCircle size={14} />
                      {errors.summary}
                    </ErrorMessage>
                  )}
                </FormGroup>
              </FormRow>

              <FormRow className="full-width">
                <FormGroup>
                  <Label>
                    Content <span className="required">*</span>
                  </Label>
                  <Textarea
                    placeholder="Full announcement content with all the details residents need to know..."
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    hasError={!!errors.content}
                    style={{ minHeight: '200px' }}
                  />
                  {errors.content && (
                    <ErrorMessage>
                      <FiAlertCircle size={14} />
                      {errors.content}
                    </ErrorMessage>
                  )}
                </FormGroup>
              </FormRow>

              <FormRow className="three-columns">
                <FormGroup>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value as AnnouncementCategory)}
                  >
                    <option value="general">General</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="events">Events</option>
                    <option value="safety">Safety</option>
                    <option value="financial">Financial</option>
                    <option value="utilities">Utilities</option>
                    <option value="community">Community</option>
                    <option value="emergency">Emergency</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Priority</Label>
                  <Select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value as AnnouncementPriority)}
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </Select>
                  <PriorityBadge priority={formData.priority}>
                    {formData.priority === 'urgent' && <FiAlertTriangle />}
                    {formData.priority === 'high' && <FiStar />}
                    {formData.priority === 'normal' && <FiInfo />}
                    {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)}
                  </PriorityBadge>
                </FormGroup>

                <FormGroup>
                  <Label>Visibility</Label>
                  <Select
                    value={formData.visibility}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                  >
                    <option value="all">All Users</option>
                    <option value="residents">Residents Only</option>
                    <option value="staff">Staff Only</option>
                    <option value="admin">Admin Only</option>
                  </Select>
                </FormGroup>
              </FormRow>
            </Section>

            <Section>
              <SectionTitle>
                <FiTarget />
                Target Audience
              </SectionTitle>
              
              <MultiSelectContainer>
                {(['resident', 'admin', 'security', 'maintenance', 'support'] as UserRole[]).map((role) => (
                  <MultiSelectOption key={role}>
                    <Checkbox
                      type="checkbox"
                      checked={formData.targetAudience.includes(role)}
                      onChange={(e) => handleTargetAudienceChange(role, e.target.checked)}
                    />
                    <Label style={{ margin: 0 }}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Label>
                  </MultiSelectOption>
                ))}
              </MultiSelectContainer>
              {errors.targetAudience && (
                <ErrorMessage>
                  <FiAlertCircle size={14} />
                  {errors.targetAudience}
                </ErrorMessage>
              )}
            </Section>

            <Section>
              <SectionTitle>
                <FiPaperclip />
                Attachments (Optional)
              </SectionTitle>
              
              <FileUploadArea
                isDragActive={isDragActive}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif';
                  input.onchange = (e) => {
                    const target = e.target as HTMLInputElement;
                    handleFileUpload(target.files);
                  };
                  input.click();
                }}
              >
                <FiUpload size={32} color="#6b7280" />
                <FileUploadText>
                  <strong>Click to upload</strong> or drag and drop files here
                  <br />
                  <small>Supports: PDF, DOC, DOCX, JPG, PNG, GIF (max 10MB each)</small>
                </FileUploadText>
              </FileUploadArea>

              {formData.attachments.length > 0 && (
                <FileList>
                  {formData.attachments.map((file, index) => (
                    <FileItem key={index}>
                      <FileInfo>
                        <FiPaperclip />
                        <div>
                          <FileName>{file.name}</FileName>
                          <FileSize>{formatFileSize(file.size)}</FileSize>
                        </div>
                      </FileInfo>
                      <RemoveFileButton onClick={() => removeFile(index)}>
                        <FiX size={12} />
                      </RemoveFileButton>
                    </FileItem>
                  ))}
                </FileList>
              )}
            </Section>

            <Section>
              <SectionTitle>
                <FiCalendar />
                Scheduling (Optional)
              </SectionTitle>
              
              <FormRow>
                <FormGroup>
                  <Label>Scheduled Publish Time</Label>
                  <Input
                    type="datetime-local"
                    value={formData.scheduledPublishAt}
                    onChange={(e) => handleInputChange('scheduledPublishAt', e.target.value)}
                    hasError={!!errors.scheduledPublishAt}
                  />
                  {errors.scheduledPublishAt && (
                    <ErrorMessage>
                      <FiAlertCircle size={14} />
                      {errors.scheduledPublishAt}
                    </ErrorMessage>
                  )}
                  <small style={{ color: '#6b7280', fontSize: '12px' }}>
                    Leave empty to publish immediately
                  </small>
                </FormGroup>

                <FormGroup>
                  <Label>Expiration Date</Label>
                  <Input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                    hasError={!!errors.expiresAt}
                  />
                  {errors.expiresAt && (
                    <ErrorMessage>
                      <FiAlertCircle size={14} />
                      {errors.expiresAt}
                    </ErrorMessage>
                  )}
                  <small style={{ color: '#6b7280', fontSize: '12px' }}>
                    Leave empty for no expiration
                  </small>
                </FormGroup>
              </FormRow>
            </Section>

            <Section>
              <SectionTitle>
                <FiSettings />
                Options
              </SectionTitle>
              
              <FormRow>
                <FormGroup>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      checked={formData.allowComments}
                      onChange={(e) => handleInputChange('allowComments', e.target.checked)}
                    />
                    <Label>
                      <FiMessageSquare />
                      Allow comments
                    </Label>
                  </CheckboxGroup>
                </FormGroup>

                <FormGroup>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      checked={formData.requireAcknowledgment}
                      onChange={(e) => handleInputChange('requireAcknowledgment', e.target.checked)}
                    />
                    <Label>
                      <FiCheck />
                      Require acknowledgment
                    </Label>
                  </CheckboxGroup>
                </FormGroup>
              </FormRow>

              <FormRow className="full-width">
                <FormGroup>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      checked={formData.isPinned}
                      onChange={(e) => handleInputChange('isPinned', e.target.checked)}
                    />
                    <Label>
                      <FiStar />
                      Pin announcement (appears at top)
                    </Label>
                  </CheckboxGroup>
                </FormGroup>
              </FormRow>
            </Section>

            <Section>
              <SectionTitle>
                <FiTag />
                Tags (Optional)
              </SectionTitle>
              
              <FormRow className="full-width">
                <FormGroup>
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
            </Section>

            {formData.priority === 'urgent' && (
              <InfoBox>
                <FiAlertTriangle />
                <div>
                  <strong>Urgent Priority:</strong> This announcement will be prominently displayed 
                  and may trigger immediate notifications to all targeted users.
                </div>
              </InfoBox>
            )}

            {formData.requireAcknowledgment && (
              <InfoBox>
                <FiInfo />
                <div>
                  <strong>Acknowledgment Required:</strong> Recipients will need to confirm they 
                  have read this announcement before it's marked as complete.
                </div>
              </InfoBox>
            )}
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
                  Creating...
                </>
              ) : (
                <>
                  <FiCheck size={16} />
                  Create Announcement
                </>
              )}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewAnnouncementForm;