import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";

// Requires BOTH a verified session (handled by ProtectedRoute upstream)
// AND role === "admin". Non-admins are redirected straight to their own
// dashboard — they never even see that /admin exists.
export default function AdminRoute({ children }) {
  const { role } = useAuth();

  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
