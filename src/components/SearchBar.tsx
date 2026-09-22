import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';

import { colors } from '../theme/colors';

export default function SearchBar() {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={colors.textPrimary} />
      <TextInput
        style={styles.input}
        placeholder="¿Qué te gustaría hacer hoy?"
        placeholderTextColor={colors.textSecondary}
      />
      <Ionicons name="options-outline" size={20} color={colors.textPrimary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    borderRadius: 999,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
});
