import { Ionicons } from '@expo/vector-icons';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

export type PlanCardData = {
  key: string;
  image: ImageSourcePropType;
  badge?: string;
  title: string;
  duration: string;
  price: string;
  group: string;
  description: string;
};

export default function PlanCard({ plan }: { plan: PlanCardData }) {
  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        <Image source={plan.image} style={styles.image} resizeMode="cover" />
        {plan.badge && (
          <View style={styles.badge}>
            <Ionicons name="flame" size={11} color={colors.textOnDark} />
            <Text style={styles.badgeText}>{plan.badge}</Text>
          </View>
        )}
        <View style={styles.heartButton}>
          <Ionicons name="heart-outline" size={15} color={colors.textOnDark} />
        </View>
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {plan.title}
      </Text>
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
          <Text style={styles.metaText}>{plan.duration}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="cash-outline" size={12} color={colors.textSecondary} />
          <Text style={styles.metaText}>{plan.price}</Text>
        </View>
        <View style={styles.metaItem}>
          <Ionicons name="people-outline" size={12} color={colors.textSecondary} />
          <Text style={styles.metaText}>{plan.group}</Text>
        </View>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {plan.description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 170,
  },
  imageWrapper: {
    width: '100%',
    height: 112,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.backgroundSubtle,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.success,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textOnDark,
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(11, 20, 36, 0.35)',
  },
  title: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  description: {
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
    color: colors.textSecondary,
  },
});
