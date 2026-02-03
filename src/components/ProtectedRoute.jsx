import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((s) => s.token);
  const location = useLocation();

  // ✅ Keep logs INSIDE the component only
  console.log("token in ProtectedRoute:", token);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
