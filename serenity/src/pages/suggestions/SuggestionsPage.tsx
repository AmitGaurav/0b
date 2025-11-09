import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter,
  FiUser,
  FiClock,
  FiHeart,
  FiMessageCircle,
  FiTrendingUp,
  FiEdit,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiX,
  FiRefreshCw
} from 'react-icons/fi';
import { HiLightBulb } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../contexts/AuthContext';
import { 
  Suggestion, 
  SuggestionFormData, 
  SuggestionDisplayItem, 
  SuggestionFilters,
  SuggestionCategory,
  SuggestionPriority,
  SuggestionStatus
} from '../../types/suggestion';
import SuggestionForm from '../../components/forms/SuggestionForm';

// Styled Components
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

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing[4]};
    align-items: stretch;
  }
`;

const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    justify-content: center;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[600]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[700]};
  }

  &.secondary {
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.gray[700]};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};

    &:hover {
      background: ${({ theme }) => theme.colors.gray[50]};
    }
  }
`;

const FiltersSection = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr 1fr auto;
    gap: ${({ theme }) => theme.spacing[3]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const SearchInput = styled.div`
  position: relative;
  
  input {
    width: 100%;
    padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    transition: ${({ theme }) => theme.transition.colors};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary[500]};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    }
  }

  .search-icon {
    position: absolute;
    right: ${({ theme }) => theme.spacing[4]};
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[600]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const SuggestionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const SuggestionCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing[6]};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: ${({ theme }) => theme.transition.colors};

  &:hover {
    box-shadow: ${({ theme }) => theme.boxShadow.md};
  }
`;

const SuggestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const AuthorAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const AuthorDetails = styled.div``;

const AuthorName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const SuggestionDate = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SuggestionContent = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  white-space: pre-wrap;
`;

const SuggestionActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding-top: ${({ theme }) => theme.spacing[3]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[100]};
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const LikeButton = styled.button<{ isLiked?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ isLiked, theme }) => 
    isLiked ? theme.colors.error[100] : 'transparent'};
  color: ${({ isLiked, theme }) => 
    isLiked ? theme.colors.error[600] : theme.colors.gray[600]};
  border: 1px solid ${({ isLiked, theme }) => 
    isLiked ? theme.colors.error[300] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};

  &:hover {
    background: ${({ isLiked, theme }) => 
      isLiked ? theme.colors.error[200] : theme.colors.gray[100]};
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[2]};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.gray[600]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[800]};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[12]} ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  opacity: 0.5;
`;

const EmptyStateText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const AdvancedFilters = styled.div<{ isExpanded: boolean }>`
  display: ${({ isExpanded }) => (isExpanded ? 'block' : 'none')};
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const FilterRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FilterLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const DateInput = styled.input`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  margin-right: ${({ theme }) => theme.spacing[2]};
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const FilterActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const ClearFiltersButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[600]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[800]};
  }
`;

const FilterToggleButton = styled.button<{ isExpanded: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[700]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }

  svg {
    transform: ${({ isExpanded }) => 
      isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
    transition: transform 0.2s ease;
  }
`;

const ActiveFiltersCount = styled.span`
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: 2px 8px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-left: ${({ theme }) => theme.spacing[1]};
`;

const CategoryBadge = styled.span<{ category: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  
  ${({ category, theme }) => {
    switch (category) {
      case 'Infrastructure':
        return `background: ${theme.colors.primary[100]}; color: ${theme.colors.primary[700]};`;
      case 'Amenities':
        return `background: ${theme.colors.secondary[100]}; color: ${theme.colors.secondary[700]};`;
      case 'Security':
        return `background: ${theme.colors.error[100]}; color: ${theme.colors.error[700]};`;
      case 'Community':
        return `background: ${theme.colors.success[100]}; color: ${theme.colors.success[700]};`;
      case 'Environment':
        return `background: ${theme.colors.warning[100]}; color: ${theme.colors.warning[700]};`;
      default:
        return `background: ${theme.colors.gray[100]}; color: ${theme.colors.gray[700]};`;
    }
  }}
`;

const SuggestionsPage: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdDate');
  const [suggestions, setSuggestions] = useState<SuggestionDisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedSuggestions, setLikedSuggestions] = useState<Set<number>>(new Set());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  
  // Advanced filter state
  const [filters, setFilters] = useState<SuggestionFilters>({
    searchTerm: '',
    category: 'all',
    priority: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'createdDate',
    sortOrder: 'desc',
    showOnlyMine: false,
    selectedAuthors: []
  });

  // Mock data for suggestions
  const mockSuggestions: SuggestionDisplayItem[] = [
    {
      id: 1,
      appUserId: 1,
      societyId: 1,
      detail: "I suggest installing solar panels on the rooftop to reduce electricity costs and promote sustainable energy usage. This would benefit all residents and help reduce our carbon footprint.",
      createdBy: "John Doe",
      createdDate: "2024-01-15T10:30:00",
      authorName: "John Doe",
      timeAgo: "2 days ago",
      isOwn: user?.name === "John Doe",
      category: SuggestionCategory.ENVIRONMENT,
      priority: SuggestionPriority.HIGH,
      status: SuggestionStatus.UNDER_REVIEW
    },
    {
      id: 2,
      appUserId: 2,
      societyId: 1,
      detail: "We should create a community garden in the unused space behind Block C. It would provide fresh vegetables for residents and create a beautiful green space for children to play and learn about gardening.",
      createdBy: "Sarah Johnson",
      createdDate: "2024-01-14T14:20:00",
      authorName: "Sarah Johnson",
      timeAgo: "3 days ago",
      isOwn: user?.name === "Sarah Johnson",
      category: SuggestionCategory.AMENITIES,
      priority: SuggestionPriority.MEDIUM,
      status: SuggestionStatus.APPROVED
    },
    {
      id: 3,
      appUserId: 3,
      societyId: 1,
      detail: "I recommend organizing monthly community events like movie nights, cultural programs, and sports tournaments. This would help neighbors get to know each other better and build a stronger community spirit.",
      createdBy: "Mike Wilson",
      createdDate: "2024-01-13T09:15:00",
      authorName: "Mike Wilson",
      timeAgo: "4 days ago",
      isOwn: user?.name === "Mike Wilson",
      category: SuggestionCategory.COMMUNITY,
      priority: SuggestionPriority.LOW,
      status: SuggestionStatus.IN_PROGRESS
    },
    {
      id: 4,
      appUserId: 4,
      societyId: 1,
      detail: "The society should install EV charging stations in the parking area. With more residents buying electric vehicles, this would be a valuable amenity and show our commitment to environmental sustainability.",
      createdBy: "Lisa Chen",
      createdDate: "2024-01-12T16:45:00",
      authorName: "Lisa Chen",
      timeAgo: "5 days ago",
      isOwn: user?.name === "Lisa Chen",
      category: SuggestionCategory.INFRASTRUCTURE,
      priority: SuggestionPriority.HIGH,
      status: SuggestionStatus.SUBMITTED
    },
    {
      id: 5,
      appUserId: 5,
      societyId: 1,
      detail: "I suggest creating a carpooling system for residents working in similar locations. This could be managed through a simple WhatsApp group or mobile app, helping reduce traffic congestion and fuel costs.",
      createdBy: "David Kumar",
      createdDate: "2024-01-11T11:30:00",
      authorName: "David Kumar",
      timeAgo: "6 days ago",
      isOwn: user?.name === "David Kumar",
      category: SuggestionCategory.TECHNOLOGY,
      priority: SuggestionPriority.MEDIUM,
      status: SuggestionStatus.IMPLEMENTED
    },
    {
      id: 6,
      appUserId: 6,
      societyId: 1,
      detail: "We need better security measures at the main gate. I suggest installing CCTV cameras and having round-the-clock security guards to ensure the safety of all residents.",
      createdBy: "Emily Rodriguez",
      createdDate: "2024-01-10T08:00:00",
      authorName: "Emily Rodriguez",
      timeAgo: "1 week ago",
      isOwn: user?.name === "Emily Rodriguez",
      category: SuggestionCategory.SECURITY,
      priority: SuggestionPriority.URGENT,
      status: SuggestionStatus.UNDER_REVIEW
    },
    {
      id: 7,
      appUserId: 7,
      societyId: 1,
      detail: "A children's playground would be a wonderful addition to our society. It would provide a safe space for kids to play and would increase the value of our properties.",
      createdBy: "Robert Brown",
      createdDate: "2024-01-09T19:30:00",
      authorName: "Robert Brown",
      timeAgo: "1 week ago",
      isOwn: user?.name === "Robert Brown",
      category: SuggestionCategory.AMENITIES,
      priority: SuggestionPriority.MEDIUM,
      status: SuggestionStatus.REJECTED
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadSuggestions = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuggestions(mockSuggestions);
      setLoading(false);
    };

    loadSuggestions();
  }, []);

  const getFilteredSuggestions = () => {
    let filtered = suggestions;

    // Search filter
    if (searchTerm || filters.searchTerm) {
      const searchValue = searchTerm || filters.searchTerm;
      filtered = filtered.filter(suggestion =>
        suggestion.detail.toLowerCase().includes(searchValue.toLowerCase()) ||
        suggestion.authorName?.toLowerCase().includes(searchValue.toLowerCase()) ||
        suggestion.category?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(suggestion => suggestion.category === filters.category);
    }

    // Priority filter
    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(suggestion => suggestion.priority === filters.priority);
    }

    // Status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(suggestion => suggestion.status === filters.status);
    }

    // Show only mine filter
    if (filters.showOnlyMine) {
      filtered = filtered.filter(suggestion => suggestion.isOwn);
    }

    // Date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(suggestion => 
        new Date(suggestion.createdDate) >= fromDate
      );
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(suggestion => 
        new Date(suggestion.createdDate) <= toDate
      );
    }

    // Sort suggestions
    filtered.sort((a, b) => {
      const sortField = filters.sortBy || sortBy;
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      
      if (sortField === 'createdDate') {
        return (new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()) * order;
      } else if (sortField === 'priority') {
        const priorityOrder = { [SuggestionPriority.URGENT]: 4, [SuggestionPriority.HIGH]: 3, [SuggestionPriority.MEDIUM]: 2, [SuggestionPriority.LOW]: 1 };
        const aPriority = priorityOrder[a.priority || SuggestionPriority.LOW];
        const bPriority = priorityOrder[b.priority || SuggestionPriority.LOW];
        return (bPriority - aPriority) * order;
      }
      return 0;
    });

    return filtered;
  };

  // Filter helper functions
  const updateFilter = (key: keyof SuggestionFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      category: 'all',
      priority: 'all',
      status: 'all',
      dateFrom: '',
      dateTo: '',
      sortBy: 'createdDate',
      sortOrder: 'desc',
      showOnlyMine: false,
      selectedAuthors: []
    });
    setSearchTerm('');
    setSortBy('createdDate');
    setIsFiltersExpanded(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.priority !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    if (filters.showOnlyMine) count++;
    if (filters.searchTerm) count++;
    return count;
  };

  const handleLike = (suggestionId: number) => {
    const newLikedSuggestions = new Set(likedSuggestions);
    if (likedSuggestions.has(suggestionId)) {
      newLikedSuggestions.delete(suggestionId);
    } else {
      newLikedSuggestions.add(suggestionId);
    }
    setLikedSuggestions(newLikedSuggestions);
  };

  const getUserInitials = (name: string): string => {
    return name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().substring(0, 2);
  };

  const handleSuggestionSubmit = async (formData: SuggestionFormData) => {
    try {
      const newSuggestion: SuggestionDisplayItem = {
        id: Math.max(...suggestions.map(s => s.id || 0)) + 1,
        appUserId: user?.userId || 0,
        societyId: user?.societyId || 1,
        detail: formData.detail,
        createdBy: user?.name || 'Unknown User',
        createdDate: new Date().toISOString(),
        authorName: user?.name || 'Unknown User',
        timeAgo: 'Just now',
        isOwn: true
      };

      setSuggestions(prev => [newSuggestion, ...prev]);
      console.log('New suggestion submitted:', newSuggestion);
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      throw error;
    }
  };

  const filteredSuggestions = getFilteredSuggestions();
  const totalSuggestions = suggestions.length;
  const mySuggestions = suggestions.filter(s => s.isOwn).length;
  const totalLikes = suggestions.reduce((acc, suggestion) => 
    acc + (likedSuggestions.has(suggestion.id || 0) ? 1 : 0), 0
  );

  if (loading) {
    return (
      <Container>
        <Title>
          <HiLightBulb size={32} />
          Suggestions
        </Title>
        <div>Loading suggestions...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          <HiLightBulb size={32} />
          Community Suggestions
        </Title>
        <HeaderActions>
          <ActionButton onClick={() => setIsFormOpen(true)}>
            <FiPlus size={16} />
            Share Your Idea
          </ActionButton>
        </HeaderActions>
      </Header>

      <StatsSection>
        <StatCard>
          <StatNumber>{totalSuggestions}</StatNumber>
          <StatLabel>Total Suggestions</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{mySuggestions}</StatNumber>
          <StatLabel>My Suggestions</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{totalLikes}</StatNumber>
          <StatLabel>Community Likes</StatLabel>
        </StatCard>
      </StatsSection>

      <FiltersSection>
        <FilterGrid>
          <SearchInput>
            <input
              type="text"
              placeholder="Search suggestions, categories, or authors..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                updateFilter('searchTerm', e.target.value);
              }}
            />
            <FiSearch className="search-icon" size={16} />
          </SearchInput>

          <Select 
            value={sortBy} 
            onChange={(e) => {
              setSortBy(e.target.value);
              updateFilter('sortBy', e.target.value as 'createdDate' | 'lastUpdated' | 'priority');
            }}
          >
            <option value="createdDate">Most Recent</option>
            <option value="priority">By Priority</option>
            <option value="lastUpdated">Last Updated</option>
          </Select>

          <FilterToggleButton 
            isExpanded={isFiltersExpanded}
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          >
            <FiFilter size={16} />
            More Filters
            {getActiveFiltersCount() > 0 && (
              <ActiveFiltersCount>{getActiveFiltersCount()}</ActiveFiltersCount>
            )}
            <FiChevronDown size={16} />
          </FilterToggleButton>
        </FilterGrid>

        <AdvancedFilters isExpanded={isFiltersExpanded}>
          <FilterRow>
            <FilterGroup>
              <FilterLabel>Category</FilterLabel>
              <Select 
                value={filters.category} 
                onChange={(e) => updateFilter('category', e.target.value)}
              >
                <option value="all">All Categories</option>
                {Object.values(SuggestionCategory).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Priority</FilterLabel>
              <Select 
                value={filters.priority} 
                onChange={(e) => updateFilter('priority', e.target.value)}
              >
                <option value="all">All Priorities</option>
                {Object.values(SuggestionPriority).map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </Select>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Status</FilterLabel>
              <Select 
                value={filters.status} 
                onChange={(e) => updateFilter('status', e.target.value)}
              >
                <option value="all">All Statuses</option>
                {Object.values(SuggestionStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Select>
            </FilterGroup>
          </FilterRow>

          <FilterRow>
            <FilterGroup>
              <FilterLabel>Date From</FilterLabel>
              <DateInput
                type="date"
                value={filters.dateFrom}
                onChange={(e) => updateFilter('dateFrom', e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Date To</FilterLabel>
              <DateInput
                type="date"
                value={filters.dateTo}
                onChange={(e) => updateFilter('dateTo', e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Sort Order</FilterLabel>
              <Select 
                value={filters.sortOrder} 
                onChange={(e) => updateFilter('sortOrder', e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </Select>
            </FilterGroup>
          </FilterRow>

          <FilterRow>
            <FilterGroup>
              <CheckboxLabel>
                <Checkbox
                  checked={filters.showOnlyMine}
                  onChange={(e) => updateFilter('showOnlyMine', e.target.checked)}
                />
                Show only my suggestions
              </CheckboxLabel>
            </FilterGroup>
          </FilterRow>

          <FilterActions>
            <ClearFiltersButton onClick={clearFilters}>
              <FiX size={14} />
              Clear All Filters
            </ClearFiltersButton>
          </FilterActions>
        </AdvancedFilters>
      </FiltersSection>

      <SuggestionsGrid>
        {filteredSuggestions.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon>💡</EmptyStateIcon>
            <EmptyStateText>
              {searchTerm 
                ? 'No suggestions match your search criteria.'
                : 'No suggestions yet. Be the first to share your idea!'}
            </EmptyStateText>
            <ActionButton onClick={() => setIsFormOpen(true)}>
              <FiPlus size={16} />
              Share Your First Idea
            </ActionButton>
          </EmptyState>
        ) : (
          filteredSuggestions.map((suggestion) => (
            <SuggestionCard key={suggestion.id}>
              <SuggestionHeader>
                <AuthorInfo>
                  <AuthorAvatar>
                    {suggestion.authorName ? getUserInitials(suggestion.authorName) : <FiUser size={16} />}
                  </AuthorAvatar>
                  <AuthorDetails>
                    <AuthorName>{suggestion.authorName}</AuthorName>
                    <SuggestionDate>
                      <FiClock size={12} />
                      {suggestion.timeAgo}
                    </SuggestionDate>
                  </AuthorDetails>
                </AuthorInfo>
              </SuggestionHeader>

              {suggestion.category && (
                <CategoryBadge category={suggestion.category}>
                  {suggestion.category}
                </CategoryBadge>
              )}

              <SuggestionContent>
                {suggestion.detail}
              </SuggestionContent>

              <SuggestionActions>
                <ActionGroup>
                  <LikeButton 
                    isLiked={likedSuggestions.has(suggestion.id || 0)}
                    onClick={() => handleLike(suggestion.id || 0)}
                  >
                    <FiHeart size={14} />
                    {likedSuggestions.has(suggestion.id || 0) ? 'Liked' : 'Like'}
                  </LikeButton>
                  
                  {suggestion.status && (
                    <span style={{ 
                      fontSize: '12px', 
                      color: suggestion.status === SuggestionStatus.IMPLEMENTED ? '#10B981' : 
                             suggestion.status === SuggestionStatus.APPROVED ? '#3B82F6' :
                             suggestion.status === SuggestionStatus.REJECTED ? '#EF4444' : '#6B7280',
                      fontWeight: 500 
                    }}>
                      {suggestion.status}
                    </span>
                  )}
                </ActionGroup>

                {suggestion.isOwn && (
                  <ActionGroup>
                    <IconButton title="Edit">
                      <FiEdit size={14} />
                    </IconButton>
                    <IconButton title="Delete">
                      <FiTrash2 size={14} />
                    </IconButton>
                  </ActionGroup>
                )}
              </SuggestionActions>
            </SuggestionCard>
          ))
        )}
      </SuggestionsGrid>

      {/* Suggestion Form */}
      <SuggestionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSuggestionSubmit}
      />
    </Container>
  );
};

export default SuggestionsPage;