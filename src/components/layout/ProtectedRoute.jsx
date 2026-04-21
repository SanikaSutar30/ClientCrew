import { Navigate } from "react-router-dom";
import { getUserRole } from "../../utils/roleAccess";

function ProtectedRoute({ allowedRoles, children }) {
  const token = localStorage.getItem("token");
  const userRole = getUserRole();

  if (!token || !userRole) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
