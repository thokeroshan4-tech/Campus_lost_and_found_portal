import { NavLink, useNavigate } from "react-router-dom";
import { ShieldCheck, Search, PlusCircle, LayoutDashboard, ShieldAlert } from "lucide-react";
import { useAuth } from "../lib/AuthContext";

const links = [
  { to: "/browse", label: "Browse", icon: Search },
  { to: "/report", label: "Report", icon: PlusCircle },
  { to: "/dashboard", label: "My Dashboard", icon: LayoutDashboard },
];

export default function Navbar() {
  const { logout, role, toggleDemoRole } = useAuth();
  const navigate = useNavigate();

  const navLinks = role === "admin"
    ? [...links, { to: "/admin", label: "Admin", icon: ShieldAlert }]
    : links;

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <NavLink to="/browse" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-teal flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={16} color="#fff" strokeWidth={2.25} />
          </span>
          <span className="font-display text-[15px] tracking-tight hidden sm:block">
            Campus Lost &amp; Found
          </span>
        </NavLink>

        <nav className="flex items-center gap-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive ? "bg-teal-tint text-teal-deep" : "text-muted hover:bg-paper"
                }`
              }
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Demo only — lets you preview the Admin dashboard without a real backend.
              Remove this button once login returns a real role from the server. */}
          <button
            onClick={toggleDemoRole}
            title="Demo only: switch between user/admin view"
            className="hidden md:block text-[11px] text-faint underline decoration-dotted hover:text-teal px-2"
          >
            demo: view as {role === "admin" ? "user" : "admin"}
          </button>

          <button
            onClick={() => { logout(); navigate("/auth"); }}
            title="Log out"
            className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center text-xs font-semibold font-mono hover:opacity-85 transition"
          >
            RS
          </button>
        </div>
      </div>
    </header>
  );
}
