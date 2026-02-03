import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function RoleRoute({ allow = [], children }) {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);
  const location = useLocation();

  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!allow.includes(role)) return <Navigate to="/unauthorized" replace />;

  return children;
}
