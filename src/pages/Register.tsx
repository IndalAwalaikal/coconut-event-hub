import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockEvents, categoryLabels, type EventCategory } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Upload } from "lucide-react";

const Register = () => {
  const [searchParams] = useSearchParams();
  const preselectedEvent = searchParams.get("event");
  const preEvent = mockEvents.find((e) => e.id === preselectedEvent);

  const [category, setCategory] = useState<EventCategory | "">(preEvent?.category ?? "");
  const [eventId, setEventId] = useState(preselectedEvent ?? "");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [institution, setInstitution] = useState("");
  const [fileName, setFileName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const availableEvents = useMemo(
    () => mockEvents.filter((e) => e.category === category && e.available && e.registered < e.quota),
    [category]
  );

  const unavailableEvents = useMemo(
    () => mockEvents.filter((e) => e.category === category && (!e.available || e.registered >= e.quota)),
    [category]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !eventId || !name || !whatsapp || !institution) {
      toast({ title: "Error", description: "Harap lengkapi semua field yang wajib diisi", variant: "destructive" });
      return;
    }
    setSubmitted(true);
    toast({ title: "Pendaftaran Berhasil!", description: "Data pendaftaran Anda telah tersimpan." });
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center py-12">
        <div className="text-center animate-slide-up">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-bold">Pendaftaran Berhasil!</h2>
          <p className="mt-2 text-muted-foreground">
            Terima kasih telah mendaftar. Informasi lebih lanjut akan dikirim melalui WhatsApp.
          </p>
          <Button className="mt-6 gradient-primary border-0 text-primary-foreground" onClick={() => setSubmitted(false)}>
            Daftar Event Lain
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-3xl font-bold text-glow-sm md:text-4xl">Pendaftaran Event</h1>
          <p className="mt-2 text-muted-foreground">Isi form berikut untuk mendaftar kegiatan COCONUT Computer Club</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl border bg-card p-6 md:p-8">
            {/* Category */}
            <div className="space-y-2">
              <Label>Kategori Event *</Label>
              <Select value={category} onValueChange={(v) => { setCategory(v as EventCategory); setEventId(""); }}>
                <SelectTrigger><SelectValue placeholder="Pilih kategori event" /></SelectTrigger>
                <SelectContent>
                  {(Object.entries(categoryLabels) as [EventCategory, string][]).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Event */}
            <div className="space-y-2">
              <Label>Pilih Event *</Label>
              <Select value={eventId} onValueChange={setEventId} disabled={!category}>
                <SelectTrigger><SelectValue placeholder={category ? "Pilih event" : "Pilih kategori terlebih dahulu"} /></SelectTrigger>
                <SelectContent>
                  {availableEvents.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                  ))}
                  {unavailableEvents.map((e) => (
                    <SelectItem key={e.id} value={e.id} disabled>
                      {e.title} — {!e.available ? "Belum tersedia" : "Kuota penuh"}
                    </SelectItem>
                  ))}
                  {category && availableEvents.length === 0 && unavailableEvents.length === 0 && (
                    <div className="px-3 py-2 text-sm text-muted-foreground">Tidak ada event</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label>Nama Lengkap *</Label>
              <Input placeholder="Masukkan nama lengkap" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <Label>Nomor WhatsApp *</Label>
              <Input placeholder="Contoh: 081234567890" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
            </div>

            {/* Institution */}
            <div className="space-y-2">
              <Label>Asal Kampus / Instansi / Sekolah *</Label>
              <Input placeholder="Masukkan asal instansi" value={institution} onChange={(e) => setInstitution(e.target.value)} />
            </div>

            {/* Upload */}
            <div className="space-y-2">
              <Label>Upload Bukti / Persyaratan</Label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-border p-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/50">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="text-left">
                  <p className="text-sm font-medium">{fileName || "Klik untuk upload gambar"}</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, atau PDF (maks. 5MB)</p>
                </div>
                <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => setFileName(e.target.files?.[0]?.name || "")} />
              </label>
            </div>

            <Button type="submit" size="lg" className="w-full gradient-primary border-0 text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-opacity">
              Kirim Pendaftaran
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
