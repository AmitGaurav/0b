import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { FiEdit, FiSave, FiX, FiPlus, FiTrash2, FiUser, FiTruck, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import { FamilyMember, Vehicle } from '../../types/profile-enhancements';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.primary[300]};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary[600]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]};
  }

  &.primary {
    background: ${({ theme }) => theme.colors.primary[600]};
    color: ${({ theme }) => theme.colors.white};

    &:hover {
      background: ${({ theme }) => theme.colors.primary[700]};
    }
  }

  &.cancel {
    border-color: ${({ theme }) => theme.colors.gray[300]};
    color: ${({ theme }) => theme.colors.gray[600]};

    &:hover {
      background: ${({ theme }) => theme.colors.gray[50]};
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ProfileCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[8]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  padding-bottom: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    text-align: center;
  }
`;

const Avatar = styled.div<{ profilePictureUrl?: string }>`
  width: 120px;
  height: 120px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme, profilePictureUrl }) => 
    profilePictureUrl ? `url(${profilePictureUrl})` : theme.colors.primary[500]};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  flex-shrink: 0;
  border: 4px solid ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.boxShadow.lg};
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const Name = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Email = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Occupation = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[700]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const DetailSection = styled.div`
  background: ${({ theme }) => theme.colors.gray[50]};
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding-bottom: ${({ theme }) => theme.spacing[2]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary[200]};
`;

const DetailItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const DetailValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.gray[900]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  min-height: 24px;
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const ReadOnlyField = styled.div`
  padding: ${({ theme }) => theme.spacing[2]} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-style: italic;
`;

const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

// New styled components for Family Members and Vehicles sections
const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.primary[600]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[700]};
  }
`;

const ItemCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ItemSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ItemActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }

  &.edit {
    color: ${({ theme }) => theme.colors.primary[600]};
    border-color: ${({ theme }) => theme.colors.primary[300]};
    
    &:hover {
      background: ${({ theme }) => theme.colors.primary[50]};
    }
  }

  &.delete {
    color: ${({ theme }) => theme.colors.error[600]};
    border-color: ${({ theme }) => theme.colors.error[300]};
    
    &:hover {
      background: ${({ theme }) => theme.colors.error[50]};
    }
  }
`;

const ItemDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const ItemDetail = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const ItemDetailLabel = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.boxShadow.lg};
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const ModalTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FullWidthField = styled.div`
  grid-column: 1 / -1;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[8]};
  color: ${({ theme }) => theme.colors.gray[500]};

  svg {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    opacity: 0.5;
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.gray[600]};
    margin-bottom: ${({ theme }) => theme.spacing[2]};
  }

  p {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Family Members state
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [editingFamilyMember, setEditingFamilyMember] = useState<FamilyMember | null>(null);
  const [familyFormData, setFamilyFormData] = useState<Partial<FamilyMember>>({});

  // Vehicles state
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleFormData, setVehicleFormData] = useState<Partial<Vehicle>>({});

  // View mode states for expanded details
  const [expandedFamilyMembers, setExpandedFamilyMembers] = useState<Set<string>>(new Set());
  const [expandedVehicles, setExpandedVehicles] = useState<Set<string>>(new Set());

  // Debug authentication and cookies on component load
  useEffect(() => {
    console.log('=== ProfilePage Authentication Debug ===');
    console.log('User from auth context:', user);
    console.log('UpdateUser function available:', !!updateUser);
    console.log('All cookies:', document.cookie);
    
    // Parse cookies for easier reading
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      if (key) acc[key] = value || '';
      return acc;
    }, {} as Record<string, string>);
    
    console.log('Parsed cookies:', cookies);
    console.log('Access token present:', !!cookies.access_token);
    console.log('Refresh token present:', !!cookies.refresh_token);
    
    if (cookies.access_token) {
      console.log('Access token preview:', cookies.access_token.substring(0, 50) + '...');
    }
    console.log('=== End ProfilePage Debug ===');
  }, [user, updateUser]);

  // Initialize sample data (in real app, this would come from API)
  useEffect(() => {
    // Sample family members data
    setFamilyMembers([
      {
        id: '1',
        name: 'Jane Doe',
        relationship: 'Spouse',
        contactNumber: '+1234567890',
        email: 'jane@example.com',
        emergencyContact: true,
      },
    ]);

    // Sample vehicles data
    setVehicles([
      {
        id: '1',
        vehicleType: 'Car',
        vehicleNumber: 'ABC123',
        vehicleModel: 'Toyota Camry',
        vehicleColor: 'Blue',
        vehicleBrand: 'Toyota',
        isActive: true,
      },
    ]);
  }, []);

  // Family Members handlers
  const handleAddFamilyMember = () => {
    setEditingFamilyMember(null);
    setFamilyFormData({});
    setShowFamilyModal(true);
  };

  const handleEditFamilyMember = (member: FamilyMember) => {
    setEditingFamilyMember(member);
    setFamilyFormData(member);
    setShowFamilyModal(true);
  };

  const handleDeleteFamilyMember = (id: string) => {
    if (window.confirm('Are you sure you want to delete this family member?')) {
      setFamilyMembers(prev => prev.filter(member => member.id !== id));
    }
  };

  const handleSaveFamilyMember = () => {
    if (!familyFormData.name || !familyFormData.relationship) {
      alert('Please fill in required fields (Name and Relationship)');
      return;
    }

    if (editingFamilyMember) {
      // Update existing
      setFamilyMembers(prev => 
        prev.map(member => 
          member.id === editingFamilyMember.id 
            ? { ...member, ...familyFormData }
            : member
        )
      );
    } else {
      // Add new
      const newMember: FamilyMember = {
        id: Date.now().toString(),
        name: familyFormData.name!,
        relationship: familyFormData.relationship!,
        ...familyFormData,
      };
      setFamilyMembers(prev => [...prev, newMember]);
    }

    setShowFamilyModal(false);
    setFamilyFormData({});
    setEditingFamilyMember(null);
  };

  // Vehicles handlers
  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setVehicleFormData({});
    setShowVehicleModal(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleFormData(vehicle);
    setShowVehicleModal(true);
  };

  const handleDeleteVehicle = (id: string) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(prev => prev.filter(vehicle => vehicle.id !== id));
    }
  };

  const handleSaveVehicle = () => {
    if (!vehicleFormData.vehicleType || !vehicleFormData.vehicleNumber || !vehicleFormData.vehicleModel) {
      alert('Please fill in required fields (Type, Number, and Model)');
      return;
    }

    if (editingVehicle) {
      // Update existing
      setVehicles(prev => 
        prev.map(vehicle => 
          vehicle.id === editingVehicle.id 
            ? { ...vehicle, ...vehicleFormData }
            : vehicle
        )
      );
    } else {
      // Add new
      const newVehicle: Vehicle = {
        id: Date.now().toString(),
        vehicleType: vehicleFormData.vehicleType!,
        vehicleNumber: vehicleFormData.vehicleNumber!,
        vehicleModel: vehicleFormData.vehicleModel!,
        vehicleColor: vehicleFormData.vehicleColor || '',
        isActive: true,
        ...vehicleFormData,
      };
      setVehicles(prev => [...prev, newVehicle]);
    }

    setShowVehicleModal(false);
    setVehicleFormData({});
    setEditingVehicle(null);
  };

  // Toggle expand handlers
  const toggleFamilyMemberExpand = (id: string) => {
    setExpandedFamilyMembers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleVehicleExpand = (id: string) => {
    setExpandedVehicles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleEdit = useCallback(() => {
    if (!user) return;
    
    // Initialize edited data with current user data (excluding name and email)
    const { name, email, ...editableFields } = user;
    setEditedData(editableFields);
    setIsEditing(true);
  }, [user]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditedData({});
  }, []);

  const handleSave = useCallback(async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Filter out read-only fields and system fields that shouldn't be updated
      const { 
        userId, 
        username, 
        name, 
        email, 
        emailVerified,
        phoneVerified,
        alternatePhoneVerified,
        alternateEmailVerified,
        emergencyContactPhoneVerified,
        emergencyContactEmailVerified,
        emergencyContactAddressVerified,
        lastUpdated,
        lastUpdatedBy,
        createdBy,
        createdDate,
        profilePictureUrl,
        societyId,
        ...updatableFields 
      } = editedData;
      
      console.log('Saving profile data:', updatableFields);
      
      // Call updateUser from auth context (now async)
      if (updateUser) {
        await updateUser(updatableFields);
        console.log('Profile updated successfully');
        
        // Show success message
        alert('Profile updated successfully!');
      }
      setIsEditing(false);
      setEditedData({});
    } catch (error: any) {
      console.error('Error updating profile:', error);
      // Show error message
      alert(`Failed to update profile: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  }, [editedData, updateUser]);

  const handleInputChange = useCallback((field: string, value: string) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const renderEditableField = (field: string, label: string, value: any, type: 'text' | 'date' | 'select' = 'text', options?: string[]) => {
    if (isEditing) {
      if (type === 'select' && options) {
        return (
          <DetailItem key={field}>
            <DetailLabel>{label}</DetailLabel>
            <Select
              value={editedData[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
            >
              <option value="">Select {label}</option>
              {options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>
          </DetailItem>
        );
      }
      
      return (
        <DetailItem key={field}>
          <DetailLabel>{label}</DetailLabel>
          <Input
            type={type}
            value={editedData[field] || ''}
            onChange={(e) => handleInputChange(field, e.target.value)}
          />
        </DetailItem>
      );
    }

    return (
      <DetailItem key={field}>
        <DetailLabel>{label}</DetailLabel>
        <DetailValue>{value || 'N/A'}</DetailValue>
      </DetailItem>
    );
  };

  if (!user) {
    return (
      <Container>
        <Title>Profile</Title>
        <ProfileCard>
          <Placeholder>Loading profile...</Placeholder>
        </ProfileCard>
      </Container>
    );
  }

  const getUserInitials = (name: string): string => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);
  };

  return (
    <Container>
      <Title>
        User Profile
        <div>
          {!isEditing ? (
            <ActionButton onClick={handleEdit}>
              <FiEdit size={16} />
              Edit Profile
            </ActionButton>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <ActionButton className="primary" onClick={handleSave} disabled={isSaving}>
                <FiSave size={16} />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </ActionButton>
              <ActionButton className="cancel" onClick={handleCancel} disabled={isSaving}>
                <FiX size={16} />
                Cancel
              </ActionButton>
            </div>
          )}
        </div>
      </Title>
      
      <ProfileCard>
        <ProfileHeader>
          <Avatar profilePictureUrl={user.profilePictureUrl}>
            {!user.profilePictureUrl && getUserInitials(user.name)}
          </Avatar>
          <ProfileInfo>
            <Name>{user.name}</Name>
            <ReadOnlyField>Name is read-only</ReadOnlyField>
            <Email>{user.email}</Email>
            <ReadOnlyField>Email is read-only</ReadOnlyField>
            <Occupation>{isEditing ? (editedData.occupation || user.occupation) : user.occupation}</Occupation>
          </ProfileInfo>
        </ProfileHeader>

        <ProfileGrid>
          {/* Personal Information */}
          <DetailSection>
            <SectionTitle>Personal Information</SectionTitle>
            {renderEditableField('occupation', 'Occupation', user.occupation, 'text')}
            {renderEditableField('dateOfBirth', 'Date of Birth', user.dateOfBirth, 'date')}
            {renderEditableField('gender', 'Gender', user.gender, 'select', ['Male', 'Female', 'Other'])}
            {renderEditableField('maritalStatus', 'Marital Status', user.maritalStatus, 'select', ['Single', 'Married', 'Divorced', 'Widowed'])}
            {renderEditableField('bloodGroup', 'Blood Group', user.bloodGroup, 'select', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])}
            {renderEditableField('residingFromDate', 'Residing From', user.residingFromDate, 'date')}
          </DetailSection>

          {/* Contact Information */}
          <DetailSection>
            <SectionTitle>Contact Information</SectionTitle>
            {renderEditableField('address', 'Address', user.address, 'text')}
            {renderEditableField('phoneNumber', 'Phone Number', user.phoneNumber, 'text')}
            {renderEditableField('alternateEmail', 'Alternate Email', user.alternateEmail, 'text')}
            {renderEditableField('alternatePhone', 'Alternate Phone', user.alternatePhone, 'text')}
            {renderEditableField('alternateEmail2', 'Alternate Email 2', user.alternateEmail2, 'text')}
            {renderEditableField('alternatePhone2', 'Alternate Phone 2', user.alternatePhone2, 'text')}
          </DetailSection>

          {/* Emergency Contact */}
          <DetailSection>
            <SectionTitle>Emergency Contact</SectionTitle>
            {renderEditableField('emergencyContactName', 'Contact Name', user.emergencyContactName, 'text')}
            {renderEditableField('emergencyContactPhone', 'Contact Phone', user.emergencyContactPhone, 'text')}
            {renderEditableField('emergencyContactEmail', 'Contact Email', user.emergencyContactEmail, 'text')}
            {renderEditableField('emergencyContactRelationship', 'Relationship', user.emergencyContactRelationship, 'text')}
            {renderEditableField('emergencyContactAddress', 'Contact Address', user.emergencyContactAddress, 'text')}
          </DetailSection>

          {/* Identity Documents */}
          <DetailSection>
            <SectionTitle>Identity Documents</SectionTitle>
            {renderEditableField('aadharNumber', 'Aadhar Number', user.aadharNumber, 'text')}
            {renderEditableField('panNumber', 'PAN Number', user.panNumber, 'text')}
            {renderEditableField('passportNumber', 'Passport Number', user.passportNumber, 'text')}
            {renderEditableField('drivingLicenseNumber', 'Driving License', user.drivingLicenseNumber, 'text')}
            {renderEditableField('voterIdNumber', 'Voter ID', user.voterIdNumber, 'text')}
          </DetailSection>

          {/* Additional Information */}
          <DetailSection>
            <SectionTitle>Additional Information</SectionTitle>
            {renderEditableField('pets', 'Has Pets', user.pets ? 'Yes' : 'No', 'select', ['Yes', 'No'])}
            {renderEditableField('petsDetails', 'Pet Details', user.petsDetails, 'text')}
            {renderEditableField('clubMembership', 'Club Membership', user.clubMembership ? 'Yes' : 'No', 'select', ['Yes', 'No'])}
            {renderEditableField('clubMembershipDetails', 'Membership Details', user.clubMembershipDetails, 'text')}
          </DetailSection>

          {/* Family Members */}
          <DetailSection>
            <SectionHeader>
              <SectionTitle>Family Members</SectionTitle>
              <AddButton onClick={handleAddFamilyMember}>
                <FiPlus size={16} />
                Add Member
              </AddButton>
            </SectionHeader>
            {familyMembers.length === 0 ? (
              <EmptyState>
                <FiUser size={48} />
                <h4>No Family Members</h4>
                <p>Add your family members to keep their information organized</p>
              </EmptyState>
            ) : (
              familyMembers.map(member => (
                <ItemCard key={member.id}>
                  <ItemHeader>
                    <ItemInfo>
                      <ItemName>{member.name}</ItemName>
                      <ItemSubtitle>{member.relationship}</ItemSubtitle>
                      {member.emergencyContact && (
                        <ItemSubtitle style={{ color: '#dc2626', fontWeight: 'medium' }}>
                          Emergency Contact
                        </ItemSubtitle>
                      )}
                    </ItemInfo>
                    <ItemActions>
                      <IconButton 
                        onClick={() => toggleFamilyMemberExpand(member.id)}
                        title={expandedFamilyMembers.has(member.id) ? "Hide Details" : "View Details"}
                      >
                        {expandedFamilyMembers.has(member.id) ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </IconButton>
                      <IconButton 
                        className="edit" 
                        onClick={() => handleEditFamilyMember(member)}
                        title="Edit"
                      >
                        <FiEdit size={16} />
                      </IconButton>
                      <IconButton 
                        className="delete" 
                        onClick={() => handleDeleteFamilyMember(member.id)}
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </IconButton>
                    </ItemActions>
                  </ItemHeader>
                  {expandedFamilyMembers.has(member.id) && (
                    <ItemDetails>
                      <ItemDetail>
                        <ItemDetailLabel>Contact: </ItemDetailLabel>
                        {member.contactNumber || 'N/A'}
                      </ItemDetail>
                      <ItemDetail>
                        <ItemDetailLabel>Email: </ItemDetailLabel>
                        {member.email || 'N/A'}
                      </ItemDetail>
                      <ItemDetail>
                        <ItemDetailLabel>Date of Birth: </ItemDetailLabel>
                        {member.dateOfBirth || 'N/A'}
                      </ItemDetail>
                      <ItemDetail>
                        <ItemDetailLabel>Occupation: </ItemDetailLabel>
                        {member.occupation || 'N/A'}
                      </ItemDetail>
                    </ItemDetails>
                  )}
                </ItemCard>
              ))
            )}
          </DetailSection>

          {/* Vehicles */}
          <DetailSection>
            <SectionHeader>
              <SectionTitle>Vehicles</SectionTitle>
              <AddButton onClick={handleAddVehicle}>
                <FiPlus size={16} />
                Add Vehicle
              </AddButton>
            </SectionHeader>
            {vehicles.length === 0 ? (
              <EmptyState>
                <FiTruck size={48} />
                <h4>No Vehicles</h4>
                <p>Add your vehicles to manage parking and registrations</p>
              </EmptyState>
            ) : (
              vehicles.map(vehicle => (
                <ItemCard key={vehicle.id}>
                  <ItemHeader>
                    <ItemInfo>
                      <ItemName>{vehicle.vehicleNumber}</ItemName>
                      <ItemSubtitle>{vehicle.vehicleBrand} {vehicle.vehicleModel}</ItemSubtitle>
                      <ItemSubtitle>{vehicle.vehicleType} • {vehicle.vehicleColor}</ItemSubtitle>
                    </ItemInfo>
                    <ItemActions>
                      <IconButton 
                        onClick={() => toggleVehicleExpand(vehicle.id)}
                        title={expandedVehicles.has(vehicle.id) ? "Hide Details" : "View Details"}
                      >
                        {expandedVehicles.has(vehicle.id) ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                      </IconButton>
                      <IconButton 
                        className="edit" 
                        onClick={() => handleEditVehicle(vehicle)}
                        title="Edit"
                      >
                        <FiEdit size={16} />
                      </IconButton>
                      <IconButton 
                        className="delete" 
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        title="Delete"
                      >
                        <FiTrash2 size={16} />
                      </IconButton>
                    </ItemActions>
                  </ItemHeader>
                  {expandedVehicles.has(vehicle.id) && (
                    <ItemDetails>
                      <ItemDetail>
                        <ItemDetailLabel>Registration Date: </ItemDetailLabel>
                        {vehicle.registrationDate || 'N/A'}
                      </ItemDetail>
                      <ItemDetail>
                        <ItemDetailLabel>Insurance Expiry: </ItemDetailLabel>
                        {vehicle.insuranceExpiry || 'N/A'}
                      </ItemDetail>
                      <ItemDetail>
                        <ItemDetailLabel>PUC Expiry: </ItemDetailLabel>
                        {vehicle.pucExpiry || 'N/A'}
                      </ItemDetail>
                      <ItemDetail>
                        <ItemDetailLabel>Status: </ItemDetailLabel>
                        {vehicle.isActive ? 'Active' : 'Inactive'}
                      </ItemDetail>
                    </ItemDetails>
                  )}
                </ItemCard>
              ))
            )}
          </DetailSection>
        </ProfileGrid>
      </ProfileCard>

      {/* Family Member Modal */}
      <Modal isOpen={showFamilyModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingFamilyMember ? 'Edit Family Member' : 'Add Family Member'}
            </ModalTitle>
            <IconButton onClick={() => setShowFamilyModal(false)}>
              <FiX size={20} />
            </IconButton>
          </ModalHeader>
          <FormGrid>
            <DetailItem>
              <DetailLabel>Name *</DetailLabel>
              <Input
                type="text"
                value={familyFormData.name || ''}
                onChange={(e) => setFamilyFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
              />
            </DetailItem>
            <DetailItem>
              <DetailLabel>Relationship *</DetailLabel>
              <Select
                value={familyFormData.relationship || ''}
                onChange={(e) => setFamilyFormData(prev => ({ ...prev, relationship: e.target.value }))}
              >
                <option value="">Select Relationship</option>
                <option value="Spouse">Spouse</option>
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
                <option value="Sibling">Sibling</option>
                <option value="Grandparent">Grandparent</option>
                <option value="Grandchild">Grandchild</option>
                <option value="Other">Other</option>
              </Select>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Contact Number</DetailLabel>
              <Input
                type="tel"
                value={familyFormData.contactNumber || ''}
                onChange={(e) => setFamilyFormData(prev => ({ ...prev, contactNumber: e.target.value }))}
                placeholder="Enter contact number"
              />
            </DetailItem>
            <DetailItem>
              <DetailLabel>Email</DetailLabel>
              <Input
                type="email"
                value={familyFormData.email || ''}
                onChange={(e) => setFamilyFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
              />
            </DetailItem>
            <DetailItem>
              <DetailLabel>Date of Birth</DetailLabel>
              <Input
                type="date"
                value={familyFormData.dateOfBirth || ''}
                onChange={(e) => setFamilyFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
              />
            </DetailItem>
            <DetailItem>
              <DetailLabel>Occupation</DetailLabel>
              <Input
                type="text"
                value={familyFormData.occupation || ''}
                onChange={(e) => setFamilyFormData(prev => ({ ...prev, occupation: e.target.value }))}
                placeholder="Enter occupation"
              />
            </DetailItem>
            <FullWidthField>
              <DetailItem>
                <DetailLabel>
                  <input
                    type="checkbox"
                    checked={familyFormData.emergencyContact || false}
                    onChange={(e) => setFamilyFormData(prev => ({ ...prev, emergencyContact: e.target.checked }))}
                    style={{ marginRight: '8px' }}
                  />
                  Emergency Contact
                </DetailLabel>
              </DetailItem>
            </FullWidthField>
          </FormGrid>
          <ModalActions>
            <ActionButton className="primary" onClick={handleSaveFamilyMember}>
              <FiSave size={16} />
              {editingFamilyMember ? 'Update' : 'Add'} Member
            </ActionButton>
            <ActionButton className="cancel" onClick={() => setShowFamilyModal(false)}>
              <FiX size={16} />
              Cancel
            </ActionButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* Vehicle Modal */}
      <Modal isOpen={showVehicleModal}>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>
              {editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
            </ModalTitle>
            <IconButton onClick={() => setShowVehicleModal(false)}>
              <FiX size={20} />
            </IconButton>
          </ModalHeader>
          <FormGrid>
            <DetailItem>
              <DetailLabel>Vehicle Type *</DetailLabel>
              <Select
                value={vehicleFormData.vehicleType || ''}
                onChange={(e) => setVehicleFormData(prev => ({ ...prev, vehicleType: e.target.value }))}
              >
                <option value="">Select Type</option>
                <option value="Car">Car</option>
                <option value="Motorcycle">Motorcycle</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Bus">Bus</option>
                <option value="Other">Other</option>
              </Select>
            </DetailItem>
            <DetailItem>
              <DetailLabel>Vehicle Number *</DetailLabel>
              <Input
                type="text"
                value={vehicleFormData.vehicleNumber || ''}
                onChange={(e) => setVehicleFormData(prev => ({ ...prev, vehicleNumber: e.target.value.toUpperCase() }))}
                placeholder="e.g., ABC123"
                style={{ textTransform: 'uppercase' }}
              />
            </DetailItem>
            <DetailItem>
              <DetailLabel>Brand</DetailLabel>
              <Input
                type="text"
                value={vehicleFormData.vehicleBrand || ''}
                onChange={(e) => setVehicleFormData(prev => ({ ...prev, vehicleBrand: e.target.value }))}
                placeholder="e.g., Toyota"
              />
            </DetailItem>
            <DetailItem>
              <DetailLabel>Model *</DetailLabel>
              <Input
                type="text"
                value={vehicleFormData.vehicleModel || ''}
                onChange={(e) => setVehicleFormData(prev => ({ ...prev, vehicleModel: e.target.value }))}
                placeholder="e.g., Camry"
              />
            </DetailItem>
            <DetailItem>
              <DetailLabel>Color</DetailLabel>
              <Input
                type="text"
                value={vehicleFormData.vehicleColor || ''}
                onChange={(e) => setVehicleFormData(prev => ({ ...prev, vehicleColor: e.target.value }))}
                placeholder="e.g., Blue"
              />
            </DetailItem>
            <DetailItem>
              <DetailLabel>Registration Date</DetailLabel>
              <Input
                type="date"
                value={vehicleFormData.registrationDate || ''}
                onChange={(e) => setVehicleFormData(prev => ({ ...prev, registrationDate: e.target.value }))}
              />
            </DetailItem>
            <DetailItem>
              <DetailLabel>Insurance Expiry</DetailLabel>
              <Input
                type="date"
                value={vehicleFormData.insuranceExpiry || ''}
                onChange={(e) => setVehicleFormData(prev => ({ ...prev, insuranceExpiry: e.target.value }))}
              />
            </DetailItem>
            <DetailItem>
              <DetailLabel>PUC Expiry</DetailLabel>
              <Input
                type="date"
                value={vehicleFormData.pucExpiry || ''}
                onChange={(e) => setVehicleFormData(prev => ({ ...prev, pucExpiry: e.target.value }))}
              />
            </DetailItem>
            <FullWidthField>
              <DetailItem>
                <DetailLabel>
                  <input
                    type="checkbox"
                    checked={vehicleFormData.isActive !== false}
                    onChange={(e) => setVehicleFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    style={{ marginRight: '8px' }}
                  />
                  Vehicle is Active
                </DetailLabel>
              </DetailItem>
            </FullWidthField>
          </FormGrid>
          <ModalActions>
            <ActionButton className="primary" onClick={handleSaveVehicle}>
              <FiSave size={16} />
              {editingVehicle ? 'Update' : 'Add'} Vehicle
            </ActionButton>
            <ActionButton className="cancel" onClick={() => setShowVehicleModal(false)}>
              <FiX size={16} />
              Cancel
            </ActionButton>
          </ModalActions>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProfilePage;
