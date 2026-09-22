import { Image, StyleSheet } from 'react-native';

import { colors } from '../theme/tokens';

interface AvatarProps {
  uri: string;
  /** Diámetro en px. El radio se deriva para mantenerlo circular. */
  size: number;
  /** Anillo naranja de 2px, usado en la ficha de perfil. */
  ring?: boolean;
}

export function Avatar({ uri, size, ring = false }: AvatarProps) {
  return (
    <Image
      source={{ uri }}
      accessibilityIgnoresInvertColors
      style={[
        styles.image,
        // Dimensión derivada de la prop: no puede vivir en StyleSheet.create.
        { width: size, height: size, borderRadius: size / 2 },
        ring && styles.ring,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surface,
  },
  ring: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
});
