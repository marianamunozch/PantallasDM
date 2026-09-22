import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

import type { Barber } from '../types/api';

interface BookingState {
  barber: Barber | null;
  date: string | null;
  time: string | null;
  name: string;
  phone: string;
}

interface BookingContextValue extends BookingState {
  setBarber: (barber: Barber) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
  reset: () => void;
}

const INITIAL_STATE: BookingState = {
  barber: null,
  date: null,
  time: null,
  name: '',
  phone: '',
};

const BookingContext = createContext<BookingContextValue | null>(null);

/**
 * Estado de la reserva en curso.
 *
 * Regla de negocio: cambiar de barbero invalida la fecha y la hora, y cambiar
 * de fecha invalida la hora, porque la disponibilidad depende de ambos. Sin
 * esto se podría confirmar una cita en un horario que ese barbero no tiene.
 */
export function BookingProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<BookingState>(INITIAL_STATE);

  const setBarber = useCallback((barber: Barber) => {
    setState((current) => ({ ...current, barber, date: null, time: null }));
  }, []);

  const setDate = useCallback((date: string) => {
    setState((current) => ({ ...current, date, time: null }));
  }, []);

  const setTime = useCallback((time: string) => {
    setState((current) => ({ ...current, time }));
  }, []);

  const setName = useCallback((name: string) => {
    setState((current) => ({ ...current, name }));
  }, []);

  const setPhone = useCallback((phone: string) => {
    setState((current) => ({ ...current, phone }));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const value = useMemo<BookingContextValue>(
    () => ({ ...state, setBarber, setDate, setTime, setName, setPhone, reset }),
    [state, setBarber, setDate, setTime, setName, setPhone, reset],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking(): BookingContextValue {
  const context = useContext(BookingContext);
  if (context === null) {
    throw new Error('useBooking debe usarse dentro de <BookingProvider>.');
  }
  return context;
}
