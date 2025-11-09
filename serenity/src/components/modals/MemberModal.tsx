import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  FaTimes,
  FaUpload,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaHome,
  FaIdCard,
  FaCar,
  FaUserPlus,
  FaBell,
  FaSave,
  FaCamera,
  FaCalendarAlt,
  FaGenderless,
  FaFlag,
  FaBriefcase,
  FaHeart,
  FaTint
} from 'react-icons/fa';
import {
  Member,
  MemberFormData,
  SocietyMemberStatus,
  Gender,
  MaritalStatus,
  BloodGroup,
  FamilyRelation,
  DocumentType,
  VehicleType,
  UnitType,
  OwnershipType
} from '../../types/enhanced-member-management';
import {
  MemberRole,
  Permission
} from '../../types/member-management';

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.gray[900]};
  box-shadow: ${({ theme }) => theme.boxShadow.xl};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[8]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.gray[50]};
  
  h2 {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.gray[900]};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[3]};
  }
  
  .close-btn {
    background: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    color: ${({ theme }) => theme.colors.gray[600]};
    font-size: 1.2rem;
    cursor: pointer;
    padding: ${({ theme }) => theme.spacing[2]};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    transition: ${({ theme }) => theme.transition.all};
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: ${({ theme }) => theme.colors.gray[100]};
      border-color: ${({ theme }) => theme.colors.gray[400]};
      transform: scale(1.05);
    }
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing[8]};
  overflow-y: auto;
  max-height: calc(90vh - 140px);
  background: ${({ theme }) => theme.colors.white};
`;

const TabContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.spacing[2]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const Tab = styled.button<{ active: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[5]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${props => props.active 
    ? props.theme.colors.primary[600]
    : props.theme.colors.white
  };
  color: ${props => props.active 
    ? props.theme.colors.white
    : props.theme.colors.gray[700]
  };
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  
  &:hover {
    background: ${props => props.active 
      ? props.theme.colors.primary[700]
      : props.theme.colors.gray[50]
    };
    border-color: ${props => props.active 
      ? props.theme.colors.primary[700]
      : props.theme.colors.gray[400]
    };
  }
`;

const FormSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  
  h3 {
    margin-bottom: ${({ theme }) => theme.spacing[6]};
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[3]};
    color: ${({ theme }) => theme.colors.gray[900]};
    padding-bottom: ${({ theme }) => theme.spacing[2]};
    border-bottom: 2px solid ${({ theme }) => theme.colors.primary[200]};
  }
`;

const FormGrid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[5]};
  
  ${props => props.columns && `
    grid-template-columns: repeat(${props.columns}, 1fr);
  `}
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  label {
    display: block;
    margin-bottom: ${({ theme }) => theme.spacing[2]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.gray[700]};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
  }
  
  input, select, textarea {
    width: 100%;
    padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.gray[900]};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    transition: ${({ theme }) => theme.transition.colors};
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary[500]};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    }
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.gray[500]};
    }
  }
    color: white;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }
    
    &:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.6);
      background: rgba(255, 255, 255, 0.15);
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  select {
    cursor: pointer;
  }
`;

const ProfilePictureUpload = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary[500]};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    color: ${({ theme }) => theme.colors.white};
    position: relative;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .upload-overlay {
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
      cursor: pointer;
      transition: ${({ theme }) => theme.transition.all};
      
      &:hover {
        opacity: 1;
      }
    }
  }
  
  input[type="file"] {
    display: none;
  }
  
  .upload-btn {
    padding: 8px 16px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const FamilyMemberCard = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    h4 {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .remove-btn {
      background: #f44336;
      border: none;
      color: white;
      padding: 6px 8px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: #da190b;
      }
    }
  }
`;

const VehicleCard = styled(FamilyMemberCard)``;

const NotificationSettings = styled.div`
  .setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    &:last-child {
      border-bottom: none;
    }
    
    .label {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 500;
    }
    
    .toggle {
      position: relative;
      width: 50px;
      height: 26px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 13px;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &.active {
        background: #4CAF50;
      }
      
      .slider {
        position: absolute;
        top: 3px;
        left: 3px;
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 50%;
        transition: all 0.3s ease;
      }
      
      &.active .slider {
        transform: translateX(24px);
      }
    }
  }
`;

const ModalFooter = styled.div`
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[8]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.gray[50]};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${props.theme.colors.primary[600]};
          color: ${props.theme.colors.white};
          border: 1px solid ${props.theme.colors.primary[600]};
          &:hover { 
            background: ${props.theme.colors.primary[700]}; 
            border-color: ${props.theme.colors.primary[700]};
          }
        `;
      case 'danger':
        return `
          background: ${props.theme.colors.error[600]};
          color: ${props.theme.colors.white};
          border: 1px solid ${props.theme.colors.error[600]};
          &:hover { 
            background: ${props.theme.colors.error[700]}; 
            border-color: ${props.theme.colors.error[700]};
          }
        `;
      default:
        return `
          background: ${props.theme.colors.white};
          color: ${props.theme.colors.gray[700]};
          border: 1px solid ${props.theme.colors.gray[300]};
          &:hover { 
            background: ${props.theme.colors.gray[50]}; 
            border-color: ${props.theme.colors.gray[400]};
          }
        `;
    }
  }}
`;

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member?: Member | null;
  mode: 'add' | 'edit' | 'view';
  onSave: (memberData: MemberFormData) => Promise<void>;
}

const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  member,
  mode,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState<MemberFormData>({
    personalDetails: {
      firstName: '',
      lastName: '',
      dateOfBirth: new Date(),
      gender: Gender.PREFER_NOT_TO_SAY,
      nationality: 'Indian',
      occupation: '',
      maritalStatus: MaritalStatus.SINGLE
    },
    contactInformation: {
      primaryPhone: '',
      primaryEmail: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: ''
    },
    role: MemberRole.RESIDENT,
    status: SocietyMemberStatus.ACTIVE,
    units: [],
    familyDetails: [],
    vehicles: [],
    documents: [],
    emergencyContacts: [],
    permissions: [],
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      whatsappNotifications: false,
      maintenanceReminders: true,
      eventNotifications: true,
      paymentReminders: true,
      securityAlerts: true
    }
  });
  
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>('');
  
  useEffect(() => {
    if (member && mode !== 'add') {
      setFormData({
        personalDetails: member.personalDetails,
        contactInformation: member.contactInformation,
        role: member.role,
        status: member.status,
        units: member.units,
        familyDetails: member.familyDetails,
        vehicles: member.vehicles,
        documents: member.documents,
        emergencyContacts: member.emergencyContacts,
        permissions: member.permissions,
        notifications: member.notifications,
        notes: member.notes
      });
      
      if (member.profilePicture) {
        setProfilePicturePreview(member.profilePicture);
      }
    }
  }, [member, mode]);
  
  const handleInputChange = (section: string, field: string, value: any) => {
    if (section === '') {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof MemberFormData] as any),
          [field]: value
        }
      }));
    }
  };
  
  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleNotificationToggle = (setting: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notificationSettings: {
        ...prev.notifications,
        [setting]: value
      }
    }));
  };
  
  const handleSave = async () => {
    try {
      const memberData = {
        ...formData,
        profilePicture: profilePicture || undefined
      };
      await onSave(memberData);
      onClose();
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };
  
  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <FaUser /> },
    { id: 'contact', label: 'Contact Details', icon: <FaPhone /> },
    { id: 'family', label: 'Family Members', icon: <FaUserPlus /> },
    { id: 'vehicles', label: 'Vehicles', icon: <FaCar /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> }
  ];
  
  const renderPersonalInfo = () => (
    <FormSection>
      <h3><FaUser /> Personal Information</h3>
      
      <ProfilePictureUpload>
        <div className="avatar">
          {profilePicturePreview ? (
            <img src={profilePicturePreview} alt="Profile" />
          ) : (
            formData.personalDetails.firstName.charAt(0) || 'M'
          )}
          <label className="upload-overlay" htmlFor="profile-picture">
            <FaCamera />
          </label>
        </div>
        <input
          id="profile-picture"
          type="file"
          accept="image/*"
          onChange={handleProfilePictureChange}
          disabled={mode === 'view'}
        />
        {mode !== 'view' && (
          <label htmlFor="profile-picture" className="upload-btn">
            <FaUpload /> Upload Photo
          </label>
        )}
      </ProfilePictureUpload>
      
      <FormGrid>
        <FormGroup>
          <label><FaUser /> First Name</label>
          <input
            type="text"
            value={formData.personalDetails.firstName}
            onChange={(e) => handleInputChange('personalDetails', 'firstName', e.target.value)}
            disabled={mode === 'view'}
            placeholder="Enter first name"
          />
        </FormGroup>
        
        <FormGroup>
          <label><FaUser /> Last Name</label>
          <input
            type="text"
            value={formData.personalDetails.lastName}
            onChange={(e) => handleInputChange('personalDetails', 'lastName', e.target.value)}
            disabled={mode === 'view'}
            placeholder="Enter last name"
          />
        </FormGroup>
        
        <FormGroup>
          <label><FaCalendarAlt /> Date of Birth</label>
          <input
            type="date"
            value={formData.personalDetails.dateOfBirth.toISOString().split('T')[0]}
            onChange={(e) => handleInputChange('personalDetails', 'dateOfBirth', new Date(e.target.value))}
            disabled={mode === 'view'}
          />
        </FormGroup>
        
        <FormGroup>
          <label><FaGenderless /> Gender</label>
          <select
            value={formData.personalDetails.gender}
            onChange={(e) => handleInputChange('personalDetails', 'gender', e.target.value)}
            disabled={mode === 'view'}
          >
            {Object.values(Gender).map(gender => (
              <option key={gender} value={gender}>{gender.replace('_', ' ')}</option>
            ))}
          </select>
        </FormGroup>
        
        <FormGroup>
          <label><FaFlag /> Nationality</label>
          <input
            type="text"
            value={formData.personalDetails.nationality}
            onChange={(e) => handleInputChange('personalDetails', 'nationality', e.target.value)}
            disabled={mode === 'view'}
            placeholder="Enter nationality"
          />
        </FormGroup>
        
        <FormGroup>
          <label><FaBriefcase /> Occupation</label>
          <input
            type="text"
            value={formData.personalDetails.occupation}
            onChange={(e) => handleInputChange('personalDetails', 'occupation', e.target.value)}
            disabled={mode === 'view'}
            placeholder="Enter occupation"
          />
        </FormGroup>
        
        <FormGroup>
          <label><FaHeart /> Marital Status</label>
          <select
            value={formData.personalDetails.maritalStatus}
            onChange={(e) => handleInputChange('personalDetails', 'maritalStatus', e.target.value)}
            disabled={mode === 'view'}
          >
            {Object.values(MaritalStatus).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </FormGroup>
        
        <FormGroup>
          <label>Role</label>
          <select
            value={formData.role}
            onChange={(e) => handleInputChange('', 'role', e.target.value)}
            disabled={mode === 'view'}
          >
            {Object.values(MemberRole).map(role => (
              <option key={role} value={role}>{role.replace('_', ' ')}</option>
            ))}
          </select>
        </FormGroup>
        
        <FormGroup>
          <label>Status</label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange('', 'status', e.target.value)}
            disabled={mode === 'view'}
          >
            {Object.values(SocietyMemberStatus).map(status => (
              <option key={status} value={status}>{status.replace('_', ' ')}</option>
            ))}
          </select>
        </FormGroup>
      </FormGrid>
      
      {formData.notes !== undefined && (
        <FormGroup>
          <label>Notes</label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => handleInputChange('', 'notes', e.target.value)}
            disabled={mode === 'view'}
            placeholder="Add any additional notes about this member"
            rows={4}
          />
        </FormGroup>
      )}
    </FormSection>
  );
  
  const renderContactInfo = () => (
    <FormSection>
      <h3><FaPhone /> Contact Information</h3>
      <FormGrid>
        <FormGroup>
          <label><FaPhone /> Primary Phone</label>
          <input
            type="tel"
            value={formData.contactInformation.primaryPhone}
            onChange={(e) => handleInputChange('contactInformation', 'primaryPhone', e.target.value)}
            disabled={mode === 'view'}
            placeholder="Enter primary phone number"
          />
        </FormGroup>
        
        <FormGroup>
          <label><FaPhone /> Secondary Phone</label>
          <input
            type="tel"
            value={formData.contactInformation.secondaryPhone || ''}
            onChange={(e) => handleInputChange('contactInformation', 'secondaryPhone', e.target.value)}
            disabled={mode === 'view'}
            placeholder="Enter secondary phone number"
          />
        </FormGroup>
        
        <FormGroup>
          <label><FaEnvelope /> Primary Email</label>
          <input
            type="email"
            value={formData.contactInformation.primaryEmail}
            onChange={(e) => handleInputChange('contactInformation', 'primaryEmail', e.target.value)}
            disabled={mode === 'view'}
            placeholder="Enter primary email address"
          />
        </FormGroup>
        
        <FormGroup>
          <label><FaEnvelope /> Secondary Email</label>
          <input
            type="email"
            value={formData.contactInformation.secondaryEmail || ''}
            onChange={(e) => handleInputChange('contactInformation', 'secondaryEmail', e.target.value)}
            disabled={mode === 'view'}
            placeholder="Enter secondary email address"
          />
        </FormGroup>
        
        <FormGroup>
          <label>Emergency Contact Name</label>
          <input
            type="text"
            value={formData.contactInformation.emergencyContactName}
            onChange={(e) => handleInputChange('contactInformation', 'emergencyContactName', e.target.value)}
            disabled={mode === 'view'}
            placeholder="Enter emergency contact name"
          />
        </FormGroup>
        
        <FormGroup>
          <label>Emergency Contact Phone</label>
          <input
            type="tel"
            value={formData.contactInformation.emergencyContactPhone}
            onChange={(e) => handleInputChange('contactInformation', 'emergencyContactPhone', e.target.value)}
            disabled={mode === 'view'}
            placeholder="Enter emergency contact phone"
          />
        </FormGroup>
        
        <FormGroup>
          <label>Emergency Contact Relation</label>
          <input
            type="text"
            value={formData.contactInformation.emergencyContactRelation}
            onChange={(e) => handleInputChange('contactInformation', 'emergencyContactRelation', e.target.value)}
            disabled={mode === 'view'}
            placeholder="Enter relation (e.g., Spouse, Parent)"
          />
        </FormGroup>
      </FormGrid>
    </FormSection>
  );
  
  const renderNotificationSettings = () => (
    <FormSection>
      <h3><FaBell /> Notification Preferences</h3>
      <NotificationSettings>
        {Object.entries(formData.notifications).map(([key, value]) => (
          <div key={key} className="setting-item">
            <div className="label">
              <FaBell />
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </div>
            <div 
              className={`toggle ${value ? 'active' : ''}`}
              onClick={() => mode !== 'view' && handleNotificationToggle(key, !value)}
            >
              <div className="slider" />
            </div>
          </div>
        ))}
      </NotificationSettings>
    </FormSection>
  );
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal': return renderPersonalInfo();
      case 'contact': return renderContactInfo();
      case 'family': return <div>Family Members - Coming Soon</div>;
      case 'vehicles': return <div>Vehicles - Coming Soon</div>;
      case 'notifications': return renderNotificationSettings();
      default: return renderPersonalInfo();
    }
  };
  
  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContainer>
        <ModalHeader>
          <h2>
            <FaUser />
            {mode === 'add' && 'Add New Member'}
            {mode === 'edit' && 'Edit Member'}
            {mode === 'view' && 'Member Details'}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </ModalHeader>
        
        <ModalBody>
          <TabContainer>
            {tabs.map(tab => (
              <Tab
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </Tab>
            ))}
          </TabContainer>
          
          {renderTabContent()}
        </ModalBody>
        
        <ModalFooter>
          <ActionButton onClick={onClose}>
            Cancel
          </ActionButton>
          {mode !== 'view' && (
            <ActionButton variant="primary" onClick={handleSave}>
              <FaSave />
              {mode === 'add' ? 'Add Member' : 'Save Changes'}
            </ActionButton>
          )}
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default MemberModal;