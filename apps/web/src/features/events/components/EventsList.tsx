import { Alert, AlertDescription, AlertTitle } from '#/components/ui/alert';
import { Button } from '#/components/ui/button';
import { Skeleton } from '#/components/ui/skeleton';
import { Search } from 'lucide-react';
import { EventCard } from './EventCard';
import type { Event } from '../types';
import type { EventListItemDto, EventsIndexResponseBody } from '../hooks/use-events-list-query';

function listItemToEvent(item: EventListItemDto): Event {
  const t = item.type;
  return {
    id: item.id,
    title: item.title,
    type: (['concert', 'theater', 'sports', 'exhibition', 'festival', 'comedy'].includes(t)
      ? t
      : 'other') as Event['type'],
    city: item.city,
    date: item.date,
    imageUrl: item.imageUrl,
    price: item.price,
    isFree: item.isFree,
  };
}

type EventsListProps = {
  data: EventsIndexResponseBody | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  onRetry: () => void;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

export function EventsList({
  data,
  isLoading,
  isFetching,
  isError,
  error,
  onRetry,
  page,
  pageCount,
  onPageChange,
}: EventsListProps) {
  const showInitialSkeleton = isLoading && !data;
  const events: Event[] = (data?.data ?? []).map(listItemToEvent);
  const total = data?.meta.total ?? 0;

  if (isError) {
    return (
      <Alert variant="destructive" className="rounded-2xl">
        <AlertTitle>Yüklenemedi</AlertTitle>
        <AlertDescription className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>{error?.message ?? 'Bir hata oluştu'}</span>
          <Button type="button" variant="outline" size="sm" onClick={() => onRetry()}>
            Tekrar dene
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (showInitialSkeleton) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[380px] rounded-2xl" />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/60 py-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-1 text-lg font-semibold">Etkinlik bulunamadı</h3>
        <p className="max-w-xs text-sm text-muted-foreground">
          Seçtiğiniz filtrelere uygun etkinlik yok. Filtreleri değiştirerek tekrar deneyin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isFetching && !showInitialSkeleton ? (
        <p className="text-center text-xs text-muted-foreground">Güncelleniyor…</p>
      ) : null}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      {pageCount > 1 ? (
        <div className="flex flex-wrap items-center justify-center gap-3 border-t border-border/40 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page <= 1 || isFetching}
            onClick={() => onPageChange(page - 1)}
          >
            Önceki
          </Button>
          <span className="min-w-[120px] text-center text-sm text-muted-foreground">
            Sayfa {page} / {pageCount} · {total} etkinlik
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={page >= pageCount || isFetching}
            onClick={() => onPageChange(page + 1)}
          >
            Sonraki
          </Button>
        </div>
      ) : null}
    </div>
  );
}
