import React, { useState, useEffect, useRef } from 'react';
import styled, { DefaultTheme } from 'styled-components';
import {
  FiX,
  FiUpload,
  FiFile,
  FiFileText,
  FiImage,
  FiTrash2,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiAlertCircle,
  FiCheckCircle,
  FiCreditCard,
  FiPaperclip,
  FiClock,
  FiRefreshCw,
  FiSend
} from 'react-icons/fi';
import { toast } from 'react-toastify';

interface VendorPayment {
  id?: number;
  vendorId: number;
  vendorName: string;
  invoiceNumber: string;
  paymentId?: string;
  amount: number;
  serviceDescription: string;
  paymentDate: Date;
  dueDate: Date;
  processedDate?: Date;
  paymentMethod: 'bank_transfer' | 'check' | 'online' | 'cash' | 'card';
  status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'on_hold';
  paymentType: 'service' | 'maintenance' | 'supplies' | 'contract' | 'emergency' | 'other';
  approvedBy?: string;
  processedBy?: string;
  rejectionReason?: string;
  attachments: string[];
  notes: string;
  taxAmount: number;
  discountAmount: number;
  netAmount: number;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  recurringPayment: boolean;
  nextPaymentDate?: Date;
  contractId?: string;
  isOverdue?: boolean;
  createdBy?: string;
  createdDate?: Date;
  lastModified?: Date;
  paymentReference?: string;
}

interface VendorPaymentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment?: VendorPayment | null;
  onSubmit: (paymentData: Partial<VendorPayment>) => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.boxShadow.xl};
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  justify-content: between;
  align-items: center;
  position: sticky;
  top: 0;
  background: ${({ theme }) => theme.colors.white};
  z-index: 10;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing[4]};
  right: ${({ theme }) => theme.spacing[4]};
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const FormSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const SectionTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing[4]} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding-bottom: ${({ theme }) => theme.spacing[2]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormTriple = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.spacing[4]};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
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

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[500]};
    cursor: not-allowed;
  }
`;

const CurrencyInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  &:before {
    content: '₹';
    position: absolute;
    left: ${({ theme }) => theme.spacing[3]};
    color: ${({ theme }) => theme.colors.gray[500]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    z-index: 1;
  }
  
  input {
    padding-left: ${({ theme }) => theme.spacing[8]};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  background: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[500]};
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  resize: vertical;
  min-height: 80px;
  transition: ${({ theme }) => theme.transition.all};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }
`;

const FileUploadArea = styled.div<{ isDragOver: boolean; hasFiles: boolean }>`
  border: 2px dashed;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  text-align: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  position: relative;

  ${({ isDragOver, hasFiles, theme }) => {
    if (hasFiles) {
      return `
        border-color: ${theme.colors.success[300]};
        background: ${theme.colors.success[50]};
      `;
    }
    if (isDragOver) {
      return `
        border-color: ${theme.colors.primary[400]};
        background: ${theme.colors.primary[50]};
      `;
    }
    return `
      border-color: ${theme.colors.gray[300]};
      background: ${theme.colors.gray[50]};
      
      &:hover {
        border-color: ${theme.colors.primary[400]};
        background: ${theme.colors.primary[50]};
      }
    `;
  }}
`;

const FileUploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FileUploadIcon = styled.div`
  color: ${({ theme }) => theme.colors.gray[400]};
`;

const FileUploadText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  strong {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const HiddenFileInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

const FileList = styled.div`
  margin-top: ${({ theme }) => theme.spacing[3]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const FileDetails = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  flex: 1;
`;

const FileIcon = styled.div`
  color: ${({ theme }) => theme.colors.primary[600]};
`;

const FileText = styled.div`
  flex: 1;
`;

const FileName = styled.p`
  margin: 0 0 4px 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const FileSize = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const RemoveFileButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error[600]};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    background: ${({ theme }) => theme.colors.error[50]};
    color: ${({ theme }) => theme.colors.error[700]};
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
  margin: 0;
`;

const AmountSummary = styled.div`
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[2]};

  &:last-child {
    margin-bottom: 0;
    padding-top: ${({ theme }) => theme.spacing[2]};
    border-top: 1px solid ${({ theme }) => theme.colors.gray[300]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  }
`;

const SummaryLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const SummaryValue = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

const ModalFooter = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: flex-end;
  position: sticky;
  bottom: 0;
  background: ${({ theme }) => theme.colors.white};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: ${({ theme }: { theme: DefaultTheme }) => theme.spacing[3]} ${({ theme }: { theme: DefaultTheme }) => theme.spacing[6]};
  border: 1px solid;
  border-radius: ${({ theme }: { theme: DefaultTheme }) => theme.borderRadius.md};
  font-size: ${({ theme }: { theme: DefaultTheme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }: { theme: DefaultTheme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }: { theme: DefaultTheme }) => theme.transition.all};
  display: flex;
  align-items: center;
  gap: ${({ theme }: { theme: DefaultTheme }) => theme.spacing[2]};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ variant = 'secondary', theme }: { variant?: string; theme: DefaultTheme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary[600]};
          color: ${theme.colors.white};
          border-color: ${theme.colors.primary[600]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary[700]};
            border-color: ${theme.colors.primary[700]};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error[600]};
          color: ${theme.colors.white};
          border-color: ${theme.colors.error[600]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.error[700]};
            border-color: ${theme.colors.error[700]};
          }
        `;
      default:
        return `
          background: ${theme.colors.white};
          color: ${theme.colors.gray[700]};
          border-color: ${theme.colors.gray[300]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.gray[50]};
            border-color: ${theme.colors.gray[400]};
          }
        `;
    }
  }}
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.error[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const VendorPaymentsModal: React.FC<VendorPaymentsModalProps> = ({
  isOpen,
  onClose,
  payment,
  onSubmit
}) => {
  const [formData, setFormData] = useState<Partial<VendorPayment>>({
    vendorId: 1,
    vendorName: '',
    invoiceNumber: '',
    amount: 0,
    serviceDescription: '',
    paymentDate: new Date(),
    dueDate: new Date(),
    paymentMethod: 'bank_transfer',
    paymentType: 'service',
    attachments: [],
    notes: '',
    taxAmount: 0,
    discountAmount: 0,
    netAmount: 0,
    category: '',
    priority: 'medium',
    recurringPayment: false
  });
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock vendor options
  const vendorOptions = [
    { id: 1, name: 'QuickFix Plumbers' },
    { id: 2, name: 'PowerTech Electricians' },
    { id: 3, name: 'EcoClean Solutions' },
    { id: 4, name: 'SecureGuard Agency' },
    { id: 5, name: 'GreenGarden Services' },
    { id: 6, name: 'TechSupport Pro' }
  ];

  useEffect(() => {
    if (payment) {
      setFormData({
        ...payment,
        paymentDate: payment.paymentDate instanceof Date ? payment.paymentDate.toISOString().split('T')[0] : payment.paymentDate,
        dueDate: payment.dueDate instanceof Date ? payment.dueDate.toISOString().split('T')[0] : payment.dueDate,
        nextPaymentDate: payment.nextPaymentDate 
          ? (payment.nextPaymentDate instanceof Date 
              ? payment.nextPaymentDate.toISOString().split('T')[0]
              : payment.nextPaymentDate)
          : undefined
      } as any);
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      setFormData({
        vendorId: 1,
        vendorName: vendorOptions[0].name,
        invoiceNumber: '',
        amount: 0,
        serviceDescription: '',
        paymentDate: tomorrow.toISOString().split('T')[0],
        dueDate: nextWeek.toISOString().split('T')[0],
        paymentMethod: 'bank_transfer',
        paymentType: 'service',
        attachments: [],
        notes: '',
        taxAmount: 0,
        discountAmount: 0,
        netAmount: 0,
        category: '',
        priority: 'medium',
        recurringPayment: false
      } as any);
    }
    setSelectedFiles([]);
    setErrors({});
  }, [payment, isOpen]);

  // Calculate net amount when base amount, tax, or discount changes
  useEffect(() => {
    const baseAmount = Number(formData.amount) || 0;
    const taxAmount = Number(formData.taxAmount) || 0;
    const discountAmount = Number(formData.discountAmount) || 0;
    const netAmount = baseAmount + taxAmount - discountAmount;
    
    if (netAmount !== formData.netAmount) {
      setFormData(prev => ({ ...prev, netAmount }));
    }
  }, [formData.amount, formData.taxAmount, formData.discountAmount]);

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleVendorChange = (vendorId: number) => {
    const vendor = vendorOptions.find(v => v.id === vendorId);
    setFormData({
      ...formData,
      vendorId,
      vendorName: vendor ? vendor.name : ''
    });
  };

  const handleFileSelect = (files: FileList) => {
    const newFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error(`File ${file.name} has an unsupported format. Please select PDF, DOC, DOCX, JPG, PNG, XLS, or XLSX files.`);
        continue;
      }

      newFiles.push(file);
    }

    setSelectedFiles(prev => [...prev, ...newFiles]);
    
    // Update attachments in form data
    const attachmentNames = [...(formData.attachments || []), ...newFiles.map(f => f.name)];
    setFormData({
      ...formData,
      attachments: attachmentNames
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleFileRemove = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    
    const attachmentNames = newFiles.map(f => f.name);
    setFormData({
      ...formData,
      attachments: attachmentNames
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.vendorName?.trim()) {
      newErrors.vendorName = 'Vendor is required';
    }

    if (!formData.invoiceNumber?.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.serviceDescription?.trim()) {
      newErrors.serviceDescription = 'Service description is required';
    }

    if (!formData.category?.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Payment date is required';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    // Check if payment date is not after due date
    if (formData.paymentDate && formData.dueDate) {
      const paymentDate = new Date(formData.paymentDate as any);
      const dueDate = new Date(formData.dueDate as any);
      if (paymentDate > dueDate) {
        newErrors.paymentDate = 'Payment date cannot be after due date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData: Partial<VendorPayment> = {
      ...formData,
      paymentDate: new Date(formData.paymentDate as any),
      dueDate: new Date(formData.dueDate as any),
      nextPaymentDate: formData.recurringPayment && formData.nextPaymentDate 
        ? new Date(formData.nextPaymentDate as any) 
        : undefined,
      paymentReference: payment?.paymentReference || `REF-${Date.now()}`
    };

    onSubmit(submitData);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName: string, fileType?: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const type = fileType || '';
    
    if (type.includes('image') || ['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <FiImage size={20} />;
    }
    if (type.includes('pdf') || extension === 'pdf') {
      return <FiFileText size={20} />;
    }
    return <FiFile size={20} />;
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <FiCreditCard size={24} />
            {payment ? 'Edit Payment' : 'Add New Payment'}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX size={24} />
          </CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            {/* Basic Information */}
            <FormSection>
              <SectionTitle>
                <FiUser size={18} />
                Basic Information
              </SectionTitle>
              
              <FormRow>
                <FormGroup>
                  <Label>Vendor *</Label>
                  <Select
                    value={formData.vendorId || ''}
                    onChange={(e) => handleVendorChange(Number(e.target.value))}
                    disabled={!!payment}
                  >
                    {vendorOptions.map(vendor => (
                      <option key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </option>
                    ))}
                  </Select>
                  {errors.vendorName && (
                    <ErrorMessage>
                      <FiAlertCircle size={16} />
                      {errors.vendorName}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Invoice Number *</Label>
                  <Input
                    type="text"
                    placeholder="INV-2024-001"
                    value={formData.invoiceNumber || ''}
                    onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                  />
                  {errors.invoiceNumber && (
                    <ErrorMessage>
                      <FiAlertCircle size={16} />
                      {errors.invoiceNumber}
                    </ErrorMessage>
                  )}
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>Payment Type *</Label>
                  <Select
                    value={formData.paymentType || 'service'}
                    onChange={(e) => handleInputChange('paymentType', e.target.value)}
                  >
                    <option value="service">Service</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="supplies">Supplies</option>
                    <option value="contract">Contract</option>
                    <option value="emergency">Emergency</option>
                    <option value="other">Other</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Category *</Label>
                  <Input
                    type="text"
                    placeholder="e.g., plumbing, electrical, cleaning"
                    value={formData.category || ''}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  />
                  {errors.category && (
                    <ErrorMessage>
                      <FiAlertCircle size={16} />
                      {errors.category}
                    </ErrorMessage>
                  )}
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>Service Description *</Label>
                <TextArea
                  placeholder="Detailed description of the service provided"
                  value={formData.serviceDescription || ''}
                  onChange={(e) => handleInputChange('serviceDescription', e.target.value)}
                  rows={3}
                />
                {errors.serviceDescription && (
                  <ErrorMessage>
                    <FiAlertCircle size={16} />
                    {errors.serviceDescription}
                  </ErrorMessage>
                )}
              </FormGroup>
            </FormSection>

            {/* Payment Details */}
            <FormSection>
              <SectionTitle>
                <FiDollarSign size={18} />
                Payment Details
              </SectionTitle>

              <FormTriple>
                <FormGroup>
                  <Label>Base Amount *</Label>
                  <CurrencyInput>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.amount || ''}
                      onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                    />
                  </CurrencyInput>
                  {errors.amount && (
                    <ErrorMessage>
                      <FiAlertCircle size={16} />
                      {errors.amount}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Tax Amount</Label>
                  <CurrencyInput>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.taxAmount || ''}
                      onChange={(e) => handleInputChange('taxAmount', parseFloat(e.target.value) || 0)}
                    />
                  </CurrencyInput>
                </FormGroup>

                <FormGroup>
                  <Label>Discount Amount</Label>
                  <CurrencyInput>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.discountAmount || ''}
                      onChange={(e) => handleInputChange('discountAmount', parseFloat(e.target.value) || 0)}
                    />
                  </CurrencyInput>
                </FormGroup>
              </FormTriple>

              <FormGroup>
                <AmountSummary>
                  <SummaryRow>
                    <SummaryLabel>Base Amount:</SummaryLabel>
                    <SummaryValue>{formatCurrency(Number(formData.amount) || 0)}</SummaryValue>
                  </SummaryRow>
                  <SummaryRow>
                    <SummaryLabel>Tax Amount:</SummaryLabel>
                    <SummaryValue>{formatCurrency(Number(formData.taxAmount) || 0)}</SummaryValue>
                  </SummaryRow>
                  <SummaryRow>
                    <SummaryLabel>Discount Amount:</SummaryLabel>
                    <SummaryValue>-{formatCurrency(Number(formData.discountAmount) || 0)}</SummaryValue>
                  </SummaryRow>
                  <SummaryRow>
                    <SummaryLabel>Net Amount:</SummaryLabel>
                    <SummaryValue>{formatCurrency(Number(formData.netAmount) || 0)}</SummaryValue>
                  </SummaryRow>
                </AmountSummary>
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label>Payment Method *</Label>
                  <Select
                    value={formData.paymentMethod || 'bank_transfer'}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                  >
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="check">Check</option>
                    <option value="online">Online Payment</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card Payment</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Priority</Label>
                  <Select
                    value={formData.priority || 'medium'}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </Select>
                </FormGroup>
              </FormRow>
            </FormSection>

            {/* Dates */}
            <FormSection>
              <SectionTitle>
                <FiCalendar size={18} />
                Dates
              </SectionTitle>

              <FormRow>
                <FormGroup>
                  <Label>Payment Date *</Label>
                  <Input
                    type="date"
                    value={(typeof formData.paymentDate === 'string' ? formData.paymentDate : '') || ''}
                    onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                  />
                  {errors.paymentDate && (
                    <ErrorMessage>
                      <FiAlertCircle size={16} />
                      {errors.paymentDate}
                    </ErrorMessage>
                  )}
                </FormGroup>

                <FormGroup>
                  <Label>Due Date *</Label>
                  <Input
                    type="date"
                    value={(typeof formData.dueDate === 'string' ? formData.dueDate : '') || ''}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  />
                  {errors.dueDate && (
                    <ErrorMessage>
                      <FiAlertCircle size={16} />
                      {errors.dueDate}
                    </ErrorMessage>
                  )}
                </FormGroup>
              </FormRow>

              <CheckboxGroup>
                <Checkbox
                  id="recurringPayment"
                  type="checkbox"
                  checked={formData.recurringPayment || false}
                  onChange={(e) => handleInputChange('recurringPayment', e.target.checked)}
                />
                <CheckboxLabel htmlFor="recurringPayment">
                  This is a recurring payment
                </CheckboxLabel>
              </CheckboxGroup>

              {formData.recurringPayment && (
                <FormGroup>
                  <Label>Next Payment Date</Label>
                  <Input
                    type="date"
                    value={(typeof formData.nextPaymentDate === 'string' ? formData.nextPaymentDate : '') || ''}
                    onChange={(e) => handleInputChange('nextPaymentDate', e.target.value)}
                  />
                </FormGroup>
              )}
            </FormSection>

            {/* Attachments */}
            <FormSection>
              <SectionTitle>
                <FiPaperclip size={18} />
                Attachments
              </SectionTitle>

              <FileUploadArea
                isDragOver={isDragOver}
                hasFiles={selectedFiles.length > 0}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <FileUploadContent>
                  <FileUploadIcon>
                    <FiUpload size={32} />
                  </FileUploadIcon>
                  <FileUploadText>
                    <strong>Click to upload</strong> or drag and drop<br />
                    PDF, DOC, DOCX, JPG, PNG, XLS, XLSX (max 10MB each)
                  </FileUploadText>
                </FileUploadContent>
              </FileUploadArea>

              <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                multiple
                onChange={(e) => {
                  if (e.target.files) {
                    handleFileSelect(e.target.files);
                  }
                }}
              />

              {selectedFiles.length > 0 && (
                <FileList>
                  {selectedFiles.map((file, index) => (
                    <FileItem key={index}>
                      <FileDetails>
                        <FileIcon>
                          {getFileIcon(file.name, file.type)}
                        </FileIcon>
                        <FileText>
                          <FileName>{file.name}</FileName>
                          <FileSize>{formatFileSize(file.size)}</FileSize>
                        </FileText>
                      </FileDetails>
                      <RemoveFileButton onClick={() => handleFileRemove(index)}>
                        <FiTrash2 size={16} />
                      </RemoveFileButton>
                    </FileItem>
                  ))}
                </FileList>
              )}
            </FormSection>

            {/* Notes */}
            <FormSection>
              <SectionTitle>
                <FiFileText size={18} />
                Additional Notes
              </SectionTitle>

              <FormGroup>
                <Label>Contract ID</Label>
                <Input
                  type="text"
                  placeholder="CNT-2024-001"
                  value={formData.contractId || ''}
                  onChange={(e) => handleInputChange('contractId', e.target.value)}
                />
              </FormGroup>

              <FormGroup>
                <Label>Notes</Label>
                <TextArea
                  placeholder="Additional notes or comments about this payment"
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </FormGroup>
            </FormSection>
          </ModalBody>

          <ModalFooter>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              <FiCheckCircle size={16} />
              {payment ? 'Update Payment' : 'Create Payment'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default VendorPaymentsModal;