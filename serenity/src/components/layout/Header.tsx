import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiSearch, FiBell, FiUser, FiSettings, FiLogOut, FiHome, FiChevronDown, FiMapPin, FiHelpCircle, FiLock, FiEye, FiEyeOff, FiSave, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[6]};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const SocietyBanner = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.primary[600]});
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  max-width: 300px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.boxShadow.md};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 200px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const SocietyIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const SocietyInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const SocietyName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SocietySubtext = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  opacity: 0.8;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SocietyActions = styled.div`
  display: flex;
  align-items: center;
  margin-left: ${({ theme }) => theme.spacing[2]};
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
`;

const SocietySwitcher = styled.div`
  position: relative;
`;

const SocietyDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.lg};
  z-index: 1000;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  margin-top: ${({ theme }) => theme.spacing[2]};
  min-width: 300px;
`;

const SocietyOption = styled.div<{ isSelected: boolean }>`
  padding: ${({ theme }) => theme.spacing[3]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};
  background: ${({ isSelected, theme }) => 
    isSelected ? theme.colors.primary[50] : 'transparent'};
  color: ${({ theme }) => theme.colors.gray[900]};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }

  &:first-child {
    border-top-left-radius: ${({ theme }) => theme.borderRadius.xl};
    border-top-right-radius: ${({ theme }) => theme.borderRadius.xl};
  }

  &:last-child {
    border-bottom-left-radius: ${({ theme }) => theme.borderRadius.xl};
    border-bottom-right-radius: ${({ theme }) => theme.borderRadius.xl};
  }
`;

const SocietyOptionContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const SocietyOptionIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.primary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  flex-shrink: 0;
`;

const SocietyOptionInfo = styled.div`
  flex: 1;
`;

const SocietyOptionName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const SocietyOptionAddress = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 2px;
`;

const MenuButton = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.gray[600]};
  background: transparent;
  transition: ${({ theme }) => theme.transition.colors};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[900]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    display: flex;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  max-width: 400px;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  padding-left: ${({ theme }) => theme.spacing[10]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.gray[400]};
  width: 16px;
  height: 16px;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.gray[600]};
  background: transparent;
  transition: ${({ theme }) => theme.transition.colors};
  position: relative;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[900]};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: ${({ theme }) => theme.colors.error[500]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 2px solid ${({ theme }) => theme.colors.white};
`;

const UserMenu = styled.div`
  position: relative;
`;

const HelpMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: transparent;
  transition: ${({ theme }) => theme.transition.colors};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
  }
`;

const HelpButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]};
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[600]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const UserInfo = styled.div`
  text-align: left;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const UserName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const UserRole = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.boxShadow.lg};
  min-width: 200px;
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transform: translateY(${({ isOpen }) => (isOpen ? '0' : '-10px')});
  transition: all 0.2s ease-in-out;
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  text-align: left;
  color: ${({ theme }) => theme.colors.gray[700]};
  background: transparent;
  transition: ${({ theme }) => theme.transition.colors};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[900]};
  }

  &:first-child {
    border-radius: ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg} 0 0;
  }

  &:last-child {
    border-radius: 0 0 ${({ theme }) => theme.borderRadius.lg} ${({ theme }) => theme.borderRadius.lg};
  }
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.gray[200]};
  margin: ${({ theme }) => theme.spacing[1]} 0;
`;

// Change Password specific styled components
const PasswordFormContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal || 1000};
  padding: ${({ theme }) => theme.spacing[4]};
`;

const PasswordFormModal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.lg};
  width: 100%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const FormTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FormField = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FormLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const PasswordInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  padding-right: ${({ theme }) => theme.spacing[10]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &.error {
    border-color: ${({ theme }) => theme.colors.error[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.error[100]};
  }
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing[3]};
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  padding: 2px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const FormButton = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};

  &.primary {
    background: ${({ theme }) => theme.colors.primary[600]};
    color: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.primary[600]};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primary[700]};
    }
  }

  &.secondary {
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.gray[600]};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.gray[50]};
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.error[600]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const SuccessMessage = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.success[600]};
  background: ${({ theme }) => theme.colors.success[50]};
  border: 1px solid ${({ theme }) => theme.colors.success[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  padding: 2px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const Header: React.FC = () => {
  const { user, logout, switchSociety, getCurrentSociety, getUserSocieties } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHelpMenuOpen, setIsHelpMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSocietySwitcherOpen, setIsSocietySwitcherOpen] = useState(false);

  // Password change state
  const [isPasswordMenuOpen, setIsPasswordMenuOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Handle password modal separately - close when clicking the backdrop
      if (isPasswordMenuOpen && target === event.currentTarget) {
        setIsPasswordMenuOpen(false);
        return;
      }
      
      if (!target.closest('[data-menu]')) {
        setIsUserMenuOpen(false);
        setIsHelpMenuOpen(false);
        setIsSocietySwitcherOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPasswordMenuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
      // Still close the menu even if logout fails
      setIsUserMenuOpen(false);
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsUserMenuOpen(false);
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    setIsUserMenuOpen(false);
  };

  const handleHelpCenterClick = () => {
    navigate('/help-center');
    setIsHelpMenuOpen(false);
  };

  // Password change handlers
  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const handlePasswordFormChange = (field: keyof typeof passwordForm, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    
    // Clear errors for the field being edited
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Clear success message when user starts editing
    if (passwordChangeSuccess) {
      setPasswordChangeSuccess(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePasswordForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else {
      const passwordError = validatePassword(passwordForm.newPassword);
      if (passwordError) {
        errors.newPassword = passwordError;
      }
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    setIsChangingPassword(true);

    try {
      // Simulate API call - replace with actual password change logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would call an API endpoint here:
      // await changePassword({
      //   currentPassword: passwordForm.currentPassword,
      //   newPassword: passwordForm.newPassword
      // });

      setPasswordChangeSuccess(true);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswords({
        current: false,
        new: false,
        confirm: false
      });
      
      toast.success('Password changed successfully!');
      
      // Close the menu after a short delay
      setTimeout(() => {
        setIsPasswordMenuOpen(false);
        setPasswordChangeSuccess(false);
      }, 2000);

    } catch (error) {
      console.error('Password change failed:', error);
      setPasswordErrors({ 
        currentPassword: 'Failed to change password. Please check your current password and try again.' 
      });
      toast.error('Password change failed. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordErrors({});
    setShowPasswords({
      current: false,
      new: false,
      confirm: false
    });
    setPasswordChangeSuccess(false);
    setIsPasswordMenuOpen(false);
  };

  const closePasswordMenu = () => {
    handleCancelPasswordChange();
  };

  const handlePasswordMenuClick = () => {
    setIsUserMenuOpen(false); // Close the profile dropdown
    setIsPasswordMenuOpen(true); // Open the password form modal
  };

  const handleSocietySwitch = async (societyId: number) => {
    try {
      await switchSociety(societyId);
      setIsSocietySwitcherOpen(false);
      toast.success('Society switched successfully');
    } catch (error) {
      console.error('Society switch failed:', error);
      toast.error('Failed to switch society. Please try again.');
    }
  };

  const getUserInitials = (name: string): string => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);
  };

  const currentSociety = getCurrentSociety();
  const userSocieties = getUserSocieties();
  const hasMultipleSocieties = userSocieties.length > 1;

  return (
    <HeaderContainer>
      <LeftSection>
        <MenuButton>
          <FiMenu size={20} />
        </MenuButton>

        {/* Society Banner */}
        {currentSociety && (
          <SocietySwitcher>
            <SocietyBanner
              onClick={() => hasMultipleSocieties && setIsSocietySwitcherOpen(!isSocietySwitcherOpen)}
              style={{ cursor: hasMultipleSocieties ? 'pointer' : 'default' }}
            >
              <SocietyIcon>
                <FiHome size={16} />
              </SocietyIcon>
              <SocietyInfo>
                <SocietyName>{currentSociety.name}</SocietyName>
                <SocietySubtext>
                  <FiMapPin size={10} style={{ marginRight: 4 }} />
                  {currentSociety.city}
                </SocietySubtext>
              </SocietyInfo>
              {hasMultipleSocieties && (
                <SocietyActions>
                  <FiChevronDown size={14} />
                </SocietyActions>
              )}
            </SocietyBanner>

            {/* Society Switcher Dropdown */}
            {hasMultipleSocieties && (
              <SocietyDropdown isOpen={isSocietySwitcherOpen}>
                {userSocieties.map((membership) => (
                  <SocietyOption
                    key={membership.societyId}
                    isSelected={membership.societyId === currentSociety?.id}
                    onClick={() => handleSocietySwitch(membership.societyId)}
                  >
                    <SocietyOptionContent>
                      <SocietyOptionIcon>
                        <FiHome size={16} />
                      </SocietyOptionIcon>
                      <SocietyOptionInfo>
                        <SocietyOptionName>{membership.society.name}</SocietyOptionName>
                        <SocietyOptionAddress>
                          <FiMapPin size={12} />
                          {membership.society.address}, {membership.society.city}
                        </SocietyOptionAddress>
                      </SocietyOptionInfo>
                    </SocietyOptionContent>
                  </SocietyOption>
                ))}
              </SocietyDropdown>
            )}
          </SocietySwitcher>
        )}
        
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
      </LeftSection>

      <RightSection>
        <IconButton>
          <FiBell size={20} />
          <NotificationBadge />
        </IconButton>

        <HelpMenu data-menu>
          <HelpButton
            onClick={() => setIsHelpMenuOpen(!isHelpMenuOpen)}
          >
            <FiHelpCircle size={20} />
            <span>Help</span>
            <FiChevronDown size={16} />
          </HelpButton>

          <DropdownMenu isOpen={isHelpMenuOpen}>
            <DropdownItem onClick={handleHelpCenterClick}>
              <FiHelpCircle size={16} />
              Help Center
            </DropdownItem>
          </DropdownMenu>
        </HelpMenu>

        <UserMenu data-menu>
          <UserButton
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <UserAvatar>
              {user?.name
                ? getUserInitials(user.name)
                : <FiUser size={16} />
              }
            </UserAvatar>
            <UserInfo>
              <UserName>
                {user?.name}
              </UserName>
              <UserRole>{user?.occupation}</UserRole>
            </UserInfo>
          </UserButton>

          <DropdownMenu isOpen={isUserMenuOpen}>
            <DropdownItem onClick={handleProfileClick}>
              <FiUser size={16} />
              Profile
            </DropdownItem>
            <DropdownItem onClick={handlePasswordMenuClick}>
              <FiLock size={16} />
              Change Password
            </DropdownItem>
            <DropdownItem onClick={handleSettingsClick}>
              <FiSettings size={16} />
              Settings
            </DropdownItem>
            <Divider />
            <DropdownItem onClick={handleLogout}>
              <FiLogOut size={16} />
              Logout
            </DropdownItem>
          </DropdownMenu>
        </UserMenu>
      </RightSection>

      {/* Password Change Modal */}
      <PasswordFormContainer 
        isOpen={isPasswordMenuOpen}
        onClick={(e) => {
          // Close modal when clicking backdrop
          if (e.target === e.currentTarget) {
            closePasswordMenu();
          }
        }}
      >
        <PasswordFormModal>
          <FormTitle>
            Change Password
            <CloseButton onClick={closePasswordMenu}>
              <FiX size={20} />
            </CloseButton>
          </FormTitle>

          {passwordChangeSuccess && (
            <SuccessMessage>
              Password changed successfully!
            </SuccessMessage>
          )}

          <FormField>
            <FormLabel htmlFor="currentPassword">Current Password</FormLabel>
            <PasswordInputContainer>
              <PasswordInput
                id="currentPassword"
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordFormChange('currentPassword', e.target.value)}
                placeholder="Enter current password"
                className={passwordErrors.currentPassword ? 'error' : ''}
                disabled={isChangingPassword}
              />
              <PasswordToggle
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                disabled={isChangingPassword}
              >
                {showPasswords.current ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </PasswordToggle>
            </PasswordInputContainer>
            {passwordErrors.currentPassword && (
              <ErrorMessage>{passwordErrors.currentPassword}</ErrorMessage>
            )}
          </FormField>

          <FormField>
            <FormLabel htmlFor="newPassword">New Password</FormLabel>
            <PasswordInputContainer>
              <PasswordInput
                id="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordFormChange('newPassword', e.target.value)}
                placeholder="Enter new password"
                className={passwordErrors.newPassword ? 'error' : ''}
                disabled={isChangingPassword}
              />
              <PasswordToggle
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                disabled={isChangingPassword}
              >
                {showPasswords.new ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </PasswordToggle>
            </PasswordInputContainer>
            {passwordErrors.newPassword && (
              <ErrorMessage>{passwordErrors.newPassword}</ErrorMessage>
            )}
          </FormField>

          <FormField>
            <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
            <PasswordInputContainer>
              <PasswordInput
                id="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordFormChange('confirmPassword', e.target.value)}
                placeholder="Confirm new password"
                className={passwordErrors.confirmPassword ? 'error' : ''}
                disabled={isChangingPassword}
              />
              <PasswordToggle
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                disabled={isChangingPassword}
              >
                {showPasswords.confirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </PasswordToggle>
            </PasswordInputContainer>
            {passwordErrors.confirmPassword && (
              <ErrorMessage>{passwordErrors.confirmPassword}</ErrorMessage>
            )}
          </FormField>

          <FormActions>
            <FormButton
              type="button"
              className="primary"
              onClick={handlePasswordChange}
              disabled={isChangingPassword}
            >
              <FiSave size={16} />
              {isChangingPassword ? 'Changing...' : 'Change Password'}
            </FormButton>
            <FormButton
              type="button"
              className="secondary"
              onClick={handleCancelPasswordChange}
              disabled={isChangingPassword}
            >
              <FiX size={16} />
              Cancel
            </FormButton>
          </FormActions>
        </PasswordFormModal>
      </PasswordFormContainer>
    </HeaderContainer>
  );
};

export default Header;
