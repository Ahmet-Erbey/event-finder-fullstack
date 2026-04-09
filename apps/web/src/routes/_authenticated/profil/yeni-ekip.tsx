import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/profil/yeni-ekip')({
  beforeLoad: () => {
    throw redirect({ to: '/profil' });
  },
  component: () => null,
});
