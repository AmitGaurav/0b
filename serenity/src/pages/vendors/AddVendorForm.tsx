import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import {
  FiX,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiGlobe,
  FiFileText,
  FiDollarSign,
  FiClock,
  FiCheck,
  FiUpload,
  FiPlus,
  FiMinus,
  FiSave,
  FiAlertCircle,
  FiInfo
} from 'react-icons/fi';
import { toast } from 'react-toastify';

interface Vendor {
  id: number;
  name: string;
  category: string;
  phone: string;
  email: string;
  rating: number;
  totalJobs: number;
  societyId: number;
  societyName: string;
  address: string;
  website?: string;
  description: string;
  specialties: string[];
  priceRange: 'budget' | 'mid-range' | 'premium';
  availability: 'available' | 'busy' | 'unavailable';
  verificationStatus: 'verified' | 'pending' | 'rejected';
  joinedDate: Date;
  lastActivity: Date;
  completedJobs: number;
  avgResponseTime: number;
  documents: string[];
  emergencyAvailable: boolean;
  contractType: 'hourly' | 'fixed' | 'contract';
}

interface AddVendorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (vendorData: Omit<Vendor, 'id' | 'rating' | 'totalJobs' | 'completedJobs' | 'joinedDate' | 'lastActivity'>) => void;
}

interface FormData {
  name: string;
  category: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  description: string;
  specialties: string[];
  priceRange: 'budget' | 'mid-range' | 'premium';
  availability: 'available' | 'busy' | 'unavailable';
  verificationStatus: 'verified' | 'pending' | 'rejected';
  avgResponseTime: number;
  documents: File[];
  emergencyAvailable: boolean;
  contractType: 'hourly' | 'fixed' | 'contract';
  societyId: number;
  societyName: string;
}

const Overlay = styled.div`
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

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.boxShadow.xl};
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing[1]};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray[400]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    color: ${({ theme }) => theme.colors.gray[600]};
    background: ${({ theme }) => theme.colors.gray[100]};
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const FormSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  
  &:last-child {
    margin-bottom: 0;
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
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[5]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const RequiredIndicator = styled.span`
  color: ${({ theme }) => theme.colors.error[500]};
  margin-left: ${({ theme }) => theme.spacing[1]};
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

  &:invalid {
    border-color: ${({ theme }) => theme.colors.error[400]};
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
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: ${({ theme }) => theme.transition.all};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const SpecialtiesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const SpecialtyInputRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
`;

const SpecialtyInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    border-color: ${({ theme }) => theme.colors.primary[300]};
  }
  
  &.danger:hover {
    background: ${({ theme }) => theme.colors.error[50]};
    border-color: ${({ theme }) => theme.colors.error[300]};
    color: ${({ theme }) => theme.colors.error[600]};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const Checkbox = styled.input`
  margin: 0;
  accent-color: ${({ theme }) => theme.colors.primary[600]};
`;

const CheckboxLabel = styled.label`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
`;

const FileUploadArea = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
`;

const FileList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const RemoveFile = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: ${({ theme }) => theme.colors.error[500]};
  }
`;

const HelpText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: ${({ theme }) => theme.spacing[1]};
  margin-bottom: 0;
`;

const InfoBox = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.info[50]};
  border: 1px solid ${({ theme }) => theme.colors.info[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  svg {
    color: ${({ theme }) => theme.colors.info[600]};
    margin-top: 2px;
    flex-shrink: 0;
  }

  p {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.info[700]};
    line-height: 1.5;
  }
`;

const Footer = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  
  ${({ variant = 'secondary', theme }) => variant === 'primary' ? `
    background: ${theme.colors.primary[600]};
    color: ${theme.colors.white};
    border: 1px solid ${theme.colors.primary[600]};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.primary[700]};
      border-color: ${theme.colors.primary[700]};
      transform: translateY(-1px);
      box-shadow: ${theme.boxShadow.md};
    }
  ` : `
    background: ${theme.colors.white};
    color: ${theme.colors.gray[700]};
    border: 1px solid ${theme.colors.gray[300]};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.gray[50]};
      border-color: ${theme.colors.gray[400]};
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AddVendorForm: React.FC<AddVendorFormProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: 'plumbing',
    phone: '',
    email: '',
    address: '',
    website: '',
    description: '',
    specialties: [''],
    priceRange: 'mid-range',
    availability: 'available',
    verificationStatus: 'pending',
    avgResponseTime: 4,
    documents: [],
    emergencyAvailable: false,
    contractType: 'hourly',
    societyId: 1,
    societyName: 'SNN Raj Serenity'
  });

  const categories = [
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'security', label: 'Security' },
    { value: 'gardening', label: 'Gardening' },
    { value: 'carpentry', label: 'Carpentry' },
    { value: 'painting', label: 'Painting' },
    { value: 'pest-control', label: 'Pest Control' },
    { value: 'appliance-repair', label: 'Appliance Repair' },
    { value: 'housekeeping', label: 'Housekeeping' }
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecialtyChange = (index: number, value: string) => {
    const newSpecialties = [...formData.specialties];
    newSpecialties[index] = value;
    setFormData(prev => ({ ...prev, specialties: newSpecialties }));
  };

  const addSpecialty = () => {
    setFormData(prev => ({
      ...prev,
      specialties: [...prev.specialties, '']
    }));
  };

  const removeSpecialty = (index: number) => {
    if (formData.specialties.length > 1) {
      setFormData(prev => ({
        ...prev,
        specialties: prev.specialties.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast.error('Vendor name is required');
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error('Phone number is required');
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Valid email address is required');
      return false;
    }
    if (!formData.address.trim()) {
      toast.error('Address is required');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return false;
    }
    if (formData.specialties.every(s => !s.trim())) {
      toast.error('At least one specialty is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const vendorData = {
        ...formData,
        specialties: formData.specialties.filter(s => s.trim()),
        documents: formData.documents.map(f => f.name), // In real app, upload files and get URLs
        societyId: formData.societyId,
        societyName: formData.societyName
      };

      await onSubmit(vendorData);
      toast.success('Vendor added successfully');
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        category: 'plumbing',
        phone: '',
        email: '',
        address: '',
        website: '',
        description: '',
        specialties: [''],
        priceRange: 'mid-range',
        availability: 'available',
        verificationStatus: 'pending',
        avgResponseTime: 4,
        documents: [],
        emergencyAvailable: false,
        contractType: 'hourly',
        societyId: 1,
        societyName: 'SNN Raj Serenity'
      });
    } catch (error) {
      console.error('Error adding vendor:', error);
      toast.error('Failed to add vendor');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Modal>
        <Header>
          <Title>Add New Vendor</Title>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </Header>

        <form onSubmit={handleSubmit}>
          <Content>
            <InfoBox>
              <FiInfo size={20} />
              <p>
                Add comprehensive vendor information to help residents find the right service provider.
                Required fields are marked with an asterisk (*).
              </p>
            </InfoBox>

            <FormSection>
              <SectionTitle>
                <FiUser size={20} />
                Basic Information
              </SectionTitle>
              
              <FormRow>
                <FormGroup>
                  <Label htmlFor="name">
                    Vendor Name<RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., QuickFix Plumbers"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="category">
                    Category<RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </Select>
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="phone">
                    Phone Number<RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">
                    Email Address<RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contact@vendor.com"
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label htmlFor="address">
                  Address<RequiredIndicator>*</RequiredIndicator>
                </Label>
                <TextArea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Complete address including area and pincode"
                  required
                  rows={3}
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="website">
                  Website (Optional)
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://www.vendor.com"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="description">
                  Description<RequiredIndicator>*</RequiredIndicator>
                </Label>
                <TextArea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of services offered"
                  required
                  rows={4}
                />
                <HelpText>Provide a clear description of services and unique selling points</HelpText>
              </FormGroup>
            </FormSection>

            <FormSection>
              <SectionTitle>
                <FiFileText size={20} />
                Service Details
              </SectionTitle>

              <FormGroup>
                <Label>
                  Specialties<RequiredIndicator>*</RequiredIndicator>
                </Label>
                <SpecialtiesContainer>
                  {formData.specialties.map((specialty, index) => (
                    <SpecialtyInputRow key={index}>
                      <SpecialtyInput
                        value={specialty}
                        onChange={(e) => handleSpecialtyChange(index, e.target.value)}
                        placeholder="e.g., Emergency Repairs, Pipe Installation"
                      />
                      {formData.specialties.length > 1 && (
                        <IconButton 
                          type="button" 
                          className="danger"
                          onClick={() => removeSpecialty(index)}
                        >
                          <FiMinus size={16} />
                        </IconButton>
                      )}
                      {index === formData.specialties.length - 1 && (
                        <IconButton type="button" onClick={addSpecialty}>
                          <FiPlus size={16} />
                        </IconButton>
                      )}
                    </SpecialtyInputRow>
                  ))}
                </SpecialtiesContainer>
                <HelpText>Add the main services and specialties this vendor offers</HelpText>
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="priceRange">Price Range</Label>
                  <Select
                    id="priceRange"
                    value={formData.priceRange}
                    onChange={(e) => handleInputChange('priceRange', e.target.value as FormData['priceRange'])}
                  >
                    <option value="budget">Budget Friendly</option>
                    <option value="mid-range">Mid Range</option>
                    <option value="premium">Premium</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="contractType">Contract Type</Label>
                  <Select
                    id="contractType"
                    value={formData.contractType}
                    onChange={(e) => handleInputChange('contractType', e.target.value as FormData['contractType'])}
                  >
                    <option value="hourly">Hourly Rate</option>
                    <option value="fixed">Fixed Price</option>
                    <option value="contract">Long-term Contract</option>
                  </Select>
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label htmlFor="availability">Availability</Label>
                  <Select
                    id="availability"
                    value={formData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value as FormData['availability'])}
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="unavailable">Unavailable</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="responseTime">Avg Response Time (hours)</Label>
                  <Input
                    id="responseTime"
                    type="number"
                    min="1"
                    max="48"
                    value={formData.avgResponseTime}
                    onChange={(e) => handleInputChange('avgResponseTime', parseInt(e.target.value) || 4)}
                  />
                </FormGroup>
              </FormRow>

              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="emergencyAvailable"
                  checked={formData.emergencyAvailable}
                  onChange={(e) => handleInputChange('emergencyAvailable', e.target.checked)}
                />
                <CheckboxLabel htmlFor="emergencyAvailable">
                  Available for emergency services (24/7)
                </CheckboxLabel>
              </CheckboxContainer>
            </FormSection>

            <FormSection>
              <SectionTitle>
                <FiUpload size={20} />
                Documents & Verification
              </SectionTitle>

              <FormGroup>
                <Label htmlFor="verificationStatus">Verification Status</Label>
                <Select
                  id="verificationStatus"
                  value={formData.verificationStatus}
                  onChange={(e) => handleInputChange('verificationStatus', e.target.value as FormData['verificationStatus'])}
                >
                  <option value="pending">Pending Verification</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </Select>
                <HelpText>Set initial verification status - can be updated later</HelpText>
              </FormGroup>

              <FormGroup>
                <Label>Documents (Optional)</Label>
                <FileUploadArea onClick={() => fileInputRef.current?.click()}>
                  <FiUpload size={32} />
                  <p>Click to upload documents</p>
                  <HelpText style={{ margin: 0 }}>
                    Licenses, certificates, insurance documents (PDF, JPEG, PNG)
                  </HelpText>
                </FileUploadArea>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  hidden
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />

                {formData.documents.length > 0 && (
                  <FileList>
                    {formData.documents.map((file, index) => (
                      <FileItem key={index}>
                        <FiFileText size={14} />
                        <span>{file.name}</span>
                        <RemoveFile
                          type="button"
                          onClick={() => removeFile(index)}
                        >
                          <FiX size={14} />
                        </RemoveFile>
                      </FileItem>
                    ))}
                  </FileList>
                )}
              </FormGroup>
            </FormSection>
          </Content>

          <Footer>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              <FiSave size={16} />
              {isSubmitting ? 'Adding...' : 'Add Vendor'}
            </Button>
          </Footer>
        </form>
      </Modal>
    </Overlay>
  );
};

export default AddVendorForm;