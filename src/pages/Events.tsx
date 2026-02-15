import { useState, useEffect } from "react";
import EventCard from "@/components/EventCard";
import { categoryLabels, type EventCategory } from "@/data/mockData";
import {
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Sparkles,
  BookOpen,
  Users,
  Trophy,
  Zap,
} from "lucide-react";

const categories: (EventCategory | "all")[] = [
  "all",
  "open-class",
  "webinar",
  "seminar",
  "bootcamp",
];
const categoryFilterLabels: Record<string, string> = {
  all: "Semua Event",
  ...categoryLabels,
};

const categoryIcons: Record<string, any> = {
  all: Sparkles,
  "open-class": BookOpen,
  webinar: Users,
  seminar: Trophy,
  bootcamp: Zap,
};

const Events = () => {
  const [filter, setFilter] = useState<EventCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const API = import.meta.env.VITE_API_URL || "";
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/events`);
        if (!res.ok) throw new Error("failed to fetch events");
        const data = await res.json();
        if (Array.isArray(data)) setEvents(data);
      } catch (err) {
        console.warn(err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [API]);

  // Filter by category and search
  let filtered =
    filter === "all" ? events : events.filter((e) => e.category === filter);
  if (searchQuery) {
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.description || "").toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }

  // Count events by category
  const eventCounts = {
    all: events.length,
    "open-class": events.filter((e) => e.category === "open-class").length,
    webinar: events.filter((e) => e.category === "webinar").length,
    seminar: events.filter((e) => e.category === "seminar").length,
    bootcamp: events.filter((e) => e.category === "bootcamp").length,
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Dark Navy seperti Index */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a1628] border-b border-gray-800/50">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0yNCA0MGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTYiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        </div>

        {/* Glowing Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -right-1/4 top-0 h-96 w-96 rounded-full bg-gradient-to-l from-[#1e40af]/20 to-[#2563eb]/20 blur-3xl animate-pulse"
            style={{
              animationDelay: "0.5s",
              boxShadow: "0 0 100px 50px rgba(30, 64, 175, 0.2)",
            }}
          />
          <div
            className="absolute left-1/4 bottom-0 h-96 w-96 rounded-full bg-gradient-to-t from-[#1d4ed8]/20 to-[#2563eb]/20 blur-3xl animate-pulse"
            style={{
              animationDelay: "1.5s",
              boxShadow: "0 0 100px 50px rgba(29, 78, 216, 0.2)",
            }}
          />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Breadcrumb / Badge */}
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white border border-white/20 animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <Calendar className="h-4 w-4" />
              <span className="font-medium">
                {events.length} Event Tersedia
              </span>
            </div>

            {/* Heading */}
            <h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-slide-up drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="bg-gradient-to-r from-[#3b82f6] via-[#2563eb] to-[#1e40af] bg-clip-text text-transparent">
                Jelajahi Event Kami
              </span>
            </h1>

            {/* Description */}
            <p
              className="text-lg md:text-xl text-gray-300 mb-8 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              Temukan event yang sesuai dengan minat dan tingkatkan skill
              teknologimu
            </p>

            {/* Search Bar */}
            <div
              className="relative animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari event berdasarkan nama atau deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-sm pl-12 pr-4 py-3.5 text-white placeholder:text-gray-400 focus:border-[#3b82f6] focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-[#3b82f6]/20 transition-all"
              />
            </div>

            {/* Stats */}
            <div
              className="mt-8 grid grid-cols-3 gap-4 animate-slide-up"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {events.length}
                </div>
                <div className="text-xs md:text-sm text-gray-400 mt-1">
                  Total Event
                </div>
              </div>
              <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {events.filter((e) => e.available).length}
                </div>
                <div className="text-xs md:text-sm text-gray-400 mt-1">
                  Tersedia
                </div>
              </div>
              <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {categories.length - 1}
                </div>
                <div className="text-xs md:text-sm text-gray-400 mt-1">
                  Kategori
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          {/* Filter Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#1e293b] to-[#2563eb] bg-clip-text text-transparent">
                  Filter Kategori
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Pilih kategori untuk melihat event yang kamu inginkan
                </p>
              </div>

              {/* Result Count */}
              <div className="hidden md:flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm shadow-sm">
                <TrendingUp className="h-4 w-4 text-[#2563eb]" />
                <span className="font-semibold text-gray-900">
                  {filtered.length}
                </span>
                <span className="text-gray-600">event ditemukan</span>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => {
                const Icon = categoryIcons[cat];
                const isActive = filter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`group relative overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "text-white shadow-lg"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                    style={
                      isActive
                        ? {
                            background:
                              "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                            boxShadow: "0 8px 24px rgba(37, 99, 235, 0.3)",
                          }
                        : {}
                    }
                  >
                    {/* Active background animation */}
                    {isActive && (
                      <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse" />
                    )}

                    {/* Content */}
                    <span className="relative flex items-center gap-2">
                      <Icon
                        className={`h-4 w-4 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}
                      />
                      <span>{categoryFilterLabels[cat]}</span>
                      {eventCounts[cat] > 0 && (
                        <span
                          className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                          }`}
                        >
                          {eventCounts[cat]}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Result Count */}
            <div className="mt-4 flex md:hidden items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm shadow-sm">
              <TrendingUp className="h-4 w-4 text-[#2563eb]" />
              <span className="font-semibold text-gray-900">
                {filtered.length}
              </span>
              <span className="text-gray-600">event ditemukan</span>
            </div>
          </div>

          {/* Events Grid */}
          {filtered.length > 0 ? (
            <div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((event, idx) => (
                  <div
                    key={event.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <EventCard event={event} />
                  </div>
                ))}
              </div>

              {/* Pagination Info */}
              <div className="mt-12 text-center">
                <p className="text-sm text-gray-600">
                  Menampilkan{" "}
                  <span className="font-semibold text-gray-900">
                    {filtered.length}
                  </span>{" "}
                  dari{" "}
                  <span className="font-semibold text-gray-900">
                    {events.length}
                  </span>{" "}
                  event
                </p>
              </div>
            </div>
          ) : (
            // Empty State
            <div className="py-20 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                <Filter className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">
                Tidak Ada Event Ditemukan
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery
                  ? `Tidak ada event yang cocok dengan pencarian "${searchQuery}"`
                  : "Belum ada event untuk kategori ini saat ini"}
              </p>
              <button
                onClick={() => {
                  setFilter("all");
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-6 py-3 text-sm font-semibold text-white transition-all hover:from-[#1d4ed8] hover:to-[#1e40af] hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                <Sparkles className="h-4 w-4" />
                Lihat Semua Event
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
