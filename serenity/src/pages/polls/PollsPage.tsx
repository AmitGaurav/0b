import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { 
  FiCheckSquare, 
  FiPlus, 
  FiFilter, 
  FiSearch, 
  FiCalendar, 
  FiUsers, 
  FiBarChart, 
  FiClock, 
  FiAlertCircle,
  FiMessageSquare,
  FiEdit,
  FiTrash2,
  FiEye,
  FiShare2,
  FiDownload,
  FiTag,
  FiStar
} from 'react-icons/fi';
import { Poll, PollFilter, PollSort, PollStats, CreatePollData } from '../../types/polls';
import CreatePollForm from './CreatePollForm';

// Styled Components
const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: 700;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  border: 1px solid #e0e6ed;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: ${props => props.$color}20;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color};
  font-size: 1.25rem;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-size: 0.875rem;
`;

const ControlsBar = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  border: 1px solid #e0e6ed;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #e0e6ed;
  border-radius: 6px;
  background: #f8f9fa;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #3498db;
    background: white;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #e0e6ed;
  border-radius: 6px;
  background: white;
  font-size: 0.875rem;
  color: #2c3e50;
  min-width: 120px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const SortSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #e0e6ed;
  border-radius: 6px;
  background: white;
  font-size: 0.875rem;
  color: #2c3e50;
  min-width: 140px;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #2980b9;
    transform: translateY(-1px);
  }
`;

const PollsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const PollCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  border: 1px solid #e0e6ed;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const PollHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #e0e6ed;
`;

const PollTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.4;
`;

const PollDescription = styled.p`
  margin: 0 0 1rem 0;
  color: #7f8c8d;
  font-size: 0.875rem;
  line-height: 1.5;
`;

const PollMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #7f8c8d;
`;

const StatusBadge = styled.span<{ $status: Poll['status'] }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    switch (props.$status) {
      case 'active':
        return '#27ae60';
      case 'completed':
        return '#95a5a6';
      case 'draft':
        return '#f39c12';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  }};
  color: white;
`;

const CategoryBadge = styled.span<{ $category: Poll['category'] }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => {
    switch (props.$category) {
      case 'governance':
        return '#3498db20';
      case 'maintenance':
        return '#e74c3c20';
      case 'amenities':
        return '#2ecc7120';
      case 'social':
        return '#9b59b620';
      case 'financial':
        return '#f39c1220';
      default:
        return '#95a5a620';
    }
  }};
  color: ${props => {
    switch (props.$category) {
      case 'governance':
        return '#3498db';
      case 'maintenance':
        return '#e74c3c';
      case 'amenities':
        return '#2ecc71';
      case 'social':
        return '#9b59b6';
      case 'financial':
        return '#f39c12';
      default:
        return '#95a5a6';
    }
  }};
`;

const PollContent = styled.div`
  padding: 1.5rem;
`;

const OptionsContainer = styled.div`
  margin-bottom: 1rem;
`;

const OptionItem = styled.div`
  margin-bottom: 0.75rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const OptionText = styled.span`
  font-size: 0.875rem;
  color: #2c3e50;
  font-weight: 500;
`;

const OptionPercentage = styled.span`
  font-size: 0.875rem;
  color: #7f8c8d;
  font-weight: 600;
`;

const ProgressBar = styled.div`
  height: 6px;
  background: #ecf0f1;
  border-radius: 3px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number; $color: string }>`
  height: 100%;
  background: ${props => props.$color};
  width: ${props => props.$percentage}%;
  transition: width 0.3s ease;
`;

const PollActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e6ed;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  border: 1px solid;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: #3498db;
          border-color: #3498db;
          color: white;
          &:hover {
            background: #2980b9;
            border-color: #2980b9;
          }
        `;
      case 'danger':
        return `
          background: transparent;
          border-color: #e74c3c;
          color: #e74c3c;
          &:hover {
            background: #e74c3c;
            color: white;
          }
        `;
      default:
        return `
          background: transparent;
          border-color: #bdc3c7;
          color: #7f8c8d;
          &:hover {
            background: #f8f9fa;
            border-color: #95a5a6;
          }
        `;
    }
  }}
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #7f8c8d;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  color: #bdc3c7;
  margin-bottom: 1rem;
`;

const EmptyTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.25rem;
`;

const EmptyDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
`;

// Mock Data
const mockPollStats: PollStats = {
  totalPolls: 24,
  activePolls: 5,
  completedPolls: 18,
  draftPolls: 1,
  totalParticipation: 342,
  averageParticipationRate: 78.5
};

const mockPolls: Poll[] = [
  {
    id: '1',
    title: 'Society Garden Renovation Proposal',
    description: 'Should we proceed with the proposed garden renovation including new landscaping, seating areas, and a children\'s play zone?',
    type: 'single-choice',
    status: 'active',
    category: 'amenities',
    options: [
      { id: '1', text: 'Yes, proceed with full renovation', votes: 45, percentage: 67.2 },
      { id: '2', text: 'Partial renovation only', votes: 15, percentage: 22.4 },
      { id: '3', text: 'No, maintain current garden', votes: 7, percentage: 10.4 }
    ],
    totalVotes: 67,
    allowMultipleVotes: false,
    allowAnonymousVoting: true,
    showResultsBeforeEnd: true,
    requireAuthentication: true,
    targetAudience: 'all',
    createdBy: { id: '1', name: 'Society Committee', role: 'Committee' },
    createdAt: new Date('2024-01-15'),
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-01-25'),
    lastUpdated: new Date('2024-01-20'),
    voters: [],
    comments: [],
    tags: ['renovation', 'amenities', 'garden'],
    isUrgent: false
  },
  {
    id: '2',
    title: 'Annual Maintenance Fee Increase',
    description: 'Due to rising costs, the committee proposes a 12% increase in annual maintenance fees. Your input is valuable for this decision.',
    type: 'yes-no',
    status: 'active',
    category: 'financial',
    options: [
      { id: '1', text: 'Yes, I agree with the increase', votes: 34, percentage: 58.6 },
      { id: '2', text: 'No, I disagree with the increase', votes: 24, percentage: 41.4 }
    ],
    totalVotes: 58,
    allowMultipleVotes: false,
    allowAnonymousVoting: false,
    showResultsBeforeEnd: false,
    requireAuthentication: true,
    targetAudience: 'owners',
    createdBy: { id: '2', name: 'Finance Committee', role: 'Committee' },
    createdAt: new Date('2024-01-10'),
    startDate: new Date('2024-01-12'),
    endDate: new Date('2024-01-22'),
    lastUpdated: new Date('2024-01-18'),
    voters: [],
    comments: [],
    tags: ['finance', 'maintenance', 'fees'],
    isUrgent: true
  },
  {
    id: '3',
    title: 'Swimming Pool Operating Hours',
    description: 'What should be the new operating hours for the swimming pool during winter season?',
    type: 'single-choice',
    status: 'completed',
    category: 'amenities',
    options: [
      { id: '1', text: '6:00 AM - 10:00 PM', votes: 28, percentage: 31.1 },
      { id: '2', text: '7:00 AM - 9:00 PM', votes: 42, percentage: 46.7 },
      { id: '3', text: '8:00 AM - 8:00 PM', votes: 20, percentage: 22.2 }
    ],
    totalVotes: 90,
    allowMultipleVotes: false,
    allowAnonymousVoting: true,
    showResultsBeforeEnd: true,
    requireAuthentication: true,
    targetAudience: 'all',
    createdBy: { id: '3', name: 'Amenities Committee', role: 'Committee' },
    createdAt: new Date('2023-12-01'),
    startDate: new Date('2023-12-02'),
    endDate: new Date('2023-12-15'),
    lastUpdated: new Date('2023-12-15'),
    voters: [],
    comments: [],
    tags: ['pool', 'hours', 'winter'],
    isUrgent: false
  },
  {
    id: '4',
    title: 'Security System Upgrade Options',
    description: 'Which security improvements should we prioritize for the society?',
    type: 'multiple-choice',
    status: 'active',
    category: 'governance',
    options: [
      { id: '1', text: 'CCTV camera upgrade', votes: 52, percentage: 35.4 },
      { id: '2', text: 'Access control system', votes: 38, percentage: 25.9 },
      { id: '3', text: 'Additional security guards', votes: 29, percentage: 19.7 },
      { id: '4', text: 'Intercom system upgrade', votes: 28, percentage: 19.0 }
    ],
    totalVotes: 73,
    allowMultipleVotes: true,
    allowAnonymousVoting: false,
    showResultsBeforeEnd: true,
    requireAuthentication: true,
    targetAudience: 'all',
    createdBy: { id: '4', name: 'Security Committee', role: 'Committee' },
    createdAt: new Date('2024-01-08'),
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-01-24'),
    lastUpdated: new Date('2024-01-19'),
    voters: [],
    comments: [],
    tags: ['security', 'upgrade', 'safety'],
    isUrgent: false
  },
  {
    id: '5',
    title: 'Community Event Preferences',
    description: 'What type of community events would you like to see organized this year?',
    type: 'multiple-choice',
    status: 'draft',
    category: 'social',
    options: [
      { id: '1', text: 'Cultural festivals', votes: 0, percentage: 0 },
      { id: '2', text: 'Sports tournaments', votes: 0, percentage: 0 },
      { id: '3', text: 'Workshop sessions', votes: 0, percentage: 0 },
      { id: '4', text: 'Movie screenings', votes: 0, percentage: 0 }
    ],
    totalVotes: 0,
    allowMultipleVotes: true,
    allowAnonymousVoting: true,
    showResultsBeforeEnd: true,
    requireAuthentication: true,
    targetAudience: 'all',
    createdBy: { id: '5', name: 'Social Committee', role: 'Committee' },
    createdAt: new Date('2024-01-20'),
    startDate: new Date('2024-01-25'),
    endDate: new Date('2024-02-08'),
    lastUpdated: new Date('2024-01-20'),
    voters: [],
    comments: [],
    tags: ['community', 'events', 'social'],
    isUrgent: false
  }
];

const PollsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<PollFilter>('all');
  const [selectedSort, setSelectedSort] = useState<PollSort>('newest');
  const [showCreatePollModal, setShowCreatePollModal] = useState(false);

  // Filter and sort polls
  const filteredPolls = useMemo(() => {
    let filtered = mockPolls;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(poll =>
        poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poll.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poll.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter
    switch (selectedFilter) {
      case 'active':
        filtered = filtered.filter(poll => poll.status === 'active');
        break;
      case 'completed':
        filtered = filtered.filter(poll => poll.status === 'completed');
        break;
      case 'my-polls':
        // In a real app, this would filter by current user's polls
        filtered = filtered.filter(poll => poll.createdBy.id === '1');
        break;
      case 'not-voted':
        // In a real app, this would filter polls the user hasn't voted on
        filtered = filtered.filter(poll => poll.status === 'active');
        break;
    }

    // Apply sorting
    switch (selectedSort) {
      case 'oldest':
        filtered = filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'most-votes':
        filtered = filtered.sort((a, b) => b.totalVotes - a.totalVotes);
        break;
      case 'ending-soon':
        filtered = filtered.sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
        break;
      case 'alphabetical':
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        filtered = filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
    }

    return filtered;
  }, [searchTerm, selectedFilter, selectedSort]);

  const getOptionColor = (index: number): string => {
    const colors = ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6'];
    return colors[index % colors.length];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (endDate: Date): number => {
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleVote = (pollId: string, optionId: string) => {
    console.log(`Voting for poll ${pollId}, option ${optionId}`);
    // In a real app, this would make an API call
  };

  const handleCreatePoll = () => {
    setShowCreatePollModal(true);
  };

  const handleCreatePollSubmit = async (pollData: CreatePollData) => {
    try {
      console.log('Creating new poll:', pollData);
      // In a real app, this would make an API call to create the poll
      // const response = await api.createPoll(pollData);
      
      // For now, we'll just simulate success
      alert('Poll created successfully!');
      setShowCreatePollModal(false);
      
      // TODO: Refresh polls list or add the new poll to the existing list
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('Failed to create poll. Please try again.');
    }
  };

  return (
    <Container>
      <Header>
          <HeaderLeft>
            <Title>Polls & Surveys</Title>
          </HeaderLeft>
          <HeaderRight>
            <CreateButton onClick={handleCreatePoll}>
              <FiPlus />
              Create Poll
            </CreateButton>
          </HeaderRight>
        </Header>

        {/* Statistics */}
        <StatsGrid>
          <StatCard>
            <StatIcon $color="#3498db">
              <FiCheckSquare />
            </StatIcon>
            <StatContent>
              <StatValue>{mockPollStats.totalPolls}</StatValue>
              <StatLabel>Total Polls</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon $color="#2ecc71">
              <FiClock />
            </StatIcon>
            <StatContent>
              <StatValue>{mockPollStats.activePolls}</StatValue>
              <StatLabel>Active Polls</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon $color="#f39c12">
              <FiUsers />
            </StatIcon>
            <StatContent>
              <StatValue>{mockPollStats.totalParticipation}</StatValue>
              <StatLabel>Total Votes</StatLabel>
            </StatContent>
          </StatCard>
          <StatCard>
            <StatIcon $color="#9b59b6">
              <FiBarChart />
            </StatIcon>
            <StatContent>
              <StatValue>{mockPollStats.averageParticipationRate}%</StatValue>
              <StatLabel>Participation Rate</StatLabel>
            </StatContent>
          </StatCard>
        </StatsGrid>

        {/* Controls */}
        <ControlsBar>
          <SearchContainer>
            <SearchIcon>
              <FiSearch />
            </SearchIcon>
            <SearchInput
              placeholder="Search polls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          
          <FilterSelect
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as PollFilter)}
          >
            <option value="all">All Polls</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="my-polls">My Polls</option>
            <option value="not-voted">Not Voted</option>
          </FilterSelect>

          <SortSelect
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value as PollSort)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most-votes">Most Votes</option>
            <option value="ending-soon">Ending Soon</option>
            <option value="alphabetical">A-Z</option>
          </SortSelect>
        </ControlsBar>

        {/* Polls List */}
        {filteredPolls.length > 0 ? (
          <PollsGrid>
            {filteredPolls.map((poll) => (
              <PollCard key={poll.id}>
                <PollHeader>
                  <PollTitle>{poll.title}</PollTitle>
                  <PollDescription>{poll.description}</PollDescription>
                  <PollMeta>
                    <StatusBadge $status={poll.status}>
                      {poll.status.charAt(0).toUpperCase() + poll.status.slice(1)}
                    </StatusBadge>
                    <CategoryBadge $category={poll.category}>
                      {poll.category.charAt(0).toUpperCase() + poll.category.slice(1)}
                    </CategoryBadge>
                    {poll.isUrgent && (
                      <MetaItem style={{ color: '#e74c3c', fontWeight: 600 }}>
                        <FiAlertCircle />
                        Urgent
                      </MetaItem>
                    )}
                    <MetaItem>
                      <FiCalendar />
                      Ends {formatDate(poll.endDate)}
                      {poll.status === 'active' && ` (${getDaysRemaining(poll.endDate)} days left)`}
                    </MetaItem>
                    <MetaItem>
                      <FiUsers />
                      {poll.totalVotes} votes
                    </MetaItem>
                  </PollMeta>
                </PollHeader>

                <PollContent>
                  <OptionsContainer>
                    {poll.options.map((option, index) => (
                      <OptionItem key={option.id}>
                        <OptionRow>
                          <OptionText>{option.text}</OptionText>
                          {(poll.showResultsBeforeEnd || poll.status === 'completed') && (
                            <OptionPercentage>
                              {option.percentage.toFixed(1)}% ({option.votes})
                            </OptionPercentage>
                          )}
                        </OptionRow>
                        {(poll.showResultsBeforeEnd || poll.status === 'completed') && (
                          <ProgressBar>
                            <ProgressFill 
                              $percentage={option.percentage} 
                              $color={getOptionColor(index)}
                            />
                          </ProgressBar>
                        )}
                      </OptionItem>
                    ))}
                  </OptionsContainer>

                  <PollActions>
                    {poll.status === 'active' && (
                      <ActionButton 
                        $variant="primary"
                        onClick={() => handleVote(poll.id, poll.options[0].id)}
                      >
                        <FiCheckSquare />
                        Vote
                      </ActionButton>
                    )}
                    <ActionButton>
                      <FiEye />
                      View Details
                    </ActionButton>
                    <ActionButton>
                      <FiMessageSquare />
                      Comments ({poll.comments.length})
                    </ActionButton>
                    <ActionButton>
                      <FiShare2 />
                      Share
                    </ActionButton>
                    {poll.status === 'completed' && (
                      <ActionButton>
                        <FiDownload />
                        Export Results
                      </ActionButton>
                    )}
                  </PollActions>
                </PollContent>
              </PollCard>
            ))}
          </PollsGrid>
        ) : (
          <EmptyState>
            <EmptyIcon>
              <FiCheckSquare />
            </EmptyIcon>
            <EmptyTitle>No polls found</EmptyTitle>
            <EmptyDescription>
              {searchTerm ? 
                'No polls match your search criteria. Try different keywords or filters.' :
                'No polls available. Create a new poll to get started with community engagement.'
              }
            </EmptyDescription>
          </EmptyState>
        )}
        
        <CreatePollForm
          isOpen={showCreatePollModal}
          onClose={() => setShowCreatePollModal(false)}
          onSubmit={handleCreatePollSubmit}
        />
      </Container>
    );
  };

  export default PollsPage;