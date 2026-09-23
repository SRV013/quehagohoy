import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

type IconConfig =
  | { family: 'ionicons'; name: keyof typeof Ionicons.glyphMap }
  | { family: 'material'; name: keyof typeof MaterialIcons.glyphMap }
  | { family: 'materialCommunity'; name: keyof typeof MaterialCommunityIcons.glyphMap };

type Category = {
  key: string;
  label: string;
  query: string;
  bg: string;
  iconColor: string;
  icon: IconConfig;
};

const CATEGORIES: Category[] = [
  {
    key: 'comer',
    label: 'Comer y beber',
    query: 'restaurantes y bares',
    bg: colors.category.peach,
    iconColor: '#E8600C',
    icon: { family: 'ionicons', name: 'restaurant-outline' },
  },
  {
    key: 'cine',
    label: 'Cine y series',
    query: 'cines',
    bg: colors.category.lavender,
    iconColor: '#5B21E0',
    icon: { family: 'materialCommunity', name: 'movie-open-outline' },
  },
  {
    key: 'naturaleza',
    label: 'Naturaleza',
    query: 'parques y naturaleza',
    bg: colors.category.sage,
    iconColor: '#0E8A45',
    icon: { family: 'material', name: 'terrain' },
  },
  {
    key: 'deportes',
    label: 'Deportes',
    query: 'lugares para hacer deporte',
    bg: colors.category.sky,
    iconColor: '#0E75E8',
    icon: { family: 'materialCommunity', name: 'run' },
  },
  {
    key: 'cultura',
    label: 'Cultura',
    query: 'museos y teatros',
    bg: colors.category.orchid,
    iconColor: '#D1127A',
    icon: { family: 'ionicons', name: 'ticket-outline' },
  },
  {
    key: 'relax',
    label: 'Relax',
    query: 'spa y relax',
    bg: colors.category.lavender,
    iconColor: '#2E3FB5',
    icon: { family: 'materialCommunity', name: 'spa' },
  },
];

function CategoryIcon({ icon, color }: { icon: IconConfig; color: string }) {
  if (icon.family === 'ionicons') {
    return <Ionicons name={icon.name} size={22} color={color} />;
  }
  if (icon.family === 'material') {
    return <MaterialIcons name={icon.name} size={22} color={color} />;
  }
  return <MaterialCommunityIcons name={icon.name} size={22} color={color} />;
}

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
