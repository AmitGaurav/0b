import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaBuilding, 
  FaArrowLeft,
  FaEdit,
  FaSave,
  FaTimes,
  FaCalendarAlt,
  FaMapPin,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaDownload,
  FaUpload,
  FaCheck,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaFileAlt,
  FaTrash
} from 'react-icons/fa';
import { 
  SocietyRegistration,
  OnboardingUserRole
} from '../../types/society-onboarding-modules';

type RegistrationStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

// Mock auth context for demo - replace with actual auth context
const useAuthContext = () => ({
  user: { name: 'Admin User', role: 'ADMIN' }
});

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
`;

const Header = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled.button`
  background: #f8f9fa;
  border: 2px solid #e0e6ed;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  
  &:hover {
    background: #e9ecef;
    transform: translateX(-2px);
  }
`;

const HeaderTitle = styled.h1`
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const StatusBadge = styled.span<{ $status: RegistrationStatus }>`
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => {
    switch (props.$status) {
      case 'approved':
        return `
          background: #d4edda;
          color: #155724;
        `;
      case 'rejected':
        return `
          background: #f8d7da;
          color: #721c24;
        `;
      case 'under_review':
        return `
          background: #fff3cd;
          color: #856404;
        `;
      default:
        return `
          background: #e2e3e5;
          color: #383d41;
        `;
    }
  }}
`;

const ContentContainer = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ContentHeader = styled.div`
  background: #f8f9fa;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e0e6ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ContentTitle = styled.h2`
  color: #2c3e50;
  margin: 0;
  font-size: 1.25rem;
`;

const EditToggle = styled.button<{ $isEditing: boolean }>`
  background: ${props => props.$isEditing ? '#e74c3c' : '#667eea'};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  
  &:hover {
    background: ${props => props.$isEditing ? '#c0392b' : '#5a67d8'};
  }
`;

const ContentBody = styled.div`
  padding: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  font-size: 1.125rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f1f3f4;
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
`;

const FieldLabel = styled.label`
  color: #2c3e50;
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`;

const FieldValue = styled.div`
  color: #495057;
  font-size: 1rem;
  line-height: 1.4;
  min-height: 1.5rem;
`;

const ReadOnlyField = styled(FieldValue)`
  background: #f8f9fa;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  font-weight: 500;
  color: #6c757d;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &:invalid {
    border-color: #e74c3c;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 2px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const DocumentsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DocumentItem = styled.div`
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DocumentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const DocumentActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: #667eea;
          color: white;
          &:hover { background: #5a67d8; }
        `;
      case 'success':
        return `
          background: #2ecc71;
          color: white;
          &:hover { background: #27ae60; }
        `;
      case 'danger':
        return `
          background: #e74c3c;
          color: white;
          &:hover { background: #c0392b; }
        `;
      default:
        return `
          background: #f8f9fa;
          color: #2c3e50;
          border: 2px solid #e0e6ed;
          &:hover { background: #e9ecef; }
        `;
    }
  }}
`;

const SaveButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e6ed;
`;

const SocietyDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Mock user role - in real app, this would come from user context
  const currentUserRole = OnboardingUserRole.ADMIN;

  // Mock society data - in real app, this would be fetched based on ID
  const [societyData, setSocietyData] = useState<SocietyRegistration>({
    id: id || '1',
    societyName: 'Green Valley Apartments',
    registrationNumber: 'REG001',
    address: '123 Main Street, Sector 15',
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
      { 
        name: 'Society Registration Certificate', 
        type: 'PDF', 
        url: '/docs/cert1.pdf', 
        uploadDate: new Date('2024-09-01') 
      },
      { 
        name: 'NOC from Municipal Corporation', 
        type: 'PDF', 
        url: '/docs/noc1.pdf', 
        uploadDate: new Date('2024-09-02') 
      }
    ]
  });

  const [editableData, setEditableData] = useState<SocietyRegistration>(societyData);

  useEffect(() => {
    setEditableData(societyData);
  }, [societyData]);

  const handleInputChange = (field: keyof SocietyRegistration, value: any) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSocietyData(editableData);
      setIsEditing(false);
      alert('Society details updated successfully!');
    } catch (error) {
      alert('Error updating society details. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditableData(societyData);
    setIsEditing(false);
  };

  const getStatusIcon = (status: RegistrationStatus) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle />;
      case 'rejected':
        return <FaTimesCircle />;
      case 'under_review':
        return <FaExclamationTriangle />;
      default:
        return <FaClock />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => navigate('/society-registration')}>
            <FaArrowLeft />
          </BackButton>
          <HeaderTitle>
            <FaBuilding />
            {isEditing ? editableData.societyName : societyData.societyName}
          </HeaderTitle>
        </HeaderLeft>
        <HeaderActions>
          <StatusBadge $status={societyData.status}>
            {getStatusIcon(societyData.status)}
            {societyData.status}
          </StatusBadge>
        </HeaderActions>
      </Header>

      <ContentContainer>
        <ContentHeader>
          <ContentTitle>Society Details</ContentTitle>
          {currentUserRole === OnboardingUserRole.ADMIN && (
            <EditToggle 
              $isEditing={isEditing} 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <FaTimes /> : <FaEdit />}
              {isEditing ? 'Cancel Edit' : 'Edit Details'}
            </EditToggle>
          )}
        </ContentHeader>

        <ContentBody>
          {/* Society Information */}
          <Section>
            <SectionTitle>
              <FaBuilding />
              Society Information
            </SectionTitle>
            <FieldGrid>
              <Field>
                <FieldLabel>
                  <FaBuilding />
                  Society Name
                </FieldLabel>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editableData.societyName}
                    onChange={(e) => handleInputChange('societyName', e.target.value)}
                    placeholder="Enter society name"
                  />
                ) : (
                  <FieldValue>{societyData.societyName}</FieldValue>
                )}
              </Field>

              <Field>
                <FieldLabel>Registration Number</FieldLabel>
                <ReadOnlyField>{societyData.registrationNumber}</ReadOnlyField>
              </Field>

              <Field>
                <FieldLabel>
                  <FaCalendarAlt />
                  Established Date
                </FieldLabel>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editableData.establishedDate.toISOString().split('T')[0]}
                    onChange={(e) => handleInputChange('establishedDate', new Date(e.target.value))}
                  />
                ) : (
                  <FieldValue>{formatDate(societyData.establishedDate)}</FieldValue>
                )}
              </Field>

              <Field>
                <FieldLabel>Total Units</FieldLabel>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editableData.totalUnits}
                    onChange={(e) => handleInputChange('totalUnits', parseInt(e.target.value))}
                    min="1"
                    placeholder="Enter number of units"
                  />
                ) : (
                  <FieldValue>{societyData.totalUnits}</FieldValue>
                )}
              </Field>

              <Field>
                <FieldLabel>Society Type</FieldLabel>
                {isEditing ? (
                  <Select
                    value={editableData.societyType}
                    onChange={(e) => handleInputChange('societyType', e.target.value)}
                  >
                    <option value="residential">Residential</option>
                    <option value="commercial">Commercial</option>
                    <option value="mixed">Mixed Use</option>
                  </Select>
                ) : (
                  <FieldValue style={{ textTransform: 'capitalize' }}>{societyData.societyType}</FieldValue>
                )}
              </Field>
            </FieldGrid>
          </Section>

          {/* Address Information */}
          <Section>
            <SectionTitle>
              <FaMapPin />
              Address Information
            </SectionTitle>
            <FieldGrid>
              <Field style={{ gridColumn: '1 / -1' }}>
                <FieldLabel>Street Address</FieldLabel>
                {isEditing ? (
                  <TextArea
                    value={editableData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter complete address"
                    rows={2}
                  />
                ) : (
                  <FieldValue>{societyData.address}</FieldValue>
                )}
              </Field>

              <Field>
                <FieldLabel>City</FieldLabel>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editableData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city"
                  />
                ) : (
                  <FieldValue>{societyData.city}</FieldValue>
                )}
              </Field>

              <Field>
                <FieldLabel>State</FieldLabel>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editableData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Enter state"
                  />
                ) : (
                  <FieldValue>{societyData.state}</FieldValue>
                )}
              </Field>

              <Field>
                <FieldLabel>ZIP Code</FieldLabel>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editableData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="Enter ZIP code"
                  />
                ) : (
                  <FieldValue>{societyData.zipCode}</FieldValue>
                )}
              </Field>
            </FieldGrid>
          </Section>

          {/* Contact Information */}
          <Section>
            <SectionTitle>
              <FaUser />
              Contact Information
            </SectionTitle>
            <FieldGrid>
              <Field>
                <FieldLabel>
                  <FaUser />
                  Contact Person
                </FieldLabel>
                {isEditing ? (
                  <Input
                    type="text"
                    value={editableData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    placeholder="Enter contact person name"
                  />
                ) : (
                  <FieldValue>{societyData.contactPerson}</FieldValue>
                )}
              </Field>

              <Field>
                <FieldLabel>
                  <FaPhone />
                  Phone Number
                </FieldLabel>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={editableData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <FieldValue>{societyData.contactPhone}</FieldValue>
                )}
              </Field>

              <Field>
                <FieldLabel>
                  <FaEnvelope />
                  Email Address
                </FieldLabel>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editableData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="Enter email address"
                  />
                ) : (
                  <FieldValue>{societyData.contactEmail}</FieldValue>
                )}
              </Field>
            </FieldGrid>
          </Section>

          {/* Documents */}
          <Section>
            <SectionTitle>
              <FaFileAlt />
              Uploaded Documents
            </SectionTitle>
            <DocumentsSection>
              {societyData.documents && societyData.documents.length > 0 ? (
                societyData.documents.map((doc, index) => (
                  <DocumentItem key={index}>
                    <DocumentInfo>
                      <FaFileAlt color="#667eea" />
                      <div>
                        <div style={{ fontWeight: '500' }}>{doc.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>
                          Uploaded on {formatDate(doc.uploadDate)}
                        </div>
                      </div>
                    </DocumentInfo>
                    <DocumentActions>
                      <Button>
                        <FaDownload />
                        Download
                      </Button>
                      {isEditing && (
                        <Button $variant="danger">
                          <FaTrash />
                        </Button>
                      )}
                    </DocumentActions>
                  </DocumentItem>
                ))
              ) : (
                <FieldValue style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>
                  No documents uploaded
                </FieldValue>
              )}
            </DocumentsSection>
          </Section>

          {/* Registration Timeline */}
          <Section>
            <SectionTitle>
              <FaClock />
              Registration Timeline
            </SectionTitle>
            <FieldGrid>
              <Field>
                <FieldLabel>Registration Date</FieldLabel>
                <FieldValue>{formatDate(societyData.registrationDate)}</FieldValue>
              </Field>

              {societyData.approvedDate && (
                <Field>
                  <FieldLabel>Approved Date</FieldLabel>
                  <FieldValue>{formatDate(societyData.approvedDate)}</FieldValue>
                </Field>
              )}

              {societyData.approvedBy && (
                <Field>
                  <FieldLabel>Approved By</FieldLabel>
                  <FieldValue>{societyData.approvedBy}</FieldValue>
                </Field>
              )}

              {societyData.rejectionReason && (
                <Field>
                  <FieldLabel>Rejection Reason</FieldLabel>
                  <FieldValue style={{ color: '#e74c3c' }}>{societyData.rejectionReason}</FieldValue>
                </Field>
              )}
            </FieldGrid>
          </Section>

          {isEditing && (
            <SaveButtonContainer>
              <Button onClick={handleCancel}>
                <FaTimes />
                Cancel
              </Button>
              <Button $variant="success" onClick={handleSave} disabled={isSaving}>
                <FaSave />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </SaveButtonContainer>
          )}
        </ContentBody>
      </ContentContainer>
    </Container>
  );
};

export default SocietyDetailsPage;