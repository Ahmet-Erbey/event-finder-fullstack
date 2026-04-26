import { canAccessAdminPanel } from '#/features/admin/permission';
import AdminPage from '#/features/admin/AdminPage';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/admin/')({
  beforeLoad: ({ context }) => {
    if (!context.session) {
      throw redirect({ to: '/sign-in' });
    }
    if (!canAccessAdminPanel(context.session)) {
      throw redirect({ to: '/' });
    }
  },
  component: AdminPage,
});
