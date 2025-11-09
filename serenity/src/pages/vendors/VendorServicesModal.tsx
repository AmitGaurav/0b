import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  FiX,
  FiTool,
  FiDollarSign,
  FiClock,
  FiCalendar,
  FiMapPin,
  FiTag,
  FiUsers,
  FiPlus,
  FiMinus,
  FiSave,
  FiAlertCircle,
  FiInfo,
  FiCheck
} from 'react-icons/fi';
import { toast } from 'react-toastify';

interface VendorService {
  id: number;
  vendorId: number;
  vendorName: string;
  serviceName: string;
  category: string;
  description: string;
  pricing: {
    basePrice: number;
    priceType: 'hourly' | 'fixed' | 'per_sqft' | 'per_unit';
    minimumCharge: number;
    additionalCharges?: {
      emergencyFee?: number;
      weekendSurcharge?: number;
      materialCost?: number;
      seasonalSurcharge?: number;
    };
  };
  duration: {
    estimated: number;
    minimum: number;
    maximum: number;
  };
  availability: {
    status: 'available' | 'busy' | 'unavailable';
    workingDays: string[];
    workingHours: {
      start: string;
      end: string;
    };
    emergencyAvailable: boolean;
  };
  requirements: string[];
  serviceArea: string[];
  rating: number;
  totalBookings: number;
  completedBookings: number;
  activeBookings: number;
  revenue: number;
  images: string[];
  tags: string[];
  createdDate: Date;
  lastUpdated: Date;
  isActive: boolean;
}

interface Vendor {
  id: number;
  name: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
}

interface VendorServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: VendorService | null;
  onSubmit: (serviceData: Partial<VendorService>) => void;
  vendors?: Vendor[]; // List of all vendors for dropdown
}

interface FormData {
  vendorId: number;
  vendorName: string;
  serviceName: string;
  category: string;
  description: string;
  pricing: {
    basePrice: number;
    priceType: 'hourly' | 'fixed' | 'per_sqft' | 'per_unit';
    minimumCharge: number;
    additionalCharges: {
      emergencyFee: number;
      weekendSurcharge: number;
      materialCost: number;
      seasonalSurcharge: number;
    };
  };
  duration: {
    estimated: number;
    minimum: number;
    maximum: number;
  };
  availability: {
    status: 'available' | 'busy' | 'unavailable';
    workingDays: string[];
    workingHours: {
      start: string;
      end: string;
    };
    emergencyAvailable: boolean;
  };
  requirements: string[];
  serviceArea: string[];
  tags: string[];
  isActive: boolean;
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
  max-width: 900px;
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

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[3]};
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const DurationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[3]};
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const WorkingHoursGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
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

const ListContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[3]};
  min-height: 100px;
`;

const ListItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const ListItem = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[700]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const RemoveButton = styled.button`
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

const AddItemContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const AddItemInput = styled(Input)`
  flex: 1;
`;

const AddItemButton = styled.button`
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

const VendorServicesModal: React.FC<VendorServicesModalProps> = ({
  isOpen,
  onClose,
  service,
  onSubmit,
  vendors = []
}) => {
  // Filter only verified vendors for the dropdown
  const verifiedVendors = vendors.filter(vendor => vendor.verificationStatus === 'verified');
  const [formData, setFormData] = useState<FormData>({
    vendorId: 0,
    vendorName: '',
    serviceName: '',
    category: '',
    description: '',
    pricing: {
      basePrice: 0,
      priceType: 'hourly',
      minimumCharge: 0,
      additionalCharges: {
        emergencyFee: 0,
        weekendSurcharge: 0,
        materialCost: 0,
        seasonalSurcharge: 0
      }
    },
    duration: {
      estimated: 2,
      minimum: 1,
      maximum: 4
    },
    availability: {
      status: 'available',
      workingDays: [],
      workingHours: {
        start: '09:00',
        end: '17:00'
      },
      emergencyAvailable: false
    },
    requirements: [],
    serviceArea: [],
    tags: [],
    isActive: true
  });

  const [newRequirement, setNewRequirement] = useState('');
  const [newServiceArea, setNewServiceArea] = useState('');
  const [newTag, setNewTag] = useState('');

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    if (service && isOpen) {
      setFormData({
        vendorId: service.vendorId,
        vendorName: service.vendorName,
        serviceName: service.serviceName,
        category: service.category,
        description: service.description,
        pricing: {
          ...service.pricing,
          additionalCharges: {
            emergencyFee: service.pricing.additionalCharges?.emergencyFee || 0,
            weekendSurcharge: service.pricing.additionalCharges?.weekendSurcharge || 0,
            materialCost: service.pricing.additionalCharges?.materialCost || 0,
            seasonalSurcharge: service.pricing.additionalCharges?.seasonalSurcharge || 0
          }
        },
        duration: service.duration,
        availability: service.availability,
        requirements: [...service.requirements],
        serviceArea: [...service.serviceArea],
        tags: [...service.tags],
        isActive: service.isActive
      });
    } else if (!service && isOpen) {
      // Reset form for new service
      setFormData({
        vendorId: 0,
        vendorName: '',
        serviceName: '',
        category: '',
        description: '',
        pricing: {
          basePrice: 0,
          priceType: 'hourly',
          minimumCharge: 0,
          additionalCharges: {
            emergencyFee: 0,
            weekendSurcharge: 0,
            materialCost: 0,
            seasonalSurcharge: 0
          }
        },
        duration: {
          estimated: 2,
          minimum: 1,
          maximum: 4
        },
        availability: {
          status: 'available',
          workingDays: [],
          workingHours: {
            start: '09:00',
            end: '17:00'
          },
          emergencyAvailable: false
        },
        requirements: [],
        serviceArea: [],
        tags: [],
        isActive: true
      });
    }
  }, [service, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any, subField?: string, subSubField?: string) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      if (subSubField && subField) {
        (newData as any)[field][subField][subSubField] = value;
      } else if (subField) {
        (newData as any)[field][subField] = value;
      } else {
        (newData as any)[field] = value;
      }
      
      return newData;
    });
  };

  const handleWorkingDayChange = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        workingDays: checked
          ? [...prev.availability.workingDays, day]
          : prev.availability.workingDays.filter(d => d !== day)
      }
    }));
  };

  const addListItem = (listType: 'requirements' | 'serviceArea' | 'tags', value: string) => {
    if (value.trim() && !formData[listType].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [listType]: [...prev[listType], value.trim()]
      }));
      
      // Clear input
      if (listType === 'requirements') setNewRequirement('');
      else if (listType === 'serviceArea') setNewServiceArea('');
      else if (listType === 'tags') setNewTag('');
    }
  };

  const removeListItem = (listType: 'requirements' | 'serviceArea' | 'tags', item: string) => {
    setFormData(prev => ({
      ...prev,
      [listType]: prev[listType].filter(i => i !== item)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.serviceName.trim()) {
      toast.error('Service name is required');
      return;
    }
    
    if (!formData.vendorName.trim()) {
      toast.error('Vendor name is required');
      return;
    }
    
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }
    
    if (formData.pricing.basePrice <= 0) {
      toast.error('Base price must be greater than 0');
      return;
    }

    if (formData.availability.workingDays.length === 0) {
      toast.error('Please select at least one working day');
      return;
    }

    // Clean up additional charges (remove zero values)
    const cleanedAdditionalCharges: any = {};
    Object.entries(formData.pricing.additionalCharges).forEach(([key, value]) => {
      if (value > 0) {
        cleanedAdditionalCharges[key] = value;
      }
    });

    const serviceData = {
      ...formData,
      pricing: {
        ...formData.pricing,
        additionalCharges: Object.keys(cleanedAdditionalCharges).length > 0 
          ? cleanedAdditionalCharges 
          : undefined
      }
    };

    onSubmit(serviceData);
  };

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Modal>
        <Header>
          <Title>
            <FiTool size={24} />
            {service ? 'Edit Service' : 'Add New Service'}
          </Title>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </Header>

        <Content>
          <Form onSubmit={handleSubmit}>
            <Section>
              <SectionTitle>
                <FiInfo size={20} />
                Basic Information
              </SectionTitle>
              <FormGrid>
                <FormGroup>
                  <Label>Vendor Name *</Label>
                  <Select
                    value={formData.vendorId}
                    onChange={(e) => {
                      const selectedVendorId = parseInt(e.target.value);
                      const selectedVendor = verifiedVendors.find(v => v.id === selectedVendorId);
                      handleInputChange('vendorId', selectedVendorId);
                      handleInputChange('vendorName', selectedVendor?.name || '');
                    }}
                    required
                  >
                    <option value={0}>Select Vendor</option>
                    {verifiedVendors.map(vendor => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </option>
                    ))}
                  </Select>
                  {verifiedVendors.length === 0 && (
                    <span style={{ fontSize: '0.875rem', color: '#ef4444', marginTop: '0.25rem' }}>
                      No verified vendors available. Please verify vendors first.
                    </span>
                  )}
                </FormGroup>
                <FormGroup>
                  <Label>Service Name</Label>
                  <Input
                    type="text"
                    value={formData.serviceName}
                    onChange={(e) => handleInputChange('serviceName', e.target.value)}
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
                    <option value="">Select Category</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="electrical">Electrical</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="security">Security</option>
                    <option value="gardening">Gardening</option>
                    <option value="carpentry">Carpentry</option>
                    <option value="painting">Painting</option>
                    <option value="pest-control">Pest Control</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Status</Label>
                  <Select
                    value={formData.availability.status}
                    onChange={(e) => handleInputChange('availability', e.target.value, 'status')}
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                    <option value="unavailable">Unavailable</option>
                  </Select>
                </FormGroup>
                <FullWidthGroup>
                  <Label>Description</Label>
                  <TextArea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the service details..."
                    required
                  />
                </FullWidthGroup>
              </FormGrid>
            </Section>

            <Section>
              <SectionTitle>
                <FiDollarSign size={20} />
                Pricing Information
              </SectionTitle>
              <PricingGrid>
                <FormGroup>
                  <Label>Base Price (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricing.basePrice}
                    onChange={(e) => handleInputChange('pricing', parseFloat(e.target.value) || 0, 'basePrice')}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Price Type</Label>
                  <Select
                    value={formData.pricing.priceType}
                    onChange={(e) => handleInputChange('pricing', e.target.value, 'priceType')}
                  >
                    <option value="hourly">Per Hour</option>
                    <option value="fixed">Fixed Price</option>
                    <option value="per_sqft">Per Sq.ft</option>
                    <option value="per_unit">Per Unit</option>
                  </Select>
                </FormGroup>
                <FormGroup>
                  <Label>Minimum Charge (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.pricing.minimumCharge}
                    onChange={(e) => handleInputChange('pricing', parseFloat(e.target.value) || 0, 'minimumCharge')}
                    required
                  />
                </FormGroup>
              </PricingGrid>

              <FormGrid style={{ marginTop: '1rem' }}>
                <FormGroup>
                  <Label>Emergency Fee (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.pricing.additionalCharges.emergencyFee}
                    onChange={(e) => handleInputChange('pricing', parseFloat(e.target.value) || 0, 'additionalCharges', 'emergencyFee')}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Weekend Surcharge (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.pricing.additionalCharges.weekendSurcharge}
                    onChange={(e) => handleInputChange('pricing', parseFloat(e.target.value) || 0, 'additionalCharges', 'weekendSurcharge')}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Material Cost (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.pricing.additionalCharges.materialCost}
                    onChange={(e) => handleInputChange('pricing', parseFloat(e.target.value) || 0, 'additionalCharges', 'materialCost')}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Seasonal Surcharge (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.pricing.additionalCharges.seasonalSurcharge}
                    onChange={(e) => handleInputChange('pricing', parseFloat(e.target.value) || 0, 'additionalCharges', 'seasonalSurcharge')}
                  />
                </FormGroup>
              </FormGrid>
            </Section>

            <Section>
              <SectionTitle>
                <FiClock size={20} />
                Duration & Availability
              </SectionTitle>
              <DurationGrid>
                <FormGroup>
                  <Label>Estimated Duration (hours)</Label>
                  <Input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.duration.estimated}
                    onChange={(e) => handleInputChange('duration', parseFloat(e.target.value) || 1, 'estimated')}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Minimum Duration (hours)</Label>
                  <Input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={formData.duration.minimum}
                    onChange={(e) => handleInputChange('duration', parseFloat(e.target.value) || 1, 'minimum')}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Maximum Duration (hours)</Label>
                  <Input
                    type="number"
                    min="1"
                    step="0.5"
                    value={formData.duration.maximum}
                    onChange={(e) => handleInputChange('duration', parseFloat(e.target.value) || 1, 'maximum')}
                    required
                  />
                </FormGroup>
              </DurationGrid>

              <FormGroup style={{ marginTop: '1rem' }}>
                <Label>Working Days</Label>
                <CheckboxGrid>
                  {weekDays.map(day => (
                    <CheckboxContainer key={day}>
                      <Checkbox
                        type="checkbox"
                        id={`day-${day}`}
                        checked={formData.availability.workingDays.includes(day)}
                        onChange={(e) => handleWorkingDayChange(day, e.target.checked)}
                      />
                      <CheckboxLabel htmlFor={`day-${day}`}>{day}</CheckboxLabel>
                    </CheckboxContainer>
                  ))}
                </CheckboxGrid>
              </FormGroup>

              <WorkingHoursGrid>
                <FormGroup>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={formData.availability.workingHours.start}
                    onChange={(e) => handleInputChange('availability', e.target.value, 'workingHours', 'start')}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={formData.availability.workingHours.end}
                    onChange={(e) => handleInputChange('availability', e.target.value, 'workingHours', 'end')}
                    required
                  />
                </FormGroup>
              </WorkingHoursGrid>

              <CheckboxContainer style={{ marginTop: '1rem' }}>
                <Checkbox
                  type="checkbox"
                  id="emergency-available"
                  checked={formData.availability.emergencyAvailable}
                  onChange={(e) => handleInputChange('availability', e.target.checked, 'emergencyAvailable')}
                />
                <CheckboxLabel htmlFor="emergency-available">
                  Available for emergency services
                </CheckboxLabel>
              </CheckboxContainer>
            </Section>

            <Section>
              <SectionTitle>
                <FiMapPin size={20} />
                Service Areas
              </SectionTitle>
              <ListContainer>
                <ListItems>
                  {formData.serviceArea.map((area, index) => (
                    <ListItem key={index}>
                      {area}
                      <RemoveButton
                        type="button"
                        onClick={() => removeListItem('serviceArea', area)}
                      >
                        <FiX size={14} />
                      </RemoveButton>
                    </ListItem>
                  ))}
                </ListItems>
                <AddItemContainer>
                  <AddItemInput
                    type="text"
                    value={newServiceArea}
                    onChange={(e) => setNewServiceArea(e.target.value)}
                    placeholder="Add service area..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addListItem('serviceArea', newServiceArea))}
                  />
                  <AddItemButton
                    type="button"
                    onClick={() => addListItem('serviceArea', newServiceArea)}
                  >
                    <FiPlus size={16} />
                    Add
                  </AddItemButton>
                </AddItemContainer>
              </ListContainer>
            </Section>

            <Section>
              <SectionTitle>
                <FiAlertCircle size={20} />
                Requirements
              </SectionTitle>
              <ListContainer>
                <ListItems>
                  {formData.requirements.map((requirement, index) => (
                    <ListItem key={index}>
                      {requirement}
                      <RemoveButton
                        type="button"
                        onClick={() => removeListItem('requirements', requirement)}
                      >
                        <FiX size={14} />
                      </RemoveButton>
                    </ListItem>
                  ))}
                </ListItems>
                <AddItemContainer>
                  <AddItemInput
                    type="text"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="Add requirement..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addListItem('requirements', newRequirement))}
                  />
                  <AddItemButton
                    type="button"
                    onClick={() => addListItem('requirements', newRequirement)}
                  >
                    <FiPlus size={16} />
                    Add
                  </AddItemButton>
                </AddItemContainer>
              </ListContainer>
            </Section>

            <Section>
              <SectionTitle>
                <FiTag size={20} />
                Tags
              </SectionTitle>
              <ListContainer>
                <ListItems>
                  {formData.tags.map((tag, index) => (
                    <ListItem key={index}>
                      {tag}
                      <RemoveButton
                        type="button"
                        onClick={() => removeListItem('tags', tag)}
                      >
                        <FiX size={14} />
                      </RemoveButton>
                    </ListItem>
                  ))}
                </ListItems>
                <AddItemContainer>
                  <AddItemInput
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addListItem('tags', newTag))}
                  />
                  <AddItemButton
                    type="button"
                    onClick={() => addListItem('tags', newTag)}
                  >
                    <FiPlus size={16} />
                    Add
                  </AddItemButton>
                </AddItemContainer>
              </ListContainer>
            </Section>

            <Section>
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="is-active"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                />
                <CheckboxLabel htmlFor="is-active">
                  Service is active and available for booking
                </CheckboxLabel>
              </CheckboxContainer>
            </Section>
          </Form>
        </Content>

        <Footer>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>
            <FiSave size={16} />
            {service ? 'Update Service' : 'Add Service'}
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  );
};

export default VendorServicesModal;