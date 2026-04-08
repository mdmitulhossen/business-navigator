import { StorageKeys } from '@/types/generalTypes';
import { Navigate, useLocation } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
};

const RequirePortalAuth = ({ children }: Props) => {
  const location = useLocation();
  const token = localStorage.getItem(StorageKeys.portalToken);

  if (!token) {
    return <Navigate to="/portal/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default RequirePortalAuth;
