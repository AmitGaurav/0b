import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import {
  FiX,
  FiPhone,
  FiMail,
  FiMessageSquare,
  FiSend,
  FiUser,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiExternalLink,
  FiCopy,
  FiCheck,
  FiPaperclip,
  FiUpload,
  FiFile,
  FiTrash2
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

interface VendorContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
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
  backdrop-filter: blur(4px);
`;

const Modal = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  width: 90vw;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.boxShadow.xl};
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.info[50]} 0%, ${({ theme }) => theme.colors.white} 100%);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const VendorAvatar = styled.div`
  width: 48px;
  height: 48px;
  background: ${({ theme }) => theme.colors.info[500]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const VendorInfo = styled.div`
  flex: 1;
`;

const VendorName = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const VendorCategory = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-transform: capitalize;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.gray[600]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[200]};
    color: ${({ theme }) => theme.colors.gray[800]};
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing[6]};
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ContactOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
`;

const ContactOption = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-align: left;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  width: 100%;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[300]};
    background: ${({ theme }) => theme.colors.primary[50]};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.boxShadow.md};
  }

  &:active {
    transform: translateY(0);
  }
`;

const ContactIcon = styled.div<{ variant?: 'phone' | 'email' | 'whatsapp' | 'message' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.white};

  ${({ variant, theme }) => {
    switch (variant) {
      case 'phone':
        return `background: ${theme.colors.success[500]};`;
      case 'email':
        return `background: ${theme.colors.info[500]};`;
      case 'whatsapp':
        return `background: #25D366;`;
      case 'message':
        return `background: ${theme.colors.secondary[500]};`;
      default:
        return `background: ${theme.colors.primary[500]};`;
    }
  }}
`;

const ContactContent = styled.div`
  flex: 1;
`;

const ContactLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const ContactValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[200]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
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
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.all};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[400]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const TextArea = styled.textarea`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: ${({ theme }) => theme.transition.all};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[400]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  align-self: flex-start;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.boxShadow.md};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[300]};
    cursor: not-allowed;
    transform: none;
  }
`;

const InfoCard = styled.div`
  background: ${({ theme }) => theme.colors.gray[50]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};

  &:last-child {
    margin-bottom: 0;
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

const VendorContactModal: React.FC<VendorContactModalProps> = ({
  isOpen,
  onClose,
  vendor
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !vendor) return null;

  const handleCopy = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast.success(`${type === 'phone' ? 'Phone number' : 'Email'} copied to clipboard`);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleCall = () => {
    window.open(`tel:${vendor.phone}`, '_self');
  };

  const handleEmail = () => {
    window.open(`mailto:${vendor.email}`, '_blank');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(`Hello ${vendor.name}, I would like to inquire about your ${vendor.category} services.`);
    window.open(`https://wa.me/${vendor.phone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
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

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageForm.subject.trim() || !messageForm.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Here you would integrate with your messaging system
    console.log('Message Data:', messageForm);
    console.log('Attached Files:', attachedFiles);
    
    const fileCount = attachedFiles.length;
    const successMessage = fileCount > 0 
      ? `Message sent successfully with ${fileCount} attachment${fileCount > 1 ? 's' : ''}!`
      : 'Message sent successfully!';
    
    toast.success(successMessage);
    setMessageForm({ subject: '', message: '', priority: 'normal' });
    setAttachedFiles([]);
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderLeft>
            <VendorAvatar>
              {vendor.name.charAt(0).toUpperCase()}
            </VendorAvatar>
            <VendorInfo>
              <VendorName>{vendor.name}</VendorName>
              <VendorCategory>{vendor.category} Services</VendorCategory>
            </VendorInfo>
          </HeaderLeft>
          <CloseButton onClick={onClose}>
            <FiX size={20} />
          </CloseButton>
        </Header>

        <Content>
          <InfoCard>
            <InfoRow>
              <FiMapPin size={16} />
              <span>{vendor.address}</span>
            </InfoRow>
            <InfoRow>
              <FiClock size={16} />
              <span>Avg Response Time: {vendor.avgResponseTime} hours</span>
            </InfoRow>
            <InfoRow>
              <FiCalendar size={16} />
              <span>Available: {vendor.availability}</span>
            </InfoRow>
          </InfoCard>

          <Section>
            <SectionTitle>
              <FiPhone />
              Quick Contact Options
            </SectionTitle>
            <ContactOptions>
              <ContactOption onClick={handleCall}>
                <ContactIcon variant="phone">
                  <FiPhone size={20} />
                </ContactIcon>
                <ContactContent>
                  <ContactLabel>Call Now</ContactLabel>
                  <ContactValue>
                    {vendor.phone}
                    <CopyButton onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(vendor.phone, 'phone');
                    }}>
                      {copied === 'phone' ? <FiCheck size={12} /> : <FiCopy size={12} />}
                    </CopyButton>
                  </ContactValue>
                </ContactContent>
              </ContactOption>

              <ContactOption onClick={handleEmail}>
                <ContactIcon variant="email">
                  <FiMail size={20} />
                </ContactIcon>
                <ContactContent>
                  <ContactLabel>Send Email</ContactLabel>
                  <ContactValue>
                    {vendor.email}
                    <CopyButton onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(vendor.email, 'email');
                    }}>
                      {copied === 'email' ? <FiCheck size={12} /> : <FiCopy size={12} />}
                    </CopyButton>
                  </ContactValue>
                </ContactContent>
              </ContactOption>

              <ContactOption onClick={handleWhatsApp}>
                <ContactIcon variant="whatsapp">
                  <FiMessageSquare size={20} />
                </ContactIcon>
                <ContactContent>
                  <ContactLabel>WhatsApp</ContactLabel>
                  <ContactValue>
                    Quick message
                    <FiExternalLink size={12} />
                  </ContactValue>
                </ContactContent>
              </ContactOption>
            </ContactOptions>
          </Section>

          <Section>
            <SectionTitle>
              <FiMessageSquare />
              Send Direct Message
            </SectionTitle>
            <MessageForm onSubmit={handleMessageSubmit}>
              <FormGroup>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Service inquiry, quote request, etc."
                  value={messageForm.subject}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="message">Message *</Label>
                <TextArea
                  id="message"
                  placeholder={`Hi ${vendor.name},

I'm interested in your ${vendor.category} services. Could you please provide more information about:

- Service availability
- Pricing details
- Timeline estimates

Thank you!`}
                  value={messageForm.message}
                  onChange={(e) => setMessageForm(prev => ({ ...prev, message: e.target.value }))}
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

              <SendButton type="submit">
                <FiSend size={16} />
                Send Message
              </SendButton>
            </MessageForm>
          </Section>
        </Content>
      </Modal>
    </Overlay>
  );
};

export default VendorContactModal;