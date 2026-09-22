import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

const FILTERS: {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}[] = [
  { key: 'tiempo', icon: 'time-outline', label: 'Tiempo', value: '2 horas' },
  { key: 'presupuesto', icon: 'cash-outline', label: 'Presupuesto', value: '$ 20.000' },
  { key: 'conQuien', icon: 'people-outline', label: 'Con quién', value: 'Solo' },
  { key: 'donde', icon: 'location-outline', label: 'Dónde', value: 'Cerca mío' },
];

export default function FilterBar() {
  return (
    <View style={styles.card}>
      {FILTERS.map((filter, index) => (
        <View key={filter.key} style={[styles.item, index < FILTERS.length - 1 && styles.divider]}>
          <Ionicons name={filter.icon} size={18} color={colors.textPrimary} />
          <Text style={styles.label} numberOfLines={1}>
            {filter.label}
          </Text>
          <View style={styles.valueRow}>
            <Text style={styles.value} numberOfLines={1}>
              {filter.value}
            </Text>
            <Ionicons name="chevron-down" size={12} color={colors.textSecondary} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundLight,
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  item: {
    flex: 1,
    paddingHorizontal: 4,
  },
  divider: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    color: colors.textSecondary,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 2,
  },
  value: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
