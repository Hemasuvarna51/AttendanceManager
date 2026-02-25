import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function RoleRoute({ allow = [], children }) {
  const role = useAuthStore((s) => s.role);
  const token = useAuthStore((s) => s.token);
  const location = useLocation();

  console.log("RoleRoute debug:", { token, role, allow, path: location.pathname });

  // ✅ if not logged in → login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ if role missing → login (hydration edge case)
  if (!role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ wrong role → unauthorized
  if (!allow.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}