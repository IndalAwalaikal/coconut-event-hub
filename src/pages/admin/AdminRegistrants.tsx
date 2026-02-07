import { useState, useMemo } from "react";
import { mockEvents, mockRegistrants } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminRegistrants = () => {
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const { toast } = useToast();

  const filtered = useMemo(
    () => selectedEvent === "all" ? mockRegistrants : mockRegistrants.filter((r) => r.eventId === selectedEvent),
    [selectedEvent]
  );

  const handleExport = () => {
    toast({ title: "Export Berhasil", description: "Data pendaftar telah diunduh (demo mode)." });
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Data Pendaftar</h1>
          <p className="text-muted-foreground">Kelola data peserta yang telah mendaftar</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="shrink-0">
          <Download className="mr-2 h-4 w-4" /> Export Excel
        </Button>
      </div>

      {/* Filter */}
      <div className="mt-6">
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="w-full sm:w-80">
            <SelectValue placeholder="Filter berdasarkan event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Event</SelectItem>
            {mockEvents.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>Total: {filtered.length} pendaftar</span>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">#</th>
              <th className="px-4 py-3 text-left font-medium">Nama</th>
              <th className="px-4 py-3 text-left font-medium">WhatsApp</th>
              <th className="px-4 py-3 text-left font-medium">Instansi</th>
              <th className="px-4 py-3 text-left font-medium">Event</th>
              <th className="px-4 py-3 text-left font-medium">Tanggal Daftar</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((reg, i) => {
              const event = mockEvents.find((e) => e.id === reg.eventId);
              return (
                <tr key={reg.id} className="border-b last:border-0">
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3 font-medium">{reg.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{reg.whatsapp}</td>
                  <td className="px-4 py-3 text-muted-foreground">{reg.institution}</td>
                  <td className="px-4 py-3 text-muted-foreground">{event?.title ?? "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(reg.registeredAt).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Belum ada data pendaftar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRegistrants;
