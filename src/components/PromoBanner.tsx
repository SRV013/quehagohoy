import { Ionicons } from '@expo/vector-icons';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

export default function PromoBanner() {
  return (
    <ImageBackground
      source={require('../assets/promo-banner.png')}
      style={styles.container}
      imageStyle={styles.image}
    >
      <View style={styles.overlay} />
      <View style={styles.textBlock}>
        <Text style={styles.title}>Menos dudas.</Text>
        <Text style={styles.title}>Más momentos.</Text>
      </View>
      <View style={styles.button}>
        <Text style={styles.buttonText}>Explorar planes</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.textPrimary} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 24,
    height: 130,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: 16,
  },
  image: {
    borderRadius: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11, 20, 36, 0.25)',
  },
  textBlock: {
    zIndex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textOnDark,
  },
  button: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.textOnDark,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 1,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
