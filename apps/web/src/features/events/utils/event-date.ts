import { format, isValid, parseISO, type Locale } from 'date-fns';

/**
 * API / client bazen `date` alanını YYYY-MM-DD string, bazen `Date` olarak verir.
 * `date-fns` `parseISO` yalnızca string alır; burada `format` için güvenli `Date` üretir.
 */
export function eventFieldToDate(value: unknown): Date {
  if (value == null) {
    return new Date(NaN);
  }
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === 'string') {
    const t = value.trim();
    if (t.length === 0) {
      return new Date(NaN);
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(t) || t.includes('T')) {
      const d = parseISO(t);
      return isValid(d) ? d : new Date(NaN);
    }
    const d2 = new Date(t);
    return isValid(d2) ? d2 : new Date(NaN);
  }
  if (typeof value === 'number' && Number.isFinite(value)) {
    const d = new Date(value);
    return isValid(d) ? d : new Date(NaN);
  }
  return new Date(NaN);
}

export function formatEventFieldDate(
  value: unknown,
  pattern: string,
  options: { locale: Locale },
  fallback: string = '—',
): string {
  const d = eventFieldToDate(value);
  if (!isValid(d)) {
    return fallback;
  }
  return format(d, pattern, options);
}
