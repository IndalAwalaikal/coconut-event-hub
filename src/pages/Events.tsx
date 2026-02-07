import { useState } from "react";
import EventCard from "@/components/EventCard";
import { mockEvents, categoryLabels, type EventCategory } from "@/data/mockData";

const categories: (EventCategory | "all")[] = ["all", "open-class", "webinar", "seminar", "bootcamp"];
const categoryFilterLabels: Record<string, string> = {
  all: "Semua",
  ...categoryLabels,
};

const Events = () => {
  const [filter, setFilter] = useState<EventCategory | "all">("all");
  const filtered = filter === "all" ? mockEvents : mockEvents.filter((e) => e.category === filter);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl font-bold text-glow-sm md:text-4xl">Informasi Event</h1>
        <p className="mt-2 text-muted-foreground">Temukan dan ikuti event yang sesuai dengan minatmu</p>

        {/* Filter */}
        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                filter === cat
                  ? "gradient-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {categoryFilterLabels[cat]}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg">Belum ada event untuk kategori ini.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
