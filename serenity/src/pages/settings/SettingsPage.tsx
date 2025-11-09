import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiEdit, 
  FiSave, 
  FiX, 
  FiSettings, 
  FiMail, 
  FiMessageSquare, 
  FiBell, 
  FiCreditCard, 
  FiShield, 
  FiEye, 
  FiEyeOff, 
  FiLock, 
  FiLogOut,
  FiToggleLeft,
  FiToggleRight,
  FiClock,
  FiDollarSign,
  FiUsers,
  FiGlobe,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { 
  SettingsData, 
  CommunicationPreferences, 
  NotificationSettings, 
  PaymentSettings, 
  SecuritySettings, 
  PrivacySettings 
} from '../../types/settings';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;

const SettingsCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    box-shadow: ${({ theme }) => theme.boxShadow.md};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding-bottom: ${({ theme }) => theme.spacing[3]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary[200]};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[800]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  flex: 1;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
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
`;

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.primary[600]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[700]};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[600]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }
`;

const SettingField = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  &:last-child {
    margin-bottom: 0;
  }
`;

const FieldLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const FieldValue = styled.div`
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

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const ToggleLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ToggleButton = styled.button<{ isOn: boolean }>`
  background: transparent;
  border: none;
  color: ${({ theme, isOn }) => 
    isOn ? theme.colors.primary[600] : theme.colors.gray[400]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};

  &:hover {
    color: ${({ theme, isOn }) => 
      isOn ? theme.colors.primary[700] : theme.colors.gray[600]};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const StatusBadge = styled.span<{ status: 'enabled' | 'disabled' }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background: ${({ theme, status }) => 
    status === 'enabled' ? theme.colors.success[100] : theme.colors.gray[100]};
  color: ${({ theme, status }) => 
    status === 'enabled' ? theme.colors.success[700] : theme.colors.gray[600]};
`;

const LogoutCard = styled(SettingsCard)`
  text-align: center;
  border-color: ${({ theme }) => theme.colors.error[200]};
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.error[600]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.error[700]};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.success[50]};
  border: 1px solid ${({ theme }) => theme.colors.success[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.success[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Section key mapping
  type SectionKey = 'communication' | 'notification' | 'payment' | 'security' | 'privacy';
  type SettingsKey = keyof SettingsData;
  
  const sectionMapping: Record<SectionKey, SettingsKey> = {
    communication: 'communicationPreferences',
    notification: 'notificationSettings',
    payment: 'paymentSettings',
    security: 'securitySettings',
    privacy: 'privacySettings',
  };

  // Edit states for each section
  const [editStates, setEditStates] = useState<Record<SectionKey, boolean>>({
    communication: false,
    notification: false,
    payment: false,
    security: false,
    privacy: false,
  });

  // Success states for each section
  const [successStates, setSuccessStates] = useState<Record<SectionKey, boolean>>({
    communication: false,
    notification: false,
    payment: false,
    security: false,
    privacy: false,
  });

  // Sample settings data - in real app, this would come from API
  const [settingsData, setSettingsData] = useState<SettingsData>({
    communicationPreferences: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      emailFrequency: 'daily',
      smsFrequency: 'never',
      pushFrequency: 'immediate',
      marketingEmails: false,
      systemAlerts: true,
      societyUpdates: true,
    },
    notificationSettings: {
      emailNotifications: {
        enabled: true,
        announcements: true,
        maintenanceUpdates: true,
        paymentReminders: true,
        eventInvitations: true,
        emergencyAlerts: true,
      },
      smsNotifications: {
        enabled: false,
        emergencyOnly: true,
        paymentReminders: false,
        maintenanceUpdates: false,
      },
      pushNotifications: {
        enabled: true,
        announcements: true,
        chatMessages: true,
        eventReminders: true,
        emergencyAlerts: true,
      },
      quietHours: {
        enabled: false,
        startTime: '22:00',
        endTime: '08:00',
      },
    },
    paymentSettings: {
      paymentMethods: [
        {
          id: '1',
          type: 'credit_card',
          name: 'Visa ending in 4242',
          lastFour: '4242',
          expiryDate: '12/25',
          isDefault: true,
          isActive: true,
        },
      ],
      defaultPaymentMethod: '1',
      paymentGateway: 'stripe',
      autoPayEnabled: false,
      paymentReminders: true,
      paymentSchedule: 'monthly',
      billingAddress: {
        street: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
      },
    },
    securitySettings: {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSymbols: true,
        passwordExpiry: 90,
      },
      twoFactorAuth: {
        enabled: false,
        method: 'none',
        backupCodes: [],
      },
      accessControl: {
        sessionTimeout: 30,
        allowMultipleSessions: true,
        ipWhitelist: [],
        loginAttempts: 5,
        lockoutDuration: 15,
      },
      auditLog: {
        enabled: true,
        retentionPeriod: 365,
      },
    },
    privacySettings: {
      dataRetention: {
        personalDataRetention: 7,
        activityLogRetention: 2,
        automaticDeletion: true,
      },
      dataSharing: {
        shareWithSociety: true,
        shareWithVendors: false,
        shareWithThirdParties: false,
        marketingConsent: false,
        analyticsConsent: true,
      },
      dataProtection: {
        encryptPersonalData: true,
        anonymizeData: false,
        dataPortabilityEnabled: true,
        rightToErasure: true,
      },
      visibility: {
        profileVisibility: 'society_only',
        contactInfoVisibility: 'society_only',
        activityVisibility: 'private',
      },
    },
  });

  // Temporary edit data
  const [editData, setEditData] = useState<Partial<SettingsData>>({});

  const handleEditToggle = useCallback((section: SectionKey) => {
    setEditStates(prev => ({ ...prev, [section]: !prev[section] }));
    if (!editStates[section]) {
      // Initialize edit data when starting to edit
      const settingsKey = sectionMapping[section];
      setEditData(prev => ({ ...prev, [settingsKey]: settingsData[settingsKey] }));
    }
    // Clear success message when starting to edit
    setSuccessStates(prev => ({ ...prev, [section]: false }));
  }, [editStates, settingsData, sectionMapping]);

  const handleSave = useCallback(async (section: SectionKey) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update settings data
      const settingsKey = sectionMapping[section];
      setSettingsData(prev => ({
        ...prev,
        [settingsKey]: editData[settingsKey] || prev[settingsKey],
      }));
      
      // Reset edit state
      setEditStates(prev => ({ ...prev, [section]: false }));
      setSuccessStates(prev => ({ ...prev, [section]: true }));
      
      toast.success(`${section} settings updated successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessStates(prev => ({ ...prev, [section]: false }));
      }, 3000);
    } catch (error) {
      toast.error(`Failed to update ${section} settings. Please try again.`);
    }
  }, [editData, sectionMapping]);

  const handleCancel = useCallback((section: SectionKey) => {
    setEditStates(prev => ({ ...prev, [section]: false }));
    const settingsKey = sectionMapping[section];
    setEditData(prev => ({ ...prev, [settingsKey]: undefined }));
    setSuccessStates(prev => ({ ...prev, [section]: false }));
  }, [sectionMapping]);

  const handleLogout = useCallback(async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        await logout();
        toast.success('Logged out successfully');
      } catch (error) {
        toast.error('Logout failed. Please try again.');
      }
    }
  }, [logout]);

  const updateEditData = useCallback((section: SectionKey, field: string, value: any) => {
    const settingsKey = sectionMapping[section];
    setEditData(prev => ({
      ...prev,
      [settingsKey]: {
        ...prev[settingsKey],
        [field]: value,
      },
    }));
  }, [sectionMapping]);

  const renderToggle = (
    section: SectionKey,
    field: string,
    value: boolean,
    label: string,
    isEditing: boolean
  ) => (
    <ToggleContainer>
      <ToggleLabel>{label}</ToggleLabel>
      {isEditing ? (
        <ToggleButton
          type="button"
          isOn={value}
          onClick={() => updateEditData(section, field, !value)}
        >
          {value ? <FiToggleRight size={24} /> : <FiToggleLeft size={24} />}
        </ToggleButton>
      ) : (
        <StatusBadge status={value ? 'enabled' : 'disabled'}>
          {value ? 'Enabled' : 'Disabled'}
        </StatusBadge>
      )}
    </ToggleContainer>
  );

  if (!user) {
    return (
      <Container>
        <Title>
          <FiSettings size={32} />
          Settings
        </Title>
        <SettingsCard>
          <CardTitle>Loading settings...</CardTitle>
        </SettingsCard>
      </Container>
    );
  }

  return (
    <Container>
      <Title>
        <FiSettings size={32} />
        Settings
      </Title>

      <SettingsGrid>
        {/* Communication Preferences */}
        <SettingsCard>
          <CardHeader>
            <CardTitle>
              <FiMail size={20} />
              Communication Preferences
            </CardTitle>
            {!editStates.communication ? (
              <EditButton onClick={() => handleEditToggle('communication')}>
                <FiEdit size={16} />
                Edit
              </EditButton>
            ) : (
              <ButtonGroup>
                <SaveButton onClick={() => handleSave('communication')}>
                  <FiSave size={16} />
                  Save
                </SaveButton>
                <CancelButton onClick={() => handleCancel('communication')}>
                  <FiX size={16} />
                  Cancel
                </CancelButton>
              </ButtonGroup>
            )}
          </CardHeader>

          {successStates.communication && (
            <SuccessMessage>
              <FiCheck size={16} />
              Communication preferences updated successfully!
            </SuccessMessage>
          )}

          {renderToggle(
            'communication',
            'emailNotifications',
            editStates.communication 
              ? (editData.communicationPreferences as any)?.emailNotifications ?? settingsData.communicationPreferences.emailNotifications
              : settingsData.communicationPreferences.emailNotifications,
            'Email Notifications',
            editStates.communication
          )}

          {renderToggle(
            'communication',
            'smsNotifications',
            editStates.communication 
              ? (editData.communicationPreferences as any)?.smsNotifications ?? settingsData.communicationPreferences.smsNotifications
              : settingsData.communicationPreferences.smsNotifications,
            'SMS Notifications',
            editStates.communication
          )}

          {renderToggle(
            'communication',
            'pushNotifications',
            editStates.communication 
              ? (editData.communicationPreferences as any)?.pushNotifications ?? settingsData.communicationPreferences.pushNotifications
              : settingsData.communicationPreferences.pushNotifications,
            'Push Notifications',
            editStates.communication
          )}

          <SettingField>
            <FieldLabel>Email Frequency</FieldLabel>
            {editStates.communication ? (
              <Select
                value={(editData.communicationPreferences as any)?.emailFrequency ?? settingsData.communicationPreferences.emailFrequency}
                onChange={(e) => updateEditData('communication', 'emailFrequency', e.target.value)}
              >
                <option value="immediate">Immediate</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="never">Never</option>
              </Select>
            ) : (
              <FieldValue>{settingsData.communicationPreferences.emailFrequency}</FieldValue>
            )}
          </SettingField>
        </SettingsCard>

        {/* Notification Settings */}
        <SettingsCard>
          <CardHeader>
            <CardTitle>
              <FiBell size={20} />
              Notification Settings
            </CardTitle>
            {!editStates.notification ? (
              <EditButton onClick={() => handleEditToggle('notification')}>
                <FiEdit size={16} />
                Edit
              </EditButton>
            ) : (
              <ButtonGroup>
                <SaveButton onClick={() => handleSave('notification')}>
                  <FiSave size={16} />
                  Save
                </SaveButton>
                <CancelButton onClick={() => handleCancel('notification')}>
                  <FiX size={16} />
                  Cancel
                </CancelButton>
              </ButtonGroup>
            )}
          </CardHeader>

          {successStates.notification && (
            <SuccessMessage>
              <FiCheck size={16} />
              Notification settings updated successfully!
            </SuccessMessage>
          )}

          {renderToggle(
            'notification',
            'emailNotifications.enabled',
            editStates.notification 
              ? (editData.notificationSettings as any)?.emailNotifications?.enabled ?? settingsData.notificationSettings.emailNotifications.enabled
              : settingsData.notificationSettings.emailNotifications.enabled,
            'Email Notifications',
            editStates.notification
          )}

          {renderToggle(
            'notification',
            'smsNotifications.enabled',
            editStates.notification 
              ? (editData.notificationSettings as any)?.smsNotifications?.enabled ?? settingsData.notificationSettings.smsNotifications.enabled
              : settingsData.notificationSettings.smsNotifications.enabled,
            'SMS Notifications',
            editStates.notification
          )}

          {renderToggle(
            'notification',
            'pushNotifications.enabled',
            editStates.notification 
              ? (editData.notificationSettings as any)?.pushNotifications?.enabled ?? settingsData.notificationSettings.pushNotifications.enabled
              : settingsData.notificationSettings.pushNotifications.enabled,
            'Push Notifications',
            editStates.notification
          )}

          {renderToggle(
            'notification',
            'quietHours.enabled',
            editStates.notification 
              ? (editData.notificationSettings as any)?.quietHours?.enabled ?? settingsData.notificationSettings.quietHours.enabled
              : settingsData.notificationSettings.quietHours.enabled,
            'Quiet Hours',
            editStates.notification
          )}
        </SettingsCard>

        {/* Payment Settings */}
        <SettingsCard>
          <CardHeader>
            <CardTitle>
              <FiCreditCard size={20} />
              Payment Settings
            </CardTitle>
            {!editStates.payment ? (
              <EditButton onClick={() => handleEditToggle('payment')}>
                <FiEdit size={16} />
                Edit
              </EditButton>
            ) : (
              <ButtonGroup>
                <SaveButton onClick={() => handleSave('payment')}>
                  <FiSave size={16} />
                  Save
                </SaveButton>
                <CancelButton onClick={() => handleCancel('payment')}>
                  <FiX size={16} />
                  Cancel
                </CancelButton>
              </ButtonGroup>
            )}
          </CardHeader>

          {successStates.payment && (
            <SuccessMessage>
              <FiCheck size={16} />
              Payment settings updated successfully!
            </SuccessMessage>
          )}

          <SettingField>
            <FieldLabel>Default Payment Method</FieldLabel>
            <FieldValue>
              {settingsData.paymentSettings.paymentMethods.find(m => m.isDefault)?.name || 'None'}
            </FieldValue>
          </SettingField>

          <SettingField>
            <FieldLabel>Payment Gateway</FieldLabel>
            {editStates.payment ? (
              <Select
                value={(editData.paymentSettings as any)?.paymentGateway ?? settingsData.paymentSettings.paymentGateway}
                onChange={(e) => updateEditData('payment', 'paymentGateway', e.target.value)}
              >
                <option value="stripe">Stripe</option>
                <option value="razorpay">Razorpay</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Bank Transfer</option>
              </Select>
            ) : (
              <FieldValue>{settingsData.paymentSettings.paymentGateway}</FieldValue>
            )}
          </SettingField>

          {renderToggle(
            'payment',
            'autoPayEnabled',
            editStates.payment 
              ? (editData.paymentSettings as any)?.autoPayEnabled ?? settingsData.paymentSettings.autoPayEnabled
              : settingsData.paymentSettings.autoPayEnabled,
            'Auto Pay',
            editStates.payment
          )}

          <SettingField>
            <FieldLabel>Payment Schedule</FieldLabel>
            {editStates.payment ? (
              <Select
                value={(editData.paymentSettings as any)?.paymentSchedule ?? settingsData.paymentSettings.paymentSchedule}
                onChange={(e) => updateEditData('payment', 'paymentSchedule', e.target.value)}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </Select>
            ) : (
              <FieldValue>{settingsData.paymentSettings.paymentSchedule}</FieldValue>
            )}
          </SettingField>
        </SettingsCard>

        {/* Security Settings */}
        <SettingsCard>
          <CardHeader>
            <CardTitle>
              <FiShield size={20} />
              Security Settings
            </CardTitle>
            {!editStates.security ? (
              <EditButton onClick={() => handleEditToggle('security')}>
                <FiEdit size={16} />
                Edit
              </EditButton>
            ) : (
              <ButtonGroup>
                <SaveButton onClick={() => handleSave('security')}>
                  <FiSave size={16} />
                  Save
                </SaveButton>
                <CancelButton onClick={() => handleCancel('security')}>
                  <FiX size={16} />
                  Cancel
                </CancelButton>
              </ButtonGroup>
            )}
          </CardHeader>

          {successStates.security && (
            <SuccessMessage>
              <FiCheck size={16} />
              Security settings updated successfully!
            </SuccessMessage>
          )}

          {renderToggle(
            'security',
            'twoFactorAuth.enabled',
            editStates.security 
              ? (editData.securitySettings as any)?.twoFactorAuth?.enabled ?? settingsData.securitySettings.twoFactorAuth.enabled
              : settingsData.securitySettings.twoFactorAuth.enabled,
            'Two-Factor Authentication',
            editStates.security
          )}

          <SettingField>
            <FieldLabel>Session Timeout (minutes)</FieldLabel>
            {editStates.security ? (
              <Input
                type="number"
                min="5"
                max="480"
                value={(editData.securitySettings as any)?.accessControl?.sessionTimeout ?? settingsData.securitySettings.accessControl.sessionTimeout}
                onChange={(e) => updateEditData('security', 'accessControl.sessionTimeout', parseInt(e.target.value))}
              />
            ) : (
              <FieldValue>{settingsData.securitySettings.accessControl.sessionTimeout} minutes</FieldValue>
            )}
          </SettingField>

          {renderToggle(
            'security',
            'accessControl.allowMultipleSessions',
            editStates.security 
              ? (editData.securitySettings as any)?.accessControl?.allowMultipleSessions ?? settingsData.securitySettings.accessControl.allowMultipleSessions
              : settingsData.securitySettings.accessControl.allowMultipleSessions,
            'Allow Multiple Sessions',
            editStates.security
          )}

          {renderToggle(
            'security',
            'auditLog.enabled',
            editStates.security 
              ? (editData.securitySettings as any)?.auditLog?.enabled ?? settingsData.securitySettings.auditLog.enabled
              : settingsData.securitySettings.auditLog.enabled,
            'Audit Logging',
            editStates.security
          )}
        </SettingsCard>

        {/* Privacy Settings */}
        <SettingsCard>
          <CardHeader>
            <CardTitle>
              <FiEye size={20} />
              Privacy Settings
            </CardTitle>
            {!editStates.privacy ? (
              <EditButton onClick={() => handleEditToggle('privacy')}>
                <FiEdit size={16} />
                Edit
              </EditButton>
            ) : (
              <ButtonGroup>
                <SaveButton onClick={() => handleSave('privacy')}>
                  <FiSave size={16} />
                  Save
                </SaveButton>
                <CancelButton onClick={() => handleCancel('privacy')}>
                  <FiX size={16} />
                  Cancel
                </CancelButton>
              </ButtonGroup>
            )}
          </CardHeader>

          {successStates.privacy && (
            <SuccessMessage>
              <FiCheck size={16} />
              Privacy settings updated successfully!
            </SuccessMessage>
          )}

          <SettingField>
            <FieldLabel>Profile Visibility</FieldLabel>
            {editStates.privacy ? (
              <Select
                value={(editData.privacySettings as any)?.visibility?.profileVisibility ?? settingsData.privacySettings.visibility.profileVisibility}
                onChange={(e) => updateEditData('privacy', 'visibility.profileVisibility', e.target.value)}
              >
                <option value="public">Public</option>
                <option value="society_only">Society Only</option>
                <option value="private">Private</option>
              </Select>
            ) : (
              <FieldValue>{settingsData.privacySettings.visibility.profileVisibility}</FieldValue>
            )}
          </SettingField>

          {renderToggle(
            'privacy',
            'dataSharing.shareWithSociety',
            editStates.privacy 
              ? (editData.privacySettings as any)?.dataSharing?.shareWithSociety ?? settingsData.privacySettings.dataSharing.shareWithSociety
              : settingsData.privacySettings.dataSharing.shareWithSociety,
            'Share with Society',
            editStates.privacy
          )}

          {renderToggle(
            'privacy',
            'dataSharing.marketingConsent',
            editStates.privacy 
              ? (editData.privacySettings as any)?.dataSharing?.marketingConsent ?? settingsData.privacySettings.dataSharing.marketingConsent
              : settingsData.privacySettings.dataSharing.marketingConsent,
            'Marketing Consent',
            editStates.privacy
          )}

          {renderToggle(
            'privacy',
            'dataProtection.encryptPersonalData',
            editStates.privacy 
              ? (editData.privacySettings as any)?.dataProtection?.encryptPersonalData ?? settingsData.privacySettings.dataProtection.encryptPersonalData
              : settingsData.privacySettings.dataProtection.encryptPersonalData,
            'Encrypt Personal Data',
            editStates.privacy
          )}

          <SettingField>
            <FieldLabel>Personal Data Retention (years)</FieldLabel>
            {editStates.privacy ? (
              <Input
                type="number"
                min="1"
                max="10"
                value={(editData.privacySettings as any)?.dataRetention?.personalDataRetention ?? settingsData.privacySettings.dataRetention.personalDataRetention}
                onChange={(e) => updateEditData('privacy', 'dataRetention.personalDataRetention', parseInt(e.target.value))}
              />
            ) : (
              <FieldValue>{settingsData.privacySettings.dataRetention.personalDataRetention} years</FieldValue>
            )}
          </SettingField>
        </SettingsCard>

        {/* Logout Section */}
        <LogoutCard>
          <CardHeader>
            <CardTitle>
              <FiLogOut size={20} />
              Account Actions
            </CardTitle>
          </CardHeader>

          <p style={{ 
            marginBottom: '24px', 
            color: '#6b7280', 
            fontSize: '14px',
            textAlign: 'center'
          }}>
            Sign out of your account on this device. You'll need to sign in again to access your account.
          </p>

          <LogoutButton onClick={handleLogout}>
            <FiLogOut size={20} />
            Logout
          </LogoutButton>
        </LogoutCard>
      </SettingsGrid>
    </Container>
  );
};

export default SettingsPage;