import { useState, useMemo } from "react";
import { mockDocumentation, categoryLabels, type EventCategory } from "@/data/mockData";

const DocumentationPage = () => {
  const [catFilter, setCatFilter] = useState<EventCategory | "all">("all");
  const [yearFilter, setYearFilter] = useState<number | "all">("all");

  const years = useMemo(() => [...new Set(mockDocumentation.map((d) => d.year))].sort((a, b) => b - a), []);

  const filtered = useMemo(
    () =>
      mockDocumentation.filter(
        (d) => (catFilter === "all" || d.category === catFilter) && (yearFilter === "all" || d.year === yearFilter)
      ),
    [catFilter, yearFilter]
  );

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl font-bold text-glow-sm md:text-4xl">Dokumentasi</h1>
        <p className="mt-2 text-muted-foreground">Galeri kegiatan COCONUT Computer Club</p>

        {/* Filters */}
        <div className="mt-8 flex flex-wrap gap-3">
          <div className="flex flex-wrap gap-2">
            {(["all", "open-class", "webinar", "seminar", "bootcamp"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCatFilter(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  catFilter === cat ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat === "all" ? "Semua" : categoryLabels[cat]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setYearFilter("all")}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                yearFilter === "all" ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              Semua Tahun
            </button>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => setYearFilter(y)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  yearFilter === y ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((doc) => (
            <div key={doc.id} className="overflow-hidden rounded-xl border bg-card transition-all hover:-translate-y-1 hover:box-glow hover:border-primary/20">
              <div className="grid grid-cols-2 gap-1 p-1">
                {doc.images.slice(0, 4).map((img, i) => (
                  <div key={i} className={`aspect-square overflow-hidden rounded-md bg-muted ${doc.images.length === 1 ? "col-span-2" : ""}`}>
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="p-5">
                <span className="text-xs font-medium text-primary">{doc.categoryLabel} • {doc.year}</span>
                <h3 className="mt-1 font-display font-bold">{doc.eventTitle}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{doc.description}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <p className="text-lg">Belum ada dokumentasi untuk filter ini.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentationPage;
