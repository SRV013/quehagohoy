import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';

type TabKey = 'inicio' | 'explorar' | 'plan' | 'guardados' | 'perfil';

const TABS: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'inicio', label: 'Inicio', icon: 'home-outline', activeIcon: 'home' },
  { key: 'explorar', label: 'Explorar', icon: 'search-outline', activeIcon: 'search' },
  { key: 'plan', label: 'Plan personalizado', icon: 'add', activeIcon: 'add' },
  { key: 'guardados', label: 'Guardados', icon: 'heart-outline', activeIcon: 'heart' },
  { key: 'perfil', label: 'Perfil', icon: 'person-outline', activeIcon: 'person' },
];

export default function BottomNav() {
  const [active, setActive] = useState<TabKey>('inicio');
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        const isCenter = tab.key === 'plan';

        if (isCenter) {
          return (
            <Pressable key={tab.key} style={styles.tab} onPress={() => setActive(tab.key)}>
              <View style={styles.centerButton}>
                <Ionicons name={tab.icon} size={28} color={colors.textOnDark} />
              </View>
              <Text style={styles.label} numberOfLines={1}>
                {tab.label}
              </Text>
            </Pressable>
          );
        }

        return (
          <Pressable key={tab.key} style={styles.tab} onPress={() => setActive(tab.key)}>
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={24}
              color={isActive ? colors.primary : colors.inactive}
            />
            <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={1}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSubtle,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    color: colors.inactive,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  centerButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    marginBottom: 4,
  },
});
