import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();

  if (!token) {
    const loginPath = location.pathname.startsWith("/admin")
      ? "/admin/login"
      : "/employee/login";

    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return children;
}