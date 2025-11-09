import React from 'react';
import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { 
  FiUsers, 
  FiActivity, 
  FiTrendingUp, 
  FiDollarSign, 
  FiMapPin, 
  FiHome, 
  FiMail, 
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiTrendingDown
} from 'react-icons/fi';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    box-shadow: ${({ theme }) => theme.boxShadow.md};
    transform: translateY(-2px);
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const StatLabel = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatIcon = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ color }) => color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const StatChange = styled.div<{ positive?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ positive, theme }) => 
    positive ? theme.colors.success[600] : theme.colors.error[600]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing[8]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[6]};
  }
`;

const SocietySection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const NewsletterCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-left: 4px solid ${({ theme }) => theme.colors.primary[500]};
`;

const ComplaintsCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-left: 4px solid ${({ theme }) => theme.colors.warning[500]};
`;

const UpdatesCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-left: 4px solid ${({ theme }) => theme.colors.success[500]};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ChartPlaceholder = styled.div`
  height: 300px;
  background: ${({ theme }) => theme.colors.gray[50]};
  border: 2px dashed ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const RecentActivityList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ActivityItem = styled.li`
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityTitle = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ActivityTime = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const SocietyCardTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const ItemDate = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const StatusBadge = styled.div<{ status: 'new' | 'pending' | 'resolved' | 'published' }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  
  ${({ theme, status }) => {
    switch (status) {
      case 'new':
        return `
          background: ${theme.colors.primary[100]};
          color: ${theme.colors.primary[700]};
        `;
      case 'pending':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
        `;
      case 'resolved':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
        `;
      case 'published':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[700]};
        `;
    }
  }}
`;

interface StatCardData {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ComponentType<{ size?: number }>;
  iconColor: string;
}

const statsData: StatCardData[] = [
  {
    label: 'Total Societies',
    value: '12',
    change: '+2 new this month',
    positive: true,
    icon: FiMapPin,
    iconColor: '#3b82f6',
  },
  {
    label: 'Total Units',
    value: '2,847',
    change: 'Across all societies',
    positive: true,
    icon: FiHome,
    iconColor: '#10b981',
  },
  {
    label: 'Occupancy Rate',
    value: '92.3%',
    change: '+3.2% from last month',
    positive: true,
    icon: FiTrendingUp,
    iconColor: '#f59e0b',
  },
  {
    label: 'Monthly Revenue',
    value: '₹24.5L',
    change: '+8.7% from last month',
    positive: true,
    icon: FiDollarSign,
    iconColor: '#ef4444',
  },
];

const recentActivities = [
  { title: 'New maintenance request - Block A', time: '5 minutes ago' },
  { title: 'Monthly newsletter published', time: '1 hour ago' },
  { title: 'Security incident resolved', time: '2 hours ago' },
  { title: 'Vendor payment processed', time: '4 hours ago' },
  { title: 'Society meeting scheduled', time: '1 day ago' },
];

const newsletters = [
  {
    title: 'January 2024 Newsletter',
    date: '2024-01-15',
    status: 'published' as const
  },
  {
    title: 'New Year Celebrations Recap',
    date: '2024-01-08',
    status: 'published' as const
  },
  {
    title: 'Society Rules Update',
    date: '2024-01-01',
    status: 'published' as const
  }
];

const complaints = [
  {
    title: 'Water leakage in parking area',
    date: '2024-01-14',
    status: 'pending' as const
  },
  {
    title: 'Noise complaint from residents',
    date: '2024-01-13',
    status: 'resolved' as const
  },
  {
    title: 'Elevator maintenance required',
    date: '2024-01-12',
    status: 'new' as const
  },
  {
    title: 'Security gate malfunction',
    date: '2024-01-11',
    status: 'resolved' as const
  }
];

const updates = [
  {
    title: 'Swimming pool maintenance completed',
    date: '2024-01-15',
    status: 'resolved' as const
  },
  {
    title: 'New CCTV cameras installed',
    date: '2024-01-14',
    status: 'resolved' as const
  },
  {
    title: 'Garden landscaping updated',
    date: '2024-01-12',
    status: 'resolved' as const
  }
];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <DashboardContainer>
      <Header>
        <Title>Welcome back, {user?.name}!</Title>
        <Subtitle>Here's what's happening with your societies today.</Subtitle>
      </Header>

      <StatsGrid>
        {statsData.map((stat, index) => (
          <StatCard key={index}>
            <StatHeader>
              <StatLabel>{stat.label}</StatLabel>
              <StatIcon color={stat.iconColor}>
                <stat.icon size={20} />
              </StatIcon>
            </StatHeader>
            <StatValue>{stat.value}</StatValue>
            <StatChange positive={stat.positive}>{stat.change}</StatChange>
          </StatCard>
        ))}
      </StatsGrid>

      <SocietySection>
        <NewsletterCard>
          <SocietyCardTitle>
            <FiMail size={20} />
            Society Newsletters
          </SocietyCardTitle>
          <ItemList>
            {newsletters.slice(0, 3).map((newsletter, index) => (
              <Item key={index}>
                <ItemInfo>
                  <ItemTitle>{newsletter.title}</ItemTitle>
                  <ItemDate>{new Date(newsletter.date).toLocaleDateString()}</ItemDate>
                </ItemInfo>
                <StatusBadge status={newsletter.status}>{newsletter.status}</StatusBadge>
              </Item>
            ))}
          </ItemList>
        </NewsletterCard>

        <ComplaintsCard>
          <SocietyCardTitle>
            <FiAlertTriangle size={20} />
            Recent Complaints
          </SocietyCardTitle>
          <ItemList>
            {complaints.slice(0, 3).map((complaint, index) => (
              <Item key={index}>
                <ItemInfo>
                  <ItemTitle>{complaint.title}</ItemTitle>
                  <ItemDate>{new Date(complaint.date).toLocaleDateString()}</ItemDate>
                </ItemInfo>
                <StatusBadge status={complaint.status}>{complaint.status}</StatusBadge>
              </Item>
            ))}
          </ItemList>
        </ComplaintsCard>

        <UpdatesCard>
          <SocietyCardTitle>
            <FiCheckCircle size={20} />
            Latest Updates
          </SocietyCardTitle>
          <ItemList>
            {updates.map((update, index) => (
              <Item key={index}>
                <ItemInfo>
                  <ItemTitle>{update.title}</ItemTitle>
                  <ItemDate>{new Date(update.date).toLocaleDateString()}</ItemDate>
                </ItemInfo>
                <StatusBadge status={update.status}>completed</StatusBadge>
              </Item>
            ))}
          </ItemList>
        </UpdatesCard>
      </SocietySection>

      <ContentGrid>
        <Card>
          <CardTitle>Analytics Overview</CardTitle>
          <ChartPlaceholder>
            Society performance metrics chart would go here
          </ChartPlaceholder>
        </Card>

        <Card>
          <CardTitle>Recent Activity</CardTitle>
          <RecentActivityList>
            {recentActivities.map((activity, index) => (
              <ActivityItem key={index}>
                <ActivityTitle>{activity.title}</ActivityTitle>
                <ActivityTime>{activity.time}</ActivityTime>
              </ActivityItem>
            ))}
          </RecentActivityList>
        </Card>
      </ContentGrid>
    </DashboardContainer>
  );
};

export default DashboardPage;
