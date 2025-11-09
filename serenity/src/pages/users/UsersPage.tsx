import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const Placeholder = styled.div`
  background: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[12]};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.boxShadow.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  text-align: center;
`;

const PlaceholderText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ComingSoonBadge = styled.span`
  display: inline-block;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[700]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const UsersPage: React.FC = () => {
  return (
    <Container>
      <Title>Users Management</Title>
      <Placeholder>
        <PlaceholderText>
          This page will contain user management features including:
        </PlaceholderText>
        <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
          <li>User listing with search and filters</li>
          <li>Add, edit, and delete users</li>
          <li>Role management</li>
          <li>User activity tracking</li>
          <li>Bulk operations</li>
          <li>User import/export</li>
        </ul>
        <div style={{ marginTop: '2rem' }}>
          <ComingSoonBadge>Coming Soon</ComingSoonBadge>
        </div>
      </Placeholder>
    </Container>
  );
};

export default UsersPage;
