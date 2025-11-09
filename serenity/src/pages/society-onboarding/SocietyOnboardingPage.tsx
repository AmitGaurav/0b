import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  FaBuilding, 
  FaCheckCircle, 
  FaUserCog, 
  FaSwimmingPool, 
  FaParking,
  FaHome,
  FaUsers,
  FaCog,
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaPlus,
  FaUserCheck,
  FaClipboardList,
  FaBan,
  FaUpload
} from 'react-icons/fa';
import { useAuthContext } from '../../contexts/AuthContext';
import { 
  SocietyOnboardingModule, 
  SocietyOnboardingModuleType, 
  OnboardingModuleCategory, 
  OnboardingUserRole, 
  OnboardingPermission,
  canAccessOnboardingModule,
  hasOnboardingPermission 
} from '../../types/society-onboarding-modules';

const OnboardingContainer = styled.div`
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
`;

const HeaderTitle = styled.h1`
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
`;

const HeaderDescription = styled.p`
  color: #7f8c8d;
  margin: 0;
  font-size: 1rem;
`;

const FilterSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const SearchBox = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid #e0e6ed;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #bdc3c7;
`;

const CategoryFilters = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const CategoryFilter = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.$active ? '#667eea' : '#e0e6ed'};
  background: ${props => props.$active ? '#667eea' : 'white'};
  color: ${props => props.$active ? 'white' : '#2c3e50'};
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  
  &:hover {
    border-color: #667eea;
    background: ${props => props.$active ? '#5a67d8' : '#ecf0f1'};
  }
`;

const ModulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
`;

const ModuleCard = styled.div<{ $color: string }>`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.$color};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const ModuleHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ModuleIcon = styled.div<{ $color: string }>`
  width: 3rem;
  height: 3rem;
  border-radius: 10px;
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  flex-shrink: 0;
`;

const ModuleInfo = styled.div`
  flex: 1;
`;

const ModuleTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
`;

const ModuleDescription = styled.p`
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const PermissionBadges = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const PermissionBadge = styled.span<{ $type: 'view' | 'edit' | 'admin' }>`
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.$type) {
      case 'view': return '#e8f5e8';
      case 'edit': return '#fff3cd';
      case 'admin': return '#f8d7da';
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'view': return '#155724';
      case 'edit': return '#856404';
      case 'admin': return '#721c24';
    }
  }};
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const RoleBadge = styled.div<{ $role: OnboardingUserRole }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background: ${props => {
    switch (props.$role) {
      case OnboardingUserRole.ADMIN: return '#e74c3c';
      case OnboardingUserRole.USER: return '#667eea';
      case OnboardingUserRole.GUEST: return '#95a5a6';
    }
  }};
  color: white;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const SocietyOnboardingPage: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<OnboardingModuleCategory | 'ALL'>('ALL');
  
  // Set user role to ADMIN for highest level access
  const currentUserRole = OnboardingUserRole.ADMIN;

  // Society Onboarding modules configuration
  const onboardingModules: SocietyOnboardingModule[] = [
    {
      id: SocietyOnboardingModuleType.SOCIETY_REGISTRATION,
      title: 'Society Registration',
      description: 'Register new societies with complete documentation and approval workflow',
      icon: 'FaBuilding',
      route: '/society-registration',
      category: OnboardingModuleCategory.SETUP,
      color: '#3498db',
      isActive: true,
      permissions: {
        [OnboardingUserRole.ADMIN]: [OnboardingPermission.VIEW, OnboardingPermission.APPROVE, OnboardingPermission.REJECT],
        [OnboardingUserRole.USER]: [OnboardingPermission.VIEW],
        [OnboardingUserRole.GUEST]: [OnboardingPermission.VIEW]
      }
    },
    {
      id: SocietyOnboardingModuleType.SOCIETY_VERIFICATION,
      title: 'Society Verification',
      description: 'Verify society documents and legal compliance for full activation',
      icon: 'FaCheckCircle',
      route: '/society-verification',
      category: OnboardingModuleCategory.SETUP,
      color: '#2ecc71',
      isActive: true,
      permissions: {
        [OnboardingUserRole.ADMIN]: [OnboardingPermission.VIEW, OnboardingPermission.APPROVE, OnboardingPermission.REJECT],
        [OnboardingUserRole.USER]: [OnboardingPermission.VIEW],
        [OnboardingUserRole.GUEST]: [OnboardingPermission.VIEW]
      }
    },
    {
      id: SocietyOnboardingModuleType.SOCIETY_PROFILE_MANAGEMENT,
      title: 'Society Profile Management',
      description: 'Manage society committees, committee members, and organizational structure',
      icon: 'FaUserCog',
      route: '/society-profile-management',
      category: OnboardingModuleCategory.MANAGEMENT,
      color: '#9b59b6',
      isActive: true,
      permissions: {
        [OnboardingUserRole.ADMIN]: [OnboardingPermission.VIEW, OnboardingPermission.EDIT],
        [OnboardingUserRole.USER]: [OnboardingPermission.VIEW],
        [OnboardingUserRole.GUEST]: [OnboardingPermission.VIEW]
      }
    },
    {
      id: SocietyOnboardingModuleType.SOCIETY_MEMBERS,
      title: 'Society Members',
      description: 'Comprehensive member management including registration, verification, profiles, documents, units, and parking',
      icon: 'FaUsers',
      route: '/society-members',
      category: OnboardingModuleCategory.MANAGEMENT,
      color: '#16a085',
      isActive: true,
      permissions: {
        [OnboardingUserRole.ADMIN]: [OnboardingPermission.VIEW, OnboardingPermission.ADD, OnboardingPermission.EDIT, OnboardingPermission.DELETE, OnboardingPermission.APPROVE, OnboardingPermission.REJECT],
        [OnboardingUserRole.USER]: [OnboardingPermission.VIEW],
        [OnboardingUserRole.GUEST]: [OnboardingPermission.VIEW]
      }
    },
    {
      id: SocietyOnboardingModuleType.BULK_UPLOAD,
      title: 'Bulk Upload Center',
      description: 'Comprehensive bulk upload functionality for efficient data management across all society modules with 40+ upload types',
      icon: 'FaUpload',
      route: '/society-onboarding/bulk-upload',
      category: OnboardingModuleCategory.MANAGEMENT,
      color: '#e74c3c',
      isActive: true,
      permissions: {
        [OnboardingUserRole.ADMIN]: [OnboardingPermission.VIEW, OnboardingPermission.ADD, OnboardingPermission.EDIT, OnboardingPermission.DELETE, OnboardingPermission.MANAGE],
        [OnboardingUserRole.USER]: [],
        [OnboardingUserRole.GUEST]: []
      }
    },
    {
      id: SocietyOnboardingModuleType.SOCIETY_AMENITIES,
      title: 'Society Amenities',
      description: 'Configure and manage society amenities like gym, pool, clubhouse, and recreational facilities',
      icon: 'FaSwimmingPool',
      route: '/society-onboarding/amenities',
      category: OnboardingModuleCategory.CONFIGURATION,
      color: '#e74c3c',
      isActive: true,
      permissions: {
        [OnboardingUserRole.ADMIN]: [OnboardingPermission.VIEW, OnboardingPermission.ADD, OnboardingPermission.EDIT, OnboardingPermission.DELETE],
        [OnboardingUserRole.USER]: [OnboardingPermission.VIEW],
        [OnboardingUserRole.GUEST]: [OnboardingPermission.VIEW]
      }
    },
    {
      id: SocietyOnboardingModuleType.SOCIETY_PARKING,
      title: 'Society Parking',
      description: 'Manage parking slots allocation, types, and assignments for residents and visitors',
      icon: 'FaParking',
      route: '/society-onboarding/parking',
      category: OnboardingModuleCategory.CONFIGURATION,
      color: '#f39c12',
      isActive: true,
      permissions: {
        [OnboardingUserRole.ADMIN]: [OnboardingPermission.VIEW, OnboardingPermission.ADD, OnboardingPermission.EDIT, OnboardingPermission.DELETE],
        [OnboardingUserRole.USER]: [OnboardingPermission.VIEW],
        [OnboardingUserRole.GUEST]: [OnboardingPermission.VIEW]
      }
    },
    {
      id: SocietyOnboardingModuleType.SOCIETY_UNITS,
      title: 'Society Units',
      description: 'Manage residential and commercial units including floor plans and ownership details',
      icon: 'FaHome',
      route: '/society-onboarding/units',
      category: OnboardingModuleCategory.CONFIGURATION,
      color: '#16a085',
      isActive: true,
      permissions: {
        [OnboardingUserRole.ADMIN]: [OnboardingPermission.VIEW, OnboardingPermission.ADD, OnboardingPermission.EDIT, OnboardingPermission.DELETE],
        [OnboardingUserRole.USER]: [OnboardingPermission.VIEW],
        [OnboardingUserRole.GUEST]: [OnboardingPermission.VIEW]
      }
    },
    {
      id: SocietyOnboardingModuleType.SOCIETY_SETTINGS,
      title: 'Society Settings',
      description: 'Configure society-wide settings including maintenance charges, rules, and operational parameters',
      icon: 'FaCog',
      route: '/society-onboarding/settings',
      category: OnboardingModuleCategory.CONFIGURATION,
      color: '#34495e',
      isActive: true,
      permissions: {
        [OnboardingUserRole.ADMIN]: [OnboardingPermission.VIEW, OnboardingPermission.EDIT],
        [OnboardingUserRole.USER]: [OnboardingPermission.VIEW],
        [OnboardingUserRole.GUEST]: [OnboardingPermission.VIEW]
      }
    }
  ];

  const getModuleIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      FaBuilding, FaCheckCircle, FaUserCog, FaSwimmingPool, FaParking,
      FaHome, FaUsers, FaCog, FaClipboardList, FaUpload
    };
    const IconComponent = icons[iconName] || FaBuilding;
    return <IconComponent />;
  };

  const getPermissionBadges = (module: SocietyOnboardingModule, userRole: OnboardingUserRole) => {
    const permissions = module.permissions[userRole];
    const badges = [];

    if (permissions.includes(OnboardingPermission.VIEW)) {
      badges.push(
        <PermissionBadge key="view" $type="view">
          <FaEye size={10} /> View
        </PermissionBadge>
      );
    }

    if (permissions.includes(OnboardingPermission.ADD) || permissions.includes(OnboardingPermission.CREATE)) {
      badges.push(
        <PermissionBadge key="add" $type="edit">
          <FaPlus size={10} /> Add
        </PermissionBadge>
      );
    }

    if (permissions.includes(OnboardingPermission.EDIT)) {
      badges.push(
        <PermissionBadge key="edit" $type="edit">
          <FaEdit size={10} /> Edit
        </PermissionBadge>
      );
    }

    if (permissions.includes(OnboardingPermission.DELETE) || 
        permissions.includes(OnboardingPermission.APPROVE) || 
        permissions.includes(OnboardingPermission.REJECT)) {
      badges.push(
        <PermissionBadge key="admin" $type="admin">
          <FaUserCheck size={10} /> Admin
        </PermissionBadge>
      );
    }

    return badges;
  };

  const filteredModules = useMemo(() => {
    return onboardingModules.filter(module => {
      // Check if user can access this module
      if (!canAccessOnboardingModule(currentUserRole, module)) {
        return false;
      }

      // Apply search filter
      const matchesSearch = searchTerm === '' || 
        module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Apply category filter
      const matchesCategory = selectedCategory === 'ALL' || module.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, currentUserRole, onboardingModules]);

  const categories = [
    { key: 'ALL', label: 'All Modules' },
    { key: OnboardingModuleCategory.SETUP, label: 'Setup' },
    { key: OnboardingModuleCategory.MANAGEMENT, label: 'Management' },
    { key: OnboardingModuleCategory.CONFIGURATION, label: 'Configuration' }
  ];

  const handleModuleClick = (module: SocietyOnboardingModule) => {
    // Navigate to module page
    navigate(module.route);
  };

  return (
    <OnboardingContainer>
      <Header>
        <HeaderTitle>
          <FaBuilding />
          Society Onboarding Hub
          <RoleBadge $role={currentUserRole}>{currentUserRole}</RoleBadge>
        </HeaderTitle>
        <HeaderDescription>
          Comprehensive society onboarding with 8 specialized modules for registration, verification, and configuration.
          Currently viewing as: <strong>{currentUserRole}</strong>
        </HeaderDescription>
      </Header>

      <FilterSection>
        <SearchBox>
          <SearchInput
            type="text"
            placeholder="Search onboarding modules by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon />
        </SearchBox>
        
        <CategoryFilters>
          {categories.map((category) => (
            <CategoryFilter
              key={category.key}
              $active={selectedCategory === category.key}
              onClick={() => setSelectedCategory(category.key as OnboardingModuleCategory | 'ALL')}
            >
              {category.label}
            </CategoryFilter>
          ))}
        </CategoryFilters>
      </FilterSection>

      {filteredModules.length === 0 ? (
        <EmptyState>
          <h3>No modules found</h3>
          <p>Try adjusting your search terms or category filters</p>
        </EmptyState>
      ) : (
        <ModulesGrid>
          {filteredModules.map((module) => (
            <ModuleCard
              key={module.id}
              $color={module.color}
              onClick={() => handleModuleClick(module)}
            >
              <ModuleHeader>
                <ModuleIcon $color={module.color}>
                  {getModuleIcon(module.icon)}
                </ModuleIcon>
                <ModuleInfo>
                  <ModuleTitle>{module.title}</ModuleTitle>
                  <ModuleDescription>{module.description}</ModuleDescription>
                </ModuleInfo>
              </ModuleHeader>
              
              <PermissionBadges>
                {getPermissionBadges(module, currentUserRole)}
              </PermissionBadges>
            </ModuleCard>
          ))}
        </ModulesGrid>
      )}
    </OnboardingContainer>
  );
};

export default SocietyOnboardingPage;