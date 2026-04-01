import { createFileRoute } from '@tanstack/react-router';
import { NewTeamPage } from '#/features/profile';

export const Route = createFileRoute('/_authenticated/profil/yeni-ekip')({
  component: NewTeamPage,
});
