import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiShield, FiUsers, FiSettings, FiKey, FiDatabase, FiActivity, FiAlertTriangle, FiCheck, FiX, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const TabsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const Tab = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: none;
  background: none;
  color: ${({ theme, active }) => active ? theme.colors.primary[600] : theme.colors.gray[600]};
  font-weight: ${({ theme, active }) => active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium};
  border-bottom: 2px solid ${({ theme, active }) => active ? theme.colors.primary[600] : 'transparent'};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const Section = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const AdminCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.boxShadow.lg};
  }
`;

const AdminCardIcon = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ color }) => color}20;
  color: ${({ color }) => color};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const AdminCardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const AdminCardDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  line-height: 1.5;
`;

const UserTable = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: ${({ theme }) => theme.spacing[3]};
  text-align: left;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[700]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const TableRow = styled.tr`
  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: capitalize;
  
  ${({ theme, status }) => {
    switch (status) {
      case 'active':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[700]};
        `;
      case 'inactive':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[700]};
        `;
      case 'pending':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[700]};
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[700]};
        `;
    }
  }}
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.gray[600]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  margin-right: ${({ theme }) => theme.spacing[1]};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[100]};
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const SystemMetric = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};

  &:last-child {
    border-bottom: none;
  }
`;

const MetricLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const MetricValue = styled.span<{ status?: 'good' | 'warning' | 'error' }>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme, status }) => {
    switch (status) {
      case 'good': return theme.colors.success[600];
      case 'warning': return theme.colors.warning[600];
      case 'error': return theme.colors.error[600];
      default: return theme.colors.gray[900];
    }
  }};
`;

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  society: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
}

interface SystemMetricData {
  label: string;
  value: string;
  status?: 'good' | 'warning' | 'error';
}

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetricData[]>([]);
  const [loading, setLoading] = useState(true);

  const adminTabs = [
    { id: 'users', label: 'User Management', icon: <FiUsers size={16} /> },
    { id: 'roles', label: 'Roles & Permissions', icon: <FiKey size={16} /> },
    { id: 'system', label: 'System Health', icon: <FiActivity size={16} /> },
    { id: 'settings', label: 'System Settings', icon: <FiSettings size={16} /> }
  ];

  const adminActions = [
    {
      title: 'User Management',
      description: 'Manage user accounts, roles, and permissions across all societies.',
      icon: <FiUsers size={24} />,
      color: '#3B82F6'
    },
    {
      title: 'System Settings',
      description: 'Configure application settings, integrations, and global preferences.',
      icon: <FiSettings size={24} />,
      color: '#10B981'
    },
    {
      title: 'Database Management',
      description: 'Monitor database performance, backups, and maintenance tasks.',
      icon: <FiDatabase size={24} />,
      color: '#F59E0B'
    },
    {
      title: 'Security Audit',
      description: 'Review security logs, access patterns, and system vulnerabilities.',
      icon: <FiShield size={24} />,
      color: '#EF4444'
    },
    {
      title: 'System Health',
      description: 'Monitor server performance, uptime, and resource utilization.',
      icon: <FiActivity size={24} />,
      color: '#8B5CF6'
    },
    {
      title: 'Error Monitoring',
      description: 'Track application errors, exceptions, and system failures.',
      icon: <FiAlertTriangle size={24} />,
      color: '#EC4899'
    }
  ];

  useEffect(() => {
    // Mock data for demonstration
    const mockUsers: AdminUser[] = [
      {
        id: 1,
        name: 'John Smith',
        email: 'john.smith@example.com',
        role: 'Super Admin',
        society: 'All Societies',
        status: 'active',
        lastActive: '2024-01-15 14:30'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        role: 'Society Admin',
        society: 'SNN Raj Serenity',
        status: 'active',
        lastActive: '2024-01-15 12:15'
      },
      {
        id: 3,
        name: 'Mike Wilson',
        email: 'mike.wilson@example.com',
        role: 'Finance Manager',
        society: 'Brigade Meadows',
        status: 'active',
        lastActive: '2024-01-14 18:45'
      },
      {
        id: 4,
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        role: 'Resident',
        society: 'Prestige Parkview',
        status: 'pending',
        lastActive: '2024-01-13 09:20'
      },
      {
        id: 5,
        name: 'David Brown',
        email: 'david.brown@example.com',
        role: 'Vendor',
        society: 'Multiple',
        status: 'inactive',
        lastActive: '2024-01-10 16:30'
      }
    ];

    const mockSystemMetrics: SystemMetricData[] = [
      { label: 'Server Uptime', value: '99.9%', status: 'good' },
      { label: 'Database Performance', value: '145ms avg', status: 'good' },
      { label: 'Active Sessions', value: '1,247', status: 'good' },
      { label: 'API Response Time', value: '89ms avg', status: 'good' },
      { label: 'Error Rate', value: '0.02%', status: 'good' },
      { label: 'Storage Usage', value: '67% of 2TB', status: 'warning' },
      { label: 'Memory Usage', value: '78% of 32GB', status: 'warning' },
      { label: 'Failed Logins (24h)', value: '12 attempts', status: 'warning' }
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setSystemMetrics(mockSystemMetrics);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <FiCheck size={12} />;
      case 'inactive':
        return <FiX size={12} />;
      case 'pending':
        return <FiAlertTriangle size={12} />;
      default:
        return null;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <Section>
            <SectionTitle>
              <FiUsers size={20} />
              User Management
            </SectionTitle>
            <UserTable>
              <Table>
                <thead>
                  <tr>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Email</TableHeader>
                    <TableHeader>Role</TableHeader>
                    <TableHeader>Society</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Last Active</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.society}</TableCell>
                      <TableCell>
                        <StatusBadge status={user.status}>
                          {getStatusIcon(user.status)}
                          {user.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell>
                        <ActionButton title="Edit">
                          <FiEdit size={14} />
                        </ActionButton>
                        <ActionButton title="Delete">
                          <FiTrash2 size={14} />
                        </ActionButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </UserTable>
          </Section>
        );

      case 'system':
        return (
          <Section>
            <SectionTitle>
              <FiActivity size={20} />
              System Health Metrics
            </SectionTitle>
            {systemMetrics.map((metric, index) => (
              <SystemMetric key={index}>
                <MetricLabel>{metric.label}</MetricLabel>
                <MetricValue status={metric.status}>{metric.value}</MetricValue>
              </SystemMetric>
            ))}
          </Section>
        );

      default:
        return (
          <Section>
            <SectionTitle>
              Coming Soon
            </SectionTitle>
            <p>This section is under development.</p>
          </Section>
        );
    }
  };

  if (loading) {
    return (
      <Container>
        <Title>
          <FiShield size={32} />
          Administration
        </Title>
        <div>Loading admin panel...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <FiShield size={32} />
          Administration Panel
        </Title>
      </Header>

      <Grid>
        {adminActions.map((action, index) => (
          <AdminCard key={index}>
            <AdminCardIcon color={action.color}>
              {action.icon}
            </AdminCardIcon>
            <AdminCardTitle>{action.title}</AdminCardTitle>
            <AdminCardDescription>{action.description}</AdminCardDescription>
          </AdminCard>
        ))}
      </Grid>

      <TabsContainer>
        {adminTabs.map((tab) => (
          <Tab
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </Tab>
        ))}
      </TabsContainer>

      {renderTabContent()}
    </Container>
  );
};

export default AdminPage;
