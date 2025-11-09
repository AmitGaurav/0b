import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import SocietySelectionModal from '../modals/SocietySelectionModal';

interface SocietySelectionWrapperProps {
  children: React.ReactNode;
}

const SocietySelectionWrapper: React.FC<SocietySelectionWrapperProps> = ({ children }) => {
  const { 
    needsSocietySelection, 
    user, 
    selectSociety, 
    getUserSocieties 
  } = useAuth();

  const handleSocietySelect = async (societyId: number) => {
    try {
      await selectSociety(societyId);
    } catch (error) {
      console.error('Failed to select society:', error);
      // You could show an error toast here
    }
  };

  return (
    <>
      {children}
      <SocietySelectionModal
        isOpen={needsSocietySelection}
        societies={getUserSocieties()}
        userName={user?.name || 'User'}
        onSelectSociety={handleSocietySelect}
      />
    </>
  );
};

export default SocietySelectionWrapper;