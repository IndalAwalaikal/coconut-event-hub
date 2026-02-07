import { CalendarDays, Users, CheckCircle, Clock } from "lucide-react";
import { mockEvents, mockRegistrants } from "@/data/mockData";

const stats = [
  { label: "Total Event", value: mockEvents.length, icon: CalendarDays, color: "text-primary" },
  { label: "Event Aktif", value: mockEvents.filter((e) => e.available).length, icon: CheckCircle, color: "text-emerald-500" },
  { label: "Total Pendaftar", value: mockRegistrants.length, icon: Users, color: "text-glow-secondary" },
  { label: "Event Mendatang", value: mockEvents.filter((e) => new Date(e.date) > new Date()).length, icon: Clock, color: "text-amber-500" },
];

const AdminDashboard = () => (
  <div>
    <h1 className="font-display text-2xl font-bold">Dashboard</h1>
    <p className="text-muted-foreground">Selamat datang di panel admin COCONUT Computer Club</p>

    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{s.label}</span>
            <s.icon className={`h-5 w-5 ${s.color}`} />
          </div>
          <p className="mt-2 font-display text-3xl font-bold">{s.value}</p>
        </div>
      ))}
    </div>

    <div className="mt-8 rounded-xl border bg-card p-6">
      <h2 className="font-display text-lg font-bold mb-4">Event Terbaru</h2>
      <div className="space-y-3">
        {mockEvents.slice(0, 4).map((event) => (
          <div key={event.id} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
            <div>
              <p className="font-medium text-sm">{event.title}</p>
              <p className="text-xs text-muted-foreground">{event.categoryLabel} • {new Date(event.date).toLocaleDateString("id-ID")}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${event.available ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
              {event.available ? "Aktif" : "Belum Tersedia"}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AdminDashboard;
