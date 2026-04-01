import { createFileRoute } from '@tanstack/react-router';
import { BillingPage } from '#/features/profile';

export const Route = createFileRoute('/_authenticated/profil/faturalama')({
  component: BillingPage,
});
