import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { CategoryIconConfig } from '../data/categories';

type CategoryIconProps = {
  icon: CategoryIconConfig;
  color: string;
  size?: number;
};

export default function CategoryIcon({ icon, color, size = 22 }: CategoryIconProps) {
  if (icon.family === 'ionicons') {
    return <Ionicons name={icon.name} size={size} color={color} />;
  }
  if (icon.family === 'material') {
    return <MaterialIcons name={icon.name} size={size} color={color} />;
  }
  return <MaterialCommunityIcons name={icon.name} size={size} color={color} />;
}
