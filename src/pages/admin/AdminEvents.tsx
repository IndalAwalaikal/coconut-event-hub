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
  TrendingUp,
  CheckCircle,
  AlertCircle,
  MapPin,
  Clock,
  User,
  ArrowLeft,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const tabs: { key: EventCategory | "all"; label: string; icon?: any }[] = [
  { key: "all", label: "Semua Event" },
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
    undefined
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
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const API = import.meta.env.VITE_API_URL || "";
    const token = localStorage.getItem("admin_token");
    const submit = async () => {
      try {
        const formEl = e.target as HTMLFormElement;
        const form = new FormData(formEl);

        if (selectedCategory) {
          form.set("category", selectedCategory);
          form.set(
            "categoryLabel",
            (categoryLabels as any)[selectedCategory as EventCategory] || ""
          );
        }

        form.set("eventType", eventType);
        if (eventType === "paid" && price) {
          form.set("price", price);
        } else {
          form.set("price", "0");
        }

        form.delete("rules");
        form.delete("benefits");

        rules.forEach((rule) => {
          if (rule.trim()) {
            form.append("rules", rule);
          }
        });

        benefits.forEach((benefit) => {
          if (benefit.trim()) {
            form.append("benefits", benefit);
          }
        });

        if (posterFile) {
          form.append("poster", posterFile);
        }

        const url =
          editMode && selectedEvent?.id
            ? `${API}/api/admin/events/${selectedEvent.id}`
            : `${API}/api/admin/events`;
        const method = editMode ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: form,
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "failed");
        }

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
          description: editMode
            ? "Event telah diperbarui."
            : "Event baru telah ditambahkan ke daftar.",
          duration: 3000,
        });

        const ref = await fetch(`${API}/api/events`);
        if (ref.ok) {
          const data = await ref.json();
          if (Array.isArray(data)) setEvents(data);
        }
      } catch (err: any) {
        console.error(err);
        toast({
          title: "Error",
          description: err?.message || String(err),
          duration: 4000,
        });
      }
    };
    submit();
  };

  const handleAddRule = () => {
    setRules([...rules, ""]);
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleRuleChange = (index: number, value: string) => {
    const newRules = [...rules];
    newRules[index] = value;
    setRules(newRules);
  };

  const handleAddBenefit = () => {
    setBenefits([...benefits, ""]);
  };

  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
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
    if (
      !window.confirm(
        `Apakah Anda yakin ingin menghapus event "${event.title}"?`
      )
    )
      return;
    const API = import.meta.env.VITE_API_URL || "";
    const token = localStorage.getItem("admin_token");
    (async () => {
      try {
        const res = await fetch(`${API}/api/admin/events/${event.id}`, {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "failed to delete");
        }
        toast({
          title: "🗑️ Event Dihapus",
          description: "Event berhasil dihapus.",
          duration: 3000,
        });
        const ref = await fetch(`${API}/api/events`);
        if (ref.ok) {
          const data = await ref.json();
          if (Array.isArray(data)) setEvents(data);
        }
      } catch (err: any) {
        console.error(err);
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
    0
  );

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1628] via-[#0d2847] to-[#1e3a5f] p-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0yNCA0MGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTYiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        <div className="absolute -right-20 top-0 h-48 w-48 rounded-full bg-gradient-to-br from-[#3b82f6]/20 to-[#60a5fa]/20 blur-3xl" />
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
                  Event Management
                </span>
              </div>
              <h1
                className="font-display text-3xl md:text-4xl font-bold text-white mb-2"
                style={{ textShadow: "0 0 30px rgba(255, 255, 255, 0.3)" }}
              >
                Kelola Event
              </h1>
              <p className="text-gray-300">
                Tambah, edit, dan kelola semua event kegiatan COCONUT
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  onClick={handleAddNewEvent}
                  className="bg-white text-[#2563eb] hover:bg-gray-50 font-semibold px-6 transition-all hover:scale-105 border-0"
                  style={{ boxShadow: "0 0 30px rgba(255, 255, 255, 0.3)" }}
                >
                  <Plus className="mr-2 h-5 w-5" /> Tambah Event Baru
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] bg-clip-text text-transparent">
                    {editMode ? "Edit Event" : "Tambah Event Baru"}
                  </DialogTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {editMode
                      ? "Perbarui informasi event"
                      : "Lengkapi form di bawah untuk menambahkan event baru"}
                  </p>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-5 mt-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Kategori Event *
                      </Label>
                      <Select
                        value={selectedCategory}
                        onValueChange={(v) => setSelectedCategory(v)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]">
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {(
                            Object.entries(categoryLabels) as [
                              EventCategory,
                              string
                            ][]
                          ).map(([val, label]) => (
                            <SelectItem key={val} value={val}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <input
                        type="hidden"
                        name="category"
                        value={selectedCategory ?? ""}
                      />
                      <input
                        type="hidden"
                        name="categoryLabel"
                        value={
                          selectedCategory
                            ? (categoryLabels as any)[
                                selectedCategory as EventCategory
                              ]
                            : ""
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Tema Event *
                      </Label>
                      <Input
                        name="title"
                        placeholder="Masukkan tema event"
                        defaultValue={editMode ? selectedEvent?.title : ""}
                        className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
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
                      rows={4}
                      defaultValue={editMode ? selectedEvent?.description : ""}
                      className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6] resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Poster Event *
                    </Label>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                        onChange={(ev) =>
                          setPosterFile(
                            ev.target.files ? ev.target.files[0] : null
                          )
                        }
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Format: JPG, PNG (Max: 2MB)
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Tanggal Pelaksanaan *
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
                        className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Jam Pelaksanaan *
                      </Label>
                      <Input
                        name="time"
                        placeholder="Contoh: 09:00 - 12:00 WIB"
                        defaultValue={editMode ? selectedEvent?.time : ""}
                        className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">
                      Pemateri
                    </Label>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Input
                          name="speaker1"
                          placeholder="Pemateri 1 *"
                          defaultValue={editMode ? selectedEvent?.speaker1 : ""}
                          className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Input
                          name="speaker2"
                          placeholder="Pemateri 2 (Opsional)"
                          defaultValue={editMode ? selectedEvent?.speaker2 : ""}
                          className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Input
                          name="speaker3"
                          placeholder="Pemateri 3 (Opsional)"
                          defaultValue={editMode ? selectedEvent?.speaker3 : ""}
                          className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Moderator
                      </Label>
                      <Input
                        name="moderator"
                        placeholder="Nama moderator"
                        defaultValue={editMode ? selectedEvent?.moderator : ""}
                        className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Lokasi *
                      </Label>
                      <Input
                        name="location"
                        placeholder="Contoh: Ruang Seminar Lt.3"
                        defaultValue={editMode ? selectedEvent?.location : ""}
                        className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Kuota Peserta *
                      </Label>
                      <Input
                        name="quota"
                        type="number"
                        placeholder="50"
                        defaultValue={editMode ? selectedEvent?.quota : ""}
                        className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                      />
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Status Event *
                      </Label>
                      <Select
                        value={eventType}
                        onValueChange={(v: "free" | "paid") => setEventType(v)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]">
                          <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Gratis</SelectItem>
                          <SelectItem value="paid">Berbayar</SelectItem>
                        </SelectContent>
                      </Select>
                      <input type="hidden" name="eventType" value={eventType} />
                    </div>
                    {eventType === "paid" && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Harga Tiket *
                        </Label>
                        <Input
                          name="price"
                          type="number"
                          placeholder="Contoh: 50000"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                        />
                        <p className="text-xs text-gray-500">
                          Masukkan harga dalam Rupiah (tanpa titik)
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-gray-700">
                        Tata Tertib / Persyaratan 
                      </Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleAddRule}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Tambah Aturan
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {rules.map((rule, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3b82f6]/10 text-sm font-semibold text-[#2563eb] shrink-0">
                            {index + 1}
                          </div>
                          <Input
                            placeholder={`Aturan ${index + 1}`}
                            name="rules"
                            value={rule}
                            onChange={(e) => handleRuleChange(index, e.target.value)}
                            className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                          />
                          {rules.length > 1 && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveRule(index)}
                              className="shrink-0 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-gray-700">
                        Benefit Event
                      </Label>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleAddBenefit}
                        className="text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" /> Tambah Benefit
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <Input
                            placeholder={`Benefit ${index + 1}`}
                            name="benefits"
                            value={benefit}
                            onChange={(e) =>
                              handleBenefitChange(index, e.target.value)
                            }
                            className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                          />
                          {benefits.length > 1 && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveBenefit(index)}
                              className="shrink-0 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false);
                        setEditMode(false);
                        setRules([""]);
                        setBenefits([""]);
                        setEventType("free");
                        setPrice("");
                      }}
                      className="px-6"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white border-0 px-6 font-semibold"
                    >
                      <Plus className="mr-2 h-4 w-4" />{" "}
                      {editMode ? "Update Event" : "Simpan Event"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-2xl font-bold text-white">{totalEvents}</div>
              <div className="text-xs text-gray-300 mt-1">Total Event</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-2xl font-bold text-white">
                {activeEvents}
              </div>
              <div className="text-xs text-gray-300 mt-1">Event Aktif</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-2xl font-bold text-white">
                {totalRegistrants}
              </div>
              <div className="text-xs text-gray-300 mt-1">Total Pendaftar</div>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari event berdasarkan nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`group relative rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 overflow-hidden ${
                  tab === t.key
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab === t.key && (
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] rounded-xl"
                    style={{ boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
                  />
                )}
                {tab !== t.key && (
                  <div className="absolute inset-0 bg-gray-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <Filter className="h-4 w-4" />
          <span>
            Menampilkan{" "}
            <strong className="text-gray-900">{searchFiltered.length}</strong>{" "}
            event
          </span>
        </div>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Peserta
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white font-semibold text-sm shadow-md group-hover:scale-110 transition-transform">
                          {event.title.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 group-hover:text-[#2563eb] transition-colors">
                            {event.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {event.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="secondary"
                        className="bg-[#3b82f6]/10 text-[#2563eb] border-0 font-medium"
                      >
                        {event.categoryLabel}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(event.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {event.registered}
                        </span>
                        <span className="text-sm text-gray-500">
                          / {event.quota}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 w-24 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb]"
                          style={{
                            width: `${(event.registered / event.quota) * 100}%`,
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={`${
                          event.available
                            ? "bg-emerald-100 text-emerald-700 border-0"
                            : "bg-gray-200 text-gray-600 border-0"
                        } font-medium`}
                      >
                        <div
                          className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                            event.available ? "bg-emerald-500" : "bg-gray-500"
                          }`}
                        />
                        {event.available ? "Aktif" : "Belum Tersedia"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewEvent(event)}
                          className="h-8 w-8 p-0 hover:bg-[#3b82f6]/10 hover:text-[#2563eb] transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEvent(event)}
                          className="h-8 w-8 p-0 hover:bg-[#3b82f6]/10 hover:text-[#2563eb] transition-colors"
                          title="Edit Event"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event)}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Hapus Event"
                        >
                          <Trash2 className="h-4 w-4" />
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
                      <div>
                        <p className="font-semibold text-gray-900">
                          Tidak ada event ditemukan
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Coba ubah filter atau kata kunci pencarian
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          {selectedEvent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-[#3b82f6]/10 text-[#2563eb] border-0 font-medium">
                    {selectedEvent.categoryLabel}
                  </Badge>
                  {selectedEvent.eventType === "paid" ? (
                    <Badge className="bg-red-100 text-red-700 border-0 font-medium">
                      Berbayar - Rp {Number(selectedEvent.price).toLocaleString('id-ID')}
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-100 text-emerald-700 border-0 font-medium">
                      Gratis
                    </Badge>
                  )}
                  <Badge
                    className={`${
                      selectedEvent.available
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-200 text-gray-600"
                    } border-0 font-medium`}
                  >
                    <div
                      className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                        selectedEvent.available
                          ? "bg-emerald-500"
                          : "bg-gray-500"
                      }`}
                    />
                    {selectedEvent.available ? "Aktif" : "Belum Tersedia"}
                  </Badge>
                </div>
                <DialogTitle className="font-display text-2xl md:text-3xl bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] bg-clip-text text-transparent">
                  {selectedEvent.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6 mt-6">
                <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={media(selectedEvent?.poster)}
                    alt={selectedEvent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">
                    Deskripsi Event
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-gradient-to-br from-[#3b82f6]/5 to-[#2563eb]/5 border border-[#3b82f6]/20">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white shrink-0">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Tanggal
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">
                        {new Date(selectedEvent.date).toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white shrink-0">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Waktu
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">
                        {selectedEvent.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Lokasi
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">
                        {selectedEvent.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white shrink-0">
                      <Users className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        Kuota Peserta
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">
                        {selectedEvent.registered} / {selectedEvent.quota}{" "}
                        peserta
                      </p>
                      <div className="mt-2 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#3b82f6] to-[#2563eb]"
                          style={{
                            width: `${(selectedEvent.registered / selectedEvent.quota) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-3 p-5 rounded-2xl border border-gray-200 bg-white">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <User className="h-4 w-4 text-[#2563eb]" />
                      Pemateri
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="h-2 w-2 rounded-full bg-[#3b82f6]" />
                        {selectedEvent.speaker1}
                      </div>
                      {selectedEvent.speaker2 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="h-2 w-2 rounded-full bg-[#3b82f6]" />
                          {selectedEvent.speaker2}
                        </div>
                      )}
                      {selectedEvent.speaker3 && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="h-2 w-2 rounded-full bg-[#3b82f6]" />
                          {selectedEvent.speaker3}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3 p-5 rounded-2xl border border-gray-200 bg-white">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <User className="h-4 w-4 text-[#8b5cf6]" />
                      Moderator
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="h-2 w-2 rounded-full bg-[#8b5cf6]" />
                      {selectedEvent.moderator}
                    </div>
                  </div>
                </div>
                {selectedEvent.rules && selectedEvent.rules.length > 0 && (
                  <div className="space-y-3 p-5 rounded-2xl border border-gray-200 bg-white">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-[#2563eb]" />
                      Tata Tertib
                    </h3>
                    <ul className="space-y-2">
                      {selectedEvent.rules.map((rule: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-gray-600"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3b82f6]/10 text-xs font-bold text-[#2563eb]">
                            {i + 1}
                          </span>
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {selectedEvent.benefits &&
                  selectedEvent.benefits.length > 0 && (
                    <div className="space-y-3 p-5 rounded-2xl border border-gray-200 bg-white">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                        Benefit
                      </h3>
                      <ul className="space-y-2">
                        {selectedEvent.benefits.map(
                          (benefit: string, i: number) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-sm text-gray-600"
                            >
                              <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500" />
                              {benefit}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
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
                      setViewDialogOpen(false);
                      handleEditEvent(selectedEvent);
                    }}
                    className="flex-1 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white border-0"
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