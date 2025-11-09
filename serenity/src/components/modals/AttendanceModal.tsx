import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  FiX,
  FiSave,
  FiEdit3,
  FiEye,
  FiClock,
  FiCalendar,
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiHome,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiActivity
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import {
  StaffAttendance,
  AttendanceStatus,
  AttendanceFormData,
  AttendanceModalMode
} from '../../types/staff-attendance';

// Modal Backdrop and Container
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
  padding: ${({ theme }) => theme.spacing[4]};
`;

const ModalContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.boxShadow.xl};
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[400]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[600]};
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

// Staff Info Section
const StaffInfoSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const Avatar = styled.div<{ src?: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${({ theme, src }) => src ? `url(${src}) center/cover` : theme.colors.gray[300]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.gray[600]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  border: 4px solid ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.boxShadow.md};
`;

const StaffDetails = styled.div`
  flex: 1;
`;

const StaffName = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin: 0 0 ${({ theme }) => theme.spacing[1]} 0;
`;

const StaffMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

// Form Components
const FormGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
  grid-template-columns: 1fr 1fr;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const FormLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const FormInput = styled.input`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[900]};
  background: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

const FormSelect = styled.select`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[900]};
  background: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

const FormTextarea = styled.textarea`
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[900]};
  background: ${({ theme }) => theme.colors.white};
  transition: ${({ theme }) => theme.transition.colors};
  resize: vertical;
  min-height: 80px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

const Button = styled.button<{ 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};
  white-space: nowrap;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${({ theme, variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary[600]};
          border-color: ${theme.colors.primary[600]};
          color: ${theme.colors.white};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary[700]};
            border-color: ${theme.colors.primary[700]};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error[600]};
          border-color: ${theme.colors.error[600]};
          color: ${theme.colors.white};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.error[700]};
            border-color: ${theme.colors.error[700]};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          border-color: ${theme.colors.gray[300]};
          color: ${theme.colors.gray[700]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.gray[50]};
            border-color: ${theme.colors.gray[400]};
          }
        `;
      default:
        return `
          background: ${theme.colors.white};
          border-color: ${theme.colors.gray[300]};
          color: ${theme.colors.gray[700]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.gray[50]};
            border-color: ${theme.colors.gray[400]};
          }
        `;
    }
  }}
`;

const Badge = styled.span<{ variant: 'success' | 'error' | 'warning' | 'info' | 'default' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  text-transform: uppercase;
  letter-spacing: 0.025em;

  ${({ theme, variant }) => {
    switch (variant) {
      case 'success':
        return `
          background: ${theme.colors.success[100]};
          color: ${theme.colors.success[800]};
        `;
      case 'error':
        return `
          background: ${theme.colors.error[100]};
          color: ${theme.colors.error[800]};
        `;
      case 'warning':
        return `
          background: ${theme.colors.warning[100]};
          color: ${theme.colors.warning[800]};
        `;
      case 'info':
        return `
          background: ${theme.colors.info[100]};
          color: ${theme.colors.info[800]};
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[800]};
        `;
    }
  }}
`;

const AttendanceInfo = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const InfoCard = styled.div`
  background: ${({ theme }) => theme.colors.gray[50]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
`;

const InfoTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin: 0 0 ${({ theme }) => theme.spacing[2]} 0;
  text-transform: uppercase;
  letter-spacing: 0.025em;
`;

const InfoValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

// Utility functions
const getAttendanceStatusVariant = (status: AttendanceStatus): 'success' | 'error' | 'warning' | 'info' | 'default' => {
  switch (status) {
    case AttendanceStatus.PRESENT:
      return 'success';
    case AttendanceStatus.ABSENT:
      return 'error';
    case AttendanceStatus.LATE:
      return 'warning';
    case AttendanceStatus.HALF_DAY:
      return 'info';
    case AttendanceStatus.LEAVE:
      return 'info';
    case AttendanceStatus.HOLIDAY:
      return 'default';
    default:
      return 'default';
  }
};

const getAttendanceStatusIcon = (status: AttendanceStatus) => {
  switch (status) {
    case AttendanceStatus.PRESENT:
      return <FiCheckCircle />;
    case AttendanceStatus.ABSENT:
      return <FiXCircle />;
    case AttendanceStatus.LATE:
      return <FiAlertCircle />;
    case AttendanceStatus.HALF_DAY:
      return <FiClock />;
    case AttendanceStatus.LEAVE:
      return <FiCalendar />;
    case AttendanceStatus.HOLIDAY:
      return <FiCalendar />;
    default:
      return <FiActivity />;
  }
};

const formatTime = (date?: Date): string => {
  if (!date) return '--';
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

interface AttendanceModalProps {
  mode: AttendanceModalMode;
  onClose: () => void;
  onSave?: (data: AttendanceFormData) => Promise<void>;
}

const AttendanceModal: React.FC<AttendanceModalProps> = ({ mode, onClose, onSave }) => {
  const [formData, setFormData] = useState<AttendanceFormData>({
    attendanceStatus: AttendanceStatus.PRESENT,
    checkInTime: '',
    checkOutTime: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (mode.data) {
      setFormData({
        attendanceStatus: mode.data.attendanceStatus,
        checkInTime: mode.data.checkInTime ? mode.data.checkInTime.toTimeString().slice(0, 5) : '',
        checkOutTime: mode.data.checkOutTime ? mode.data.checkOutTime.toTimeString().slice(0, 5) : '',
        notes: mode.data.notes || '',
        date: mode.data.date.toISOString().split('T')[0]
      });
    }
  }, [mode.data]);

  const handleInputChange = (field: keyof AttendanceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!onSave) return;

    setLoading(true);
    try {
      await onSave(formData);
      toast.success(`Attendance ${mode.type === 'edit' ? 'updated' : 'recorded'} successfully`);
      onClose();
    } catch (error) {
      toast.error(`Failed to ${mode.type === 'edit' ? 'update' : 'record'} attendance`);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderModalTitle = () => {
    switch (mode.type) {
      case 'view':
        return (
          <>
            <FiEye />
            View Attendance Details
          </>
        );
      case 'edit':
        return (
          <>
            <FiEdit3 />
            Edit Attendance
          </>
        );
      case 'add':
        return (
          <>
            <FiClock />
            Add Attendance Record
          </>
        );
      default:
        return 'Attendance';
    }
  };

  const isReadOnly = mode.type === 'view';

  return (
    <ModalBackdrop onClick={handleBackdropClick}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {renderModalTitle()}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          {mode.data && (
            <StaffInfoSection>
              <Avatar src={mode.data.profilePicture}>
                {!mode.data.profilePicture && <FiUser />}
              </Avatar>
              <StaffDetails>
                <StaffName>{mode.data.name}</StaffName>
                <StaffMeta>
                  <MetaItem>
                    <FiMail />
                    {mode.data.email}
                  </MetaItem>
                  <MetaItem>
                    <FiPhone />
                    {mode.data.phone}
                  </MetaItem>
                  <MetaItem>
                    <FiBriefcase />
                    {mode.data.role}
                  </MetaItem>
                  <MetaItem>
                    <FiHome />
                    {mode.data.department}
                  </MetaItem>
                </StaffMeta>
              </StaffDetails>
              {mode.type === 'view' && (
                <Badge variant={getAttendanceStatusVariant(mode.data.attendanceStatus)}>
                  {getAttendanceStatusIcon(mode.data.attendanceStatus)}
                  {mode.data.attendanceStatus}
                </Badge>
              )}
            </StaffInfoSection>
          )}

          {mode.type === 'view' && mode.data && (
            <AttendanceInfo>
              <InfoCard>
                <InfoTitle>Date</InfoTitle>
                <InfoValue>{formatDate(mode.data.date)}</InfoValue>
              </InfoCard>
              
              <FormGrid>
                <InfoCard>
                  <InfoTitle>Check In Time</InfoTitle>
                  <InfoValue>{formatTime(mode.data.checkInTime)}</InfoValue>
                </InfoCard>
                
                <InfoCard>
                  <InfoTitle>Check Out Time</InfoTitle>
                  <InfoValue>{formatTime(mode.data.checkOutTime)}</InfoValue>
                </InfoCard>
              </FormGrid>

              <FormGrid>
                <InfoCard>
                  <InfoTitle>Working Hours</InfoTitle>
                  <InfoValue>{mode.data.workingHours ? `${mode.data.workingHours} hours` : '--'}</InfoValue>
                </InfoCard>
                
                <InfoCard>
                  <InfoTitle>Overtime Hours</InfoTitle>
                  <InfoValue>{mode.data.overtimeHours ? `${mode.data.overtimeHours} hours` : '--'}</InfoValue>
                </InfoCard>
              </FormGrid>

              {mode.data.notes && (
                <InfoCard>
                  <InfoTitle>Notes</InfoTitle>
                  <InfoValue>{mode.data.notes}</InfoValue>
                </InfoCard>
              )}
            </AttendanceInfo>
          )}

          {(mode.type === 'edit' || mode.type === 'add') && (
            <FormGrid>
              <FormGroup>
                <FormLabel htmlFor="date">Date</FormLabel>
                <FormInput
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  disabled={isReadOnly}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="attendanceStatus">Attendance Status</FormLabel>
                <FormSelect
                  id="attendanceStatus"
                  value={formData.attendanceStatus}
                  onChange={(e) => handleInputChange('attendanceStatus', e.target.value)}
                  disabled={isReadOnly}
                >
                  {Object.values(AttendanceStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </FormSelect>
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="checkInTime">Check In Time</FormLabel>
                <FormInput
                  id="checkInTime"
                  type="time"
                  value={formData.checkInTime}
                  onChange={(e) => handleInputChange('checkInTime', e.target.value)}
                  disabled={isReadOnly}
                />
              </FormGroup>

              <FormGroup>
                <FormLabel htmlFor="checkOutTime">Check Out Time</FormLabel>
                <FormInput
                  id="checkOutTime"
                  type="time"
                  value={formData.checkOutTime}
                  onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
                  disabled={isReadOnly}
                />
              </FormGroup>

              <FormGroup style={{ gridColumn: '1 / -1' }}>
                <FormLabel htmlFor="notes">Notes</FormLabel>
                <FormTextarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Add any additional notes about attendance..."
                  disabled={isReadOnly}
                />
              </FormGroup>
            </FormGrid>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {(mode.type === 'edit' || mode.type === 'add') && onSave && (
            <Button variant="primary" onClick={handleSave} disabled={loading}>
              <FiSave />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          )}
        </ModalFooter>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default AttendanceModal;