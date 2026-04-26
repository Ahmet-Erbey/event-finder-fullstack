import prisma from '@onlyjs/db';
import { Prisma } from '@onlyjs/db/client';
import type { EventType } from '@onlyjs/db/enums';
import { PrismaClientKnownRequestError } from '@onlyjs/db/client/runtime/library';
import { BadRequestException, NotFoundException } from '../../utils';
import type { PaginationQuery } from '../../utils/pagination';
import type { EventCreatePayload, EventUpdatePayload } from './types';

function assertNonEmptyStrings(payload: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const v = payload[key];
    if (typeof v === 'string' && v.trim().length === 0) {
      throw new BadRequestException(`${key} boş olamaz`);
    }
  }
}

function assertPatchHasUpdates(data: EventUpdatePayload) {
  const keys = Object.keys(data).filter((k) => data[k as keyof EventUpdatePayload] !== undefined);
  if (keys.length === 0) {
    throw new BadRequestException('Güncellenecek en az bir alan gönderilmelidir');
  }
  const stringKeys = ['title', 'description', 'city', 'venue', 'time', 'imageUrl'] as const;
  for (const k of stringKeys) {
    const v = data[k];
    if (v !== undefined && typeof v === 'string' && v.trim().length === 0) {
      throw new BadRequestException(`${k} boş olamaz`);
    }
  }
}

export abstract class EventsService {
  private static handlePrismaError(error: unknown, context: 'find' | 'create' | 'update' | 'delete'): never {
    if (error instanceof PrismaClientKnownRequestError) {
      const prismaErr = error as PrismaClientKnownRequestError;
      if (prismaErr.code === 'P2025') {
        throw new NotFoundException('Etkinlik bulunamadı');
      }
    }
    console.error(`Error in EventsService.${context}:`, error);
    throw error;
  }

  /** `date=YYYY-MM-DD` için UTC takvim günü [start, nextDay) aralığı (DB ile tutarlı karşılaştırma). */
  private static parseCalendarDayRange(dateStr: string): { gte: Date; lt: Date } {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
    if (!m) {
      throw new BadRequestException('date parametresi YYYY-MM-DD formatında olmalıdır');
    }
    const y = Number(m[1]);
    const month = Number(m[2]) - 1;
    const d = Number(m[3]);
    const gte = new Date(Date.UTC(y, month, d));
    const lt = new Date(Date.UTC(y, month, d));
    lt.setUTCDate(lt.getUTCDate() + 1);
    return { gte, lt };
  }

  static async index(
    query: PaginationQuery & {
      search?: string;
      city?: string;
      type?: EventType;
      date?: string;
    },
  ) {
    try {
      const { page = 1, perPage = 20, search, city, type, date: dateParam } = query;
      const skip = (page - 1) * perPage;

      const where: Prisma.EventWhereInput = {};

      const searchTrimmed = search?.trim();
      if (searchTrimmed) {
        const mode = Prisma.QueryMode.insensitive;
        where.OR = [
          { title: { contains: searchTrimmed, mode } },
          { description: { contains: searchTrimmed, mode } },
          { venue: { contains: searchTrimmed, mode } },
        ];
      }

      const cityTrimmed = city?.trim();
      if (cityTrimmed) {
        where.city = { equals: cityTrimmed, mode: Prisma.QueryMode.insensitive };
      }

      if (type) {
        where.type = type;
      }

      const dateTrimmed = dateParam?.trim();
      if (dateTrimmed) {
        const { gte, lt } = this.parseCalendarDayRange(dateTrimmed);
        where.date = { gte, lt };
      }

      const [data, total] = await Promise.all([
        prisma.event.findMany({
          where,
          skip,
          take: perPage,
          orderBy: { date: 'asc' },
        }),
        prisma.event.count({ where }),
      ]);

      return { data, total };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw this.handlePrismaError(error, 'find');
    }
  }

  static async show(id: string) {
    try {
      const event = await prisma.event.findUnique({
        where: { id },
      });

      if (!event) {
        throw new NotFoundException('Etkinlik bulunamadı');
      }

      return event;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw this.handlePrismaError(error, 'find');
    }
  }

  static async store(data: EventCreatePayload) {
    assertNonEmptyStrings(data as unknown as Record<string, unknown>, [
      'title',
      'description',
      'city',
      'venue',
      'time',
      'imageUrl',
    ]);

    const isFree = data.isFree ?? false;
    const price = data.price ?? null;
    if (isFree && price != null && price !== 0) {
      throw new BadRequestException('Ücretsiz etkinlikte fiyat belirtilmemelidir');
    }

    try {
      return await prisma.event.create({
        data: {
          title: data.title.trim(),
          description: data.description.trim(),
          type: data.type,
          city: data.city.trim(),
          venue: data.venue.trim(),
          date: data.date,
          time: data.time.trim(),
          imageUrl: data.imageUrl.trim(),
          price,
          isFree,
        },
      });
    } catch (error) {
      throw this.handlePrismaError(error, 'create');
    }
  }

  static async update(id: string, data: EventUpdatePayload) {
    assertPatchHasUpdates(data);

    try {
      const event = await prisma.event.update({
        where: { id },
        data: {
          ...(data.title !== undefined ? { title: data.title.trim() } : {}),
          ...(data.description !== undefined ? { description: data.description.trim() } : {}),
          ...(data.type !== undefined ? { type: data.type } : {}),
          ...(data.city !== undefined ? { city: data.city.trim() } : {}),
          ...(data.venue !== undefined ? { venue: data.venue.trim() } : {}),
          ...(data.date !== undefined ? { date: data.date } : {}),
          ...(data.time !== undefined ? { time: data.time.trim() } : {}),
          ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl.trim() } : {}),
          ...(data.price !== undefined ? { price: data.price } : {}),
          ...(data.isFree !== undefined ? { isFree: data.isFree } : {}),
        },
      });

      return event;
    } catch (error) {
      throw this.handlePrismaError(error, 'update');
    }
  }

  static async destroy(id: string) {
    try {
      const event = await prisma.event.delete({
        where: { id },
      });

      return event;
    } catch (error) {
      throw this.handlePrismaError(error, 'delete');
    }
  }
}
