import {
  EventPlainInputCreate,
  EventPlainInputUpdate,
} from '@onlyjs/db/prismabox/Event';
import { __nullable__ } from '@onlyjs/db/prismabox/__nullable__';
import { t } from 'elysia';
import { type ControllerHook, errorResponseDto } from '../../utils';
import { paginationQueryDto, paginationResponseDto } from '../../utils/pagination';

/** Filtre sorgusu — Prisma enum (büyük harf) */
const eventTypeUnion = t.Union(
  [
    t.Literal('CONCERT'),
    t.Literal('FESTIVAL'),
    t.Literal('THEATER'),
    t.Literal('SPORTS'),
    t.Literal('EXHIBITION'),
    t.Literal('COMEDY'),
  ],
  { additionalProperties: false, description: 'Etkinlik türü' },
);

/** Frontend `EventType` ile aynı (küçük harf) — yanıt gövdesi */
const eventTypeFrontend = t.Union(
  [
    t.Literal('concert'),
    t.Literal('theater'),
    t.Literal('sports'),
    t.Literal('exhibition'),
    t.Literal('festival'),
    t.Literal('comedy'),
  ],
  { additionalProperties: false },
);

/** GET /events — kart / liste; sade alanlar */
export const eventListItemResponseDto = t.Object(
  {
    id: t.String(),
    title: t.String(),
    imageUrl: t.String(),
    city: t.String(),
    date: t.String({ description: 'Tarih YYYY-MM-DD' }),
    price: __nullable__(t.Integer()),
    isFree: t.Boolean(),
    type: eventTypeFrontend,
  },
  { additionalProperties: false },
);

/** GET /events/:id, POST, PATCH — frontend `Event` ile uyumlu (tags yok) */
export const eventPublicResponseDto = t.Object(
  {
    id: t.String(),
    title: t.String(),
    type: eventTypeFrontend,
    city: t.String(),
    date: t.String({ description: 'Tarih YYYY-MM-DD' }),
    time: t.String(),
    venue: t.String(),
    description: t.String(),
    imageUrl: t.String(),
    price: t.Optional(t.Integer()),
    isFree: t.Boolean(),
  },
  { additionalProperties: false },
);

const eventIdParam = t.Object({
  id: t.String({ minLength: 1, description: 'Etkinlik id (cuid)' }),
});

const eventTypeQuery = t.Optional(eventTypeUnion);

const optionalDateQuery = t.Optional(
  t.String({
    description: 'Belirli güne göre filtre (YYYY-MM-DD); o güne ait kayıtlar',
  }),
);

export const eventIndexDto = {
  query: t.Object({
    ...paginationQueryDto.properties,
    search: t.Optional(
      t.String({ description: 'title, description veya venue içinde arama (büyük/küçük harf duyarsız)' }),
    ),
    city: t.Optional(t.String({ description: 'Şehir (büyük/küçük harf duyarsız tam eşleşme)' })),
    type: eventTypeQuery,
    date: optionalDateQuery,
  }),
  response: {
    200: paginationResponseDto(eventListItemResponseDto),
    401: errorResponseDto[401],
  },
  detail: {
    summary: 'List events',
    description:
      'Oturum gerekir (cookie). Sayfalı liste; her öğe: id, title, imageUrl, city, date (YYYY-MM-DD), price, isFree, type (küçük harf).',
    tags: ['Events'],
  },
} satisfies ControllerHook;

export const eventShowDto = {
  params: eventIdParam,
  response: {
    200: eventPublicResponseDto,
    401: errorResponseDto[401],
    404: errorResponseDto[404],
  },
  detail: {
    summary: 'Etkinlik detayı',
    description:
      'Oturum gerekir (cookie). Tek kayıt; frontend Event şekli (type küçük harf, date YYYY-MM-DD). 404: yok veya geçersiz id.',
    tags: ['Events'],
  },
} satisfies ControllerHook;

export const eventCreateDto = {
  body: EventPlainInputCreate,
  response: { 200: eventPublicResponseDto, 401: errorResponseDto[401], 422: errorResponseDto[422] },
  detail: {
    summary: 'Create event',
    description:
      'Yeni etkinlik oluşturur. Kimlik doğrulama + global `events:create` izni gerekir (sistem yöneticisi / System Owner). Şirket kapsamlı roller yetki vermez.',
    tags: ['Events'],
  },
} satisfies ControllerHook;

export const eventUpdateDto = {
  params: eventIdParam,
  body: EventPlainInputUpdate,
  response: {
    200: eventPublicResponseDto,
    404: errorResponseDto[404],
    401: errorResponseDto[401],
    422: errorResponseDto[422],
  },
  detail: {
    summary: 'Update event',
    description: 'Etkinliği günceller. Global `events:update` izni gerekir (sistem yöneticisi).',
    tags: ['Events'],
  },
} satisfies ControllerHook;

export const eventDestroyDto = {
  ...eventShowDto,
  response: { 200: t.Object({ message: t.String() }), 404: errorResponseDto[404], 401: errorResponseDto[401] },
  detail: {
    summary: 'Delete event',
    description: 'Etkinliği siler. Global `events:destroy` izni gerekir (sistem yöneticisi).',
    tags: ['Events'],
  },
} satisfies ControllerHook;
