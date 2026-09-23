import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { colors } from '../theme/colors';

export type CategoryIconConfig =
  | { family: 'ionicons'; name: keyof typeof Ionicons.glyphMap }
  | { family: 'material'; name: keyof typeof MaterialIcons.glyphMap }
  | { family: 'materialCommunity'; name: keyof typeof MaterialCommunityIcons.glyphMap };

export type Category = {
  key: string;
  label: string;
  query: string;
  bg: string;
  iconColor: string;
  icon: CategoryIconConfig;
};

export const CATEGORIES: Category[] = [
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
