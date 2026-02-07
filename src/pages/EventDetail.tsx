import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, User, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockEvents, categoryColors } from "@/data/mockData";

const EventDetail = () => {
  const { id } = useParams();
  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold">Event tidak ditemukan</h2>
          <Link to="/events" className="mt-4 inline-block text-primary hover:underline">
            ← Kembali ke daftar event
          </Link>
        </div>
      </div>
    );
  }

  const isFull = event.registered >= event.quota;

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <Link to="/events" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Event
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="overflow-hidden rounded-2xl border bg-card">
              <div className="aspect-video bg-muted">
                <img src={event.poster} alt={event.title} className="h-full w-full object-cover" />
              </div>
              <div className="p-6 md:p-8">
                <Badge className={`${categoryColors[event.category]} text-primary-foreground border-0 mb-4`}>
                  {event.categoryLabel}
                </Badge>
                <h1 className="font-display text-2xl font-bold md:text-3xl text-glow-sm">
                  {event.title}
                </h1>
                <p className="mt-4 text-muted-foreground leading-relaxed">{event.description}</p>
              </div>
            </div>

            {/* Rules */}
            <div className="rounded-2xl border bg-card p-6 md:p-8">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" /> Tata Tertib
              </h2>
              <ul className="mt-4 space-y-3">
                {event.rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {i + 1}
                    </span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="rounded-2xl border bg-card p-6 md:p-8">
              <h2 className="font-display text-xl font-bold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" /> Benefit
              </h2>
              <ul className="mt-4 space-y-3">
                {event.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 text-muted-foreground">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">
              <div className="rounded-2xl border bg-card p-6 space-y-5">
                <h3 className="font-display font-bold text-lg">Detail Event</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium">Tanggal</p>
                      <p className="text-muted-foreground">{new Date(event.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium">Waktu</p>
                      <p className="text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium">Lokasi</p>
                      <p className="text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="font-medium">Kuota</p>
                      <p className="text-muted-foreground">{event.registered}/{event.quota} peserta</p>
                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full gradient-primary transition-all" style={{ width: `${(event.registered / event.quota) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3 text-sm">
                  <h4 className="font-medium">Pemateri</h4>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4 text-primary" /> {event.speaker1}
                  </div>
                  {event.speaker2 && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4 text-primary" /> {event.speaker2}
                    </div>
                  )}
                  {event.speaker3 && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4 text-primary" /> {event.speaker3}
                    </div>
                  )}
                  <h4 className="font-medium pt-2">Moderator</h4>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4 text-glow-secondary" /> {event.moderator}
                  </div>
                </div>
              </div>

              <Link to={`/register?event=${event.id}`}>
                <Button
                  size="lg"
                  className="w-full gradient-primary border-0 text-primary-foreground font-semibold shadow-lg hover:opacity-90 transition-opacity"
                  disabled={isFull}
                >
                  {isFull ? "Kuota Penuh" : "Daftar Event Ini"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
