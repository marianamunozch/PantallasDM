import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '../../src/components/Card';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { SummaryRow } from '../../src/components/SummaryRow';
import { useBooking } from '../../src/context/BookingContext';
import { useBookingNavigation } from '../../src/hooks/useBookingNavigation';
import { useRequireBooking } from '../../src/hooks/useRequireBooking';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';
import { formatDayMonthYear, formatTime12h } from '../../src/utils/date';

const CHECK_CIRCLE = 64;

export default function ConfirmadaScreen() {
  const { goHome } = useBookingNavigation();
  const ready = useRequireBooking(['barber', 'date', 'time', 'customer']);
  const { barber, date, time, name, phone } = useBooking();

  if (!ready || barber === null || date === null || time === null) {
    return null;
  }

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.check}>
          <Ionicons name="checkmark" size={32} color={colors.primary} />
        </View>
        <Text style={styles.title}>Cita confirmada</Text>
        <Text style={styles.subtitle}>{`Te esperamos, ${name}.`}</Text>

        <View style={styles.card}>
          <Card>
            <SummaryRow label="Barbero" value={barber.name} />
            <SummaryRow label="Fecha" value={formatDayMonthYear(date)} />
            <SummaryRow label="Hora" value={formatTime12h(time)} />
            <SummaryRow label="Nombre" value={name} />
            <SummaryRow label="Celular" value={phone} />
          </Card>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Ir al inicio ahora" onPress={goHome} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  check: {
    width: CHECK_CIRCLE,
    height: CHECK_CIRCLE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.resultTitle,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  card: {
    alignSelf: 'stretch',
    paddingTop: spacing.md,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
});
