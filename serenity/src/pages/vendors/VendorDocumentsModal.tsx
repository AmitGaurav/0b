import React, { useState, useEffect, useRef } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import {
  FiX,
  FiUpload,
  FiFile,
  FiFileText,
  FiImage,
  FiTrash2,
  FiUser,
  FiCalendar,
  FiTag,
  FiAlertCircle,
  FiCheckCircle,
  FiFolder
} from 'react-icons/fi';
import { toast } from 'react-toastify';

interface VendorDocument {
  id?: number;
  vendorId: number;
  vendorName: string;
  documentName: string;
  documentType: 'license' | 'certificate' | 'insurance' | 'registration' | 'contract' | 'identification' | 'other';
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate?: Date;
  uploadedBy?: string;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedDate?: Date;
  expiryDate?: Date | string;
  isRequired: boolean;
  description: string;
  rejectionReason?: string;
  version?: number;
  downloadCount?: number;
  lastAccessed?: Date;
  tags: string[];
  category: string;
  isActive?: boolean;
  fileUrl?: string;
}

interface VendorDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: VendorDocument | null;
  onSubmit: (documentData: Partial<VendorDocument>) => void;
}

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
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.boxShadow.xl};
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  justify-content: between;
  align-items: center;
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.colors.white};
  z-index: 10;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing[4]};
  right: ${({ theme }) => theme.spacing[4]};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[2]};
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

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.all};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[500]};
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[500]};
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  resize: vertical;
  min-height: 80px;
  transition: ${({ theme }) => theme.transition.all};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const FileUploadArea = styled.div<{ isDragOver: boolean; hasFile: boolean }>`
  border: 2px dashed;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[8]};
  text-align: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  position: relative;

  ${({ isDragOver, hasFile, theme }) => {
    if (hasFile) {
      return `
        border-color: ${theme.colors.success[300]};
        background: ${theme.colors.success[50]};
      `;
    }
    if (isDragOver) {
      return `
        border-color: ${theme.colors.primary[400]};
        background: ${theme.colors.primary[50]};
      `;
    }
    return `
      border-color: ${theme.colors.gray[300]};
      background: ${theme.colors.gray[50]};
      
      &:hover {
        border-color: ${theme.colors.primary[400]};
        background: ${theme.colors.primary[50]};
      }
    `;
  }}
`;

const FileUploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FileUploadIcon = styled.div`
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const FileUploadText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  strong {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const HiddenFileInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

const FilePreview = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const FileDetails = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  flex: 1;
`;

const FileIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const FileText = styled.div`
  flex: 1;
`;

const FileName = styled.p`
  margin: 0 0 4px 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const FileSize = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const RemoveFileButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error[600]};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.error[50]};
    color: ${({ theme }) => theme.colors.error[700]};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
  margin: 0;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: 4px 8px;
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[700]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 12px;
  font-weight: 500;
`;

const TagInput = styled.input`
  width: 120px;
  padding: 4px 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 12px;
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary[600]};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
  }
`;

const ModalFooter = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: flex-end;
  position: sticky;
  bottom: 0;
  background: ${({ theme }) => theme.colors.white};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: ${({ theme }: { theme: DefaultTheme }) => theme.spacing[3]} ${({ theme }: { theme: DefaultTheme }) => theme.spacing[6]};
  border: 1px solid;
  border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius.md};
  font-size: ${({ theme }: { theme: DefaultTheme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }: { theme: DefaultTheme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }: { theme: DefaultTheme }) => theme.transition.all};
  display: flex;
  align-items: center;
  gap: ${({ theme }: { theme: DefaultTheme }) => theme.spacing[2]};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ variant = 'secondary', theme }: { variant?: string; theme: DefaultTheme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary[600]};
          color: ${theme.colors.white};
          border-color: ${theme.colors.primary[600]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary[700]};
            border-color: ${theme.colors.primary[700]};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error[600]};
          color: ${theme.colors.white};
          border-color: ${theme.colors.error[600]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.error[700]};
            border-color: ${theme.colors.error[700]};
          }
        `;
      default:
        return `
          background: ${theme.colors.white};
          color: ${theme.colors.gray[700]};
          border-color: ${theme.colors.gray[300]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.gray[50]};
            border-color: ${theme.colors.gray[400]};
          }
        `;
    }
  }}
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.error[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const VendorDocumentsModal: React.FC<VendorDocumentsModalProps> = ({
  isOpen,
  onClose,
  document,
  onSubmit
}) => {
  const [formData, setFormData] = useState<Partial<VendorDocument>>({
    vendorId: 1,
    vendorName: '',
    documentName: '',
    documentType: 'license',
    fileName: '',
    fileSize: 0,
    fileType: '',
    isRequired: false,
    description: '',
    tags: [],
    category: ''
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock vendor options
  const vendorOptions = [
    { id: 1, name: 'QuickFix Plumbers' },
    { id: 2, name: 'PowerTech Electricians' },
    { id: 3, name: 'EcoClean Solutions' },
    { id: 4, name: 'SecureGuard Agency' },
    { id: 5, name: 'TechSupport Pro' }
  ];

  useEffect(() => {
    if (document) {
      setFormData({
        ...document,
        expiryDate: document.expiryDate 
          ? (document.expiryDate instanceof Date 
              ? document.expiryDate.toISOString().split('T')[0] 
              : document.expiryDate)
          : undefined
      } as any);
    } else {
      setFormData({
        vendorId: 1,
        vendorName: vendorOptions[0].name,
        documentName: '',
        documentType: 'license',
        fileName: '',
        fileSize: 0,
        fileType: '',
        isRequired: false,
        description: '',
        tags: [],
        category: ''
      });
    }
    setSelectedFile(null);
    setErrors({});
  }, [document, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleVendorChange = (vendorId: number) => {
    const vendor = vendorOptions.find(v => v.id === vendorId);
    setFormData({
      ...formData,
      vendorId,
      vendorName: vendor ? vendor.name : ''
    });
  };

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid file type (PDF, DOC, DOCX, JPG, PNG)');
      return;
    }

    setSelectedFile(file);
    setFormData({
      ...formData,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    if (errors.fileName) {
      setErrors({ ...errors, fileName: '' });
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setFormData({
      ...formData,
      fileName: '',
      fileSize: 0,
      fileType: ''
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.documentName?.trim()) {
      newErrors.documentName = 'Document name is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.category?.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!document && !selectedFile) {
      newErrors.fileName = 'Please select a file to upload';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: Partial<VendorDocument> = {
      ...formData,
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate as string) : undefined,
      uploadedBy: 'Current User'
    };

    onSubmit(submitData);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string, fileType: string) => {
    if (fileType.includes('image')) return <FiImage size={20} />;
    if (fileType.includes('pdf') || fileName.endsWith('.pdf')) return <FiFileText size={20} />;
    return <FiFile size={20} />;
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {document ? 'Edit Document' : 'Add New Document'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX size={24} />
          </CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            <FormRow>
              <FormGroup>
                <Label>Vendor *</Label>
                <Select
                  value={formData.vendorId || ''}
                  onChange={(e) => handleVendorChange(Number(e.target.value))}
                  disabled={!!document}
                >
                  {vendorOptions.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Document Type *</Label>
                <Select
                  value={formData.documentType || 'license'}
                  onChange={(e) => handleInputChange('documentType', e.target.value)}
                >
                  <option value="license">License</option>
                  <option value="certificate">Certificate</option>
                  <option value="insurance">Insurance</option>
                  <option value="registration">Registration</option>
                  <option value="contract">Contract</option>
                  <option value="identification">Identification</option>
                  <option value="other">Other</option>
                </Select>
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>Document Name *</Label>
              <Input
                type="text"
                placeholder="Enter document name"
                value={formData.documentName || ''}
                onChange={(e) => handleInputChange('documentName', e.target.value)}
              />
              {errors.documentName && (
                <ErrorMessage>
                  <FiAlertCircle size={16} />
                  {errors.documentName}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Description *</Label>
              <TextArea
                placeholder="Enter document description"
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
              {errors.description && (
                <ErrorMessage>
                  <FiAlertCircle size={16} />
                  {errors.description}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label>Category *</Label>
                <Input
                  type="text"
                  placeholder="e.g., plumbing, electrical, cleaning"
                  value={formData.category || ''}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                />
                {errors.category && (
                  <ErrorMessage>
                    <FiAlertCircle size={16} />
                    {errors.category}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={(typeof formData.expiryDate === 'string' ? formData.expiryDate : '') || ''}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>File Upload {!document && '*'}</Label>
              <FileUploadArea
                isDragOver={isDragOver}
                hasFile={!!selectedFile || !!document?.fileName}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FileUploadContent>
                  <FileUploadIcon>
                    <FiUpload size={32} />
                  </FileUploadIcon>
                  <FileUploadText>
                    <strong>Click to upload</strong> or drag and drop<br />
                    PDF, DOC, DOCX, JPG, PNG (max 10MB)
                  </FileUploadText>
                </FileUploadContent>
              </FileUploadArea>

              <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />

              {(selectedFile || document?.fileName) && (
                <FilePreview>
                  <FileInfo>
                    <FileDetails>
                      <FileIcon>
                        {selectedFile 
                          ? getFileIcon(selectedFile.name, selectedFile.type)
                          : getFileIcon(document?.fileName || '', document?.fileType || '')
                        }
                      </FileIcon>
                      <FileText>
                        <FileName>
                          {selectedFile ? selectedFile.name : document?.fileName}
                        </FileName>
                        <FileSize>
                          {formatFileSize(selectedFile ? selectedFile.size : document?.fileSize || 0)}
                        </FileSize>
                      </FileText>
                    </FileDetails>
                    <RemoveFileButton onClick={handleFileRemove}>
                      <FiTrash2 size={16} />
                    </RemoveFileButton>
                  </FileInfo>
                </FilePreview>
              )}

              {errors.fileName && (
                <ErrorMessage>
                  <FiAlertCircle size={16} />
                  {errors.fileName}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <CheckboxGroup>
                <Checkbox
                  id="isRequired"
                  type="checkbox"
                  checked={formData.isRequired || false}
                  onChange={(e) => handleInputChange('isRequired', e.target.checked)}
                />
                <CheckboxLabel htmlFor="isRequired">
                  This is a required document
                </CheckboxLabel>
              </CheckboxGroup>
            </FormGroup>

            <FormGroup>
              <Label>Tags</Label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                <TagInput
                  type="text"
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag}>
                  <FiTag size={14} />
                  Add
                </Button>
              </div>
              <TagsContainer>
                {formData.tags?.map((tag, index) => (
                  <Tag key={index}>
                    {tag}
                    <RemoveTagButton onClick={() => removeTag(tag)}>
                      <FiX size={12} />
                    </RemoveTagButton>
                  </Tag>
                ))}
              </TagsContainer>
            </FormGroup>
          </ModalBody>

          <ModalFooter>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <FiCheckCircle size={16} />
              {document ? 'Update Document' : 'Add Document'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default VendorDocumentsModal;