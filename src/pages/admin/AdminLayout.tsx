import { useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { Monitor, CalendarDays, Users, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { label: "Dashboard", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Kelola Event", to: "/admin/events", icon: CalendarDays },
  { label: "Data Pendaftar", to: "/admin/registrants", icon: Users },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem("coconut-admin")) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("coconut-admin");
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-card md:flex">
        <div className="flex items-center gap-2 border-b p-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Monitor className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold">COCONUT Admin</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {sidebarLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-3">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-card p-4 md:hidden">
          <span className="font-display font-bold">COCONUT Admin</span>
          <div className="flex gap-2">
            {sidebarLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-lg p-2 ${location.pathname === link.to ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
              >
                <link.icon className="h-5 w-5" />
              </Link>
            ))}
            <button onClick={handleLogout} className="rounded-lg p-2 text-muted-foreground">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>
        <main className="flex-1 bg-background p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
