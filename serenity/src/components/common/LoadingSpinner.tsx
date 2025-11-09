import React from 'react';
import styled, { keyframes, DefaultTheme } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div<{ fullScreen?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ fullScreen, theme }: { fullScreen?: boolean; theme: DefaultTheme }) => fullScreen ? `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    z-index: 9999;
  ` : `
    padding: ${theme.spacing[8]};
  `}
`;

const Spinner = styled.div<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border: 3px solid ${({ theme }) => theme.colors.gray[200]};
  border-top: 3px solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.p`
  margin-top: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: center;
`;

interface LoadingSpinnerProps {
  size?: number;
  fullScreen?: boolean;
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  fullScreen = false,
  message = 'Loading...',
}) => {
  return (
    <SpinnerContainer fullScreen={fullScreen}>
      <div>
        <Spinner size={size} />
        {message && <LoadingText>{message}</LoadingText>}
      </div>
    </SpinnerContainer>
  );
};

export default LoadingSpinner;
