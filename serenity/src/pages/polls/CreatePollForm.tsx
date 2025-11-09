import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FiX,
  FiCheckSquare,
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
  FiBarChart,
  FiSliders,
  FiFileText,
  FiTarget
} from 'react-icons/fi';
import {
  Poll,
  CreatePollData,
  PollOption
} from '../../types/polls';

interface CreatePollFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePollData) => void;
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

const OptionsContainer = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[300]};
  }
`;

const OptionInput = styled.input<{ hasError?: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme, hasError }) => 
    hasError ? theme.colors.error[300] : theme.colors.gray[300]
  };
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: all 0.2s ease-in-out;

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => 
      hasError ? theme.colors.error[500] : theme.colors.primary[500]
    };
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const RemoveOptionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
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

const AddOptionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]};
  border: 2px dashed ${({ theme }) => theme.colors.gray[300]};
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[600]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    color: ${({ theme }) => theme.colors.primary[600]};
    background: ${({ theme }) => theme.colors.primary[50]};
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

const CreatePollForm: React.FC<CreatePollFormProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'single-choice' as Poll['type'],
    category: 'governance' as Poll['category'],
    options: [{ text: '' }, { text: '' }] as Omit<PollOption, 'id' | 'votes' | 'percentage'>[],
    allowMultipleVotes: false,
    allowAnonymousVoting: true,
    showResultsBeforeEnd: false,
    requireAuthentication: true,
    targetAudience: 'all' as Poll['targetAudience'],
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    tags: [] as string[],
    isUrgent: false
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = { text: value };
    handleInputChange('options', newOptions);
    
    if (errors[`option-${index}`]) {
      setErrors(prev => ({ ...prev, [`option-${index}`]: '' }));
    }
  };

  const addOption = () => {
    if (formData.options.length < 10) {
      handleInputChange('options', [...formData.options, { text: '' }]);
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      handleInputChange('options', newOptions);
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Poll title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Poll description is required';
    }

    // Validate options based on poll type
    if (formData.type !== 'text') {
      const validOptions = formData.options.filter(opt => opt.text.trim());
      
      if (validOptions.length < 2) {
        newErrors.options = 'At least 2 options are required';
      }

      formData.options.forEach((option, index) => {
        if (!option.text.trim()) {
          newErrors[`option-${index}`] = 'Option text is required';
        }
      });
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    // Validate date/time logic
    if (formData.startDate && formData.endDate && formData.startTime && formData.endTime) {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
      
      if (endDateTime <= startDateTime) {
        newErrors.endDate = 'End date/time must be after start date/time';
      }

      // Check if start date is not in the past
      const now = new Date();
      if (startDateTime < now) {
        newErrors.startDate = 'Start date/time cannot be in the past';
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
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      // Filter out empty options for non-text polls
      const validOptions = formData.type === 'text' ? [] : 
        formData.options.filter(opt => opt.text.trim()).map(opt => ({ text: opt.text.trim() }));

      const submitData: CreatePollData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        category: formData.category,
        options: validOptions,
        allowMultipleVotes: formData.allowMultipleVotes,
        allowAnonymousVoting: formData.allowAnonymousVoting,
        showResultsBeforeEnd: formData.showResultsBeforeEnd,
        requireAuthentication: formData.requireAuthentication,
        targetAudience: formData.targetAudience,
        startDate: startDateTime,
        endDate: endDateTime,
        tags: formData.tags,
        isUrgent: formData.isUrgent
      };

      await onSubmit(submitData);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        type: 'single-choice',
        category: 'governance',
        options: [{ text: '' }, { text: '' }],
        allowMultipleVotes: false,
        allowAnonymousVoting: true,
        showResultsBeforeEnd: false,
        requireAuthentication: true,
        targetAudience: 'all',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        tags: [],
        isUrgent: false
      });
      setTagInput('');
      setErrors({});
    } catch (error) {
      console.error('Error creating poll:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Create New Poll</ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX size={16} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <Section>
              <SectionTitle>
                <FiFileText />
                Poll Details
              </SectionTitle>
              
              <FormRow className="full-width">
                <FormGroup>
                  <Label>
                    Poll Title <span className="required">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter poll title"
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
                    placeholder="Provide details about what you're polling about..."
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

              <FormRow className="three-columns">
                <FormGroup>
                  <Label>Poll Type</Label>
                  <Select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value as Poll['type'])}
                  >
                    <option value="single-choice">Single Choice</option>
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="rating">Rating (1-5)</option>
                    <option value="yes-no">Yes/No</option>
                    <option value="text">Open Text</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value as Poll['category'])}
                  >
                    <option value="governance">Governance</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="amenities">Amenities</option>
                    <option value="social">Social</option>
                    <option value="financial">Financial</option>
                    <option value="other">Other</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Target Audience</Label>
                  <Select
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value as Poll['targetAudience'])}
                  >
                    <option value="all">All Members</option>
                    <option value="owners">Owners Only</option>
                    <option value="tenants">Tenants Only</option>
                    <option value="committee">Committee Only</option>
                  </Select>
                </FormGroup>
              </FormRow>
            </Section>

            {formData.type !== 'text' && formData.type !== 'rating' && (
              <Section>
                <SectionTitle>
                  <FiBarChart />
                  Poll Options
                </SectionTitle>
                
                <OptionsContainer>
                  {formData.options.map((option, index) => (
                    <OptionItem key={index}>
                      <OptionInput
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option.text}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        hasError={!!errors[`option-${index}`]}
                      />
                      {formData.options.length > 2 && (
                        <RemoveOptionButton
                          type="button"
                          onClick={() => removeOption(index)}
                        >
                          <FiTrash2 size={14} />
                        </RemoveOptionButton>
                      )}
                    </OptionItem>
                  ))}
                  
                  {errors.options && (
                    <ErrorMessage>
                      <FiAlertCircle size={14} />
                      {errors.options}
                    </ErrorMessage>
                  )}

                  {formData.options.length < 10 && (
                    <AddOptionButton type="button" onClick={addOption}>
                      <FiPlus size={16} />
                      Add Option
                    </AddOptionButton>
                  )}
                </OptionsContainer>
              </Section>
            )}

            <Section>
              <SectionTitle>
                <FiCalendar />
                Schedule
              </SectionTitle>
              
              <FormRow>
                <FormGroup>
                  <Label>
                    Start Date <span className="required">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    hasError={!!errors.startDate}
                  />
                  {errors.startDate && (
                    <ErrorMessage>
                      <FiAlertCircle size={14} />
                      {errors.startDate}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>
                    Start Time <span className="required">*</span>
                  </Label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    hasError={!!errors.startTime}
                  />
                  {errors.startTime && (
                    <ErrorMessage>
                      <FiAlertCircle size={14} />
                      {errors.startTime}
                    </ErrorMessage>
                  )}
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>
                    End Date <span className="required">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    hasError={!!errors.endDate}
                  />
                  {errors.endDate && (
                    <ErrorMessage>
                      <FiAlertCircle size={14} />
                      {errors.endDate}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>
                    End Time <span className="required">*</span>
                  </Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    hasError={!!errors.endTime}
                  />
                  {errors.endTime && (
                    <ErrorMessage>
                      <FiAlertCircle size={14} />
                      {errors.endTime}
                    </ErrorMessage>
                  )}
                </FormGroup>
              </FormRow>
            </Section>

            <Section>
              <SectionTitle>
                <FiSettings />
                Voting Settings
              </SectionTitle>
              
              <FormRow>
                <FormGroup>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      checked={formData.allowAnonymousVoting}
                      onChange={(e) => handleInputChange('allowAnonymousVoting', e.target.checked)}
                    />
                    <Label>
                      <FiEyeOff />
                      Allow anonymous voting
                    </Label>
                  </CheckboxGroup>
                </FormGroup>

                <FormGroup>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      checked={formData.requireAuthentication}
                      onChange={(e) => handleInputChange('requireAuthentication', e.target.checked)}
                    />
                    <Label>
                      <FiLock />
                      Require authentication
                    </Label>
                  </CheckboxGroup>
                </FormGroup>
              </FormRow>

              {formData.type === 'multiple-choice' && (
                <FormRow className="full-width">
                  <FormGroup>
                    <CheckboxGroup>
                      <Checkbox
                        type="checkbox"
                        checked={formData.allowMultipleVotes}
                        onChange={(e) => handleInputChange('allowMultipleVotes', e.target.checked)}
                      />
                      <Label>
                        <FiCheckSquare />
                        Allow multiple selections
                      </Label>
                    </CheckboxGroup>
                  </FormGroup>
                </FormRow>
              )}

              <FormRow>
                <FormGroup>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      checked={formData.showResultsBeforeEnd}
                      onChange={(e) => handleInputChange('showResultsBeforeEnd', e.target.checked)}
                    />
                    <Label>
                      <FiEye />
                      Show results before poll ends
                    </Label>
                  </CheckboxGroup>
                </FormGroup>

                <FormGroup>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      checked={formData.isUrgent}
                      onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                    />
                    <Label>
                      <FiAlertCircle />
                      Mark as urgent
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

            {formData.type === 'yes-no' && (
              <InfoBox>
                <FiInfo />
                <div>
                  <strong>Yes/No Poll:</strong> This will create a simple yes or no question. 
                  Voters will only be able to choose between "Yes" and "No" options.
                </div>
              </InfoBox>
            )}

            {formData.type === 'rating' && (
              <InfoBox>
                <FiInfo />
                <div>
                  <strong>Rating Poll:</strong> This will create a 1-5 star rating system. 
                  Voters can rate from 1 (lowest) to 5 (highest) stars.
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
                  Create Poll
                </>
              )}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreatePollForm;