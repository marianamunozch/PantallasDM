import { Platform, type TextStyle } from 'react-native';

export const colors = {
  bg: '#121014',
  surface: '#1C191F',
  surfaceAlt: '#17161B',
  border: '#2A272F',
  primary: '#F5910E',
  primaryDark: '#D97C08',
  free: '#22C55E',
  freeText: '#4ADE80',
  busy: '#EF4444',
  textPrimary: '#FFFFFF',
  textSecondary: '#9B96A3',
  textMuted: '#6B6673',
  disabledBg: '#2C2A30',
  whatsapp: '#25D366',
  /** Overlay del hero y fondo del check de confirmación. */
  heroOverlay: 'rgba(0,0,0,0.6)',
  primarySoft: 'rgba(245,145,14,0.15)',
} as const;

export const radius = { sm: 8, md: 12, lg: 16, pill: 999 } as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

/**
 * Sans geométrica del sistema. Evita @expo-google-fonts para no sumar
 * dependencias ni un gate de carga de fuentes en el layout raíz.
 */
export const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

/**
 * Escala tipográfica. Cada entrada se compone dentro de StyleSheet.create
 * en los componentes, nunca se aplica como estilo inline suelto.
 */
export const typography = {
  heroTitle: { fontFamily, fontSize: 34, fontWeight: '700', lineHeight: 41 },
  resultTitle: { fontFamily, fontSize: 26, fontWeight: '700' },
  screenTitle: { fontFamily, fontSize: 24, fontWeight: '700' },
  profileName: { fontFamily, fontSize: 22, fontWeight: '700' },
  cardTitle: { fontFamily, fontSize: 16, fontWeight: '700' },
  button: { fontFamily, fontSize: 16, fontWeight: '700' },
  body: { fontFamily, fontSize: 14, fontWeight: '400' },
  bodyStrong: { fontFamily, fontSize: 14, fontWeight: '700' },
  caption: { fontFamily, fontSize: 13, fontWeight: '400' },
  meta: { fontFamily, fontSize: 12, fontWeight: '400' },
  overline: {
    fontFamily,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  micro: {
    fontFamily,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
} satisfies Record<string, TextStyle>;
