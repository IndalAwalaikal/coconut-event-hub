import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/EventCard";
import { mockEvents } from "@/data/mockData";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  { icon: BookOpen, title: "Open Class", desc: "Workshop interaktif untuk mengasah skill teknologi" },
  { icon: Users, title: "Webinar", desc: "Diskusi online bersama para ahli di bidangnya" },
  { icon: Trophy, title: "Seminar", desc: "Seminar nasional dengan pembicara ternama" },
  { icon: Zap, title: "Bootcamp", desc: "Pelatihan intensif untuk siap kerja di industri IT" },
];

const Index = () => {
  const highlightEvents = mockEvents.filter((e) => e.available).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32" style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <div className="absolute inset-0 bg-navy/70" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-glow-secondary/30 blur-3xl" />
        </div>
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="font-display text-4xl font-black tracking-tight text-navy-foreground md:text-6xl lg:text-7xl text-glow animate-slide-up">
            COCONUT<br />Computer Club
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-navy-foreground/70 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Wadah pengembangan skill teknologi informasi melalui kegiatan Open Class, Webinar, Seminar, dan Bootcamp.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/events">
              <Button size="lg" className="gradient-primary border-0 text-primary-foreground font-semibold px-8 shadow-lg hover:opacity-90 transition-opacity">
                Lihat Event <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="border-navy-foreground/30 text-navy-foreground hover:bg-navy-foreground/10">
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center font-display text-3xl font-bold text-glow-sm">
            Kegiatan Kami
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-center text-muted-foreground">
            Berbagai kegiatan untuk mengembangkan kemampuan di bidang teknologi informasi
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-xl border bg-card p-6 text-center transition-all hover:-translate-y-1 hover:box-glow hover:border-primary/20"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-primary-foreground transition-transform group-hover:scale-110">
                  <f.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlight Events */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold text-glow-sm">Event Tersedia</h2>
              <p className="mt-2 text-muted-foreground">Jangan lewatkan event-event menarik kami</p>
            </div>
            <Link to="/events" className="hidden text-sm font-medium text-primary hover:underline md:block">
              Lihat semua →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlightEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <Link to="/events" className="mt-6 block text-center text-sm font-medium text-primary hover:underline md:hidden">
            Lihat semua event →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl gradient-hero p-10 text-center md:p-16">
            <h2 className="font-display text-3xl font-bold text-navy-foreground text-glow md:text-4xl">
              Siap Bergabung?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-navy-foreground/70">
              Daftarkan dirimu sekarang dan tingkatkan skill teknologimu bersama COCONUT Computer Club
            </p>
            <Link to="/register">
              <Button size="lg" className="mt-8 gradient-primary border-0 text-primary-foreground font-semibold px-10 shadow-lg hover:opacity-90 transition-opacity">
                Daftar Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
