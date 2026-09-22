import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopBar } from '../../src/components/TopBar';
import { useBookingNavigation } from '../../src/hooks/useBookingNavigation';
import { colors } from '../../src/theme/tokens';

/**
 * La TopBar vive en el layout, no en cada paso: así queda fija y no entra en
 * la animación de transición entre pantallas.
 */
export default function ReservaLayout() {
  const { goHome } = useBookingNavigation();

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.topBarArea}>
        <TopBar onClose={goHome} />
      </SafeAreaView>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: styles.screen,
          animation: 'slide_from_right',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  topBarArea: {
    backgroundColor: colors.surfaceAlt,
  },
  screen: {
    backgroundColor: colors.bg,
  },
});
