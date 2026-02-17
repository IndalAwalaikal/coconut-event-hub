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
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    (async () => {
      try {
        const res = await fetch(`${API}/api/events`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setEvents(data);
        }
      } catch (err) {
        console.warn(err);
      }
    })();
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
      } catch {
        return [];
      }
    };
    (async () => {
      if (events.length === 0) return;
      if (selectedEvent === "all") {
        const results = await Promise.all(
          events.map((e) => fetchForEvent(e.id)),
        );
        setRegistrants(
          ([] as any[]).concat(...results) as ExtendedRegistrant[],
        );
      } else {
        setRegistrants(
          (await fetchForEvent(selectedEvent)) as ExtendedRegistrant[],
        );
      }
    })();
  }, [selectedEvent, events]);

  const filtered = useMemo(() => {
    let result =
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

  const totalRegistrants = registrants.length;
  const todayRegistrants = registrants.filter(
    (r) =>
      new Date().toDateString() === new Date(r.registeredAt).toDateString(),
  ).length;
  const uniqueInstitutions = new Set(registrants.map((r) => r.institution))
    .size;
  const eventStats = events
    .map((e) => ({
      event: e,
      count: registrants.filter((r) => r.eventId === e.id).length,
    }))
    .filter((s) => s.count > 0);

  return (
    <div className="space-y-5 md:space-y-6">
      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#0a1628] via-[#0d2847] to-[#1e3a5f] p-5 sm:p-6 md:p-8">
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0yNCA0MGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTYiLz48L2c+PC9nPjwvc3ZnPg==')]" />
        <div className="absolute -right-20 top-0 h-48 w-48 rounded-full bg-gradient-to-br from-[#8b5cf6]/20 to-[#7c3aed]/20 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-48 w-48 rounded-full bg-gradient-to-br from-[#0ea5e9]/20 to-[#38bdf8]/20 blur-3xl" />
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles
                  className="h-4 w-4 text-[#60a5fa]"
                  style={{
                    filter: "drop-shadow(0 0 8px rgba(96,165,250,0.6))",
                  }}
                />
                <span className="text-xs sm:text-sm font-semibold text-[#60a5fa]">
                  Registrant Management
                </span>
              </div>
              <h1
                className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2"
                style={{ textShadow: "0 0 30px rgba(255,255,255,0.3)" }}
              >
                Data Pendaftar
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm">
                Kelola dan monitor semua peserta yang telah mendaftar
              </p>
            </div>
            <Button
              onClick={() =>
                toast({
                  title: "📥 Export Berhasil",
                  description: "Data telah diunduh.",
                  duration: 3000,
                })
              }
              className="bg-white text-[#2563eb] hover:bg-gray-50 font-semibold transition-all hover:scale-105 border-0 w-full sm:w-auto"
              style={{ boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
            >
              <Download className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Export Excel
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
            {[
              { label: "Total Pendaftar", value: totalRegistrants },
              { label: "Hari Ini", value: todayRegistrants },
              { label: "Instansi", value: uniqueInstitutions },
            ].map((s) => (
              <div
                key={s.label}
                className="text-center p-2 sm:p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20"
              >
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {s.value}
                </div>
                <div className="text-[10px] sm:text-xs text-gray-300 mt-0.5 sm:mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Event Stats Cards ── */}
      {eventStats.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {eventStats.slice(0, 4).map((stat, idx) => (
            <div
              key={stat.event.id}
              className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-gray-200 p-4 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/10 to-[#7c3aed]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <Badge className="bg-[#8b5cf6]/10 text-[#7c3aed] border-0 font-medium text-[10px] sm:text-xs">
                    {stat.event.categoryLabel}
                  </Badge>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span className="text-[10px] sm:text-xs font-semibold">
                      +{stat.count}
                    </span>
                  </div>
                </div>
                <p className="font-display text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] bg-clip-text text-transparent">
                  {stat.count}
                </p>
                <p className="text-xs sm:text-sm font-medium text-gray-600 mt-0.5 sm:mt-1 line-clamp-1">
                  {stat.event.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Filters ── */}
      <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari nama, WhatsApp, instansi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger className="w-full">
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
                    <span className="truncate">{e.title}</span>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {registrants.filter((r) => r.eventId === e.id).length}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>
            Menampilkan <strong>{filtered.length}</strong> pendaftar
          </span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  #
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                  WhatsApp
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                  Instansi
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                  Event
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                  Tanggal
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                  Bukti
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 font-medium">
                        {i + 1}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white font-semibold text-xs sm:text-sm shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                            {reg.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-xs sm:text-sm text-gray-900 group-hover:text-[#7c3aed] transition-colors truncate max-w-[90px] sm:max-w-[140px] md:max-w-none">
                            {reg.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                          <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                          {reg.whatsapp}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                          <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                          {reg.institution}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                        {event ? (
                          <Badge className="bg-[#8b5cf6]/10 text-[#7c3aed] border-0 font-medium text-xs">
                            {event.title}
                          </Badge>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
                          {new Date(reg.registeredAt).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                        {reg.fileName ? (
                          <a
                            href={mediaUrl(reg.proofImage)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Badge className="bg-green-100 text-green-700 border-0 font-medium text-xs hover:opacity-90">
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
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedRegistrant(reg);
                            setViewDialogOpen(true);
                          }}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-[#8b5cf6]/10 hover:text-[#7c3aed]"
                          title="Lihat Detail"
                        >
                          <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <Users className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="font-semibold text-gray-900">
                        Tidak ada pendaftar ditemukan
                      </p>
                      <p className="text-sm text-gray-500">
                        {searchQuery || selectedEvent !== "all"
                          ? "Coba ubah filter"
                          : "Belum ada data pendaftar"}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Detail Dialog ── */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedRegistrant && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl sm:text-2xl bg-gradient-to-r from-[#1e3a5f] to-[#7c3aed] bg-clip-text text-transparent">
                  Detail Pendaftar
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#8b5cf6]/5 to-[#7c3aed]/5 border border-[#8b5cf6]/20">
                  <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white font-bold text-xl sm:text-2xl shadow-lg flex-shrink-0">
                    {selectedRegistrant.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-gray-900 truncate">
                      {selectedRegistrant.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                      ID: {selectedRegistrant.id}
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 flex-shrink-0 text-xs sm:text-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5" />
                    Terdaftar
                  </Badge>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2 p-3 sm:p-4 rounded-xl border border-gray-200 bg-white">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-500">
                      <Phone className="h-4 w-4" />
                      WhatsApp
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-gray-900">
                      {selectedRegistrant.whatsapp}
                    </p>
                  </div>
                  <div className="space-y-1.5 sm:space-y-2 p-3 sm:p-4 rounded-xl border border-gray-200 bg-white">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-500">
                      <Building2 className="h-4 w-4" />
                      Instansi
                    </div>
                    <p className="text-sm sm:text-base font-semibold text-gray-900">
                      {selectedRegistrant.institution}
                    </p>
                  </div>
                </div>

                {selectedRegistrant.fileName && (
                  <div className="p-4 sm:p-5 rounded-xl border border-gray-200 bg-white">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-500 mb-3">
                      <FolderOpen className="h-4 w-4" />
                      Dokumen Pendukung
                    </div>
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 sm:p-4 bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-blue-100 flex-shrink-0">
                          {selectedRegistrant.fileName.endsWith(".pdf") ? (
                            <File className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                          ) : (
                            <Image className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                            {selectedRegistrant.fileName}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                            File berhasil diupload
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <a
                            href={mediaUrl(selectedRegistrant.proofImage)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs sm:text-sm text-primary hover:underline"
                          >
                            Lihat File
                          </a>
                          <Badge className="bg-green-100 text-green-700 text-[10px] sm:text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Valid
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5 sm:space-y-2 p-3 sm:p-4 rounded-xl border border-gray-200 bg-white">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-500">
                    <Calendar className="h-4 w-4" />
                    Tanggal Pendaftaran
                  </div>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
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

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setViewDialogOpen(false)}
                    className="flex-1"
                  >
                    Tutup
                  </Button>
                  <Button
                    onClick={() =>
                      window.open(
                        `https://wa.me/${selectedRegistrant.whatsapp.replace(/\D/g, "")}`,
                        "_blank",
                      )
                    }
                    className="flex-1 bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white border-0"
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
