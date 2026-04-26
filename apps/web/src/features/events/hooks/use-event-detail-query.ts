import { api } from '#lib/api';
import { useQuery } from '@tanstack/react-query';

/** GET /events/:id public DTO (backend) */
export type EventDetailDto = {
  id: string;
  title: string;
  type: string;
  city: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  imageUrl: string;
  price?: number;
  isFree: boolean;
};

function getErrorMessage(res: { error?: unknown }): string {
  const e = res.error;
  if (e && typeof e === 'object' && 'value' in e) {
    const v = (e as { value?: { message?: string } }).value;
    if (v && typeof v.message === 'string') return v.message;
  }
  return 'Etkinlik yüklenemedi';
}

/**
 * GET /events/:id — `api` zaten `credentials: 'include` (lib/api).
 */
export function useEventDetailQuery(eventId: string | undefined) {
  return useQuery({
    queryKey: ['events', 'detail', eventId],
    queryFn: async () => {
      if (!eventId) {
        throw new Error('Etkinlik id gerekli');
      }
      const res = await api.events({ id: eventId }).get();
      if (res.error) {
        const msg = getErrorMessage(res);
        const notFound =
          /404|not found|bulunamadı/i.test(msg) ||
          (typeof res.error === 'object' &&
            res.error !== null &&
            'status' in res.error &&
            (res.error as { status: number }).status === 404);
        if (notFound) {
          const e = new Error('NOT_FOUND') as Error & { notFound: boolean };
          e.notFound = true;
          throw e;
        }
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
      if (!res.data) {
        throw new Error('Beklenmeyen yanıt');
      }
      return res.data as EventDetailDto;
    },
    enabled: Boolean(eventId?.length),
    retry: 1,
  });
}
