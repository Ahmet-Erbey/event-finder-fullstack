import { PageContainer } from '#/components/layout/page-container';
import { useDebounce } from '#/hooks/use-debounce';
import { CalendarDays, MapPin, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EventFilters } from '../components/EventFilters';
import { EventsList } from '../components/EventsList';
import { useEventsListQuery } from '../hooks/use-events-list-query';
import type { FilterState } from '../types';

const PER_PAGE = 9;

export default function EventsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    city: '',
    date: '',
    type: '',
    search: '',
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  useEffect(() => {
    setPage(1);
  }, [filters.city, filters.type, filters.date, debouncedSearch]);

  const query = useEventsListQuery({
    page,
    perPage: PER_PAGE,
    search: debouncedSearch,
    city: filters.city,
    type: filters.type,
    date: filters.date,
  });

  const { data, isLoading, isFetching, isError, error, refetch } = query;
  const total = data?.meta.total ?? 0;
  const err =
    isError && error
      ? error instanceof Error
        ? error
        : new Error(typeof error === 'string' ? error : 'Bilinmeyen hata')
      : new Error();

  return (
    <PageContainer>
      <div className="relative overflow-hidden rounded-3xl border border-violet-200/40 bg-gradient-to-br from-violet-50/70 via-background to-indigo-50/70 p-4 shadow-sm sm:p-6 dark:border-violet-900/30 dark:from-violet-950/20 dark:to-indigo-950/20">
        <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-violet-200/35 blur-3xl dark:bg-violet-700/20" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-700/20" />
        <div className="relative space-y-6">
          <div className="rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6 text-white shadow-xl sm:p-8">
            <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">Etkinlikler</h1>
            <p className="text-sm text-purple-100">
              Türkiye'nin dört bir yanındaki konser, tiyatro, spor ve daha fazlasını keşfet.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm text-purple-100 sm:gap-6">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                <span>{isLoading && !data ? '…' : total} etkinlik</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>Filtrele & keşfet</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-violet-200/40 bg-card/95 px-4 py-3 shadow-md backdrop-blur-sm dark:border-violet-900/30">
            <EventFilters
              filters={filters}
              onChange={setFilters}
              totalCount={total}
              filteredCount={total}
            />
          </div>

          <EventsList
            data={data}
            isLoading={isLoading}
            isFetching={isFetching}
            isError={isError}
            error={err}
            onRetry={() => void refetch()}
            page={data?.meta.page ?? page}
            pageCount={data?.meta.pageCount ?? 1}
            onPageChange={setPage}
          />
        </div>
      </div>
    </PageContainer>
  );
}
