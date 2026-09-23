import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

export default function HeroHeading() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Text style={styles.titleWhite}>Contanos qué tenés </Text>
        <Text style={styles.titleAccent}>ganas de hacer</Text>
      </Text>
      <Text style={styles.subtitle}>
        Escribí tu idea acá abajo y te mostramos las mejores opciones cerca tuyo.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  titleWhite: {
    color: colors.textOnDark,
  },
  titleAccent: {
    color: colors.secondary,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textOnDarkSecondary,
  },
});
