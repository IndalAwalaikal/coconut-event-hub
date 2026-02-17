// ─────────────────────────────────────────────────────────
// AdminDocumentation.tsx  – fully responsive
// ─────────────────────────────────────────────────────────
import { useState, useMemo, useEffect } from "react";
import { categoryLabels, type EventCategory } from "@/data/mockData";
import { mediaUrl } from "@/lib/utils";
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
  Eye,
  Trash2,
  Search,
  Filter,
  Sparkles,
  Image as ImageIcon,
  Calendar,
  BookOpen,
  Users,
  Trophy,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const categoryIcons: Record<string, any> = {
  "open-class": BookOpen,
  webinar: Users,
  seminar: Trophy,
  bootcamp: Zap,
};

const AdminDocumentation = () => {
  const [catFilter, setCatFilter] = useState<EventCategory | "all">("all");
  const [yearFilter, setYearFilter] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[] | null>(null);
  const { toast } = useToast();
  const API = import.meta.env.VITE_API_URL || "";
  const [docs, setDocs] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [formCategory, setFormCategory] = useState("");
  const [formCategoryLabel, setFormCategoryLabel] = useState("");
  const [formYearInput, setFormYearInput] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formEventID, setFormEventID] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("admin_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

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

  const totalDocs = docs.length;
  const totalPhotos = docs.reduce((sum, d) => sum + (d.images?.length || 0), 0);
  const latestYear =
    docs.length > 0
      ? Math.max(...docs.map((d) => d.year || 0))
      : new Date().getFullYear();

  const fetchDocs = async () => {
    setLoadingDocs(true);
    try {
      const q = new URLSearchParams();
      if (catFilter !== "all") q.set("category", catFilter);
      if (yearFilter !== "all") q.set("year", String(yearFilter));
      if (searchQuery) q.set("q", searchQuery);
      const res = await fetch(
        `${API}/api/admin/documentations?${q.toString()}`,
        { headers: getAuthHeaders() },
      );
      if (!res.ok) throw new Error("Gagal memuat dokumentasi");
      const data = await res.json();
      if (Array.isArray(data)) setDocs(data);
    } catch (e) {
      toast({
        title: "Error",
        description: (e as Error).message,
        variant: "destructive",
      });
      setDocs([]);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [API, catFilter, yearFilter, searchQuery]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const existingCount = (selectedDoc?.images || []).length || 0;
    const newCount = imageFiles ? imageFiles.length : 0;
    if (!editMode && newCount === 0) {
      toast({
        title: "Pilih setidaknya 1 gambar",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    if (existingCount + newCount > 10) {
      toast({
        title: "Maksimum 10 gambar",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const fd = new FormData();
    fd.append("category", formCategory);
    fd.append("category_label", formCategoryLabel);
    fd.append("event_title", formTitle);
    fd.append("year", formYearInput);
    fd.append("description", formDescription);
    if (formEventID.trim()) fd.append("event_id", formEventID);
    if (imageFiles) {
      for (const f of imageFiles) fd.append("images", f);
    }

    const token = localStorage.getItem("admin_token");
    try {
      const url =
        editMode && selectedDoc
          ? `${API}/api/admin/documentations/${selectedDoc.id}`
          : `${API}/api/admin/documentations`;
      const res = await fetch(url, {
        method: editMode ? "PUT" : "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });
      if (!res.ok)
        throw new Error(
          (await res.json().catch(() => ({}))).message || "Operasi gagal",
        );
      toast({
        title: editMode ? "✅ Dokumentasi Diupdate" : "✅ Dokumentasi Disimpan",
        duration: 3000,
      });
      setDialogOpen(false);
      setEditMode(false);
      setImageFiles(null);
      fetchDocs();
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleDelete = (doc: any) => {
    if (!window.confirm(`Hapus dokumentasi "${doc.eventTitle}"?`)) return;
    (async () => {
      const token = localStorage.getItem("admin_token");
      try {
        const res = await fetch(`${API}/api/admin/documentations/${doc.id}`, {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) throw new Error("Gagal menghapus");
        toast({ title: "🗑️ Dokumentasi Dihapus", duration: 3000 });
        fetchDocs();
      } catch (err) {
        toast({
          title: "Error",
          description: (err as Error).message,
          variant: "destructive",
          duration: 5000,
        });
      }
    })();
  };

  const handleEditDoc = (doc: any) => {
    setSelectedDoc(doc);
    setEditMode(true);
    setImageFiles(null);
    setFormCategory(doc.category || "");
    setFormCategoryLabel(
      doc.categoryLabel || (categoryLabels as any)[doc.category] || "",
    );
    setFormYearInput(doc.year ? String(doc.year) : "");
    setFormTitle(doc.eventTitle || "");
    setFormDescription(doc.description || "");
    setFormEventID(doc.eventId || "");
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setSelectedDoc(null);
    setEditMode(false);
    setImageFiles(null);
    setFormCategory("");
    setFormCategoryLabel("");
    setFormYearInput("");
    setFormTitle("");
    setFormDescription("");
    setFormEventID("");
    setDialogOpen(true);
  };

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
                  Documentation Management
                </span>
              </div>
              <h1
                className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2"
                style={{ textShadow: "0 0 30px rgba(255,255,255,0.3)" }}
              >
                Kelola Dokumentasi
              </h1>
              <p className="text-gray-300 text-xs sm:text-sm">
                Tambah, edit, dan kelola dokumentasi event COCONUT
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={handleAddNew}
                  className="bg-white text-[#2563eb] hover:bg-gray-50 font-semibold transition-all hover:scale-105 border-0 w-full sm:w-auto"
                  style={{ boxShadow: "0 0 30px rgba(255,255,255,0.3)" }}
                >
                  <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> Tambah
                  Dokumentasi
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="font-display text-xl sm:text-2xl bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] bg-clip-text text-transparent">
                    {editMode ? "Edit Dokumentasi" : "Tambah Dokumentasi Baru"}
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
                        value={formCategory}
                        onValueChange={(v) => {
                          setFormCategory(v);
                          setFormCategoryLabel(
                            (categoryLabels as any)[v] || "",
                          );
                        }}
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
                        Tahun *
                      </Label>
                      <Input
                        type="number"
                        placeholder="2024"
                        value={formYearInput}
                        onChange={(e) => setFormYearInput(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Batch Event *
                    </Label>
                    <Input
                      placeholder="Masukkan batch event"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Judul Event *
                    </Label>
                    <Textarea
                      placeholder="Tuliskan judul event..."
                      rows={3}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-gray-700">
                        Upload Gambar (maks 10)
                      </Label>
                      <span className="text-xs text-gray-500">
                        {imageFiles ? imageFiles.length : 0} dipilih
                      </span>
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        if (!e.target.files) {
                          setImageFiles(null);
                          return;
                        }
                        setImageFiles(Array.from(e.target.files).slice(0, 10));
                      }}
                    />
                    {editMode && (selectedDoc?.images || []).length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-gray-700">
                          Gambar Saat Ini
                        </Label>
                        <div className="flex flex-wrap gap-2">
                          {(selectedDoc.images || []).map(
                            (img: string, i: number) => (
                              <div
                                key={i}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                              >
                                <img
                                  src={mediaUrl(img)}
                                  alt={`img-${i}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2 sm:gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false);
                        setEditMode(false);
                        setImageFiles(null);
                      }}
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white border-0 font-semibold"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {editMode ? "Update" : "Simpan"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
            {[
              { label: "Total Dokumentasi", value: totalDocs },
              { label: "Total Foto", value: totalPhotos },
              { label: "Tahun Terbaru", value: latestYear },
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
              placeholder="Cari dokumentasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div>
            <Label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase mb-2 block">
              Kategori
            </Label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <Button
                variant={catFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setCatFilter("all")}
                className={
                  catFilter === "all"
                    ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] border-0 text-xs"
                    : "text-xs"
                }
              >
                Semua
              </Button>
              {(["open-class", "webinar", "seminar", "bootcamp"] as const).map(
                (cat) => {
                  const Icon = categoryIcons[cat];
                  return (
                    <Button
                      key={cat}
                      variant={catFilter === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCatFilter(cat)}
                      className={
                        catFilter === cat
                          ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] border-0 text-xs"
                          : "text-xs"
                      }
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {categoryLabels[cat]}
                    </Button>
                  );
                },
              )}
            </div>
          </div>
          {years.length > 0 && (
            <div>
              <Label className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase mb-2 block">
                Tahun
              </Label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <Button
                  variant={yearFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setYearFilter("all")}
                  className={
                    yearFilter === "all"
                      ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] border-0 text-xs"
                      : "text-xs"
                  }
                >
                  Semua
                </Button>
                {years.map((y) => (
                  <Button
                    key={y}
                    variant={yearFilter === y ? "default" : "outline"}
                    size="sm"
                    onClick={() => setYearFilter(y)}
                    className={
                      yearFilter === y
                        ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] border-0 text-xs"
                        : "text-xs"
                    }
                  >
                    {y}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm text-gray-600 pt-3 sm:pt-4 border-t">
          <Filter className="h-4 w-4" />
          <span>
            Menampilkan <strong>{filtered.length}</strong> dokumentasi
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
                  Event
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                  Kategori
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">
                  Tahun
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">
                  Preview
                </th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((doc, idx) => {
                  const Icon = (categoryIcons[doc.category] ??
                    ImageIcon) as any;
                  return (
                    <tr
                      key={doc.id}
                      className="group hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500 font-medium">
                        {idx + 1}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                            <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs sm:text-sm text-gray-900 group-hover:text-[#2563eb] truncate max-w-[110px] sm:max-w-[180px] md:max-w-none">
                              {doc.eventTitle}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 line-clamp-1 hidden sm:block">
                              {doc.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                        <Badge className="bg-[#3b82f6]/10 text-[#2563eb] border-0 font-medium text-xs">
                          <Icon className="h-3 w-3 mr-1" />
                          {doc.categoryLabel}
                        </Badge>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                          <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                          {doc.year}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
                        <div className="flex gap-1">
                          {((doc.images || []) as string[])
                            .slice(0, 3)
                            .map((img, i) => (
                              <div
                                key={i}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                              >
                                <img
                                  src={mediaUrl(img)}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          {((doc.images || []) as string[]).length > 3 && (
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                              <span className="text-[10px] sm:text-xs font-semibold text-gray-600">
                                +{((doc.images || []) as string[]).length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedDoc(doc);
                              setViewDialogOpen(true);
                            }}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-[#3b82f6]/10 hover:text-[#2563eb]"
                            title="Lihat"
                          >
                            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDoc(doc)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-[#3b82f6]/10 hover:text-[#2563eb]"
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(doc)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-red-50 hover:text-red-600"
                            title="Hapus"
                          >
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="font-semibold text-gray-900">
                        {loadingDocs
                          ? "Memuat data..."
                          : "Tidak ada dokumentasi ditemukan"}
                      </p>
                      {!loadingDocs && (
                        <p className="text-sm text-gray-500">
                          {searchQuery ||
                          catFilter !== "all" ||
                          yearFilter !== "all"
                            ? "Coba ubah filter"
                            : "Belum ada dokumentasi."}
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto w-[95vw] sm:max-w-4xl">
          {selectedDoc && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className="bg-[#3b82f6]/10 text-[#2563eb] border-0 text-xs">
                    {selectedDoc.categoryLabel}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {selectedDoc.year}
                  </Badge>
                </div>
                <DialogTitle className="font-display text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] bg-clip-text text-transparent">
                  {selectedDoc.eventTitle}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {selectedDoc.description}
                </p>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                    <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-[#2563eb]" />
                    Galeri Foto (
                    {((selectedDoc.images || []) as string[]).length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                    {((selectedDoc.images || []) as string[]).map(
                      (img: string, i: number) => (
                        <div
                          key={i}
                          className="aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
                        >
                          <img
                            src={mediaUrl(img)}
                            alt={`Foto ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ),
                    )}
                  </div>
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
                      handleEditDoc(selectedDoc);
                    }}
                    className="flex-1 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white border-0"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Dokumentasi
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

export default AdminDocumentation;
