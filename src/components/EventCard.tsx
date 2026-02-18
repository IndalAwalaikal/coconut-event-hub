import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, CreditCard, Gift } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/data/mockData";
import { categoryColors } from "@/data/mockData";
import { mediaUrl } from "@/lib/utils";

interface EventCardProps {
  event: Event & {
    eventType?: string;
    price?: number;
  };
}

const EventCard = ({ event }: EventCardProps) => {
  const isFull = event.registered >= event.quota;
  const isUnavailable = !event.available;
  const disabled = isUnavailable || isFull;
  const isPaid = event.eventType === "paid";
  const price = isPaid ? Number(event.price) : 0;

  const content = (
    <div
      className={`group relative overflow-hidden rounded-xl border bg-card transition-all duration-300 h-full flex flex-col ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:-translate-y-1 hover:box-glow-hover hover:border-primary/30"
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={mediaUrl(event.poster)}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover object-[50%_25%] transition-transform duration-300 group-hover:scale-105"
        />

        {/* Category Badge */}
        <div className="absolute left-3 top-3 z-10">
          <Badge
            className={`${categoryColors[event.category]} text-primary-foreground border-0 text-xs`}
          >
            {event.categoryLabel}
          </Badge>
        </div>

        {/* Event Type Badge - VERY PROMINENT */}
        <div className="absolute right-3 top-3 z-10">
          {isPaid ? (
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-red-500 via-red-600 to-red-700 px-3 py-1.5 shadow-lg animate-pulse">
              <CreditCard className="h-4 w-4 text-white" />
              <span className="text-xs font-bold text-white">Berbayar</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-green-500 via-green-600 to-emerald-600 px-3 py-1.5 shadow-lg animate-pulse">
              <Gift className="h-4 w-4 text-white" />
              <span className="text-xs font-bold text-white">Gratis</span>
            </div>
          )}
        </div>

        {/* Disabled Overlay */}
        {disabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
            <span className="rounded-lg bg-card px-4 py-2 font-display font-semibold text-sm">
              {isUnavailable ? "Event Belum Tersedia" : "Kuota Penuh"}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-display text-lg font-bold leading-snug line-clamp-2 min-h-[3rem]">
          {event.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 min-h-[2rem]">
          {event.description}
        </p>

        <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>
              {new Date(event.date).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span>
              {event.registered}/{event.quota} peserta
            </span>
          </div>
        </div>

        {/* Price Display - Bottom of Card */}
        <div className="mt-auto pt-4 border-t border-border">
          {isPaid ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-red-500" />
                <span className="text-xs font-semibold text-muted-foreground">
                  Harga Tiket
                </span>
              </div>
              <span className="font-display text-lg font-bold text-red-600">
                Rp {price.toLocaleString("id-ID")}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Gift className="h-5 w-5 text-green-500" />
              <span className="font-display text-lg font-bold text-green-600">
                100% GRATIS
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (disabled) return content;

  return <Link to={`/events/${event.id}`}>{content}</Link>;
};

export default EventCard;
