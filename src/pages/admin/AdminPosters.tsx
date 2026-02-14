import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { mediaUrl } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  Copy,
  Calendar,
  Tag,
  Upload,
  Search,
  Filter,
  Sparkles,
  Eye,
  TrendingUp,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Poster = {
  id: string;
  title: string;
  type: string;
  image?: string;
  date?: string;
};

const typeIcons: Record<string, any> = {
  "Open Class": ImageIcon,
  Webinar: ImageIcon,
  Seminar: ImageIcon,
  Bootcamp: ImageIcon,
};

const AdminPosters = () => {
  const API = import.meta.env.VITE_API_URL || "";
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [typeVal, setTypeVal] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPoster, setSelectedPoster] = useState<Poster | null>(null);
  const { toast } = useToast();

  const token = localStorage.getItem("admin_token") || "";

  const fetchPosters = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/posters`);
      const data = await res.json();
      if (Array.isArray(data)) setPosters(data);
    } catch (e) {
      console.warn(e);
      toast({
        title: "Error",
        description: "Gagal memuat data poster",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  const resetForm = () => {
    setTitle("");
    setTypeVal("");
    setDate("");
    setFile(null);
    setFileName("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", title);
    fd.append("type", typeVal);
    fd.append("date", date);
    if (file) fd.append("image", file);

    const url = editingId
      ? `${API}/api/admin/posters/${editingId}`
      : `${API}/api/admin/posters`;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) {
        throw new Error(
          editingId ? "Gagal mengupdate poster" : "Gagal membuat poster",
        );
      }
      toast({
        title: editingId
          ? "✅ Poster Berhasil Diupdate"
          : "✅ Poster Berhasil Dibuat",
        duration: 3000,
      });
      resetForm();
      setDialogOpen(false);
      fetchPosters();
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus poster ini?")) return;
    try {
      const res = await fetch(`${API}/api/admin/posters/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("Gagal menghapus poster");
      }
      toast({
        title: "🗑️ Poster Dihapus",
        description: "Poster berhasil dihapus.",
        duration: 3000,
      });
      fetchPosters();
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleAddNew = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleEditPoster = (p: Poster) => {
    setEditingId(p.id);
    setTitle(p.title || "");
    setTypeVal(p.type || "");
    setDate(p.date || "");
    setDialogOpen(true);
  };

  const handleViewPoster = (p: Poster) => {
    setSelectedPoster(p);
    setViewDialogOpen(true);
  };

  // Filter posters
  const normalizeType = (s?: string) =>
    (s || "").toString().toLowerCase().replace(/[-_]/g, " ").trim();

  const filteredPosters = posters.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      q === "" ||
      p.title.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q);
    const matchType =
      filterType === "" || normalizeType(p.type) === normalizeType(filterType);
    return matchSearch && matchType;
  });

  // Stats
  const totalPosters = posters.length;
  const posterTypes = [...new Set(posters.map((p) => p.type))];

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
                  Poster Management
                </span>
              </div>
              <h1
                className="font-display text-3xl md:text-4xl font-bold text-white mb-2"
                style={{ textShadow: "0 0 30px rgba(255, 255, 255, 0.3)" }}
              >
                Kelola Posters
              </h1>
              <p className="text-gray-300">
                Tambah, edit, dan kelola poster event COCONUT
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
                  <Plus className="mr-2 h-5 w-5" /> Tambah Poster
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] bg-clip-text text-transparent">
                    {editingId ? "Edit Poster" : "Tambah Poster Baru"}
                  </DialogTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    {editingId
                      ? "Perbarui informasi poster"
                      : "Lengkapi form untuk menambahkan poster baru"}
                  </p>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Judul Poster <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="Masukkan judul poster"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                      />
                    </div>

                    {/* Type */}
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Tipe Event <span className="text-red-500">*</span>
                      </Label>
                      <select
                        className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20 transition-all bg-white text-gray-900"
                        value={typeVal}
                        onChange={(e) => setTypeVal(e.target.value)}
                        required
                      >
                        <option value="">Pilih Tipe Poster</option>
                        <option value="Open Class">Open Class</option>
                        <option value="Webinar">Webinar</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Bootcamp">Bootcamp</option>
                      </select>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Tanggal <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Contoh: 15 Maret 2025"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
                    />
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Upload Gambar Poster{" "}
                      {!editingId && <span className="text-red-500">*</span>}
                    </Label>
                    <label className="group flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-all hover:border-[#3b82f6] hover:bg-blue-50">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-white border-2 border-gray-200 group-hover:border-[#3b82f6] group-hover:bg-blue-50 transition-all">
                        <Upload className="h-7 w-7 text-gray-400 group-hover:text-[#3b82f6] transition-colors" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-semibold text-gray-900">
                          {fileName || "Klik untuk upload gambar"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          JPG, PNG • Rasio 3:4 (Portrait) • Maksimal 5MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          setFile(f);
                          setFileName(f?.name || "");
                        }}
                        required={!editingId}
                      />
                    </label>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false);
                        resetForm();
                      }}
                      className="px-6"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white border-0 px-6 font-semibold"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {editingId ? "Update" : "Simpan"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-2xl font-bold text-white">
                {totalPosters}
              </div>
              <div className="text-xs text-gray-300 mt-1">Total Poster</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-2xl font-bold text-white">
                {posterTypes.length}
              </div>
              <div className="text-xs text-gray-300 mt-1">Tipe Event</div>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="text-2xl font-bold text-white">
                {filteredPosters.length}
              </div>
              <div className="text-xs text-gray-300 mt-1">Ditampilkan</div>
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
              placeholder="Cari poster berdasarkan judul atau tipe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-300 focus:border-[#3b82f6] focus:ring-[#3b82f6]"
            />
          </div>

          {/* Type Filter */}
          <div>
            <Label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
              Tipe Event
            </Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterType === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("")}
                className={
                  filterType === ""
                    ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] border-0"
                    : ""
                }
              >
                Semua Tipe
              </Button>
              {["Open Class", "Webinar", "Seminar", "Bootcamp"].map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType(type)}
                  className={
                    filterType === type
                      ? "bg-gradient-to-r from-[#3b82f6] to-[#2563eb] border-0"
                      : ""
                  }
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 pt-4 border-t">
          <Filter className="h-4 w-4" />
          <span>
            Menampilkan{" "}
            <strong className="text-gray-900">{filteredPosters.length}</strong>{" "}
            poster
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
                  Poster
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tipe Event
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tanggal
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b82f6]"></div>
                      <p className="text-gray-600">Memuat poster...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredPosters.length > 0 ? (
                filteredPosters.map((p, idx) => (
                  <tr
                    key={p.id}
                    className="group hover:bg-gray-50 transition-colors"
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
                            {p.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 font-mono truncate">
                            ID: {p.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className="bg-[#3b82f6]/10 text-[#2563eb] border-0 font-medium">
                        {p.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {p.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <img
                          src={mediaUrl(p.image || "/placeholder.svg")}
                          alt={p.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPoster(p)}
                          className="h-8 w-8 p-0 hover:bg-[#3b82f6]/10 hover:text-[#2563eb] transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(p.id);
                            toast({
                              title: "✅ ID Disalin",
                              description:
                                "ID poster berhasil disalin ke clipboard",
                              duration: 2000,
                            });
                          }}
                          className="h-8 w-8 p-0 hover:bg-[#3b82f6]/10 hover:text-[#2563eb] transition-colors"
                          title="Copy ID"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditPoster(p)}
                          className="h-8 w-8 p-0 hover:bg-[#3b82f6]/10 hover:text-[#2563eb] transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(p.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Hapus"
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
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          Tidak ada poster ditemukan
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {searchQuery || filterType
                            ? "Coba ubah filter atau kata kunci pencarian"
                            : "Belum ada poster. Klik tombol di atas untuk menambahkan."}
                        </p>
                      </div>
                      {(searchQuery || filterType) && (
                        <Button
                          onClick={() => {
                            setSearchQuery("");
                            setFilterType("");
                          }}
                          className="mt-2 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white font-semibold"
                        >
                          Reset Filter
                        </Button>
                      )}
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
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selectedPoster && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[#3b82f6]/10 text-[#2563eb] border-0">
                    {selectedPoster.type}
                  </Badge>
                  <Badge variant="secondary">
                    <Calendar className="h-3 w-3 mr-1" />
                    {selectedPoster.date}
                  </Badge>
                </div>
                <DialogTitle className="font-display text-2xl md:text-3xl bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] bg-clip-text text-transparent">
                  {selectedPoster.title}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                {/* Poster Image */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-[#2563eb]" />
                    Preview Poster
                  </h3>
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <img
                      src={mediaUrl(selectedPoster.image || "/placeholder.svg")}
                      alt={selectedPoster.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                </div>

                {/* Poster Info */}
                <div className="space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Poster ID</p>
                    <p className="text-sm font-mono text-gray-700">
                      {selectedPoster.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tipe Event</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedPoster.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Tanggal</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {selectedPoster.date}
                    </p>
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
                      handleEditPoster(selectedPoster);
                    }}
                    className="flex-1 bg-gradient-to-r from-[#3b82f6] to-[#2563eb] hover:from-[#2563eb] hover:to-[#1d4ed8] text-white border-0"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Poster
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

export default AdminPosters;
