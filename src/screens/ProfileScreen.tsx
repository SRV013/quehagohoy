import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, initializing, signOutUser } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  if (initializing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <Ionicons name="person-circle-outline" size={64} color={colors.textSecondary} />
        <Text style={styles.loggedOutTitle}>Todavía no iniciaste sesión</Text>
        <Text style={styles.loggedOutSubtitle}>
          Creá una cuenta para armar tu perfil. El resto de la app funciona igual sin iniciar
          sesión.
        </Text>
        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.primaryButtonText}>Iniciar sesión</Text>
        </Pressable>
      </View>
    );
  }

  const name = user.displayName || 'Sin nombre';
  const initial = name.charAt(0).toUpperCase();

  const handleSignOut = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que querés cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => signOutUser() },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 32 }]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <Text style={styles.name}>{name}</Text>
      {user.email && <Text style={styles.email}>{user.email}</Text>}

      <Pressable style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={18} color={colors.accentPink} />
        <Text style={styles.signOutText}>Cerrar sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  centered: {
    justifyContent: 'center',
  },
  loggedOutTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  loggedOutSubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  primaryButton: {
    marginTop: 24,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: colors.textOnDark,
    fontWeight: '700',
    fontSize: 15,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textOnDark,
  },
  name: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  email: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
  signOutButton: {
    marginTop: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accentPink,
  },
});
