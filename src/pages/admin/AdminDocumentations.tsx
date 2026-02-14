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
  Upload,
  X,
  TrendingUp,
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
  // form state
  const [formCategory, setFormCategory] = useState<string>("");
  const [formCategoryLabel, setFormCategoryLabel] = useState<string>("");
  const [formYearInput, setFormYearInput] = useState<string>("");
  const [formTitle, setFormTitle] = useState<string>("");
  const [formDescription, setFormDescription] = useState<string>("");
  const [formEventID, setFormEventID] = useState<string>("");

  // Helper function untuk mendapatkan token admin
  const getAdminToken = () => {
    return localStorage.getItem("admin_token");
  };

  // Helper function untuk membuat header dengan authorization
  const getAuthHeaders = () => {
    const token = getAdminToken();
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

  // Stats
  const totalDocs = docs.length;
  const totalPhotos = docs.reduce((sum, d) => sum + (d.images?.length || 0), 0);
  const latestYear =
    docs.length > 0
      ? Math.max(...docs.map((d) => d.year || 0))
      : new Date().getFullYear();

  useEffect(() => {
    const fetchDocs = async () => {
      setLoadingDocs(true);
      try {
        const q = new URLSearchParams();
        if (catFilter !== "all") q.set("category", catFilter);
        if (yearFilter !== "all") q.set("year", String(yearFilter));
        if (searchQuery) q.set("q", searchQuery);

        // ✅ Gunakan endpoint ADMIN dengan authorization
        const res = await fetch(
          `${API}/api/admin/documentations?${q.toString()}`,
          {
            headers: getAuthHeaders(),
          },
        );

        if (!res.ok) {
          const errorData = await res
            .json()
            .catch(() => ({ message: "Gagal memuat data" }));
          throw new Error(errorData.message || "Gagal memuat dokumentasi");
        }

        const data = await res.json();
        if (Array.isArray(data)) setDocs(data);
      } catch (e) {
        console.error("Error fetching docs:", e);
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
    fetchDocs();
  }, [API, catFilter, yearFilter, searchQuery, toast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
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

    // ✅ Buat FormData
    const fd = new FormData();
    fd.append("category", formCategory);
    fd.append("category_label", formCategoryLabel);
    fd.append("event_title", formTitle);
    fd.append("year", formYearInput);
    fd.append("description", formDescription);

    // ✅ HANYA kirim event_id jika tidak kosong
    if (formEventID && formEventID.trim() !== "") {
      fd.append("event_id", formEventID);
    }

    // Tambahkan images
    if (imageFiles && imageFiles.length > 0) {
      for (const f of imageFiles) {
        fd.append("images", f);
      }
    }

    const token = getAdminToken();

    try {
      const url =
        editMode && selectedDoc
          ? `${API}/api/admin/documentations/${selectedDoc.id}`
          : `${API}/api/admin/documentations`;
      const method = editMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: fd,
      });

      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Error tidak diketahui" }));
        throw new Error(errorData.message || "Operasi gagal");
      }

      toast({
        title: editMode
          ? "✅ Dokumentasi Berhasil Diupdate"
          : "✅ Dokumentasi Berhasil Disimpan",
        duration: 3000,
      });

      setDialogOpen(false);
      setEditMode(false);
      setImageFiles(null);

      // Refresh list
      const res2 = await fetch(`${API}/api/admin/documentations`, {
        headers: getAuthHeaders(),
      });
      if (res2.ok) {
        const data = await res2.json();
        if (Array.isArray(data)) setDocs(data);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files) return setImageFiles(null);
    const arr = Array.from(files || []).slice(0, 10);
    setImageFiles(arr);
  };

  const handleViewDoc = (doc: any) => {
    setSelectedDoc(doc);
    setViewDialogOpen(true);
  };

  const handleEditDoc = (doc: any) => {
    setSelectedDoc(doc);
    setEditMode(true);
    setImageFiles(null);
    // populate form fields
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
    // reset form
    setFormCategory("");
    setFormCategoryLabel("");
    setFormYearInput("");
    setFormTitle("");
    setFormDescription("");
    setFormEventID("");
    setDialogOpen(true);
  };

  const handleDelete = (doc: any) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus dokumentasi "${doc.eventTitle}"?`,
      )
    ) {
      (async () => {
        const token = getAdminToken();
        try {
          const res = await fetch(`${API}/api/admin/documentations/${doc.id}`, {
            method: "DELETE",
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });

          if (!res.ok) {
            const errorData = await res
              .json()
              .catch(() => ({ message: "Gagal menghapus" }));
            throw new Error(errorData.message || "Gagal menghapus dokumentasi");
          }

          toast({
            title: "🗑️ Dokumentasi Dihapus",
            description: "Dokumentasi berhasil dihapus.",
            duration: 3000,
          });

          // ✅ Refresh list menggunakan endpoint ADMIN
          const res2 = await fetch(`${API}/api/admin/documentations`, {
            headers: getAuthHeaders(),
          });

          if (res2.ok) {
            const data = await res2.json();
            if (Array.isArray(data)) setDocs(data);
          }
        } catch (err) {
          toast({
            title: "Error",
            description: (err as Error).message,
            variant: "destructive",
            duration: 5000,
          });
        }
      })();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section with Gradient Background */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1628] via-[#0d2847] to-[#1e3a5f] p-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0yNCA0MGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTYiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />

        {/* Glowing Orbs */}
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
                  Documentation Management
                </span>
              </div>
              <h1
                className="font-display text-3xl md:text-4xl font-bold text-white mb-2"
                style={{ textShadow: "0 0 30px rgba(255, 255, 255, 0.3)" }}
              >
                Kelola Dokumentasi
              </h1>
              <p className="text-gray-300">
                Tambah, edit, dan kelola dokumentasi event COCONUT
              </p>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  onClick={handleAddNew}
                  className="bg-white text-[#2563eb] hover:bg-gray-50 font-semibold px-6 transition-all hover:scale-105 border-0"
                  style={{ boxShadow: "0 0 30px rgba(255, 255, 255, 0.3)" }}
                >
                  <Plus className="mr-2 h-5 w-5" /> Tambah Dokumentasi
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] bg-clip-text text-transparent">
                    {editMode ? "Edit Dokumentasi" : "Tambah Dokumentasi Baru"}
                  </DialogTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {editMode
                      ? "Perbarui informasi dokumentasi"
                      : "Lengkapi form untuk menambahkan dokumentasi baru"}
                  </p>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-5 mt-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Kategori Event *
                      </Label>
                      <Select
                        value={formCategory}
                        onValueChange={(v: string) => {
                          setFormCategory(v);
                          setFormCategoryLabel(
                            (categoryLabels as any)[v] || "",
                          );
                        }}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]">
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
                      <input
                        type="hidden"
                        name="category"
                        value={formCategory}
                      />
                      <input
                        type="hidden"
                        name="category_label"
                        value={formCategoryLabel}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Tahun *
                      </Label>
                      <Input
                        type="number"
                        name="year"
                        placeholder="2024"
                        value={formYearInput}
                        onChange={(e) => setFormYearInput(e.target.value)}
                        className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Batch Event *
                    </Label>
                    <Input
                      name="event_title"
                      placeholder="Masukkan Batch event"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Judul Event *
                    </Label>
                    <Textarea
                      name="description"
                      placeholder="Tuliskan Judul event ini..."
                      rows={4}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6] resize-none"
                    />
                    <input type="hidden" name="event_id" value={formEventID} />
                  </div>

                  {/* Image Upload Section (multipart) */}
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-gray-700">
                        Upload Gambar (maks 10)
                      </Label>
                      <span className="text-xs text-gray-500">
                        {imageFiles ? imageFiles.length : 0} dipilih
                      </span>
                    </div>
                    <div>
                      <input
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileChange(e.target.files)}
                        className="block w-full text-sm text-gray-700"
                      />
                    </div>

                    {/* existing images preview when editing */}
                    {editMode &&
                      ((selectedDoc?.images || []) as string[]).length > 0 && (
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-gray-700">
                            Gambar Saat Ini
                          </Label>
                          <div className="flex gap-2">
                            {(selectedDoc.images || []).map(
                              (img: string, i: number) => (
                                <div
                                  key={i}
                                  className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
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
                          <p className="text-xs text-gray-500">
                            Mengunggah gambar baru akan menambahkan ke galeri
                            (maks total 10 gambar).
                          </p>
                        </div>
                      )}
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false);
                        setEditMode(false);
                        setImageFiles(null);
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
                      {editMode ? "Update" : "Simpan"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-2xl font-bold text-white">{totalDocs}</div>
              <div className="text-xs text-gray-300 mt-1">
                Total Dokumentasi
              </div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-2xl font-bold text-white">{totalPhotos}</div>
              <div className="text-xs text-gray-300 mt-1">Total Foto</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-2xl font-bold text-white">{latestYear}</div>
              <div className="text-xs text-gray-300 mt-1">Tahun Terbaru</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari dokumentasi berdasarkan judul atau deskripsi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Category Filter */}
            <div className="flex-1">
              <Label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
                Kategori
              </Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={catFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCatFilter("all")}
                  className={
                    catFilter === "all"
                      ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] border-0"
                      : ""
                  }
                >
                  Semua
                </Button>
                {(
                  ["open-class", "webinar", "seminar", "bootcamp"] as const
                ).map((cat) => {
                  const Icon = categoryIcons[cat];
                  return (
                    <Button
                      key={cat}
                      variant={catFilter === cat ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCatFilter(cat)}
                      className={
                        catFilter === cat
                          ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] border-0"
                          : ""
                      }
                    >
                      <Icon className="h-3 w-3 mr-1" />
                      {categoryLabels[cat]}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Year Filter */}
            <div className="lg:w-auto">
              <Label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
                Tahun
              </Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={yearFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setYearFilter("all")}
                  className={
                    yearFilter === "all"
                      ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] border-0"
                      : ""
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
                        ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] border-0"
                        : ""
                    }
                  >
                    {y}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 pt-4 border-t">
          <Filter className="h-4 w-4" />
          <span>
            Menampilkan{" "}
            <strong className="text-gray-900">{filtered.length}</strong>{" "}
            dokumentasi
          </span>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tahun
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Jumlah Foto
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Preview
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] text-white font-semibold text-sm shadow-md group-hover:scale-110 transition-transform">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                          <div className="max-w-md">
                            <p className="font-semibold text-gray-900 group-hover:text-[#2563eb] transition-colors">
                              {doc.eventTitle}
                            </p>
                            <p className="text-xs font-semibold text-gray-500 mt-0.5 line-clamp-1">
                              {doc.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className="bg-[#3b82f6]/10 text-[#2563eb] border-0 font-medium">
                          <Icon className="h-3 w-3 mr-1" />
                          {doc.categoryLabel}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {doc.year}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {((doc.images || []) as string[]).length}
                          </span>
                          <span className="text-sm text-gray-500">foto</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {((doc.images || []) as string[])
                            .slice(0, 3)
                            .map((img, i) => (
                              <div
                                key={i}
                                className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200"
                              >
                                <img
                                  src={mediaUrl(img)}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ))}
                          {((doc.images || []) as string[]).length > 3 && (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                              <span className="text-xs font-semibold text-gray-600">
                                +{((doc.images || []) as string[]).length - 3}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDoc(doc)}
                            className="h-8 w-8 p-0 hover:bg-[#3b82f6]/10 hover:text-[#2563eb] transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditDoc(doc)}
                            className="h-8 w-8 p-0 hover:bg-[#3b82f6]/10 hover:text-[#2563eb] transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(doc)}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {loadingDocs
                            ? "Memuat data..."
                            : "Tidak ada dokumentasi ditemukan"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {!loadingDocs &&
                            (searchQuery ||
                            catFilter !== "all" ||
                            yearFilter !== "all"
                              ? "Coba ubah filter atau kata kunci pencarian"
                              : "Belum ada dokumentasi. Klik tombol di atas untuk menambahkan.")}
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

      {/* View Detail Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
          {selectedDoc && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[#3b82f6]/10 text-[#2563eb] border-0">
                    {(() => {
                      const Icon = (categoryIcons[selectedDoc.category] ??
                        ImageIcon) as any;
                      return (
                        <>
                          <Icon className="h-3 w-3 mr-1" />
                          {selectedDoc.categoryLabel}
                        </>
                      );
                    })()}
                  </Badge>
                  <Badge variant="secondary">
                    <Calendar className="h-3 w-3 mr-1" />
                    {selectedDoc.year}
                  </Badge>
                </div>
                <DialogTitle className="font-display text-2xl md:text-3xl bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] bg-clip-text text-transparent">
                  {selectedDoc.eventTitle}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Description */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Deskripsi</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedDoc.description}
                  </p>
                </div>

                {/* Image Gallery */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-[#2563eb]" />
                    Galeri Foto (
                    {((selectedDoc.images || []) as string[]).length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {((selectedDoc.images || []) as string[]).map(
                      (img: string, i: number) => (
                        <div
                          key={i}
                          className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200"
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

                {/* Actions */}
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
                      handleEditDoc(selectedDoc);
                    }}
                    className="flex-1 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white border-0"
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
