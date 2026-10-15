import { pool } from '../../src/config/database.js';

/**
 * Deja la tabla de citas vacía.
 *
 * Se llama antes de cada test para que ninguno dependa de lo que dejó el
 * anterior: un test que solo pasa si corre en cierto orden no sirve de nada.
 * No se tocan barbers ni barber_schedules: son datos de referencia.
 */
export async function resetBookings(): Promise<void> {
  await pool.query('TRUNCATE TABLE bookings');
}

/** Cierra el pool al terminar el archivo, si no vitest se queda colgado. */
export async function closeDatabase(): Promise<void> {
  await pool.end();
}
