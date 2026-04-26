import type { Event } from '@onlyjs/db/client';
import { BaseFormatter } from '../../utils/base-formatter';
import { eventListItemResponseDto, eventPublicResponseDto } from './dtos';
import { toEventListItem, toEventPublic } from './event-mapper';
import type { EventListItemResponse, EventPublicResponse } from './types';

export abstract class EventFormatter {
  /** GET /events satırları */
  static listItem(data: Event): EventListItemResponse {
    return BaseFormatter.convertData<EventListItemResponse>(toEventListItem(data), eventListItemResponseDto);
  }

  /** GET /events/:id, POST, PATCH */
  static public(data: Event): EventPublicResponse {
    return BaseFormatter.convertData<EventPublicResponse>(toEventPublic(data), eventPublicResponseDto);
  }
}
