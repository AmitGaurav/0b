import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { 
  FaFileAlt, 
  FaWpforms, 
  FaBullhorn, 
  FaCalendarAlt, 
  FaUsers, 
  FaTruck, 
  FaBuilding,
  FaPoll,
  FaAddressBook,
  FaBullhorn as FaSpeakerphone,
  FaImages,
  FaComments,
  FaTools,
  FaParking,
  FaShieldAlt,
  FaBoxes,
  FaLeaf,
  FaGavel,
  FaSearch,
  FaFilter,
  FaEye,
  FaDownload,
  FaUpload,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserCheck
} from 'react-icons/fa';
import { useAuthContext } from '../../contexts/AuthContext';
import { 
  SocietyModule, 
  SocietyModuleType, 
  ModuleCategory, 
  UserRole, 
  Permission,
  canAccessModule,
  hasPermission 
} from '../../types/society-modules';

const SocietiesContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
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
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
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
  border: 2px solid ${props => props.$active ? '#3498db' : '#e0e6ed'};
  background: ${props => props.$active ? '#3498db' : 'white'};
  color: ${props => props.$active ? 'white' : '#2c3e50'};
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  
  &:hover {
    border-color: #3498db;
    background: ${props => props.$active ? '#2980b9' : '#ecf0f1'};
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

const RoleBadge = styled.div<{ $role: UserRole }>`
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
      case UserRole.ADMIN: return '#e74c3c';
      case UserRole.USER: return '#3498db';
      case UserRole.GUEST: return '#95a5a6';
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

const SocietiesPage: React.FC = () => {
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory | 'ALL'>('ALL');
  
  // Mock user role - in real app, this would come from user context
  const currentUserRole = UserRole.ADMIN; // Set to ADMIN for highest level access

  // Society modules configuration
  const societyModules: SocietyModule[] = [
    {
      id: SocietyModuleType.DOCUMENT_CENTER,
      title: 'Document Center',
      description: 'Access society documents, bylaws, financial reports, and legal documents',
      icon: 'FaFileAlt',
      route: '/societies/documents',
      category: ModuleCategory.ADMINISTRATION,
      color: '#3498db',
      isActive: true,
      permissions: {
        [UserRole.ADMIN]: [Permission.VIEW, Permission.DOWNLOAD, Permission.UPLOAD, Permission.DELETE],
        [UserRole.USER]: [Permission.VIEW, Permission.DOWNLOAD],
        [UserRole.GUEST]: [Permission.VIEW]
      }
    },
    {
      id: SocietyModuleType.FORM_CENTER,
      title: 'Form Center',
      description: 'Access various forms for onboarding, registration, and service requests',
      icon: 'FaWpforms',
      route: '/societies/forms',
      category: ModuleCategory.ADMINISTRATION,
      color: '#e67e22',
      isActive: true,
      permissions: {
        [UserRole.ADMIN]: [Permission.VIEW, Permission.CREATE, Permission.EDIT, Permission.DELETE],
        [UserRole.USER]: [Permission.VIEW, Permission.CREATE],
        [UserRole.GUEST]: [Permission.VIEW]
      }
    },
    {
      id: SocietyModuleType.NOTICE_BOARD,
      title: 'Notice Board',
      description: 'View important notices and announcements from management',
      icon: 'FaBullhorn',
      route: '/societies/notices',
      category: ModuleCategory.COMMUNITY,
      color: '#f39c12',
      isActive: true,
      permissions: {
        [UserRole.ADMIN]: [Permission.VIEW, Permission.CREATE, Permission.EDIT, Permission.DELETE],
        [UserRole.USER]: [Permission.VIEW],
        [UserRole.GUEST]: [Permission.VIEW]
      }
    },
    {
      id: SocietyModuleType.EVENT_MANAGEMENT,
      title: 'Event Management',
      description: 'Discover upcoming events, festivals, and community activities',
      icon: 'FaCalendarAlt',
      route: '/societies/events',
      category: ModuleCategory.COMMUNITY,
      color: '#9b59b6',
      isActive: true,
      permissions: {
        [UserRole.ADMIN]: [Permission.VIEW, Permission.CREATE, Permission.EDIT, Permission.DELETE],
        [UserRole.USER]: [Permission.VIEW, Permission.PARTICIPATE],
        [UserRole.GUEST]: [Permission.VIEW]
      }
    },
    {
      id: SocietyModuleType.STAFF_MANAGEMENT,
      title: 'Staff Management',
      description: 'View and manage society staff members and their details',
      icon: 'FaUsers',
      route: '/societies/staff',
      category: ModuleCategory.MANAGEMENT,
      color: '#1abc9c',
      isActive: true,
      permissions: {
        [UserRole.ADMIN]: [Permission.VIEW, Permission.CREATE, Permission.EDIT, Permission.DELETE],
        [UserRole.USER]: [Permission.VIEW],
        [UserRole.GUEST]: [Permission.VIEW]
      }
    },
    {
      id: SocietyModuleType.VENDOR_MANAGEMENT,
      title: 'Vendor Management',
      description: 'Access approved vendors and service providers for the society',
      icon: 'FaTruck',
      route: '/societies/vendors',
      category: ModuleCategory.MANAGEMENT,
      color: '#e74c3c',
      isActive: true,
      permissions: {
        [UserRole.ADMIN]: [Permission.VIEW, Permission.CREATE, Permission.EDIT, Permission.DELETE],
        [UserRole.USER]: [Permission.VIEW],
        [UserRole.GUEST]: [Permission.VIEW]
      }
    },
    {
      id: SocietyModuleType.FACILITY_MANAGEMENT,
      title: 'Facility Management',
      description: 'Book and manage society facilities like gym, pool, clubhouse',
      icon: 'FaBuilding',
      route: '/societies/facilities',
      category: ModuleCategory.SERVICES,
      color: '#34495e',
      isActive: true,
      permissions: {
        [UserRole.ADMIN]: [Permission.VIEW, Permission.CREATE, Permission.EDIT, Permission.DELETE],
        [UserRole.USER]: [Permission.VIEW, Permission.CREATE],
        [UserRole.GUEST]: [Permission.VIEW]
      }
    },
    {
      id: SocietyModuleType.POLLS_SURVEYS,
      title: 'Polls & Surveys',
      description: 'Participate in community polls and provide feedback through surveys',
      icon: 'FaPoll',
      route: '/societies/polls',
      category: ModuleCategory.COMMUNITY,
      color: '#8e44ad',
      isActive: true,
      permissions: {
        [UserRole.ADMIN]: [Permission.VIEW, Permission.CREATE, Permission.EDIT, Permission.DELETE],
        [UserRole.USER]: [Permission.VIEW, Permission.PARTICIPATE],
        [UserRole.GUEST]: [Permission.VIEW, Permission.PARTICIPATE]
      }
    },
    {
      id: SocietyModuleType.SOCIETY_DIRECTORY,
      title: 'Society Directory',
      description: 'Access contact information of society members and residents',
      icon: 'FaAddressBook',
      route: '/societies/directory',
      category: ModuleCategory.COMMUNITY,
      color: '#2c3e50',
      isActive: true,
      permissions: {
        [UserRole.ADMIN]: [Permission.VIEW],
        [UserRole.USER]: [Permission.VIEW],
        [UserRole.GUEST]: [Permission.VIEW]
      }
    },
    {
      id: SocietyModuleType.ANNOUNCEMENTS,
      title: 'Announcements',
      description: 'Stay updated with important announcements from management',
      icon: 'FaSpeakerphone',
      route: '/societies/announcements',
      category: ModuleCategory.COMMUNITY,
      color: '#f1c40f',
      isActive: true,
      permissions: {
        [UserRole.ADMIN]: [Permission.VIEW, Permission.CREATE, Permission.EDIT, Permission.DELETE],
        [UserRole.USER]: [Permission.VIEW],
        [UserRole.GUEST]: [Permission.VIEW]
      }
    },
    {
      id: SocietyModuleType.GALLERY,
      title: 'Gallery',
      description: 'Browse photos and videos from society events and activities',
      icon: 'FaImages',
      route: '/societies/gallery',
      category: ModuleCategory.COMMUNITY,
      color: '#e91e63',
      isActive: true,
      permissions: {
        [UserRole.ADMIN]: [Permission.VIEW, Permission.UPLOAD, Permission.DELETE],
        [UserRole.USER]: [Permission.VIEW],
        [UserRole.GUEST]: [Permission.VIEW]
      }
    },
    {
      id: SocietyModuleType.FEEDBACK_SUGGESTIONS,
      title: 'Feedback & Suggestions',
      description: 'Submit feedback and suggestions to improve society services',
      icon: 'FaComments',
      route: '/societies/feedback',
      category: ModuleCategory.COMMUNITY,
      color: '#27ae60',
      isActive: true,
      permissions: {
        [UserRole.ADMIN]: [Permission.VIEW, Permission.RESPOND],
        [UserRole.USER]: [Permission.VIEW, Permission.CREATE],
        [UserRole.GUEST]: [Permission.VIEW, Permission.CREATE]
      }
    },
    {
      id: SocietyModuleType.MAINTENANCE_REQUESTS,
      title: 'Maintenance Requests',
      description: 'Submit and track maintenance requests for your apartment',
      icon: 'FaTools',
      route: '/societies/maintenance',
      category: ModuleCategory.SERVICES,
      color: '#e67e22',
      isActive: true,
      permissions: {
        [UserRole.ADMIN]: [Permission.VIEW, Permission.ASSIGN, Permission.EDIT],
        [UserRole.USER]: [Permission.VIEW, Permission.CREATE, Permission.EDIT],
        [UserRole.GUEST]: [Permission.VIEW, Permission.CREATE]
      }
    },
    {
      id: SocietyModuleType.PARKING_MANAGEMENT,
      title: 'Parking Management',
      description: 'Manage parking slot allocation and requests',
      icon: 'FaParking',
      route: '/societies/parking',
      category: ModuleCategory.SERVICES,
      color: '#3498db',
      isActive: true,
      permissions: {
        [UserRole.ADMIN]: [Permission.VIEW, Permission.CREATE, Permission.EDIT, Permission.DELETE, Permission.ASSIGN],
        [UserRole.USER]: [Permission.VIEW, Permission.CREATE],
        [UserRole.GUEST]: [Permission.VIEW]
      }
    },
    {
      id: SocietyModuleType.SECURITY_MANAGEMENT,
      title: 'Security Management',
      description: 'View security personnel and access security-related services',
      icon: 'FaShieldAlt',
      route: '/societies/security',
      category: ModuleCategory.MANAGEMENT,
      color: '#34495e',
      isActive: true,
      permissions: {
        [UserRole.ADMIN]: [Permission.VIEW, Permission.CREATE, Permission.EDIT, Permission.DELETE],
        [UserRole.USER]: [Permission.VIEW],
        [UserRole.GUEST]: [Permission.VIEW]
      }
    },
    {
      id: SocietyModuleType.INVENTORY_MANAGEMENT,
      title: 'Inventory Management',
      description: 'Track society assets and inventory items',
      icon: 'FaBoxes',
      route: '/societies/inventory',
      category: ModuleCategory.MANAGEMENT,
      color: '#95a5a6',
      isActive: true,
      permissions: {
        [UserRole.ADMIN]: [Permission.VIEW, Permission.CREATE, Permission.EDIT, Permission.DELETE],
        [UserRole.USER]: [Permission.VIEW],
        [UserRole.GUEST]: [Permission.VIEW]
      }
    },
    {
      id: SocietyModuleType.SUSTAINABILITY_INITIATIVES,
      title: 'Sustainability Initiatives',
      description: 'Participate in eco-friendly initiatives and green programs',
      icon: 'FaLeaf',
      route: '/societies/sustainability',
      category: ModuleCategory.COMMUNITY,
      color: '#27ae60',
      isActive: true,
      permissions: {
        [UserRole.ADMIN]: [Permission.VIEW, Permission.CREATE, Permission.EDIT, Permission.DELETE],
        [UserRole.USER]: [Permission.VIEW, Permission.PARTICIPATE],
        [UserRole.GUEST]: [Permission.VIEW, Permission.PARTICIPATE]
      }
    },
    {
      id: SocietyModuleType.LEGAL_COMPLIANCE,
      title: 'Legal & Compliance',
      description: 'Access legal documents, compliance reports, and regulatory information',
      icon: 'FaGavel',
      route: '/societies/legal',
      category: ModuleCategory.ADMINISTRATION,
      color: '#8e44ad',
      isActive: true,
      permissions: {
        [UserRole.ADMIN]: [Permission.VIEW, Permission.CREATE, Permission.EDIT, Permission.DELETE],
        [UserRole.USER]: [Permission.VIEW],
        [UserRole.GUEST]: [Permission.VIEW]
      }
    }
  ];

  const getModuleIcon = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<any> } = {
      FaFileAlt, FaWpforms, FaBullhorn, FaCalendarAlt, FaUsers, FaTruck,
      FaBuilding, FaPoll, FaAddressBook, FaSpeakerphone, FaImages, FaComments,
      FaTools, FaParking, FaShieldAlt, FaBoxes, FaLeaf, FaGavel
    };
    const IconComponent = icons[iconName] || FaBuilding;
    return <IconComponent />;
  };

  const getPermissionBadges = (module: SocietyModule, userRole: UserRole) => {
    const permissions = module.permissions[userRole];
    const badges = [];

    if (permissions.includes(Permission.VIEW)) {
      badges.push(
        <PermissionBadge key="view" $type="view">
          <FaEye size={10} /> View
        </PermissionBadge>
      );
    }

    if (permissions.includes(Permission.DOWNLOAD)) {
      badges.push(
        <PermissionBadge key="download" $type="view">
          <FaDownload size={10} /> Download
        </PermissionBadge>
      );
    }

    if (permissions.includes(Permission.CREATE) || permissions.includes(Permission.UPLOAD)) {
      badges.push(
        <PermissionBadge key="create" $type="edit">
          <FaPlus size={10} /> Create
        </PermissionBadge>
      );
    }

    if (permissions.includes(Permission.EDIT)) {
      badges.push(
        <PermissionBadge key="edit" $type="edit">
          <FaEdit size={10} /> Edit
        </PermissionBadge>
      );
    }

    if (permissions.includes(Permission.DELETE) || 
        permissions.includes(Permission.ASSIGN) || 
        permissions.includes(Permission.APPROVE)) {
      badges.push(
        <PermissionBadge key="admin" $type="admin">
          <FaUserCheck size={10} /> Admin
        </PermissionBadge>
      );
    }

    return badges;
  };

  const filteredModules = useMemo(() => {
    return societyModules.filter(module => {
      // Check if user can access this module
      if (!canAccessModule(currentUserRole, module)) {
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
  }, [searchTerm, selectedCategory, currentUserRole, societyModules]);

  const categories = [
    { key: 'ALL', label: 'All Modules' },
    { key: ModuleCategory.ADMINISTRATION, label: 'Administration' },
    { key: ModuleCategory.COMMUNITY, label: 'Community' },
    { key: ModuleCategory.SERVICES, label: 'Services' },
    { key: ModuleCategory.MANAGEMENT, label: 'Management' }
  ];

  const handleModuleClick = (module: SocietyModule) => {
    // Navigate to module page
    console.log(`Navigating to ${module.route}`);
    // In real app: navigate(module.route);
  };

  return (
    <SocietiesContainer>
      <Header>
        <HeaderTitle>
          <FaBuilding />
          Society Management Hub
          <RoleBadge $role={currentUserRole}>{currentUserRole}</RoleBadge>
        </HeaderTitle>
        <HeaderDescription>
          Access all society modules and services based on your role and permissions.
          Currently viewing as: <strong>{currentUserRole}</strong>
        </HeaderDescription>
      </Header>

      <FilterSection>
        <SearchBox>
          <SearchInput
            type="text"
            placeholder="Search modules by name or description..."
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
              onClick={() => setSelectedCategory(category.key as ModuleCategory | 'ALL')}
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
    </SocietiesContainer>
  );
};

export default SocietiesPage;