import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, typography } from '../theme/tokens';
import {
  buildMonthGrid,
  compareMonths,
  formatMonthLabel,
  fromISODate,
  isPastDate,
  shiftMonth,
  startOfToday,
  WEEKDAY_COLUMNS,
} from '../utils/date';

const SELECTED_CIRCLE = 36;

interface VisibleMonth {
  year: number;
  month: number;
}

interface CalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  /** La pantalla decide qué día tiene cupo; el calendario solo lo pinta. */
  isDayAvailable: (date: string) => boolean;
}

function currentMonth(): VisibleMonth {
  const today = startOfToday();
  return { year: today.getFullYear(), month: today.getMonth() };
}

export function Calendar({ selectedDate, onSelectDate, isDayAvailable }: CalendarProps) {
  const [visible, setVisible] = useState<VisibleMonth>(() => {
    if (selectedDate === null) {
      return currentMonth();
    }
    const date = fromISODate(selectedDate);
    return { year: date.getFullYear(), month: date.getMonth() };
  });

  const weeks = useMemo(() => buildMonthGrid(visible.year, visible.month), [visible]);
  // No se navega a meses ya pasados: no hay nada reservable ahí.
  const canGoBack = compareMonths(visible, currentMonth()) > 0;

  const goToPreviousMonth = () => {
    setVisible((month) => shiftMonth(month.year, month.month, -1));
  };

  const goToNextMonth = () => {
    setVisible((month) => shiftMonth(month.year, month.month, 1));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={goToPreviousMonth}
          disabled={!canGoBack}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Mes anterior"
          accessibilityState={{ disabled: !canGoBack }}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={canGoBack ? colors.textPrimary : colors.textMuted}
          />
        </Pressable>
        <Text style={styles.monthLabel}>{formatMonthLabel(visible.year, visible.month)}</Text>
        <Pressable
          onPress={goToNextMonth}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Mes siguiente"
        >
          <Ionicons name="chevron-forward" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {WEEKDAY_COLUMNS.map((column) => (
          <Text key={column} style={styles.weekday}>
            {column}
          </Text>
        ))}
      </View>

      {weeks.map((week, weekIndex) => (
        <View key={`semana-${weekIndex}`} style={styles.weekRow}>
          {week.map((iso, dayIndex) => {
            if (iso === null) {
              return <View key={`vacio-${weekIndex}-${dayIndex}`} style={styles.cell} />;
            }

            const disabled = isPastDate(iso) || !isDayAvailable(iso);
            const selected = iso === selectedDate;
            const dayNumber = fromISODate(iso).getDate();

            return (
              <Pressable
                key={iso}
                onPress={() => onSelectDate(iso)}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityState={{ disabled, selected }}
                accessibilityLabel={`Día ${dayNumber}`}
                style={styles.cell}
              >
                <View style={[styles.dayWrapper, selected && styles.selectedWrapper]}>
                  <Text
                    style={[
                      styles.day,
                      disabled && styles.dayDisabled,
                      selected && styles.daySelected,
                    ]}
                  >
                    {dayNumber}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
  },
  monthLabel: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekday: {
    ...typography.micro,
    fontSize: 11,
    letterSpacing: 0,
    flex: 1,
    textAlign: 'center',
    color: colors.textMuted,
    paddingBottom: spacing.xs,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayWrapper: {
    width: SELECTED_CIRCLE,
    height: SELECTED_CIRCLE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedWrapper: {
    backgroundColor: colors.primary,
  },
  day: {
    ...typography.body,
    fontWeight: '600',
    color: colors.freeText,
  },
  dayDisabled: {
    color: colors.textMuted,
    fontWeight: '400',
  },
  daySelected: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
});
