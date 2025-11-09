import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FiX,
  FiUpload,
  FiFile,
  FiCalendar,
  FiLock,
  FiTag,
  FiFileText,
  FiFolder,
  FiShield,
  FiCheck,
  FiClock,
  FiAlertCircle,
  FiInfo,
  FiLink,
  FiSettings
} from 'react-icons/fi';
import {
  DocumentType,
  DocumentCategory,
  DocumentAccessLevel,
  CreateDocumentData,
  DOCUMENT_TYPE_LABELS,
  DOCUMENT_CATEGORY_LABELS,
  DOCUMENT_ACCESS_LEVEL_LABELS
} from '../../types/documents';

interface UploadDocumentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDocumentData) => void;
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
  max-width: 900px;
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
  min-height: 100px;
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

const FileUploadArea = styled.div<{ isDragOver?: boolean; hasError?: boolean }>`
  border: 2px dashed ${({ theme, hasError, isDragOver }) => {
    if (hasError) return theme.colors.error[300];
    if (isDragOver) return theme.colors.primary[400];
    return theme.colors.gray[300];
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[8]};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background: ${({ theme, isDragOver }) => 
    isDragOver ? theme.colors.primary[50] : 'white'
  };

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
`;

const UploadIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[600]};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const FileIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[600]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FileDetails = styled.div`
  flex: 1;
  
  .file-name {
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.gray[800]};
    margin-bottom: ${({ theme }) => theme.spacing[1]};
  }
  
  .file-size {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.gray[600]};
  }
`;

const RemoveFileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
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

const UploadDocumentForm: React.FC<UploadDocumentFormProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: DocumentType.OTHER,
    category: DocumentCategory.GENERAL,
    accessLevel: DocumentAccessLevel.MEMBERS_ONLY,
    tags: [] as string[],
    expiresAt: '',
    isTemplate: false
  });

  const [file, setFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    if (errors.file) {
      setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = () => {
    setFile(null);
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
      newErrors.title = 'Document title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Document description is required';
    }

    if (!file) {
      newErrors.file = 'Please select a file to upload';
    } else {
      // File size validation (max 50MB)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        newErrors.file = 'File size must be less than 50MB';
      }
    }

    if (formData.expiresAt) {
      const expiryDate = new Date(formData.expiresAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (expiryDate <= today) {
        newErrors.expiresAt = 'Expiry date must be in the future';
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
      const submitData: CreateDocumentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        category: formData.category,
        accessLevel: formData.accessLevel,
        file: file!,
        tags: formData.tags.length > 0 ? formData.tags : undefined,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
        isTemplate: formData.isTemplate
      };

      await onSubmit(submitData);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: DocumentType.OTHER,
        category: DocumentCategory.GENERAL,
        accessLevel: DocumentAccessLevel.MEMBERS_ONLY,
        tags: [],
        expiresAt: '',
        isTemplate: false
      });
      setFile(null);
      setTagInput('');
      setErrors({});
    } catch (error) {
      console.error('Error uploading document:', error);
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

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    return <FiFile size={20} />;
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Upload Document</ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX size={16} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <Section>
              <SectionTitle>
                <FiFileText />
                Document Details
              </SectionTitle>
              
              <FormRow className="full-width">
                <FormGroup>
                  <Label>
                    Document Title <span className="required">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter document title"
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
                    placeholder="Provide a detailed description of the document, its purpose, and any relevant information..."
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
                <FiUpload />
                File Upload
              </SectionTitle>
              
              {!file ? (
                <FileUploadArea
                  isDragOver={isDragOver}
                  hasError={!!errors.file}
                  onDrop={handleFileDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <input
                    type="file"
                    onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.txt,.csv"
                  />
                  <label htmlFor="file-upload">
                    <FileUploadContent>
                      <UploadIcon>
                        <FiUpload size={24} />
                      </UploadIcon>
                      <div>
                        <strong>Click to upload</strong> or drag and drop
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        PDF, DOC, XLS, PPT, Images up to 50MB
                      </div>
                    </FileUploadContent>
                  </label>
                </FileUploadArea>
              ) : (
                <FileInfo>
                  <FileIcon>
                    {getFileIcon(file.name)}
                  </FileIcon>
                  <FileDetails>
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{formatFileSize(file.size)}</div>
                  </FileDetails>
                  <RemoveFileButton onClick={removeFile}>
                    <FiX size={16} />
                  </RemoveFileButton>
                </FileInfo>
              )}

              {errors.file && (
                <ErrorMessage>
                  <FiAlertCircle size={14} />
                  {errors.file}
                </ErrorMessage>
              )}
            </Section>

            <Section>
              <SectionTitle>
                <FiFolder />
                Classification
              </SectionTitle>
              
              <FormRow>
                <FormGroup>
                  <Label>Document Type</Label>
                  <Select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value as DocumentType)}
                  >
                    {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value as DocumentCategory)}
                  >
                    {Object.entries(DOCUMENT_CATEGORY_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </Select>
                </FormGroup>
              </FormRow>
            </Section>

            <Section>
              <SectionTitle>
                <FiShield />
                Access Control
              </SectionTitle>
              
              <FormRow>
                <FormGroup>
                  <Label>Access Level</Label>
                  <Select
                    value={formData.accessLevel}
                    onChange={(e) => handleInputChange('accessLevel', e.target.value as DocumentAccessLevel)}
                  >
                    {Object.entries(DOCUMENT_ACCESS_LEVEL_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Expiry Date (Optional)</Label>
                  <Input
                    type="date"
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
                </FormGroup>
              </FormRow>

              <InfoBox>
                <FiInfo size={16} />
                <div>
                  <strong>Access Level Guide:</strong><br />
                  • <strong>Public:</strong> Anyone can view<br />
                  • <strong>Members Only:</strong> All society members can view<br />
                  • <strong>Committee Only:</strong> Only committee members can view<br />
                  • <strong>Admin Only:</strong> Only administrators can view<br />
                  • <strong>Restricted:</strong> Custom permissions required
                </div>
              </InfoBox>
            </Section>

            <Section>
              <SectionTitle>
                <FiTag />
                Additional Options
              </SectionTitle>
              
              <FormRow className="full-width">
                <FormGroup>
                  <Label>Tags (Optional)</Label>
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
                      checked={formData.isTemplate}
                      onChange={(e) => handleInputChange('isTemplate', e.target.checked)}
                    />
                    <Label>
                      <FiSettings />
                      Mark as template document
                    </Label>
                  </CheckboxGroup>
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
                  Uploading...
                </>
              ) : (
                <>
                  <FiCheck size={16} />
                  Upload Document
                </>
              )}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UploadDocumentForm;