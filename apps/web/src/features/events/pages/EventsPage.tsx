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
      <div className="space-y-6">
        {/* Hero header */}
        <div className="rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-8 text-white">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Etkinlikler</h1>
          <p className="text-purple-100 text-sm">
            Türkiye'nin dört bir yanındaki konser, tiyatro, spor ve daha fazlasını keşfet.
          </p>
          <div className="flex gap-6 mt-5 text-sm text-purple-100">
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
        <div className="bg-card border rounded-xl px-4 py-3 shadow-sm">
          <EventFilters
            filters={filters}
            onChange={setFilters}
            totalCount={mockEvents.length}
            filteredCount={filteredEvents.length}
          />
        </div>

        {/* Events grid */}
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">Etkinlik bulunamadı</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Seçtiğiniz filtrelere uygun etkinlik yok. Filtreleri değiştirerek tekrar deneyin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
