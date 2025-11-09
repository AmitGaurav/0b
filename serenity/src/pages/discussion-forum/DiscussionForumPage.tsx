import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { 
  FiSearch, 
  FiPlus, 
  FiMoreVertical, 
  FiSend, 
  FiPaperclip, 
  FiMic,
  FiPhone,
  FiVideo,
  FiInfo,
  FiArchive,
  FiTrash2,
  FiEdit3,
  FiCheck,
  FiClock,
  FiAlertCircle,
  FiFilter,
  FiUsers,
  FiUser,
  FiBell,
  FiBellOff,
  FiImage,
  FiFile,
  FiDownload,
  FiX,
  FiSmile,
  FiSettings,
  FiMessageCircle
} from 'react-icons/fi';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import {
  Conversation,
  Message,
  User,
  MessageType,
  ConversationType,
  ComposeMessageData,
  MessagesState,
  MessageFilters,
  CreateConversationData
} from '../../types/discussion-forum';
import NewConversationForm from './NewConversationForm';

// Main Container
const Container = styled.div`
  display: flex;
  height: calc(100vh - 80px);
  background: ${({ theme }) => theme.colors.gray[50]};
`;

// Left Sidebar (Conversations List)
const ConversationsSidebar = styled.div`
  width: 320px;
  background: ${({ theme }) => theme.colors.white};
  border-right: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    display: ${({ showMobile }: { showMobile: boolean }) => 
      showMobile ? 'flex' : 'none'};
  }
`;

const SidebarHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const SidebarTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  padding-left: ${({ theme }) => theme.spacing[10]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.gray[50]};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
    background: ${({ theme }) => theme.colors.white};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray[400]};
  width: 16px;
  height: 16px;
`;

const FilterRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const FilterButton = styled.button<{ isActive: boolean }>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 1px solid ${({ theme, isActive }) => 
    isActive ? theme.colors.primary[500] : theme.colors.gray[300]};
  background: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary[50] : theme.colors.white};
  color: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary[700] : theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
`;

const ConversationsList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ConversationItem = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  cursor: pointer;
  background: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary[50] : 'transparent'};
  border-right: 3px solid ${({ theme, isActive }) => 
    isActive ? theme.colors.primary[500] : 'transparent'};
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }
`;

const ConversationAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-right: ${({ theme }) => theme.spacing[3]};
  position: relative;
`;

const OnlineIndicator = styled.div`
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: ${({ theme }) => theme.colors.success[500]};
  border: 2px solid ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.full};
`;

const ConversationInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const ConversationName = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ConversationTime = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  white-space: nowrap;
`;

const LastMessage = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const UnreadBadge = styled.div`
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  padding: 2px 6px;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-left: ${({ theme }) => theme.spacing[2]};
  min-width: 18px;
  text-align: center;
`;

// Main Chat Area
const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.white};

  @media (max-width: 768px) {
    display: ${({ showMobile }: { showMobile: boolean }) => 
      showMobile ? 'flex' : 'none'};
  }
`;

const ChatHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatHeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const ChatHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const HeaderButton = styled.button`
  padding: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[600]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[900]};
  }
`;

const ChatTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-left: ${({ theme }) => theme.spacing[3]};
`;

const ChatStatus = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-left: ${({ theme }) => theme.spacing[3]};
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const DateSeparator = styled.div`
  text-align: center;
  margin: ${({ theme }) => theme.spacing[4]} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ theme }) => theme.colors.gray[200]};
    z-index: 1;
  }

  span {
    background: ${({ theme }) => theme.colors.white};
    padding: 0 ${({ theme }) => theme.spacing[4]};
    position: relative;
    z-index: 2;
  }
`;

const MessageBubble = styled.div<{ isSent: boolean }>`
  max-width: 70%;
  align-self: ${({ isSent }) => isSent ? 'flex-end' : 'flex-start'};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const MessageContent = styled.div<{ isSent: boolean }>`
  background: ${({ theme, isSent }) => 
    isSent ? theme.colors.primary[500] : theme.colors.gray[100]};
  color: ${({ theme, isSent }) => 
    isSent ? theme.colors.white : theme.colors.gray[900]};
  padding: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme, isSent }) => 
    isSent 
      ? `${theme.borderRadius.lg} ${theme.borderRadius.lg} ${theme.borderRadius.sm} ${theme.borderRadius.lg}`
      : `${theme.borderRadius.lg} ${theme.borderRadius.lg} ${theme.borderRadius.lg} ${theme.borderRadius.sm}`};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.5;
  word-wrap: break-word;
  position: relative;
`;

const MessageMetadata = styled.div<{ isSent: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: ${({ theme }) => theme.spacing[1]};
  justify-content: ${({ isSent }) => isSent ? 'flex-end' : 'flex-start'};
`;

const MessageTime = styled.span`
  white-space: nowrap;
`;

const MessageStatus = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  color: ${({ theme, status }) => {
    switch (status) {
      case 'sent': return theme.colors.gray[400];
      case 'delivered': return theme.colors.gray[600];
      case 'read': return theme.colors.primary[500];
      case 'failed': return theme.colors.error[500];
      default: return theme.colors.gray[400];
    }
  }};
`;

// Message Input Area
const MessageInputArea = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.white};
`;

const ReplyingToMessage = styled.div`
  background: ${({ theme }) => theme.colors.gray[50]};
  border-left: 4px solid ${({ theme }) => theme.colors.primary[500]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReplyContent = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[2]};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const MessageInput = styled.textarea`
  flex: 1;
  border: none;
  background: transparent;
  resize: none;
  padding: ${({ theme }) => theme.spacing[2]} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: 1.5;
  min-height: 20px;
  max-height: 120px;
  overflow-y: auto;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  background: ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.primary[500] : 'transparent'};
  color: ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.white : theme.colors.gray[600]};

  &:hover:not(:disabled) {
    background: ${({ theme, variant }) => 
      variant === 'primary' 
        ? theme.colors.primary[600] 
        : theme.colors.gray[100]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Empty State
const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[8]};
  text-align: center;
`;

const EmptyStateIcon = styled.div`
  width: 64px;
  height: 64px;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const EmptyStateTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const EmptyStateDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  max-width: 300px;
`;

// Create New Conversation Button
const NewConversationButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }
`;

// Typing Indicator
const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-style: italic;
`;

const MobileBackButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  margin-right: ${({ theme }) => theme.spacing[2]};
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const DiscussionForumPage: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'group' | 'direct'>('all');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(true);
  const [showNewConversationForm, setShowNewConversationForm] = useState(false);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Sample data - in real app, this would come from API/state management
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      type: 'direct',
      participants: [
        {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@email.com',
          role: 'resident',
          unitNumber: 'A-301',
          isOnline: true,
          lastSeen: new Date(),
        },
        {
          id: '2',
          name: 'You',
          email: user?.email || '',
          role: 'resident',
          isOnline: true,
          lastSeen: new Date(),
        }
      ],
      lastMessage: {
        id: '1',
        conversationId: '1',
        senderId: '1',
        sender: {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@email.com',
          role: 'resident',
          unitNumber: 'A-301',
          isOnline: true,
          lastSeen: new Date(),
        },
        content: 'Hey, are you available for the society meeting tomorrow?',
        type: 'text',
        status: 'read',
        attachments: [],
        timestamp: new Date(Date.now() - 2 * 60 * 1000),
        isEdited: false,
        reactions: [],
      },
      unreadCount: 2,
      isArchived: false,
      isMuted: false,
      isPinned: false,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 1000),
      createdBy: '1',
      settings: {
        allowFileSharing: true,
        allowVoiceMessages: true,
        allowImageSharing: true,
        maxParticipants: 2,
        isPublic: false,
        requireAdminApproval: false,
      },
    },
    {
      id: '2',
      type: 'group',
      name: 'Building A Residents',
      participants: [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@society.com',
          role: 'admin',
          isOnline: false,
          lastSeen: new Date(Date.now() - 30 * 60 * 1000),
        },
        {
          id: '2',
          name: 'You',
          email: user?.email || '',
          role: 'resident',
          isOnline: true,
          lastSeen: new Date(),
        }
      ],
      lastMessage: {
        id: '2',
        conversationId: '2',
        senderId: '1',
        sender: {
          id: '1',
          name: 'Admin User',
          email: 'admin@society.com',
          role: 'admin',
          isOnline: false,
          lastSeen: new Date(Date.now() - 30 * 60 * 1000),
        },
        content: 'Water supply will be interrupted tomorrow from 10 AM to 2 PM',
        type: 'text',
        status: 'delivered',
        attachments: [],
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        isEdited: false,
        reactions: [],
      },
      unreadCount: 0,
      isArchived: false,
      isMuted: false,
      isPinned: true,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 60 * 60 * 1000),
      createdBy: '1',
      settings: {
        allowFileSharing: true,
        allowVoiceMessages: true,
        allowImageSharing: true,
        maxParticipants: 50,
        isPublic: true,
        requireAdminApproval: false,
      },
    },
  ]);

  const [messages, setMessages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: '1',
        conversationId: '1',
        senderId: '1',
        sender: {
          id: '1',
          name: 'John Smith',
          email: 'john.smith@email.com',
          role: 'resident',
          unitNumber: 'A-301',
          isOnline: true,
          lastSeen: new Date(),
        },
        content: 'Hey, are you available for the society meeting tomorrow?',
        type: 'text',
        status: 'read',
        attachments: [],
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isEdited: false,
        reactions: [],
      },
      {
        id: '2',
        conversationId: '1',
        senderId: '2',
        sender: {
          id: '2',
          name: 'You',
          email: user?.email || '',
          role: 'resident',
          isOnline: true,
          lastSeen: new Date(),
        },
        content: 'Yes, I will be there. What time is it scheduled?',
        type: 'text',
        status: 'sent',
        attachments: [],
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        isEdited: false,
        reactions: [],
      },
    ],
    '2': [
      {
        id: '3',
        conversationId: '2',
        senderId: '1',
        sender: {
          id: '1',
          name: 'Admin User',
          email: 'admin@society.com',
          role: 'admin',
          isOnline: false,
          lastSeen: new Date(Date.now() - 30 * 60 * 1000),
        },
        content: 'Water supply will be interrupted tomorrow from 10 AM to 2 PM for maintenance work.',
        type: 'text',
        status: 'delivered',
        attachments: [],
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        isEdited: false,
        reactions: [],
      },
    ],
  });

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];

  // Sample users for participant selection
  const availableUsers: User[] = [
    {
      id: '3',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      role: 'resident',
      unitNumber: 'B-205',
      isOnline: true,
      lastSeen: new Date(),
    },
    {
      id: '4',
      name: 'Mike Davis',
      email: 'mike.davis@email.com',
      role: 'admin',
      unitNumber: 'Office',
      isOnline: false,
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: '5',
      name: 'Lisa Wong',
      email: 'lisa.wong@email.com',
      role: 'resident',
      unitNumber: 'C-102',
      isOnline: true,
      lastSeen: new Date(),
    },
    {
      id: '6',
      name: 'Robert Brown',
      email: 'robert.brown@email.com',
      role: 'security',
      unitNumber: 'Security',
      isOnline: true,
      lastSeen: new Date(),
    },
    {
      id: '7',
      name: 'Emily Chen',
      email: 'emily.chen@email.com',
      role: 'resident',
      unitNumber: 'A-405',
      isOnline: false,
      lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    }
  ];

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterType === 'all' ||
      (filterType === 'unread' && conversation.unreadCount > 0) ||
      (filterType === 'group' && conversation.type === 'group') ||
      (filterType === 'direct' && conversation.type === 'direct');

    return matchesSearch && matchesFilter;
  });

  const handleConversationSelect = useCallback((conversationId: string) => {
    setActiveConversationId(conversationId);
    setShowMobileSidebar(false);
    
    // Mark conversation as read
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!messageInput.trim() || !activeConversationId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      conversationId: activeConversationId,
      senderId: user?.userId?.toString() || '2',
      sender: {
        id: user?.userId?.toString() || '2',
        name: user?.name || 'You',
        email: user?.email || '',
        role: 'resident',
        isOnline: true,
        lastSeen: new Date(),
      },
      content: messageInput,
      type: 'text',
      status: 'sent',
      attachments: [],
      timestamp: new Date(),
      isEdited: false,
      reactions: [],
      replyTo: replyingTo?.id,
    };

    // Add message to conversation
    setMessages(prev => ({
      ...prev,
      [activeConversationId]: [
        ...(prev[activeConversationId] || []),
        newMessage,
      ],
    }));

    // Update conversation's last message
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversationId
          ? { ...conv, lastMessage: newMessage, updatedAt: new Date() }
          : conv
      )
    );

    setMessageInput('');
    setReplyingTo(null);
    
    // Auto-resize textarea
    if (messageInputRef.current) {
      messageInputRef.current.style.height = 'auto';
    }

    toast.success('Message sent!');
  }, [messageInput, activeConversationId, replyingTo, user]);

  const handleCreateConversation = useCallback(async (data: CreateConversationData) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      type: data.type,
      name: data.name,
      description: data.description,
      participants: [
        {
          id: user?.userId?.toString() || '2',
          name: user?.name || 'You',
          email: user?.email || '',
          role: 'resident',
          isOnline: true,
          lastSeen: new Date(),
        },
        // In real app, fetch participant details from API
        ...data.participantIds.map((id: string) => ({
          id,
          name: `User ${id}`,
          email: `user${id}@email.com`,
          role: 'resident' as const,
          isOnline: Math.random() > 0.5,
          lastSeen: new Date(),
        }))
      ],
      unreadCount: 0,
      isArchived: false,
      isMuted: false,
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user?.userId?.toString() || '2',
      settings: {
        allowFileSharing: data.settings?.allowFileSharing ?? true,
        allowVoiceMessages: data.settings?.allowVoiceMessages ?? true,
        allowImageSharing: data.settings?.allowImageSharing ?? true,
        maxParticipants: data.settings?.maxParticipants ?? 50,
        isPublic: data.isPublic,
        requireAdminApproval: data.settings?.requireAdminApproval ?? false,
      },
    };

    // Add new conversation
    setConversations(prev => [newConversation, ...prev]);
    
    // Set as active conversation
    setActiveConversationId(newConversation.id);
    setShowMobileSidebar(false);
    
    toast.success('Conversation created successfully!');
  }, [user]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessageInput(e.target.value);
    
    // Auto-resize textarea
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const formatMessageTime = (timestamp: Date) => {
    if (isToday(timestamp)) {
      return format(timestamp, 'HH:mm');
    } else if (isYesterday(timestamp)) {
      return 'Yesterday';
    } else {
      return format(timestamp, 'MMM dd');
    }
  };

  const formatLastMessageTime = (timestamp: Date) => {
    return formatDistanceToNow(timestamp, { addSuffix: true });
  };

  const renderMessageStatus = (status: string) => {
    switch (status) {
      case 'sent':
        return <FiCheck size={14} />;
      case 'delivered':
        return <FiCheck size={14} style={{ opacity: 0.7 }} />;
      case 'read':
        return <FiCheck size={14} style={{ color: 'currentColor' }} />;
      case 'failed':
        return <FiAlertCircle size={14} />;
      default:
        return <FiClock size={14} />;
    }
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.name) return conversation.name;
    if (conversation.type === 'direct') {
      const otherParticipant = conversation.participants.find(p => p.id !== user?.userId?.toString());
      return otherParticipant?.name || 'Unknown User';
    }
    return 'Group Chat';
  };

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.type === 'group') {
      return <FiUsers size={24} />;
    }
    const otherParticipant = conversation.participants.find(p => p.id !== user?.userId?.toString());
    return otherParticipant?.name?.charAt(0).toUpperCase() || 'U';
  };

  if (!user) {
    return (
      <Container>
        <EmptyState>
          <EmptyStateIcon>
            <FiUser size={32} />
          </EmptyStateIcon>
          <EmptyStateTitle>Authentication Required</EmptyStateTitle>
          <EmptyStateDescription>
            Please log in to access the discussion forum.
          </EmptyStateDescription>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <ConversationsSidebar showMobile={showMobileSidebar}>
        <SidebarHeader>
          <SidebarTitle>
            Discussion Forum
            <NewConversationButton onClick={() => setShowNewConversationForm(true)}>
              <FiPlus size={16} />
              New
            </NewConversationButton>
          </SidebarTitle>

          <SearchContainer>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchContainer>

          <FilterRow>
            <FilterButton
              isActive={filterType === 'all'}
              onClick={() => setFilterType('all')}
            >
              All
            </FilterButton>
            <FilterButton
              isActive={filterType === 'unread'}
              onClick={() => setFilterType('unread')}
            >
              Unread
            </FilterButton>
            <FilterButton
              isActive={filterType === 'direct'}
              onClick={() => setFilterType('direct')}
            >
              Direct
            </FilterButton>
            <FilterButton
              isActive={filterType === 'group'}
              onClick={() => setFilterType('group')}
            >
              Groups
            </FilterButton>
          </FilterRow>
        </SidebarHeader>

        <ConversationsList>
          {filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              isActive={conversation.id === activeConversationId}
              onClick={() => handleConversationSelect(conversation.id)}
            >
              <ConversationAvatar>
                {getConversationAvatar(conversation)}
                {conversation.type === 'direct' && 
                 conversation.participants.find(p => p.id !== user?.userId?.toString())?.isOnline && (
                  <OnlineIndicator />
                )}
              </ConversationAvatar>

              <ConversationInfo>
                <ConversationName>
                  <span>{getConversationName(conversation)}</span>
                  <ConversationTime>
                    {conversation.lastMessage && 
                     formatLastMessageTime(conversation.lastMessage.timestamp)}
                  </ConversationTime>
                </ConversationName>

                <LastMessage>
                  <span>
                    {conversation.lastMessage?.content || 'No messages yet'}
                  </span>
                  {conversation.unreadCount > 0 && (
                    <UnreadBadge>
                      {conversation.unreadCount}
                    </UnreadBadge>
                  )}
                </LastMessage>
              </ConversationInfo>
            </ConversationItem>
          ))}

          {filteredConversations.length === 0 && (
            <EmptyState>
              <EmptyStateIcon>
                <FiSearch size={32} />
              </EmptyStateIcon>
              <EmptyStateTitle>No conversations found</EmptyStateTitle>
              <EmptyStateDescription>
                {searchQuery ? 'Try adjusting your search terms.' : 'Start a new conversation to get started.'}
              </EmptyStateDescription>
            </EmptyState>
          )}
        </ConversationsList>
      </ConversationsSidebar>

      <ChatArea showMobile={!showMobileSidebar}>
        {activeConversation ? (
          <>
            <ChatHeader>
              <ChatHeaderLeft>
                <MobileBackButton
                  onClick={() => setShowMobileSidebar(true)}
                >
                  ←
                </MobileBackButton>
                <ConversationAvatar>
                  {getConversationAvatar(activeConversation)}
                </ConversationAvatar>
                <div>
                  <ChatTitle>{getConversationName(activeConversation)}</ChatTitle>
                  <ChatStatus>
                    {activeConversation.type === 'direct' ? (
                      activeConversation.participants.find(p => p.id !== user?.userId?.toString())?.isOnline
                        ? 'Online'
                        : `Last seen ${formatLastMessageTime(
                            activeConversation.participants.find(p => p.id !== user?.userId?.toString())?.lastSeen || new Date()
                          )}`
                    ) : (
                      `${activeConversation.participants.length} participants`
                    )}
                  </ChatStatus>
                </div>
              </ChatHeaderLeft>

              <ChatHeaderRight>
                <HeaderButton>
                  <FiPhone size={18} />
                </HeaderButton>
                <HeaderButton>
                  <FiVideo size={18} />
                </HeaderButton>
                <HeaderButton>
                  <FiInfo size={18} />
                </HeaderButton>
                <HeaderButton>
                  <FiMoreVertical size={18} />
                </HeaderButton>
              </ChatHeaderRight>
            </ChatHeader>

            <MessagesContainer>
              {activeMessages.map((message, index) => {
                const isCurrentUser = message.senderId === user?.userId?.toString();
                const showDateSeparator = index === 0 || 
                  format(message.timestamp, 'yyyy-MM-dd') !== 
                  format(activeMessages[index - 1].timestamp, 'yyyy-MM-dd');

                return (
                  <React.Fragment key={message.id}>
                    {showDateSeparator && (
                      <DateSeparator>
                        <span>
                          {isToday(message.timestamp) 
                            ? 'Today' 
                            : isYesterday(message.timestamp)
                            ? 'Yesterday'
                            : format(message.timestamp, 'MMM dd, yyyy')
                          }
                        </span>
                      </DateSeparator>
                    )}

                    <MessageBubble isSent={isCurrentUser}>
                      <MessageContent isSent={isCurrentUser}>
                        {message.replyTo && (
                          <div style={{ 
                            borderLeft: '3px solid rgba(255,255,255,0.3)', 
                            paddingLeft: '12px', 
                            marginBottom: '8px',
                            opacity: 0.8,
                            fontSize: '0.85em'
                          }}>
                            Replying to message...
                          </div>
                        )}
                        {message.content}
                      </MessageContent>

                      <MessageMetadata isSent={isCurrentUser}>
                        <MessageTime>
                          {formatMessageTime(message.timestamp)}
                        </MessageTime>
                        {isCurrentUser && (
                          <MessageStatus status={message.status}>
                            {renderMessageStatus(message.status)}
                          </MessageStatus>
                        )}
                      </MessageMetadata>
                    </MessageBubble>
                  </React.Fragment>
                );
              })}

              {/* Typing Indicator */}
              {/* <TypingIndicator>
                John is typing...
              </TypingIndicator> */}
            </MessagesContainer>

            <MessageInputArea>
              {replyingTo && (
                <ReplyingToMessage>
                  <ReplyContent>
                    Replying to: {replyingTo.content.substring(0, 50)}...
                  </ReplyContent>
                  <ActionButton onClick={() => setReplyingTo(null)}>
                    <FiX size={16} />
                  </ActionButton>
                </ReplyingToMessage>
              )}

              <InputContainer>
                <ActionButton>
                  <FiPaperclip size={18} />
                </ActionButton>

                <MessageInput
                  ref={messageInputRef}
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  rows={1}
                />

                <ActionButton>
                  <FiSmile size={18} />
                </ActionButton>

                <ActionButton>
                  <FiMic size={18} />
                </ActionButton>

                <ActionButton 
                  variant="primary"
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                >
                  <FiSend size={16} />
                </ActionButton>
              </InputContainer>
            </MessageInputArea>
          </>
        ) : (
          <EmptyState>
            <EmptyStateIcon>
              <FiMessageCircle size={32} />
            </EmptyStateIcon>
            <EmptyStateTitle>Select a conversation</EmptyStateTitle>
            <EmptyStateDescription>
              Choose a conversation from the list to start messaging.
            </EmptyStateDescription>
          </EmptyState>
        )}
      </ChatArea>

      <NewConversationForm
        isOpen={showNewConversationForm}
        onClose={() => setShowNewConversationForm(false)}
        onSubmit={handleCreateConversation}
        availableUsers={availableUsers}
      />
    </Container>
  );
};

export default DiscussionForumPage;