import type { Static } from 'elysia';
import { eventCreateDto, eventListItemResponseDto, eventPublicResponseDto, eventUpdateDto } from './dtos';

export type EventCreatePayload = Static<(typeof eventCreateDto)['body']>;
export type EventUpdatePayload = Static<(typeof eventUpdateDto)['body']>;
export type EventListItemResponse = Static<typeof eventListItemResponseDto>;
export type EventPublicResponse = Static<typeof eventPublicResponseDto>;
