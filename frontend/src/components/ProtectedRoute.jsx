import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
    const { user, isAdmin } = useAuth();
    const location = useLocation();

    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
    if (requiredRole === 'admin' && !isAdmin) return <Navigate to="/dashboard/user" replace />;
    if (requiredRole === 'user' && isAdmin) return <Navigate to="/dashboard/admin" replace />;

    return children;
};

export default ProtectedRoute;
