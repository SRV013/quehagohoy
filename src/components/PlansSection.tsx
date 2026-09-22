import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import PlanCard, { PlanCardData } from './PlanCard';

const PLANS: PlanCardData[] = [
  {
    key: 'atardecer',
    image: require('../assets/plans/atardecer.png'),
    badge: 'Recomendado',
    title: 'Atardecer en la costa',
    duration: '1-2 hs',
    price: 'Bajo',
    group: 'Pareja',
    description: 'Un clásico que nunca falla. Caminata por la rambla y algo rico frente al mar.',
  },
  {
    key: 'cine',
    image: require('../assets/plans/cine.png'),
    title: 'Cine de estreno',
    duration: '2-3 hs',
    price: '$$',
    group: 'Pareja',
    description: 'Las mejores películas en los cines de la ciudad.',
  },
  {
    key: 'aventura',
    image: require('../assets/plans/aventura.png'),
    title: 'Aventura en la naturaleza',
    duration: '3+ hs',
    price: '$',
    group: 'Amigos',
    description: 'Trekking, vistas increíbles y aire puro.',
  },
];

export default function PlansSection() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Planes para hoy en Mar del Plata</Text>
        <View style={styles.link}>
          <Text style={styles.linkText}>Ver todos</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.primary} />
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {PLANS.map((plan) => (
          <PlanCard key={plan.key} plan={plan} />
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
    flexShrink: 1,
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
    gap: 12,
    marginTop: 14,
  },
});
