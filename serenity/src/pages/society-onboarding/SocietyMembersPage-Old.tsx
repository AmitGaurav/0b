import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  SocietyMember,
  MemberRegistrationForm,
  MemberStats,
  MemberFilter,
  MemberRegistrationStatus,
  MemberVerificationStatus,
  MembershipType,
  MemberRole,
  Permission,
  DocumentType,
  UnitType,
  ParkingType,
  ActivityType,
  CommunicationChannel,
  CommunicationType,
  calculateMemberStats,
  filterMembers,
  hasPermission,
  ROLE_PERMISSIONS,
  DOCUMENT_CONFIG,
  DEFAULT_MEMBER
} from '../../types/member-management';

const Container = styled.div`
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: white;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 32px;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 8px;
    background: linear-gradient(45deg, #ffffff, #f0f0f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    font-size: 1.1rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  h3 {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: #ffd700;
  }
  
  p {
    opacity: 0.9;
    font-size: 0.9rem;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  background: ${props => props.active 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.active 
    ? 'rgba(255, 255, 255, 0.3)' 
    : 'rgba(255, 255, 255, 0.1)'
  };
  font-size: 0.85rem;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ContentContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 500px;
`;

const FilterSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
`;

const SearchInput = styled.input`
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  
  option {
    background: #333;
    color: white;
  }
  
  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' | 'success' }>`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  
  background: ${props => {
    switch (props.variant) {
      case 'primary': return '#4CAF50';
      case 'danger': return '#f44336';
      case 'success': return '#2196F3';
      default: return 'rgba(255, 255, 255, 0.2)';
    }
  }};
  
  color: white;
  
  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const MemberGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const MemberCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`;

const MemberHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  
  .member-info {
    flex: 1;
    
    h3 {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 4px;
    }
    
    .membership-id {
      color: #ffd700;
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .contact-info {
      font-size: 0.9rem;
      opacity: 0.8;
      margin-bottom: 8px;
    }
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  background: ${props => {
    switch (props.status) {
      case 'approved':
      case 'verified': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'rejected': return '#f44336';
      case 'under_review':
      case 'in_progress': return '#2196F3';
      default: return '#9E9E9E';
    }
  }};
`;

const MemberActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 16px;
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow-y: auto;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px;
  border-radius: 20px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin: 20px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: white;
  }
  
  input, select, textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 1rem;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
    
    &:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.15);
    }
    
    option {
      background: #333;
      color: white;
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 80px;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  opacity: 0.7;
  
  h3 {
    margin-bottom: 12px;
    font-size: 1.4rem;
  }
  
  p {
    margin-bottom: 24px;
    font-size: 1.1rem;
  }
`;

type TabType = 'registration' | 'verification' | 'profile' | 'documents' | 'units' | 'parking' | 'roles' | 'activity' | 'family' | 'emergency' | 'communication';

interface SocietyMembersPageProps {}

const SocietyMembersPage: React.FC<SocietyMembersPageProps> = () => {
  const [activeTab, setActiveTab] = useState<TabType>('registration');
  const [members, setMembers] = useState<SocietyMember[]>([]);
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [filter, setFilter] = useState<MemberFilter>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add');
  const [selectedMember, setSelectedMember] = useState<SocietyMember | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [currentUserRole, setCurrentUserRole] = useState<MemberRole>(MemberRole.ADMIN); // Set default role

  // Sample members data for demonstration
  useEffect(() => {
    const sampleMembers: SocietyMember[] = [
      {
        id: '1',
        membershipId: 'MEM-001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+91 98765 43210',
        societyId: 'society-1',
        membershipType: MembershipType.OWNER,
        registrationDate: new Date('2024-01-15'),
        registrationStatus: MemberRegistrationStatus.APPROVED,
        verificationStatus: MemberVerificationStatus.VERIFIED,
        currentAddress: {
          street: 'A-101, Sunrise Apartments',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        },
        emergencyContacts: [],
        documents: [],
        units: [],
        parking: [],
        roles: [MemberRole.RESIDENT],
        permissions: [Permission.VIEW_OWN_DATA, Permission.EDIT_OWN_PROFILE],
        isActive: true,
        createdDate: new Date('2024-01-15'),
        updatedDate: new Date('2024-01-15')
      },
      {
        id: '2',
        membershipId: 'MEM-002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        phone: '+91 98765 43211',
        societyId: 'society-1',
        membershipType: MembershipType.TENANT,
        registrationDate: new Date('2024-02-01'),
        registrationStatus: MemberRegistrationStatus.PENDING,
        verificationStatus: MemberVerificationStatus.PENDING,
        currentAddress: {
          street: 'B-205, Sunrise Apartments',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India'
        },
        emergencyContacts: [],
        documents: [],
        units: [],
        parking: [],
        roles: [MemberRole.RESIDENT],
        permissions: [Permission.VIEW_OWN_DATA, Permission.EDIT_OWN_PROFILE],
        isActive: true,
        createdDate: new Date('2024-02-01'),
        updatedDate: new Date('2024-02-01')
      }
    ];
    
    setMembers(sampleMembers);
  }, []);

  // Calculate stats when members change
  useEffect(() => {
    if (members.length > 0) {
      setStats(calculateMemberStats(members));
    }
  }, [members]);

  // Check permissions
  const canViewAllMembers = hasPermission([currentUserRole], Permission.VIEW_ALL_MEMBERS);
  const canApproveRegistrations = hasPermission([currentUserRole], Permission.APPROVE_REGISTRATIONS);
  const canApproveVerifications = hasPermission([currentUserRole], Permission.APPROVE_VERIFICATIONS);
  const canManageDocuments = hasPermission([currentUserRole], Permission.MANAGE_DOCUMENTS);
  const canManageUnits = hasPermission([currentUserRole], Permission.MANAGE_UNITS);
  const canManageParking = hasPermission([currentUserRole], Permission.MANAGE_PARKING);
  const canAssignRoles = hasPermission([currentUserRole], Permission.ASSIGN_ROLES);
  const canViewActivityLogs = hasPermission([currentUserRole], Permission.VIEW_ACTIVITY_LOGS);
  const canManageFamilyMembers = hasPermission([currentUserRole], Permission.MANAGE_FAMILY_MEMBERS);
  const canManageEmergencyContacts = hasPermission([currentUserRole], Permission.MANAGE_EMERGENCY_CONTACTS);
  const canManageCommunicationPreferences = hasPermission([currentUserRole], Permission.MANAGE_COMMUNICATION_PREFERENCES);

  const filteredMembers = filterMembers(members, filter);

  const handleAddMember = () => {
    setModalMode('add');
    setSelectedMember(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      membershipType: MembershipType.OWNER,
      currentAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      }
    });
    setIsModalOpen(true);
  };

  const handleEditMember = (member: SocietyMember) => {
    setModalMode('edit');
    setSelectedMember(member);
    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      membershipType: member.membershipType,
      currentAddress: member.currentAddress
    });
    setIsModalOpen(true);
  };

  const handleViewMember = (member: SocietyMember) => {
    setModalMode('view');
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleSaveMember = () => {
    if (selectedMember) {
      // Edit existing member
      setMembers(prev => prev.map(m => 
        m.id === selectedMember.id 
          ? { ...m, ...formData, updatedDate: new Date() }
          : m
      ));
    } else {
      // Add new member
      const newMember: SocietyMember = {
        id: `member-${Date.now()}`,
        membershipId: `MEM-${String(members.length + 1).padStart(3, '0')}`,
        ...formData,
        societyId: 'society-1',
        registrationDate: new Date(),
        registrationStatus: MemberRegistrationStatus.PENDING,
        verificationStatus: MemberVerificationStatus.PENDING,
        emergencyContacts: [],
        documents: [],
        units: [],
        parking: [],
        roles: [MemberRole.RESIDENT],
        permissions: [Permission.VIEW_OWN_DATA, Permission.EDIT_OWN_PROFILE],
        isActive: true,
        createdDate: new Date(),
        updatedDate: new Date()
      };
      setMembers(prev => [...prev, newMember]);
    }
    setIsModalOpen(false);
  };

  const handleApproveRegistration = (memberId: string) => {
    setMembers(prev => prev.map(m => 
      m.id === memberId 
        ? { ...m, registrationStatus: MemberRegistrationStatus.APPROVED, updatedDate: new Date() }
        : m
    ));
  };

  const handleRejectRegistration = (memberId: string) => {
    setMembers(prev => prev.map(m => 
      m.id === memberId 
        ? { ...m, registrationStatus: MemberRegistrationStatus.REJECTED, updatedDate: new Date() }
        : m
    ));
  };

  const handleApproveVerification = (memberId: string) => {
    setMembers(prev => prev.map(m => 
      m.id === memberId 
        ? { ...m, verificationStatus: MemberVerificationStatus.VERIFIED, updatedDate: new Date() }
        : m
    ));
  };

  const handleRejectVerification = (memberId: string) => {
    setMembers(prev => prev.map(m => 
      m.id === memberId 
        ? { ...m, verificationStatus: MemberVerificationStatus.REJECTED, updatedDate: new Date() }
        : m
    ));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'registration':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Member Registration</h2>
              {canViewAllMembers && (
                <ActionButton variant="primary" onClick={handleAddMember}>
                  Add New Member
                </ActionButton>
              )}
            </div>

            <FilterSection>
              <SearchInput
                placeholder="Search members by name, ID, or email..."
                value={filter.searchTerm || ''}
                onChange={(e) => setFilter({ ...filter, searchTerm: e.target.value })}
              />
              <Select
                value={filter.registrationStatus?.[0] || ''}
                onChange={(e) => setFilter({ 
                  ...filter, 
                  registrationStatus: e.target.value ? [e.target.value as MemberRegistrationStatus] : []
                })}
              >
                <option value="">All Registration Status</option>
                <option value={MemberRegistrationStatus.PENDING}>Pending</option>
                <option value={MemberRegistrationStatus.APPROVED}>Approved</option>
                <option value={MemberRegistrationStatus.REJECTED}>Rejected</option>
                <option value={MemberRegistrationStatus.UNDER_REVIEW}>Under Review</option>
              </Select>
              <Select
                value={filter.membershipType?.[0] || ''}
                onChange={(e) => setFilter({ 
                  ...filter, 
                  membershipType: e.target.value ? [e.target.value as MembershipType] : []
                })}
              >
                <option value="">All Member Types</option>
                <option value={MembershipType.OWNER}>Owner</option>
                <option value={MembershipType.TENANT}>Tenant</option>
                <option value={MembershipType.RELATIVE}>Relative</option>
                <option value={MembershipType.CARETAKER}>Caretaker</option>
              </Select>
            </FilterSection>

            {filteredMembers.length === 0 ? (
              <EmptyState>
                <h3>No Members Found</h3>
                <p>Start by registering the first member for your society</p>
                <ActionButton variant="primary" onClick={handleAddMember}>
                  Register First Member
                </ActionButton>
              </EmptyState>
            ) : (
              <MemberGrid>
                {filteredMembers.map(member => (
                  <MemberCard key={member.id}>
                    <MemberHeader>
                      <div className="member-info">
                        <h3>{member.firstName} {member.lastName}</h3>
                        <div className="membership-id">ID: {member.membershipId}</div>
                        <div className="contact-info">{member.email}</div>
                        <div className="contact-info">{member.phone}</div>
                        <div style={{ marginTop: '8px' }}>
                          <StatusBadge status={member.registrationStatus}>
                            {member.registrationStatus}
                          </StatusBadge>
                          <span style={{ margin: '0 8px' }}>•</span>
                          <StatusBadge status={member.verificationStatus}>
                            {member.verificationStatus}
                          </StatusBadge>
                        </div>
                      </div>
                    </MemberHeader>

                    <MemberActions>
                      <ActionButton onClick={() => handleViewMember(member)}>
                        View Details
                      </ActionButton>
                      {canViewAllMembers && (
                        <ActionButton onClick={() => handleEditMember(member)}>
                          Edit
                        </ActionButton>
                      )}
                      {canApproveRegistrations && member.registrationStatus === MemberRegistrationStatus.PENDING && (
                        <>
                          <ActionButton 
                            variant="success" 
                            onClick={() => handleApproveRegistration(member.id)}
                          >
                            Approve
                          </ActionButton>
                          <ActionButton 
                            variant="danger" 
                            onClick={() => handleRejectRegistration(member.id)}
                          >
                            Reject
                          </ActionButton>
                        </>
                      )}
                    </MemberActions>
                  </MemberCard>
                ))}
              </MemberGrid>
            )}
          </div>
        );

      case 'verification':
        return (
          <div>
            <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Member Verification</h2>
            {canApproveVerifications ? (
              <div>
                {filteredMembers.filter(m => m.verificationStatus === MemberVerificationStatus.PENDING).map(member => (
                  <MemberCard key={member.id} style={{ marginBottom: '16px' }}>
                    <MemberHeader>
                      <div className="member-info">
                        <h3>{member.firstName} {member.lastName}</h3>
                        <div className="membership-id">ID: {member.membershipId}</div>
                        <StatusBadge status={member.verificationStatus}>
                          {member.verificationStatus}
                        </StatusBadge>
                      </div>
                    </MemberHeader>
                    <MemberActions>
                      <ActionButton onClick={() => handleViewMember(member)}>
                        View Documents
                      </ActionButton>
                      <ActionButton 
                        variant="success" 
                        onClick={() => handleApproveVerification(member.id)}
                      >
                        Verify
                      </ActionButton>
                      <ActionButton 
                        variant="danger" 
                        onClick={() => handleRejectVerification(member.id)}
                      >
                        Reject
                      </ActionButton>
                    </MemberActions>
                  </MemberCard>
                ))}
              </div>
            ) : (
              <p style={{ opacity: 0.7 }}>You can only view your own verification status.</p>
            )}
          </div>
        );

      case 'profile':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Member Profile Management</h2>
            </div>

            {canViewAllMembers ? (
              <MemberGrid>
                {filteredMembers.map(member => (
                  <MemberCard key={member.id}>
                    <MemberHeader>
                      <div className="member-info">
                        <h3>{member.firstName} {member.lastName}</h3>
                        <div className="membership-id">ID: {member.membershipId}</div>
                        <div className="contact-info">{member.email}</div>
                        <div className="contact-info">{member.phone}</div>
                        <div style={{ marginTop: '8px' }}>
                          <StatusBadge status={member.isActive ? 'active' : 'inactive'}>
                            {member.isActive ? 'Active' : 'Inactive'}
                          </StatusBadge>
                        </div>
                      </div>
                    </MemberHeader>

                    <MemberActions>
                      <ActionButton onClick={() => handleViewMember(member)}>
                        View Profile
                      </ActionButton>
                      <ActionButton onClick={() => handleEditMember(member)}>
                        Edit Profile
                      </ActionButton>
                      <ActionButton 
                        variant={member.isActive ? 'danger' : 'success'}
                        onClick={() => {
                          setMembers(prev => prev.map(m => 
                            m.id === member.id 
                              ? { ...m, isActive: !m.isActive, updatedDate: new Date() }
                              : m
                          ));
                        }}
                      >
                        {member.isActive ? 'Deactivate' : 'Activate'}
                      </ActionButton>
                    </MemberActions>
                  </MemberCard>
                ))}
              </MemberGrid>
            ) : (
              <div>
                <p style={{ opacity: 0.7, marginBottom: '16px' }}>You can only view and edit your own profile.</p>
                {/* Show current user's profile */}
                <MemberCard>
                  <MemberHeader>
                    <div className="member-info">
                      <h3>Your Profile</h3>
                      <div className="contact-info">View and edit your member profile information</div>
                    </div>
                  </MemberHeader>
                  <MemberActions>
                    <ActionButton variant="primary" onClick={handleAddMember}>
                      Edit My Profile
                    </ActionButton>
                  </MemberActions>
                </MemberCard>
              </div>
            )}
          </div>
        );

      case 'documents':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Member Documents</h2>
              {canManageDocuments && (
                <ActionButton variant="primary" onClick={() => {
                  setModalMode('add');
                  setFormData({ documentType: '', file: null });
                  setIsModalOpen(true);
                }}>
                  Upload Document
                </ActionButton>
              )}
            </div>

            {canManageDocuments ? (
              <div>
                {filteredMembers.map(member => (
                  <MemberCard key={member.id} style={{ marginBottom: '16px' }}>
                    <MemberHeader>
                      <div className="member-info">
                        <h3>{member.firstName} {member.lastName}</h3>
                        <div className="membership-id">Documents: {member.documents.length}</div>
                      </div>
                    </MemberHeader>
                    <div style={{ marginTop: '12px' }}>
                      {member.documents.length === 0 ? (
                        <p style={{ opacity: 0.7, fontStyle: 'italic' }}>No documents uploaded</p>
                      ) : (
                        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                          Identity Proof, Address Proof, Ownership Documents
                        </div>
                      )}
                    </div>
                    <MemberActions>
                      <ActionButton onClick={() => handleViewMember(member)}>
                        View Documents
                      </ActionButton>
                      <ActionButton onClick={() => {
                        setSelectedMember(member);
                        setModalMode('add');
                        setFormData({ documentType: '', file: null });
                        setIsModalOpen(true);
                      }}>
                        Add Document
                      </ActionButton>
                    </MemberActions>
                  </MemberCard>
                ))}
              </div>
            ) : (
              <div>
                <p style={{ opacity: 0.7, marginBottom: '16px' }}>You can only view your own documents.</p>
                <MemberCard>
                  <MemberHeader>
                    <div className="member-info">
                      <h3>Your Documents</h3>
                      <div className="contact-info">View your uploaded documents</div>
                    </div>
                  </MemberHeader>
                  <MemberActions>
                    <ActionButton variant="primary">
                      View My Documents
                    </ActionButton>
                  </MemberActions>
                </MemberCard>
              </div>
            )}
          </div>
        );

      case 'units':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Member Units</h2>
              {canManageUnits && (
                <ActionButton variant="primary" onClick={() => {
                  setModalMode('add');
                  setFormData({ 
                    unitNumber: '', 
                    floor: 1, 
                    type: 'residential', 
                    area: 0,
                    monthlyMaintenance: 0 
                  });
                  setIsModalOpen(true);
                }}>
                  Add Unit
                </ActionButton>
              )}
            </div>

            {canManageUnits ? (
              <div>
                {filteredMembers.map(member => (
                  <MemberCard key={member.id} style={{ marginBottom: '16px' }}>
                    <MemberHeader>
                      <div className="member-info">
                        <h3>{member.firstName} {member.lastName}</h3>
                        <div className="membership-id">Units: {member.units.length}</div>
                        <div className="contact-info">
                          {member.units.map(unit => unit.unitNumber).join(', ') || 'No units assigned'}
                        </div>
                      </div>
                    </MemberHeader>
                    <MemberActions>
                      <ActionButton onClick={() => handleViewMember(member)}>
                        View Units
                      </ActionButton>
                      <ActionButton onClick={() => {
                        setSelectedMember(member);
                        setModalMode('add');
                        setFormData({ 
                          unitNumber: '', 
                          floor: 1, 
                          type: 'residential', 
                          area: 0,
                          monthlyMaintenance: 0 
                        });
                        setIsModalOpen(true);
                      }}>
                        Assign Unit
                      </ActionButton>
                    </MemberActions>
                  </MemberCard>
                ))}
              </div>
            ) : (
              <div>
                <p style={{ opacity: 0.7, marginBottom: '16px' }}>You can only view your own unit details.</p>
                <MemberCard>
                  <MemberHeader>
                    <div className="member-info">
                      <h3>Your Units</h3>
                      <div className="contact-info">View your assigned units</div>
                    </div>
                  </MemberHeader>
                  <MemberActions>
                    <ActionButton variant="primary">
                      View My Units
                    </ActionButton>
                  </MemberActions>
                </MemberCard>
              </div>
            )}
          </div>
        );

      case 'parking':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Member Parking</h2>
              {canManageParking && (
                <ActionButton variant="primary" onClick={() => {
                  setModalMode('add');
                  setFormData({ 
                    slotNumber: '', 
                    type: 'covered', 
                    location: '',
                    vehicleType: 'car',
                    monthlyCharge: 0 
                  });
                  setIsModalOpen(true);
                }}>
                  Assign Parking
                </ActionButton>
              )}
            </div>

            {canManageParking ? (
              <div>
                {filteredMembers.map(member => (
                  <MemberCard key={member.id} style={{ marginBottom: '16px' }}>
                    <MemberHeader>
                      <div className="member-info">
                        <h3>{member.firstName} {member.lastName}</h3>
                        <div className="membership-id">Parking Slots: {member.parking.length}</div>
                        <div className="contact-info">
                          {member.parking.map(parking => parking.slotNumber).join(', ') || 'No parking assigned'}
                        </div>
                      </div>
                    </MemberHeader>
                    <MemberActions>
                      <ActionButton onClick={() => handleViewMember(member)}>
                        View Parking
                      </ActionButton>
                      <ActionButton onClick={() => {
                        setSelectedMember(member);
                        setModalMode('add');
                        setFormData({ 
                          slotNumber: '', 
                          type: 'covered', 
                          location: '',
                          vehicleType: 'car',
                          monthlyCharge: 0 
                        });
                        setIsModalOpen(true);
                      }}>
                        Assign Parking
                      </ActionButton>
                    </MemberActions>
                  </MemberCard>
                ))}
              </div>
            ) : (
              <div>
                <p style={{ opacity: 0.7, marginBottom: '16px' }}>You can only view your own parking details.</p>
                <MemberCard>
                  <MemberHeader>
                    <div className="member-info">
                      <h3>Your Parking</h3>
                      <div className="contact-info">View your assigned parking slots</div>
                    </div>
                  </MemberHeader>
                  <MemberActions>
                    <ActionButton variant="primary">
                      View My Parking
                    </ActionButton>
                  </MemberActions>
                </MemberCard>
              </div>
            )}
          </div>
        );

      case 'roles':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Member Roles and Permissions</h2>
            </div>

            {canAssignRoles ? (
              <div>
                {filteredMembers.map(member => (
                  <MemberCard key={member.id} style={{ marginBottom: '16px' }}>
                    <MemberHeader>
                      <div className="member-info">
                        <h3>{member.firstName} {member.lastName}</h3>
                        <div className="membership-id">
                          Roles: {member.roles.map(role => role.replace('_', ' ').toUpperCase()).join(', ')}
                        </div>
                        <div className="contact-info">
                          Permissions: {member.permissions.length} active permissions
                        </div>
                      </div>
                    </MemberHeader>
                    <MemberActions>
                      <ActionButton onClick={() => handleViewMember(member)}>
                        View Permissions
                      </ActionButton>
                      <ActionButton onClick={() => {
                        setSelectedMember(member);
                        setModalMode('edit');
                        setFormData({ roles: member.roles });
                        setIsModalOpen(true);
                      }}>
                        Manage Roles
                      </ActionButton>
                    </MemberActions>
                  </MemberCard>
                ))}
              </div>
            ) : (
              <div>
                <p style={{ opacity: 0.7, marginBottom: '16px' }}>You can only view your own roles and permissions.</p>
                <MemberCard>
                  <MemberHeader>
                    <div className="member-info">
                      <h3>Your Roles & Permissions</h3>
                      <div className="contact-info">View your assigned roles and permissions</div>
                    </div>
                  </MemberHeader>
                  <MemberActions>
                    <ActionButton variant="primary">
                      View My Permissions
                    </ActionButton>
                  </MemberActions>
                </MemberCard>
              </div>
            )}
          </div>
        );

      case 'activity':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Member Activity Log</h2>
            </div>

            {canViewActivityLogs ? (
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <Select
                    value={filter.searchTerm || ''}
                    onChange={(e) => setFilter({ ...filter, searchTerm: e.target.value })}
                    style={{ width: '100%', maxWidth: '300px' }}
                  >
                    <option value="">All Activities</option>
                    <option value="login">Login Activities</option>
                    <option value="registration">Registration Activities</option>
                    <option value="profile_update">Profile Updates</option>
                    <option value="document_upload">Document Uploads</option>
                  </Select>
                </div>

                {/* Activity Log Entries */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <MemberCard>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>John Doe - Profile Updated</div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                          Updated contact information and address details
                        </div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '4px' }}>
                          September 20, 2025 at 10:30 AM
                        </div>
                      </div>
                      <StatusBadge status="profile_update">UPDATE</StatusBadge>
                    </div>
                  </MemberCard>

                  <MemberCard>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>Jane Smith - Document Uploaded</div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                          Uploaded identity proof document for verification
                        </div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '4px' }}>
                          September 20, 2025 at 9:15 AM
                        </div>
                      </div>
                      <StatusBadge status="document_upload">UPLOAD</StatusBadge>
                    </div>
                  </MemberCard>

                  <MemberCard>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>Mike Wilson - Registration Approved</div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                          Member registration approved by admin
                        </div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '4px' }}>
                          September 19, 2025 at 4:20 PM
                        </div>
                      </div>
                      <StatusBadge status="approved">APPROVED</StatusBadge>
                    </div>
                  </MemberCard>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ opacity: 0.7, marginBottom: '16px' }}>You can only view your own activity log.</p>
                <MemberCard>
                  <MemberHeader>
                    <div className="member-info">
                      <h3>Your Activity Log</h3>
                      <div className="contact-info">View your recent activities and changes</div>
                    </div>
                  </MemberHeader>
                  <MemberActions>
                    <ActionButton variant="primary">
                      View My Activity
                    </ActionButton>
                  </MemberActions>
                </MemberCard>
              </div>
            )}
          </div>
        );

      case 'family':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Family Members Management</h2>
              {canManageFamilyMembers && (
                <ActionButton variant="primary" onClick={() => setModalMode('add')}>
                  + Add Family Member
                </ActionButton>
              )}
            </div>

            {canManageFamilyMembers ? (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    <StatCard>
                      <h3>{members.reduce((acc, member) => acc + (member.familyMembers?.length || 0), 0)}</h3>
                      <p>Total Family Members</p>
                    </StatCard>
                    <StatCard>
                      <h3>{members.filter(m => m.familyMembers?.length).length}</h3>
                      <p>Members with Family</p>
                    </StatCard>
                    <StatCard>
                      <h3>{Math.round(members.reduce((acc, member) => acc + (member.familyMembers?.length || 0), 0) / Math.max(members.length, 1) * 100) / 100}</h3>
                      <p>Avg Family Size</p>
                    </StatCard>
                  </div>
                </div>

                <FilterSection>
                  <SearchInput
                    type="text"
                    placeholder="Search by member name or family member name..."
                    value={filter.searchQuery || ''}
                    onChange={(e) => setFilter({...filter, searchQuery: e.target.value})}
                  />
                  <Select 
                    value={filter.relationship || ''}
                    onChange={(e) => setFilter({...filter, relationship: e.target.value})}
                  >
                    <option value="">All Relationships</option>
                    <option value="spouse">Spouse</option>
                    <option value="child">Child</option>
                    <option value="parent">Parent</option>
                    <option value="sibling">Sibling</option>
                    <option value="other">Other</option>
                  </Select>
                </FilterSection>

                {filteredMembers.filter(member => member.familyMembers?.length).length === 0 ? (
                  <EmptyState>
                    <h3>No Family Members Found</h3>
                    <p>No members have registered family members yet.</p>
                    <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                      Family members can be added from individual member profiles.
                    </p>
                  </EmptyState>
                ) : (
                  <MemberGrid>
                    {filteredMembers
                      .filter(member => member.familyMembers?.length)
                      .flatMap(member => 
                        member.familyMembers?.map((family, index) => (
                          <MemberCard key={`${member.id}-${index}`}>
                            <MemberHeader>
                              <div className="member-info">
                                <h3>{family.name}</h3>
                                <div className="membership-id">Primary: {member.firstName} {member.lastName}</div>
                                <div className="contact-info">Relationship: {family.relationship}</div>
                                <div className="contact-info">
                                  {family.age ? `Age: ${family.age} years` : 'Age not specified'}
                                </div>
                                <div className="contact-info">
                                  {family.phone || 'No contact provided'}
                                </div>
                              </div>
                            </MemberHeader>
                            <MemberActions>
                              <ActionButton onClick={() => {
                                alert(`Edit family member: ${family.name}`);
                              }}>
                                Edit Details
                              </ActionButton>
                              <ActionButton variant="danger" onClick={() => {
                                alert(`Remove family member: ${family.name}`);
                              }}>
                                Remove
                              </ActionButton>
                            </MemberActions>
                          </MemberCard>
                        )) || []
                      )}
                  </MemberGrid>
                )}
              </div>
            ) : (
              <EmptyState>
                <h3>Access Restricted</h3>
                <p>You don't have permission to manage family members.</p>
              </EmptyState>
            )}
          </div>
        );

      case 'emergency':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Emergency Contacts Management</h2>
              {canManageEmergencyContacts && (
                <ActionButton variant="primary" onClick={() => setModalMode('add')}>
                  + Add Emergency Contact
                </ActionButton>
              )}
            </div>

            {canManageEmergencyContacts ? (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    <StatCard>
                      <h3>{members.reduce((acc, member) => acc + (member.emergencyContacts?.length || 0), 0)}</h3>
                      <p>Total Emergency Contacts</p>
                    </StatCard>
                    <StatCard>
                      <h3>{members.filter(m => m.emergencyContacts?.length).length}</h3>
                      <p>Members with Contacts</p>
                    </StatCard>
                    <StatCard>
                      <h3>{members.filter(m => !m.emergencyContacts?.length).length}</h3>
                      <p>Missing Emergency Contacts</p>
                      <div style={{ fontSize: '0.8rem', color: '#ff6b6b', marginTop: '4px' }}>
                        Requires attention
                      </div>
                    </StatCard>
                  </div>
                </div>

                <FilterSection>
                  <SearchInput
                    type="text"
                    placeholder="Search by member name or contact name..."
                    value={filter.searchQuery || ''}
                    onChange={(e) => setFilter({...filter, searchQuery: e.target.value})}
                  />
                  <Select 
                    value={filter.relationship || ''}
                    onChange={(e) => setFilter({...filter, relationship: e.target.value})}
                  >
                    <option value="">All Relationships</option>
                    <option value="family">Family Member</option>
                    <option value="friend">Friend</option>
                    <option value="neighbor">Neighbor</option>
                    <option value="colleague">Colleague</option>
                    <option value="doctor">Doctor</option>
                    <option value="other">Other</option>
                  </Select>
                </FilterSection>

                {filteredMembers.filter(member => member.emergencyContacts?.length).length === 0 ? (
                  <EmptyState>
                    <h3>No Emergency Contacts Found</h3>
                    <p>No emergency contacts have been registered yet.</p>
                    <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                      Emergency contacts are crucial for member safety and security.
                    </p>
                  </EmptyState>
                ) : (
                  <MemberGrid>
                    {filteredMembers
                      .filter(member => member.emergencyContacts?.length)
                      .flatMap(member => 
                        member.emergencyContacts?.map((contact, index) => (
                          <MemberCard key={`${member.id}-${index}`}>
                            <MemberHeader>
                              <div className="member-info">
                                <h3>{contact.name}</h3>
                                <div className="membership-id">
                                  Contact for: {member.firstName} {member.lastName}
                                </div>
                                <div className="contact-info">Relationship: {contact.relationship}</div>
                                <div className="contact-info">
                                  <a href={`tel:${contact.phone}`} style={{ color: '#4CAF50', textDecoration: 'none' }}>
                                    📞 {contact.phone}
                                  </a>
                                </div>
                                {contact.email && (
                                  <div className="contact-info">
                                    <a href={`mailto:${contact.email}`} style={{ color: '#4CAF50', textDecoration: 'none' }}>
                                      ✉️ {contact.email}
                                    </a>
                                  </div>
                                )}
                              </div>
                            </MemberHeader>
                            <MemberActions>
                              <ActionButton onClick={() => {
                                alert(`Edit contact: ${contact.name}`);
                              }}>
                                Edit Contact
                              </ActionButton>
                              <ActionButton variant="danger" onClick={() => {
                                alert(`Remove contact: ${contact.name}`);
                              }}>
                                Remove
                              </ActionButton>
                            </MemberActions>
                          </MemberCard>
                        )) || []
                      )}
                  </MemberGrid>
                )}

                {/* Show members without emergency contacts */}
                {members.filter(m => !m.emergencyContacts?.length).length > 0 && (
                  <div style={{ marginTop: '32px' }}>
                    <h3 style={{ color: '#ff6b6b', marginBottom: '16px' }}>
                      ⚠️ Members Missing Emergency Contacts ({members.filter(m => !m.emergencyContacts?.length).length})
                    </h3>
                    <MemberGrid>
                      {members.filter(m => !m.emergencyContacts?.length).slice(0, 6).map(member => (
                        <MemberCard key={`missing-${member.id}`} style={{ border: '1px solid rgba(255, 107, 107, 0.3)' }}>
                          <MemberHeader>
                            <div className="member-info">
                              <h3>{member.firstName} {member.lastName}</h3>
                              <div className="contact-info">{member.email}</div>
                              <div style={{ color: '#ff6b6b', fontSize: '0.9rem', marginTop: '8px' }}>
                                No emergency contacts
                              </div>
                            </div>
                          </MemberHeader>
                          <MemberActions>
                            <ActionButton variant="primary" onClick={() => {
                              alert(`Add emergency contact for ${member.firstName}`);
                            }}>
                              Add Contact
                            </ActionButton>
                          </MemberActions>
                        </MemberCard>
                      ))}
                    </MemberGrid>
                  </div>
                )}
              </div>
            ) : (
              <EmptyState>
                <h3>Access Restricted</h3>
                <p>You don't have permission to manage emergency contacts.</p>
              </EmptyState>
            )}
          </div>
        );

      case 'communication':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Communication Preferences</h2>
              {canManageCommunicationPreferences && (
                <ActionButton variant="primary" onClick={() => setModalMode('add')}>
                  📢 Bulk Update Preferences
                </ActionButton>
              )}
            </div>

            {canManageCommunicationPreferences ? (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                    <StatCard>
                      <h3>{members.filter(m => m.communicationSettings?.preferences?.some(p => p.preferredChannels.includes(CommunicationChannel.EMAIL))).length}</h3>
                      <p>Email Enabled</p>
                    </StatCard>
                    <StatCard>
                      <h3>{members.filter(m => m.communicationSettings?.preferences?.some(p => p.preferredChannels.includes(CommunicationChannel.SMS))).length}</h3>
                      <p>SMS Enabled</p>
                    </StatCard>
                    <StatCard>
                      <h3>{members.filter(m => m.communicationSettings?.preferences?.some(p => p.preferredChannels.includes(CommunicationChannel.WHATSAPP))).length}</h3>
                      <p>WhatsApp Enabled</p>
                    </StatCard>
                  </div>
                </div>

                <FilterSection>
                  <SearchInput
                    type="text"
                    placeholder="Search by member name or email..."
                    value={filter.searchQuery || ''}
                    onChange={(e) => setFilter({...filter, searchQuery: e.target.value})}
                  />
                  <Select 
                    value={filter.communicationChannel || ''}
                    onChange={(e) => setFilter({...filter, communicationChannel: e.target.value})}
                  >
                    <option value="">All Channels</option>
                    <option value="email">Email Only</option>
                    <option value="sms">SMS Only</option>
                    <option value="whatsapp">WhatsApp Only</option>
                    <option value="phone">Phone Only</option>
                    <option value="inapp">In-App Only</option>
                    <option value="none">No Preferences Set</option>
                  </Select>
                </FilterSection>

                {filteredMembers.length === 0 ? (
                  <EmptyState>
                    <h3>No Members Found</h3>
                    <p>No members to display communication preferences for.</p>
                  </EmptyState>
                ) : (
                  <MemberGrid>
                    {filteredMembers
                      .filter(member => 
                        !filter.searchQuery || 
                        `${member.firstName} ${member.lastName}`.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
                        member.email.toLowerCase().includes(filter.searchQuery.toLowerCase())
                      )
                      .map((member) => {
                        const settings = member.communicationSettings;
                        const emailEnabled = settings?.preferences?.some(p => p.preferredChannels.includes(CommunicationChannel.EMAIL) && p.isEnabled);
                        const smsEnabled = settings?.preferences?.some(p => p.preferredChannels.includes(CommunicationChannel.SMS) && p.isEnabled);
                        const whatsappEnabled = settings?.preferences?.some(p => p.preferredChannels.includes(CommunicationChannel.WHATSAPP) && p.isEnabled);
                        
                        return (
                          <MemberCard key={member.id}>
                            <MemberHeader>
                              <div className="member-info">
                                <h3>{member.firstName} {member.lastName}</h3>
                                <div className="contact-info">{member.email}</div>
                                <div className="contact-info">{member.phone}</div>
                                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                  <span style={{ 
                                    padding: '4px 8px', 
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    background: emailEnabled ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                                    color: emailEnabled ? '#4CAF50' : '#f44336'
                                  }}>
                                    ✉️ Email {emailEnabled ? '✓' : '✗'}
                                  </span>
                                  <span style={{ 
                                    padding: '4px 8px', 
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    background: smsEnabled ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                                    color: smsEnabled ? '#4CAF50' : '#f44336'
                                  }}>
                                    📱 SMS {smsEnabled ? '✓' : '✗'}
                                  </span>
                                  <span style={{ 
                                    padding: '4px 8px', 
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    background: whatsappEnabled ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                                    color: whatsappEnabled ? '#4CAF50' : '#f44336'
                                  }}>
                                    💬 WhatsApp {whatsappEnabled ? '✓' : '✗'}
                                  </span>
                                </div>
                              </div>
                            </MemberHeader>
                            <MemberActions>
                              <ActionButton onClick={() => {
                                alert(`Edit preferences for ${member.firstName}`);
                              }}>
                                Edit Preferences
                              </ActionButton>
                            </MemberActions>
                          </MemberCard>
                        );
                      })}
                  </MemberGrid>
                )}
              </div>
            ) : (
              <EmptyState>
                <h3>Access Restricted</h3>
                <p>You don't have permission to manage communication preferences.</p>
              </EmptyState>
            )}
          </div>
        );

      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <Container>
      <Header>
        <h1>Society Members</h1>
        <p>Comprehensive member management system for society administration</p>
      </Header>

      {stats && (
        <StatsContainer>
          <StatCard>
            <h3>{stats.totalMembers}</h3>
            <p>Total Members</p>
          </StatCard>
          <StatCard>
            <h3>{stats.activeMembers}</h3>
            <p>Active Members</p>
          </StatCard>
          <StatCard>
            <h3>{stats.pendingRegistrations}</h3>
            <p>Pending Registrations</p>
          </StatCard>
          <StatCard>
            <h3>{stats.pendingVerifications}</h3>
            <p>Pending Verifications</p>
          </StatCard>
          <StatCard>
            <h3>{stats.verifiedMembers}</h3>
            <p>Verified Members</p>
          </StatCard>
          <StatCard>
            <h3>{stats.ownerMembers}</h3>
            <p>Owners</p>
          </StatCard>
          <StatCard>
            <h3>{stats.tenantMembers}</h3>
            <p>Tenants</p>
          </StatCard>
        </StatsContainer>
      )}

      <TabContainer>
        <Tab 
          active={activeTab === 'registration'} 
          onClick={() => setActiveTab('registration')}
        >
          Registration
        </Tab>
        <Tab 
          active={activeTab === 'verification'} 
          onClick={() => setActiveTab('verification')}
          disabled={!canApproveVerifications}
        >
          Verification
        </Tab>
        <Tab 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </Tab>
        <Tab 
          active={activeTab === 'documents'} 
          onClick={() => setActiveTab('documents')}
          disabled={!canManageDocuments}
        >
          Documents
        </Tab>
        <Tab 
          active={activeTab === 'units'} 
          onClick={() => setActiveTab('units')}
          disabled={!canManageUnits}
        >
          Units
        </Tab>
        <Tab 
          active={activeTab === 'parking'} 
          onClick={() => setActiveTab('parking')}
          disabled={!canManageParking}
        >
          Parking
        </Tab>
        <Tab 
          active={activeTab === 'roles'} 
          onClick={() => setActiveTab('roles')}
          disabled={!canAssignRoles}
        >
          Roles
        </Tab>
        <Tab 
          active={activeTab === 'activity'} 
          onClick={() => setActiveTab('activity')}
          disabled={!canViewActivityLogs}
        >
          Activity Log
        </Tab>
        <Tab 
          active={activeTab === 'family'} 
          onClick={() => setActiveTab('family')}
          disabled={!canManageFamilyMembers}
        >
          Family Members
        </Tab>
        <Tab 
          active={activeTab === 'emergency'} 
          onClick={() => setActiveTab('emergency')}
          disabled={!canManageEmergencyContacts}
        >
          Emergency Contacts
        </Tab>
        <Tab 
          active={activeTab === 'communication'} 
          onClick={() => setActiveTab('communication')}
          disabled={!canManageCommunicationPreferences}
        >
          Communication
        </Tab>
      </TabContainer>

      <ContentContainer>
        {renderTabContent()}
      </ContentContainer>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>
            {modalMode === 'add' ? 'Add New Member' : 
             modalMode === 'edit' ? 'Edit Member' : 'Member Details'}
          </h2>

          {modalMode === 'view' && selectedMember ? (
            <div>
              <FormGrid>
                <div>
                  <label>Name</label>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                    {selectedMember.firstName} {selectedMember.lastName}
                  </div>
                </div>
                <div>
                  <label>Membership ID</label>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                    {selectedMember.membershipId}
                  </div>
                </div>
                <div>
                  <label>Email</label>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                    {selectedMember.email}
                  </div>
                </div>
                <div>
                  <label>Phone</label>
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                    {selectedMember.phone}
                  </div>
                </div>
              </FormGrid>
            </div>
          ) : (
            <FormGrid>
              <FormGroup>
                <label>First Name</label>
                <input
                  type="text"
                  value={formData.firstName || ''}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="Enter first name"
                  disabled={modalMode === 'view'}
                />
              </FormGroup>

              <FormGroup>
                <label>Last Name</label>
                <input
                  type="text"
                  value={formData.lastName || ''}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Enter last name"
                  disabled={modalMode === 'view'}
                />
              </FormGroup>

              <FormGroup>
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  disabled={modalMode === 'view'}
                />
              </FormGroup>

              <FormGroup>
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  disabled={modalMode === 'view'}
                />
              </FormGroup>

              <FormGroup>
                <label>Membership Type</label>
                <select
                  value={formData.membershipType || MembershipType.OWNER}
                  onChange={(e) => setFormData({ ...formData, membershipType: e.target.value as MembershipType })}
                  disabled={modalMode === 'view'}
                >
                  <option value={MembershipType.OWNER}>Owner</option>
                  <option value={MembershipType.TENANT}>Tenant</option>
                  <option value={MembershipType.RELATIVE}>Relative</option>
                  <option value={MembershipType.CARETAKER}>Caretaker</option>
                  <option value={MembershipType.TEMPORARY}>Temporary</option>
                </select>
              </FormGroup>

              <FormGroup>
                <label>Address</label>
                <textarea
                  value={formData.currentAddress?.street || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    currentAddress: { 
                      ...formData.currentAddress, 
                      street: e.target.value 
                    }
                  })}
                  placeholder="Enter complete address"
                  disabled={modalMode === 'view'}
                />
              </FormGroup>
            </FormGrid>
          )}

          <ModalActions>
            <ActionButton onClick={() => setIsModalOpen(false)}>
              {modalMode === 'view' ? 'Close' : 'Cancel'}
            </ActionButton>
            {modalMode !== 'view' && (
              <ActionButton variant="primary" onClick={handleSaveMember}>
                {modalMode === 'add' ? 'Add Member' : 'Update Member'}
              </ActionButton>
            )}
          </ModalActions>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default SocietyMembersPage;