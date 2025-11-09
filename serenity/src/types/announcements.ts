// Announcements System TypeScript Interfaces

export type AnnouncementPriority = 'low' | 'normal' | 'high' | 'urgent';

export type AnnouncementCategory = 
  | 'general' 
  | 'maintenance' 
  | 'events' 
  | 'safety' 
  | 'financial' 
  | 'utilities' 
  | 'community' 
  | 'emergency';

export type AnnouncementStatus = 'draft' | 'published' | 'archived';

export type UserRole = 'resident' | 'admin' | 'security' | 'maintenance' | 'support';

export interface AnnouncementAuthor {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export interface AnnouncementAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
}

export interface AnnouncementReaction {
  id: string;
  announcementId: string;
  userId: string;
  type: 'like' | 'helpful' | 'important' | 'concern';
  timestamp: Date;
}

export interface AnnouncementRead {
  id: string;
  announcementId: string;
  userId: string;
  readAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  status: AnnouncementStatus;
  author: AnnouncementAuthor;
  attachments: AnnouncementAttachment[];
  reactions: AnnouncementReaction[];
  readBy: AnnouncementRead[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  expiresAt?: Date;
  isPinned: boolean;
  isSticky: boolean;
  tags: string[];
  targetAudience: UserRole[];
  visibility: 'all' | 'residents' | 'staff' | 'admin';
  allowComments: boolean;
  requireAcknowledgment: boolean;
  viewCount: number;
}

export interface AnnouncementComment {
  id: string;
  announcementId: string;
  userId: string;
  author: AnnouncementAuthor;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  isEdited: boolean;
  parentCommentId?: string;
  replies: AnnouncementComment[];
}

export interface AnnouncementFilters {
  category: AnnouncementCategory | 'all';
  priority: AnnouncementPriority | 'all';
  status: 'all' | 'read' | 'unread';
  dateRange: {
    from?: Date;
    to?: Date;
  };
  author: string[];
  tags: string[];
  hasAttachments: boolean;
  requiresAcknowledgment: boolean;
}

export interface AnnouncementSearchFilters extends AnnouncementFilters {
  searchQuery: string;
  sortBy: 'date' | 'priority' | 'title' | 'category' | 'author';
  sortOrder: 'asc' | 'desc';
}

export interface AnnouncementsState {
  announcements: Announcement[];
  selectedAnnouncementId: string | null;
  filters: AnnouncementSearchFilters;
  isLoading: boolean;
  error: string | null;
  unreadCount: number;
  totalCount: number;
  hasMore: boolean;
  viewMode: 'list' | 'grid' | 'detail';
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  summary: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  attachments: File[];
  tags: string[];
  targetAudience: UserRole[];
  visibility: 'all' | 'residents' | 'staff' | 'admin';
  allowComments: boolean;
  requireAcknowledgment: boolean;
  expiresAt?: Date;
  isPinned: boolean;
  scheduledPublishAt?: Date;
}

export interface UpdateAnnouncementData extends Partial<CreateAnnouncementData> {
  id: string;
}

export interface AnnouncementStats {
  totalAnnouncements: number;
  unreadCount: number;
  highPriorityCount: number;
  urgentCount: number;
  expiringCount: number;
  categoryBreakdown: Record<AnnouncementCategory, number>;
  priorityBreakdown: Record<AnnouncementPriority, number>;
  readRate: number;
  averageReadTime: number;
}

// API Response Types
export interface GetAnnouncementsResponse {
  announcements: Announcement[];
  totalCount: number;
  unreadCount: number;
  hasMore: boolean;
  stats: AnnouncementStats;
}

export interface GetAnnouncementResponse {
  announcement: Announcement;
  comments: AnnouncementComment[];
  relatedAnnouncements: Announcement[];
}

export interface CreateAnnouncementResponse {
  announcement: Announcement;
  success: boolean;
  error?: string;
}

export interface AnnouncementNotification {
  id: string;
  type: 'new_announcement' | 'announcement_updated' | 'announcement_reminder' | 'comment_added';
  announcementId: string;
  userId: string;
  title: string;
  body: string;
  timestamp: Date;
  isRead: boolean;
  data: Record<string, any>;
}

// UI Component Props Types
export interface AnnouncementListProps {
  announcements: Announcement[];
  selectedId?: string;
  onAnnouncementSelect: (announcementId: string) => void;
  onAnnouncementRead: (announcementId: string) => void;
  onAnnouncementReaction: (announcementId: string, reactionType: string) => void;
  viewMode: 'list' | 'grid';
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export interface AnnouncementDetailProps {
  announcement: Announcement;
  currentUserId: string;
  onReaction: (reactionType: string) => void;
  onComment: (content: string, parentId?: string) => void;
  onShare: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMarkAsRead: () => void;
}

export interface AnnouncementFiltersProps {
  filters: AnnouncementSearchFilters;
  onFiltersChange: (filters: Partial<AnnouncementSearchFilters>) => void;
  categories: AnnouncementCategory[];
  authors: AnnouncementAuthor[];
  tags: string[];
  onClearFilters: () => void;
}

export interface AnnouncementCardProps {
  announcement: Announcement;
  isSelected?: boolean;
  isRead?: boolean;
  onClick: () => void;
  onReaction: (reactionType: string) => void;
  compact?: boolean;
}

export interface AnnouncementHeaderProps {
  announcement: Announcement;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare: () => void;
  onPrint: () => void;
}

// Utility Types
export interface AnnouncementGroup {
  date: string;
  announcements: Announcement[];
}

export interface AnnouncementSummary {
  id: string;
  title: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  publishedAt: Date;
  isRead: boolean;
  unreadCount?: number;
}

export interface AnnouncementsPageData {
  announcements: Announcement[];
  categories: AnnouncementCategory[];
  authors: AnnouncementAuthor[];
  tags: string[];
  stats: AnnouncementStats;
  userPermissions: AnnouncementPermissions;
}

export interface AnnouncementPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canPin: boolean;
  canComment: boolean;
  canViewDrafts: boolean;
  canManageCategories: boolean;
}

// Real-time Event Types
export interface AnnouncementEvent {
  type: 'announcement_created' | 'announcement_updated' | 'announcement_deleted' | 'announcement_published';
  announcement: Announcement;
  timestamp: Date;
  authorId: string;
}

export interface AnnouncementInteractionEvent {
  type: 'announcement_viewed' | 'announcement_reacted' | 'comment_added';
  announcementId: string;
  userId: string;
  data?: any;
  timestamp: Date;
}

// Settings Types
export interface AnnouncementSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  digestFrequency: 'immediate' | 'daily' | 'weekly' | 'never';
  priorityFilter: AnnouncementPriority[];
  categoryFilter: AnnouncementCategory[];
  autoMarkAsRead: boolean;
  showPreview: boolean;
  compactView: boolean;
  groupByDate: boolean;
  defaultSortBy: 'date' | 'priority' | 'category';
  defaultSortOrder: 'asc' | 'desc';
}