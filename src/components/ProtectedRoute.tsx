import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

export const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className='app-loader-screen' role='status' aria-label='Loading'>
        <div className='app-loader-spinner' />
      </div>
    );
  if (!user) return <Navigate to='/login' replace />;

  return children;
};
