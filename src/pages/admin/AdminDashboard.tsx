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

const AdminDashboard = () => {
  const API = import.meta.env.VITE_API_URL || "";
  const [dashboard, setDashboard] = useState<{
    totalEvents: number;
    activeEvents: number;
    totalRegistrants: number;
  } | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [allRegistrants, setAllRegistrants] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("admin_token");
      try {
        const res = await fetch(`${API}/api/admin/dashboard`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (res.ok) setDashboard(await res.json());
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

  useEffect(() => {
    const fetchAllRegistrants = async () => {
      if (events.length === 0) return;
      const token = localStorage.getItem("admin_token");
      try {
        const promises = events.map(async (event) => {
          const res = await fetch(
            `${API}/api/admin/registrations?event_id=${event.id}`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            },
          );
          if (res.ok) {
            const data = await res.json();
            return Array.isArray(data) ? data : [];
          }
          return [];
        });
        const results = await Promise.all(promises);
        setAllRegistrants(([] as any[]).concat(...results));
      } catch (err) {
        console.warn(err);
      }
    };
    fetchAllRegistrants();
  }, [API, events]);

  const stats = [
    {
      label: "Total Event",
      value: dashboard?.totalEvents ?? 0,
      icon: CalendarDays,
      gradient: "from-[#3b82f6] to-[#2563eb]",
      bgGradient: "from-[#3b82f6]/10 to-[#2563eb]/10",
      change: "+12%",
    },
    {
      label: "Event Aktif",
      value: dashboard?.activeEvents ?? 0,
      icon: CheckCircle,
      gradient: "from-[#10b981] to-[#059669]",
      bgGradient: "from-[#10b981]/10 to-[#059669]/10",
      change: "+8%",
    },
    {
      label: "Total Pendaftar",
      value: dashboard?.totalRegistrants ?? 0,
      icon: Users,
      gradient: "from-[#8b5cf6] to-[#7c3aed]",
      bgGradient: "from-[#8b5cf6]/10 to-[#7c3aed]/10",
      change: "+23%",
    },
    {
      label: "Event Mendatang",
      value: events.filter((e) => new Date(e.date) > new Date()).length,
      icon: Clock,
      gradient: "from-[#f59e0b] to-[#d97706]",
      bgGradient: "from-[#f59e0b]/10 to-[#d97706]/10",
      change: "+5%",
    },
  ];

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

  const recentRegistrants = allRegistrants
    .sort(
      (a, b) =>
        new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime(),
    )
    .slice(0, 5);

  const upcomingEvents = events
    .filter((e) => new Date(e.date) > new Date() && e.available)
    .slice(0, 3);

  return (
    <div className="space-y-5 md:space-y-8">
      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#0a1628] via-[#0d2847] to-[#1e3a5f] p-5 sm:p-6 md:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0yNCA0MGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTYiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[#3b82f6]/20 to-[#60a5fa]/20 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-gradient-to-br from-[#0ea5e9]/20 to-[#38bdf8]/20 blur-3xl" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles
                  className="h-4 w-4 text-[#60a5fa]"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(96,165,250,0.6))",
                  }}
                />
                <span className="text-xs sm:text-sm font-semibold text-[#60a5fa]">
                  Admin Dashboard
                </span>
              </div>
              <h1
                className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2"
                style={{ textShadow: "0 0 30px rgba(255,255,255,0.3)" }}
              >
                Selamat Datang Kembali! 👋
              </h1>
              <p className="text-gray-300 text-sm sm:text-base max-w-2xl">
                Kelola semua event dan data pendaftar COCONUT Computer Club
                dengan mudah
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 self-start shrink-0">
              <Activity className="h-4 w-4 text-[#10b981]" />
              <span className="text-xs sm:text-sm font-medium text-white">
                System Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
        {stats.map((stat, idx) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-gray-200 p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div
                  className={`flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <stat.icon className="h-4 w-4 sm:h-6 sm:w-6" />
                </div>
                <div className="flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg bg-emerald-50 text-emerald-600">
                  <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <span className="text-[10px] sm:text-xs font-semibold">
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <p
                  className={`font-display text-2xl sm:text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                >
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Two Column Layout ── */}
      <div className="grid gap-5 md:gap-6 lg:grid-cols-3">
        {/* Event Terbaru - 2 cols */}
        <div className="lg:col-span-2 rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="font-display text-base sm:text-xl font-bold bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] bg-clip-text text-transparent">
                Event Terbaru
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                Daftar event yang baru dibuat
              </p>
            </div>
            <Link
              to="/admin/events"
              className="group flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#3b82f6]/10 to-[#2563eb]/10 text-[#2563eb] hover:from-[#3b82f6]/20 hover:to-[#2563eb]/20 transition-all duration-300"
            >
              <span className="text-xs sm:text-sm font-semibold">
                Lihat Semua
              </span>
              <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="group flex items-center justify-between rounded-lg sm:rounded-xl bg-gray-50 hover:bg-gradient-to-r hover:from-[#3b82f6]/5 hover:to-[#2563eb]/5 px-3 sm:px-5 py-3 sm:py-4 transition-all duration-300 hover:shadow-md border border-transparent hover:border-[#3b82f6]/20"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-9 w-9 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CalendarDays className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div className="flex-1 min-w-0 mr-2 sm:mr-4">
                    <p
                      className="font-semibold text-sm sm:text-base text-gray-900 truncate group-hover:text-[#2563eb] transition-colors"
                      title={event.title}
                    >
                      {event.title}
                    </p>
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 flex-wrap">
                      <span className="text-[10px] sm:text-xs font-medium text-[#2563eb] bg-[#3b82f6]/10 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">
                        {event.categoryLabel}
                      </span>
                      <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap hidden sm:inline">
                        {new Date(event.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold flex-shrink-0 ${event.available ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"}`}
                >
                  <div
                    className={`h-1.5 w-1.5 rounded-full hidden sm:block ${event.available ? "bg-emerald-500" : "bg-gray-500"}`}
                  />
                  {event.available ? "Aktif" : "Nonaktif"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Event Mendatang */}
          <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#d97706]">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
              </div>
              <h3 className="font-display text-sm sm:text-base font-bold text-gray-900">
                Event Mendatang
              </h3>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#f59e0b]/5 to-[#d97706]/5 border border-[#f59e0b]/20"
                  >
                    <p
                      className="text-xs sm:text-sm font-semibold text-gray-900 mb-0.5 sm:mb-1 truncate"
                      title={event.title}
                    >
                      {event.title}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600">
                      {new Date(event.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-xs sm:text-sm text-gray-500 text-center py-3 sm:py-4">
                  Tidak ada event mendatang
                </p>
              )}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed]">
                <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
              </div>
              <h3 className="font-display text-sm sm:text-base font-bold text-gray-900">
                Kategori Event
              </h3>
            </div>
            <div className="space-y-2.5 sm:space-y-3">
              {categoryStats.map((category, idx) => (
                <div key={category.name} className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-medium text-gray-700 truncate mr-2">
                      {category.name}
                    </span>
                    <span className="font-semibold text-gray-900 flex-shrink-0">
                      {category.count}
                    </span>
                  </div>
                  <div className="h-1.5 sm:h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb] transition-all duration-500"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-gradient-to-br from-[#3b82f6]/5 to-[#2563eb]/5 p-4 sm:p-6 shadow-sm">
            <h3 className="font-display text-sm sm:text-base font-bold text-gray-900 mb-3 sm:mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                to="/admin/events"
                className="group flex items-center justify-between p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white hover:bg-gradient-to-r hover:from-[#3b82f6] hover:to-[#2563eb] transition-all duration-300 hover:shadow-lg"
              >
                <span className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-white transition-colors">
                  Kelola Event
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 group-hover:text-white transition-colors" />
              </Link>
              <Link
                to="/admin/registrants"
                className="group flex items-center justify-between p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white hover:bg-gradient-to-r hover:from-[#3b82f6] hover:to-[#2563eb] transition-all duration-300 hover:shadow-lg"
              >
                <span className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-white transition-colors">
                  Lihat Pendaftar
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pendaftar Terbaru ── */}
      <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="font-display text-base sm:text-xl font-bold bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] bg-clip-text text-transparent">
              Pendaftar Terbaru
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              5 pendaftar terakhir yang mendaftar
            </p>
          </div>
          <Link
            to="/admin/registrants"
            className="group flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#3b82f6]/10 to-[#2563eb]/10 text-[#2563eb] hover:from-[#3b82f6]/20 hover:to-[#2563eb]/20 transition-all duration-300"
          >
            <span className="text-xs sm:text-sm font-semibold">
              Lihat Semua
            </span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          {recentRegistrants.length > 0 ? (
            <table className="w-full min-w-[540px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 px-4 sm:px-0 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="pb-3 px-4 sm:px-0 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                    WhatsApp
                  </th>
                  <th className="pb-3 px-4 sm:px-0 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                    Instansi
                  </th>
                  <th className="pb-3 px-4 sm:px-0 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="pb-3 px-4 sm:px-0 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                    Tanggal
                  </th>
                  <th className="pb-3 px-4 sm:px-0 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                      <td className="py-3 sm:py-4 px-4 sm:px-0">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white font-semibold text-xs sm:text-sm">
                            {registrant.name.charAt(0)}
                          </div>
                          <span className="font-medium text-xs sm:text-sm text-gray-900 truncate max-w-[80px] sm:max-w-none">
                            {registrant.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-0 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
                        {registrant.whatsapp}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-0 text-xs sm:text-sm text-gray-600 hidden md:table-cell">
                        {registrant.institution}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-0">
                        <span className="text-[10px] sm:text-xs font-medium text-[#2563eb] bg-[#3b82f6]/10 px-2 py-1 rounded-full whitespace-nowrap">
                          {event?.title ?? "-"}
                        </span>
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-0 text-xs sm:text-sm text-gray-600 hidden lg:table-cell">
                        {new Date(registrant.registeredAt).toLocaleDateString(
                          "id-ID",
                        )}
                      </td>
                      <td className="py-3 sm:py-4 px-4 sm:px-0">
                        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-100 text-emerald-700">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 hidden sm:block" />
                          Terdaftar
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 sm:py-12">
              <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gray-100 flex items-center justify-center mb-3 sm:mb-4">
                <Users className="h-7 w-7 sm:h-8 sm:w-8 text-gray-400" />
              </div>
              <p className="font-semibold text-sm sm:text-base text-gray-900">
                Belum ada pendaftar
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Data pendaftar akan muncul di sini
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
