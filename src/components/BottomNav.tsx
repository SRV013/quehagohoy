import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import PromptModal from './PromptModal';

const TAB_ICONS: Record<
  string,
  { icon: keyof typeof Ionicons.glyphMap; activeIcon: keyof typeof Ionicons.glyphMap }
> = {
  Inicio: { icon: 'home-outline', activeIcon: 'home' },
  Explorar: { icon: 'search-outline', activeIcon: 'search' },
  Guardados: { icon: 'heart-outline', activeIcon: 'heart' },
  Perfil: { icon: 'person-outline', activeIcon: 'person' },
};

export default function BottomNav({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmitPrompt = (prompt: string) => {
    setModalVisible(false);
    navigation.navigate('Inicio', { prompt });
  };

  const renderTab = (route: (typeof state.routes)[number], index: number) => {
    const isFocused = state.index === index;
    const config = TAB_ICONS[route.name] ?? TAB_ICONS.Inicio;

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <Pressable key={route.key} style={styles.tab} onPress={onPress}>
        <Ionicons
          name={isFocused ? config.activeIcon : config.icon}
          size={24}
          color={isFocused ? colors.primary : colors.inactive}
        />
        <Text style={[styles.label, isFocused && styles.labelActive]} numberOfLines={1}>
          {route.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <>
      <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {renderTab(state.routes[0], 0)}
        {renderTab(state.routes[1], 1)}

        <Pressable style={styles.tab} onPress={() => setModalVisible(true)} hitSlop={4}>
          <View style={styles.centerButton}>
            <Ionicons name="sparkles" size={24} color={colors.textOnDark} />
          </View>
          <Text style={styles.label} numberOfLines={1}>
            Dame ideas
          </Text>
        </Pressable>

        {renderTab(state.routes[2], 2)}
        {renderTab(state.routes[3], 3)}
      </View>

      <PromptModal
        visible={modalVisible}
        onSubmit={handleSubmitPrompt}
        onClose={() => setModalVisible(false)}
      />
    </>
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
});
