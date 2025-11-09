import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  FaBuilding, 
  FaPlus, 
  FaCheck, 
  FaTimes, 
  FaEye, 
  FaEdit, 
  FaUpload,
  FaDownload,
  FaCalendarAlt,
  FaMapPin,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaSearch,
  FaFilter,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
// Mock auth context for demo - replace with actual auth context
const useAuthContext = () => ({
  user: { name: 'Admin User', role: 'ADMIN' }
});
import { 
  SocietyRegistration,
  OnboardingUserRole
} from '../../types/society-onboarding-modules';
import { PageContainer, PageTitle, ContentCard } from '../../components/common/PageLayout';

// Using standard PageContainer component for consistency

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const HeaderTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const HeaderDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin: 0;
`;

const TabContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  overflow: hidden;
`;

const TabHeader = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.gray[50]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[8]};
  background: ${props => props.$active ? props.theme.colors.white : 'transparent'};
  border: none;
  border-bottom: ${props => props.$active ? `3px solid ${props.theme.colors.primary[500]}` : '3px solid transparent'};
  color: ${props => props.$active ? props.theme.colors.gray[900] : props.theme.colors.gray[600]};
  font-weight: ${props => props.$active ? props.theme.typography.fontWeight.semibold : props.theme.typography.fontWeight.normal};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  
  &:hover {
    background: ${props => props.$active ? props.theme.colors.white : props.theme.colors.gray[100]};
  }
`;

const TabContent = styled.div`
  padding: ${({ theme }) => theme.spacing[8]};
`;

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const FormSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 ${({ theme }) => theme.spacing[4]} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.gray[900]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 2px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[900]};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
  
  &:invalid {
    border-color: ${({ theme }) => theme.colors.error[500]};
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 2px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[900]};
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 2px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[900]};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const FileUpload = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[8]};
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    background: ${({ theme }) => theme.colors.gray[50]};
  }
`;

const FileInput = styled.input`
  display: none;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: ${props.theme.colors.primary[500]};
          color: ${props.theme.colors.white};
          &:hover { background: ${props.theme.colors.primary[600]}; }
        `;
      case 'success':
        return `
          background: ${props.theme.colors.success[500]};
          color: ${props.theme.colors.white};
          &:hover { background: ${props.theme.colors.success[600]}; }
        `;
      case 'danger':
        return `
          background: ${props.theme.colors.error[500]};
          color: ${props.theme.colors.white};
          &:hover { background: ${props.theme.colors.error[600]}; }
        `;
      default:
        return `
          background: ${props.theme.colors.gray[50]};
          color: ${props.theme.colors.gray[900]};
          border: 2px solid ${props.theme.colors.gray[300]};
          &:hover { background: ${props.theme.colors.gray[100]}; }
        `;
    }
  }}
`;

const ManagementContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[8]};
`;

const FilterSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[10]} ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 2px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  right: ${({ theme }) => theme.spacing[4]};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const SocietyCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.boxShadow.md};
  border-left: 4px solid ${({ theme }) => theme.colors.primary[500]};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.boxShadow.lg};
  }
`;

const SocietyHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const SocietyInfo = styled.div`
  flex: 1;
`;

const SocietyName = styled.h3`
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const SocietyDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const StatusBadge = styled.span<{ $status: 'pending' | 'approved' | 'rejected' | 'under_review' }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  
  ${props => {
    switch (props.$status) {
      case 'approved':
        return `
          background: ${props.theme.colors.success[100]};
          color: ${props.theme.colors.success[800]};
        `;
      case 'rejected':
        return `
          background: ${props.theme.colors.error[100]};
          color: ${props.theme.colors.error[800]};
        `;
      case 'under_review':
        return `
          background: ${props.theme.colors.warning[100]};
          color: ${props.theme.colors.warning[800]};
        `;
      default:
        return `
          background: ${props.theme.colors.gray[100]};
          color: ${props.theme.colors.gray[800]};
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const SocietyRegistrationPage: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('register');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Mock user role - in real app, this would come from user context
  const currentUserRole = OnboardingUserRole.ADMIN;
  
  // Form state
  const [formData, setFormData] = useState({
    societyName: '',
    registrationNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    establishedDate: '',
    totalUnits: '',
    societyType: 'residential',
    description: ''
  });

  // Mock data for registered societies
  const [societies, setSocieties] = useState<SocietyRegistration[]>([
    {
      id: '1',
      societyName: 'Green Valley Apartments',
      registrationNumber: 'REG001',
      address: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      contactPerson: 'John Doe',
      contactPhone: '+91-9876543210',
      contactEmail: 'john@greenvalley.com',
      establishedDate: new Date('2020-01-15'),
      totalUnits: 120,
      societyType: 'residential',
      status: 'pending',
      registrationDate: new Date('2024-09-01'),
      documents: [
        { name: 'Society Registration Certificate', type: 'PDF', url: '/docs/cert1.pdf', uploadDate: new Date() }
      ]
    },
    {
      id: '2',
      societyName: 'Sunrise Complex',
      registrationNumber: 'REG002',
      address: '456 Park Avenue',
      city: 'Delhi',
      state: 'Delhi',
      zipCode: '110001',
      contactPerson: 'Jane Smith',
      contactPhone: '+91-9876543211',
      contactEmail: 'jane@sunrise.com',
      establishedDate: new Date('2019-06-20'),
      totalUnits: 80,
      societyType: 'residential',
      status: 'approved',
      registrationDate: new Date('2024-08-15'),
      approvedBy: 'Admin User',
      approvedDate: new Date('2024-09-10'),
      documents: []
    }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newSociety: SocietyRegistration = {
        id: Date.now().toString(),
        ...formData,
        establishedDate: new Date(formData.establishedDate),
        totalUnits: parseInt(formData.totalUnits),
        status: 'pending',
        registrationDate: new Date(),
        documents: []
      } as SocietyRegistration;
      
      setSocieties(prev => [newSociety, ...prev]);
      
      // Reset form
      setFormData({
        societyName: '',
        registrationNumber: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
        establishedDate: '',
        totalUnits: '',
        societyType: 'residential',
        description: ''
      });
      
      alert('Society registration submitted successfully!');
      
    } catch (error) {
      alert('Error submitting registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = (societyId: string) => {
    setSocieties(prev => prev.map(society => 
      society.id === societyId 
        ? { ...society, status: 'approved', approvedBy: 'Admin User', approvedDate: new Date() }
        : society
    ));
  };

  const handleReject = (societyId: string) => {
    const reason = prompt('Please enter rejection reason:');
    if (reason) {
      setSocieties(prev => prev.map(society => 
        society.id === societyId 
          ? { ...society, status: 'rejected', rejectionReason: reason }
          : society
      ));
    }
  };

  const filteredSocieties = societies.filter(society => {
    const matchesSearch = searchTerm === '' || 
      society.societyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      society.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      society.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || society.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <PageContainer>
      <Header>
        <ContentCard>
          <HeaderTitle>
            <FaBuilding />
            Society Registration
          </HeaderTitle>
          <HeaderDescription>
            Register new societies and manage registration requests with approval workflows
          </HeaderDescription>
        </ContentCard>
      </Header>

      <ContentCard>
        <TabHeader>
          <Tab 
            $active={activeTab === 'register'} 
            onClick={() => setActiveTab('register')}
          >
            <FaPlus />
            Register Society
          </Tab>
          {currentUserRole === OnboardingUserRole.ADMIN && (
            <Tab 
              $active={activeTab === 'manage'} 
              onClick={() => setActiveTab('manage')}
            >
              <FaBuilding />
              Manage Registrations
            </Tab>
          )}
        </TabHeader>

        <TabContent>
          {activeTab === 'register' && (
            <FormContainer>
              <form onSubmit={handleSubmit}>
                <FormSection>
                  <SectionTitle>
                    <FaBuilding />
                    Society Information
                  </SectionTitle>
                  
                  <FormRow>
                    <FormGroup>
                      <Label>
                        <FaBuilding />
                        Society Name *
                      </Label>
                      <Input
                        type="text"
                        name="societyName"
                        value={formData.societyName}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter society name"
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label>Registration Number *</Label>
                      <Input
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter registration number"
                      />
                    </FormGroup>
                  </FormRow>

                  <FormRow>
                    <FormGroup>
                      <Label>
                        <FaCalendarAlt />
                        Established Date *
                      </Label>
                      <Input
                        type="date"
                        name="establishedDate"
                        value={formData.establishedDate}
                        onChange={handleInputChange}
                        required
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label>Total Units *</Label>
                      <Input
                        type="number"
                        name="totalUnits"
                        value={formData.totalUnits}
                        onChange={handleInputChange}
                        required
                        min="1"
                        placeholder="Enter number of units"
                      />
                    </FormGroup>
                  </FormRow>

                  <FormRow>
                    <FormGroup>
                      <Label>Society Type *</Label>
                      <Select
                        name="societyType"
                        value={formData.societyType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="residential">Residential</option>
                        <option value="commercial">Commercial</option>
                        <option value="mixed">Mixed Use</option>
                      </Select>
                    </FormGroup>
                  </FormRow>
                </FormSection>

                <FormSection>
                  <SectionTitle>
                    <FaMapPin />
                    Address Information
                  </SectionTitle>
                  
                  <FormRow>
                    <FormGroup>
                      <Label>Street Address *</Label>
                      <TextArea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter complete address"
                        rows={3}
                      />
                    </FormGroup>
                  </FormRow>

                  <FormRow>
                    <FormGroup>
                      <Label>City *</Label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter city"
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label>State *</Label>
                      <Input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter state"
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label>ZIP Code *</Label>
                      <Input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter ZIP code"
                      />
                    </FormGroup>
                  </FormRow>
                </FormSection>

                <FormSection>
                  <SectionTitle>
                    <FaUser />
                    Contact Information
                  </SectionTitle>
                  
                  <FormRow>
                    <FormGroup>
                      <Label>
                        <FaUser />
                        Contact Person *
                      </Label>
                      <Input
                        type="text"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter contact person name"
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label>
                        <FaPhone />
                        Phone Number *
                      </Label>
                      <Input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter phone number"
                      />
                    </FormGroup>
                    
                    <FormGroup>
                      <Label>
                        <FaEnvelope />
                        Email Address *
                      </Label>
                      <Input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter email address"
                      />
                    </FormGroup>
                  </FormRow>
                </FormSection>

                <FormSection>
                  <SectionTitle>
                    <FaUpload />
                    Documents Upload
                  </SectionTitle>
                  
                  <FileUpload>
                    <FileInput
                      type="file"
                      id="documents"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="documents">
                      <FaUpload size={24} style={{ marginBottom: '0.5rem' }} />
                      <p>Click to upload documents or drag and drop</p>
                      <small>PDF, JPG, PNG files only. Max 10MB per file.</small>
                    </label>
                  </FileUpload>
                </FormSection>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <Button type="button" onClick={() => setFormData({
                    societyName: '',
                    registrationNumber: '',
                    address: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    contactPerson: '',
                    contactPhone: '',
                    contactEmail: '',
                    establishedDate: '',
                    totalUnits: '',
                    societyType: 'residential',
                    description: ''
                  })}>
                    Reset Form
                  </Button>
                  <Button type="submit" $variant="primary" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit Registration'}
                  </Button>
                </div>
              </form>
            </FormContainer>
          )}

          {activeTab === 'manage' && currentUserRole === OnboardingUserRole.ADMIN && (
            <ManagementContainer>
              <FilterSection>
                <SearchBox>
                  <SearchInput
                    type="text"
                    placeholder="Search societies by name, contact person, or city..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <SearchIcon />
                </SearchBox>
                
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="under_review">Under Review</option>
                </Select>
              </FilterSection>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredSocieties.map((society) => (
                  <SocietyCard key={society.id}>
                    <SocietyHeader>
                      <SocietyInfo>
                        <SocietyName>{society.societyName}</SocietyName>
                        <SocietyDetails>
                          <div><strong>Registration:</strong> {society.registrationNumber}</div>
                          <div><strong>Contact:</strong> {society.contactPerson}</div>
                          <div><strong>Phone:</strong> {society.contactPhone}</div>
                          <div><strong>Location:</strong> {society.city}, {society.state}</div>
                          <div><strong>Units:</strong> {society.totalUnits}</div>
                          <div><strong>Type:</strong> {society.societyType}</div>
                        </SocietyDetails>
                      </SocietyInfo>
                      <StatusBadge $status={society.status}>
                        {society.status === 'approved' && <FaCheckCircle />}
                        {society.status === 'rejected' && <FaTimesCircle />}
                        {society.status === 'under_review' && <FaExclamationTriangle />}
                        {society.status === 'pending' && <FaClock />}
                        {society.status}
                      </StatusBadge>
                    </SocietyHeader>
                    
                    <ActionButtons>
                      <Button onClick={() => navigate(`/society-details/${society.id}`)}>
                        <FaEye />
                        View Details
                      </Button>
                      {society.status === 'pending' && (
                        <>
                          <Button 
                            $variant="success" 
                            onClick={() => handleApprove(society.id)}
                          >
                            <FaCheck />
                            Approve
                          </Button>
                          <Button 
                            $variant="danger" 
                            onClick={() => handleReject(society.id)}
                          >
                            <FaTimes />
                            Reject
                          </Button>
                        </>
                      )}
                      <Button>
                        <FaDownload />
                        Export
                      </Button>
                    </ActionButtons>
                  </SocietyCard>
                ))}
              </div>
            </ManagementContainer>
          )}
        </TabContent>
      </ContentCard>
    </PageContainer>
  );
};

export default SocietyRegistrationPage;