import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import {
  FiX,
  FiMessageSquare,
  FiSend,
  FiUser,
  FiPaperclip,
  FiUpload,
  FiFile,
  FiTrash2,
  FiAlertTriangle,
  FiInfo
} from 'react-icons/fi';
import { toast } from 'react-toastify';

interface Vendor {
  id: number;
  name: string;
  category: string;
  phone: string;
  email: string;
  rating: number;
  totalJobs: number;
  completedJobs: number;
  societyId: number;
  societyName: string;
  address: string;
  website?: string;
  description: string;
  specialties: string[];
  priceRange: 'budget' | 'mid-range' | 'premium';
  availability: 'available' | 'busy' | 'unavailable';
  verificationStatus: 'verified' | 'pending' | 'rejected';
  joinedDate: Date;
  lastActivity: Date;
  avgResponseTime: number;
  documents: string[];
  emergencyAvailable: boolean;
  contractType: 'hourly' | 'fixed' | 'contract';
}

interface AttachedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

interface VendorSendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
}

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.boxShadow.xl};
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.colors.white};
  z-index: 10;
`;

const Title = styled.h2`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.gray[600]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[200]};
    color: ${({ theme }) => theme.colors.gray[900]};
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const VendorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const VendorAvatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: ${({ theme }) => theme.colors.primary[100]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 20px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
`;

const VendorDetails = styled.div`
  flex: 1;
`;

const VendorName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 4px 0;
`;

const VendorCategory = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0;
`;

const MessageForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const FileUploadSection = styled.div<{ isDragActive?: boolean }>`
  border: 2px dashed ${({ theme, isDragActive }) => 
    isDragActive ? theme.colors.primary[500] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
  transition: ${({ theme }) => theme.transition.all};
  cursor: pointer;
  background: ${({ theme, isDragActive }) => 
    isDragActive ? theme.colors.primary[50] : theme.colors.white};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
`;

const UploadIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  margin: 0 auto ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 20px;
`;

const UploadText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin: 0 0 ${({ theme }) => theme.spacing[1]} 0;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const UploadSubtext = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin: 0;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const AttachedFilesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[3]};
`;

const AttachedFileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  flex: 1;
`;

const FileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${({ theme }) => theme.colors.primary[100]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const FileDetails = styled.div`
  flex: 1;
`;

const FileName = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 2px 0;
`;

const FileSize = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin: 0;
`;

const FileActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.error[100]};
    color: ${({ theme }) => theme.colors.error[700]};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing[4]};
  padding-top: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.primary[500] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.primary[500] : theme.colors.white};
  color: ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.white : theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme, variant }) => 
      variant === 'primary' ? theme.colors.primary[600] : theme.colors.gray[50]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NotificationBox = styled.div<{ type: 'info' | 'warning' }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme, type }) => 
    type === 'info' ? theme.colors.primary[50] : theme.colors.secondary[50]};
  border: 1px solid ${({ theme, type }) => 
    type === 'info' ? theme.colors.primary[200] : theme.colors.secondary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const NotificationIcon = styled.div<{ type: 'info' | 'warning' }>`
  color: ${({ theme, type }) => 
    type === 'info' ? theme.colors.primary[600] : theme.colors.secondary[600]};
  margin-top: 2px;
`;

const NotificationText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin: 0;
  line-height: 1.5;
`;

const VendorSendMessageModal: React.FC<VendorSendMessageModalProps> = ({
  isOpen,
  onClose,
  vendor
}) => {
  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: '',
    priority: 'normal',
    messageType: 'inquiry'
  });

  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!vendor) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMessageForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (files: FileList) => {
    const newFiles: AttachedFile[] = [];
    
    Array.from(files).forEach(file => {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`File "${file.name}" is too large. Maximum size is 10MB.`);
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(`File "${file.name}" type not supported. Please use PDF, DOC, DOCX, TXT, or image files.`);
        return;
      }

      newFiles.push({
        id: `${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type
      });
    });

    setAttachedFiles(prev => [...prev, ...newFiles]);
    if (newFiles.length > 0) {
      toast.success(`${newFiles.length} file(s) attached successfully`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
    toast.info('File removed');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageForm.subject.trim() || !messageForm.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Here you would normally send the message data and attached files to your backend
    console.log('Message Data:', messageForm);
    console.log('Attached Files:', attachedFiles);
    
    const fileCount = attachedFiles.length;
    const successMessage = fileCount > 0 
      ? `Message sent to ${vendor.name} successfully with ${fileCount} attachment${fileCount > 1 ? 's' : ''}!`
      : `Message sent to ${vendor.name} successfully!`;
    
    toast.success(successMessage);
    
    // Reset form
    setMessageForm({
      subject: '',
      message: '',
      priority: 'normal',
      messageType: 'inquiry'
    });
    setAttachedFiles([]);
    onClose();
  };

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>
            <FiMessageSquare />
            Send Message
          </Title>
          <CloseButton onClick={onClose}>
            <FiX size={16} />
          </CloseButton>
        </Header>

        <Content>
          <VendorInfo>
            <VendorAvatar>
              <FiUser />
            </VendorAvatar>
            <VendorDetails>
              <VendorName>{vendor.name}</VendorName>
              <VendorCategory>{vendor.category} • {vendor.priceRange}</VendorCategory>
            </VendorDetails>
          </VendorInfo>

          <NotificationBox type="info">
            <NotificationIcon type="info">
              <FiInfo size={18} />
            </NotificationIcon>
            <NotificationText>
              This message will be sent directly to {vendor.name} via their registered communication channels. 
              They typically respond within {vendor.avgResponseTime} hours.
            </NotificationText>
          </NotificationBox>

          <MessageForm onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="messageType">Message Type</Label>
              <Select
                id="messageType"
                name="messageType"
                value={messageForm.messageType}
                onChange={handleInputChange}
              >
                <option value="inquiry">General Inquiry</option>
                <option value="quote">Quote Request</option>
                <option value="appointment">Appointment Booking</option>
                <option value="complaint">Issue/Complaint</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="priority">Priority Level</Label>
              <Select
                id="priority"
                name="priority"
                value={messageForm.priority}
                onChange={handleInputChange}
              >
                <option value="low">Low Priority</option>
                <option value="normal">Normal Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                placeholder="Brief description of your message..."
                value={messageForm.subject}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="message">Message *</Label>
              <TextArea
                id="message"
                name="message"
                placeholder={`Dear ${vendor.name},

I hope this message finds you well. I would like to discuss...

Please let me know your availability and any additional information you might need.

Best regards`}
                value={messageForm.message}
                onChange={handleInputChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>
                <FiPaperclip size={16} />
                Attach Documents (Optional)
              </Label>
              <FileUploadSection
                isDragActive={isDragActive}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleFileInputClick}
              >
                <UploadIcon>
                  <FiUpload />
                </UploadIcon>
                <UploadText>
                  Click to upload or drag and drop files
                </UploadText>
                <UploadSubtext>
                  PDF, DOC, DOCX, TXT, Images (Max 10MB each)
                </UploadSubtext>
              </FileUploadSection>

              <HiddenFileInput
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
              />

              {attachedFiles.length > 0 && (
                <AttachedFilesList>
                  {attachedFiles.map(file => (
                    <AttachedFileItem key={file.id}>
                      <FileInfo>
                        <FileIcon>
                          <FiFile />
                        </FileIcon>
                        <FileDetails>
                          <FileName>{file.name}</FileName>
                          <FileSize>{formatFileSize(file.size)}</FileSize>
                        </FileDetails>
                      </FileInfo>
                      <FileActionButton
                        type="button"
                        onClick={() => handleRemoveFile(file.id)}
                        title="Remove file"
                      >
                        <FiTrash2 size={14} />
                      </FileActionButton>
                    </AttachedFileItem>
                  ))}
                </AttachedFilesList>
              )}
            </FormGroup>

            <ButtonGroup>
              <Button type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                <FiSend size={16} />
                Send Message
              </Button>
            </ButtonGroup>
          </MessageForm>
        </Content>
      </Modal>
    </Overlay>
  );
};

export default VendorSendMessageModal;