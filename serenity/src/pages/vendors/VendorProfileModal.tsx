import React, { useState, useEffect } from 'react';
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
  FiInfo,
  FiCalendar,
  FiStar
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
  completedJobs: number;
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
  avgResponseTime: number;
  documents: string[];
  emergencyAvailable: boolean;
  contractType: 'hourly' | 'fixed' | 'contract';
}

interface VendorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
  onUpdate: (vendor: Vendor) => void;
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
  avgResponseTime: number;
  emergencyAvailable: boolean;
  contractType: 'hourly' | 'fixed' | 'contract';
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
  border-radius: ${({ theme }) => theme.borderRadius.xl};
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
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
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

const VendorSummary = styled.div`
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SummaryInfo = styled.div``;

const VendorName = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing[1]} 0;
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const VendorMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Badge = styled.span<{ variant?: 'category' | 'status' | 'info' }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;

  ${({ variant = 'category', theme }) => {
    switch (variant) {
      case 'status':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
        `;
      case 'info':
        return `
          background: ${theme.colors.info[100]};
          color: ${theme.colors.info[700]};
        `;
      default:
        return `
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[700]};
        `;
    }
  }}
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.warning[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const SummaryStats = styled.div`
  text-align: right;
`;

const StatItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const StatLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-left: ${({ theme }) => theme.spacing[1]};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

const Section = styled.div``;

const SectionTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing[4]} 0;
  color: ${({ theme }) => theme.colors.gray[800]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FullWidthGroup = styled(FormGroup)`
  grid-column: 1 / -1;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const Input = styled.input`
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
`;

const Select = styled.select`
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
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[3]};
  min-height: 100px;
`;

const SpecialtiesList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const SpecialtyTag = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[700]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const RemoveSpecialty = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary[600]};
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[800]};
  }
`;

const AddSpecialtyContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const AddSpecialtyInput = styled(Input)`
  flex: 1;
`;

const AddSpecialtyButton = styled.button`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.primary[600]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[700]};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${({ theme }) => theme.colors.primary[600]};
`;

const CheckboxLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
`;

const Footer = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  border: 1px solid;

  ${({ variant = 'secondary', theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary[600]};
          color: ${theme.colors.white};
          border-color: ${theme.colors.primary[600]};
          
          &:hover {
            background: ${theme.colors.primary[700]};
            border-color: ${theme.colors.primary[700]};
          }
        `;
      default:
        return `
          background: ${theme.colors.white};
          color: ${theme.colors.gray[700]};
          border-color: ${theme.colors.gray[300]};
          
          &:hover {
            background: ${theme.colors.gray[50]};
            border-color: ${theme.colors.gray[400]};
          }
        `;
    }
  }}
`;

const VendorProfileModal: React.FC<VendorProfileModalProps> = ({
  isOpen,
  onClose,
  vendor,
  onUpdate
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: '',
    phone: '',
    email: '',
    address: '',
    website: '',
    description: '',
    specialties: [],
    priceRange: 'mid-range',
    availability: 'available',
    avgResponseTime: 2,
    emergencyAvailable: false,
    contractType: 'hourly'
  });

  const [newSpecialty, setNewSpecialty] = useState('');

  useEffect(() => {
    if (vendor && isOpen) {
      setFormData({
        name: vendor.name,
        category: vendor.category,
        phone: vendor.phone,
        email: vendor.email,
        address: vendor.address,
        website: vendor.website || '',
        description: vendor.description,
        specialties: [...vendor.specialties],
        priceRange: vendor.priceRange,
        availability: vendor.availability,
        avgResponseTime: vendor.avgResponseTime,
        emergencyAvailable: vendor.emergencyAvailable,
        contractType: vendor.contractType
      });
    }
  }, [vendor, isOpen]);

  if (!isOpen || !vendor) return null;

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSpecialty = () => {
    if (newSpecialty.trim() && !formData.specialties.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const handleRemoveSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedVendor: Vendor = {
      ...vendor,
      ...formData
    };

    onUpdate(updatedVendor);
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <FiStar key={i} size={16} fill={i < Math.floor(rating) ? 'currentColor' : 'none'} />
    ));
  };

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Modal>
        <Header>
          <Title>
            <FiUser size={24} />
            Edit Vendor Profile
          </Title>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </Header>

        <Content>
          <VendorSummary>
            <SummaryInfo>
              <VendorName>{vendor.name}</VendorName>
              <VendorMeta>
                <Badge variant="category">{vendor.category}</Badge>
                <Badge variant="status">
                  {vendor.verificationStatus}
                </Badge>
                <Badge variant="info">{vendor.availability}</Badge>
              </VendorMeta>
              <Rating>
                {renderStars(vendor.rating)}
                <span>{vendor.rating}</span>
                <span>({vendor.totalJobs} jobs)</span>
              </Rating>
            </SummaryInfo>
            <SummaryStats>
              <StatItem>
                <StatValue>{vendor.completedJobs}</StatValue>
                <StatLabel>Completed</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{vendor.avgResponseTime}h</StatValue>
                <StatLabel>Response Time</StatLabel>
              </StatItem>
              <StatItem>
                <StatValue>{vendor.joinedDate.toLocaleDateString()}</StatValue>
                <StatLabel>Joined</StatLabel>
              </StatItem>
            </SummaryStats>
          </VendorSummary>

          <Form onSubmit={handleSubmit}>
            <Section>
              <SectionTitle>
                <FiUser size={20} />
                Basic Information
              </SectionTitle>
              <FormGrid>
                <FormGroup>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    required
                  >
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="security">Security</option>
                    <option value="gardening">Gardening</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="painting">Painting</option>
                    <option value="pest-control">Pest Control</option>
                    <option value="appliance-repair">Appliance Repair</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Phone</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </FormGroup>
                <FullWidthGroup>
                  <Label>Address</Label>
                  <Input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  />
                </FullWidthGroup>
                <FormGroup>
                  <Label>Website</Label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://example.com"
                  />
                </FormGroup>
              </FormGrid>
            </Section>

            <Section>
              <SectionTitle>
                <FiFileText size={20} />
                Service Details
              </SectionTitle>
              <FullWidthGroup>
                <Label>Description</Label>
                <TextArea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your services..."
                  required
                />
              </FullWidthGroup>
              
              <FullWidthGroup>
                <Label>Specialties</Label>
                <SpecialtiesContainer>
                  <SpecialtiesList>
                    {formData.specialties.map((specialty, index) => (
                      <SpecialtyTag key={index}>
                        {specialty}
                        <RemoveSpecialty
                          type="button"
                          onClick={() => handleRemoveSpecialty(specialty)}
                        >
                          <FiX size={14} />
                        </RemoveSpecialty>
                      </SpecialtyTag>
                    ))}
                  </SpecialtiesList>
                  <AddSpecialtyContainer>
                    <AddSpecialtyInput
                      type="text"
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      placeholder="Add specialty..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialty())}
                    />
                    <AddSpecialtyButton type="button" onClick={handleAddSpecialty}>
                      <FiPlus size={16} />
                      Add
                    </AddSpecialtyButton>
                  </AddSpecialtyContainer>
                </SpecialtiesContainer>
              </FullWidthGroup>

              <FormGrid>
                <FormGroup>
                  <Label>Price Range</Label>
                  <Select
                    value={formData.priceRange}
                    onChange={(e) => handleInputChange('priceRange', e.target.value as any)}
                  >
                    <option value="budget">Budget</option>
                    <option value="mid-range">Mid-range</option>
                    <option value="premium">Premium</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Availability</Label>
                  <Select
                    value={formData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value as any)}
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="unavailable">Unavailable</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Average Response Time (hours)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="24"
                    value={formData.avgResponseTime}
                    onChange={(e) => handleInputChange('avgResponseTime', parseInt(e.target.value))}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Contract Type</Label>
                  <Select
                    value={formData.contractType}
                    onChange={(e) => handleInputChange('contractType', e.target.value as any)}
                  >
                    <option value="hourly">Hourly</option>
                    <option value="fixed">Fixed Price</option>
                    <option value="contract">Contract</option>
                  </Select>
                </FormGroup>
                <FullWidthGroup>
                  <CheckboxContainer>
                    <Checkbox
                      id="emergencyAvailable"
                      type="checkbox"
                      checked={formData.emergencyAvailable}
                      onChange={(e) => handleInputChange('emergencyAvailable', e.target.checked)}
                    />
                    <CheckboxLabel htmlFor="emergencyAvailable">
                      Available for emergency services
                    </CheckboxLabel>
                  </CheckboxContainer>
                </FullWidthGroup>
              </FormGrid>
            </Section>
          </Form>
        </Content>

        <Footer>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>
            <FiSave size={16} />
            Update Profile
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default VendorProfileModal;