/**
 * Fechas relativas a hoy.
 *
 * Los tests no pueden llevar fechas fijas: '2026-07-14' hoy es futuro y en
 * dos años es pasado, y la suite empezaría a fallar sola.
 */

function toISO(date: Date): string {
  const pad = (value: number): string => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function shiftDays(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

/** Fecha futura en la que el barbero SÍ atiende (lunes a sábado). */
export function futureOpenDate(daysAhead = 7): string {
  const date = shiftDays(daysAhead);
  if (date.getDay() === 0) {
    date.setDate(date.getDate() + 1);
  }
  return toISO(date);
}

/** Próximo domingo futuro: el día que la barbería cierra. */
export function futureSunday(): string {
  const date = shiftDays(1);
  while (date.getDay() !== 0) {
    date.setDate(date.getDate() + 1);
  }
  return toISO(date);
}

/** Una fecha que ya pasó. */
export function pastDate(): string {
  return toISO(shiftDays(-3));
}
