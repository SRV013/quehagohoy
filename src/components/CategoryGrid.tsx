import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CATEGORIES } from '../data/categories';
import { colors } from '../theme/colors';
import CategoryIcon from './CategoryIcon';

type CategoryGridProps = {
  selectedKey: string | null;
  onSelectCategory: (key: string, query: string) => void;
};

export default function CategoryGrid({ selectedKey, onSelectCategory }: CategoryGridProps) {
  return (
    <View style={styles.grid}>
      {CATEGORIES.map((category) => {
        const isSelected = category.key === selectedKey;
        return (
          <Pressable
            key={category.key}
            style={[styles.tile, isSelected && styles.tileSelected]}
            onPress={() => onSelectCategory(category.key, category.query)}
          >
            <View style={[styles.circle, { backgroundColor: category.bg }]}>
              <CategoryIcon icon={category.icon} color={category.iconColor} size={26} />
            </View>
            <Text style={styles.label} numberOfLines={2}>
              {category.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  tile: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 12,
    borderRadius: 18,
    backgroundColor: colors.backgroundSubtle,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  tileSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.backgroundLight,
  },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.textPrimary,
  },
});
