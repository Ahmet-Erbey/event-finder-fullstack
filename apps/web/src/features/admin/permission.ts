import type { AuthMeResponse } from '#types/api';
import { hasPermission, PERMISSIONS } from '#lib/auth';

/** Global etkinlik yönetim izinlerinden en az biri (sistem yöneticisi) */
export function canAccessAdminPanel(session: AuthMeResponse | undefined | null): boolean {
  if (!session?.claims) return false;
  return (
    hasPermission(session, PERMISSIONS.EVENTS.CREATE) ||
    hasPermission(session, PERMISSIONS.EVENTS.UPDATE) ||
    hasPermission(session, PERMISSIONS.EVENTS.DESTROY)
  );
}

export function canCreateEvent(session: AuthMeResponse | undefined | null) {
  return hasPermission(session, PERMISSIONS.EVENTS.CREATE);
}
export function canUpdateEvent(session: AuthMeResponse | undefined | null) {
  return hasPermission(session, PERMISSIONS.EVENTS.UPDATE);
}
export function canDeleteEvent(session: AuthMeResponse | undefined | null) {
  return hasPermission(session, PERMISSIONS.EVENTS.DESTROY);
}
