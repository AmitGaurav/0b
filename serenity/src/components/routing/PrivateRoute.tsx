import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Let the main loading spinner handle this
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
