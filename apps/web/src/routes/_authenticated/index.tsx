import { createFileRoute } from '@tanstack/react-router';
import EventsPage from '#/features/events/pages/EventsPage';

export const Route = createFileRoute('/_authenticated/')({
  component: EventsPage,
});
