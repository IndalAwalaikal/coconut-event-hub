import { useState, useMemo, useEffect } from "react";
import { categoryLabels, type EventCategory } from "@/data/mockData";
import {
  Images,
  Calendar,
  Search,
  Filter,
  Image as ImageIcon,
  BookOpen,
  Users,
  Trophy,
  Zap,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { mediaUrl } from "@/lib/utils";

const categoryIcons: Record<string, any> = {
  "open-class": BookOpen,
  webinar: Users,
  seminar: Trophy,
  bootcamp: Zap,
};

const DocumentationPage = () => {
  const [catFilter, setCatFilter] = useState<EventCategory | "all">("all");
  const [yearFilter, setYearFilter] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const API = import.meta.env.VITE_API_URL || "";
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const years = useMemo(
    () => [...new Set(docs.map((d) => d.year))].sort((a, b) => b - a),
    [docs],
  );

  const filtered = useMemo(
    () =>
      docs.filter(
        (d) =>
          (catFilter === "all" || d.category === catFilter) &&
          (yearFilter === "all" || d.year === yearFilter) &&
          (searchQuery === "" ||
            d.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            d.description.toLowerCase().includes(searchQuery.toLowerCase())),
      ),
    [docs, catFilter, yearFilter, searchQuery],
  );

  useEffect(() => {
    // fetch documentations from backend
    const fetchDocs = async () => {
      setLoading(true);
      try {
        const q = new URLSearchParams();
        if (catFilter !== "all") q.set("category", catFilter);
        if (yearFilter !== "all") q.set("year", String(yearFilter));
        if (searchQuery) q.set("q", searchQuery);
        const res = await fetch(`${API}/api/documentations?${q.toString()}`);
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json();
        if (Array.isArray(data)) setDocs(data);
      } catch (e) {
        console.warn(e);
        setDocs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
    // only when filters change we refetch; this keeps UI reactive and uses fallback
  }, [catFilter, yearFilter, searchQuery]);

  // Count by category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: docs.length };
    docs.forEach((doc) => {
      counts[doc.category] = (counts[doc.category] || 0) + 1;
    });
    return counts;
  }, [docs]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section - Dark Navy seperti halaman lainnya */}
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
            {/* Badge */}
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white border border-white/20 animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <Images className="h-4 w-4" />
              <span className="font-medium">
                {docs.length} Dokumentasi Tersedia
              </span>
            </div>

            {/* Heading */}
            <h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-slide-up drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="bg-gradient-to-r from-[#3b82f6] via-[#2563eb] to-[#1e40af] bg-clip-text text-transparent">
                Galeri Dokumentasi
              </span>
            </h1>

            {/* Description */}
            <p
              className="text-lg md:text-xl text-gray-300 mb-8 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              Lihat momen-momen berharga dari berbagai kegiatan COCONUT Computer
              Club
            </p>

            {/* Search Bar */}
            <div
              className="relative animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari dokumentasi berdasarkan judul atau deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-sm pl-12 pr-4 py-3.5 text-white placeholder:text-gray-400 focus:border-[#2563eb] focus:bg-white/10 focus:outline-none focus:ring-4 focus:ring-[#2563eb]/20 transition-all"
              />
            </div>

            {/* Stats */}
            <div
              className="mt-8 grid grid-cols-3 gap-4 animate-slide-up"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {docs.length}
                </div>
                <div className="text-xs md:text-sm text-gray-400 mt-1">
                  Total Dokumentasi
                </div>
              </div>
              <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {years.length || 1}
                </div>
                <div className="text-xs md:text-sm text-gray-400 mt-1">
                  Tahun
                </div>
              </div>
              <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 text-center">
                <div className="text-2xl md:text-3xl font-bold text-white">
                  {Object.keys(categoryLabels).length}
                </div>
                <div className="text-xs md:text-sm text-gray-400 mt-1">
                  Kategori
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Category Filters */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-700">
                    Filter Kategori
                  </h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setCatFilter("all")}
                    className={`group relative overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                      catFilter === "all"
                        ? "text-white shadow-lg"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                    style={
                      catFilter === "all"
                        ? {
                            background:
                              "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                          }
                        : {}
                    }
                  >
                    {catFilter === "all" && (
                      <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse" />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Semua
                      <span
                        className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                          catFilter === "all"
                            ? "bg-white/20 text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {categoryCounts.all}
                      </span>
                    </span>
                  </button>
                  {(
                    ["open-class", "webinar", "seminar", "bootcamp"] as const
                  ).map((cat) => {
                    const Icon = categoryIcons[cat];
                    const isActive = catFilter === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setCatFilter(cat)}
                        className={`group relative overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                          isActive
                            ? "text-white shadow-lg"
                            : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md"
                        }`}
                        style={
                          isActive
                            ? {
                                background:
                                  "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                              }
                            : {}
                        }
                      >
                        {isActive && (
                          <span className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse" />
                        )}
                        <span className="relative flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {categoryLabels[cat]}
                          {categoryCounts[cat] > 0 && (
                            <span
                              className={`ml-1 rounded-full px-2 py-0.5 text-xs font-bold ${
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {categoryCounts[cat]}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Year Filters */}
              <div className="lg:w-auto">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <h3 className="text-sm font-semibold text-gray-700">Tahun</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setYearFilter("all")}
                    className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                      yearFilter === "all"
                        ? "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-lg"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md"
                    }`}
                    style={
                      yearFilter === "all"
                        ? { boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)" }
                        : {}
                    }
                  >
                    Semua
                  </button>
                  {years.map((y) => (
                    <button
                      key={y}
                      onClick={() => setYearFilter(y)}
                      className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${
                        yearFilter === y
                          ? "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-lg"
                          : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                      style={
                        yearFilter === y
                          ? { boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)" }
                          : {}
                      }
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Result Count */}
            <div className="flex items-center justify-center mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2 text-sm shadow-sm">
                <TrendingUp className="h-4 w-4 text-[#2563eb]" />
                <span className="text-gray-600">
                  Menampilkan{" "}
                  <span className="font-semibold text-gray-900">
                    {filtered.length}
                  </span>{" "}
                  dari{" "}
                  <span className="font-semibold text-gray-900">
                    {docs.length}
                  </span>{" "}
                  dokumentasi
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section - Horizontal Scrollable */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          {filtered.length > 0 ? (
            <div className="space-y-8">
              {filtered.map((doc, idx) => {
                const Icon = categoryIcons[doc.category];
                return (
                  <div
                    key={doc.id}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:border-gray-300 hover:shadow-xl animate-slide-up"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {/* Content Header */}
                    <div className="p-6 md:p-8 border-b border-gray-100">
                      {/* Category & Year Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-4 py-1.5 text-sm font-bold text-white shadow-md">
                          <Icon className="h-4 w-4" />
                          {doc.categoryLabel}
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-1.5 text-sm font-semibold text-gray-700 border border-gray-200">
                          <Calendar className="h-4 w-4" />
                          {doc.year}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-[#2563eb] transition-colors">
                        {doc.eventTitle}
                      </h3>

                      {/* Description */}
                      <p className="text-base font-semibold text-gray-600 leading-relaxed">
                        {doc.description}
                      </p>
                    </div>

                    {/* Horizontal Scrollable Image Gallery */}
                    <div className="relative bg-gradient-to-b from-gray-50 to-white p-6 md:p-8">
                      <div
                        className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#2563eb] scrollbar-track-gray-200"
                        style={{
                          scrollbarWidth: "thin",
                          scrollbarColor: "#2563eb #e5e7eb",
                        }}
                      >
                        {(doc.images || []).map((img, i) => (
                          <div
                            key={i}
                            className="flex-shrink-0 w-80 md:w-96 overflow-hidden rounded-xl bg-gray-200 shadow-md transition-transform duration-300 hover:scale-[1.02] hover:shadow-lg"
                          >
                            <img
                              src={mediaUrl(img)}
                              alt={`${doc.eventTitle} - Foto ${i + 1}`}
                              className="h-64 md:h-80 w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Scroll Indicator */}
                      {((doc.images || []) as string[]).length > 1 && (
                        <div className="mt-3 flex items-center justify-center gap-2">
                          <div className="flex items-center gap-2 text-xs text-gray-600 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                            <span>← Scroll untuk melihat</span>
                            <span className="font-bold text-[#2563eb]">
                              {((doc.images || []) as string[]).length} foto
                            </span>
                            <span>→</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer Stats */}
                    <div className="flex flex-wrap items-center justify-between gap-4 p-6 md:p-8 border-t border-gray-100 bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white shadow-md">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Total Foto</p>
                            <p className="font-bold text-gray-900">
                              {((doc.images || []) as string[]).length}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-gray-200">
                            <Calendar className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Tahun</p>
                            <p className="font-bold text-gray-900">
                              {doc.year}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Empty State
            <div className="py-20 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="font-display text-2xl font-bold text-gray-900 mb-3">
                Tidak Ada Dokumentasi
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery
                  ? `Tidak ada dokumentasi yang cocok dengan pencarian "${searchQuery}"`
                  : "Belum ada dokumentasi untuk filter yang dipilih"}
              </p>
              <button
                onClick={() => {
                  setCatFilter("all");
                  setYearFilter("all");
                  setSearchQuery("");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-6 py-3 text-sm font-semibold text-white transition-all hover:from-[#1d4ed8] hover:to-[#1e40af] hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                <Sparkles className="h-4 w-4" />
                Lihat Semua Dokumentasi
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DocumentationPage;
