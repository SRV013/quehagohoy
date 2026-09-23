import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import FilterPickerModal from './FilterPickerModal';

type FilterKey = 'tiempo' | 'presupuesto' | 'conQuien' | 'donde';

const FILTERS: {
  key: FilterKey;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  options: string[];
}[] = [
  {
    key: 'tiempo',
    icon: 'time-outline',
    label: 'Tiempo',
    options: ['30 min', '1 hora', '2 horas', '3+ horas'],
  },
  {
    key: 'presupuesto',
    icon: 'cash-outline',
    label: 'Presupuesto',
    options: ['Gratis', '$ 10.000', '$ 20.000', '$ 50.000+'],
  },
  {
    key: 'conQuien',
    icon: 'people-outline',
    label: 'Con quién',
    options: ['Solo', 'Pareja', 'Amigos', 'Familia'],
  },
  {
    key: 'donde',
    icon: 'location-outline',
    label: 'Dónde',
    options: ['Cerca mío', 'Toda la ciudad', 'Otra zona'],
  },
];

const DEFAULT_VALUES: Record<FilterKey, string> = {
  tiempo: '2 horas',
  presupuesto: '$ 20.000',
  conQuien: 'Solo',
  donde: 'Cerca mío',
};

export default function FilterBar() {
  const [values, setValues] = useState<Record<FilterKey, string>>(DEFAULT_VALUES);
  const [activeFilter, setActiveFilter] = useState<FilterKey | null>(null);

  const active = FILTERS.find((filter) => filter.key === activeFilter) ?? null;

  return (
    <View style={styles.card}>
      {FILTERS.map((filter, index) => (
        <Pressable
          key={filter.key}
          style={[styles.item, index < FILTERS.length - 1 && styles.divider]}
          onPress={() => setActiveFilter(filter.key)}
        >
          <Ionicons name={filter.icon} size={18} color={colors.textPrimary} />
          <Text style={styles.label} numberOfLines={1}>
            {filter.label}
          </Text>
          <View style={styles.valueRow}>
            <Text style={styles.value} numberOfLines={1}>
              {values[filter.key]}
            </Text>
            <Ionicons name="chevron-down" size={12} color={colors.textSecondary} />
          </View>
        </Pressable>
      ))}

      {active && (
        <FilterPickerModal
          visible={activeFilter !== null}
          title={active.label}
          options={active.options}
          selected={values[active.key]}
          onSelect={(value) => setValues((prev) => ({ ...prev, [active.key]: value }))}
          onClose={() => setActiveFilter(null)}
        />
      )}
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
