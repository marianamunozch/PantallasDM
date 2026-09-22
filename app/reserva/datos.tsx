import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BarberChip } from '../../src/components/BarberChip';
import { Card } from '../../src/components/Card';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { StepHeader } from '../../src/components/StepHeader';
import { SummaryRow } from '../../src/components/SummaryRow';
import { useBooking } from '../../src/context/BookingContext';
import { useBookingNavigation } from '../../src/hooks/useBookingNavigation';
import { useRequireBooking } from '../../src/hooks/useRequireBooking';
import { colors, radius, spacing, typography } from '../../src/theme/tokens';
import { formatShortDate, formatTime12h } from '../../src/utils/date';

const MIN_NAME_LENGTH = 3;
const PHONE_LENGTH = 10;
/** Simula la latencia del futuro POST /bookings. */
const SUBMIT_DELAY_MS = 1200;

const KEYBOARD_BEHAVIOR = Platform.OS === 'ios' ? 'padding' : 'height';

type FocusedField = 'name' | 'phone' | null;

export default function DatosScreen() {
  const router = useRouter();
  const { goBack, changeBarber } = useBookingNavigation();
  const ready = useRequireBooking(['barber', 'date', 'time']);
  const { barber, date, time, name, phone, setName, setPhone } = useBooking();

  const [focused, setFocused] = useState<FocusedField>(null);
  const [submitting, setSubmitting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Evita navegar sobre una pantalla ya desmontada si el usuario vuelve atrás
  // mientras corre la espera simulada.
  useEffect(
    () => () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const trimmedName = name.trim();
  const isValid = trimmedName.length >= MIN_NAME_LENGTH && phone.length === PHONE_LENGTH;

  /** El teléfono se guarda solo con dígitos: así viaja al backend sin limpiar. */
  const changePhone = useCallback(
    (value: string) => {
      setPhone(value.replace(/\D/g, '').slice(0, PHONE_LENGTH));
    },
    [setPhone],
  );

  const confirm = useCallback(() => {
    if (!isValid || submitting) {
      return;
    }
    setSubmitting(true);
    setName(trimmedName);
    timeoutRef.current = setTimeout(() => {
      router.replace('/reserva/confirmada');
    }, SUBMIT_DELAY_MS);
  }, [isValid, router, setName, submitting, trimmedName]);

  if (!ready || barber === null || date === null || time === null) {
    return null;
  }

  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={styles.container}>
      <StepHeader step={5} label="Datos" onBack={goBack} />
      <KeyboardAvoidingView style={styles.fill} behavior={KEYBOARD_BEHAVIOR}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <BarberChip barber={barber} onChange={changeBarber} />
          <View style={styles.heading}>
            <Text style={styles.title}>Tus datos</Text>
          </View>

          <Card>
            <SummaryRow label="Barbero:" value={barber.name} />
            <SummaryRow label="Fecha:" value={formatShortDate(date)} />
            <SummaryRow label="Hora:" value={formatTime12h(time)} />
          </Card>

          <View style={styles.form}>
            <TextInput
              value={name}
              onChangeText={setName}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
              placeholder="¿Cómo te llamas?"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
              accessibilityLabel="Tu nombre"
              style={[styles.input, focused === 'name' && styles.inputFocused]}
            />
            <TextInput
              value={phone}
              onChangeText={changePhone}
              onFocus={() => setFocused('phone')}
              onBlur={() => setFocused(null)}
              placeholder="Número de celular"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              maxLength={PHONE_LENGTH}
              returnKeyType="done"
              accessibilityLabel="Tu número de celular"
              style={[styles.input, focused === 'phone' && styles.inputFocused]}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            label="Confirmar cita"
            loadingLabel="Reservando..."
            loading={submitting}
            disabled={!isValid}
            onPress={confirm}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fill: {
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
  form: {
    gap: spacing.sm,
  },
  input: {
    height: 50,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    ...typography.body,
    color: colors.textPrimary,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surfaceAlt,
  },
});
