import React, { useState } from 'react';
import styled from 'styled-components';
import {
  FiX,
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiClock,
  FiTag,
  FiVideo,
  FiDollarSign,
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiRepeat,
  FiSettings,
  FiFileText,
  FiGlobe,
  FiLock,
  FiUserCheck
} from 'react-icons/fi';
import {
  Event,
  CreateEventData,
  EventLocation,
  EventRecurrence
} from '../../types/events';

interface CreateEventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEventData) => void;
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

const RecurrenceOptions = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const LocationFields = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
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

const CreateEventForm: React.FC<CreateEventFormProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'social' as Event['category'],
    type: 'community' as Event['type'],
    priority: 'medium' as Event['priority'],
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    isAllDay: false,
    isVirtual: false,
    meetingLink: '',
    locationName: '',
    locationAddress: '',
    locationDescription: '',
    capacity: '',
    maxAttendees: '',
    isRsvpRequired: true,
    rsvpDeadlineDate: '',
    allowGuestRsvp: true,
    waitlistEnabled: false,
    isPublic: true,
    targetAudience: 'all' as Event['targetAudience'],
    requiredApproval: false,
    tags: [] as string[],
    agenda: '',
    requirements: [] as string[],
    costAmount: '',
    costCurrency: 'USD',
    isRecurring: false,
    recurrenceType: 'weekly' as EventRecurrence['type'],
    recurrenceInterval: '1',
    recurrenceEndDate: ''
  });

  const [tagInput, setTagInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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

  const handleRequirementInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && requirementInput.trim()) {
      e.preventDefault();
      const newRequirement = requirementInput.trim();
      if (!formData.requirements.includes(newRequirement)) {
        handleInputChange('requirements', [...formData.requirements, newRequirement]);
      }
      setRequirementInput('');
    }
  };

  const removeRequirement = (reqToRemove: string) => {
    handleInputChange('requirements', formData.requirements.filter(req => req !== reqToRemove));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.isAllDay && !formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (!formData.isAllDay && !formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    // Validate date/time logic
    if (formData.startDate && formData.endDate) {
      const startDateTime = new Date(`${formData.startDate}${formData.startTime ? `T${formData.startTime}` : ''}`);
      const endDateTime = new Date(`${formData.endDate}${formData.endTime ? `T${formData.endTime}` : ''}`);
      
      if (endDateTime <= startDateTime) {
        newErrors.endDate = 'End date/time must be after start date/time';
      }
    }

    if (!formData.isVirtual) {
      if (!formData.locationName.trim()) {
        newErrors.locationName = 'Location name is required';
      }
      if (!formData.locationAddress.trim()) {
        newErrors.locationAddress = 'Location address is required';
      }
      if (!formData.capacity || parseInt(formData.capacity) <= 0) {
        newErrors.capacity = 'Valid capacity is required';
      }
    } else {
      if (!formData.meetingLink.trim()) {
        newErrors.meetingLink = 'Meeting link is required for virtual events';
      }
    }

    if (formData.maxAttendees && parseInt(formData.maxAttendees) <= 0) {
      newErrors.maxAttendees = 'Max attendees must be a positive number';
    }

    if (formData.isRsvpRequired && formData.rsvpDeadlineDate) {
      const rsvpDeadline = new Date(formData.rsvpDeadlineDate);
      const startDate = new Date(formData.startDate);
      
      if (rsvpDeadline >= startDate) {
        newErrors.rsvpDeadlineDate = 'RSVP deadline must be before event start date';
      }
    }

    if (formData.isRecurring && formData.recurrenceEndDate) {
      const recurrenceEnd = new Date(formData.recurrenceEndDate);
      const startDate = new Date(formData.startDate);
      
      if (recurrenceEnd <= startDate) {
        newErrors.recurrenceEndDate = 'Recurrence end date must be after start date';
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
      const startDateTime = new Date(`${formData.startDate}${formData.startTime ? `T${formData.startTime}` : 'T00:00'}`);
      const endDateTime = new Date(`${formData.endDate}${formData.endTime ? `T${formData.endTime}` : 'T23:59'}`);

      const location: EventLocation = {
        id: `loc_${Date.now()}`,
        name: formData.locationName,
        address: formData.locationAddress,
        description: formData.locationDescription || undefined,
        capacity: parseInt(formData.capacity) || 0,
        amenities: [],
        bookingFee: 0
      };

      const recurrence: EventRecurrence = {
        type: formData.isRecurring ? formData.recurrenceType : 'none',
        interval: parseInt(formData.recurrenceInterval) || 1,
        endDate: formData.recurrenceEndDate ? new Date(formData.recurrenceEndDate) : undefined
      };

      const submitData: CreateEventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        type: formData.type,
        priority: formData.priority,
        startDate: startDateTime,
        endDate: endDateTime,
        isAllDay: formData.isAllDay,
        location,
        isVirtual: formData.isVirtual,
        meetingLink: formData.meetingLink || undefined,
        maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : undefined,
        isRsvpRequired: formData.isRsvpRequired,
        rsvpDeadline: formData.rsvpDeadlineDate ? new Date(formData.rsvpDeadlineDate) : undefined,
        allowGuestRsvp: formData.allowGuestRsvp,
        waitlistEnabled: formData.waitlistEnabled,
        isPublic: formData.isPublic,
        targetAudience: formData.targetAudience,
        requiredApproval: formData.requiredApproval,
        tags: formData.tags,
        agenda: formData.agenda || undefined,
        requirements: formData.requirements,
        cost: formData.costAmount ? {
          amount: parseFloat(formData.costAmount),
          currency: formData.costCurrency
        } : undefined,
        recurrence
      };

      await onSubmit(submitData);
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'social',
        type: 'community',
        priority: 'medium',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        isAllDay: false,
        isVirtual: false,
        meetingLink: '',
        locationName: '',
        locationAddress: '',
        locationDescription: '',
        capacity: '',
        maxAttendees: '',
        isRsvpRequired: true,
        rsvpDeadlineDate: '',
        allowGuestRsvp: true,
        waitlistEnabled: false,
        isPublic: true,
        targetAudience: 'all',
        requiredApproval: false,
        tags: [],
        agenda: '',
        requirements: [],
        costAmount: '',
        costCurrency: 'USD',
        isRecurring: false,
        recurrenceType: 'weekly',
        recurrenceInterval: '1',
        recurrenceEndDate: ''
      });
      setTagInput('');
      setRequirementInput('');
      setErrors({});
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Create New Event</ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX size={16} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <Section>
              <SectionTitle>
                <FiFileText />
                Event Details
              </SectionTitle>
              
              <FormRow className="full-width">
                <FormGroup>
                  <Label>
                    Event Title <span className="required">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter event title"
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
                    placeholder="Provide a detailed description of the event, including what attendees can expect..."
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
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <option value="cultural">Cultural</option>
                    <option value="sports">Sports</option>
                    <option value="social">Social</option>
                    <option value="educational">Educational</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="meeting">Meeting</option>
                    <option value="celebration">Celebration</option>
                    <option value="other">Other</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Event Type</Label>
                  <Select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  >
                    <option value="community">Community</option>
                    <option value="private">Private</option>
                    <option value="committee">Committee</option>
                    <option value="society">Society</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Priority</Label>
                  <Select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </Select>
                </FormGroup>
              </FormRow>
            </Section>

            <Section>
              <SectionTitle>
                <FiCalendar />
                Date & Time
              </SectionTitle>
              
              <FormRow className="full-width">
                <FormGroup>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      checked={formData.isAllDay}
                      onChange={(e) => handleInputChange('isAllDay', e.target.checked)}
                    />
                    <Label>
                      <FiClock />
                      All day event
                    </Label>
                  </CheckboxGroup>
                </FormGroup>
              </FormRow>

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

                {!formData.isAllDay && (
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
                )}
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

                {!formData.isAllDay && (
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
                )}
              </FormRow>
            </Section>

            <Section>
              <SectionTitle>
                <FiMapPin />
                Location
              </SectionTitle>
              
              <FormRow className="full-width">
                <FormGroup>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      checked={formData.isVirtual}
                      onChange={(e) => handleInputChange('isVirtual', e.target.checked)}
                    />
                    <Label>
                      <FiVideo />
                      Virtual event
                    </Label>
                  </CheckboxGroup>
                </FormGroup>
              </FormRow>

              {formData.isVirtual ? (
                <FormRow className="full-width">
                  <FormGroup>
                    <Label>
                      Meeting Link <span className="required">*</span>
                    </Label>
                    <Input
                      type="url"
                      placeholder="https://zoom.us/j/123456789 or https://meet.google.com/abc-def-ghi"
                      value={formData.meetingLink}
                      onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                      hasError={!!errors.meetingLink}
                    />
                    {errors.meetingLink && (
                      <ErrorMessage>
                        <FiAlertCircle size={14} />
                        {errors.meetingLink}
                      </ErrorMessage>
                    )}
                  </FormGroup>
                </FormRow>
              ) : (
                <LocationFields>
                  <FormRow>
                    <FormGroup>
                      <Label>
                        Location Name <span className="required">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="e.g., Community Hall, Sports Ground"
                        value={formData.locationName}
                        onChange={(e) => handleInputChange('locationName', e.target.value)}
                        hasError={!!errors.locationName}
                      />
                      {errors.locationName && (
                        <ErrorMessage>
                          <FiAlertCircle size={14} />
                          {errors.locationName}
                        </ErrorMessage>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <Label>
                        Capacity <span className="required">*</span>
                      </Label>
                      <Input
                        type="number"
                        placeholder="Maximum attendees"
                        value={formData.capacity}
                        onChange={(e) => handleInputChange('capacity', e.target.value)}
                        hasError={!!errors.capacity}
                      />
                      {errors.capacity && (
                        <ErrorMessage>
                          <FiAlertCircle size={14} />
                          {errors.capacity}
                        </ErrorMessage>
                      )}
                    </FormGroup>
                  </FormRow>

                  <FormRow className="full-width">
                    <FormGroup>
                      <Label>
                        Address <span className="required">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="Full address or detailed location within the society"
                        value={formData.locationAddress}
                        onChange={(e) => handleInputChange('locationAddress', e.target.value)}
                        hasError={!!errors.locationAddress}
                      />
                      {errors.locationAddress && (
                        <ErrorMessage>
                          <FiAlertCircle size={14} />
                          {errors.locationAddress}
                        </ErrorMessage>
                      )}
                    </FormGroup>
                  </FormRow>

                  <FormRow className="full-width">
                    <FormGroup>
                      <Label>Location Description (Optional)</Label>
                      <Textarea
                        placeholder="Additional location details, directions, or special instructions..."
                        value={formData.locationDescription}
                        onChange={(e) => handleInputChange('locationDescription', e.target.value)}
                        style={{ minHeight: '80px' }}
                      />
                    </FormGroup>
                  </FormRow>
                </LocationFields>
              )}
            </Section>

            <Section>
              <SectionTitle>
                <FiUsers />
                RSVP & Attendance
              </SectionTitle>
              
              <FormRow>
                <FormGroup>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      checked={formData.isRsvpRequired}
                      onChange={(e) => handleInputChange('isRsvpRequired', e.target.checked)}
                    />
                    <Label>
                      <FiUserCheck />
                      RSVP required
                    </Label>
                  </CheckboxGroup>
                </FormGroup>

                <FormGroup>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      checked={formData.allowGuestRsvp}
                      onChange={(e) => handleInputChange('allowGuestRsvp', e.target.checked)}
                    />
                    <Label>
                      Allow guests in RSVP
                    </Label>
                  </CheckboxGroup>
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>Max Attendees (Optional)</Label>
                  <Input
                    type="number"
                    placeholder="Leave empty for unlimited"
                    value={formData.maxAttendees}
                    onChange={(e) => handleInputChange('maxAttendees', e.target.value)}
                    hasError={!!errors.maxAttendees}
                  />
                  {errors.maxAttendees && (
                    <ErrorMessage>
                      <FiAlertCircle size={14} />
                      {errors.maxAttendees}
                    </ErrorMessage>
                  )}
                </FormGroup>

                {formData.isRsvpRequired && (
                  <FormGroup>
                    <Label>RSVP Deadline (Optional)</Label>
                    <Input
                      type="date"
                      value={formData.rsvpDeadlineDate}
                      onChange={(e) => handleInputChange('rsvpDeadlineDate', e.target.value)}
                      hasError={!!errors.rsvpDeadlineDate}
                    />
                    {errors.rsvpDeadlineDate && (
                      <ErrorMessage>
                        <FiAlertCircle size={14} />
                        {errors.rsvpDeadlineDate}
                      </ErrorMessage>
                    )}
                  </FormGroup>
                )}
              </FormRow>

              <FormRow>
                <FormGroup>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      checked={formData.waitlistEnabled}
                      onChange={(e) => handleInputChange('waitlistEnabled', e.target.checked)}
                    />
                    <Label>
                      Enable waitlist when full
                    </Label>
                  </CheckboxGroup>
                </FormGroup>

                <FormGroup>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      checked={formData.requiredApproval}
                      onChange={(e) => handleInputChange('requiredApproval', e.target.checked)}
                    />
                    <Label>
                      Require approval for attendance
                    </Label>
                  </CheckboxGroup>
                </FormGroup>
              </FormRow>
            </Section>

            <Section>
              <SectionTitle>
                <FiSettings />
                Additional Settings
              </SectionTitle>
              
              <FormRow>
                <FormGroup>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      checked={formData.isPublic}
                      onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                    />
                    <Label>
                      <FiGlobe />
                      Public event
                    </Label>
                  </CheckboxGroup>
                  <small style={{ color: '#6b7280', fontSize: '12px' }}>
                    {formData.isPublic ? 'Visible to all society members' : 'Visible to selected audience only'}
                  </small>
                </FormGroup>

                <FormGroup>
                  <Label>Target Audience</Label>
                  <Select
                    value={formData.targetAudience}
                    onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  >
                    <option value="all">All Members</option>
                    <option value="adults">Adults Only</option>
                    <option value="children">Children</option>
                    <option value="seniors">Seniors</option>
                    <option value="families">Families</option>
                  </Select>
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>Event Cost (Optional)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.costAmount}
                    onChange={(e) => handleInputChange('costAmount', e.target.value)}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Currency</Label>
                  <Select
                    value={formData.costCurrency}
                    onChange={(e) => handleInputChange('costCurrency', e.target.value)}
                  >
                    <option value="USD">USD</option>
                    <option value="INR">INR</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </Select>
                </FormGroup>
              </FormRow>

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
                  <Label>Agenda (Optional)</Label>
                  <Textarea
                    placeholder="Event agenda, schedule, or program details..."
                    value={formData.agenda}
                    onChange={(e) => handleInputChange('agenda', e.target.value)}
                    style={{ minHeight: '80px' }}
                  />
                </FormGroup>
              </FormRow>

              <FormRow className="full-width">
                <FormGroup>
                  <Label>Requirements (Optional)</Label>
                  <TagInput>
                    {formData.requirements.map((req) => (
                      <Tag key={req}>
                        {req}
                        <button type="button" onClick={() => removeRequirement(req)}>
                          <FiX size={12} />
                        </button>
                      </Tag>
                    ))}
                    <input
                      type="text"
                      placeholder="Add requirements (press Enter)"
                      value={requirementInput}
                      onChange={(e) => setRequirementInput(e.target.value)}
                      onKeyDown={handleRequirementInput}
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
                      Recurring event
                    </Label>
                  </CheckboxGroup>
                  
                  {formData.isRecurring && (
                    <RecurrenceOptions>
                      <FormRow>
                        <FormGroup>
                          <Label>Recurrence Type</Label>
                          <Select
                            value={formData.recurrenceType}
                            onChange={(e) => handleInputChange('recurrenceType', e.target.value)}
                          >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                          </Select>
                        </FormGroup>

                        <FormGroup>
                          <Label>Every</Label>
                          <Input
                            type="number"
                            min="1"
                            value={formData.recurrenceInterval}
                            onChange={(e) => handleInputChange('recurrenceInterval', e.target.value)}
                          />
                        </FormGroup>
                      </FormRow>

                      <FormRow className="full-width">
                        <FormGroup>
                          <Label>End Recurrence (Optional)</Label>
                          <Input
                            type="date"
                            value={formData.recurrenceEndDate}
                            onChange={(e) => handleInputChange('recurrenceEndDate', e.target.value)}
                            hasError={!!errors.recurrenceEndDate}
                          />
                          {errors.recurrenceEndDate && (
                            <ErrorMessage>
                              <FiAlertCircle size={14} />
                              {errors.recurrenceEndDate}
                            </ErrorMessage>
                          )}
                        </FormGroup>
                      </FormRow>
                    </RecurrenceOptions>
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
                  Creating...
                </>
              ) : (
                <>
                  <FiCheck size={16} />
                  Create Event
                </>
              )}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateEventForm;