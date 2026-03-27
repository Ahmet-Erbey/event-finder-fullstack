import { IconCalendarEvent } from '@tabler/icons-react';
import type { SidebarData } from '../types';

export const companySidebarData: SidebarData = {
  navGroups: [
    {
      title: 'Ana Menü',
      items: [
        {
          title: 'Etkinlikler',
          url: '/events',
          icon: IconCalendarEvent,
        },
      ],
    },
  ],
};