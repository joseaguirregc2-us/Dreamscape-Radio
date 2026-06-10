import React from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  // Bypassed completely to eliminate authentication as requested.
  // Directly returns the interactive workspace so users have immediate access.
  return <>{children}</>;
};
