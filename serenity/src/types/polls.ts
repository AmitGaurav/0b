export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface Poll {
  id: string;
  title: string;
  description: string;
  type: 'single-choice' | 'multiple-choice' | 'rating' | 'yes-no' | 'text';
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  category: 'governance' | 'maintenance' | 'amenities' | 'social' | 'financial' | 'other';
  options: PollOption[];
  totalVotes: number;
  allowMultipleVotes: boolean;
  allowAnonymousVoting: boolean;
  showResultsBeforeEnd: boolean;
  requireAuthentication: boolean;
  targetAudience: 'all' | 'owners' | 'tenants' | 'committee';
  createdBy: {
    id: string;
    name: string;
    role: string;
  };
  createdAt: Date;
  startDate: Date;
  endDate: Date;
  lastUpdated: Date;
  voters: PollVoter[];
  comments: PollComment[];
  tags: string[];
  isUrgent: boolean;
  attachments?: PollAttachment[];
}

export interface PollVoter {
  id: string;
  userId: string;
  userName: string;
  votedAt: Date;
  selectedOptions: string[];
  isAnonymous: boolean;
  comment?: string;
}

export interface PollComment {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  createdAt: Date;
  replies?: PollComment[];
}

export interface PollAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface PollStats {
  totalPolls: number;
  activePolls: number;
  completedPolls: number;
  draftPolls: number;
  totalParticipation: number;
  averageParticipationRate: number;
}

export interface CreatePollData {
  title: string;
  description: string;
  type: Poll['type'];
  category: Poll['category'];
  options: Omit<PollOption, 'id' | 'votes' | 'percentage'>[];
  allowMultipleVotes: boolean;
  allowAnonymousVoting: boolean;
  showResultsBeforeEnd: boolean;
  requireAuthentication: boolean;
  targetAudience: Poll['targetAudience'];
  startDate: Date;
  endDate: Date;
  tags: string[];
  isUrgent: boolean;
}

export type PollFilter = 'all' | 'active' | 'completed' | 'my-polls' | 'not-voted';
export type PollSort = 'newest' | 'oldest' | 'most-votes' | 'ending-soon' | 'alphabetical';