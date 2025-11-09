import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import {
  FaTimes,
  FaExclamationTriangle,
  FaCheckCircle,
  FaSpinner,
  FaCog
} from 'react-icons/fa';
import {
  AmenityFormData,
  AmenityCategory,
  MaintenanceFrequency,
  MaintenanceType
} from '../../types/society-amenities';

// Styled Components
const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
  padding: ${({ theme }) => theme.spacing[4]};
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.gray[50]};
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  
  svg {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[200]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  overflow-y: auto;
  flex: 1;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
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
  
  &.required::after {
    content: ' *';
    color: ${({ theme }) => theme.colors.error[500]};
  }
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.all};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transition.all};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const Textarea = styled.textarea`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: ${({ theme }) => theme.transition.all};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.gray[50]};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  border: 1px solid ${({ theme, variant }) => 
    variant === 'primary' 
      ? theme.colors.primary[600] 
      : theme.colors.gray[300]
  };
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme, variant }) => 
    variant === 'primary' 
      ? theme.colors.primary[600] 
      : theme.colors.white
  };
  color: ${({ theme, variant }) => 
    variant === 'primary' 
      ? theme.colors.white 
      : theme.colors.gray[700]
  };
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover {
    background: ${({ theme, variant }) => 
      variant === 'primary' 
        ? theme.colors.primary[700] 
        : theme.colors.gray[50]
    };
    border-color: ${({ theme, variant }) => 
      variant === 'primary' 
        ? theme.colors.primary[700] 
        : theme.colors.gray[400]
    };
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.error[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing[1]};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.success[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

// Constants
const AMENITY_CATEGORIES: { value: AmenityCategory; label: string }[] = [
  { value: 'sports', label: 'Sports' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'recreation', label: 'Recreation' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'social', label: 'Social' },
  { value: 'business', label: 'Business' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'utility', label: 'Utility' },
  { value: 'other', label: 'Other' }
];

const MAINTENANCE_FREQUENCIES: { value: MaintenanceFrequency; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'biannual', label: 'Biannual' },
  { value: 'annual', label: 'Annual' },
  { value: 'as_needed', label: 'As Needed' }
];

const MAINTENANCE_TYPES: { value: MaintenanceType; label: string }[] = [
  { value: 'routine', label: 'Routine' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'repair', label: 'Repair' },
  { value: 'deep_cleaning', label: 'Deep Cleaning' },
  { value: 'upgrade', label: 'Upgrade' }
];

interface AddAmenityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AmenityFormData) => Promise<void>;
  isLoading?: boolean;
}

const AddAmenityModal: React.FC<AddAmenityModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false
}) => {
  // Form state
  const [formData, setFormData] = useState<AmenityFormData>({
    name: '',
    description: '',
    category: 'other',
    location: '',
    capacity: 0,
    operatingHours: {
      start: '',
      end: '',
      days: []
    },
    usageGuidelines: '',
    maintenanceSchedule: {
      frequency: 'weekly',
      maintenanceType: 'routine',
      assignedTo: '',
      estimatedDuration: 0,
      cost: 0
    },
    contactPerson: {
      name: '',
      designation: '',
      phoneNumber: '',
      email: '',
      availability: '',
      isEmergencyContact: false
    },
    amenitiesProvided: [],
    rulesAndRegulations: '',
    images: [],
    availabilityStatus: 'available',
    bookingStatus: 'open',
    bookingRequired: false,
    pricing: {
      dailyRate: 0,
      memberDiscount: 0,
      securityDeposit: 0
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  // Handle input changes
  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Handle nested field changes
  const handleNestedChange = useCallback((section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof AmenityFormData] as any),
        [field]: value
      }
    }));
  }, []);

  // Form validation
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Amenity name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (formData.capacity <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
    }
    
    if (!formData.contactPerson.name.trim()) {
      newErrors.contactName = 'Contact person name is required';
    }
    
    if (!formData.contactPerson.phoneNumber.trim()) {
      newErrors.contactPhone = 'Contact phone number is required';
    }
    
    if (!formData.contactPerson.email.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactPerson.email)) {
      newErrors.contactEmail = 'Contact email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await onSubmit(formData);
      setSuccess('Amenity added successfully!');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 2000);
    } catch (error) {
      setErrors({ submit: 'Failed to add amenity. Please try again.' });
    }
  }, [formData, onSubmit, onClose, validateForm]);

  // Reset form when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        description: '',
        category: 'other',
        location: '',
        capacity: 0,
        operatingHours: {
          start: '',
          end: '',
          days: []
        },
        usageGuidelines: '',
        maintenanceSchedule: {
          frequency: 'weekly',
          maintenanceType: 'routine',
          assignedTo: '',
          estimatedDuration: 0,
          cost: 0
        },
        contactPerson: {
          name: '',
          designation: '',
          phoneNumber: '',
          email: '',
          availability: '',
          isEmergencyContact: false
        },
        amenitiesProvided: [],
        rulesAndRegulations: '',
        images: [],
        availabilityStatus: 'available',
        bookingStatus: 'open',
        bookingRequired: false,
        pricing: {
          dailyRate: 0,
          memberDiscount: 0,
          securityDeposit: 0
        }
      });
      setErrors({});
      setSuccess('');
    }
  }, [isOpen]);

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>
            <FaCog />
            Add New Amenity
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <Label className="required">Amenity Name</Label>
                <Input
                  type="text"
                  placeholder="e.g., Swimming Pool, Gymnasium"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
                {errors.name && <ErrorMessage><FaExclamationTriangle />{errors.name}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label className="required">Category</Label>
                <Select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  {AMENITY_CATEGORIES.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <Label className="required">Description</Label>
              <Textarea
                placeholder="Provide a detailed description of the amenity"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
              {errors.description && <ErrorMessage><FaExclamationTriangle />{errors.description}</ErrorMessage>}
            </FormGroup>
            
            <FormRow>
              <FormGroup>
                <Label className="required">Location</Label>
                <Input
                  type="text"
                  placeholder="e.g., Block A, Ground Floor"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
                {errors.location && <ErrorMessage><FaExclamationTriangle />{errors.location}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label className="required">Capacity</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="Maximum number of people"
                  value={formData.capacity || ''}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                />
                {errors.capacity && <ErrorMessage><FaExclamationTriangle />{errors.capacity}</ErrorMessage>}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={formData.operatingHours.start}
                  onChange={(e) => handleNestedChange('operatingHours', 'start', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={formData.operatingHours.end}
                  onChange={(e) => handleNestedChange('operatingHours', 'end', e.target.value)}
                />
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label className="required">Contact Person Name</Label>
                <Input
                  type="text"
                  placeholder="Contact person's full name"
                  value={formData.contactPerson.name}
                  onChange={(e) => handleNestedChange('contactPerson', 'name', e.target.value)}
                />
                {errors.contactName && <ErrorMessage><FaExclamationTriangle />{errors.contactName}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label>Designation</Label>
                <Input
                  type="text"
                  placeholder="e.g., Pool Manager"
                  value={formData.contactPerson.designation}
                  onChange={(e) => handleNestedChange('contactPerson', 'designation', e.target.value)}
                />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label className="required">Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.contactPerson.phoneNumber}
                  onChange={(e) => handleNestedChange('contactPerson', 'phoneNumber', e.target.value)}
                />
                {errors.contactPhone && <ErrorMessage><FaExclamationTriangle />{errors.contactPhone}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label className="required">Email</Label>
                <Input
                  type="email"
                  placeholder="contact@society.com"
                  value={formData.contactPerson.email}
                  onChange={(e) => handleNestedChange('contactPerson', 'email', e.target.value)}
                />
                {errors.contactEmail && <ErrorMessage><FaExclamationTriangle />{errors.contactEmail}</ErrorMessage>}
              </FormGroup>
            </FormRow>

            <FormRow>
              <FormGroup>
                <Label>Maintenance Frequency</Label>
                <Select
                  value={formData.maintenanceSchedule.frequency || 'weekly'}
                  onChange={(e) => handleNestedChange('maintenanceSchedule', 'frequency', e.target.value)}
                >
                  {MAINTENANCE_FREQUENCIES.map(freq => (
                    <option key={freq.value} value={freq.value}>
                      {freq.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Maintenance Type</Label>
                <Select
                  value={formData.maintenanceSchedule.maintenanceType || 'routine'}
                  onChange={(e) => handleNestedChange('maintenanceSchedule', 'maintenanceType', e.target.value)}
                >
                  {MAINTENANCE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </FormRow>

            <FormGroup>
              <Label>Usage Guidelines</Label>
              <Textarea
                placeholder="Guidelines for using this amenity"
                value={formData.usageGuidelines}
                onChange={(e) => handleInputChange('usageGuidelines', e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label>Rules and Regulations</Label>
              <Textarea
                placeholder="Rules and regulations for this amenity"
                value={formData.rulesAndRegulations}
                onChange={(e) => handleInputChange('rulesAndRegulations', e.target.value)}
              />
            </FormGroup>
          </Form>
        </ModalBody>

        <ModalFooter>
          {errors.submit && <ErrorMessage><FaExclamationTriangle />{errors.submit}</ErrorMessage>}
          {success && <SuccessMessage><FaCheckCircle />{success}</SuccessMessage>}
          
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" variant="primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <FaCheckCircle />
                Add Amenity
              </>
            )}
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default AddAmenityModal;