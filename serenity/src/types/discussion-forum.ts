// Messaging System TypeScript Interfaces

export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed';

export type MessageType = 'text' | 'image' | 'file' | 'voice';

export type ConversationType = 'direct' | 'group' | 'announcement' | 'support';

export type UserRole = 'resident' | 'admin' | 'security' | 'maintenance' | 'support';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  unitNumber?: string;
  isOnline: boolean;
  lastSeen: Date;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content: string;
  type: MessageType;
  status: MessageStatus;
  attachments: MessageAttachment[];
  timestamp: Date;
  editedAt?: Date;
  replyTo?: string;
  isEdited: boolean;
  reactions: MessageReaction[];
}

export interface MessageReaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string;
  description?: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isArchived: boolean;
  isMuted: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  avatar?: string;
  settings: ConversationSettings;
}

export interface ConversationSettings {
  allowFileSharing: boolean;
  allowVoiceMessages: boolean;
  allowImageSharing: boolean;
  maxParticipants: number;
  isPublic: boolean;
  requireAdminApproval: boolean;
}

export interface MessageThread {
  conversation: Conversation;
  messages: Message[];
  hasMore: boolean;
  isLoading: boolean;
  typingUsers: User[];
}

export interface MessagesState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messageThreads: Record<string, MessageThread>;
  searchQuery: string;
  filters: MessageFilters;
  isLoading: boolean;
  error: string | null;
  unreadTotalCount: number;
}

export interface MessageFilters {
  type: ConversationType | 'all';
  status: 'all' | 'unread' | 'read';
  dateRange: {
    from?: Date;
    to?: Date;
  };
  participants: string[];
  hasAttachments: boolean;
}

export interface ComposeMessageData {
  recipientIds: string[];
  content: string;
  attachments: File[];
  replyToMessageId?: string;
  conversationId?: string;
}

export interface CreateConversationData {
  type: ConversationType;
  name?: string;
  description?: string;
  participantIds: string[];
  isPublic: boolean;
  settings: Partial<ConversationSettings>;
}

export interface MessageSearchResult {
  message: Message;
  conversation: Conversation;
  highlights: string[];
}

export interface TypingIndicator {
  userId: string;
  conversationId: string;
  timestamp: Date;
}

// API Response Types
export interface GetConversationsResponse {
  conversations: Conversation[];
  totalCount: number;
  hasMore: boolean;
}

export interface GetMessagesResponse {
  messages: Message[];
  hasMore: boolean;
  totalCount: number;
}

export interface SendMessageResponse {
  message: Message;
  success: boolean;
  error?: string;
}

export interface MessageNotification {
  id: string;
  type: 'new_message' | 'new_conversation' | 'mention' | 'reaction';
  conversationId: string;
  messageId?: string;
  userId: string;
  title: string;
  body: string;
  timestamp: Date;
  isRead: boolean;
  data: Record<string, any>;
}

// UI Component Props Types
export interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onConversationSelect: (conversationId: string) => void;
  onConversationDelete: (conversationId: string) => void;
  onConversationArchive: (conversationId: string) => void;
  onConversationMute: (conversationId: string, mute: boolean) => void;
  onConversationPin: (conversationId: string, pin: boolean) => void;
}

export interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onMessageReply: (message: Message) => void;
  onMessageEdit: (messageId: string, newContent: string) => void;
  onMessageDelete: (messageId: string) => void;
  onMessageReaction: (messageId: string, emoji: string) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export interface MessageInputProps {
  onSendMessage: (data: ComposeMessageData) => void;
  replyToMessage?: Message;
  onCancelReply?: () => void;
  disabled?: boolean;
  placeholder?: string;
  allowAttachments?: boolean;
  allowVoiceMessages?: boolean;
  maxFileSize?: number;
}

export interface ContactSelectorProps {
  users: User[];
  selectedUserIds: string[];
  onSelectionChange: (userIds: string[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  multiple?: boolean;
  excludeUserIds?: string[];
  filterByRole?: UserRole[];
}

// Real-time Event Types
export interface MessageEvent {
  type: 'message_sent' | 'message_received' | 'message_edited' | 'message_deleted';
  conversationId: string;
  message: Message;
  timestamp: Date;
}

export interface ConversationEvent {
  type: 'conversation_created' | 'conversation_updated' | 'participant_added' | 'participant_removed';
  conversation: Conversation;
  timestamp: Date;
  userId?: string;
}

export interface TypingEvent {
  type: 'typing_start' | 'typing_stop';
  conversationId: string;
  userId: string;
  timestamp: Date;
}

export interface PresenceEvent {
  type: 'user_online' | 'user_offline';
  userId: string;
  timestamp: Date;
}

// Utility Types
export interface MessageGroup {
  date: string;
  messages: Message[];
}

export interface ConversationSummary {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  participants: string[];
}

export interface MessagesPageData {
  conversations: Conversation[];
  contacts: User[];
  currentUser: User;
  settings: MessagesSettings;
}

export interface MessagesSettings {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  desktopNotifications: boolean;
  emailNotifications: boolean;
  messagePreview: boolean;
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large';
  enterToSend: boolean;
  showOnlineStatus: boolean;
  autoSaveEnabled: boolean;
}