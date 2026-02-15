import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryLabels, type EventCategory } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle,
  Upload,
  User,
  Phone,
  Building2,
  Calendar,
  ArrowRight,
  FileText,
  Sparkles,
  AlertCircle,
  CreditCard,
  Instagram,
  Info,
} from "lucide-react";

const Register = () => {
  const [searchParams] = useSearchParams();
  const preselectedEvent = searchParams.get("event");

  const API = import.meta.env.VITE_API_URL || "";
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [category, setCategory] = useState<EventCategory | "">("");
  const [eventId, setEventId] = useState(preselectedEvent ?? "");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [institution, setInstitution] = useState("");
  const [fileName, setFileName] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const isValidImageFile = (file: File): boolean => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type.toLowerCase())) {
      toast({
        title: "Format Tidak Didukung",
        description:
          "Hanya file gambar (JPG, PNG, WEBP, GIF) yang diperbolehkan",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "Ukuran File Terlalu Besar",
        description: "Maksimal ukuran file adalah 5MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/events`);
        if (!res.ok) throw new Error("failed to fetch events");
        const data = await res.json();
        if (Array.isArray(data)) setEvents(data);
        if (preselectedEvent && Array.isArray(data)) {
          const pre = data.find((e: any) => e.id === preselectedEvent);
          if (pre) {
            setCategory(pre.category);
            setEventId(preselectedEvent);
          }
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [API, preselectedEvent]);

  const availableEvents = useMemo(
    () =>
      events.filter(
        (e) => e.category === category && e.available && e.registered < e.quota,
      ),
    [events, category],
  );

  const unavailableEvents = useMemo(
    () =>
      events.filter(
        (e) =>
          e.category === category && (!e.available || e.registered >= e.quota),
      ),
    [events, category],
  );

  const selectedEvent = events.find((e) => e.id === eventId);
  const isPaidEvent = selectedEvent?.eventType === "paid";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !eventId || !name || !whatsapp || !institution) {
      toast({
        title: "Error",
        description: "Harap lengkapi semua field yang wajib diisi",
        variant: "destructive",
      });
      return;
    }

    const fd = new FormData();
    fd.append("event_id", eventId);
    fd.append("name", name);
    fd.append("whatsapp", whatsapp);
    fd.append("institution", institution);
    fd.append("file_name", fileName || "");
    if (proofFile) fd.append("proof", proofFile);

    try {
      const res = await fetch(`${API}/api/registrations`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Pendaftaran gagal");
      }
      const data = await res.json();
      setSubmitted(true);
      toast({
        title: "Pendaftaran Berhasil!",
        description: "Data pendaftaran Anda telah tersimpan.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-2xl">
            <div className="text-center animate-slide-up">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mb-6 shadow-lg shadow-green-500/20">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600">
                  <CheckCircle
                    className="h-12 w-12 text-white"
                    strokeWidth={2.5}
                  />
                </div>
              </div>

              <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-[#3b82f6] via-[#2563eb] to-[#1e40af] bg-clip-text text-transparent">
                  Pendaftaran Berhasil!
                </span>
              </h2>
              <p className="text-lg text-gray-600 mb-3">
                Terima kasih,{" "}
                <span className="font-semibold text-gray-900">{name}</span>!
              </p>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                Pendaftaran Anda untuk event{" "}
                <span className="font-semibold text-[#2563eb]">
                  {selectedEvent?.title}
                </span>{" "}
                telah berhasil. Informasi lebih lanjut akan dikirim melalui
                WhatsApp.
              </p>

              <div className="grid gap-4 md:grid-cols-2 mb-8 text-left">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white shrink-0">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Event</p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {selectedEvent?.title}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shrink-0">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">WhatsApp</p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {whatsapp}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white hover:text-white font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
                  onClick={() => {
                    setSubmitted(false);
                    setCategory("");
                    setEventId("");
                    setName("");
                    setWhatsapp("");
                    setInstitution("");
                    setFileName("");
                    setProofFile(null);
                  }}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Daftar Event Lain
                </Button>
                <Link to="/events">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 font-semibold transition-all"
                  >
                    Lihat Event Lainnya
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a1628] border-b border-gray-800/50">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE0YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNk0yNCA0MGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTYiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        </div>

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
          <div className="mx-auto max-w-3xl text-center">
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white border border-white/20 animate-slide-up"
              style={{ animationDelay: "0.1s" }}
            >
              <FileText className="h-4 w-4" />
              <span className="font-medium">Form Pendaftaran Event</span>
            </div>

            <h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-slide-up drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]"
              style={{ animationDelay: "0.2s" }}
            >
              <span className="bg-gradient-to-r from-[#3b82f6] via-[#2563eb] to-[#1e40af] bg-clip-text text-transparent">
                Daftar Event Sekarang
              </span>
            </h1>

            <p
              className="text-lg md:text-xl text-gray-300 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              Isi formulir di bawah untuk mendaftar kegiatan COCONUT Computer
              Club dan tingkatkan skill teknologimu
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 flex items-start gap-4 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="text-sm">
                <p className="font-semibold text-gray-900 mb-1">
                  Petunjuk Pengisian Form
                </p>
                <p className="text-gray-600">
                  Pastikan semua data yang diisi sudah benar. Field bertanda{" "}
                  <span className="text-red-500 font-semibold">*</span> wajib
                  diisi.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
                <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="h-10 w-1.5 bg-gradient-to-b from-[#2563eb] to-[#1d4ed8] rounded-full" />
                  Informasi Event
                </h2>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                      Kategori Event <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={category}
                      onValueChange={(v) => {
                        setCategory(v as EventCategory);
                        setEventId("");
                      }}
                    >
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10 transition-all">
                        <SelectValue placeholder="Pilih kategori event" />
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
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                      Pilih Event <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={eventId}
                      onValueChange={setEventId}
                      disabled={!category}
                    >
                      <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10 transition-all">
                        <SelectValue
                          placeholder={
                            category
                              ? "Pilih event"
                              : "Pilih kategori terlebih dahulu"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="max-w-[95vw] sm:max-w-none">
                        {availableEvents.map((e) => (
                          <SelectItem
                            key={e.id}
                            value={e.id}
                            className="cursor-pointer hover:bg-blue-50 transition-colors"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                              <span className="text-sm font-medium text-gray-900 truncate sm:line-clamp-1 max-w-full">
                                {e.title}
                              </span>
                              <span className="text-xs text-green-600 font-medium whitespace-nowrap">
                                • Tersedia
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                        {unavailableEvents.map((e) => (
                          <SelectItem
                            key={e.id}
                            value={e.id}
                            disabled
                            className="cursor-not-allowed opacity-60"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                              <span className="text-sm font-medium text-gray-700 truncate sm:line-clamp-1 max-w-full">
                                {e.title}
                              </span>
                              <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
                                {!e.available
                                  ? "Belum tersedia"
                                  : "Kuota penuh"}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                        {category &&
                          availableEvents.length === 0 &&
                          unavailableEvents.length === 0 && (
                            <div className="px-3 py-2 text-sm text-gray-500">
                              Tidak ada event untuk kategori ini
                            </div>
                          )}
                      </SelectContent>
                    </Select>
                    {selectedEvent && (
                      <div className="mt-3 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm">
                        <p className="font-semibold text-gray-900 mb-2">
                          {selectedEvent.title}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {selectedEvent.date}
                          </span>
                          <span className="flex items-center gap-1">
                            📊 {selectedEvent.registered}/{selectedEvent.quota}{" "}
                            terdaftar
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
                <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="h-10 w-1.5 bg-gradient-to-b from-[#2563eb] to-[#1d4ed8] rounded-full" />
                  Data Pribadi
                </h2>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Masukkan nama lengkap Anda"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10 transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Nomor WhatsApp <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Contoh: 081234567890"
                      value={whatsapp}
                      onChange={(e) => {
                        const cleaned = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 15);
                        setWhatsapp(cleaned);
                      }}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="h-12 border-2 border-gray-200 focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10 transition-all"
                      maxLength={15}
                    />
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Format: 08xxxxxxxxxx (hanya angka)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Asal Kampus / Instansi / Sekolah{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Masukkan asal instansi"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
                <h2 className="font-display text-xl md:text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="h-10 w-1.5 bg-gradient-to-b from-[#2563eb] to-[#1d4ed8] rounded-full" />
                  Dokumen Pendukung
                </h2>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">
                    {isPaidEvent
                      ? "Upload Bukti Pembayaran"
                      : "Upload Bukti Follow Instagram COCONUT"}
                  </Label>
                  <label className="group flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition-all hover:border-[#2563eb] hover:bg-blue-50">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-white border-2 border-gray-200 group-hover:border-[#2563eb] group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-white transition-all">
                      {isPaidEvent ? (
                        <CreditCard className="h-7 w-7 text-gray-400 group-hover:text-[#2563eb] transition-colors" />
                      ) : (
                        <Instagram className="h-7 w-7 text-gray-400 group-hover:text-[#2563eb] transition-colors" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-gray-900">
                        {fileName || "Klik untuk upload file"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {isPaidEvent
                          ? "Upload screenshot bukti transfer"
                          : "Upload screenshot follow @coconut_computer_club"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Format: JPG, PNG, WEBP, GIF • Maksimal 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      name="proof"
                      className="hidden"
                      accept="image/jpeg, image/jpg, image/png, image/webp, image/gif"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) {
                          setProofFile(null);
                          setFileName("");
                          return;
                        }

                        if (isValidImageFile(file)) {
                          setProofFile(file);
                          setFileName(file.name);
                        } else {
                          e.target.value = "";
                          setProofFile(null);
                          setFileName("");
                        }
                      }}
                    />
                  </label>
                  <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    File harus berupa gambar.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full h-14 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:from-[#1d4ed8] hover:to-[#1e40af] text-white font-bold text-base transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/25"
                >
                  Kirim Pendaftaran
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-center text-xs text-gray-500 mt-4">
                  Dengan mendaftar, Anda menyetujui syarat dan ketentuan yang
                  berlaku
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
