import type { Event } from '@onlyjs/db/client';
import { EventType } from '@onlyjs/db/enums';

/** Prisma enum → frontend `EventType` (küçük harf) */
const PRISMA_TO_FRONTEND: Record<
  (typeof EventType)[keyof typeof EventType],
  'concert' | 'theater' | 'sports' | 'exhibition' | 'festival' | 'comedy'
> = {
  [EventType.CONCERT]: 'concert',
  [EventType.FESTIVAL]: 'festival',
  [EventType.THEATER]: 'theater',
  [EventType.SPORTS]: 'sports',
  [EventType.EXHIBITION]: 'exhibition',
  [EventType.COMEDY]: 'comedy',
};

export function eventDateToYmd(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function eventTypeToFrontend(type: (typeof EventType)[keyof typeof EventType]) {
  return PRISMA_TO_FRONTEND[type];
}

/** GET /events satırı — kart için sade alanlar + yönlendirme için id */
export function toEventListItem(event: Event) {
  return {
    id: event.id,
    title: event.title,
    imageUrl: event.imageUrl,
    city: event.city,
    date: eventDateToYmd(event.date),
    price: event.price,
    isFree: event.isFree,
    type: eventTypeToFrontend(event.type),
  };
}

/** GET /events/:id ve POST/PATCH yanıtı — frontend `Event` (tags yok) */
export function toEventPublic(event: Event) {
  return {
    id: event.id,
    title: event.title,
    type: eventTypeToFrontend(event.type),
    city: event.city,
    date: eventDateToYmd(event.date),
    time: event.time,
    venue: event.venue,
    description: event.description,
    imageUrl: event.imageUrl,
    price: event.price === null || event.price === undefined ? undefined : event.price,
    isFree: event.isFree,
  };
}
