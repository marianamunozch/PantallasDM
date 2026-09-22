import type { Slot, SlotStatus } from '../types/api';
import { fromISODate } from '../utils/date';

/**
 * Mock del recurso /barbers/:id/slots.
 *
 * La disponibilidad es determinista: la misma combinación de barbero y fecha
 * siempre devuelve los mismos estados, así la pantalla no "cambia sola" al
 * volver atrás, pero cada día se ve distinto.
 */

const OPENING_MINUTES = 9 * 60; // 9:00 am
const CLOSING_MINUTES = 19 * 60 + 30; // 7:30 pm
const STEP_MINUTES = 30;
const SUNDAY = 0;

/** Uno de cada N horarios sale ocupado. */
const BUSY_RATIO = 3;
/** Uno de cada N días (además de los domingos) sale sin cupos. */
const CLOSED_RATIO = 11;

/** FNV-1a: hash estable entre plataformas, sin dependencias. */
function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function toTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/** Domingos cerrados, más algunos días sueltos sin agenda. */
function isClosed(barberId: string, date: string): boolean {
  if (fromISODate(date).getDay() === SUNDAY) {
    return true;
  }
  return hash(`cerrado:${barberId}:${date}`) % CLOSED_RATIO === 0;
}

/**
 * Espeja GET /barbers/:id/slots?date=YYYY-MM-DD
 * Devuelve [] cuando el barbero no atiende ese día.
 */
export function getSlots(barberId: string, date: string): Slot[] {
  if (isClosed(barberId, date)) {
    return [];
  }

  const slots: Slot[] = [];
  for (let minutes = OPENING_MINUTES; minutes <= CLOSING_MINUTES; minutes += STEP_MINUTES) {
    const time = toTime(minutes);
    const status: SlotStatus =
      hash(`${barberId}:${date}:${time}`) % BUSY_RATIO === 0 ? 'ocupado' : 'libre';
    slots.push({ id: `${barberId}-${date}-${time}`, time, status });
  }
  return slots;
}

/** Atajo para pintar el calendario sin recorrer los horarios en la pantalla. */
export function hasFreeSlots(barberId: string, date: string): boolean {
  return getSlots(barberId, date).some((slot) => slot.status === 'libre');
}
