import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
import { toast } from 'react-toastify';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaHome,
  FaUserTag,
  FaBuilding,
  FaCalendarAlt,
  FaImage,
  FaFileUpload,
  FaSave,
  FaTimes,
  FaUserPlus,
  FaHeart,
  FaIdCard,
  FaMars,
  FaDollarSign,
  FaClock,
  FaUserShield,
  FaCheck
} from 'react-icons/fa';

import {
  StaffRole,
  Department,
  StaffStatus,
  DocumentType,
  StaffFormData
} from '../../types/staff';
import { useAuth } from '../../hooks/useAuth';

// Form validation rules (using react-hook-form built-in validation)
const validationRules = {
  name: {
    required: 'Name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' }
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address'
    }
  },
  phone: {
    required: 'Phone number is required',
    pattern: {
      value: /^[0-9]{10}$/,
      message: 'Phone number must be 10 digits'
    }
  },
  address: {
    required: 'Address is required',
    minLength: { value: 5, message: 'Address must be at least 5 characters' }
  },
  role: {
    required: 'Role is required'
  },
  department: {
    required: 'Department is required'
  },
  dateOfJoining: {
    required: 'Date of joining is required'
  },
  status: {
    required: 'Status is required'
  },
  societyId: {
    required: 'Society ID is required'
  }
};

// Styled Components
const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  
  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    display: flex;
    justify-content: center;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[3]};
  }
  
  p {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    color: ${({ theme }) => theme.colors.gray[600]};
    max-width: 800px;
    margin: 0 auto;
  }
`;

const FormContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  overflow: hidden;
`;

const FormHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[5]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.gray[50]};
  
  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[900]};
    margin: 0;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

const Form = styled.form`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const FormSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    padding-bottom: ${({ theme }) => theme.spacing[2]};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[5]};
  margin-bottom: ${({ theme }) => theme.spacing[5]};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Input = styled.input<{ error?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${props => props.error 
    ? props.theme.colors.error[400] 
    : props.theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[800]};
  background: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transition.all};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[400]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

const Select = styled.select<{ error?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${props => props.error 
    ? props.theme.colors.error[400] 
    : props.theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[800]};
  background: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transition.all};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[400]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea<{ error?: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${props => props.error 
    ? props.theme.colors.error[400] 
    : props.theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[800]};
  background: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transition.all};
  min-height: 120px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[400]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
  
  &:disabled {
    background: ${({ theme }) => theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  margin-top: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.error[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
`;

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ImagePreviewContainer = styled.div`
  width: 150px;
  height: 150px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 2px dashed ${({ theme }) => theme.colors.gray[300]};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  background: ${({ theme }) => theme.colors.gray[50]};
  
  &:hover .overlay {
    opacity: 1;
  }
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadOverlay = styled.div.attrs({ className: 'overlay' })`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  cursor: pointer;
`;

const FileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]};
    border-color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const DocumentUploadContainer = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[4]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  background: ${({ theme }) => theme.colors.gray[50]};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.gray[100]};
  }
`;

const DocumentList = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  
  .doc-info {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[3]};
  }
  
  .doc-icon {
    color: ${({ theme }) => theme.colors.primary[500]};
  }
  
  .doc-name {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.gray[800]};
  }
  
  .doc-size {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.gray[500]};
  }
  
  .doc-type {
    padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: ${({ theme }) => theme.colors.gray[100]};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
  
  .doc-actions {
    display: flex;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error[500]};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.error[50]};
  }
`;

const FormFooter = styled.div`
  padding: ${({ theme }) => theme.spacing[5]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.gray[50]};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  
  ${props => {
    if (props.variant === 'primary') {
      return `
        background: ${props.theme.colors.primary[600]};
        color: white;
        border: none;
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors.primary[700]};
        }
      `;
    } else if (props.variant === 'danger') {
      return `
        background: ${props.theme.colors.error[600]};
        color: white;
        border: none;
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors.error[700]};
        }
      `;
    } else {
      return `
        background: white;
        color: ${props.theme.colors.gray[700]};
        border: 1px solid ${props.theme.colors.gray[300]};
        
        &:hover:not(:disabled) {
          background: ${props.theme.colors.gray[50]};
        }
      `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Helper function to format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Main component
const StaffRegistrationPage: React.FC = () => {
  const { user } = useAuth();
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [documents, setDocuments] = useState<{ file: File; type: DocumentType }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { 
    control, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<StaffFormData>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      role: StaffRole.OTHER,
      department: Department.OTHER,
      dateOfJoining: new Date().toISOString().split('T')[0],
      status: StaffStatus.PENDING_VERIFICATION,
      documents: [],
      documentTypes: [],
      societyId: 1, // Default society ID
    }
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPG, JPEG, or PNG)');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Profile picture must be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleDocumentUpload(e.dataTransfer.files);
    }
  };

  const validateFile = (file: File) => {
    // Validate file type
    const allowedTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/png', 
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error(`Invalid file type: ${file.name}. Please upload PDF, images, or Office documents`);
      return false;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`File too large: ${file.name}. Maximum file size is 5MB`);
      return false;
    }
    
    return true;
  };

  const handleDocumentUpload = (fileList: FileList) => {
    Array.from(fileList).forEach(file => {
      if (validateFile(file)) {
        setDocuments(prev => [
          ...prev, 
          { 
            file, 
            type: DocumentType.OTHER // Default type, user can change it
          }
        ]);
        toast.success(`File "${file.name}" uploaded successfully`);
      }
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleDocumentUpload(e.target.files);
    }
  };

  const handleDocumentTypeChange = (index: number, type: DocumentType) => {
    setDocuments(prev => {
      const updated = [...prev];
      updated[index].type = type;
      return updated;
    });
  };

  const removeDocument = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = useCallback(async (data: StaffFormData) => {
    try {
      setIsSubmitting(true);
      
      // Prepare form data with files
      const formData = {
        ...data,
        profilePicture: profilePreview ? new File([], 'profile-picture') : undefined,
        documents: documents.map(d => d.file),
        documentTypes: documents.map(d => d.type)
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Display success message
      toast.success('Staff member registered successfully!');
      
      // Notify admin (simulate)
      toast.info('Notification sent to admin about new staff registration');
      
      // Reset form
      reset();
      setProfilePreview(null);
      setDocuments([]);
      
      console.log('Submitted form data:', formData);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to register staff member. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [profilePreview, documents, reset]);
  
  return (
    <PageContainer>
      <Header>
        <h1>
          <FaUserPlus /> Staff Registration
        </h1>
        <p>Register new staff members with all their details and necessary documents.</p>
      </Header>
      
      <FormContainer>
        <FormHeader>
          <h2><FaUserPlus /> New Staff Registration Form</h2>
        </FormHeader>
        
        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FormSection>
            <h3><FaUser /> Personal Information</h3>
            <FormRow>
              <FormGroup>
                <Label htmlFor="name">
                  <FaUser /> Full Name
                </Label>
                <Controller
                  name="name"
                  control={control}
                  rules={validationRules.name}
                  render={({ field }) => (
                    <Input 
                      id="name"
                      {...field}
                      placeholder="Enter full name"
                      error={!!errors.name}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                  )}
                />
                {errors.name && (
                  <ErrorMessage id="name-error">{errors.name.message}</ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="email">
                  <FaEnvelope /> Email Address
                </Label>
                <Controller
                  name="email"
                  control={control}
                  rules={validationRules.email}
                  render={({ field }) => (
                    <Input 
                      id="email"
                      type="email"
                      {...field}
                      placeholder="Enter email address"
                      error={!!errors.email}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                  )}
                />
                {errors.email && (
                  <ErrorMessage id="email-error">{errors.email.message}</ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="phone">
                  <FaPhone /> Phone Number
                </Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input 
                      id="phone"
                      type="tel"
                      {...field}
                      placeholder="Enter 10-digit phone number"
                      error={!!errors.phone}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                    />
                  )}
                />
                {errors.phone && (
                  <ErrorMessage id="phone-error">{errors.phone.message}</ErrorMessage>
                )}
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="address">
                  <FaHome /> Address
                </Label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Textarea 
                      id="address"
                      {...field}
                      placeholder="Enter complete address"
                      error={!!errors.address}
                      aria-invalid={!!errors.address}
                      aria-describedby={errors.address ? "address-error" : undefined}
                    />
                  )}
                />
                {errors.address && (
                  <ErrorMessage id="address-error">{errors.address.message}</ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="gender">
                  <FaMars /> Gender
                </Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="gender"
                      {...field}
                      error={!!errors.gender}
                      aria-invalid={!!errors.gender}
                      aria-describedby={errors.gender ? "gender-error" : undefined}
                    >
                      <option value="">Select gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <ErrorMessage id="gender-error">{errors.gender.message}</ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="dateOfBirth">
                  <FaCalendarAlt /> Date of Birth
                </Label>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <Input 
                      id="dateOfBirth"
                      type="date"
                      {...field}
                      error={!!errors.dateOfBirth}
                      aria-invalid={!!errors.dateOfBirth}
                      aria-describedby={errors.dateOfBirth ? "dob-error" : undefined}
                    />
                  )}
                />
                {errors.dateOfBirth && (
                  <ErrorMessage id="dob-error">{errors.dateOfBirth.message}</ErrorMessage>
                )}
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="emergencyContact">
                  <FaPhone /> Emergency Contact
                </Label>
                <Controller
                  name="emergencyContact"
                  control={control}
                  render={({ field }) => (
                    <Input 
                      id="emergencyContact"
                      type="tel"
                      {...field}
                      placeholder="Enter emergency contact number"
                      error={!!errors.emergencyContact}
                      aria-invalid={!!errors.emergencyContact}
                      aria-describedby={errors.emergencyContact ? "emergency-error" : undefined}
                    />
                  )}
                />
                {errors.emergencyContact && (
                  <ErrorMessage id="emergency-error">{errors.emergencyContact.message}</ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="bloodGroup">
                  <FaHeart /> Blood Group
                </Label>
                <Controller
                  name="bloodGroup"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="bloodGroup"
                      {...field}
                      error={!!errors.bloodGroup}
                      aria-invalid={!!errors.bloodGroup}
                      aria-describedby={errors.bloodGroup ? "blood-error" : undefined}
                    >
                      <option value="">Select blood group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </Select>
                  )}
                />
                {errors.bloodGroup && (
                  <ErrorMessage id="blood-error">{errors.bloodGroup.message}</ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="profilePicture">
                  <FaImage /> Profile Picture
                </Label>
                <ImageUploadContainer>
                  <ImagePreviewContainer>
                    {profilePreview ? (
                      <>
                        <ImagePreview src={profilePreview} alt="Profile preview" />
                        <UploadOverlay>
                          <FaImage size={24} />
                        </UploadOverlay>
                      </>
                    ) : (
                      <FaUser size={40} color="#CBD5E0" />
                    )}
                  </ImagePreviewContainer>
                  <FileInput
                    id="profilePicture"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleProfileChange}
                  />
                  <UploadButton
                    type="button"
                    onClick={() => document.getElementById('profilePicture')?.click()}
                    aria-label="Upload profile picture"
                  >
                    <FaImage /> Upload Photo
                  </UploadButton>
                </ImageUploadContainer>
              </FormGroup>
            </FormRow>
          </FormSection>
          
          <FormSection>
            <h3><FaUserTag /> Employment Details</h3>
            <FormRow>
              <FormGroup>
                <Label htmlFor="role">
                  <FaUserTag /> Role
                </Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="role"
                      {...field}
                      error={!!errors.role}
                      aria-invalid={!!errors.role}
                      aria-describedby={errors.role ? "role-error" : undefined}
                    >
                      <option value="">Select role</option>
                      {Object.values(StaffRole).map(role => (
                        <option key={role} value={role}>
                          {role.charAt(0) + role.slice(1).toLowerCase().replace('_', ' ')}
                        </option>
                      ))}
                    </Select>
                  )}
                />
                {errors.role && (
                  <ErrorMessage id="role-error">{errors.role.message}</ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="department">
                  <FaBuilding /> Department
                </Label>
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="department"
                      {...field}
                      error={!!errors.department}
                      aria-invalid={!!errors.department}
                      aria-describedby={errors.department ? "department-error" : undefined}
                    >
                      <option value="">Select department</option>
                      {Object.values(Department).map(dept => (
                        <option key={dept} value={dept}>
                          {dept.charAt(0) + dept.slice(1).toLowerCase().replace('_', ' ')}
                        </option>
                      ))}
                    </Select>
                  )}
                />
                {errors.department && (
                  <ErrorMessage id="department-error">{errors.department.message}</ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="dateOfJoining">
                  <FaCalendarAlt /> Date of Joining
                </Label>
                <Controller
                  name="dateOfJoining"
                  control={control}
                  render={({ field }) => (
                    <Input 
                      id="dateOfJoining"
                      type="date"
                      {...field}
                      error={!!errors.dateOfJoining}
                      aria-invalid={!!errors.dateOfJoining}
                      aria-describedby={errors.dateOfJoining ? "joining-error" : undefined}
                    />
                  )}
                />
                {errors.dateOfJoining && (
                  <ErrorMessage id="joining-error">{errors.dateOfJoining.message}</ErrorMessage>
                )}
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="status">
                  <FaCheck /> Status
                </Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      id="status"
                      {...field}
                      error={!!errors.status}
                      aria-invalid={!!errors.status}
                      aria-describedby={errors.status ? "status-error" : undefined}
                    >
                      <option value="">Select status</option>
                      {Object.values(StaffStatus).map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
                        </option>
                      ))}
                    </Select>
                  )}
                />
                {errors.status && (
                  <ErrorMessage id="status-error">{errors.status.message}</ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="salary">
                  <FaDollarSign /> Salary
                </Label>
                <Controller
                  name="salary"
                  control={control}
                  render={({ field }) => (
                    <Input 
                      id="salary"
                      type="number"
                      {...field}
                      placeholder="Enter monthly salary"
                      error={!!errors.salary}
                      aria-invalid={!!errors.salary}
                      aria-describedby={errors.salary ? "salary-error" : undefined}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                    />
                  )}
                />
                {errors.salary && (
                  <ErrorMessage id="salary-error">{errors.salary.message}</ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="workingHours">
                  <FaClock /> Working Hours
                </Label>
                <Controller
                  name="workingHours"
                  control={control}
                  render={({ field }) => (
                    <Input 
                      id="workingHours"
                      {...field}
                      placeholder="e.g., 9:00 AM - 6:00 PM"
                      error={!!errors.workingHours}
                      aria-invalid={!!errors.workingHours}
                      aria-describedby={errors.workingHours ? "hours-error" : undefined}
                    />
                  )}
                />
                {errors.workingHours && (
                  <ErrorMessage id="hours-error">{errors.workingHours.message}</ErrorMessage>
                )}
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="supervisorId">
                  <FaUserShield /> Supervisor ID
                </Label>
                <Controller
                  name="supervisorId"
                  control={control}
                  render={({ field }) => (
                    <Input 
                      id="supervisorId"
                      type="number"
                      {...field}
                      placeholder="Enter supervisor ID"
                      error={!!errors.supervisorId}
                      aria-invalid={!!errors.supervisorId}
                      aria-describedby={errors.supervisorId ? "supervisor-error" : undefined}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                    />
                  )}
                />
                {errors.supervisorId && (
                  <ErrorMessage id="supervisor-error">{errors.supervisorId.message}</ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="societyId">
                  <FaBuilding /> Society ID
                </Label>
                <Controller
                  name="societyId"
                  control={control}
                  render={({ field }) => (
                    <Input 
                      id="societyId"
                      type="number"
                      {...field}
                      placeholder="Enter society ID"
                      error={!!errors.societyId}
                      aria-invalid={!!errors.societyId}
                      aria-describedby={errors.societyId ? "society-error" : undefined}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                      disabled // Typically this would be auto-assigned based on current user's society
                    />
                  )}
                />
                {errors.societyId && (
                  <ErrorMessage id="society-error">{errors.societyId.message}</ErrorMessage>
                )}
              </FormGroup>
            </FormRow>
          </FormSection>
          
          <FormSection>
            <h3><FaFileUpload /> Documents</h3>
            <DocumentUploadContainer
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('documentUpload')?.click()}
              style={dragActive ? { 
                borderColor: '#3182CE', 
                background: '#EBF8FF' 
              } : {}}
            >
              <FaFileUpload size={40} color="#4A5568" />
              <div>
                <p style={{ margin: 0, fontWeight: 600 }}>Drop files here or click to upload</p>
                <p style={{ margin: '8px 0 0', fontSize: '0.875rem', color: '#718096' }}>
                  Supported formats: PDF, JPG, PNG, DOCX, XLS (Max: 5MB)
                </p>
              </div>
              <FileInput
                id="documentUpload"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                onChange={handleFileSelect}
              />
            </DocumentUploadContainer>
            
            {documents.length > 0 && (
              <DocumentList>
                {documents.map((doc, index) => (
                  <DocumentItem key={index}>
                    <div className="doc-info">
                      <FaFileUpload className="doc-icon" />
                      <div>
                        <div className="doc-name">{doc.file.name}</div>
                        <div className="doc-size">{formatFileSize(doc.file.size)}</div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Select
                        value={doc.type}
                        onChange={(e) => handleDocumentTypeChange(index, e.target.value as DocumentType)}
                        style={{ padding: '4px 8px', fontSize: '0.875rem' }}
                      >
                        {Object.values(DocumentType).map(type => (
                          <option key={type} value={type}>
                            {type.replace('_', ' ')}
                          </option>
                        ))}
                      </Select>
                      
                      <RemoveButton
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDocument(index);
                        }}
                        aria-label="Remove document"
                      >
                        <FaTimes />
                      </RemoveButton>
                    </div>
                  </DocumentItem>
                ))}
              </DocumentList>
            )}
          </FormSection>
          
          <FormFooter>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => reset()}
              disabled={isSubmitting}
            >
              <FaTimes /> Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg 
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FaSave /> Register Staff
                </>
              )}
            </Button>
          </FormFooter>
        </Form>
      </FormContainer>
    </PageContainer>
  );
};

export default StaffRegistrationPage;