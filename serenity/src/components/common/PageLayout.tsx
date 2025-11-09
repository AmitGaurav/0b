import styled from 'styled-components';

// Standard page container matching User Profile design
export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[4]};
`;

// Standard page header
export const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

// Standard page title
export const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// Standard page subtitle
export const PageSubtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  max-width: 800px;
`;

// Standard content card
export const ContentCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[8]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

// Standard section within cards
export const CardSection = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

// Standard section title
export const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  padding-bottom: ${({ theme }) => theme.spacing[2]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary[200]};
`;

// Standard grid layout
export const ContentGrid = styled.div<{ columns?: string }>`
  display: grid;
  grid-template-columns: ${({ columns }) => columns || 'repeat(auto-fit, minmax(350px, 1fr))'};
  gap: ${({ theme }) => theme.spacing[6]};
`;

// Standard stats grid
export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

// Standard stat card
export const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  transition: ${({ theme }) => theme.transition.all};

  &:hover {
    box-shadow: ${({ theme }) => theme.boxShadow.md};
    transform: translateY(-2px);
  }
`;

// Standard stat header
export const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

// Standard stat label
export const StatLabel = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// Standard stat icon
export const StatIcon = styled.div<{ color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ color, theme }) => color || theme.colors.primary[500]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.white};
  font-size: 1.5rem;
`;

// Standard stat value
export const StatValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

// Standard stat change indicator
export const StatChange = styled.div<{ positive?: boolean }>`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ positive, theme }) => 
    positive ? theme.colors.success[600] : theme.colors.error[600]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

// Standard button styles
export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' | 'success' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transition.all};

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${props.theme.colors.primary[600]};
          color: ${props.theme.colors.white};
          border: 1px solid ${props.theme.colors.primary[600]};
          &:hover {
            background: ${props.theme.colors.primary[700]};
            border-color: ${props.theme.colors.primary[700]};
          }
        `;
      case 'secondary':
        return `
          background: ${props.theme.colors.white};
          color: ${props.theme.colors.gray[700]};
          border: 1px solid ${props.theme.colors.gray[300]};
          &:hover {
            background: ${props.theme.colors.gray[50]};
            border-color: ${props.theme.colors.gray[400]};
          }
        `;
      case 'danger':
        return `
          background: ${props.theme.colors.error[600]};
          color: ${props.theme.colors.white};
          border: 1px solid ${props.theme.colors.error[600]};
          &:hover {
            background: ${props.theme.colors.error[700]};
            border-color: ${props.theme.colors.error[700]};
          }
        `;
      case 'success':
        return `
          background: ${props.theme.colors.success[600]};
          color: ${props.theme.colors.white};
          border: 1px solid ${props.theme.colors.success[600]};
          &:hover {
            background: ${props.theme.colors.success[700]};
            border-color: ${props.theme.colors.success[700]};
          }
        `;
      default:
        return `
          background: ${props.theme.colors.white};
          color: ${props.theme.colors.primary[600]};
          border: 1px solid ${props.theme.colors.primary[300]};
          &:hover {
            background: ${props.theme.colors.primary[50]};
            border-color: ${props.theme.colors.primary[400]};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${({ theme }) => theme.colors.gray[300]};
    border-color: ${({ theme }) => theme.colors.gray[300]};
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

// Standard form elements
export const FormField = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FormLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const FormInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  transition: ${({ theme }) => theme.transition.colors};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
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

// Standard table styles
export const TableContainer = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: ${({ theme }) => theme.spacing[4]};
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  }
  
  th {
    background: ${({ theme }) => theme.colors.gray[50]};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[700]};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    text-transform: uppercase;
    letter-spacing: 0.05em;
    
    &:hover {
      background: ${({ theme }) => theme.colors.gray[100]};
    }
  }
  
  tbody tr:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }
  
  tbody tr:last-child td {
    border-bottom: none;
  }
`;

// Standard loading spinner
export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[16]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  
  .spinner {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.primary[500]};
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Standard empty state
export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[16]} ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  
  .icon {
    font-size: 4rem;
    color: ${({ theme }) => theme.colors.gray[400]};
    margin-bottom: ${({ theme }) => theme.spacing[6]};
  }
  
  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray[900]};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
  
  p {
    color: ${({ theme }) => theme.colors.gray[600]};
    margin-bottom: ${({ theme }) => theme.spacing[6]};
  }
`;

// Standard badge components
export const Badge = styled.span<{ 
  variant?: 'success' | 'error' | 'warning' | 'info' | 'default' 
}>`
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${props => {
    switch (props.variant) {
      case 'success':
        return `
          background: ${props.theme.colors.success[100]};
          color: ${props.theme.colors.success[700]};
        `;
      case 'error':
        return `
          background: ${props.theme.colors.error[100]};
          color: ${props.theme.colors.error[700]};
        `;
      case 'warning':
        return `
          background: ${props.theme.colors.warning[100]};
          color: ${props.theme.colors.warning[700]};
        `;
      case 'info':
        return `
          background: ${props.theme.colors.primary[100]};
          color: ${props.theme.colors.primary[700]};
        `;
      default:
        return `
          background: ${props.theme.colors.gray[100]};
          color: ${props.theme.colors.gray[700]};
        `;
    }
  }}
`;