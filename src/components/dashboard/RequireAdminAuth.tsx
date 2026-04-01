import { StorageKeys } from '@/types/generalTypes';
import { Navigate, useLocation } from 'react-router-dom';

interface RequireAdminAuthProps {
  children: JSX.Element;
}

const RequireAdminAuth = ({ children }: RequireAdminAuthProps) => {
  const location = useLocation();
  const token = localStorage.getItem(StorageKeys.token);

  if (!token) {
    return <Navigate to="/dashboard/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAdminAuth;
