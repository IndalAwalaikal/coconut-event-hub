import {
  CalendarDays,
  Users,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Activity,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// stats will be loaded from backend
const AdminDashboard = () => {
  const API = import.meta.env.VITE_API_URL || "";
  const [dashboard, setDashboard] = useState<{
    totalEvents: number;
    activeEvents: number;
    totalRegistrants: number;
  } | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("admin_token");
      try {
        const res = await fetch(`${API}/api/admin/dashboard`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (res.ok) {
          const data = await res.json();
          setDashboard(data);
        }
      } catch (err) {
        console.warn(err);
      }
    };
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API}/api/events`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setEvents(data);
        }
      } catch (err) {
        console.warn(err);
      }
    };
    fetchDashboard();
    fetchEvents();
  }, [API]);

  const stats = [
    {
      label: "Total Event",
      value: dashboard?.totalEvents ?? 0,
      icon: CalendarDays,
      gradient: "from-[#3b82f6] to-[#2563eb]",
      bgGradient: "from-[#3b82f6]/10 to-[#2563eb]/10",
      change: "+12%",
      changeType: "increase",
    },
    {
      label: "Event Aktif",
      value: dashboard?.activeEvents ?? 0,
      icon: CheckCircle,
      gradient: "from-[#10b981] to-[#059669]",
      bgGradient: "from-[#10b981]/10 to-[#059669]/10",
      change: "+8%",
      changeType: "increase",
    },
    {
      label: "Total Pendaftar",
      value: dashboard?.totalRegistrants ?? 0,
      icon: Users,
      gradient: "from-[#8b5cf6] to-[#7c3aed]",
      bgGradient: "from-[#8b5cf6]/10 to-[#7c3aed]/10",
      change: "+23%",
      changeType: "increase",
    },
    {
      label: "Event Mendatang",
      value: events.filter((e) => new Date(e.date) > new Date()).length,
      icon: Clock,
      gradient: "from-[#f59e0b] to-[#d97706]",
      bgGradient: "from-[#f59e0b]/10 to-[#d97706]/10",
      change: "+5%",
      changeType: "increase",
    },
  ];

  // Calculate event distribution by category from fetched events
  const categoryDistribution: Record<string, number> = (events || []).reduce(
    (acc: Record<string, number>, event: any) => {
      const label = event?.categoryLabel || "Uncategorized";
      acc[label] = (acc[label] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const categoryStats = Object.entries(categoryDistribution).map(
    ([name, count]: [string, number]) => ({
      name,
      count,
      percentage: Math.round((Number(count) / (events.length || 1)) * 100),
    }),
  );

  const recentRegistrants: any[] = []; // available via admin registrations endpoint per-event
  const upcomingEvents = events
    .filter((e) => new Date(e.date) > new Date() && e.available)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1628] via-[#0d2847] to-[#1e3a5f] p-8 md:p-10">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0yNCA0MGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTYiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />

        {/* Glowing Orbs */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#3b82f6]/20 to-[#60a5fa]/20 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-gradient-to-br from-[#0ea5e9]/20 to-[#38bdf8]/20 blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles
                  className="h-5 w-5 text-[#60a5fa]"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(96, 165, 250, 0.6))",
                  }}
                />
                <span className="text-sm font-semibold text-[#60a5fa]">
                  Admin Dashboard
                </span>
              </div>
              <h1
                className="font-display text-3xl md:text-4xl font-bold text-white mb-2"
                style={{ textShadow: "0 0 30px rgba(255, 255, 255, 0.3)" }}
              >
                Selamat Datang Kembali! 👋
              </h1>
              <p className="text-gray-300 text-base max-w-2xl">
                Kelola semua event dan data pendaftar COCONUT Computer Club
                dengan mudah
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <Activity className="h-4 w-4 text-[#10b981]" />
              <span className="text-sm font-medium text-white">
                System Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{
              animationDelay: `${idx * 0.1}s`,
            }}
          >
            {/* Gradient Background on Hover */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />

            {/* Glow Effect on Hover */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ boxShadow: "0 0 40px rgba(59, 130, 246, 0.2)" }}
            />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>

                {/* Change Indicator */}
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                    stat.changeType === "increase"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-semibold">{stat.change}</span>
                </div>
              </div>

              {/* Value */}
              <div className="space-y-1">
                <p
                  className={`font-display text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                >
                  {stat.value}
                </p>
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
              </div>
            </div>

            {/* Corner Decoration */}
            <div
              className={`absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-gradient-to-br ${stat.gradient} opacity-0 blur-2xl group-hover:opacity-20 transition-opacity duration-300`}
            />
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Event Terbaru - Takes 2 columns */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-bold bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] bg-clip-text text-transparent">
                Event Terbaru
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Daftar event yang baru dibuat
              </p>
            </div>
            <Link
              to="/admin/events"
              className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3b82f6]/10 to-[#2563eb]/10 text-[#2563eb] hover:from-[#3b82f6]/20 hover:to-[#2563eb]/20 transition-all duration-300"
            >
              <span className="text-sm font-semibold">Lihat Semua</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-3">
            {events.slice(0, 5).map((event, idx) => (
              <div
                key={event.id}
                className="group flex items-center justify-between rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-[#3b82f6]/5 hover:to-[#2563eb]/5 px-5 py-4 transition-all duration-300 hover:shadow-md border border-transparent hover:border-[#3b82f6]/20"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Event Icon */}
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CalendarDays className="h-5 w-5" />
                  </div>

                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate group-hover:text-[#2563eb] transition-colors">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium text-[#2563eb] bg-[#3b82f6]/10 px-2 py-0.5 rounded-full">
                        {event.categoryLabel}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                    event.available
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      event.available ? "bg-emerald-500" : "bg-gray-500"
                    }`}
                  />
                  {event.available ? "Aktif" : "Belum Tersedia"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Event Mendatang */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#d97706]">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-display text-base font-bold text-gray-900">
                Event Mendatang
              </h3>
            </div>

            <div className="space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-xl bg-gradient-to-r from-[#f59e0b]/5 to-[#d97706]/5 border border-[#f59e0b]/20"
                  >
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(event.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  Tidak ada event mendatang
                </p>
              )}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]">
                <Activity className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-display text-base font-bold text-gray-900">
                Kategori Event
              </h3>
            </div>

            <div className="space-y-3">
              {categoryStats.map((category, idx) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      {category.name}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {category.count}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] transition-all duration-500"
                      style={{
                        width: `${category.percentage}%`,
                        animationDelay: `${idx * 0.1}s`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-[#3b82f6]/5 to-[#2563eb]/5 p-6 shadow-sm">
            <h3 className="font-display text-base font-bold text-gray-900 mb-4">
              Quick Actions
            </h3>

            <div className="space-y-2">
              <Link
                to="/admin/events"
                className="group flex items-center justify-between p-3 rounded-xl bg-white hover:bg-gradient-to-r hover:from-[#3b82f6] hover:to-[#2563eb] transition-all duration-300 hover:shadow-lg"
              >
                <span className="text-sm font-semibold text-gray-700 group-hover:text-white transition-colors">
                  Kelola Event
                </span>
                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </Link>

              <Link
                to="/admin/registrants"
                className="group flex items-center justify-between p-3 rounded-xl bg-white hover:bg-gradient-to-r hover:from-[#3b82f6] hover:to-[#2563eb] transition-all duration-300 hover:shadow-lg"
              >
                <span className="text-sm font-semibold text-gray-700 group-hover:text-white transition-colors">
                  Lihat Pendaftar
                </span>
                <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Pendaftar Terbaru - Full Width */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] bg-clip-text text-transparent">
              Pendaftar Terbaru
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              5 pendaftar terakhir yang mendaftar
            </p>
          </div>
          <Link
            to="/admin/registrants"
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#3b82f6]/10 to-[#2563eb]/10 text-[#2563eb] hover:from-[#3b82f6]/20 hover:to-[#2563eb]/20 transition-all duration-300"
          >
            <span className="text-sm font-semibold">Lihat Semua</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nama
                </th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  WhatsApp
                </th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Asal Instansi
                </th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Event
                </th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tanggal Daftar
                </th>
                <th className="pb-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentRegistrants.map((registrant) => {
                const event = events.find((e) => e.id === registrant.eventId);
                return (
                  <tr
                    key={registrant.id}
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white font-semibold text-sm">
                          {registrant.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">
                          {registrant.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {registrant.whatsapp}
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {registrant.institution}
                    </td>
                    <td className="py-4">
                      <span className="text-sm font-medium text-[#2563eb] bg-[#3b82f6]/10 px-3 py-1 rounded-full">
                        {event?.title}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {new Date(registrant.registeredAt).toLocaleDateString(
                        "id-ID",
                      )}
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Terdaftar
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
