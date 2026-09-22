import type { Barber } from '../types/api';

/**
 * Mock del recurso /barbers.
 *
 * Las pantallas consumen las funciones de abajo, nunca el array: cuando exista
 * el backend, estas funciones pasan a ser peticiones HTTP (async) y ninguna
 * pantalla cambia su forma de pedir los datos.
 */
const BARBERS: Barber[] = [
  {
    id: 'luis-gomez',
    name: 'Luis Gomez',
    specialty: 'Especialista en fades y cortes modernos.',
    avatar: 'https://i.pravatar.cc/240?img=12',
    rating: 5,
    reviewsCount: 2,
    servicesCount: 3,
    reviews: [
      {
        id: 'luis-gomez-1',
        authorName: 'Andrés Rojas',
        comment: 'El mejor fade que me han hecho. Quedó impecable y sin una sola línea dura.',
        rating: 5,
      },
      {
        id: 'luis-gomez-2',
        authorName: 'Camilo Restrepo',
        comment: 'Puntual, conversador y muy preciso con la máquina. Vuelvo cada dos semanas.',
        rating: 5,
      },
    ],
  },
  {
    id: 'alexander-escobar',
    name: 'Alexander Escobar',
    specialty: 'Experto en barba y tratamientos de hidratación capilar.',
    avatar: 'https://i.pravatar.cc/240?img=33',
    rating: 5,
    reviewsCount: 2,
    servicesCount: 3,
    reviews: [
      {
        id: 'alexander-escobar-1',
        authorName: 'Julián Mejía',
        comment: 'Me arregló la barba con toalla caliente y aceite. Salí como nuevo.',
        rating: 5,
      },
      {
        id: 'alexander-escobar-2',
        authorName: 'Santiago Duque',
        comment: 'Sabe exactamente qué tratamiento necesita cada tipo de pelo. Recomendado.',
        rating: 5,
      },
    ],
  },
];

/** Espeja GET /barbers */
export function getBarbers(): Barber[] {
  return BARBERS;
}

/** Espeja GET /barbers/:id */
export function getBarberById(id: string): Barber | null {
  return BARBERS.find((barber) => barber.id === id) ?? null;
}
