import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiBarChart, FiDownload, FiCalendar, FiFilter, FiTrendingUp, FiUsers, FiHome, FiDollarSign } from 'react-icons/fi';
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

const FilterBar = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  align-items: center;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const FilterLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterSelect = styled.select`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[400]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const FilterInput = styled.input`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  background: ${({ theme }) => theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[400]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const ReportCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.boxShadow.lg};
  }
`;

const ReportIcon = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  background: ${({ color }) => color}20;
  color: ${({ color }) => color};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ReportTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ReportDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  line-height: 1.5;
`;

const ReportMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[100]};
`;

const ReportType = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[500]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.primary[600]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[700]};
  }
`;

const QuickStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

interface Report {
  id: number;
  title: string;
  description: string;
  type: string;
  icon: React.ReactNode;
  color: string;
  lastGenerated?: string;
}

interface QuickStat {
  label: string;
  value: string | number;
  format?: 'currency' | 'percentage' | 'number';
}

const ReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedSociety, setSelectedSociety] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  const reports: Report[] = [
    {
      id: 1,
      title: 'Financial Summary',
      description: 'Comprehensive overview of income, expenses, and pending payments across all societies.',
      type: 'financial',
      icon: <FiDollarSign size={24} />,
      color: '#10B981',
      lastGenerated: '2024-01-15'
    },
    {
      id: 2,
      title: 'Occupancy Report',
      description: 'Detailed analysis of unit occupancy rates, vacant units, and rental status.',
      type: 'occupancy',
      icon: <FiHome size={24} />,
      color: '#3B82F6',
      lastGenerated: '2024-01-14'
    },
    {
      id: 3,
      title: 'Maintenance Collection',
      description: 'Track maintenance fee collection rates, pending amounts, and payment trends.',
      type: 'maintenance',
      icon: <FiBarChart size={24} />,
      color: '#F59E0B',
      lastGenerated: '2024-01-13'
    },
    {
      id: 4,
      title: 'Vendor Performance',
      description: 'Evaluate vendor service quality, completion rates, and cost analysis.',
      type: 'vendor',
      icon: <FiTrendingUp size={24} />,
      color: '#8B5CF6',
      lastGenerated: '2024-01-12'
    },
    {
      id: 5,
      title: 'Resident Demographics',
      description: 'Analysis of resident profiles, family sizes, and demographic distributions.',
      type: 'demographics',
      icon: <FiUsers size={24} />,
      color: '#EF4444',
      lastGenerated: '2024-01-11'
    },
    {
      id: 6,
      title: 'Compliance Report',
      description: 'Track regulatory compliance, documentation status, and audit requirements.',
      type: 'compliance',
      icon: <FiBarChart size={24} />,
      color: '#06B6D4',
      lastGenerated: '2024-01-10'
    }
  ];

  const quickStats: QuickStat[] = [
    { label: 'Total Revenue', value: 2450000, format: 'currency' },
    { label: 'Collection Rate', value: 92, format: 'percentage' },
    { label: 'Occupied Units', value: 847 },
    { label: 'Pending Complaints', value: 23 },
    { label: 'Active Vendors', value: 45 },
    { label: 'Societies', value: 12 }
  ];

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const formatValue = (value: string | number, format?: string) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value as number);
    }
    if (format === 'percentage') {
      return `${value}%`;
    }
    return value.toString();
  };

  const handleDownload = (report: Report) => {
    // Mock download functionality
    console.log(`Downloading ${report.title} report...`);
  };

  if (loading) {
    return (
      <Container>
        <Title>
          <FiBarChart size={32} />
          Reports
        </Title>
        <div>Loading reports...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <FiBarChart size={32} />
          Reports & Analytics
        </Title>
      </Header>

      <FilterBar>
        <FilterGroup>
          <FilterLabel>Period</FilterLabel>
          <FilterSelect
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom Range</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Society</FilterLabel>
          <FilterSelect
            value={selectedSociety}
            onChange={(e) => setSelectedSociety(e.target.value)}
          >
            <option value="all">All Societies</option>
            <option value="1">SNN Raj Serenity</option>
            <option value="2">Brigade Meadows</option>
            <option value="3">Prestige Parkview</option>
          </FilterSelect>
        </FilterGroup>

        {selectedPeriod === 'custom' && (
          <>
            <FilterGroup>
              <FilterLabel>Start Date</FilterLabel>
              <FilterInput
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>End Date</FilterLabel>
              <FilterInput
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </FilterGroup>
          </>
        )}
      </FilterBar>

      <QuickStatsGrid>
        {quickStats.map((stat, index) => (
          <StatCard key={index}>
            <StatValue>{formatValue(stat.value, stat.format)}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </StatCard>
        ))}
      </QuickStatsGrid>

      <ReportsGrid>
        {reports.map((report) => (
          <ReportCard key={report.id} onClick={() => handleDownload(report)}>
            <ReportIcon color={report.color}>
              {report.icon}
            </ReportIcon>
            <ReportTitle>{report.title}</ReportTitle>
            <ReportDescription>{report.description}</ReportDescription>
            <ReportMeta>
              <ReportType>{report.type}</ReportType>
              <DownloadButton onClick={(e) => {
                e.stopPropagation();
                handleDownload(report);
              }}>
                <FiDownload size={12} />
                Download
              </DownloadButton>
            </ReportMeta>
          </ReportCard>
        ))}
      </ReportsGrid>
    </Container>
  );
};

export default ReportsPage;
