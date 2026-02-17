import { useEffect, useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Monitor,
  CalendarDays,
  Users,
  LogOut,
  LayoutDashboard,
  Sparkles,
  Image as ImageIcon,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Kelola Event", to: "/admin/events", icon: CalendarDays },
  { label: "Data Pendaftar", to: "/admin/registrants", icon: Users },
  { label: "Dokumentasi", to: "/admin/documentations", icon: ImageIcon },
  { label: "Posters", to: "/admin/posters", icon: Sparkles },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const validate = async () => {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        navigate("/admin/login");
        return;
      }
      try {
        const API = import.meta.env.VITE_API_URL || "";
        const res = await fetch(`${API}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("coconut-admin");
          navigate("/admin/login");
        }
      } catch (e) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("coconut-admin");
        navigate("/admin/login");
      }
    };
    validate();
  }, [navigate]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("coconut-admin");
    localStorage.removeItem("admin_token");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ── Mobile Overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-50 w-72 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d2847] to-[#1e3a5f]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0yNCA0MGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTYiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        </div>

        {/* Glow Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-gradient-to-r from-[#3b82f6]/20 to-[#60a5fa]/20 blur-3xl animate-pulse" />
          <div
            className="absolute -right-20 top-1/2 h-64 w-64 rounded-full bg-gradient-to-l from-[#0ea5e9]/20 to-[#38bdf8]/20 blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Logo */}
        <div className="relative border-b border-white/10 p-5 backdrop-blur-sm flex items-center justify-between">
          <Link
            to="/"
            className="group flex items-center gap-3 transition-all hover:scale-105"
          >
            <img
              src="/logo.png"
              alt="COCONUT CC"
              className="h-12 w-auto object-contain transition-all duration-300 group-hover:scale-110"
              style={{ filter: "drop-shadow(0 0 12px rgba(96,165,250,0.4))" }}
            />
            <span className="text-lg font-bold text-gray-300 group-hover:text-white transition-colors tracking-wide">
              Admin Panel
            </span>
          </Link>
          {/* Close button (mobile only) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="relative flex-1 space-y-1 p-4 overflow-y-auto">
          {sidebarLinks.map((link, idx) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  group relative flex items-center gap-4 rounded-2xl px-5 py-3.5 text-sm font-semibold
                  transition-all duration-300 overflow-hidden
                  ${isActive ? "text-white" : "text-gray-300 hover:text-white"}
                `}
              >
                {isActive && (
                  <>
                    <div
                      className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] rounded-2xl"
                      style={{
                        boxShadow:
                          "0 0 30px rgba(59,130,246,0.5), 0 10px 30px rgba(0,0,0,0.3)",
                      }}
                    />
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 h-3/4 w-1.5 rounded-r-full bg-gradient-to-b from-[#60a5fa] to-[#38bdf8]"
                      style={{ boxShadow: "0 0 10px rgba(96,165,250,0.8)" }}
                    />
                  </>
                )}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                )}

                <div
                  className={`
                  relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300 z-10
                  ${isActive ? "bg-white/20 text-white scale-110" : "bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white group-hover:scale-110"}
                `}
                >
                  <link.icon className="h-4 w-4" />
                </div>
                <span className="relative z-10 tracking-wide">
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="relative border-t border-white/10 p-4 backdrop-blur-sm">
          <Button
            onClick={handleLogout}
            className="group relative w-full justify-start gap-4 rounded-2xl bg-white/5 px-5 py-3.5 text-gray-300 hover:text-white transition-all duration-300 border-0 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-600/0 group-hover:from-red-500/20 group-hover:to-red-600/20 transition-all duration-300 rounded-2xl" />
            <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 text-gray-400 group-hover:bg-red-500/20 group-hover:text-red-400 transition-all duration-300 group-hover:scale-110 z-10">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="relative font-semibold tracking-wide z-10">
              Logout
            </span>
          </Button>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3b82f6] via-[#60a5fa] to-[#0ea5e9]"
          style={{ boxShadow: "0 0 20px rgba(59,130,246,0.5)" }}
        />
      </aside>

      {/* ── Main Content ── */}
      <div className="flex flex-1 flex-col min-w-0 md:ml-72">
        {/* Top Header (always visible) */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-gradient-to-r from-[#0a1628] via-[#0d2847] to-[#1e3a5f] px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Hamburger (mobile/tablet) */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white transition-all"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Logo text (mobile) */}
            <Link to="/" className="md:hidden flex items-center gap-2">
              <img
                src="/logo.png"
                alt="COCONUT"
                className="h-8 w-auto"
                style={{ filter: "drop-shadow(0 0 8px rgba(96,165,250,0.4))" }}
              />
              <span className="font-bold text-sm bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] bg-clip-text text-transparent">
                COCONUT Admin
              </span>
            </Link>

            {/* Breadcrumb / Active page (desktop) */}
            <div className="hidden md:flex items-center gap-2">
              {sidebarLinks.map((link) =>
                location.pathname === link.to ? (
                  <div key={link.to} className="flex items-center gap-2">
                    <link.icon className="h-4 w-4 text-[#60a5fa]" />
                    <span className="text-sm font-semibold text-white">
                      {link.label}
                    </span>
                  </div>
                ) : null,
              )}
            </div>

            <div className="ml-auto hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20">
              <div className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-xs font-medium text-white">
                System Active
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
