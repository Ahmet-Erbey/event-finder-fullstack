import { Elysia } from 'elysia';
import { dtoWithMiddlewares } from '../../utils';
import { PaginationService } from '../../utils/pagination';
import { AuditLogAction, AuditLogEntity, withAuditLog } from '../audit-logs';
import { auth, authSwagger, PERMISSIONS, withPermission } from '../auth';
import {
  eventCreateDto,
  eventDestroyDto,
  eventIndexDto,
  eventShowDto,
  eventUpdateDto,
} from './dtos';
import { EventFormatter } from './formatters';
import { EventsService } from './service';

/** Yazma: `withPermission` — global `events:*` (sistem yöneticisi). */
const requireEventCreate = withPermission(PERMISSIONS.EVENTS.CREATE);
const requireEventUpdate = withPermission(PERMISSIONS.EVENTS.UPDATE);
const requireEventDestroy = withPermission(PERMISSIONS.EVENTS.DESTROY);

const app = new Elysia({ prefix: '/events', tags: ['Events'] }).guard(authSwagger, (guard) =>
  guard
    .use(auth())
    .get(
      '/',
      async ({ query }) => {
        const { data, total } = await EventsService.index(query);
        return PaginationService.createPaginatedResponse({
          data,
          total,
          query,
          formatter: EventFormatter.listItem,
        });
      },
      eventIndexDto,
    )
    .get(
      '/:id',
      async ({ params }) => {
        const event = await EventsService.show(params.id);
        return EventFormatter.public(event);
      },
      eventShowDto,
    ),
);

const appWithMutations = app
  .use(auth())
  .post(
    '/',
    async ({ body }) => {
      const event = await EventsService.store(body);
      return EventFormatter.public(event);
    },
    dtoWithMiddlewares(
      eventCreateDto,
      requireEventCreate,
      withAuditLog({
        actionType: AuditLogAction.CREATE,
        entityType: AuditLogEntity.EVENT,
        getEntityUuid: (ctx) => {
          // @ts-expect-error audit ctx typing
          const response = ctx.response as ReturnType<typeof EventFormatter.public>;
          return response.id;
        },
        getDescription: () => 'Yeni etkinlik oluşturuldu',
      }),
    ),
  )
  .patch(
    '/:id',
    async ({ params, body }) => {
      const event = await EventsService.update(params.id, body);
      return EventFormatter.public(event);
    },
    dtoWithMiddlewares(
      eventUpdateDto,
      requireEventUpdate,
      withAuditLog({
        actionType: AuditLogAction.UPDATE,
        entityType: AuditLogEntity.EVENT,
        getEntityUuid: ({ params }) => params.id!,
        getDescription: ({ body }) =>
          `Etkinlik güncellendi: ${Object.keys(body as object).join(', ')}`,
        getMetadata: ({ body }) => ({ updatedFields: body }),
      }),
    ),
  )
  .delete(
    '/:id',
    async ({ params }) => {
      await EventsService.destroy(params.id);
      return { message: 'Etkinlik başarıyla silindi' };
    },
    dtoWithMiddlewares(
      eventDestroyDto,
      requireEventDestroy,
      withAuditLog({
        actionType: AuditLogAction.DELETE,
        entityType: AuditLogEntity.EVENT,
        getEntityUuid: ({ params }) => params.id!,
        getDescription: () => 'Etkinlik silindi',
      }),
    ),
  );

export default appWithMutations;
