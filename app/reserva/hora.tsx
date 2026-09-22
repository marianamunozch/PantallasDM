import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BarberChip } from '../../src/components/BarberChip';
import { SlotChip } from '../../src/components/SlotChip';
import { StepHeader } from '../../src/components/StepHeader';
import { useBooking } from '../../src/context/BookingContext';
import { getSlots } from '../../src/data/slots';
import { useBookingNavigation } from '../../src/hooks/useBookingNavigation';
import { useRequireBooking } from '../../src/hooks/useRequireBooking';
import { colors, spacing, typography } from '../../src/theme/tokens';
import type { Slot } from '../../src/types/api';
import { formatShortDate } from '../../src/utils/date';

export default function HoraScreen() {
  const router = useRouter();
  const { goBack, changeBarber } = useBookingNavigation();
  const ready = useRequireBooking(['barber', 'date']);
  const { barber, date, time, setTime } = useBooking();

  const slots = useMemo<Slot[]>(
    () => (barber === null || date === null ? [] : getSlots(barber.id, date)),
    [barber, date],
  );

  const selectSlot = useCallback(
    (slot: Slot) => {
      setTime(slot.time);
      router.push('/reserva/datos');
    },
    [router, setTime],
  );

  if (!ready || barber === null || date === null) {
    return null;
  }

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>
      <StepHeader step={4} label="Hora" onBack={goBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <BarberChip barber={barber} onChange={changeBarber} />
        <View style={styles.heading}>
          <Text style={styles.title}>Elige la hora</Text>
          <Text style={styles.subtitle}>{formatShortDate(date)}</Text>
        </View>

        {slots.length === 0 ? (
          <Text style={styles.empty}>Sin horarios disponibles ese día.</Text>
        ) : (
          <View style={styles.grid}>
            {slots.map((slot) => (
              <View key={slot.id} style={styles.gridItem}>
                <SlotChip slot={slot} selected={slot.time === time} onSelect={selectSlot} />
              </View>
            ))}
          </View>
        )}
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
    gap: spacing.xs,
    paddingTop: spacing.xs,
  },
  title: {
    ...typography.screenTitle,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: '31%',
  },
  empty: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.xl,
  },
});
