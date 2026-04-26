import { api } from '#lib/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

/** GET /events liste öğesi (backend DTO ile uyumlu) */
export type EventListItemDto = {
  id: string;
  title: string;
  imageUrl: string;
  city: string;
  date: string;
  price: number | null;
  isFree: boolean;
  type: string;
};

export type EventsIndexResponseBody = {
  data: EventListItemDto[];
  meta: { total: number; page: number; perPage: number; pageCount: number };
};

export type EventsIndexQuery = {
  page: number;
  perPage: number;
  search: string;
  city: string;
  type: string;
  date: string;
};

function buildQuery(q: EventsIndexQuery) {
  const typeParam =
    q.type && q.type !== 'all' && q.type !== 'other' ? q.type.toUpperCase() : undefined;
  return {
    page: q.page,
    perPage: q.perPage,
    ...(q.search.trim() && { search: q.search.trim() }),
    ...(q.city.trim() && { city: q.city.trim() }),
    ...(q.date && { date: q.date }),
    ...(typeParam && { type: typeParam }),
  };
}

function getErrorMessage(res: { error?: unknown }): string {
  const e = res.error;
  if (e && typeof e === 'object' && 'value' in e) {
    const v = (e as { value?: { message?: string } }).value;
    if (v && typeof v.message === 'string') return v.message;
  }
  return 'Etkinlikler yüklenemedi';
}

/**
 * GET /events — `api` zaten `credentials: 'include` (lib/api).
 */
export function useEventsListQuery(q: EventsIndexQuery) {
  return useQuery({
    queryKey: ['events', 'index', buildQuery(q)],
    queryFn: async () => {
      const res = await api.events.get({ query: buildQuery(q) });
      if (res.error) {
        const msg = getErrorMessage(res);
        const unauthorized =
          /401|unauthorized|oturum/i.test(msg) ||
          (typeof res.error === 'object' &&
            res.error !== null &&
            'status' in res.error &&
            (res.error as { status: number }).status === 401);
        throw new Error(
          unauthorized ? 'Oturum gerekli veya süresi doldu. Lütfen tekrar giriş yapın.' : msg,
        );
      }
      const body = res.data as EventsIndexResponseBody | undefined;
      if (!body?.meta) {
        throw new Error('Beklenmeyen yanıt');
      }
      return body;
    },
    placeholderData: keepPreviousData,
    retry: 1,
  });
}
