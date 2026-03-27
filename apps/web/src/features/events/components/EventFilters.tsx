import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';
import { FilterX, Search } from 'lucide-react';
import { EVENT_TYPE_LABELS, TURKISH_CITIES, type EventType, type FilterState } from '../types';

interface EventFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalCount: number;
  filteredCount: number;
}

export function EventFilters({ filters, onChange, totalCount, filteredCount }: EventFiltersProps) {
  const hasActiveFilters =
    filters.city || filters.date || filters.type || filters.search;

  const clearFilters = () =>
    onChange({ city: '', date: '', type: '', search: '' });

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-none w-[220px]">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Etkinlik ara..."
          className="pl-8 h-9 text-sm bg-background w-full"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
        />
      </div>

      {/* City */}
      <Select
        value={filters.city || 'all'}
        onValueChange={(v) => onChange({ ...filters, city: v === 'all' ? '' : v })}
      >
        <SelectTrigger className="h-9 text-sm w-[150px] bg-background">
          <SelectValue placeholder="Tüm şehirler" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm şehirler</SelectItem>
          {TURKISH_CITIES.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Event Type */}
      <Select
        value={filters.type || 'all'}
        onValueChange={(v) => onChange({ ...filters, type: v === 'all' ? '' : v })}
      >
        <SelectTrigger className="h-9 text-sm w-[150px] bg-background">
          <SelectValue placeholder="Tüm türler" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tüm türler</SelectItem>
          {(Object.keys(EVENT_TYPE_LABELS) as EventType[]).map((type) => (
            <SelectItem key={type} value={type}>
              {EVENT_TYPE_LABELS[type]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date */}
      <Input
        type={filters.date ? 'date' : 'text'}
        placeholder="Tarih seçin"
        onFocus={(e) => (e.target.type = 'date')}
        onBlur={(e) => {
          if (!e.target.value) e.target.type = 'text';
        }}
        className="h-9 text-sm w-[160px] bg-background"
        value={filters.date}
        onChange={(e) => onChange({ ...filters, date: e.target.value })}
      />

      {/* Clear & Count */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 text-muted-foreground"
          onClick={clearFilters}
        >
          <FilterX className="w-4 h-4" />
          Temizle
        </Button>
      )}

      <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
        {filteredCount === totalCount
          ? `${totalCount} etkinlik`
          : `${filteredCount} / ${totalCount}`}
      </span>
    </div>
  );
}
