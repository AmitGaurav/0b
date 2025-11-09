import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  FiX, 
  FiUpload, 
  FiTrash2, 
  FiAlertCircle,
  FiFile,
  FiImage
} from 'react-icons/fi';
import { ComplaintPriority, ComplaintType, ComplaintFormData, Block, Unit } from '../../types/complaint';
import { useAuth } from '../../hooks/useAuth';

// Styled Components
const Modal = styled.div`
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
  box-shadow: ${({ theme }) => theme.boxShadow.xl};
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[3]};
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
`;

const RequiredIndicator = styled.span`
  color: ${({ theme }) => theme.colors.error[500]};
  margin-left: 4px;
`;

const Input = styled.input<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ hasError, theme }) => 
    hasError ? theme.colors.error[300] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.colors};
  background: ${({ theme }) => theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${({ hasError, theme }) => 
      hasError ? theme.colors.error[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ hasError, theme }) => 
      hasError ? theme.colors.error[100] : theme.colors.primary[100]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

const Select = styled.select<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ hasError, theme }) => 
    hasError ? theme.colors.error[300] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    outline: none;
    border-color: ${({ hasError, theme }) => 
      hasError ? theme.colors.error[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ hasError, theme }) => 
      hasError ? theme.colors.error[100] : theme.colors.primary[100]};
  }
`;

const TextArea = styled.textarea<{ hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ hasError, theme }) => 
    hasError ? theme.colors.error[300] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    outline: none;
    border-color: ${({ hasError, theme }) => 
      hasError ? theme.colors.error[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ hasError, theme }) => 
      hasError ? theme.colors.error[100] : theme.colors.primary[100]};
  }
`;

const ErrorMessage = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.error[600]};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const FileUploadArea = styled.div<{ isDragActive?: boolean; hasError?: boolean }>`
  border: 2px dashed ${({ isDragActive, hasError, theme }) => {
    if (hasError) return theme.colors.error[300];
    if (isDragActive) return theme.colors.primary[500];
    return theme.colors.gray[300];
  }};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  background: ${({ isDragActive, theme }) => 
    isDragActive ? theme.colors.primary[50] : theme.colors.gray[50]};
  transition: ${({ theme }) => theme.transition.colors};
  cursor: pointer;

  &:hover {
    border-color: ${({ hasError, theme }) => 
      hasError ? theme.colors.error[400] : theme.colors.primary[400]};
  }
`;

const FileUploadInput = styled.input`
  display: none;
`;

const FileUploadText = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const UploadedFilesList = styled.div`
  margin-top: ${({ theme }) => theme.spacing[3]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const UploadedFile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FileName = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const FileSize = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const RemoveFileButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error[500]};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.error[100]};
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

const RadioOption = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const RadioInput = styled.input`
  width: 16px;
  height: 16px;
  margin: 0;
  cursor: pointer;
`;

const RadioLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const VisibilityDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: ${({ theme }) => theme.spacing[1]};
  line-height: 1.4;
`;

const ModalFooter = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};
  border: none;

  ${({ variant, theme }) => {
    if (variant === 'primary') {
      return `
        background: ${theme.colors.primary[600]};
        color: ${theme.colors.white};

        &:hover:not(:disabled) {
          background: ${theme.colors.primary[700]};
        }

        &:disabled {
          background: ${theme.colors.gray[300]};
          color: ${theme.colors.gray[500]};
          cursor: not-allowed;
        }
      `;
    }
    return `
      background: ${theme.colors.white};
      color: ${theme.colors.gray[700]};
      border: 1px solid ${theme.colors.gray[300]};

      &:hover {
        background: ${theme.colors.gray[50]};
      }
    `;
  }}
`;

// Form validation schema
const validationSchema = yup.object().shape({
  type: yup.string().required('Complaint type is required'),
  priority: yup.string().required('Priority is required'),
  details: yup
    .string()
    .required('Details are required')
    .min(10, 'Please provide at least 10 characters of detail')
    .max(2000, 'Details cannot exceed 2000 characters'),
  blockId: yup.number().required('Block selection is required'),
  unitId: yup.number().required('Unit selection is required'),
  visibility: yup.string().required('Visibility selection is required'),
});

interface ComplaintFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ComplaintFormData) => Promise<void>;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blocks] = useState<Block[]>([
    { id: 1, name: 'A1', societyId: 1 },
    { id: 2, name: 'A2', societyId: 1 },
    { id: 3, name: 'C1', societyId: 1 },
    { id: 4, name: 'C2', societyId: 1 },
    { id: 5, name: 'C3', societyId: 1 }
  ]);
  const [units, setUnits] = useState<Unit[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<ComplaintFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      type: '' as ComplaintType,
      priority: ComplaintPriority.MEDIUM,
      details: '',
      blockId: 0,
      unitId: 0,
      visibility: 'private'
    }
  });

  const selectedBlockId = watch('blockId');

  // Generate units based on selected block
  useEffect(() => {
    if (selectedBlockId) {
      const blockUnits: Unit[] = [];
      const block = blocks.find(b => b.id === selectedBlockId);
      if (block) {
        // Generate sample units for each block
        const unitCount = block.name.startsWith('A') ? 50 : 75; // Different unit counts for different blocks
        for (let i = 1; i <= unitCount; i++) {
          blockUnits.push({
            id: selectedBlockId * 1000 + i,
            unitNumber: `${block.name}-${String(i).padStart(3, '0')}`,
            blockId: selectedBlockId,
            type: Math.random() > 0.7 ? '3BHK' : '2BHK'
          });
        }
      }
      setUnits(blockUnits);
    } else {
      setUnits([]);
    }
  }, [selectedBlockId, blocks]);

  const handleFileUpload = (uploadedFiles: FileList) => {
    const newFiles = Array.from(uploadedFiles);
    const validFiles = newFiles.filter(file => {
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      return isValidSize && isValidType;
    });
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const onFormSubmit = async (data: ComplaintFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        ...data,
        attachments: files
      });
      reset();
      setFiles([]);
      onClose();
    } catch (error) {
      console.error('Error submitting complaint:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFiles = e.dataTransfer.files;
    handleFileUpload(droppedFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  if (!isOpen) return null;

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Log New Complaint</ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit(onFormSubmit)}>
            <FormRow>
              <FormGroup>
                <Label>
                  Complaint Type <RequiredIndicator>*</RequiredIndicator>
                </Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} hasError={!!errors.type}>
                      <option value="">Select complaint type</option>
                      <option value={ComplaintType.MAINTENANCE}>Maintenance</option>
                      <option value={ComplaintType.SECURITY}>Security</option>
                      <option value={ComplaintType.CLEANLINESS}>Cleanliness</option>
                      <option value={ComplaintType.WATER_SUPPLY}>Water Supply</option>
                      <option value={ComplaintType.ELECTRICITY}>Electricity</option>
                      <option value={ComplaintType.PARKING}>Parking</option>
                      <option value={ComplaintType.NOISE}>Noise</option>
                      <option value={ComplaintType.GARBAGE}>Garbage</option>
                      <option value={ComplaintType.LIFT}>Lift</option>
                      <option value={ComplaintType.PLUMBING}>Plumbing</option>
                      <option value={ComplaintType.COMMON_AREA}>Common Area</option>
                      <option value={ComplaintType.OTHER}>Other</option>
                    </Select>
                  )}
                />
                {errors.type && (
                  <ErrorMessage>
                    <FiAlertCircle size={14} />
                    {errors.type.message}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>
                  Priority <RequiredIndicator>*</RequiredIndicator>
                </Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} hasError={!!errors.priority}>
                      <option value={ComplaintPriority.LOW}>Low</option>
                      <option value={ComplaintPriority.MEDIUM}>Medium</option>
                      <option value={ComplaintPriority.HIGH}>High</option>
                      <option value={ComplaintPriority.CRITICAL}>Critical</option>
                    </Select>
                  )}
                />
                {errors.priority && (
                  <ErrorMessage>
                    <FiAlertCircle size={14} />
                    {errors.priority.message}
                  </ErrorMessage>
                )}
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>
                Visibility <RequiredIndicator>*</RequiredIndicator>
              </Label>
              <Controller
                name="visibility"
                control={control}
                render={({ field }) => (
                  <div>
                    <RadioGroup>
                      <RadioOption>
                        <RadioInput
                          type="radio"
                          id="visibility-private"
                          {...field}
                          value="private"
                          checked={field.value === 'private'}
                        />
                        <RadioLabel htmlFor="visibility-private">
                          🔒 Private
                        </RadioLabel>
                      </RadioOption>
                      <RadioOption>
                        <RadioInput
                          type="radio"
                          id="visibility-public"
                          {...field}
                          value="public"
                          checked={field.value === 'public'}
                        />
                        <RadioLabel htmlFor="visibility-public">
                          🌍 Public
                        </RadioLabel>
                      </RadioOption>
                    </RadioGroup>
                    <VisibilityDescription>
                      <strong>Private:</strong> Only visible to you and management. <br />
                      <strong>Public:</strong> Visible to all residents in your society.
                    </VisibilityDescription>
                  </div>
                )}
              />
              {errors.visibility && (
                <ErrorMessage>
                  <FiAlertCircle size={14} />
                  {errors.visibility.message}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormRow>
              <FormGroup>
                <Label>
                  Block <RequiredIndicator>*</RequiredIndicator>
                </Label>
                <Controller
                  name="blockId"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      {...field} 
                      hasError={!!errors.blockId}
                      onChange={e => field.onChange(Number(e.target.value))}
                    >
                      <option value={0}>Select block</option>
                      {blocks.map(block => (
                        <option key={block.id} value={block.id}>
                          Block {block.name}
                        </option>
                      ))}
                    </Select>
                  )}
                />
                {errors.blockId && (
                  <ErrorMessage>
                    <FiAlertCircle size={14} />
                    {errors.blockId.message}
                  </ErrorMessage>
                )}
              </FormGroup>

              <FormGroup>
                <Label>
                  Unit <RequiredIndicator>*</RequiredIndicator>
                </Label>
                <Controller
                  name="unitId"
                  control={control}
                  render={({ field }) => (
                    <Select 
                      {...field} 
                      hasError={!!errors.unitId}
                      onChange={e => field.onChange(Number(e.target.value))}
                      disabled={!selectedBlockId}
                    >
                      <option value={0}>
                        {selectedBlockId ? 'Select unit' : 'Select block first'}
                      </option>
                      {units.map(unit => (
                        <option key={unit.id} value={unit.id}>
                          {unit.unitNumber} ({unit.type})
                        </option>
                      ))}
                    </Select>
                  )}
                />
                {errors.unitId && (
                  <ErrorMessage>
                    <FiAlertCircle size={14} />
                    {errors.unitId.message}
                  </ErrorMessage>
                )}
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>
                Complaint Details <RequiredIndicator>*</RequiredIndicator>
              </Label>
              <Controller
                name="details"
                control={control}
                render={({ field }) => (
                  <TextArea
                    {...field}
                    hasError={!!errors.details}
                    placeholder="Please provide detailed information about your complaint..."
                    maxLength={2000}
                  />
                )}
              />
              {errors.details && (
                <ErrorMessage>
                  <FiAlertCircle size={14} />
                  {errors.details.message}
                </ErrorMessage>
              )}
            </FormGroup>

            <FormGroup>
              <Label>Attachments (Optional)</Label>
              <FileUploadArea
                isDragActive={isDragActive}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <FiUpload size={24} style={{ marginBottom: '8px', color: '#6B7280' }} />
                <FileUploadText>
                  {isDragActive 
                    ? 'Drop files here...' 
                    : 'Click to upload or drag and drop files here'
                  }
                </FileUploadText>
                <FileUploadText style={{ fontSize: '12px', marginTop: '4px' }}>
                  Images and PDF files up to 10MB each
                </FileUploadText>
                <FileUploadInput
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={e => e.target.files && handleFileUpload(e.target.files)}
                />
              </FileUploadArea>

              {files.length > 0 && (
                <UploadedFilesList>
                  {files.map((file, index) => (
                    <UploadedFile key={index}>
                      <FileInfo>
                        {file.type.startsWith('image/') ? (
                          <FiImage size={16} />
                        ) : (
                          <FiFile size={16} />
                        )}
                        <div>
                          <FileName>{file.name}</FileName>
                          <FileSize> - {formatFileSize(file.size)}</FileSize>
                        </div>
                      </FileInfo>
                      <RemoveFileButton onClick={() => removeFile(index)}>
                        <FiTrash2 size={14} />
                      </RemoveFileButton>
                    </UploadedFile>
                  ))}
                </UploadedFilesList>
              )}
            </FormGroup>
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit(onFormSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ComplaintForm;