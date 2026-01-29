import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function ProtectedRoute({ allow =[], children }) {
  const role = useAuthStore((s) => s.role);
  if (!role) return <Navigate to="/login" replace />;
  if (allow.length > 0 && !allow.includes(role)) return <Navigate to="/unauthorized" replace />;
  return children;
}
