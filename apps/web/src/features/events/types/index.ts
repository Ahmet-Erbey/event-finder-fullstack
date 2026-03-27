export type EventType =
  | 'concert'
  | 'theater'
  | 'sports'
  | 'exhibition'
  | 'festival'
  | 'comedy'
  | 'other';

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  concert: 'Konser',
  theater: 'Tiyatro',
  sports: 'Spor',
  exhibition: 'Sergi',
  festival: 'Festival',
  comedy: 'Stand-up',
  other: 'Diğer',
};

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  concert: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  theater: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  sports: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  exhibition: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  festival: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  comedy: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  other: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
};

export interface Event {
  id: string;
  title: string;
  type: EventType;
  city: string;
  date: string; // ISO date string
  time: string; // e.g. "20:00"
  venue: string;
  description: string;
  imageUrl?: string;
  price?: number;
  isFree?: boolean;
  tags?: string[];
}

export interface FilterState {
  city: string;
  date: string;
  type: string;
  search: string;
}

export const TURKISH_CITIES = [
  'İstanbul',
  'Ankara',
  'İzmir',
  'Bursa',
  'Antalya',
  'Adana',
  'Konya',
  'Gaziantep',
  'Mersin',
  'Trabzon',
];
