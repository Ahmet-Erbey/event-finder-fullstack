import { PageContainer } from '#/components/layout/page-container';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import { useNavigate, useParams } from '@tanstack/react-router';
import { format, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ArrowLeft, CalendarDays, MapPin, Tag, Ticket } from 'lucide-react';
import { mockEvents } from '../queries/mock-events';
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from '../types';

export default function EventDetailPage() {
  const { eventId } = useParams({ from: '/_authenticated/events/$eventId' });
  const navigate = useNavigate();
  const event = mockEvents.find((e) => e.id === eventId);

  if (!event) {
    return (
      <PageContainer>
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/60 py-32 text-center">
          <h2 className="text-2xl font-bold mb-2">Etkinlik bulunamadı</h2>
          <p className="text-muted-foreground mb-6">Bu etkinlik mevcut değil veya kaldırılmış olabilir.</p>
          <Button onClick={() => navigate({ to: '/events' })}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Etkinliklere Dön
          </Button>
        </div>
      </PageContainer>
    );
  }

  const formattedDate = format(parseISO(event.date), 'EEEE, d MMMM yyyy', { locale: tr });

  return (
    <PageContainer>
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-violet-200/40 bg-gradient-to-br from-violet-50/70 via-background to-indigo-50/70 p-4 shadow-sm sm:p-6 dark:border-violet-900/30 dark:from-violet-950/20 dark:to-indigo-950/20">
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-violet-200/35 blur-3xl dark:bg-violet-700/20" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-700/20" />
        <div className="relative space-y-6">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 -ml-2"
          onClick={() => navigate({ to: '/events' })}
        >
          <ArrowLeft className="w-4 h-4" />
          Tüm Etkinlikler
        </Button>

        {/* Hero image */}
        {event.imageUrl && (
          <div className="relative h-72 overflow-hidden rounded-2xl shadow-lg md:h-96">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <Badge className={`${EVENT_TYPE_COLORS[event.type]} border-0 font-medium`}>
                {EVENT_TYPE_LABELS[event.type]}
              </Badge>
              {event.isFree ? (
                <Badge className="bg-emerald-500 text-white border-0 font-semibold text-base px-3 py-1">
                  Ücretsiz
                </Badge>
              ) : event.price ? (
                <span className="text-white font-bold text-2xl">₺{event.price}</span>
              ) : null}
            </div>
          </div>
        )}

        {/* Title & meta */}
        <div className="space-y-4 rounded-2xl border border-indigo-200/40 bg-card/90 p-5 shadow-sm dark:border-indigo-900/30">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">{event.title}</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
              <CalendarDays className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Tarih & Saat</p>
                <p className="font-medium text-sm capitalize">{formattedDate}</p>
                <p className="text-sm text-muted-foreground">{event.time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Mekan</p>
                <p className="font-medium text-sm">{event.venue}</p>
                <p className="text-sm text-muted-foreground">{event.city}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-sm max-w-none rounded-2xl border border-violet-200/40 bg-card/90 p-5 shadow-sm dark:prose-invert dark:border-violet-900/30">
          <h2 className="text-base font-semibold mb-2">Etkinlik Hakkında</h2>
          <p className="text-muted-foreground leading-relaxed">{event.description}</p>
        </div>

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/50 bg-card/70 p-4">
            <Tag className="w-4 h-4 text-muted-foreground" />
            {event.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4 border border-violet-100 dark:border-violet-900/30">
          <div className="flex-1 text-center sm:text-left">
            <p className="font-semibold">Bu etkinliğe katılmak ister misiniz?</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {event.isFree ? 'Bu etkinlik tamamen ücretsiz!' : `Bilet fiyatı: ₺${event.price ?? '—'}`}
            </p>
          </div>
          <Button size="lg" className="gap-2 bg-violet-600 hover:bg-violet-700 shrink-0">
            <Ticket className="w-4 h-4" />
            {event.isFree ? 'Ücretsiz Kayıt Ol' : 'Bilet Al'}
          </Button>
        </div>
        </div>
      </div>
    </PageContainer>
  );
}
