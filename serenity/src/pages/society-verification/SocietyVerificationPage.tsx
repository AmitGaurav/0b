import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaExclamationTriangle,
  FaFileAlt,
  FaGavel,
  FaBuilding,
  FaUsers,
  FaDollarSign,
  FaShieldAlt,
  FaCheck,
  FaTimes,
  FaEye,
  FaUpload,
  FaDownload,
  FaEdit,
  FaPlay,
  FaPause,
  FaFilter,
  FaSearch,
  FaChartPie,
  FaCheckDouble,
  FaExternalLinkAlt
} from 'react-icons/fa';
import { 
  VerificationStatus,
  VerificationCategory,
  VerificationPriority,
  VerificationItem,
  SocietyVerification,
  VerificationStats,
  VERIFICATION_CATEGORIES,
  DEFAULT_VERIFICATION_ITEMS,
  calculateVerificationStats,
  canActivateSociety
} from '../../types/society-verification';
import { PageContainer, PageTitle, ContentCard } from '../../components/common/PageLayout';

// Using standard PageContainer component for consistency

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const HeaderTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const HeaderInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const InfoCard = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border-left: 4px solid ${({ theme }) => theme.colors.primary[500]};
  background: ${({ theme }) => theme.colors.gray[50]};
`;

const InfoLabel = styled.div`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const InfoValue = styled.div`
  color: ${({ theme }) => theme.colors.gray[900]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const StatCard = styled.div<{ $color: string }>`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.boxShadow.md};
  border-left: 4px solid ${props => props.$color};
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const StatLabel = styled.div`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ProgressSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ProgressBar = styled.div`
  height: 12px;
  background: ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${props => props.$percentage}%;
  background: ${({ theme }) => theme.colors.primary[500]};
  transition: width 0.3s ease;
`;

const FilterSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const FilterRow = styled.div`
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

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 2px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  background: ${({ theme }) => theme.colors.white};
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const VerificationSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const CategorySection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  overflow: hidden;
`;

const CategoryHeader = styled.div<{ $color: string }>`
  background: ${props => props.$color};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CategoryTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const CategoryStats = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ItemsList = styled.div`
  padding: 0;
`;

const VerificationItemCard = styled.div<{ $priority: VerificationPriority }>`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  transition: all 0.3s ease;
  
  border-left: 4px solid ${props => {
    switch (props.$priority) {
      case VerificationPriority.HIGH: return props.theme.colors.error[500];
      case VerificationPriority.MEDIUM: return props.theme.colors.warning[500];
      case VerificationPriority.LOW: return props.theme.colors.gray[400];
    }
  }};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const StatusIcon = styled.div<{ $status: VerificationStatus }>`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  
  ${props => {
    switch (props.$status) {
      case VerificationStatus.COMPLETED:
        return `
          background: ${props.theme.colors.success[100]};
          color: ${props.theme.colors.success[800]};
        `;
      case VerificationStatus.IN_PROGRESS:
        return `
          background: ${props.theme.colors.warning[100]};
          color: ${props.theme.colors.warning[800]};
        `;
      case VerificationStatus.REJECTED:
        return `
          background: ${props.theme.colors.error[100]};
          color: ${props.theme.colors.error[800]};
        `;
      default:
        return `
          background: ${props.theme.colors.gray[100]};
          color: ${props.theme.colors.gray[800]};
        `;
    }
  }}
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
`;

const ItemDescription = styled.p`
  margin: 0 0 0.5rem 0;
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const ItemMeta = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  font-size: 0.8rem;
`;

const RequiredBadge = styled.span`
  background: #e74c3c;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const OptionalBadge = styled.span`
  background: #95a5a6;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const PriorityBadge = styled.span<{ $priority: VerificationPriority }>`
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${props => {
    switch (props.$priority) {
      case VerificationPriority.HIGH:
        return `
          background: #f8d7da;
          color: #721c24;
        `;
      case VerificationPriority.MEDIUM:
        return `
          background: #fff3cd;
          color: #856404;
        `;
      case VerificationPriority.LOW:
        return `
          background: #e2e3e5;
          color: #383d41;
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
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
          border: 1px solid ${props.theme.colors.gray[300]};
          &:hover { background: ${props.theme.colors.gray[100]}; }
        `;
    }
  }}
`;

const ActivationSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  margin-top: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  text-align: center;
`;

const ActivationTitle = styled.h2`
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  margin: 0 0 ${({ theme }) => theme.spacing[4]} 0;
`;

const ActivationMessage = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0 0 ${({ theme }) => theme.spacing[8]} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const SocietyVerificationPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<VerificationCategory | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<VerificationStatus | 'ALL'>('ALL');
  
  // Mock society verification data
  const [societyVerification, setSocietyVerification] = useState<SocietyVerification>({
    id: '1',
    societyId: 'SOC001',
    societyName: 'Green Valley Apartments',
    overallStatus: VerificationStatus.IN_PROGRESS,
    progress: 65,
    verificationItems: DEFAULT_VERIFICATION_ITEMS.map((item, index) => ({
      id: `item-${index + 1}`,
      status: index < 10 ? VerificationStatus.COMPLETED : 
              index < 15 ? VerificationStatus.IN_PROGRESS :
              index < 18 ? VerificationStatus.REJECTED : 
              VerificationStatus.PENDING,
      verifiedBy: index < 10 ? 'Admin User' : undefined,
      verifiedDate: index < 10 ? new Date(2024, 8, index + 1) : undefined,
      rejectionReason: index >= 15 && index < 18 ? 'Documentation incomplete' : undefined,
      ...item
    })),
    startDate: new Date(2024, 8, 1),
    targetCompletionDate: new Date(2024, 8, 30),
    isActivated: false
  });

  const stats = useMemo(() => 
    calculateVerificationStats(societyVerification.verificationItems), 
    [societyVerification.verificationItems]
  );

  const canActivate = useMemo(() => 
    canActivateSociety(societyVerification.verificationItems), 
    [societyVerification.verificationItems]
  );

  const filteredItems = useMemo(() => {
    return societyVerification.verificationItems.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [societyVerification.verificationItems, searchTerm, selectedCategory, selectedStatus]);

  const groupedItems = useMemo(() => {
    const grouped: { [key in VerificationCategory]: VerificationItem[] } = {
      [VerificationCategory.DOCUMENTATION]: [],
      [VerificationCategory.LEGAL_COMPLIANCE]: [],
      [VerificationCategory.INFRASTRUCTURE]: [],
      [VerificationCategory.MANAGEMENT]: [],
      [VerificationCategory.FINANCIAL]: [],
      [VerificationCategory.SAFETY_SECURITY]: []
    };

    filteredItems.forEach(item => {
      grouped[item.category].push(item);
    });

    return grouped;
  }, [filteredItems]);

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case VerificationStatus.COMPLETED:
        return <FaCheckCircle />;
      case VerificationStatus.IN_PROGRESS:
        return <FaClock />;
      case VerificationStatus.REJECTED:
        return <FaTimesCircle />;
      default:
        return <FaExclamationTriangle />;
    }
  };

  const getCategoryIcon = (category: VerificationCategory) => {
    const iconMap = {
      [VerificationCategory.DOCUMENTATION]: <FaFileAlt />,
      [VerificationCategory.LEGAL_COMPLIANCE]: <FaGavel />,
      [VerificationCategory.INFRASTRUCTURE]: <FaBuilding />,
      [VerificationCategory.MANAGEMENT]: <FaUsers />,
      [VerificationCategory.FINANCIAL]: <FaDollarSign />,
      [VerificationCategory.SAFETY_SECURITY]: <FaShieldAlt />
    };
    return iconMap[category];
  };

  const handleStatusChange = (itemId: string, newStatus: VerificationStatus) => {
    setSocietyVerification(prev => ({
      ...prev,
      verificationItems: prev.verificationItems.map(item => 
        item.id === itemId 
          ? { 
              ...item, 
              status: newStatus,
              verifiedBy: newStatus === VerificationStatus.COMPLETED ? 'Admin User' : undefined,
              verifiedDate: newStatus === VerificationStatus.COMPLETED ? new Date() : undefined
            }
          : item
      )
    }));
  };

  const handleActivateSociety = () => {
    if (canActivate) {
      setSocietyVerification(prev => ({
        ...prev,
        isActivated: true,
        activatedDate: new Date(),
        activatedBy: 'Admin User',
        overallStatus: VerificationStatus.COMPLETED,
        completionDate: new Date()
      }));
      alert('Society has been successfully activated!');
    }
  };

  return (
    <PageContainer>
      <Header>
        <ContentCard>
          <HeaderTitle>
            <FaCheckDouble />
            Society Verification
          </HeaderTitle>
        
        <HeaderInfo>
          <InfoCard>
            <InfoLabel>Society Name</InfoLabel>
            <InfoValue>{societyVerification.societyName}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>Society ID</InfoLabel>
            <InfoValue>{societyVerification.societyId}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>Start Date</InfoLabel>
            <InfoValue>{societyVerification.startDate.toLocaleDateString()}</InfoValue>
          </InfoCard>
          <InfoCard>
            <InfoLabel>Target Date</InfoLabel>
            <InfoValue>{societyVerification.targetCompletionDate.toLocaleDateString()}</InfoValue>
          </InfoCard>
        </HeaderInfo>
        </ContentCard>
      </Header>

      <ContentCard>
        <StatsSection>
        <StatCard $color="#3498db">
          <StatNumber>{stats.totalItems}</StatNumber>
          <StatLabel>Total Items</StatLabel>
        </StatCard>
        <StatCard $color="#2ecc71">
          <StatNumber>{stats.completedItems}</StatNumber>
          <StatLabel>Completed</StatLabel>
        </StatCard>
        <StatCard $color="#f39c12">
          <StatNumber>{stats.inProgressItems}</StatNumber>
          <StatLabel>In Progress</StatLabel>
        </StatCard>
        <StatCard $color="#e74c3c">
          <StatNumber>{stats.rejectedItems}</StatNumber>
          <StatLabel>Rejected</StatLabel>
        </StatCard>
        <StatCard $color="#95a5a6">
          <StatNumber>{stats.pendingItems}</StatNumber>
          <StatLabel>Pending</StatLabel>
        </StatCard>
        </StatsSection>
      </ContentCard>

      <ContentCard>
        <ProgressSection>
        <ProgressHeader>
          <h3>Verification Progress</h3>
          <div>{stats.completionPercentage}% Complete</div>
        </ProgressHeader>
        <ProgressBar>
          <ProgressFill $percentage={stats.completionPercentage} />
        </ProgressBar>
        <div>
          {stats.completedItems} of {stats.totalItems} verification items completed
        </div>
        </ProgressSection>
      </ContentCard>

      <ContentCard>
        <FilterSection>
        <FilterRow>
          <SearchBox>
            <SearchInput
              type="text"
              placeholder="Search verification items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon />
          </SearchBox>
          
          <FilterSelect
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as VerificationCategory | 'ALL')}
          >
            <option value="ALL">All Categories</option>
            {Object.entries(VERIFICATION_CATEGORIES).map(([key, config]) => (
              <option key={key} value={key}>{config.label}</option>
            ))}
          </FilterSelect>
          
          <FilterSelect
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as VerificationStatus | 'ALL')}
          >
            <option value="ALL">All Status</option>
            <option value={VerificationStatus.PENDING}>Pending</option>
            <option value={VerificationStatus.IN_PROGRESS}>In Progress</option>
            <option value={VerificationStatus.COMPLETED}>Completed</option>
            <option value={VerificationStatus.REJECTED}>Rejected</option>
          </FilterSelect>
        </FilterRow>
        </FilterSection>
      </ContentCard>

      <VerificationSection>
        {Object.entries(groupedItems).map(([category, items]) => {
          if (items.length === 0) return null;
          
          const categoryConfig = VERIFICATION_CATEGORIES[category as VerificationCategory];
          const categoryStats = calculateVerificationStats(items);
          
          return (
            <CategorySection key={category}>
              <CategoryHeader $color={categoryConfig.color}>
                <CategoryTitle>
                  {getCategoryIcon(category as VerificationCategory)}
                  {categoryConfig.label}
                </CategoryTitle>
                <CategoryStats>
                  <span>{categoryStats.completedItems}/{categoryStats.totalItems} Complete</span>
                  <span>({categoryStats.completionPercentage}%)</span>
                </CategoryStats>
              </CategoryHeader>
              
              <ItemsList>
                {items.map((item) => (
                  <VerificationItemCard key={item.id} $priority={item.priority}>
                    <StatusIcon $status={item.status}>
                      {getStatusIcon(item.status)}
                    </StatusIcon>
                    
                    <ItemInfo>
                      <ItemTitle>{item.title}</ItemTitle>
                      <ItemDescription>{item.description}</ItemDescription>
                      <ItemMeta>
                        {item.isRequired ? (
                          <RequiredBadge>Required</RequiredBadge>
                        ) : (
                          <OptionalBadge>Optional</OptionalBadge>
                        )}
                        <PriorityBadge $priority={item.priority}>
                          {item.priority.toUpperCase()} Priority
                        </PriorityBadge>
                        {item.verifiedBy && (
                          <span>Verified by: {item.verifiedBy}</span>
                        )}
                        {item.verifiedDate && (
                          <span>on {item.verifiedDate.toLocaleDateString()}</span>
                        )}
                      </ItemMeta>
                    </ItemInfo>
                    
                    <ActionButtons>
                      {item.status !== VerificationStatus.COMPLETED && (
                        <Button 
                          $variant="success" 
                          onClick={() => handleStatusChange(item.id, VerificationStatus.COMPLETED)}
                        >
                          <FaCheck />
                          Approve
                        </Button>
                      )}
                      {item.status !== VerificationStatus.REJECTED && (
                        <Button 
                          $variant="danger" 
                          onClick={() => handleStatusChange(item.id, VerificationStatus.REJECTED)}
                        >
                          <FaTimes />
                          Reject
                        </Button>
                      )}
                      {item.status !== VerificationStatus.IN_PROGRESS && item.status !== VerificationStatus.COMPLETED && (
                        <Button 
                          $variant="primary" 
                          onClick={() => handleStatusChange(item.id, VerificationStatus.IN_PROGRESS)}
                        >
                          <FaPlay />
                          Start
                        </Button>
                      )}
                      <Button>
                        <FaEye />
                        Details
                      </Button>
                    </ActionButtons>
                  </VerificationItemCard>
                ))}
              </ItemsList>
            </CategorySection>
          );
        })}
      </VerificationSection>

      <ContentCard>
        <ActivationSection>
        <ActivationTitle>Society Activation</ActivationTitle>
        {societyVerification.isActivated ? (
          <div>
            <ActivationMessage style={{ color: '#2ecc71' }}>
              ✅ Society has been successfully activated on {societyVerification.activatedDate?.toLocaleDateString()}
            </ActivationMessage>
            <Button $variant="success" disabled>
              <FaCheckCircle />
              Society Activated
            </Button>
          </div>
        ) : canActivate ? (
          <div>
            <ActivationMessage style={{ color: '#2ecc71' }}>
              ✅ All required verification items are completed. Society is ready for activation.
            </ActivationMessage>
            <Button $variant="success" onClick={handleActivateSociety}>
              <FaCheckCircle />
              Activate Society
            </Button>
          </div>
        ) : (
          <div>
            <ActivationMessage>
              ⚠️ Complete all required verification items to activate the society. 
              {stats.totalItems - stats.completedItems} items remaining.
            </ActivationMessage>
            <Button disabled>
              <FaClock />
              Activation Pending
            </Button>
          </div>
        )}
        </ActivationSection>
      </ContentCard>
    </PageContainer>
  );
};

export default SocietyVerificationPage;