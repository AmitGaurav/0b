import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import {
  FiX,
  FiUsers,
  FiUser,
  FiMessageCircle,
  FiGlobe,
  FiLock,
  FiSearch,
  FiCheck,
  FiPlus,
  FiMinus,
  FiPaperclip,
  FiSend
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { 
  CreateConversationData, 
  ConversationType, 
  User, 
  ConversationSettings 
} from '../../types/discussion-forum';

interface NewConversationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateConversationData) => void;
  availableUsers?: User[];
}

interface FormData {
  type: ConversationType;
  name: string;
  description: string;
  participantIds: string[];
  isPublic: boolean;
  initialMessage: string;
  settings: Partial<ConversationSettings>;
  attachments: File[];
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: ${({ theme }) => theme.boxShadow.xl};
`;

const Header = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing[1]};
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray[400]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    color: ${({ theme }) => theme.colors.gray[600]};
    background: ${({ theme }) => theme.colors.gray[100]};
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[5]};
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const TypeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing[3]};
`;

const TypeOption = styled.button<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]};
  border: 2px solid ${({ theme, selected }) => 
    selected ? theme.colors.primary[500] : theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, selected }) => 
    selected ? theme.colors.primary[50] : theme.colors.white};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[300]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
  
  svg {
    color: ${({ theme, selected }) => 
      selected ? theme.colors.primary[600] : theme.colors.gray[500]};
  }
  
  span {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme, selected }) => 
      selected ? theme.colors.primary[700] : theme.colors.gray[700]};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.all};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: ${({ theme }) => theme.transition.all};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const ParticipantSection = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  max-height: 200px;
  overflow-y: auto;
`;

const ParticipantSearch = styled.div`
  position: relative;
  padding: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: ${({ theme }) => theme.spacing[5]};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray[400]};
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  padding-left: ${({ theme }) => theme.spacing[10]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const ParticipantList = styled.div`
  padding: ${({ theme }) => theme.spacing[2]};
`;

const ParticipantItem = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  background: ${({ theme, selected }) => 
    selected ? theme.colors.primary[50] : 'transparent'};
  
  &:hover {
    background: ${({ theme, selected }) => 
      selected ? theme.colors.primary[100] : theme.colors.gray[50]};
  }
`;

const ParticipantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ theme }) => theme.colors.primary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ParticipantDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ParticipantName = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ParticipantRole = styled.span`
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  text-transform: capitalize;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const Checkbox = styled.input`
  margin: 0;
`;

const CheckboxLabel = styled.label`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
`;

const SettingsSection = styled.div`
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const AttachmentSection = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
`;

const AttachmentList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const AttachmentItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const RemoveAttachment = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: ${({ theme }) => theme.colors.error[500]};
  }
`;

const Footer = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  
  ${({ variant = 'secondary', theme }) => variant === 'primary' ? `
    background: ${theme.colors.primary[600]};
    color: ${theme.colors.white};
    border: 1px solid ${theme.colors.primary[600]};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.primary[700]};
      border-color: ${theme.colors.primary[700]};
    }
  ` : `
    background: ${theme.colors.white};
    color: ${theme.colors.gray[700]};
    border: 1px solid ${theme.colors.gray[300]};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.gray[50]};
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const HelpText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: ${({ theme }) => theme.spacing[1]};
  margin-bottom: 0;
`;

const NewConversationForm: React.FC<NewConversationFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  availableUsers = []
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    type: 'group',
    name: '',
    description: '',
    participantIds: [],
    isPublic: false,
    initialMessage: '',
    settings: {
      allowFileSharing: true,
      allowVoiceMessages: true,
      allowImageSharing: true,
      maxParticipants: 50,
      isPublic: false,
      requireAdminApproval: false
    },
    attachments: []
  });

  const conversationTypes = [
    {
      type: 'direct' as ConversationType,
      icon: FiUser,
      label: 'Direct',
      description: 'One-on-one conversation'
    },
    {
      type: 'group' as ConversationType,
      icon: FiUsers,
      label: 'Group',
      description: 'Multiple participants'
    },
    {
      type: 'announcement' as ConversationType,
      icon: FiMessageCircle,
      label: 'Announcement',
      description: 'Broadcast message'
    }
  ];

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.unitNumber && user.unitNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please provide a conversation name');
      return;
    }

    if (formData.type !== 'announcement' && formData.participantIds.length === 0) {
      toast.error('Please select at least one participant');
      return;
    }

    if (formData.type === 'direct' && formData.participantIds.length !== 1) {
      toast.error('Direct conversations must have exactly one participant');
      return;
    }

    if (!formData.initialMessage.trim()) {
      toast.error('Please provide an initial message');
      return;
    }

    setIsSubmitting(true);

    try {
      const conversationData: CreateConversationData = {
        type: formData.type,
        name: formData.name,
        description: formData.description || undefined,
        participantIds: formData.participantIds,
        isPublic: formData.isPublic,
        settings: formData.settings
      };

      await onSubmit(conversationData);
      toast.success('Conversation created successfully');
      onClose();
      
      // Reset form
      setFormData({
        type: 'group',
        name: '',
        description: '',
        participantIds: [],
        isPublic: false,
        initialMessage: '',
        settings: {
          allowFileSharing: true,
          allowVoiceMessages: true,
          allowImageSharing: true,
          maxParticipants: 50,
          isPublic: false,
          requireAdminApproval: false
        },
        attachments: []
      });
    } catch (error) {
      console.error('Error creating conversation:', error);
      toast.error('Failed to create conversation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTypeChange = (type: ConversationType) => {
    setFormData(prev => ({
      ...prev,
      type,
      participantIds: type === 'direct' ? prev.participantIds.slice(0, 1) : prev.participantIds,
      isPublic: type === 'announcement' ? true : prev.isPublic
    }));
  };

  const handleParticipantToggle = (userId: string) => {
    setFormData(prev => {
      const isSelected = prev.participantIds.includes(userId);
      let newParticipantIds;
      
      if (isSelected) {
        newParticipantIds = prev.participantIds.filter(id => id !== userId);
      } else {
        if (prev.type === 'direct' && prev.participantIds.length >= 1) {
          newParticipantIds = [userId];
        } else {
          newParticipantIds = [...prev.participantIds, userId];
        }
      }
      
      return {
        ...prev,
        participantIds: newParticipantIds
      };
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const handleRemoveAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
      <Modal>
        <Header>
          <Title>Start New Conversation</Title>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </Header>

        <form onSubmit={handleSubmit}>
          <Content>
            <FormGroup>
              <Label>Conversation Type</Label>
              <TypeSelector>
                {conversationTypes.map(({ type, icon: Icon, label, description }) => (
                  <TypeOption
                    key={type}
                    type="button"
                    selected={formData.type === type}
                    onClick={() => handleTypeChange(type)}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </TypeOption>
                ))}
              </TypeSelector>
              <HelpText>
                {formData.type === 'direct' && 'Private conversation between you and one other person'}
                {formData.type === 'group' && 'Discussion with multiple participants'}
                {formData.type === 'announcement' && 'Broadcast message to society members'}
              </HelpText>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="name">
                {formData.type === 'announcement' ? 'Announcement Title' : 'Conversation Name'}
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder={
                  formData.type === 'announcement' 
                    ? 'e.g., Important Society Update'
                    : 'e.g., Building Maintenance Discussion'
                }
                required
              />
            </FormGroup>

            {formData.type !== 'direct' && (
              <FormGroup>
                <Label htmlFor="description">Description (Optional)</Label>
                <TextArea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the conversation topic..."
                />
              </FormGroup>
            )}

            {formData.type !== 'announcement' && (
              <FormGroup>
                <Label>Select Participants</Label>
                <ParticipantSection>
                  <ParticipantSearch>
                    <SearchIcon />
                    <SearchInput
                      type="text"
                      placeholder="Search by name, email, or unit..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </ParticipantSearch>
                  
                  <ParticipantList>
                    {filteredUsers.length === 0 ? (
                      <div style={{ padding: '16px', textAlign: 'center', color: '#6B7280' }}>
                        {searchQuery ? 'No users found' : 'No users available'}
                      </div>
                    ) : (
                      filteredUsers.map((user) => (
                        <ParticipantItem
                          key={user.id}
                          selected={formData.participantIds.includes(user.id)}
                          onClick={() => handleParticipantToggle(user.id)}
                        >
                          <ParticipantInfo>
                            <Avatar>
                              {user.name.charAt(0).toUpperCase()}
                            </Avatar>
                            <ParticipantDetails>
                              <ParticipantName>{user.name}</ParticipantName>
                              <ParticipantRole>
                                {user.role} {user.unitNumber && `• ${user.unitNumber}`}
                              </ParticipantRole>
                            </ParticipantDetails>
                          </ParticipantInfo>
                          {formData.participantIds.includes(user.id) && (
                            <FiCheck color="#059669" />
                          )}
                        </ParticipantItem>
                      ))
                    )}
                  </ParticipantList>
                </ParticipantSection>
                <HelpText>
                  {formData.type === 'direct' 
                    ? 'Select one person for a direct conversation'
                    : `Selected: ${formData.participantIds.length} participants`}
                </HelpText>
              </FormGroup>
            )}

            {formData.type === 'group' && (
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                />
                <CheckboxLabel htmlFor="isPublic">
                  Make this a public group (visible to all society members)
                </CheckboxLabel>
              </CheckboxContainer>
            )}

            <FormGroup>
              <Label htmlFor="initialMessage">
                {formData.type === 'announcement' ? 'Announcement Message' : 'Initial Message'}
              </Label>
              <TextArea
                id="initialMessage"
                value={formData.initialMessage}
                onChange={(e) => setFormData(prev => ({ ...prev, initialMessage: e.target.value }))}
                placeholder={
                  formData.type === 'announcement'
                    ? 'Write your announcement message...'
                    : 'Start the conversation with a message...'
                }
                required
                rows={4}
              />
            </FormGroup>

            <FormGroup>
              <Label>Attachments (Optional)</Label>
              <AttachmentSection
                onClick={() => fileInputRef.current?.click()}
              >
                <FiPaperclip size={24} />
                <p>Click to add files or drag and drop</p>
                <HelpText>Support for images, documents, and other files</HelpText>
              </AttachmentSection>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx,.txt"
              />

              {formData.attachments.length > 0 && (
                <AttachmentList>
                  {formData.attachments.map((file, index) => (
                    <AttachmentItem key={index}>
                      <FiPaperclip size={14} />
                      <span>{file.name}</span>
                      <RemoveAttachment
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                      >
                        <FiX size={14} />
                      </RemoveAttachment>
                    </AttachmentItem>
                  ))}
                </AttachmentList>
              )}
            </FormGroup>

            {formData.type === 'group' && (
              <SettingsSection>
                <Label>Group Settings</Label>
                <SettingsGrid>
                  <CheckboxContainer>
                    <Checkbox
                      type="checkbox"
                      id="allowFileSharing"
                      checked={formData.settings.allowFileSharing}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, allowFileSharing: e.target.checked }
                      }))}
                    />
                    <CheckboxLabel htmlFor="allowFileSharing">Allow file sharing</CheckboxLabel>
                  </CheckboxContainer>

                  <CheckboxContainer>
                    <Checkbox
                      type="checkbox"
                      id="allowVoiceMessages"
                      checked={formData.settings.allowVoiceMessages}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, allowVoiceMessages: e.target.checked }
                      }))}
                    />
                    <CheckboxLabel htmlFor="allowVoiceMessages">Allow voice messages</CheckboxLabel>
                  </CheckboxContainer>

                  <CheckboxContainer>
                    <Checkbox
                      type="checkbox"
                      id="requireAdminApproval"
                      checked={formData.settings.requireAdminApproval}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, requireAdminApproval: e.target.checked }
                      }))}
                    />
                    <CheckboxLabel htmlFor="requireAdminApproval">Require admin approval</CheckboxLabel>
                  </CheckboxContainer>
                </SettingsGrid>
              </SettingsSection>
            )}
          </Content>

          <Footer>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              <FiSend size={16} />
              {isSubmitting ? 'Creating...' : 'Start Conversation'}
            </Button>
          </Footer>
        </form>
      </Modal>
    </Overlay>
  );
};

export default NewConversationForm;