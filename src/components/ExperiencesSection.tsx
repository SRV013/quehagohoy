import { Ionicons } from '@expo/vector-icons';
import { Image, ImageSourcePropType, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

type Experience = {
  key: string;
  label: string;
  image: ImageSourcePropType;
};

const EXPERIENCES: Experience[] = [
  { key: 'playas', label: 'Playas', image: require('../assets/experiences/playas.png') },
  {
    key: 'restaurantes',
    label: 'Restaurantes',
    image: require('../assets/experiences/restaurantes.png'),
  },
  { key: 'bares', label: 'Bares', image: require('../assets/experiences/bares.png') },
  { key: 'paseos', label: 'Paseos', image: require('../assets/experiences/paseos.png') },
  { key: 'deportes', label: 'Deportes', image: require('../assets/experiences/deportes.png') },
  { key: 'eventos', label: 'Eventos', image: require('../assets/experiences/eventos.png') },
  { key: 'escapadas', label: 'Escapadas', image: require('../assets/experiences/escapadas.png') },
];

export default function ExperiencesSection() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Experiencias cerca tuyo</Text>
        <View style={styles.link}>
          <Text style={styles.linkText}>Ver mapa</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {EXPERIENCES.map((experience) => (
          <View key={experience.key} style={styles.item}>
            <Image source={experience.image} style={styles.circle} />
            <Text style={styles.label} numberOfLines={1}>
              {experience.label}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 16,
    marginTop: 14,
  },
  item: {
    alignItems: 'center',
    width: 68,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.backgroundSubtle,
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});
