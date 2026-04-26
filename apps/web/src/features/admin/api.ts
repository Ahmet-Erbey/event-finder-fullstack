import { env } from '#/config/env';

const baseUrl = () => {
  const b = env.apiUrl;
  if (!b) throw new Error('VITE_API_URL tanımlı değil');
  return b.replace(/\/$/, '');
};

type Json = Record<string, unknown> | unknown[] | string | number | boolean | null;

export async function fetchWithCredentials(
  path: string,
  init: RequestInit & { jsonBody?: Json } = {},
): Promise<Response> {
  const { jsonBody, headers: hdr, ...rest } = init;
  const headers = new Headers(hdr);
  if (jsonBody !== undefined) {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(`${baseUrl()}${path}`, {
    ...rest,
    credentials: 'include',
    headers,
    body: jsonBody !== undefined ? JSON.stringify(jsonBody) : rest.body,
  });
}

export async function parseJsonOrEmpty(res: Response): Promise<unknown> {
  const t = await res.text();
  if (!t) return null;
  try {
    return JSON.parse(t) as unknown;
  } catch {
    return t;
  }
}

export function getErrorMessage(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'message' in (data as object)) {
    const m = (data as { message?: string }).message;
    if (typeof m === 'string' && m) return m;
  }
  if (data && typeof data === 'object' && 'name' in (data as object) && 'message' in (data as object)) {
    const o = data as { name: string; message: string };
    if (o.message) return o.message;
  }
  return fallback;
}

export type EventsListBody = {
  data: {
    id: string;
    title: string;
    imageUrl: string;
    city: string;
    date: string;
    price: number | null;
    isFree: boolean;
    type: string;
  }[];
  meta: { total: number; page: number; perPage: number; pageCount: number };
};

export type EventDetailBody = {
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

const PRISMA_EVENT_TYPES = [
  'CONCERT',
  'FESTIVAL',
  'THEATER',
  'SPORTS',
  'EXHIBITION',
  'COMEDY',
] as const;
export type PrismaEventType = (typeof PRISMA_EVENT_TYPES)[number];

/**
 * UI / liste (küçük harf) → API gövdesi (Prisma enum, büyük harf)
 */
export function toPrismaEventType(frontend: string): PrismaEventType {
  const f = frontend.trim().toLowerCase();
  const m: Record<string, PrismaEventType> = {
    concert: 'CONCERT',
    festival: 'FESTIVAL',
    theater: 'THEATER',
    sports: 'SPORTS',
    exhibition: 'EXHIBITION',
    comedy: 'COMEDY',
  };
  if (m[f]) return m[f];
  const up = frontend.trim();
  if ((PRISMA_EVENT_TYPES as readonly string[]).includes(up)) {
    return up as PrismaEventType;
  }
  return 'CONCERT';
}

/** YYYY-MM-DD veya geçerli date string → ISO (POST/PATCH) */
function toEventDateIsoString(dateField: string): string {
  const s = dateField.trim();
  const ymd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (ymd) {
    const y = Number(ymd[1]);
    const m = Number(ymd[2]) - 1;
    const d = Number(ymd[3]);
    return new Date(Date.UTC(y, m, d, 12, 0, 0, 0)).toISOString();
  }
  return new Date(s).toISOString();
}

export type EventCreateBody = {
  title: string;
  description: string;
  type: string;
  city: string;
  venue: string;
  date: string;
  time: string;
  imageUrl: string;
  price: number | null;
  isFree: boolean;
};

export async function listEventsIndex(params: {
  page: number;
  perPage: number;
}): Promise<EventsListBody> {
  const q = new URLSearchParams({
    page: String(params.page),
    perPage: String(params.perPage),
  });
  const res = await fetchWithCredentials(`/events?${q.toString()}`);
  const data = await parseJsonOrEmpty(res);
  if (!res.ok) {
    throw new Error(
      res.status === 401
        ? 'Oturum gerekli'
        : getErrorMessage(data, `Liste alınamadı (${res.status})`),
    );
  }
  return data as EventsListBody;
}

export async function getEventById(id: string): Promise<EventDetailBody> {
  const res = await fetchWithCredentials(`/events/${encodeURIComponent(id)}`);
  const data = await parseJsonOrEmpty(res);
  if (!res.ok) {
    throw new Error(
      res.status === 404 ? 'Etkinlik bulunamadı' : getErrorMessage(data, 'Detay alınamadı'),
    );
  }
  return data as EventDetailBody;
}

export async function createEvent(body: EventCreateBody): Promise<EventDetailBody> {
  const res = await fetchWithCredentials('/events', {
    method: 'POST',
    jsonBody: {
      title: body.title,
      description: body.description,
      type: toPrismaEventType(body.type),
      city: body.city,
      venue: body.venue,
      date: toEventDateIsoString(body.date),
      time: body.time,
      imageUrl: body.imageUrl,
      price: body.isFree ? null : body.price,
      isFree: body.isFree,
    },
  });
  const data = await parseJsonOrEmpty(res);
  if (!res.ok) {
    throw new Error(getErrorMessage(data, 'Etkinlik oluşturulamadı'));
  }
  return data as EventDetailBody;
}

export async function updateEvent(
  id: string,
  patch: Partial<{
    title: string;
    description: string;
    type: string;
    city: string;
    venue: string;
    date: string;
    time: string;
    imageUrl: string;
    price: number | null;
    isFree: boolean;
  }>,
): Promise<EventDetailBody> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(patch) as [string, string | number | boolean | null | undefined][]) {
    if (v === undefined) continue;
    if (k === 'type') out.type = toPrismaEventType(v as string);
    else if (k === 'date') out.date = toEventDateIsoString(v as string);
    else out[k] = v;
  }
  const res = await fetchWithCredentials(`/events/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    jsonBody: out,
  });
  const data = await parseJsonOrEmpty(res);
  if (!res.ok) {
    throw new Error(getErrorMessage(data, 'Güncelleme başarısız'));
  }
  return data as EventDetailBody;
}

export async function deleteEvent(id: string): Promise<void> {
  const res = await fetchWithCredentials(`/events/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  const data = await parseJsonOrEmpty(res);
  if (!res.ok) {
    throw new Error(getErrorMessage(data, 'Silinemedi'));
  }
  void data;
}

export async function postLogout(): Promise<void> {
  const res = await fetchWithCredentials('/auth/logout', { method: 'POST' });
  if (!res.ok) {
    const data = await parseJsonOrEmpty(res);
    throw new Error(getErrorMessage(data, 'Çıkış yapılamadı'));
  }
}
