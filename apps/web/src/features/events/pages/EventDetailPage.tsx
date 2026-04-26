import { PageContainer } from '#/components/layout/page-container';
import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import { Skeleton } from '#/components/ui/skeleton';
import { useNavigate, useParams } from '@tanstack/react-router';
import { tr } from 'date-fns/locale';
import { ArrowLeft, CalendarDays, MapPin, Ticket } from 'lucide-react';
import { useEventDetailQuery } from '../hooks/use-event-detail-query';
import { formatEventFieldDate } from '../utils/event-date';
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS, type EventType } from '../types';

function toEventType(t: string): EventType {
  if (
    t === 'concert' ||
    t === 'theater' ||
    t === 'sports' ||
    t === 'exhibition' ||
    t === 'festival' ||
    t === 'comedy'
  ) {
    return t;
  }
  return 'other';
}

function isNotFoundError(err: unknown): boolean {
  return (
    err !== null &&
    typeof err === 'object' &&
    'notFound' in err &&
    (err as { notFound?: boolean }).notFound === true
  );
}

export default function EventDetailPage() {
  const { eventId } = useParams({ from: '/_authenticated/events/$eventId' });
  const navigate = useNavigate();
  const { data: event, isLoading, isError, error, refetch } = useEventDetailQuery(eventId);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="mx-auto max-w-4xl space-y-4 p-4">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-72 rounded-2xl md:h-96" />
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </PageContainer>
    );
  }

  if (isError) {
    if (isNotFoundError(error)) {
      return (
        <PageContainer>
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/60 py-32 text-center">
            <h2 className="mb-2 text-2xl font-bold">Etkinlik bulunamadı</h2>
            <p className="text-muted-foreground mb-6">
              Bu etkinlik mevcut değil veya kaldırılmış olabilir.
            </p>
            <Button onClick={() => navigate({ to: '/events' })}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Etkinliklere Dön
            </Button>
          </div>
        </PageContainer>
      );
    }

    return (
      <PageContainer>
        <div className="mx-auto max-w-2xl p-4">
          <Alert variant="destructive" className="rounded-2xl">
            <AlertTitle>Yüklenemedi</AlertTitle>
            <AlertDescription className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span>
                {error instanceof Error ? error.message : 'Bir hata oluştu'}
              </span>
              <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
                Tekrar dene
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </PageContainer>
    );
  }

  if (!event) {
    return null;
  }

  const eventType = toEventType(event.type);
  const formattedDate = formatEventFieldDate(event.date, 'EEEE, d MMMM yyyy', { locale: tr });

  return (
    <PageContainer>
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-violet-200/40 bg-gradient-to-br from-violet-50/70 via-background to-indigo-50/70 p-4 shadow-sm sm:p-6 dark:border-violet-900/30 dark:from-violet-950/20 dark:to-indigo-950/20">
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-violet-200/35 blur-3xl dark:bg-violet-700/20" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-700/20" />
        <div className="relative space-y-6">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 gap-1.5"
            onClick={() => navigate({ to: '/events' })}
          >
            <ArrowLeft className="h-4 w-4" />
            Tüm Etkinlikler
          </Button>

          {event.imageUrl ? (
            <div className="relative h-72 overflow-hidden rounded-2xl shadow-lg md:h-96">
              <img
                src={event.imageUrl}
                alt={event.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between">
                <Badge className={`${EVENT_TYPE_COLORS[eventType]} border-0 font-medium`}>
                  {EVENT_TYPE_LABELS[eventType]}
                </Badge>
                {event.isFree ? (
                  <Badge className="bg-emerald-500 px-3 py-1 text-base font-semibold text-white border-0">
                    Ücretsiz
                  </Badge>
                ) : event.price != null ? (
                  <span className="text-2xl font-bold text-white">₺{event.price}</span>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-2xl bg-muted md:h-64">
              <CalendarDays className="h-16 w-16 text-muted-foreground/40" />
            </div>
          )}

          <div className="space-y-4 rounded-2xl border border-indigo-200/40 bg-card/90 p-5 shadow-sm dark:border-indigo-900/30">
            <h1 className="text-2xl leading-tight font-bold md:text-3xl">{event.title}</h1>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <CalendarDays className="h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Tarih & Saat</p>
                  <p className="text-sm font-medium capitalize">{formattedDate}</p>
                  <p className="text-sm text-muted-foreground">{event.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Mekan</p>
                  <p className="text-sm font-medium">{event.venue}</p>
                  <p className="text-sm text-muted-foreground">{event.city}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none rounded-2xl border border-violet-200/40 bg-card/90 p-5 shadow-sm dark:border-violet-900/30">
            <h2 className="text-base font-semibold">Etkinlik Hakkında</h2>
            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
          </div>

          <div className="flex flex-col items-center gap-4 rounded-xl border border-violet-100 bg-gradient-to-r from-violet-50 to-indigo-50 p-5 sm:flex-row dark:border-violet-900/30 dark:from-violet-950/30 dark:to-indigo-950/30">
            <div className="flex-1 text-center sm:text-left">
              <p className="font-semibold">Bu etkinliğe katılmak ister misiniz?</p>
              <p className="text-muted-foreground mt-0.5 text-sm">
                {event.isFree
                  ? 'Bu etkinlik tamamen ücretsiz!'
                  : `Bilet fiyatı: ₺${event.price ?? '—'}`}
              </p>
            </div>
            <Button size="lg" className="shrink-0 gap-2 bg-violet-600 hover:bg-violet-700">
              <Ticket className="h-4 w-4" />
              {event.isFree ? 'Ücretsiz Kayıt Ol' : 'Bilet Al'}
            </Button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
