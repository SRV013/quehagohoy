import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CATEGORIES } from '../data/categories';
import { colors } from '../theme/colors';
import CategoryIcon from './CategoryIcon';

type CategoryListProps = {
  onSelectCategory?: (query: string) => void;
};

export default function CategoryList({ onSelectCategory }: CategoryListProps) {
  return (
    <View style={styles.container}>
      {CATEGORIES.map((category) => (
        <Pressable
          key={category.key}
          style={styles.item}
          onPress={() => onSelectCategory?.(category.query)}
        >
          <View style={[styles.circle, { backgroundColor: category.bg }]}>
            <CategoryIcon icon={category.icon} color={category.iconColor} />
          </View>
          <Text style={styles.label} numberOfLines={2}>
            {category.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 22,
  },
  item: {
    alignItems: 'center',
    width: 58,
  },
  circle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 6,
    fontSize: 10,
    textAlign: 'center',
    color: colors.textOnDark,
  },
});
