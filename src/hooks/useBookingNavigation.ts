import { useMemo } from 'react';
import { useRouter } from 'expo-router';

const HOME = '/';
const FIRST_STEP = '/reserva/barbero';

interface BookingNavigation {
  /** Cierra el flujo y vuelve al Home sin duplicarlo en la pila. */
  goHome: () => void;
  /** Retroceso del chevron del StepHeader. */
  goBack: () => void;
  /** Vuelve al paso 1 desde cualquier paso posterior. */
  changeBarber: () => void;
}

/**
 * Navegación del flujo de reserva.
 *
 * Cada acción tiene un plan B para el caso de entrar por deep link directo a
 * un paso intermedio: ahí no hay pila que descartar y dismiss* no haría nada,
 * así que se reemplaza la ruta actual.
 */
export function useBookingNavigation(): BookingNavigation {
  const router = useRouter();

  return useMemo<BookingNavigation>(
    () => ({
      goHome: () => {
        if (router.canDismiss()) {
          router.dismissAll();
          return;
        }
        router.replace(HOME);
      },
      goBack: () => {
        if (router.canGoBack()) {
          router.back();
          return;
        }
        router.replace(HOME);
      },
      changeBarber: () => {
        if (router.canDismiss()) {
          router.dismissTo(FIRST_STEP);
          return;
        }
        router.replace(FIRST_STEP);
      },
    }),
    [router],
  );
}
