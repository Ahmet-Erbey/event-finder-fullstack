import { createFileRoute } from '@tanstack/react-router';
import EventDetailPage from '#/features/events/pages/EventDetailPage';

export const Route = createFileRoute('/_authenticated/events/$eventId')({
  component: EventDetailPage,
});
