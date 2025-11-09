import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { useForm, Controller } from 'react-hook-form';
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
  FaCheck,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaCamera,
  FaTrash,
  FaDownload,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTint,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaGlobe,
  FaLinkedin,
  FaTwitter,
  FaFacebook
} from 'react-icons/fa';

// Enhanced form data interface for industry standard
interface StaffFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  nationality?: string;
  maritalStatus?: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';
  bloodGroup?: string;
  
  // Address Information
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  
  // Employment Details
  employeeId?: string;
  role: string;
  department: string;
  dateOfJoining: string;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN';
  status: string;
  workLocation: 'ONSITE' | 'REMOTE' | 'HYBRID';
  reportingManagerId?: string;
  
  // Compensation & Benefits
  salary?: number;
  currency: string;
  workingHours?: string;
  probationPeriod?: number;
  noticePeriod?: number;
  
  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
  emergencyContactAddress?: string;
  
  // Education & Skills
  highestEducation?: string;
  university?: string;
  graduationYear?: number;
  skills?: string[];
  certifications?: string[];
  languages?: string[];
  
  // Documents & Identity
  panNumber?: string;
  aadharNumber?: string;
  passportNumber?: string;
  drivingLicense?: string;
  
  // Social & Professional
  linkedinProfile?: string;
  githubProfile?: string;
  portfolioWebsite?: string;
  
  // System Fields
  societyId: number;
  createdBy?: string;
  isActive: boolean;
}

// Styled Components - Consistent Design Pattern
const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[4]};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

const FormContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.boxShadow.lg};
  overflow: hidden;
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.gray[50]};
  color: ${({ theme }) => theme.colors.gray[900]};
  
  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    margin: 0;
    display: flex;
    align-items: center;
    gap: 15px;
    position: relative;
    z-index: 1;
  }
  
  p {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0;
    position: relative;
    z-index: 1;
  }
`;

const ProgressIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[5]} ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const ProgressStep = styled.div<{ active: boolean; completed: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 25px;
  margin: 0 10px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s ease;
  
  ${props => {
    if (props.completed) {
      return `
        background: #10b981;
        color: white;
      `;
    } else if (props.active) {
      return `
        background: #3b82f6;
        color: white;
      `;
    } else {
      return `
        background: #e2e8f0;
        color: #64748b;
      `;
    }
  }}
`;

const FormContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const TabContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding-bottom: 20px;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${props => props.active 
    ? `
      background: #3b82f6;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    `
    : `
      background: #f1f5f9;
      color: #64748b;
      
      &:hover {
        background: #e2e8f0;
        transform: translateY(-1px);
      }
    `
  }
`;

const Section = styled.div<{ visible: boolean }>`
  display: ${props => props.visible ? 'block' : 'none'};
  animation: ${props => props.visible ? 'fadeIn 0.3s ease-in' : 'none'};
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
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
  padding-bottom: ${({ theme }) => theme.spacing[2]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const GridLayout = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[5]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label<{ required?: boolean }>`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  
  ${props => props.required && `
    &::after {
      content: '*';
      color: ${props.theme.colors.error[500]};
      margin-left: 4px;
    }
  `}
`;

const Input = styled.input<{ error?: boolean; success?: boolean }>`
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
  
  ${props => props.error && `
    border-color: ${props.theme.colors.error[400]};
  `}
  background: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #9ca3af;
  }
  
  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const Select = styled.select<{ error?: boolean }>`
  padding: 12px 16px;
  border: 2px solid ${props => props.error ? '#ef4444' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 0.875rem;
  color: #1f2937;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Textarea = styled.textarea<{ error?: boolean }>`
  padding: 12px 16px;
  border: 2px solid ${props => props.error ? '#ef4444' : '#e2e8f0'};
  border-radius: 8px;
  font-size: 0.875rem;
  color: #1f2937;
  background: white;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 4px;
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #10b981;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 4px;
`;

const ProfileImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 30px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: #f9fafb;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`;

const ProfileImagePreview = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid #e2e8f0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &:hover .overlay {
    opacity: 1;
  }
`;

const ImageOverlay = styled.div.attrs({ className: 'overlay' })`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
  color: white;
  font-size: 1.5rem;
`;

const FileInput = styled.input`
  display: none;
`;

const Button = styled.button<{ 
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: ${props => {
    switch (props.size) {
      case 'sm': return '8px 16px';
      case 'lg': return '16px 32px';
      default: return '12px 24px';
    }
  }};
  border: none;
  border-radius: 8px;
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '0.75rem';
      case 'lg': return '1rem';
      default: return '0.875rem';
    }
  }};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #3b82f6;
          color: white;
          &:hover:not(:disabled) {
            background: #2563eb;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          }
        `;
      case 'success':
        return `
          background: #10b981;
          color: white;
          &:hover:not(:disabled) {
            background: #059669;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;
          &:hover:not(:disabled) {
            background: #dc2626;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: #374151;
          border: 2px solid #e2e8f0;
          &:hover:not(:disabled) {
            border-color: #3b82f6;
            color: #3b82f6;
          }
        `;
      default:
        return `
          background: #f3f4f6;
          color: #374151;
          &:hover:not(:disabled) {
            background: #e5e7eb;
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
  
  ${props => props.loading && `
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `}
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 30px 40px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  
  .left-actions {
    display: flex;
    gap: 10px;
  }
  
  .right-actions {
    display: flex;
    gap: 10px;
  }
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const SkillTag = styled.span`
  background: #eff6ff;
  color: #1d4ed8;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #bfdbfe;
`;

const DocumentUploadArea = styled.div<{ dragActive?: boolean }>`
  border: 2px dashed ${props => props.dragActive ? '#3b82f6' : '#d1d5db'};
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  background: ${props => props.dragActive ? '#eff6ff' : '#f9fafb'};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
`;

const DocumentList = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DocumentItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  
  .doc-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  .doc-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .doc-name {
    font-weight: 600;
    color: #1f2937;
    font-size: 0.875rem;
  }
  
  .doc-size {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .doc-actions {
    display: flex;
    gap: 8px;
  }
`;

// Industry standard staff registration component
const StaffRegistrationIndustryStandard: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [documents, setDocuments] = useState<File[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 0, label: 'Personal Info', icon: FaUser },
    { id: 1, label: 'Address', icon: FaMapMarkerAlt },
    { id: 2, label: 'Employment', icon: FaBuilding },
    { id: 3, label: 'Emergency Contact', icon: FaPhone },
    { id: 4, label: 'Education & Skills', icon: FaGraduationCap },
    { id: 5, label: 'Documents', icon: FaFileUpload },
    { id: 6, label: 'Social & Professional', icon: FaGlobe }
  ];

  const { 
    control, 
    handleSubmit, 
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues
  } = useForm<StaffFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfJoining: new Date().toISOString().split('T')[0],
      employmentType: 'FULL_TIME',
      workLocation: 'ONSITE',
      currency: 'USD',
      country: 'United States',
      societyId: 1,
      isActive: true,
      status: 'PENDING_VERIFICATION'
    }
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload a valid image file');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
        toast.success('Profile image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File ${file.name} is too large. Maximum size is 5MB`);
        return;
      }
      
      setDocuments(prev => [...prev, file]);
      toast.success(`Document ${file.name} uploaded successfully`);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleDocumentUpload(e.dataTransfer.files);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const onSubmit = useCallback(async (data: StaffFormData) => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const formData = {
        ...data,
        skills,
        profileImage,
        documents: documents.map(doc => doc.name)
      };
      
      console.log('Submitted Staff Data:', formData);
      toast.success('Staff member registered successfully!');
      
      // Reset form
      reset();
      setProfileImage(null);
      setDocuments([]);
      setSkills([]);
      setActiveTab(0);
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to register staff member. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [skills, profileImage, documents, reset]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <PageContainer>
      <FormContainer>
        <Header>
          <h1>
            <FaUserPlus /> Staff Registration Portal
          </h1>
          <p>Create comprehensive staff profiles with industry-standard data collection</p>
        </Header>

        <ProgressIndicator>
          {tabs.map((tab, index) => (
            <ProgressStep
              key={tab.id}
              active={activeTab === index}
              completed={activeTab > index}
            >
              <tab.icon />
              {tab.label}
            </ProgressStep>
          ))}
        </ProgressIndicator>

        <FormContent>
          <TabContainer>
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                <tab.icon />
                {tab.label}
              </Tab>
            ))}
          </TabContainer>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Personal Information Tab */}
            <Section visible={activeTab === 0}>
              <SectionTitle>
                <FaUser /> Personal Information
              </SectionTitle>
              
              <ProfileImageContainer>
                <ProfileImagePreview>
                  {profileImage ? (
                    <>
                      <img src={profileImage} alt="Profile" />
                      <ImageOverlay onClick={() => fileInputRef.current?.click()}>
                        <FaCamera />
                      </ImageOverlay>
                    </>
                  ) : (
                    <FaUser size={40} color="#9ca3af" />
                  )}
                </ProfileImagePreview>
                <FileInput
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaCamera /> Upload Profile Photo
                </Button>
              </ProfileImageContainer>

              <GridLayout>
                <FormGroup>
                  <Label required>
                    <FaUser /> First Name
                  </Label>
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: 'First name is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter first name"
                        error={!!errors.firstName}
                      />
                    )}
                  />
                  {errors.firstName && (
                    <ErrorMessage>
                      <FaExclamationTriangle />
                      {errors.firstName.message}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label required>
                    <FaUser /> Last Name
                  </Label>
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: 'Last name is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter last name"
                        error={!!errors.lastName}
                      />
                    )}
                  />
                  {errors.lastName && (
                    <ErrorMessage>
                      <FaExclamationTriangle />
                      {errors.lastName.message}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label required>
                    <FaEnvelope /> Email Address
                  </Label>
                  <Controller
                    name="email"
                    control={control}
                    rules={{ 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter email address"
                        error={!!errors.email}
                      />
                    )}
                  />
                  {errors.email && (
                    <ErrorMessage>
                      <FaExclamationTriangle />
                      {errors.email.message}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label required>
                    <FaPhone /> Phone Number
                  </Label>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{ required: 'Phone number is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="tel"
                        placeholder="Enter phone number"
                        error={!!errors.phone}
                      />
                    )}
                  />
                  {errors.phone && (
                    <ErrorMessage>
                      <FaExclamationTriangle />
                      {errors.phone.message}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>
                    <FaPhone /> Alternate Phone
                  </Label>
                  <Controller
                    name="alternatePhone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="tel"
                        placeholder="Enter alternate phone number"
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <FaCalendarAlt /> Date of Birth
                  </Label>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="date"
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <FaMars /> Gender
                  </Label>
                  <Controller
                    name="gender"
                    control={control}
                    render={({ field }) => (
                      <Select {...field}>
                        <option value="">Select gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                        <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                      </Select>
                    )}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <FaGlobe /> Nationality
                  </Label>
                  <Controller
                    name="nationality"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter nationality"
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <FaHeart /> Marital Status
                  </Label>
                  <Controller
                    name="maritalStatus"
                    control={control}
                    render={({ field }) => (
                      <Select {...field}>
                        <option value="">Select marital status</option>
                        <option value="SINGLE">Single</option>
                        <option value="MARRIED">Married</option>
                        <option value="DIVORCED">Divorced</option>
                        <option value="WIDOWED">Widowed</option>
                      </Select>
                    )}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <FaTint /> Blood Group
                  </Label>
                  <Controller
                    name="bloodGroup"
                    control={control}
                    render={({ field }) => (
                      <Select {...field}>
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
                </FormGroup>
              </GridLayout>
            </Section>

            {/* Address Information Tab */}
            <Section visible={activeTab === 1}>
              <SectionTitle>
                <FaMapMarkerAlt /> Address Information
              </SectionTitle>
              
              <GridLayout>
                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <Label required>
                    <FaHome /> Street Address
                  </Label>
                  <Controller
                    name="address"
                    control={control}
                    rules={{ required: 'Address is required' }}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Enter complete street address"
                        error={!!errors.address}
                      />
                    )}
                  />
                  {errors.address && (
                    <ErrorMessage>
                      <FaExclamationTriangle />
                      {errors.address.message}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label required>
                    <FaMapMarkerAlt /> City
                  </Label>
                  <Controller
                    name="city"
                    control={control}
                    rules={{ required: 'City is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter city"
                        error={!!errors.city}
                      />
                    )}
                  />
                  {errors.city && (
                    <ErrorMessage>
                      <FaExclamationTriangle />
                      {errors.city.message}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label required>
                    <FaMapMarkerAlt /> State/Province
                  </Label>
                  <Controller
                    name="state"
                    control={control}
                    rules={{ required: 'State is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter state or province"
                        error={!!errors.state}
                      />
                    )}
                  />
                  {errors.state && (
                    <ErrorMessage>
                      <FaExclamationTriangle />
                      {errors.state.message}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label required>
                    <FaMapMarkerAlt /> ZIP/Postal Code
                  </Label>
                  <Controller
                    name="zipCode"
                    control={control}
                    rules={{ required: 'ZIP code is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter ZIP or postal code"
                        error={!!errors.zipCode}
                      />
                    )}
                  />
                  {errors.zipCode && (
                    <ErrorMessage>
                      <FaExclamationTriangle />
                      {errors.zipCode.message}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label required>
                    <FaGlobe /> Country
                  </Label>
                  <Controller
                    name="country"
                    control={control}
                    rules={{ required: 'Country is required' }}
                    render={({ field }) => (
                      <Select {...field} error={!!errors.country}>
                        <option value="">Select country</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="India">India</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Other">Other</option>
                      </Select>
                    )}
                  />
                  {errors.country && (
                    <ErrorMessage>
                      <FaExclamationTriangle />
                      {errors.country.message}
                    </ErrorMessage>
                  )}
                </FormGroup>
              </GridLayout>
            </Section>

            {/* Employment Details Tab */}
            <Section visible={activeTab === 2}>
              <SectionTitle>
                <FaBuilding /> Employment Details
              </SectionTitle>
              
              <GridLayout>
                <FormGroup>
                  <Label>
                    <FaIdCard /> Employee ID
                  </Label>
                  <Controller
                    name="employeeId"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Auto-generated or enter manually"
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup>
                  <Label required>
                    <FaUserTag /> Role/Position
                  </Label>
                  <Controller
                    name="role"
                    control={control}
                    rules={{ required: 'Role is required' }}
                    render={({ field }) => (
                      <Select {...field} error={!!errors.role}>
                        <option value="">Select role</option>
                        <option value="ADMIN">Administrator</option>
                        <option value="MANAGER">Manager</option>
                        <option value="TEAM_LEAD">Team Lead</option>
                        <option value="SENIOR_DEVELOPER">Senior Developer</option>
                        <option value="DEVELOPER">Developer</option>
                        <option value="JUNIOR_DEVELOPER">Junior Developer</option>
                        <option value="DESIGNER">Designer</option>
                        <option value="QA_ENGINEER">QA Engineer</option>
                        <option value="RECEPTIONIST">Receptionist</option>
                        <option value="SECURITY">Security</option>
                        <option value="MAINTENANCE">Maintenance</option>
                        <option value="HOUSEKEEPING">Housekeeping</option>
                        <option value="OTHER">Other</option>
                      </Select>
                    )}
                  />
                  {errors.role && (
                    <ErrorMessage>
                      <FaExclamationTriangle />
                      {errors.role.message}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label required>
                    <FaBuilding /> Department
                  </Label>
                  <Controller
                    name="department"
                    control={control}
                    rules={{ required: 'Department is required' }}
                    render={({ field }) => (
                      <Select {...field} error={!!errors.department}>
                        <option value="">Select department</option>
                        <option value="ENGINEERING">Engineering</option>
                        <option value="PRODUCT">Product</option>
                        <option value="DESIGN">Design</option>
                        <option value="MARKETING">Marketing</option>
                        <option value="SALES">Sales</option>
                        <option value="HR">Human Resources</option>
                        <option value="FINANCE">Finance</option>
                        <option value="OPERATIONS">Operations</option>
                        <option value="ADMINISTRATION">Administration</option>
                        <option value="SECURITY">Security</option>
                        <option value="MAINTENANCE">Maintenance</option>
                        <option value="OTHER">Other</option>
                      </Select>
                    )}
                  />
                  {errors.department && (
                    <ErrorMessage>
                      <FaExclamationTriangle />
                      {errors.department.message}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label required>
                    <FaCalendarAlt /> Date of Joining
                  </Label>
                  <Controller
                    name="dateOfJoining"
                    control={control}
                    rules={{ required: 'Date of joining is required' }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="date"
                        error={!!errors.dateOfJoining}
                      />
                    )}
                  />
                  {errors.dateOfJoining && (
                    <ErrorMessage>
                      <FaExclamationTriangle />
                      {errors.dateOfJoining.message}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label required>
                    <FaClock /> Employment Type
                  </Label>
                  <Controller
                    name="employmentType"
                    control={control}
                    rules={{ required: 'Employment type is required' }}
                    render={({ field }) => (
                      <Select {...field} error={!!errors.employmentType}>
                        <option value="">Select employment type</option>
                        <option value="FULL_TIME">Full Time</option>
                        <option value="PART_TIME">Part Time</option>
                        <option value="CONTRACT">Contract</option>
                        <option value="INTERN">Intern</option>
                      </Select>
                    )}
                  />
                  {errors.employmentType && (
                    <ErrorMessage>
                      <FaExclamationTriangle />
                      {errors.employmentType.message}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label required>
                    <FaMapMarkerAlt /> Work Location
                  </Label>
                  <Controller
                    name="workLocation"
                    control={control}
                    rules={{ required: 'Work location is required' }}
                    render={({ field }) => (
                      <Select {...field} error={!!errors.workLocation}>
                        <option value="">Select work location</option>
                        <option value="ONSITE">On-site</option>
                        <option value="REMOTE">Remote</option>
                        <option value="HYBRID">Hybrid</option>
                      </Select>
                    )}
                  />
                  {errors.workLocation && (
                    <ErrorMessage>
                      <FaExclamationTriangle />
                      {errors.workLocation.message}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>
                    <FaDollarSign /> Salary
                  </Label>
                  <Controller
                    name="salary"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter annual salary"
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <FaGlobe /> Currency
                  </Label>
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <Select {...field}>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="INR">INR (₹)</option>
                        <option value="CAD">CAD (C$)</option>
                        <option value="AUD">AUD (A$)</option>
                      </Select>
                    )}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <FaClock /> Working Hours
                  </Label>
                  <Controller
                    name="workingHours"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="e.g., 9:00 AM - 6:00 PM"
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <FaUserShield /> Reporting Manager ID
                  </Label>
                  <Controller
                    name="reportingManagerId"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter manager's employee ID"
                      />
                    )}
                  />
                </FormGroup>
              </GridLayout>
            </Section>

            {/* Emergency Contact Tab */}
            <Section visible={activeTab === 3}>
              <SectionTitle>
                <FaPhone /> Emergency Contact Information
              </SectionTitle>
              
              <GridLayout>
                <FormGroup>
                  <Label>
                    <FaUser /> Contact Name
                  </Label>
                  <Controller
                    name="emergencyContactName"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter emergency contact name"
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <FaHeart /> Relationship
                  </Label>
                  <Controller
                    name="emergencyContactRelation"
                    control={control}
                    render={({ field }) => (
                      <Select {...field}>
                        <option value="">Select relationship</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Parent">Parent</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Child">Child</option>
                        <option value="Friend">Friend</option>
                        <option value="Other">Other</option>
                      </Select>
                    )}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <FaPhone /> Contact Phone
                  </Label>
                  <Controller
                    name="emergencyContactPhone"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="tel"
                        placeholder="Enter emergency contact phone"
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <Label>
                    <FaHome /> Contact Address
                  </Label>
                  <Controller
                    name="emergencyContactAddress"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="Enter emergency contact address"
                      />
                    )}
                  />
                </FormGroup>
              </GridLayout>
            </Section>

            {/* Education & Skills Tab */}
            <Section visible={activeTab === 4}>
              <SectionTitle>
                <FaGraduationCap /> Education & Skills
              </SectionTitle>
              
              <GridLayout>
                <FormGroup>
                  <Label>
                    <FaGraduationCap /> Highest Education
                  </Label>
                  <Controller
                    name="highestEducation"
                    control={control}
                    render={({ field }) => (
                      <Select {...field}>
                        <option value="">Select education level</option>
                        <option value="High School">High School</option>
                        <option value="Associate Degree">Associate Degree</option>
                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                        <option value="Master's Degree">Master's Degree</option>
                        <option value="Doctorate">Doctorate</option>
                        <option value="Professional Certification">Professional Certification</option>
                      </Select>
                    )}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <FaBuilding /> University/Institution
                  </Label>
                  <Controller
                    name="university"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Enter university or institution name"
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <FaCalendarAlt /> Graduation Year
                  </Label>
                  <Controller
                    name="graduationYear"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        min="1950"
                        max={new Date().getFullYear()}
                        placeholder="Enter graduation year"
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : '')}
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <Label>
                    <FaUser /> Skills
                  </Label>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Enter a skill and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <Button type="button" onClick={addSkill}>
                      Add Skill
                    </Button>
                  </div>
                  <SkillsContainer>
                    {skills.map((skill) => (
                      <SkillTag key={skill}>
                        {skill}
                        <FaTimes
                          onClick={() => removeSkill(skill)}
                          style={{ cursor: 'pointer', marginLeft: '5px' }}
                        />
                      </SkillTag>
                    ))}
                  </SkillsContainer>
                </FormGroup>
              </GridLayout>
            </Section>

            {/* Documents Tab */}
            <Section visible={activeTab === 5}>
              <SectionTitle>
                <FaFileUpload /> Document Upload
              </SectionTitle>
              
              <DocumentUploadArea
                dragActive={dragActive}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => documentInputRef.current?.click()}
              >
                <FaFileUpload size={48} color="#3b82f6" />
                <div>
                  <h3 style={{ margin: '10px 0', color: '#1f2937' }}>
                    Upload Documents
                  </h3>
                  <p style={{ margin: 0, color: '#6b7280' }}>
                    Drag and drop files here or click to browse
                  </p>
                  <p style={{ margin: '5px 0 0', fontSize: '0.75rem', color: '#9ca3af' }}>
                    Supported: PDF, DOC, DOCX, JPG, PNG (Max: 5MB each)
                  </p>
                </div>
                <FileInput
                  ref={documentInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files && handleDocumentUpload(e.target.files)}
                />
              </DocumentUploadArea>

              {documents.length > 0 && (
                <DocumentList>
                  {documents.map((doc, index) => (
                    <DocumentItem key={index}>
                      <div className="doc-info">
                        <FaFileUpload color="#3b82f6" />
                        <div className="doc-details">
                          <div className="doc-name">{doc.name}</div>
                          <div className="doc-size">{formatFileSize(doc.size)}</div>
                        </div>
                      </div>
                      <div className="doc-actions">
                        <Button size="sm" variant="outline">
                          <FaEye /> Preview
                        </Button>
                        <Button 
                          size="sm" 
                          variant="danger"
                          onClick={() => setDocuments(documents.filter((_, i) => i !== index))}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </DocumentItem>
                  ))}
                </DocumentList>
              )}
            </Section>

            {/* Social & Professional Tab */}
            <Section visible={activeTab === 6}>
              <SectionTitle>
                <FaGlobe /> Social & Professional Profiles
              </SectionTitle>
              
              <GridLayout>
                <FormGroup>
                  <Label>
                    <FaLinkedin /> LinkedIn Profile
                  </Label>
                  <Controller
                    name="linkedinProfile"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="https://linkedin.com/in/username"
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <FaGlobe /> GitHub Profile
                  </Label>
                  <Controller
                    name="githubProfile"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="https://github.com/username"
                      />
                    )}
                  />
                </FormGroup>

                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <Label>
                    <FaGlobe /> Portfolio Website
                  </Label>
                  <Controller
                    name="portfolioWebsite"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="https://yourportfolio.com"
                      />
                    )}
                  />
                </FormGroup>
              </GridLayout>
            </Section>

            <ActionButtons>
              <div className="left-actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                  disabled={activeTab === 0}
                >
                  Previous
                </Button>
              </div>
              
              <div className="right-actions">
                {activeTab < tabs.length - 1 ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setActiveTab(Math.min(tabs.length - 1, activeTab + 1))}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="success"
                    size="lg"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaSave />
                        Register Staff Member
                      </>
                    )}
                  </Button>
                )}
              </div>
            </ActionButtons>
          </form>
        </FormContent>
      </FormContainer>
    </PageContainer>
  );
};

export default StaffRegistrationIndustryStandard;