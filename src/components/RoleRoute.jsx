import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function RoleRoute({ allow = [], children }) {
  const role = useAuthStore((s) => s.role);
  const location = useLocation();

  if (!role) {
    return <Navigate to="/employee/login" replace />;
  }

  if (!allow.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}