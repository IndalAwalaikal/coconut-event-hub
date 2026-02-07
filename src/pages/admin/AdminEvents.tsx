import { useState } from "react";
import { mockEvents, categoryLabels, type EventCategory } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Calendar, Users } from "lucide-react";
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
  const { toast } = useToast();

  const filtered = tab === "all" ? mockEvents : mockEvents.filter((e) => e.category === tab);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setDialogOpen(false);
    toast({ title: "Event Disimpan", description: "Event berhasil ditambahkan (demo mode)." });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Kelola Event</h1>
          <p className="text-muted-foreground">Tambah dan kelola event kegiatan</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary border-0 text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" /> Tambah Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-display">Tambah Event Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Kategori Event</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
                    <SelectContent>
                      {(Object.entries(categoryLabels) as [EventCategory, string][]).map(([val, label]) => (
                        <SelectItem key={val} value={val}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tema Event</Label>
                  <Input placeholder="Masukkan tema event" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Deskripsi Event</Label>
                <Textarea placeholder="Deskripsi kegiatan" rows={3} />
              </div>

              <div className="space-y-2">
                <Label>Poster Event</Label>
                <Input type="file" accept="image/*" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tanggal Pelaksanaan</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Jam Pelaksanaan</Label>
                  <Input placeholder="09:00 - 12:00 WIB" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Pemateri 1 *</Label>
                  <Input placeholder="Nama pemateri" />
                </div>
                <div className="space-y-2">
                  <Label>Pemateri 2</Label>
                  <Input placeholder="Opsional" />
                </div>
                <div className="space-y-2">
                  <Label>Pemateri 3</Label>
                  <Input placeholder="Opsional" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Moderator</Label>
                  <Input placeholder="Nama moderator" />
                </div>
                <div className="space-y-2">
                  <Label>Lokasi</Label>
                  <Input placeholder="Lokasi event" />
                </div>
                <div className="space-y-2">
                  <Label>Kuota Peserta</Label>
                  <Input type="number" placeholder="50" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
                <Button type="submit" className="gradient-primary border-0 text-primary-foreground">Simpan Event</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              tab === t.key ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Event</th>
              <th className="px-4 py-3 text-left font-medium">Kategori</th>
              <th className="px-4 py-3 text-left font-medium">Tanggal</th>
              <th className="px-4 py-3 text-left font-medium">Peserta</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((event) => (
              <tr key={event.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium">{event.title}</td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className="text-xs">{event.categoryLabel}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(event.date).toLocaleDateString("id-ID")}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {event.registered}/{event.quota}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge className={event.available ? "bg-emerald-100 text-emerald-700 border-0" : "bg-muted text-muted-foreground border-0"}>
                    {event.available ? "Aktif" : "Belum Tersedia"}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEvents;
