import { Image, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

export default function Logo() {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo-icon.png')}
        style={styles.icon}
        resizeMode="contain"
      />
      <View style={styles.textBlock}>
        <View style={styles.wordmark}>
          <Text style={[styles.wordmarkText, { color: colors.textOnDark }]}>Qué</Text>
          <Text style={[styles.wordmarkText, { color: colors.brandBlue }]}>Hago</Text>
          <Text style={[styles.wordmarkText, { color: colors.secondary }]}>Hoy</Text>
        </View>
        <Text style={styles.subtitle}>Ideas reales para tu tiempo.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 47,
    height: 60,
  },
  textBlock: {
    marginLeft: 8,
  },
  wordmark: {
    flexDirection: 'row',
  },
  wordmarkText: {
    fontSize: 19,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 11,
    color: colors.textOnDarkSecondary,
  },
});
