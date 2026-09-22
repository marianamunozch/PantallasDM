import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BookingProvider } from '../src/context/BookingContext';
import { colors } from '../src/theme/tokens';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <BookingProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: styles.screen,
            animation: 'slide_from_right',
          }}
        />
      </BookingProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.bg,
  },
});
