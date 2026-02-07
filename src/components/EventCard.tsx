import { Link } from "react-router-dom";
import { Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/data/mockData";
import { categoryColors } from "@/data/mockData";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const isFull = event.registered >= event.quota;
  const isUnavailable = !event.available;
  const disabled = isUnavailable || isFull;

  const content = (
    <div
      className={`group relative overflow-hidden rounded-xl border bg-card transition-all duration-300 ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:-translate-y-1 hover:box-glow-hover hover:border-primary/30"
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={event.poster}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Badge className={`${categoryColors[event.category]} text-primary-foreground border-0 text-xs`}>
            {event.categoryLabel}
          </Badge>
        </div>
        {disabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
            <span className="rounded-lg bg-card px-4 py-2 font-display font-semibold text-sm">
              {isUnavailable ? "Event Belum Tersedia" : "Kuota Penuh"}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg font-bold leading-snug line-clamp-2">
          {event.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>

        <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{new Date(event.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>{event.registered}/{event.quota} peserta</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (disabled) return content;

  return <Link to={`/events/${event.id}`}>{content}</Link>;
};

export default EventCard;
