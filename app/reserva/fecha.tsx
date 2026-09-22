import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BarberChip } from '../../src/components/BarberChip';
import { Calendar } from '../../src/components/Calendar';
import { StepHeader } from '../../src/components/StepHeader';
import { useBooking } from '../../src/context/BookingContext';
import { hasFreeSlots } from '../../src/data/slots';
import { useBookingNavigation } from '../../src/hooks/useBookingNavigation';
import { useRequireBooking } from '../../src/hooks/useRequireBooking';
import { colors, spacing, typography } from '../../src/theme/tokens';

export default function FechaScreen() {
  const router = useRouter();
  const { goBack, changeBarber } = useBookingNavigation();
  const ready = useRequireBooking(['barber']);
  const { barber, date, setDate } = useBooking();

  const isDayAvailable = useCallback(
    (iso: string) => (barber === null ? false : hasFreeSlots(barber.id, iso)),
    [barber],
  );

  const selectDate = useCallback(
    (iso: string) => {
      setDate(iso);
      router.push('/reserva/hora');
    },
    [router, setDate],
  );

  if (!ready || barber === null) {
    return null;
  }

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>
      <StepHeader step={3} label="Fecha" onBack={goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <BarberChip barber={barber} onChange={changeBarber} />
        <View style={styles.heading}>
          <Text style={styles.title}>Elige el día</Text>
        </View>
        <Calendar selectedDate={date} onSelectDate={selectDate} isDayAvailable={isDayAvailable} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
  heading: {
    paddingTop: spacing.xs,
  },
  title: {
    ...typography.screenTitle,
    color: colors.textPrimary,
  },
});
