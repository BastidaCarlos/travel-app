import { Navigate, useLocation, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

function ProtectedRoute({ requireAdmin = false }) {
    const { user, authLoading } = useAuth();
    const location = useLocation();
    
    if (authLoading) {
       return (
        <LoadingSpinner />
       ) 
    }

    if (!user) {
      return <Navigate to="/login" state={{ from: location }} replace />  
    }

    if (requireAdmin && user.role !== 'admin') {
       return <Navigate to="/" replace /> 
    }
    
    return <Outlet />
}

export default ProtectedRoute;