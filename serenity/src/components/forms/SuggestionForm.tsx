import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FiX, FiSend } from 'react-icons/fi';
import { HiLightBulb } from 'react-icons/hi';
import { SuggestionFormData } from '../../types/suggestion';

// Styled Components
const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing[4]};
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 0;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.boxShadow.lg};
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: between;
  padding: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.primary[50]};
`;

const ModalTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin: 0;
  flex: 1;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.primary[900]};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

const ModalBody = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  max-height: calc(90vh - 140px);
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const RequiredAsterisk = styled.span`
  color: ${({ theme }) => theme.colors.error[500]};
  margin-left: 2px;
`;

const TextArea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ hasError, theme }) => 
    hasError ? theme.colors.error[300] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: inherit;
  line-height: 1.5;
  resize: vertical;
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    outline: none;
    border-color: ${({ hasError, theme }) => 
      hasError ? theme.colors.error[500] : theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ hasError, theme }) => 
      hasError ? theme.colors.error[100] : theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  margin-top: 4px;
`;

const CharacterCount = styled.div<{ isOver: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ isOver, theme }) => 
    isOver ? theme.colors.error[500] : theme.colors.gray[500]};
  text-align: right;
  margin-top: 4px;
`;

const InfoBox = styled.div`
  background: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const InfoTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const InfoText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.primary[700]};
  line-height: 1.4;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  background: ${({ theme }) => theme.colors.gray[50]};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.colors};
  border: 1px solid transparent;
  min-width: 100px;
  justify-content: center;

  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary[600]};
          color: ${theme.colors.white};
          border-color: ${theme.colors.primary[600]};

          &:hover:not(:disabled) {
            background: ${theme.colors.primary[700]};
          }

          &:disabled {
            background: ${theme.colors.gray[300]};
            border-color: ${theme.colors.gray[300]};
            color: ${theme.colors.gray[500]};
            cursor: not-allowed;
          }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.white};
          color: ${theme.colors.gray[700]};
          border-color: ${theme.colors.gray[300]};

          &:hover:not(:disabled) {
            background: ${theme.colors.gray[50]};
          }
        `;
      default:
        return '';
    }
  }}
`;

// Validation Schema
const validationSchema = yup.object().shape({
  detail: yup
    .string()
    .required('Please describe your suggestion')
    .min(10, 'Suggestion must be at least 10 characters long')
    .max(1000, 'Suggestion cannot exceed 1000 characters'),
});

interface SuggestionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: SuggestionFormData) => Promise<void>;
}

const SuggestionForm: React.FC<SuggestionFormProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<SuggestionFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      detail: ''
    }
  });

  const detailValue = watch('detail');
  const characterCount = detailValue?.length || 0;
  const maxCharacters = 1000;
  const isOverLimit = characterCount > maxCharacters;

  const handleFormSubmit = async (data: SuggestionFormData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error('Error submitting suggestion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClick={handleModalClick}>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>
            <HiLightBulb size={20} />
            Share Your Idea
          </ModalTitle>
          <CloseButton onClick={handleClose} disabled={isSubmitting}>
            <FiX size={18} />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <InfoBox>
            <InfoTitle>💡 What makes a great suggestion?</InfoTitle>
            <InfoText>
              • Be specific and clear about your idea<br />
              • Explain how it would benefit the community<br />
              • Consider practical aspects and feasibility<br />
              • Keep it constructive and positive
            </InfoText>
          </InfoBox>

          <Form onSubmit={handleSubmit(handleFormSubmit)}>
            <FormSection>
              <Label>
                Your Suggestion
                <RequiredAsterisk>*</RequiredAsterisk>
              </Label>
              <TextArea
                {...register('detail')}
                placeholder="Share your idea to improve our community... What changes or additions would you like to see? How would this benefit residents?"
                hasError={!!errors.detail}
                disabled={isSubmitting}
              />
              <CharacterCount isOver={isOverLimit}>
                {characterCount}/{maxCharacters} characters
              </CharacterCount>
              {errors.detail && (
                <ErrorMessage>{errors.detail.message}</ErrorMessage>
              )}
            </FormSection>
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isSubmitting || isOverLimit}
          >
            <FiSend size={16} />
            {isSubmitting ? 'Submitting...' : 'Share Idea'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SuggestionForm;