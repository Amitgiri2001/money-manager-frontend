export function toMonthInputValue(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

export function toDateTimeLocalValue(date = new Date()) {
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export function fromDateTimeLocalValue(value: string) {
  return value.length === 16 ? `${value}:00` : value;
}

export function formatCurrency(value: number | null | undefined) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value ?? 0);
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}
