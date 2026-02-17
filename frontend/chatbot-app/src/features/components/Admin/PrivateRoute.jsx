
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  
  if (loading) {
    return <div className="text-center mt-10">Checking authentication...</div>;
  }

  
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }


  return <Outlet />;
};

export default PrivateRoute;
