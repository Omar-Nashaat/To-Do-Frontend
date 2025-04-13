import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';
import { IJwtCustomPayload } from '../interfaces/Auth';

interface IProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: IProtectedRouteProps) => {
  const userToken = localStorage.getItem('token');
  
  if (!userToken) {
    toast.error('Please login first', {
      duration: 2000,
      position: 'top-center',
    });
    return <Navigate to="/login" replace />;
  }

  try {
    // Verify token expiration
    const decoded = jwtDecode<IJwtCustomPayload>(userToken);
    const currentTime = Date.now() / 1000;
    
    if (decoded.exp && decoded.exp < currentTime) {
      localStorage.removeItem('token');
      toast.error('Session expired, please login again', {
        duration: 2000,
        position: 'top-center',
      });
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    localStorage.removeItem('token');
    toast.error('Invalid session, please login again', {
      duration: 2000,
      position: 'top-center',
    });
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
