import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import { Card, CardContent } from '#/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { CalendarDays, MapPin, Ticket } from 'lucide-react';
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS, type Event } from '../types';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate();

  const formattedDate = format(parseISO(event.date), 'd MMMM yyyy', { locale: tr });

  return (
    <Card
      className="group overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-0 bg-card"
      onClick={() => navigate({ to: '/events/$eventId', params: { eventId: event.id } })}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <CalendarDays className="w-12 h-12 text-primary/40" />
          </div>
        )}
        {/* Type badge overlay */}
        <div className="absolute top-3 left-3">
          <Badge className={`${EVENT_TYPE_COLORS[event.type]} border-0 font-medium text-xs px-2.5 py-0.5`}>
            {EVENT_TYPE_LABELS[event.type]}
          </Badge>
        </div>
        {/* Price badge overlay */}
        <div className="absolute top-3 right-3">
          {event.isFree ? (
            <Badge className="bg-emerald-500 text-white border-0 font-semibold">Ücretsiz</Badge>
          ) : event.price ? (
            <Badge className="bg-black/70 text-white border-0 font-semibold">
              ₺{event.price}
            </Badge>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-3">
        <h3 className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {event.title}
        </h3>

        <div className="space-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{formattedDate} — {event.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{event.venue}, {event.city}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {event.description}
        </p>

        <Button
          size="sm"
          className="w-full mt-1 gap-1.5"
          onClick={(e) => {
            e.stopPropagation();
            navigate({ to: '/events/$eventId', params: { eventId: event.id } });
          }}
        >
          <Ticket className="w-4 h-4" />
          Detayları Gör
        </Button>
      </CardContent>
    </Card>
  );
}
