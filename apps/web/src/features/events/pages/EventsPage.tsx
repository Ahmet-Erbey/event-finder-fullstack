import { PageContainer } from '#/components/layout/page-container';
import { CalendarDays, MapPin, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EventCard } from '../components/EventCard';
import { EventFilters } from '../components/EventFilters';
import { mockEvents } from '../queries/mock-events';
import type { FilterState } from '../types';

export default function EventsPage() {
  const [filters, setFilters] = useState<FilterState>({
    city: '',
    date: '',
    type: '',
    search: '',
  });

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((event) => {
      if (filters.city && event.city !== filters.city) return false;
      if (filters.type && event.type !== filters.type) return false;
      if (filters.date && event.date !== filters.date) return false;
      if (
        filters.search &&
        !event.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !event.description.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [filters]);

  return (
    <PageContainer>
      <div className="relative overflow-hidden rounded-3xl border border-violet-200/40 bg-gradient-to-br from-violet-50/70 via-background to-indigo-50/70 p-4 shadow-sm sm:p-6 dark:border-violet-900/30 dark:from-violet-950/20 dark:to-indigo-950/20">
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-violet-200/35 blur-3xl dark:bg-violet-700/20" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-700/20" />
        <div className="relative space-y-6">
        {/* Hero header */}
        <div className="rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6 text-white shadow-xl sm:p-8">
          <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Etkinlikler</h1>
          <p className="text-sm text-purple-100">
            Türkiye'nin dört bir yanındaki konser, tiyatro, spor ve daha fazlasını keşfet.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm text-purple-100 sm:gap-6">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4" />
              <span>{mockEvents.length} etkinlik</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>10 şehir</span>
            </div>
          </div>
        </div>

        {/* Filter bar — horizontal, below hero */}
        <div className="rounded-2xl border border-violet-200/40 bg-card/95 px-4 py-3 shadow-md backdrop-blur-sm dark:border-violet-900/30">
          <EventFilters
            filters={filters}
            onChange={setFilters}
            totalCount={mockEvents.length}
            filteredCount={filteredEvents.length}
          />
        </div>

        {/* Events grid */}
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/60 py-24 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Etkinlik bulunamadı</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Seçtiğiniz filtrelere uygun etkinlik yok. Filtreleri değiştirerek tekrar deneyin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
        </div>
      </div>
    </PageContainer>
  );
}
