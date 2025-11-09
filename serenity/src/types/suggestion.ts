// TypeScript types matching the Java Suggestion entity

export interface Suggestion {
  id?: number;
  appUserId: number;
  societyId: number;
  detail: string;
  lastUpdated?: string;
  lastUpdatedBy?: string;
  createdBy: string;
  createdDate: string;
}

export interface SuggestionFormData {
  detail: string;
}

export interface SuggestionsListResponse {
  suggestions: Suggestion[];
  total: number;
  page: number;
  limit: number;
}

export interface SuggestionResponse {
  suggestion: Suggestion;
}

// UI-specific interfaces for display
export interface SuggestionDisplayItem extends Suggestion {
  authorName?: string;
  timeAgo?: string;
  isOwn?: boolean;
  category?: SuggestionCategory;
  priority?: SuggestionPriority;
  status?: SuggestionStatus;
}

export enum SuggestionCategory {
  INFRASTRUCTURE = 'Infrastructure',
  AMENITIES = 'Amenities',
  SECURITY = 'Security',
  COMMUNITY = 'Community',
  ENVIRONMENT = 'Environment',
  TECHNOLOGY = 'Technology',
  EVENTS = 'Events',
  OTHER = 'Other'
}

export enum SuggestionPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent'
}

export enum SuggestionStatus {
  SUBMITTED = 'Submitted',
  UNDER_REVIEW = 'Under Review',
  APPROVED = 'Approved',
  IN_PROGRESS = 'In Progress',
  IMPLEMENTED = 'Implemented',
  REJECTED = 'Rejected'
}

// Query parameters for suggestions list
export interface SuggestionQueryParams {
  search?: string;
  sortBy?: 'createdDate' | 'lastUpdated' | 'priority';
  sortOrder?: 'asc' | 'desc';
  category?: SuggestionCategory | 'all';
  priority?: SuggestionPriority | 'all';
  status?: SuggestionStatus | 'all';
  dateFrom?: string;
  dateTo?: string;
  authorId?: number | 'all';
  onlyMine?: boolean;
  page?: number;
  limit?: number;
}

export interface SuggestionFilters {
  searchTerm: string;
  category: SuggestionCategory | 'all';
  priority: SuggestionPriority | 'all';
  status: SuggestionStatus | 'all';
  dateFrom: string;
  dateTo: string;
  sortBy: 'createdDate' | 'lastUpdated' | 'priority';
  sortOrder: 'asc' | 'desc';
  showOnlyMine: boolean;
  selectedAuthors: number[];
}