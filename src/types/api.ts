/**
 * Contrato con la API futura (Node + Express + PostgreSQL).
 * Solo tipos de dominio: nada de UI ni de navegación.
 * Hoy lo implementa src/data/ con mocks; mañana, llamadas HTTP.
 */

/** Disponibilidad de un horario. Espeja el enum que expondrá la API. */
export type SlotStatus = 'libre' | 'ocupado';

/** Reseña de un cliente sobre un barbero. */
export interface Review {
  id: string;
  authorName: string;
  comment: string;
  /** Entero de 1 a 5. */
  rating: number;
}

/** GET /barbers  ·  GET /barbers/:id */
export interface Barber {
  id: string;
  name: string;
  specialty: string;
  /** URL absoluta del avatar. */
  avatar: string;
  /** Promedio de 0 a 5, con un decimal. */
  rating: number;
  reviewsCount: number;
  servicesCount: number;
  reviews: Review[];
}

/** GET /barbers/:id/slots?date=YYYY-MM-DD */
export interface Slot {
  id: string;
  /** Hora en formato 'HH:mm' 24h. La presentación vive en src/utils/date.ts. */
  time: string;
  status: SlotStatus;
}

/** POST /bookings (respuesta)  ·  GET /bookings/:id */
export interface Booking {
  id: string;
  barberId: string;
  /** 'YYYY-MM-DD' */
  date: string;
  /** 'HH:mm' 24h */
  time: string;
  customerName: string;
  /** Exactamente 10 dígitos, sin separadores. */
  customerPhone: string;
  /** ISO 8601, generado por el servidor. */
  createdAt: string;
}

/** Cuerpo de POST /bookings: el servidor genera id y createdAt. */
export type CreateBookingInput = Omit<Booking, 'id' | 'createdAt'>;
