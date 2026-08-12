import { createContext, useContext, useState } from "react";

// STATUS: 'loggedOut' | 'pending' | 'approved'
// ROLE: 'user' | 'admin'  — kept separate from designation on purpose,
// so access-control logic only ever checks this one field.
// This is a stand-in for a real session (JWT + /me check against the backend).
// Nothing here persists on refresh — that's expected until the backend is wired up.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [status, setStatus] = useState("loggedOut");
  const [role, setRole] = useState("user");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    designation: "",
    campusId: "",
  });

  const login = (userEmail) => {
    setProfile((p) => ({ ...p, email: userEmail }));
    setStatus("approved"); // demo shortcut: real login only succeeds for already-approved users
  };

  const submitForReview = (data) => {
    setProfile(data);
    setStatus("pending");
  };

  // Demo-only: stands in for an admin clicking "approve" in the Admin dashboard.
  const simulateAdminApproval = () => setStatus("approved");

  // Demo-only: lets you preview the Admin dashboard without a real backend.
  // Remove once real login returns an actual role from the server.
  const toggleDemoRole = () => setRole((r) => (r === "admin" ? "user" : "admin"));

  const logout = () => {
    setStatus("loggedOut");
    setRole("user");
    setProfile({ name: "", email: "", designation: "", campusId: "" });
  };

  return (
    <AuthContext.Provider
      value={{
        status,
        role,
        profile,
        login,
        submitForReview,
        simulateAdminApproval,
        toggleDemoRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
