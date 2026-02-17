import { useState, useEffect } from "react";
import { categoryLabels, type EventCategory } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Edit,
  Calendar,
  Users,
  Trash2,
  Eye,
  Search,
  Filter,
  Sparkles,
  CheckCircle,
  AlertCircle,
  MapPin,
  Clock,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const tabs: { key: EventCategory | "all"; label: string }[] = [
  { key: "all", label: "Semua" },
  { key: "open-class", label: "Open Class" },
  { key: "webinar", label: "Webinar" },
  { key: "seminar", label: "Seminar" },
  { key: "bootcamp", label: "Bootcamp" },
];

const AdminEvents = () => {
  const [tab, setTab] = useState<EventCategory | "all">("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [rules, setRules] = useState<string[]>([""]);
  const [benefits, setBenefits] = useState<string[]>([""]);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );
  const [eventType, setEventType] = useState<"free" | "paid">("free");
  const [price, setPrice] = useState("");
  const { toast } = useToast();

  const media = (p?: string) => {
    if (!p) return "";
    if (p.startsWith("http://") || p.startsWith("https://")) return p;
    const API = import.meta.env.VITE_API_URL || "";
    if (p.startsWith("/")) return `${API}${p}`;
    return `${API}/${p}`;
  };

  const [events, setEvents] = useState<any[]>([]);

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

  const filtered =
    tab === "all" ? events : events.filter((e) => e.category === tab);
  const searchFiltered = filtered.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const API = import.meta.env.VITE_API_URL || "";
    const token = localStorage.getItem("admin_token");
    (async () => {
      try {
        const formEl = e.target as HTMLFormElement;
        const form = new FormData(formEl);
        if (selectedCategory) {
          form.set("category", selectedCategory);
          form.set(
            "categoryLabel",
            (categoryLabels as any)[selectedCategory as EventCategory] || "",
          );
        }
        form.set("eventType", eventType);
        form.set("price", eventType === "paid" && price ? price : "0");
        form.delete("rules");
        form.delete("benefits");
        rules.forEach((rule) => {
          if (rule.trim()) form.append("rules", rule);
        });
        benefits.forEach((benefit) => {
          if (benefit.trim()) form.append("benefits", benefit);
        });
        if (posterFile) form.append("poster", posterFile);

        const url =
          editMode && selectedEvent?.id
            ? `${API}/api/admin/events/${selectedEvent.id}`
            : `${API}/api/admin/events`;
        const res = await fetch(url, {
          method: editMode ? "PUT" : "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: form,
        });
        if (!res.ok) throw new Error((await res.text()) || "failed");

        setDialogOpen(false);
        setEditMode(false);
        setRules([""]);
        setBenefits([""]);
        setEventType("free");
        setPrice("");
        setPosterFile(null);
        toast({
          title: editMode
            ? "✅ Event Berhasil Diupdate"
            : "✅ Event Berhasil Disimpan",
          duration: 3000,
        });

        const ref = await fetch(`${API}/api/events`);
        if (ref.ok) {
          const data = await ref.json();
          if (Array.isArray(data)) setEvents(data);
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err?.message || String(err),
          duration: 4000,
        });
      }
    })();
  };

  const handleViewEvent = (event: any) => {
    setSelectedEvent(event);
    setViewDialogOpen(true);
  };
  const handleEditEvent = (event: any) => {
    setSelectedEvent(event);
    setEditMode(true);
    setRules(event.rules || [""]);
    setBenefits(event.benefits || [""]);
    setSelectedCategory(event.category || undefined);
    setEventType(event.eventType || "free");
    setPrice(event.price ? String(event.price) : "");
    setDialogOpen(true);
  };
  const handleAddNewEvent = () => {
    setSelectedEvent(null);
    setEditMode(false);
    setRules([""]);
    setBenefits([""]);
    setSelectedCategory(undefined);
    setEventType("free");
    setPrice("");
    setDialogOpen(true);
  };
  const handleDeleteEvent = (event: any) => {
    if (!window.confirm(`Hapus event "${event.title}"?`)) return;
    const API = import.meta.env.VITE_API_URL || "";
    const token = localStorage.getItem("admin_token");
    (async () => {
      try {
        const res = await fetch(`${API}/api/admin/events/${event.id}`, {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error((await res.text()) || "failed to delete");
        toast({ title: "🗑️ Event Dihapus", duration: 3000 });
        const ref = await fetch(`${API}/api/events`);
        if (ref.ok) {
          const data = await ref.json();
          if (Array.isArray(data)) setEvents(data);
        }
      } catch (err: any) {
        toast({
          title: "Error",
          description: err?.message || String(err),
          duration: 4000,
        });
      }
    })();
  };

  const totalEvents = events.length;
  const activeEvents = events.filter((e) => e.available).length;
  const totalRegistrants = events.reduce(
    (sum, e) => sum + (e.registered || 0),
    0,
  );

  return (
    <div className="space-y-5 md:space-y-6">
      {/* ── Header ── */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#0a1628] via-[#0d2847] to-[#1e3a5f] p-5 sm:p-6 md:p-8">
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0yNCA0MGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTYiLz48L2c+PC9nPjwvc3ZnPg==')]" />
        <div className="absolute -right-20 top-0 h-48 w-48 rounded-full bg-gradient-to-br from-[#3b82f6]/20 to-[#60a5fa]/20 blur-3xl" />
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
                  Event Management
                </span>
              </div>
              <h1
                className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2"
                style={{ textShadow: "0 0 30px rgba(255,255,255,0.3)" }}
              >
                Kelola Event
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm">
                Tambah, edit, dan kelola semua event kegiatan COCONUT
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  onClick={handleAddNewEvent}
                  className="bg-white text-[#2563eb] hover:bg-gray-50 font-semibold px-4 sm:px-6 transition-all hover:scale-105 border-0 w-full sm:w-auto sm:text-base sm:py-5"
                  style={{ boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                >
                  <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Tambah Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl sm:text-2xl bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] bg-clip-text text-transparent">
                    {editMode ? "Edit Event" : "Tambah Event Baru"}
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleSave}
                  className="space-y-4 sm:space-y-5 mt-4 sm:mt-6"
                >
                  <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Kategori Event *
                      </Label>
                      <Select
                        value={selectedCategory}
                        onValueChange={(v) => setSelectedCategory(v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {(
                            Object.entries(categoryLabels) as [
                              EventCategory,
                              string,
                            ][]
                          ).map(([val, label]) => (
                            <SelectItem key={val} value={val}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Tema Event *
                      </Label>
                      <Input
                        name="title"
                        placeholder="Masukkan tema event"
                        defaultValue={editMode ? selectedEvent?.title : ""}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Deskripsi Event *
                    </Label>
                    <Textarea
                      name="description"
                      placeholder="Jelaskan detail kegiatan event..."
                      rows={3}
                      defaultValue={editMode ? selectedEvent?.description : ""}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Poster Event
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(ev) =>
                        setPosterFile(
                          ev.target.files ? ev.target.files[0] : null,
                        )
                      }
                    />
                    <p className="text-xs text-gray-500">
                      Format: JPG, PNG (Max: 2MB)
                    </p>
                  </div>
                  <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Tanggal *
                      </Label>
                      <Input
                        name="date"
                        type="date"
                        defaultValue={
                          editMode && selectedEvent?.date
                            ? new Date(selectedEvent.date)
                                .toISOString()
                                .split("T")[0]
                            : ""
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Jam *
                      </Label>
                      <Input
                        name="time"
                        placeholder="09:00 - 12:00 WIB"
                        defaultValue={editMode ? selectedEvent?.time : ""}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:gap-5 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Pemateri 1 *
                      </Label>
                      <Input
                        name="speaker1"
                        placeholder="Pemateri 1"
                        defaultValue={editMode ? selectedEvent?.speaker1 : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Pemateri 2
                      </Label>
                      <Input
                        name="speaker2"
                        placeholder="Opsional"
                        defaultValue={editMode ? selectedEvent?.speaker2 : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Pemateri 3
                      </Label>
                      <Input
                        name="speaker3"
                        placeholder="Opsional"
                        defaultValue={editMode ? selectedEvent?.speaker3 : ""}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:gap-5 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Moderator
                      </Label>
                      <Input
                        name="moderator"
                        placeholder="Nama moderator"
                        defaultValue={editMode ? selectedEvent?.moderator : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Lokasi *
                      </Label>
                      <Input
                        name="location"
                        placeholder="Ruang Seminar Lt.3"
                        defaultValue={editMode ? selectedEvent?.location : ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Kuota *
                      </Label>
                      <Input
                        name="quota"
                        type="number"
                        placeholder="50"
                        defaultValue={editMode ? selectedEvent?.quota : ""}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Tipe Event *
                      </Label>
                      <Select
                        value={eventType}
                        onValueChange={(v: "free" | "paid") => setEventType(v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tipe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Gratis</SelectItem>
                          <SelectItem value="paid">Berbayar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {eventType === "paid" && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Harga (Rp) *
                        </Label>
                        <Input
                          name="price"
                          type="number"
                          placeholder="50000"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                      </div>
                    )}
                  </div>

                  {/* Rules */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-gray-700">
                        Tata Tertib
                      </Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setRules([...rules, ""])}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Tambah
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {rules.map((rule, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3b82f6]/10 text-sm font-semibold text-[#2563eb] shrink-0">
                            {index + 1}
                          </div>
                          <Input
                            value={rule}
                            onChange={(e) => {
                              const n = [...rules];
                              n[index] = e.target.value;
                              setRules(n);
                            }}
                            placeholder={`Aturan ${index + 1}`}
                          />
                          {rules.length > 1 && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setRules(rules.filter((_, i) => i !== index))
                              }
                              className="shrink-0 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-gray-700">
                        Benefit
                      </Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setBenefits([...benefits, ""])}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Tambah
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <Input
                            value={benefit}
                            onChange={(e) => {
                              const n = [...benefits];
                              n[index] = e.target.value;
                              setBenefits(n);
                            }}
                            placeholder={`Benefit ${index + 1}`}
                          />
                          {benefits.length > 1 && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setBenefits(
                                  benefits.filter((_, i) => i !== index),
                                )
                              }
                              className="shrink-0 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false);
                        setEditMode(false);
                      }}
                      className="px-4 sm:px-6"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white border-0 px-4 sm:px-6 font-semibold"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {editMode ? "Update" : "Simpan"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
            {[
              { label: "Total Event", value: totalEvents },
              { label: "Event Aktif", value: activeEvents },
              { label: "Total Pendaftar", value: totalRegistrants },
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

      {/* ── Filter ── */}
      <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`group relative rounded-lg sm:rounded-xl px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all duration-300 overflow-hidden ${tab === t.key ? "text-white" : "text-gray-600 hover:text-gray-900"}`}
              >
                {tab === t.key && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] rounded-lg sm:rounded-xl" />
                )}
                {tab !== t.key && (
                  <div className="absolute inset-0 bg-gray-100 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          <Filter className="h-4 w-4" />
          <span>
            Menampilkan <strong>{searchFiltered.length}</strong> event
          </span>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-xl sm:rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                  Kategori
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                  Tanggal
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                  Peserta
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {searchFiltered.length > 0 ? (
                searchFiltered.map((event, idx) => (
                  <tr
                    key={event.id}
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white font-semibold text-xs sm:text-sm shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                          {event.title.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs sm:text-sm text-gray-900 group-hover:text-[#2563eb] transition-colors truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">
                            {event.title}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate hidden sm:block">
                            {event.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                      <Badge
                        variant="secondary"
                        className="bg-[#3b82f6]/10 text-[#2563eb] border-0 font-medium text-xs"
                      >
                        {event.categoryLabel}
                      </Badge>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                        {new Date(event.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {event.registered}
                        </span>
                        <span className="text-sm text-gray-500">
                          / {event.quota}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <Badge
                        className={`${event.available ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"} border-0 font-medium text-[10px] sm:text-xs`}
                      >
                        <div
                          className={`h-1.5 w-1.5 rounded-full mr-1 hidden sm:block ${event.available ? "bg-emerald-500" : "bg-gray-500"}`}
                        />
                        {event.available ? "Aktif" : "Nonaktif"}
                      </Badge>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewEvent(event)}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-[#3b82f6]/10 hover:text-[#2563eb]"
                          title="Lihat"
                        >
                          <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEvent(event)}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-[#3b82f6]/10 hover:text-[#2563eb]"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event)}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          title="Hapus"
                        >
                          <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <Search className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="font-semibold text-gray-900">
                        Tidak ada event ditemukan
                      </p>
                      <p className="text-sm text-gray-500">
                        Coba ubah filter atau kata kunci pencarian
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── View Dialog ── */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] sm:max-w-4xl">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className="bg-[#3b82f6]/10 text-[#2563eb] border-0 font-medium text-xs">
                    {selectedEvent.categoryLabel}
                  </Badge>
                  {selectedEvent.eventType === "paid" ? (
                    <Badge className="bg-red-100 text-red-700 border-0 font-medium text-xs">
                      Berbayar - Rp{" "}
                      {Number(selectedEvent.price).toLocaleString("id-ID")}
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-100 text-emerald-700 border-0 font-medium text-xs">
                      Gratis
                    </Badge>
                  )}
                  <Badge
                    className={`${selectedEvent.available ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"} border-0 font-medium text-xs`}
                  >
                    {selectedEvent.available ? "Aktif" : "Nonaktif"}
                  </Badge>
                </div>
                <DialogTitle className="font-display text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] bg-clip-text text-transparent">
                  {selectedEvent.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <div className="aspect-video rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={media(selectedEvent?.poster)}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {selectedEvent.description}
                </p>
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#3b82f6]/5 to-[#2563eb]/5 border border-[#3b82f6]/20">
                  {[
                    {
                      icon: Calendar,
                      label: "Tanggal",
                      value: new Date(selectedEvent.date).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      ),
                    },
                    { icon: Clock, label: "Waktu", value: selectedEvent.time },
                    {
                      icon: MapPin,
                      label: "Lokasi",
                      value: selectedEvent.location,
                    },
                    {
                      icon: Users,
                      label: "Kuota",
                      value: `${selectedEvent.registered} / ${selectedEvent.quota} peserta`,
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white shrink-0">
                        <item.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                          {item.label}
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 mt-0.5">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  ))}
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
                    onClick={() => {
                      setViewDialogOpen(false);
                      handleEditEvent(selectedEvent);
                    }}
                    className="flex-1 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white border-0"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Event
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

export default AdminEvents;
