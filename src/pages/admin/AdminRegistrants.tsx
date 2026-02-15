import { useState, useMemo, useEffect } from "react";
import { categoryLabels } from "@/data/mockData";
import { mediaUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Users,
  Search,
  Filter,
  Sparkles,
  Eye,
  Calendar,
  Building2,
  Phone,
  TrendingUp,
  FileText,
  FolderOpen,
  Image,
  File,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Extend the Registrant type
interface ExtendedRegistrant {
  id: string;
  name: string;
  whatsapp: string;
  institution: string;
  eventId: string;
  registeredAt: string;
  category?: string;
  fileName?: string;
  proofImage?: string;
}

const AdminRegistrants = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedRegistrant, setSelectedRegistrant] =
    useState<ExtendedRegistrant | null>(null);
  const { toast } = useToast();

  const [events, setEvents] = useState<any[]>([]);
  const [registrants, setRegistrants] = useState<ExtendedRegistrant[]>([]);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "";
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
    fetchEvents();
  }, []);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || "";
    const token = localStorage.getItem("admin_token");

    const fetchForEvent = async (eventId: string) => {
      try {
        const res = await fetch(
          `${API}/api/admin/registrations?event_id=${eventId}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          },
        );
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (err) {
        console.warn(err);
        return [];
      }
    };

    const fetchRegistrants = async () => {
      // if no events yet, nothing to fetch
      if (events.length === 0) return;

      if (selectedEvent === "all") {
        // fetch for all events in parallel and flatten
        const promises = events.map((e) => fetchForEvent(e.id));
        const results = await Promise.all(promises);
        const flattened: ExtendedRegistrant[] = ([] as any[]).concat(
          ...results,
        );
        setRegistrants(flattened as ExtendedRegistrant[]);
        return;
      }

      // fetch for single event
      const list = await fetchForEvent(selectedEvent);
      setRegistrants(list as ExtendedRegistrant[]);
    };

    fetchRegistrants();
  }, [selectedEvent, events]);

  const filtered = useMemo(() => {
    let result: ExtendedRegistrant[] =
      selectedEvent === "all"
        ? registrants
        : registrants.filter((r) => r.eventId === selectedEvent);

    if (searchQuery) {
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.whatsapp.includes(searchQuery) ||
          r.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.category?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return result;
  }, [selectedEvent, searchQuery, registrants]);

  const handleExport = () => {
    toast({
      title: "📥 Export Berhasil",
      description: "Data pendaftar telah diunduh dalam format Excel.",
      duration: 3000,
    });
  };

  const handleViewRegistrant = (registrant: ExtendedRegistrant) => {
    setSelectedRegistrant(registrant);
    setViewDialogOpen(true);
  };

  const totalRegistrants = registrants.length;
  const todayRegistrants = registrants.filter((r) => {
    const today = new Date().toDateString();
    const regDate = new Date(r.registeredAt).toDateString();
    return today === regDate;
  }).length;
  const uniqueInstitutions = new Set(registrants.map((r) => r.institution))
    .size;

  const eventStats = events
    .map((event) => ({
      event,
      count: registrants.filter((r) => r.eventId === event.id).length,
    }))
    .filter((stat) => stat.count > 0);

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1628] via-[#0d2847] to-[#1e3a5f] p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0yNCA0MGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTYiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />

        <div className="absolute -right-20 top-0 h-48 w-48 rounded-full bg-gradient-to-br from-[#8b5cf6]/20 to-[#7c3aed]/20 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-gradient-to-br from-[#0ea5e9]/20 to-[#38bdf8]/20 blur-3xl" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles
                  className="h-5 w-5 text-[#60a5fa]"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(96, 165, 250, 0.6))",
                  }}
                />
                <span className="text-sm font-semibold text-[#60a5fa]">
                  Registrant Management
                </span>
              </div>
              <h1
                className="font-display text-3xl md:text-4xl font-bold text-white mb-2"
                style={{ textShadow: "0 0 30px rgba(255, 255, 255, 0.3)" }}
              >
                Data Pendaftar
              </h1>
              <p className="text-gray-300">
                Kelola dan monitor semua peserta yang telah mendaftar
              </p>
            </div>

            <Button
              onClick={handleExport}
              size="lg"
              className="bg-white text-[#2563eb] hover:bg-gray-50 font-semibold px-6 transition-all hover:scale-105 border-0"
              style={{ boxShadow: "0 0 30px rgba(255, 255, 255, 0.3)" }}
            >
              <Download className="mr-2 h-5 w-5" /> Export Excel
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-2xl font-bold text-white">
                {totalRegistrants}
              </div>
              <div className="text-xs text-gray-300 mt-1">Total Pendaftar</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-2xl font-bold text-white">
                {todayRegistrants}
              </div>
              <div className="text-xs text-gray-300 mt-1">Hari Ini</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-2xl font-bold text-white">
                {uniqueInstitutions}
              </div>
              <div className="text-xs text-gray-300 mt-1">Instansi</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {eventStats.slice(0, 4).map((stat, idx) => (
          <div
            key={stat.event.id}
            className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/10 to-[#7c3aed]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <Badge className="bg-[#8b5cf6]/10 text-[#7c3aed] border-0 font-medium text-xs">
                  {stat.event.categoryLabel}
                </Badge>
                <div className="flex items-center gap-1 text-emerald-600">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-semibold">+{stat.count}</span>
                </div>
              </div>

              <p className="font-display text-2xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] bg-clip-text text-transparent">
                {stat.count}
              </p>
              <p className="text-sm font-medium text-gray-600 mt-1 line-clamp-1">
                {stat.event.title}
              </p>
            </div>

            <div className="absolute -right-6 -bottom-6 h-20 w-20 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] opacity-0 blur-2xl group-hover:opacity-20 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan nama, WhatsApp, instansi, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300 focus:border-[#8b5cf6] focus:ring-[#8b5cf6]"
            />
          </div>

          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger className="w-full md:w-80 border-gray-300 focus:border-[#8b5cf6] focus:ring-[#8b5cf6]">
              <SelectValue placeholder="Filter berdasarkan event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Semua Event
                </div>
              </SelectItem>
              {events.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  <div className="flex items-center justify-between gap-3">
                    <span>{e.title}</span>
                    <Badge variant="secondary" className="text-xs">
                      {registrants.filter((r) => r.eventId === e.id).length}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>
            Menampilkan{" "}
            <strong className="text-gray-900">{filtered.length}</strong>{" "}
            pendaftar
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  WhatsApp
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Instansi
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tanggal Daftar
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Bukti
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((reg, i) => {
                  const event = events.find((e) => e.id === reg.eventId);
                  return (
                    <tr
                      key={reg.id}
                      className="group hover:bg-gray-50 transition-colors"
                      style={{ animationDelay: `${i * 0.02}s` }}
                    >
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                        {i + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white font-semibold text-sm shadow-md group-hover:scale-110 transition-transform">
                            {reg.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-gray-900 group-hover:text-[#7c3aed] transition-colors">
                            {reg.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-4 w-4 text-gray-400" />
                          {reg.whatsapp}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Building2 className="h-4 w-4 text-gray-400" />
                          {reg.institution}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {(reg as ExtendedRegistrant).category ? (
                          <Badge className="bg-blue-100 text-blue-700 border-0 font-medium">
                            {(reg as ExtendedRegistrant).category}
                          </Badge>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {event ? (
                          <Badge className="bg-[#8b5cf6]/10 text-[#7c3aed] border-0 font-medium">
                            {event.title}
                          </Badge>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {new Date(reg.registeredAt).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {(reg as ExtendedRegistrant).fileName ? (
                          <a
                            href={mediaUrl(
                              (reg as ExtendedRegistrant).proofImage,
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block"
                          >
                            <Badge className="bg-green-100 text-green-700 border-0 font-medium hover:opacity-90">
                              <FileText className="h-3 w-3 mr-1" />
                              Ada
                            </Badge>
                          </a>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Tidak ada
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleViewRegistrant(reg as ExtendedRegistrant)
                          }
                          className="h-8 w-8 p-0 hover:bg-[#8b5cf6]/10 hover:text-[#7c3aed] transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Tidak ada pendaftar ditemukan
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {searchQuery || selectedEvent !== "all"
                            ? "Coba ubah filter atau kata kunci pencarian"
                            : "Belum ada data pendaftar"}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedRegistrant && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-2xl bg-gradient-to-r from-[#1e3a5f] to-[#7c3aed] bg-clip-text text-transparent">
                  Detail Pendaftar
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-[#8b5cf6]/5 to-[#7c3aed]/5 border border-[#8b5cf6]/20">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white font-bold text-2xl shadow-lg">
                    {selectedRegistrant.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold text-gray-900">
                      {selectedRegistrant.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Pendaftar ID: {selectedRegistrant.id}
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
                    Terdaftar
                  </Badge>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2 p-4 rounded-xl border border-gray-200 bg-white">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Phone className="h-4 w-4" />
                      WhatsApp
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedRegistrant.whatsapp}
                    </p>
                  </div>

                  <div className="space-y-2 p-4 rounded-xl border border-gray-200 bg-white">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Building2 className="h-4 w-4" />
                      Asal Instansi
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      {selectedRegistrant.institution}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 p-5 rounded-xl border border-gray-200 bg-white">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
                    <FileText className="h-4 w-4" />
                    Informasi Event
                  </div>
                  {(() => {
                    const event = events.find(
                      (e) => e.id === selectedRegistrant.eventId,
                    );
                    return event ? (
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-[#8b5cf6]/5">
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white font-semibold shadow-md">
                            {event.title.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {event.title}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge className="bg-[#8b5cf6]/10 text-[#7c3aed] border-0 text-xs">
                                {event.categoryLabel}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {new Date(event.date).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  },
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                        {selectedRegistrant.category && (
                          <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs font-medium text-blue-700 mb-1">
                              Kategori Event
                            </p>
                            <Badge className="bg-blue-100 text-blue-700 border-0">
                              {selectedRegistrant.category}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Event tidak ditemukan
                      </p>
                    );
                  })()}
                </div>

                {selectedRegistrant.fileName && (
                  <div className="space-y-3 p-5 rounded-xl border border-gray-200 bg-white">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
                      <FolderOpen className="h-4 w-4" />
                      Dokumen Pendukung
                    </div>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                          {selectedRegistrant.fileName.endsWith(".pdf") ? (
                            <File className="h-6 w-6 text-blue-600" />
                          ) : (
                            <Image className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">
                            {selectedRegistrant.fileName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            File berhasil diupload
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <a
                            href={mediaUrl(selectedRegistrant.proofImage)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            Lihat File
                          </a>
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Valid
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2 p-4 rounded-xl border border-gray-200 bg-white">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <Calendar className="h-4 w-4" />
                    Tanggal Pendaftaran
                  </div>
                  <p className="text-base font-semibold text-gray-900">
                    {new Date(
                      selectedRegistrant.registeredAt,
                    ).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setViewDialogOpen(false)}
                    className="flex-1"
                  >
                    Tutup
                  </Button>
                  <Button
                    onClick={() => {
                      window.open(
                        `https://wa.me/${selectedRegistrant.whatsapp.replace(/\D/g, "")}`,
                        "_blank",
                      );
                    }}
                    className="flex-1 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#128C7E] hover:to-[#075E54] text-white border-0"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Hubungi via WhatsApp
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminRegistrants;
