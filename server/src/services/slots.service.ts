import { UnprocessableError } from '../errors/app-error.js';
import { ERROR_CODES } from '../errors/codes.js';
import * as bookingsRepository from '../repositories/bookings.repository.js';
import * as schedulesRepository from '../repositories/schedules.repository.js';
import type { Slot } from '../types/api.js';
import { currentMinutes, today } from '../utils/clock.js';
import { generateSlotTimes, toMinutes, weekdayOf } from '../utils/time.js';

import * as barbersService from './barbers.service.js';

/**
 * Disponibilidad de un barbero en un día.
 *
 * Las franjas no están almacenadas: se generan a partir de la regla guardada
 * en barber_schedules y se cruzan con las citas activas de ese día.
 */
export async function getAvailability(barberId: string, date: string): Promise<Slot[]> {
  await barbersService.assertExists(barberId);

  const currentDate = today();
  if (date < currentDate) {
    // Comparar strings 'YYYY-MM-DD' funciona: el formato ordena igual que la fecha.
    throw new UnprocessableError(
      ERROR_CODES.DATE_IN_PAST,
      'No se puede consultar disponibilidad de una fecha pasada.',
      [{ field: 'date', issue: 'anterior a hoy' }],
    );
  }

  const schedule = await schedulesRepository.findByBarberAndWeekday(barberId, weekdayOf(date));

  // Día sin horario no es un error: es una pregunta válida con respuesta vacía.
  if (schedule === null) {
    return [];
  }

  const takenTimes = new Set(await bookingsRepository.findActiveTimes(barberId, date));
  const isToday = date === currentDate;
  const minutesNow = currentMinutes();

  return generateSlotTimes(schedule.firstSlotAt, schedule.lastSlotAt, schedule.slotMinutes).map(
    (time) => ({
      id: `${barberId}-${date}-${time}`,
      time,
      // Una hora de hoy que ya pasó se expone como ocupada: el contrato solo
      // tiene libre/ocupado, y lo que importa es que no se pueda reservar.
      status:
        takenTimes.has(time) || (isToday && toMinutes(time) <= minutesNow) ? 'ocupado' : 'libre',
    }),
  );
}
