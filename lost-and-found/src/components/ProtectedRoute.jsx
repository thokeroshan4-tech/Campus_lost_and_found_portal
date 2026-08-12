import { Navigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { useAuth } from "../lib/AuthContext";

export default function ProtectedRoute({ children }) {
  const { status, simulateAdminApproval } = useAuth();

  if (status === "loggedOut") {
    return <Navigate to="/auth" replace />;
  }

  if (status === "pending") {
    return (
      <div className="max-w-sm mx-auto px-5 py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-status-pending-bg flex items-center justify-center mx-auto">
          <Clock size={24} className="text-status-pending" />
        </div>
        <h1 className="font-display text-xl mt-5">Still waiting for approval</h1>
        <p className="text-muted text-sm mt-2 leading-relaxed">
          You can't use the site yet — an admin needs to verify your ID card photo first.
        </p>
        <button
          onClick={simulateAdminApproval}
          className="mt-6 text-xs text-faint underline decoration-dotted hover:text-teal"
        >
          (demo only) simulate admin approval
        </button>
      </div>
    );
  }

  return children;
}
