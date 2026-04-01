import { createFileRoute } from '@tanstack/react-router';
import { SettingsPage } from '#/features/profile';

export const Route = createFileRoute('/_authenticated/profil/ayarlar')({
  component: SettingsPage,
});
