import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Users,
  Trophy,
  Zap,
  Calendar,
  Award,
  Clock,
  MapPin,
  CreditCard,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { mediaUrl } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const features = [
  {
    icon: BookOpen,
    title: "Open Class",
    desc: "Workshop interaktif untuk mengasah skill teknologi",
    color: "from-slate-500/10 to-slate-600/10",
    iconBg: "from-slate-600 to-slate-700",
  },
  {
    icon: Users,
    title: "Webinar",
    desc: "Diskusi online bersama para ahli di bidangnya",
    color: "from-slate-500/10 to-slate-600/10",
    iconBg: "from-slate-600 to-slate-700",
  },
  {
    icon: Trophy,
    title: "Seminar",
    desc: "Seminar nasional dengan pembicara ternama",
    color: "from-slate-500/10 to-slate-600/10",
    iconBg: "from-slate-600 to-slate-700",
  },
  {
    icon: Zap,
    title: "Bootcamp",
    desc: "Pelatihan intensif untuk siap kerja di industri IT",
    color: "from-slate-500/10 to-slate-600/10",
    iconBg: "from-slate-600 to-slate-700",
  },
];

const stats = [
  { icon: Users, value: "200+", label: "Anggota Aktif" },
  { icon: Calendar, value: "30+", label: "Event per Tahun" },
  { icon: Award, value: "20+", label: "Workshop Terlaksana" },
];

const Index = () => {
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

  const highlightEvents = events.filter((e) => e.available).slice(0, 3);

  const [activePosterTab, setActivePosterTab] = useState("all");
  const [visibleCount, setVisibleCount] = useState(8);
  const [posters, setPosters] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const res = await fetch(`${API}/api/posters`);
        if (!res.ok) throw new Error("failed to fetch posters");
        const data = await res.json();
        if (Array.isArray(data)) setPosters(data);
      } catch (err) {
        console.warn(err);
        setPosters([]);
      }
    };
    fetchPosters();
  }, [API]);

  const normalizeType = (s?: string) =>
    (s || "").toString().toLowerCase().replace(/[-_]/g, " ").trim();

  const filteredPosters =
    activePosterTab === "all"
      ? posters
      : posters.filter(
          (p) => normalizeType(p.type) === normalizeType(activePosterTab),
        );

  return (
    <div className="overflow-hidden bg-white">
      <section className="relative py-20 md:py-32 lg:py-40 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a1628]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0yNCA0MGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTYiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -right-1/4 top-1/3 h-96 w-96 rounded-full bg-gradient-to-l from-[#1e40af]/20 to-[#2563eb]/20 blur-3xl animate-pulse"
            style={{
              animationDelay: "1s",
              boxShadow: "0 0 100px 50px rgba(30, 64, 175, 0.2)",
            }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-0 h-96 w-96 rounded-full bg-gradient-to-t from-[#1d4ed8]/20 to-[#2563eb]/20 blur-3xl animate-pulse"
            style={{
              animationDelay: "2s",
              boxShadow: "0 0 100px 50px rgba(29, 78, 216, 0.2)",
            }}
          />
        </div>

        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1
              className="font-display text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl animate-slide-up drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]"
              style={{ animationDelay: "0.1s" }}
            >
              <span
                className="bg-gradient-to-r from-[#3b82f6] via-[#2563eb] to-[#1e40af] bg-clip-text text-transparent"
                style={{ textShadow: "0 0 40px rgba(59, 130, 246, 0.3)" }}
              >
                COCONUT
              </span>
              <br />
              <span className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                Computer Club
              </span>
            </h1>

            <p
              className="mx-auto mt-6 max-w-2xl text-lg md:text-xl text-gray-300 leading-relaxed animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Wadah pengembangan skill teknologi informasi melalui kegiatan Open
              Class, Webinar, Seminar, dan Bootcamp profesional.
            </p>

            <div
              className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Link to="/events">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white border-0 font-semibold px-8 py-6 text-base transition-all hover:scale-105"
                  style={{
                    boxShadow:
                      "0 0 30px rgba(37, 99, 235, 0.4), 0 10px 30px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Jelajahi Event <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-500/30 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 px-8 py-6 text-base font-semibold transition-all hover:scale-105 hover:border-gray-400/50"
                >
                  Daftar Sekarang
                </Button>
              </Link>
            </div>

            <div
              className="mt-16 grid grid-cols-3 gap-8 animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon
                      className="h-6 w-6 text-[#3b82f6]"
                      style={{
                        filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))",
                      }}
                    />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#1e293b] to-[#2563eb] bg-clip-text text-transparent mb-4">
              Kegiatan Kami
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Berbagai program unggulan untuk mengembangkan kemampuan di bidang
              teknologi informasi
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
            {features.map((f, idx) => (
              <div
                key={f.title}
                className="group relative rounded-2xl bg-white border border-gray-200 p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:border-gray-300 hover:shadow-xl overflow-hidden"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div
                  className={`relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${f.iconBg} text-white transition-all duration-300 group-hover:scale-110 shadow-md`}
                >
                  <f.icon className="h-8 w-8" />
                </div>

                <h3 className="relative mt-6 font-display text-xl font-bold text-gray-900 transition-colors duration-300">
                  {f.title}
                </h3>
                <p className="relative mt-3 text-sm leading-relaxed text-gray-600">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative">
        <div className="container relative mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-12 gap-4">
            <h2 className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#1e293b] to-[#2563eb] bg-clip-text text-transparent">
              Event Tersedia
            </h2>

            <p className="mt-1 text-lg text-gray-600">
              Jangan lewatkan kesempatan mengikuti event-event menarik kami
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="bg-gray-200 rounded-2xl aspect-[4/3] mb-4" />
                  <div className="bg-gray-200 h-6 rounded mb-2" />
                  <div className="bg-gray-200 h-4 rounded w-3/4" />
                </div>
              ))
            ) : highlightEvents.length > 0 ? (
              highlightEvents.map((event, idx) => {
                const isPaid = event.eventType === "paid";
                const price = isPaid ? Number(event.price) : 0;

                return (
                  <div
                    key={event.id}
                    className="animate-slide-up group flex flex-col h-full"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="relative rounded-2xl bg-white border border-gray-200 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-gray-300 hover:shadow-xl flex flex-col h-full">
                      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        <img
                          src={
                            event.poster
                              ? mediaUrl(event.poster)
                              : event.image
                                ? mediaUrl(event.image)
                                : "/placeholder.svg?height=200&width=300"
                          }
                          alt={event.title || "Event COCONUT"}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src =
                              "/placeholder.svg?height=200&width=300";
                            e.currentTarget.alt = "Gambar tidak tersedia";
                          }}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                        {event.category && (
                          <div className="absolute top-3 left-3 z-10">
                            <span className="inline-block rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] px-3 py-1 text-xs font-bold text-white shadow-lg">
                              {event.categoryLabel || event.category}
                            </span>
                          </div>
                        )}

                        <div className="absolute top-3 right-3 z-10">
                          {isPaid ? (
                            <div className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-3 py-1.5 shadow-lg animate-pulse">
                              <CreditCard className="h-4 w-4 text-white" />
                              <span className="text-xs font-bold text-white">
                                Berbayar
                              </span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 px-3 py-1.5 shadow-lg animate-pulse">
                              <Gift className="h-4 w-4 text-white" />
                              <span className="text-xs font-bold text-white">
                                Gratis
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="font-display text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-[#2563eb] transition-colors">
                          {event.title}
                        </h3>

                        {event.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2rem]">
                            {event.description}
                          </p>
                        )}

                        <div className="flex flex-col gap-2 mb-4">
                          {event.date && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>
                                {new Date(event.date).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                          )}
                          {event.time && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{event.time}</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <MapPin className="h-3.5 w-3.5" />
                              <span className="line-clamp-1">
                                {event.location}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mb-4 pt-3 border-t border-gray-200">
                          {isPaid ? (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <CreditCard className="h-4 w-4 text-red-500" />
                                <span className="text-xs font-semibold text-gray-500">
                                  Harga Tiket
                                </span>
                              </div>
                              <span className="font-display text-lg font-bold text-red-600">
                                Rp {price.toLocaleString("id-ID")}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <Gift className="h-5 w-5 text-green-500" />
                              <span className="font-display text-lg font-bold text-green-600">
                                100% GRATIS
                              </span>
                            </div>
                          )}
                        </div>

                        <Link
                          to={`/events/${event.id}`}
                          className="block mt-auto"
                        >
                          <Button
                            className="w-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30 border-0"
                            size="sm"
                          >
                            Detail Event
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="mx-auto w-24 h-24 mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Belum Ada Event Tersedia
                </h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Event menarik akan segera hadir. Pantau terus halaman ini
                  untuk update terbaru!
                </p>
                <Link to="/events">
                  <Button
                    variant="outline"
                    className="border-2 border-[#2563eb] text-[#2563eb] hover:bg-[#2563eb] hover:text-white"
                  >
                    Lihat Semua Event
                  </Button>
                </Link>
              </div>
            )}
          </div>
          {highlightEvents.length > 0 && (
            <div className="mt-12 flex justify-center">
              <Link to="/events" className="group">
                <span className="inline-flex items-center gap-2 text-base font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition-colors">
                  Lihat Semua Event
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-gray-100 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#1e293b] to-[#2563eb] bg-clip-text text-transparent">
              Kegiatan Sebelumnya
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Dokumentasi kegiatan yang telah diselenggarakan oleh COCONUT
              Computer Club
            </p>
          </div>

          <Tabs
            value={activePosterTab}
            onValueChange={(v) => {
              setActivePosterTab(v);
              setVisibleCount(6);
            }}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-10">
              <TabsTrigger value="all">Semua</TabsTrigger>
              <TabsTrigger value="Open Class">Open Class</TabsTrigger>
              <TabsTrigger value="Seminar">Seminar</TabsTrigger>
              <TabsTrigger value="Webinar">Webinar</TabsTrigger>
            </TabsList>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {filteredPosters.slice(0, visibleCount).map((poster) => (
                <div
                  key={poster.id}
                  className="group relative overflow-hidden rounded-2xl bg-gray-100 shadow hover:shadow-xl transition-all"
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={mediaUrl(poster.image || "/placeholder.svg")}
                      alt={poster.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                        e.currentTarget.alt = "Gambar tidak tersedia";
                      }}
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-block mb-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#2563eb]">
                      {poster.type}
                    </span>

                    <h3 className="text-white font-semibold text-sm line-clamp-2">
                      {poster.title}
                    </h3>

                    <p className="text-xs text-white/80 mt-1">{poster.date}</p>
                  </div>
                </div>
              ))}
            </div>

            {filteredPosters.length > visibleCount && (
              <div className="mt-10 flex justify-center">
                <Button
                  variant="outline"
                  className="border-[#2563eb] text-[#2563eb]"
                  onClick={() => setVisibleCount((p) => p + 6)}
                >
                  Lihat Lebih Banyak
                </Button>
              </div>
            )}
          </Tabs>
        </div>
      </section>

      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a1628]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0yNCA0MGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTYiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-[#3b82f6]/20 blur-3xl animate-pulse"
            style={{ boxShadow: "0 0 100px 50px rgba(59, 130, 246, 0.2)" }}
          />
          <div
            className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-[#1e40af]/20 blur-3xl animate-pulse"
            style={{
              animationDelay: "1s",
              boxShadow: "0 0 100px 50px rgba(30, 64, 175, 0.2)",
            }}
          />
        </div>

        <div className="container relative mx-auto px-4">
          <div
            className="mx-auto max-w-4xl rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-12 md:p-16 text-center"
            style={{
              boxShadow:
                "0 0 60px rgba(59, 130, 246, 0.15), 0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
          >
            <h2
              className="font-display text-4xl md:text-5xl font-bold text-white mb-6"
              style={{ textShadow: "0 0 30px rgba(255, 255, 255, 0.2)" }}
            >
              Siap Bergabung dengan Kami?
            </h2>

            <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-100 leading-relaxed mb-10">
              Daftarkan dirimu sekarang dan tingkatkan skill teknologimu bersama
              ribuan anggota COCONUT Computer Club
            </p>

            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-[#2563eb] hover:bg-gray-50 border-0 font-bold px-10 py-6 text-lg transition-all hover:scale-105"
                style={{
                  boxShadow:
                    "0 0 40px rgba(255, 255, 255, 0.3), 0 10px 30px rgba(0, 0, 0, 0.2)",
                }}
              >
                Daftar Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <p className="mt-6 text-sm text-gray-200">
              Untuk semua kalangan • No hidden fees
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
