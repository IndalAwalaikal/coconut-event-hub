import { useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import {
  Monitor,
  CalendarDays,
  Users,
  LogOut,
  LayoutDashboard,
  Sparkles,
  Image as ImageIcon,
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

  useEffect(() => {
    // Check for JWT token presence and validate it with the backend.
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
          // token invalid or expired
          localStorage.removeItem("admin_token");
          localStorage.removeItem("coconut-admin");
          navigate("/admin/login");
        }
      } catch (e) {
        // network or other error — redirect to login as safe default
        localStorage.removeItem("admin_token");
        localStorage.removeItem("coconut-admin");
        navigate("/admin/login");
      }
    };
    validate();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("coconut-admin");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden md:flex md:fixed md:top-0 md:left-0 md:h-screen md:z-50 w-72 flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0d2847] to-[#1e3a5f]">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0yNCA0MGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTYiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -left-20 top-20 h-64 w-64 rounded-full bg-gradient-to-r from-[#3b82f6]/20 to-[#60a5fa]/20 blur-3xl animate-pulse"
            style={{ boxShadow: "0 0 100px 50px rgba(59, 130, 246, 0.2)" }}
          />
          <div
            className="absolute -right-20 top-1/2 h-64 w-64 rounded-full bg-gradient-to-l from-[#0ea5e9]/20 to-[#38bdf8]/20 blur-3xl animate-pulse"
            style={{
              animationDelay: "1s",
              boxShadow: "0 0 100px 50px rgba(14, 165, 233, 0.2)",
            }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-20 h-64 w-64 rounded-full bg-gradient-to-t from-[#2563eb]/20 to-[#60a5fa]/20 blur-3xl animate-pulse"
            style={{
              animationDelay: "2s",
              boxShadow: "0 0 100px 50px rgba(37, 99, 235, 0.2)",
            }}
          />
        </div>

        <div className="relative border-b border-white/10 p-6 backdrop-blur-sm">
          <Link
            to="/"
            className="group flex flex-col items-center gap-2 transition-all hover:scale-105"
          >
            <div className="relative">
              <img
                src="/logo.png"
                alt="COCONUT CC"
                className="relative h-20 w-auto object-contain transition-all duration-300 group-hover:scale-110"
                style={{
                  filter:
                    "drop-shadow(0 0 12px rgba(96, 165, 250, 0.4)) drop-shadow(0 0 6px rgba(255, 255, 255, 0.2))",
                }}
              />
            </div>

            <div className="text-center">
              <span className="text-xl font-bold text-gray-300 group-hover:text-white transition-colors tracking-wide">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        <nav className="relative flex-1 space-y-2 p-4">
          {sidebarLinks.map((link, idx) => (
            <Link
              key={link.to}
              to={link.to}
              className={`group relative flex items-center gap-4 rounded-2xl px-5 py-4 text-sm font-semibold transition-all duration-300 overflow-hidden ${
                location.pathname === link.to
                  ? "text-white"
                  : "text-gray-300 hover:text-white"
              }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {location.pathname === link.to && (
                <>
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] rounded-2xl"
                    style={{
                      boxShadow:
                        "0 0 30px rgba(59, 130, 246, 0.5), 0 10px 30px rgba(0, 0, 0, 0.3)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </>
              )}

              {location.pathname !== link.to && (
                <div
                  className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)" }}
                />
              )}

              {location.pathname === link.to && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-3/4 w-1.5 rounded-r-full bg-gradient-to-b from-[#60a5fa] to-[#38bdf8]"
                  style={{ boxShadow: "0 0 10px rgba(96, 165, 250, 0.8)" }}
                />
              )}

              <div
                className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 z-10 ${
                  location.pathname === link.to
                    ? "bg-white/20 text-white scale-110"
                    : "bg-white/5 text-gray-400 group-hover:bg-white/10 group-hover:text-white group-hover:scale-110"
                }`}
                style={
                  location.pathname === link.to
                    ? {
                        boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
                      }
                    : {}
                }
              >
                <link.icon className="h-5 w-5" />
              </div>

              <span className="relative z-10 tracking-wide">{link.label}</span>

              {location.pathname !== link.to && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#60a5fa]/0 group-hover:bg-[#60a5fa]/20 blur-xl transition-all duration-500" />
              )}
            </Link>
          ))}
        </nav>

        <div className="relative border-t border-white/10 p-4 backdrop-blur-sm">
          <Button
            onClick={handleLogout}
            className="group relative w-full justify-start gap-4 rounded-2xl bg-white/5 px-5 py-4 text-gray-300 hover:text-white transition-all duration-300 border-0 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-red-600/0 group-hover:from-red-500/20 group-hover:to-red-600/20 transition-all duration-300 rounded-2xl" />

            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: "0 0 30px rgba(239, 68, 68, 0.3)" }}
            />

            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-gray-400 group-hover:bg-red-500/20 group-hover:text-red-400 transition-all duration-300 group-hover:scale-110 z-10">
              <LogOut className="h-5 w-5" />
            </div>

            <span className="relative font-semibold tracking-wide z-10">
              Logout
            </span>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </Button>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3b82f6] via-[#60a5fa] to-[#0ea5e9]"
          style={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
        />
      </aside>

      <div className="flex flex-1 flex-col md:ml-72">
        <header className="border-b border-gray-200 bg-gradient-to-r from-[#0a1628] via-[#0d2847] to-[#1e3a5f] p-4 md:hidden relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0yNCA0MGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTYiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />

          <div className="flex items-center justify-between relative z-10">
            <Link to="/" className="flex items-center gap-2">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] shadow-lg"
                style={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
              >
                <Monitor className="h-5 w-5 text-white" />
              </div>
              <div
                className="font-display text-base font-bold"
                style={{ textShadow: "0 0 15px rgba(96, 165, 250, 0.5)" }}
              >
                <span className="bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] bg-clip-text text-transparent">
                  COCONUT Admin
                </span>
              </div>
            </Link>

            <div className="flex gap-2">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${
                    location.pathname === link.to
                      ? "bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white shadow-lg scale-110"
                      : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                  }`}
                  style={
                    location.pathname === link.to
                      ? {
                          boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
                        }
                      : {}
                  }
                >
                  <link.icon className="h-5 w-5" />
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-gray-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
