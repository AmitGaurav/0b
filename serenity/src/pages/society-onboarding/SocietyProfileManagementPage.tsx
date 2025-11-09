import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  Committee, 
  CommitteeMember, 
  SocietyProfile, 
  CommitteeType, 
  MemberRole, 
  CommitteeMemberStatus,
  CommitteeStats,
  COMMITTEE_CONFIG,
  ROLE_CONFIG,
  DEFAULT_COMMITTEES,
  calculateCommitteeStats
} from '../../types/committee-management';
import {
  PageContainer,
  PageHeader,
  PageTitle,
  PageSubtitle,
  ContentCard,
  StatsGrid,
  ContentGrid,
  Button
} from '../../components/common/PageLayout';

// Remove purple background, use clean white/gray theme
const Container = styled(PageContainer)`
  background: ${({ theme }) => theme.colors.gray[50]};
  min-height: 100vh;
`;

const Header = styled(PageHeader)`
  text-align: center;
  
  h1 {
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
  
  p {
    color: ${({ theme }) => theme.colors.gray[600]};
    max-width: 600px;
    margin: 0 auto;
  }
`;

// Custom StatCard for committee stats
const CommitteeStatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  text-align: center;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    box-shadow: ${({ theme }) => theme.boxShadow.md};
    transform: translateY(-2px);
  }
  
  h3 {
    font-size: 2rem;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.primary[600]};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }
  
  p {
    color: ${({ theme }) => theme.colors.gray[600]};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const Tab = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  color: ${props => props.active 
    ? props.theme.colors.primary[600] 
    : props.theme.colors.gray[600]
  };
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};
  border-bottom-color: ${props => props.active 
    ? props.theme.colors.primary[600] 
    : 'transparent'
  };
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
    background: ${({ theme }) => theme.colors.gray[50]};
  }
`;

const ContentContainer = styled(ContentCard)`
  min-height: 500px;
  padding: ${({ theme }) => theme.spacing[8]};
`;

const CommitteeGrid = styled(ContentGrid)`
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
`;

const CommitteeCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover {
    box-shadow: ${({ theme }) => theme.boxShadow.md};
    transform: translateY(-2px);
    border-color: ${({ theme }) => theme.colors.primary[200]};
  }
`;

const CommitteeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  
  .committee-info {
    flex: 1;
    
    h3 {
      font-size: ${({ theme }) => theme.typography.fontSize.xl};
      font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
      color: ${({ theme }) => theme.colors.gray[900]};
      margin-bottom: ${({ theme }) => theme.spacing[1]};
    }
    
    p {
      color: ${({ theme }) => theme.colors.gray[600]};
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
      line-height: 1.5;
    }
  }
`;

const CommitteeActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-left: ${({ theme }) => theme.spacing[4]};
`;

const ActionButton = styled(Button)<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  ${props => {
    if (props.variant === 'danger') {
      return `
        background: ${props.theme.colors.error[500]};
        border-color: ${props.theme.colors.error[500]};
        color: ${props.theme.colors.white};
        
        &:hover {
          background: ${props.theme.colors.error[600]};
          border-color: ${props.theme.colors.error[600]};
        }
      `;
    }
  }}
`;

const MembersList = styled.div`
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const MemberItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: ${({ theme }) => theme.transition.colors};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]};
    border-color: ${({ theme }) => theme.colors.primary[200]};
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .member-info {
    flex: 1;
    
    .name {
      font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
      color: ${({ theme }) => theme.colors.gray[900]};
      margin-bottom: ${({ theme }) => theme.spacing[1]};
    }
    
    .role {
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
      color: ${({ theme }) => theme.colors.gray[600]};
    }
  }
  
  .member-actions {
    display: flex;
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

const AddButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[6]};
  border: 2px dashed ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.gray[50]};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.primary[50]};
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]};
  
  h3 {
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
  
  p {
    margin-bottom: ${({ theme }) => theme.spacing[6]};
    color: ${({ theme }) => theme.colors.gray[600]};
  }
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
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[8]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  box-shadow: ${({ theme }) => theme.boxShadow.xl};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[5]};
  
  label {
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[700]};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
  
  input, select, textarea {
    width: 100%;
    padding: ${({ theme }) => theme.spacing[3]};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.gray[900]};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    transition: ${({ theme }) => theme.transition.colors};
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.gray[500]};
    }
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary[500]};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 80px;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing[6]};
`;

interface SocietyProfileManagementPageProps {}

const SocietyProfileManagementPage: React.FC<SocietyProfileManagementPageProps> = () => {
  const [activeTab, setActiveTab] = useState<'committees' | 'profile'>('committees');
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [stats, setStats] = useState<CommitteeStats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'committee' | 'member'>('committee');
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(null);
  const [formData, setFormData] = useState<any>({});

  // Initialize with default committees
  useEffect(() => {
    const initialCommittees: Committee[] = DEFAULT_COMMITTEES.map((template, index) => ({
      ...template,
      id: `committee-${index + 1}`,
      formationDate: new Date(),
      members: []
    }));
    
    setCommittees(initialCommittees);
  }, []);

  // Calculate stats whenever committees change
  useEffect(() => {
    if (committees.length > 0) {
      setStats(calculateCommitteeStats(committees));
    }
  }, [committees]);

  const handleAddCommittee = () => {
    setModalMode('committee');
    setSelectedCommittee(null);
    setFormData({
      name: '',
      type: CommitteeType.MANAGING_COMMITTEE,
      description: '',
      maxMembers: 7,
      minMembers: 3,
      meetingFrequency: 'Monthly',
      responsibilities: []
    });
    setIsModalOpen(true);
  };

  const handleEditCommittee = (committee: Committee) => {
    setModalMode('committee');
    setSelectedCommittee(committee);
    setFormData({
      name: committee.name,
      type: committee.type,
      description: committee.description,
      maxMembers: committee.maxMembers,
      minMembers: committee.minMembers,
      meetingFrequency: committee.meetingFrequency,
      responsibilities: committee.responsibilities
    });
    setIsModalOpen(true);
  };

  const handleAddMember = (committee: Committee) => {
    setModalMode('member');
    setSelectedCommittee(committee);
    setFormData({
      name: '',
      email: '',
      phone: '',
      flatNumber: '',
      role: MemberRole.MEMBER,
      bio: '',
      experience: '',
      tenure: 24
    });
    setIsModalOpen(true);
  };

  const handleSaveCommittee = () => {
    if (selectedCommittee) {
      // Edit existing committee
      setCommittees(prev => prev.map(c => 
        c.id === selectedCommittee.id 
          ? { ...c, ...formData, lastUpdated: new Date() }
          : c
      ));
    } else {
      // Add new committee
      const newCommittee: Committee = {
        id: `committee-${Date.now()}`,
        ...formData,
        formationDate: new Date(),
        isActive: true,
        members: []
      };
      setCommittees(prev => [...prev, newCommittee]);
    }
    setIsModalOpen(false);
  };

  const handleSaveMember = () => {
    if (selectedCommittee) {
      const newMember: CommitteeMember = {
        id: `member-${Date.now()}`,
        ...formData,
        status: CommitteeMemberStatus.ACTIVE,
        appointmentDate: new Date(),
        isElected: false
      };
      
      setCommittees(prev => prev.map(c => 
        c.id === selectedCommittee.id
          ? { ...c, members: [...c.members, newMember] }
          : c
      ));
    }
    setIsModalOpen(false);
  };

  const handleDeleteCommittee = (committeeId: string) => {
    setCommittees(prev => prev.filter(c => c.id !== committeeId));
  };

  const handleRemoveMember = (committeeId: string, memberId: string) => {
    setCommittees(prev => prev.map(c => 
      c.id === committeeId
        ? { ...c, members: c.members.filter(m => m.id !== memberId) }
        : c
    ));
  };

  return (
    <Container>
      <Header>
        <PageTitle>Society Profile Management</PageTitle>
        <PageSubtitle>Manage committees, members, and society profile information</PageSubtitle>
      </Header>

      {stats && (
        <StatsGrid>
          <CommitteeStatCard>
            <h3>{stats.totalCommittees}</h3>
            <p>Total Committees</p>
          </CommitteeStatCard>
          <CommitteeStatCard>
            <h3>{stats.activeCommittees}</h3>
            <p>Active Committees</p>
          </CommitteeStatCard>
          <CommitteeStatCard>
            <h3>{stats.totalMembers}</h3>
            <p>Total Members</p>
          </CommitteeStatCard>
          <CommitteeStatCard>
            <h3>{stats.activeMembers}</h3>
            <p>Active Members</p>
          </CommitteeStatCard>
          <CommitteeStatCard>
            <h3>{stats.vacantPositions}</h3>
            <p>Vacant Positions</p>
          </CommitteeStatCard>
          <CommitteeStatCard>
            <h3>{stats.upcomingElections}</h3>
            <p>Upcoming Elections</p>
          </CommitteeStatCard>
        </StatsGrid>
      )}

      <TabContainer>
        <Tab 
          active={activeTab === 'committees'} 
          onClick={() => setActiveTab('committees')}
        >
          Committees
        </Tab>
        <Tab 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')}
        >
          Society Profile
        </Tab>
      </TabContainer>

      <ContentContainer>
        {activeTab === 'committees' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Committee Management</h2>
              <ActionButton variant="primary" onClick={handleAddCommittee}>
                Add Committee
              </ActionButton>
            </div>

            {committees.length === 0 ? (
              <EmptyState>
                <h3>No Committees Found</h3>
                <p>Start by adding your first committee to manage society operations</p>
                <ActionButton variant="primary" onClick={handleAddCommittee}>
                  Add First Committee
                </ActionButton>
              </EmptyState>
            ) : (
              <CommitteeGrid>
                {committees.map(committee => (
                  <CommitteeCard key={committee.id}>
                    <CommitteeHeader>
                      <div className="committee-info">
                        <h3>{committee.name}</h3>
                        <p>{committee.description}</p>
                        <div style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '8px' }}>
                          <span>Members: {committee.members.length}/{committee.maxMembers}</span>
                          <span style={{ marginLeft: '16px' }}>
                            Meeting: {committee.meetingFrequency}
                          </span>
                        </div>
                      </div>
                      <CommitteeActions>
                        <ActionButton onClick={() => handleEditCommittee(committee)}>
                          Edit
                        </ActionButton>
                        <ActionButton variant="danger" onClick={() => handleDeleteCommittee(committee.id)}>
                          Delete
                        </ActionButton>
                      </CommitteeActions>
                    </CommitteeHeader>

                    <MembersList>
                      {committee.members.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', opacity: 0.6 }}>
                          <p>No members assigned</p>
                        </div>
                      ) : (
                        committee.members.slice(0, 3).map(member => (
                          <MemberItem key={member.id}>
                            <div className="member-info">
                              <div className="name">{member.name}</div>
                              <div className="role">{ROLE_CONFIG[member.role].label} • Flat {member.flatNumber}</div>
                            </div>
                            <div className="member-actions">
                              <ActionButton onClick={() => handleRemoveMember(committee.id, member.id)}>
                                Remove
                              </ActionButton>
                            </div>
                          </MemberItem>
                        ))
                      )}
                      {committee.members.length > 3 && (
                        <div style={{ textAlign: 'center', padding: '8px', opacity: 0.7 }}>
                          +{committee.members.length - 3} more members
                        </div>
                      )}
                    </MembersList>

                    <div style={{ marginTop: '16px' }}>
                      <ActionButton 
                        variant="primary" 
                        onClick={() => handleAddMember(committee)}
                        style={{ width: '100%' }}
                      >
                        Add Member
                      </ActionButton>
                    </div>
                  </CommitteeCard>
                ))}
              </CommitteeGrid>
            )}
          </>
        )}

        {activeTab === 'profile' && (
          <div>
            <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>Society Profile</h2>
            <p style={{ opacity: 0.7 }}>Society profile management coming soon...</p>
          </div>
        )}
      </ContentContainer>

      <Modal isOpen={isModalOpen}>
        <ModalContent>
          <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>
            {modalMode === 'committee' 
              ? (selectedCommittee ? 'Edit Committee' : 'Add Committee')
              : 'Add Member'
            }
          </h2>

          {modalMode === 'committee' ? (
            <>
              <FormGroup>
                <label>Committee Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter committee name"
                />
              </FormGroup>

              <FormGroup>
                <label>Committee Type</label>
                <select
                  value={formData.type || CommitteeType.MANAGING_COMMITTEE}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as CommitteeType })}
                >
                  {Object.entries(COMMITTEE_CONFIG).map(([value, config]) => (
                    <option key={value} value={value}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup>
                <label>Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter committee description"
                />
              </FormGroup>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormGroup>
                  <label>Minimum Members</label>
                  <input
                    type="number"
                    value={formData.minMembers || 3}
                    onChange={(e) => setFormData({ ...formData, minMembers: parseInt(e.target.value) })}
                  />
                </FormGroup>

                <FormGroup>
                  <label>Maximum Members</label>
                  <input
                    type="number"
                    value={formData.maxMembers || 7}
                    onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                  />
                </FormGroup>
              </div>

              <FormGroup>
                <label>Meeting Frequency</label>
                <select
                  value={formData.meetingFrequency || 'Monthly'}
                  onChange={(e) => setFormData({ ...formData, meetingFrequency: e.target.value })}
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-weekly">Bi-weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Bi-monthly">Bi-monthly</option>
                  <option value="Quarterly">Quarterly</option>
                </select>
              </FormGroup>
            </>
          ) : (
            <>
              <FormGroup>
                <label>Full Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter member name"
                />
              </FormGroup>

              <FormGroup>
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </FormGroup>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <FormGroup>
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </FormGroup>

                <FormGroup>
                  <label>Flat Number</label>
                  <input
                    type="text"
                    value={formData.flatNumber || ''}
                    onChange={(e) => setFormData({ ...formData, flatNumber: e.target.value })}
                    placeholder="e.g., A-101"
                  />
                </FormGroup>
              </div>

              <FormGroup>
                <label>Role</label>
                <select
                  value={formData.role || MemberRole.MEMBER}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as MemberRole })}
                >
                  {Object.entries(ROLE_CONFIG).map(([value, config]) => (
                    <option key={value} value={value}>
                      {config.label}
                    </option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup>
                <label>Bio (Optional)</label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief bio or background"
                />
              </FormGroup>
            </>
          )}

          <ModalActions>
            <ActionButton onClick={() => setIsModalOpen(false)}>
              Cancel
            </ActionButton>
            <ActionButton 
              variant="primary" 
              onClick={modalMode === 'committee' ? handleSaveCommittee : handleSaveMember}
            >
              {modalMode === 'committee' 
                ? (selectedCommittee ? 'Update Committee' : 'Add Committee')
                : 'Add Member'
              }
            </ActionButton>
          </ModalActions>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default SocietyProfileManagementPage;